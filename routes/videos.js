const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// @route   GET /api/videos
// @desc    Get all videos
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, isPremium } = req.query;

        // Build filter
        const filter = { isPublished: true };
        if (category) filter.category = category;
        if (isPremium !== undefined) filter.isPremium = isPremium === 'true';

        const videos = await Video.find(filter).sort({ order: 1, createdAt: -1 });

        res.json({
            success: true,
            count: videos.length,
            videos,
        });
    } catch (error) {
        console.error('Get videos error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des vidéos',
        });
    }
});

// @route   GET /api/videos/:id
// @desc    Get single video
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Vidéo non trouvée',
            });
        }

        // Increment view count
        video.viewCount += 1;
        await video.save();

        res.json({
            success: true,
            video,
        });
    } catch (error) {
        console.error('Get video error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de la vidéo',
        });
    }
});

// @route   POST /api/videos
// @desc    Create a video
// @access  Private/Admin
router.post('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        const video = await Video.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Vidéo créée avec succès',
            video,
        });
    } catch (error) {
        console.error('Create video error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la vidéo',
            error: error.message,
        });
    }
});

// @route   PUT /api/videos/:id
// @desc    Update a video
// @access  Private/Admin
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const video = await Video.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Vidéo non trouvée',
            });
        }

        res.json({
            success: true,
            message: 'Vidéo mise à jour avec succès',
            video,
        });
    } catch (error) {
        console.error('Update video error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour de la vidéo',
        });
    }
});

// @route   DELETE /api/videos/:id
// @desc    Delete a video
// @access  Private/Admin
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const video = await Video.findByIdAndDelete(req.params.id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Vidéo non trouvée',
            });
        }

        res.json({
            success: true,
            message: 'Vidéo supprimée avec succès',
        });
    } catch (error) {
        console.error('Delete video error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de la vidéo',
        });
    }
});

module.exports = router;
