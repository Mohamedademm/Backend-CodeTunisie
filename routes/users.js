const express = require('express');
const router = express.Router();
const User = require('../models/User');
const TestAttempt = require('../models/TestAttempt');
const { requireAuth } = require('../middleware/auth');

// @route   GET /api/users/profile
// @desc    Get user profile with progress
// @access  Private
router.get('/profile', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('coursesCompleted', 'title category')
            .select('-password -refreshToken');

        // Get test statistics
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

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
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

// Configure Multer for avatar uploads
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + req.user._id + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: fileFilter
});

// @route   POST /api/users/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/avatar', requireAuth, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        // Delete old avatar if exists
        const user = await User.findById(req.user._id);
        if (user.avatar && user.avatar.startsWith('/uploads/')) {
            const oldAvatarPath = path.join(__dirname, '..', user.avatar);
            if (fs.existsSync(oldAvatarPath)) {
                fs.unlinkSync(oldAvatarPath);
            }
        }

        // Update user with new avatar path
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
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

// @route   GET /api/users/progress
// @desc    Get detailed user progress
// @access  Private
router.get('/progress', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('coursesCompleted')
            .populate({
                path: 'testsAttempted',
                populate: { path: 'test', select: 'title category' },
            });

        // Calculate progress by category
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

        // Calculate average scores
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

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', requireAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate input
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

        // Get user with password
        const user = await User.findById(req.user._id).select('+password');

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Mot de passe actuel incorrect',
            });
        }

        // Update password
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
