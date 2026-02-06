const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Le titre est requis'],
            trim: true,
            maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères'],
        },
        description: {
            type: String,
            required: [true, 'La description est requise'],
            maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
        },
        content: {
            type: String,
            required: [true, 'Le contenu est requis'],
        },
        category: {
            type: String,
            required: [true, 'La catégorie est requise'],
            enum: {
                values: ['signalisation', 'regles', 'priorites', 'infractions', 'securite', 'mecanique', 'conduite', 'conseils', 'general', 'poids-lourd'],
                message: 'Catégorie invalide',
            },
        },
        difficulty: {
            type: String,
            enum: ['facile', 'moyen', 'difficile'],
            default: 'facile',
        },
        duration: {
            type: String, // e.g., "2h 30min"
            default: "1h",
        },
        lessons: {
            type: Number,
            default: 1,
        },
        icon: {
            type: String,
            default: 'book-open' // Lucide icon name
        },
        isPremium: {
            type: Boolean,
            default: false,
        },
        images: [{
            type: String, // URL of image
        }],
        order: {
            type: Number, // For ordering courses
            default: 0,
        },
        viewCount: {
            type: Number,
            default: 0,
        },
        completionCount: {
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
courseSchema.index({ title: 'text', description: 'text' });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
