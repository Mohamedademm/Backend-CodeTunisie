const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Course = require('../models/Course');
const Video = require('../models/Video');
const Test = require('../models/Test');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Configure multer for question image uploads
const questionImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/questions');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'question-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const questionImageUpload = multer({
    storage: questionImageStorage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB max
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Seules les images (JPEG, PNG, WebP) sont autorisées'));
        }
    }
});

// Middleware to ensure all routes in this file require admin access
// If requireAdmin is not exported from auth.js, we will define it inline or update auth.js
// Based on typical patterns, let's assume valid auth middleware usage.
router.use(requireAuth);
router.use(requireAdmin);

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Admin
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const premiumUsers = await User.countDocuments({ isPremium: true });
        const totalCourses = await Course.countDocuments();
        const totalVideos = await Video.countDocuments();
        const totalTests = await Test.countDocuments();

        // Mock revenue for now as Payment model might not have data yet
        const totalRevenue = premiumUsers * 40; // Assuming 40 DT per user as rough estimate

        // Get recent 5 users
        const recentUsers = await User.find()
            .select('-password -refreshToken')
            .sort({ createdAt: -1 })
            .limit(5);

        // Simple growth data (mock for now as we might not have historical tracking yet)
        const userGrowth = [
            { date: 'Jan', count: Math.floor(totalUsers * 0.5) },
            { date: 'Feb', count: Math.floor(totalUsers * 0.6) },
            { date: 'Mar', count: Math.floor(totalUsers * 0.8) },
            { date: 'Apr', count: totalUsers },
        ];

        const revenueGrowth = [
            { date: 'Jan', amount: Math.floor(totalRevenue * 0.5) },
            { date: 'Feb', amount: Math.floor(totalRevenue * 0.6) },
            { date: 'Mar', amount: Math.floor(totalRevenue * 0.8) },
            { date: 'Apr', amount: totalRevenue },
        ];

        res.json({
            success: true,
            stats: {
                totalUsers,
                premiumUsers,
                totalCourses,
                totalVideos,
                totalTests,
                totalQuestions: 0, // Placeholder
                totalRevenue,
                recentUsers,
                userGrowth,
                revenueGrowth
            }
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// @route   GET /api/admin/users
// @desc    Get all users with filtering
// @access  Admin
router.get('/users', async (req, res) => {
    try {
        const { search, role, isPremium } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (role) query.role = role;
        if (isPremium) query.isPremium = isPremium === 'true';

        const users = await User.find(query)
            .select('-password -refreshToken')
            .sort({ createdAt: -1 });

        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// @route   POST /api/admin/users
// @desc    Create a new user
// @access  Admin
router.post('/users', async (req, res) => {
    try {
        const { name, email, password, role, isPremium } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'Un utilisateur avec cet email existe déjà' });
        }

        user = new User({
            name,
            email,
            password,
            role: role || 'user',
            isPremium: isPremium || false
        });

        await user.save();

        // Convert to object and remove sensitive data
        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.refreshToken;

        res.status(201).json({ success: true, user: userObj });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la création de l\'utilisateur' });
    }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user (role, premium status)
// @access  Admin
router.put('/users/:id', async (req, res) => {
    try {
        const { role, isPremium } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role, isPremium },
            { new: true }
        ).select('-password -refreshToken');

        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Admin
router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Utilisateur supprimé' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// @route   GET /api/admin/courses
// @desc    Get all courses for admin
// @access  Admin
router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// @route   DELETE /api/admin/courses/:id
// @desc    Delete course
// @access  Admin
router.delete('/courses/:id', async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Cours supprimé' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// @route   GET /api/admin/videos
// @desc    Get all videos
// @access  Admin
router.get('/videos', async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.json({ success: true, videos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// @route   DELETE /api/admin/videos/:id
// @desc    Delete video
// @access  Admin
router.delete('/videos/:id', async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Vidéo supprimée' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// @route   GET /api/admin/payments
// @desc    Get all payments
// @access  Admin
router.get('/payments', async (req, res) => {
    try {
        const Payment = require('../models/Payment');
        const payments = await Payment.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// Mock Settings (In-memory for now, could be moved to DB later)
let siteSettings = {
    siteName: 'CodeTunisiePro',
    maintenanceMode: false,
    registrationOpen: true,
    contactEmail: 'contact@codetunisiepro.com',
    themeColor: '#3b82f6'
};

// @route   GET /api/admin/settings
// @desc    Get site settings
// @access  Admin
router.get('/settings', (req, res) => {
    res.json({ success: true, settings: siteSettings });
});

// @route   PUT /api/admin/settings
// @desc    Update site settings
// @access  Admin
router.put('/settings', (req, res) => {
    siteSettings = { ...siteSettings, ...req.body };
    res.json({ success: true, settings: siteSettings });
});

// @route   POST /api/admin/upload-question-image
// @desc    Upload image for a question
// @access  Admin
router.post('/upload-question-image', questionImageUpload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucune image fournie'
            });
        }

        // Construct the URL for the uploaded image
        const imageUrl = `/uploads/questions/${req.file.filename}`;

        res.json({
            success: true,
            message: 'Image uploadée avec succès',
            data: {
                url: imageUrl,
                filename: req.file.filename,
                size: req.file.size,
                uploadedAt: new Date()
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload de l\'image',
            error: error.message
        });
    }
});

// @route   DELETE /api/admin/delete-question-image/:filename
// @desc    Delete a question image
// @access  Admin
router.delete('/delete-question-image/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../uploads/questions', filename);

        // Check if file exists
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({
                success: true,
                message: 'Image supprimée avec succès'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Image non trouvée'
            });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'image',
            error: error.message
        });
    }
});

module.exports = router;
