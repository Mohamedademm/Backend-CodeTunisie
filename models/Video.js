const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Le titre est requis'],
            trim: true,
            maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères'],
        },
        description: {
            type: String,
            maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
            default: '',
        },
        videoUrl: {
            type: String,
            required: [true, "L'URL de la vidéo est requise"],
        },
        videoType: {
            type: String,
            enum: ['url', 'upload'],
            default: 'url',
        },
        thumbnail: {
            type: String,
            default: '',
        },
        category: {
            type: String,
            required: [true, 'La catégorie est requise'],
            enum: ['signalisation', 'regles', 'priorites', 'infractions', 'securite', 'conseils'],
        },
        duration: {
            type: String, // e.g., "10:30"
            default: '',
        },
        isPremium: {
            type: Boolean,
            default: false,
        },
        // Statistics
        viewCount: {
            type: Number,
            default: 0,
        },
        order: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for search
videoSchema.index({ title: 'text', description: 'text' });

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
