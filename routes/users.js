const express = require('express');
const router = express.Router();
const User = require('../models/User');
const TestAttempt = require('../models/TestAttempt');
const { requireAuth } = require('../middleware/auth');
const { storage, cloudinary } = require('../config/cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
            const category = attempt.test.category;
            if (!testsByCategory[category]) {
                testsByCategory[category] = {
                    total: 0,
                    passed: 0,
                    averageScore: 0,
                    scores: [],
                };
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
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de la progression',
        });
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
