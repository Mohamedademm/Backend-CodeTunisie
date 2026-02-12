const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, 'La question est requise'],
            trim: true,
        },
        options: {
            type: [String],
            required: [true, 'Les options sont requises'],
            validate: {
                validator: function (v) {
                    return v.length >= 2 && v.length <= 4;
                },
                message: 'Il doit y avoir entre 2 et 4 options',
            },
        },
        correctAnswer: {
            type: Number,
            required: [true, 'La réponse correcte est requise'],
            min: 0,
            max: 3,
            validate: {
                validator: function (v) {
                    // For findByIdAndUpdate, this.options might not be available
                    // In that case, validate that v is in valid range (0-3)
                    if (this.options && Array.isArray(this.options)) {
                        return v >= 0 && v < this.options.length;
                    }
                    // Fallback: accept 0-3 for update operations
                    return v >= 0 && v <= 3;
                },
                message: 'L\'index de la réponse correcte est invalide',
            },
        },
        explanation: {
            type: String,
            required: [true, 'L\'explication est requise'],
        },
        image: {
            url: {
                type: String,
                default: '',
            },
            filename: {
                type: String,
                default: '',
            },
            size: {
                type: Number,
                default: 0,
            },
            uploadedAt: {
                type: Date,
            },
        },
        category: {
            type: String,
            required: [true, 'La catégorie est requise'],
            enum: ['signalisation', 'regles', 'priorites', 'infractions', 'securite', 'mecanique', 'conduite', 'poids-lourd'],
        },
        difficulty: {
            type: String,
            enum: ['facile', 'moyen', 'difficile'],
            default: 'moyen',
        },
        // Statistics
        timesAsked: {
            type: Number,
            default: 0,
        },
        timesCorrect: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Virtual for success rate
questionSchema.virtual('successRate').get(function () {
    if (this.timesAsked === 0) return 0;
    return ((this.timesCorrect / this.timesAsked) * 100).toFixed(2);
});

questionSchema.set('toJSON', { virtuals: true });
questionSchema.set('toObject', { virtuals: true });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
