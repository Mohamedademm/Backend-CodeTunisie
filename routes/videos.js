const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { storage, cloudinary } = require('../config/cloudinary');

const deleteFromCloudinary = async (url, resourceType = 'video') => {
    if (!url || !url.includes('cloudinary')) return;
    try {
        const splitUrl = url.split('/');
        const filenameWithExt = splitUrl[splitUrl.length - 1];
        const folder = splitUrl[splitUrl.length - 2];
        const filename = filenameWithExt.split('.')[0];
        const publicId = `${folder}/${filename}`;

        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
    }
};

const deleteLocalFile = (url) => {
    if (!url || !url.startsWith('/uploads/')) return;
    const filePath = path.join(__dirname, '..', url);
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
        } catch (err) {
            console.error('Error deleting local file:', err);
        }
    }
};

const videoUpload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'video/mp4', 'video/avi', 'video/x-msvideo', 'video/mov',
            'video/quicktime', 'video/webm', 'video/x-matroska',
            'video/mkv', 'video/mpeg', 'video/ogg'
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Type de fichier non supporté: ${file.mimetype}. Formats acceptés: MP4, AVI, MOV, WebM, MKV, MPEG, OGG`), false);
        }
    },
    limits: {
        fileSize: 100 * 1024 * 1024,
    },
});

router.get('/', async (req, res) => {
    try {
        const { category, isPremium } = req.query;

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

router.get('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Vidéo non trouvée',
            });
        }

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
            videoData.videoType = 'upload';
            videoData.videoUrl = req.file.path;

            if (!videoData.thumbnail) {
                videoData.thumbnail = req.file.path.replace(/\.[^/.]+$/, ".jpg");
            }
        } else if (videoUrl) {
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
        if (req.file && req.file.filename) {
            await cloudinary.uploader.destroy(req.file.filename, { resource_type: 'video' });
        }
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la vidéo',
            error: error.message,
        });
    }
});

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
            if (existingVideo.videoType === 'upload' && existingVideo.videoUrl) {
                await deleteFromCloudinary(existingVideo.videoUrl, 'video');
                deleteLocalFile(existingVideo.videoUrl);
            }
            updateData.videoType = 'upload';
            updateData.videoUrl = req.file.path;
        } else if (updateData.videoUrl && updateData.videoUrl !== existingVideo.videoUrl) {
            if (existingVideo.videoType === 'upload' && existingVideo.videoUrl) {
                await deleteFromCloudinary(existingVideo.videoUrl, 'video');
                deleteLocalFile(existingVideo.videoUrl);
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

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Vidéo non trouvée',
            });
        }

        if (video.videoType === 'upload' && video.videoUrl) {
            await deleteFromCloudinary(video.videoUrl, 'video');
            deleteLocalFile(video.videoUrl);
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
