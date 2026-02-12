const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// --- Multer configuration for video uploads ---
const videoUploadDir = path.join(__dirname, '..', 'uploads', 'videos');

// Ensure the upload directory exists
if (!fs.existsSync(videoUploadDir)) {
    fs.mkdirSync(videoUploadDir, { recursive: true });
}

const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, videoUploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `video-${uniqueSuffix}${ext}`);
    },
});

const videoFileFilter = (req, file, cb) => {
    const allowedMimes = [
        'video/mp4',
        'video/avi',
        'video/x-msvideo',
        'video/mov',
        'video/quicktime',
        'video/webm',
        'video/x-matroska',
        'video/mkv',
        'video/mpeg',
        'video/ogg',
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Type de fichier non supporté: ${file.mimetype}. Formats acceptés: MP4, AVI, MOV, WebM, MKV, MPEG, OGG`), false);
    }
};

const videoUpload = multer({
    storage: videoStorage,
    fileFilter: videoFileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB
    },
});

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
// @desc    Create a video (URL or file upload)
// @access  Private/Admin
router.post('/', requireAuth, requireAdmin, videoUpload.single('videoFile'), async (req, res) => {
    try {
        const { title, description, videoUrl, thumbnail, category, duration, isPremium } = req.body;

        let videoData = {
            title,
            description: description || '',
            thumbnail: thumbnail || '',
            category,
            duration: duration || '',
            isPremium: isPremium === 'true' || isPremium === true,
        };

        if (req.file) {
            // File was uploaded
            videoData.videoType = 'upload';
            videoData.videoUrl = `/uploads/videos/${req.file.filename}`;
        } else if (videoUrl) {
            // URL provided
            videoData.videoType = 'url';
            videoData.videoUrl = videoUrl;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir une URL ou uploader un fichier vidéo',
            });
        }

        const video = await Video.create(videoData);

        res.status(201).json({
            success: true,
            message: 'Vidéo créée avec succès',
            video,
        });
    } catch (error) {
        console.error('Create video error:', error);
        // If there was an uploaded file and an error occurred, clean it up
        if (req.file) {
            const filePath = path.join(videoUploadDir, req.file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
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
router.put('/:id', requireAuth, requireAdmin, videoUpload.single('videoFile'), async (req, res) => {
    try {
        const existingVideo = await Video.findById(req.params.id);
        if (!existingVideo) {
            return res.status(404).json({
                success: false,
                message: 'Vidéo non trouvée',
            });
        }

        const updateData = { ...req.body };
        if (updateData.isPremium !== undefined) {
            updateData.isPremium = updateData.isPremium === 'true' || updateData.isPremium === true;
        }

        if (req.file) {
            // New file uploaded — delete old file if it was an upload
            if (existingVideo.videoType === 'upload' && existingVideo.videoUrl) {
                const oldFilePath = path.join(__dirname, '..', existingVideo.videoUrl);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
            updateData.videoType = 'upload';
            updateData.videoUrl = `/uploads/videos/${req.file.filename}`;
        } else if (updateData.videoUrl && updateData.videoUrl !== existingVideo.videoUrl) {
            // URL changed — delete old file if it was an upload
            if (existingVideo.videoType === 'upload' && existingVideo.videoUrl) {
                const oldFilePath = path.join(__dirname, '..', existingVideo.videoUrl);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
            updateData.videoType = 'url';
        }

        const video = await Video.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

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
// @desc    Delete a video (and its file if uploaded)
// @access  Private/Admin
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Vidéo non trouvée',
            });
        }

        // Delete the physical file if it was an upload
        if (video.videoType === 'upload' && video.videoUrl) {
            const filePath = path.join(__dirname, '..', video.videoUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`🗑️ Deleted video file: ${filePath}`);
            }
        }

        await Video.findByIdAndDelete(req.params.id);

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

// Multer error handling middleware
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Le fichier est trop volumineux. Taille maximale : 100 MB',
            });
        }
        return res.status(400).json({
            success: false,
            message: `Erreur d'upload : ${err.message}`,
        });
    }
    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    next();
});

module.exports = router;
