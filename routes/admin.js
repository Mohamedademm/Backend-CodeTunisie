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
const { storage, cloudinary } = require('../config/cloudinary');

const questionImageUpload = multer({ storage });

router.use(requireAuth);
router.use(requireAdmin);

router.post('/upload-question-image', questionImageUpload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucune image fournie'
            });
        }

        res.json({
            success: true,
            message: 'Image uploadée avec succès',
            data: {
                url: req.file.path,
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

router.delete('/delete-question-image/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        const publicId = decodeURIComponent(filename);

        await cloudinary.uploader.destroy(publicId);

        res.json({
            success: true,
            message: 'Image supprimée avec succès (Cloudinary)'
        });

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'image',
            error: error.message
        });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const premiumUsers = await User.countDocuments({ isPremium: true });
        const totalCourses = await Course.countDocuments();
        const totalVideos = await Video.countDocuments();
        const totalTests = await Test.countDocuments();

        const totalRevenue = premiumUsers * 40;

        const recentUsers = await User.find()
            .select('-password -refreshToken')
            .sort({ createdAt: -1 })
            .limit(5);

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
                totalQuestions: 0,
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

router.post('/users', async (req, res) => {
    try {
        const { name, email, password, role, isPremium } = req.body;

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

        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.refreshToken;

        res.status(201).json({ success: true, user: userObj });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la création de l\'utilisateur' });
    }
});

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

router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Utilisateur supprimé' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

router.delete('/courses/:id', async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Cours supprimé' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

router.get('/videos', async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.json({ success: true, videos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

router.delete('/videos/:id', async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Vidéo supprimée' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

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

let siteSettings = {
    siteName: 'CodeTunisiePro',
    maintenanceMode: false,
    registrationOpen: true,
    contactEmail: 'contact@codetunisiepro.com',
    themeColor: '#3b82f6'
};

router.get('/settings', (req, res) => {
    res.json({ success: true, settings: siteSettings });
});

router.put('/settings', (req, res) => {
    siteSettings = { ...siteSettings, ...req.body };
    res.json({ success: true, settings: siteSettings });
});

module.exports = router;
