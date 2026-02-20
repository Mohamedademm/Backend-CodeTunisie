const express = require('express');
const router = express.Router();
const User = require('../models/User');
const TestAttempt = require('../models/TestAttempt');
const { requireAuth } = require('../middleware/auth');
const { storage, cloudinary } = require('../config/cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { calcXpEarned, calcLevel, getLevelTitle, updateStreak, checkAndAwardBadges, XP_PER_LEVEL } = require('../utils/gamification');

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
        }
    }
});

router.get('/profile', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('coursesCompleted', 'title category')
            .select('-password -refreshToken');

        const testAttempts = await TestAttempt.find({ user: req.user._id })
            .populate('test', 'title category')
            .sort({ createdAt: -1 })
            .limit(10);

        const totalTests = testAttempts.length;
        const passedTests = testAttempts.filter(attempt => attempt.passed).length;
        const averageScore = totalTests > 0
            ? testAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalTests
            : 0;

        res.json({
            success: true,
            user,
            stats: {
                coursesCompleted: user.coursesCompleted.length,
                totalTests,
                passedTests,
                averageScore: averageScore.toFixed(2),
            },
            recentAttempts: testAttempts,
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du profil',
        });
    }
});

router.put('/profile', requireAuth, async (req, res) => {
    try {
        const { name, phone, avatar } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (avatar) updateData.avatar = avatar;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password -refreshToken');

        res.json({
            success: true,
            message: 'Profil mis à jour avec succès',
            user,
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du profil',
        });
    }
});

router.post('/avatar', requireAuth, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        const user = await User.findById(req.user._id);
        if (user.avatar) {
            if (user.avatar.includes('cloudinary')) {
                const splitUrl = user.avatar.split('/');
                const filename = splitUrl[splitUrl.length - 1];
                const publicId = 'codetunisiepro/' + filename.split('.')[0];
                try {
                    await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                    console.error('Failed to delete old Cloudinary avatar:', err);
                }
            }
            else if (user.avatar.startsWith('/uploads/')) {
                const oldAvatarPath = path.join(__dirname, '..', user.avatar);
                if (fs.existsSync(oldAvatarPath)) {
                    try {
                        fs.unlinkSync(oldAvatarPath);
                    } catch (err) {
                        console.error('Failed to delete old local avatar:', err);
                    }
                }
            }
        }

        const avatarUrl = req.file.path;
        user.avatar = avatarUrl;
        await user.save();

        res.json({
            success: true,
            message: 'Avatar mis à jour avec succès',
            avatarUrl,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                isPremium: user.isPremium,
                coursesCompleted: user.coursesCompleted,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.error('Upload avatar error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de l\'upload de l\'avatar'
        });
    }
});

// Helper: update streak and award badges are now imported from ../utils/gamification

router.get('/progress', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('coursesCompleted')
            .populate({
                path: 'testsAttempted',
                populate: { path: 'test', select: 'title category' },
            });

        const testsByCategory = {};
        for (const attempt of user.testsAttempted) {
            if (!attempt.test) continue;
            const category = attempt.test.category;
            if (!testsByCategory[category]) {
                testsByCategory[category] = { total: 0, passed: 0, averageScore: 0, scores: [] };
            }
            testsByCategory[category].total++;
            if (attempt.passed) testsByCategory[category].passed++;
            testsByCategory[category].scores.push(attempt.score);
        }

        Object.keys(testsByCategory).forEach(category => {
            const scores = testsByCategory[category].scores;
            testsByCategory[category].averageScore =
                scores.reduce((sum, score) => sum + score, 0) / scores.length;
        });

        res.json({
            success: true,
            progress: {
                coursesCompleted: user.coursesCompleted,
                testsByCategory,
                totalCoursesCompleted: user.coursesCompleted.length,
                totalTestsAttempted: user.testsAttempted.length,
            },
        });
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération de la progression' });
    }
});

// @route   GET /api/users/dashboard
// @desc    Get full dashboard data (real-time)
// @access  Private
router.get('/dashboard', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('coursesCompleted', 'title category progress')
            .select('-password -refreshToken');

        const testAttempts = await TestAttempt.find({ user: req.user._id })
            .populate('test', 'title category')
            .sort({ createdAt: -1 });

        // Weekly activity (last 7 days of test attempts)
        const weeklyActivity = [];
        const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
            const count = testAttempts.filter(a => {
                const at = new Date(a.completedAt || a.createdAt);
                return at >= dayStart && at < dayEnd;
            }).length;
            weeklyActivity.push({ day: dayNames[d.getDay()], tests: count });
        }

        // Category progress from test scores
        const categoryScores = {};
        for (const attempt of testAttempts) {
            if (!attempt.test) continue;
            const cat = attempt.test.category || 'Autre';
            if (!categoryScores[cat]) categoryScores[cat] = { total: 0, sum: 0 };
            categoryScores[cat].total++;
            categoryScores[cat].sum += attempt.score;
        }
        const categoryProgress = Object.entries(categoryScores).map(([name, data]) => ({
            name,
            value: Math.round(data.sum / data.total),
        }));

        // Course distribution
        const totalCourses = user.coursesCompleted.length;
        const completedCourses = user.coursesCompleted.filter(c => (c.progress || 0) >= 100).length;
        const inProgressCourses = user.coursesCompleted.filter(c => (c.progress || 0) > 0 && (c.progress || 0) < 100).length;

        const passedTests = testAttempts.filter(a => a.passed).length;

        // XP = 50 per passed test + 10 per test attempted
        const calculatedXP = (passedTests * 50) + (testAttempts.length * 10);
        const calculatedLevel = Math.floor(calculatedXP / 200) + 1;
        const xpForNextLevel = calculatedLevel * 200;
        const xpProgress = Math.round(((calculatedXP % 200) / 200) * 100);

        // Update user XP/level/streak if changed
        await updateStreak(user);
        user.xp = calculatedXP;
        user.level = calculatedLevel;
        // Award badges
        const newBadges = checkAndAwardBadges(user, testAttempts);
        await user.save();

        res.json({
            success: true,
            dashboard: {
                user: {
                    _id: user._id,
                    name: user.name,
                    avatar: user.avatar,
                    isPremium: user.isPremium,
                    xp: calculatedXP,
                    level: calculatedLevel,
                    xpForNextLevel,
                    xpProgress,
                    streak: user.streak || 0,
                    lastActivityDate: user.lastActivityDate,
                    badges: user.badges,
                },
                stats: {
                    totalTests: testAttempts.length,
                    passedTests,
                    failedTests: testAttempts.length - passedTests,
                    averageScore: testAttempts.length > 0
                        ? Math.round(testAttempts.reduce((s, a) => s + a.score, 0) / testAttempts.length)
                        : 0,
                    coursesCompleted: completedCourses,
                    coursesInProgress: inProgressCourses,
                    totalCourses,
                },
                weeklyActivity,
                categoryProgress,
                recentAttempts: testAttempts.slice(0, 5),
                newBadges,
            },
        });
    } catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération du tableau de bord' });
    }
});

// @route   GET /api/users/incorrect-answers
// @desc    Get all incorrectly answered questions across all test attempts
// @access  Private
router.get('/incorrect-answers', requireAuth, async (req, res) => {
    try {
        const attempts = await TestAttempt.find({ user: req.user._id })
            .populate({
                path: 'answers.question',
                select: 'question options correctAnswer explanation image category',
            })
            .populate('test', 'title category')
            .sort({ createdAt: -1 });

        // Collect unique incorrect questions (by question ID), keep most recent
        const seen = new Set();
        const incorrectQuestions = [];
        for (const attempt of attempts) {
            for (const answer of attempt.answers) {
                if (!answer.isCorrect && answer.question && !seen.has(answer.question._id?.toString())) {
                    seen.add(answer.question._id?.toString());
                    incorrectQuestions.push({
                        question: answer.question,
                        selectedAnswer: answer.selectedAnswer,
                        testTitle: attempt.test?.title || 'Test',
                        testCategory: attempt.test?.category || 'Général',
                        attemptDate: attempt.completedAt || attempt.createdAt,
                    });
                }
            }
        }

        res.json({
            success: true,
            count: incorrectQuestions.length,
            incorrectQuestions,
        });
    } catch (error) {
        console.error('Get incorrect answers error:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des questions incorrectes' });
    }
});


router.put('/change-password', requireAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir le mot de passe actuel et le nouveau mot de passe',
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Le nouveau mot de passe doit contenir au moins 6 caractères',
            });
        }

        const user = await User.findById(req.user._id).select('+password');

        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Mot de passe actuel incorrect',
            });
        }

        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Mot de passe modifié avec succès',
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du changement de mot de passe',
        });
    }
});

module.exports = router;
