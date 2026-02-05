const mongoose = require('mongoose');

const testSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Le titre est requis'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'La description est requise'],
        },
        questions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true,
        }],
        category: {
            type: String,
            enum: ['signalisation', 'regles', 'priorites', 'infractions', 'securite', 'mecanique', 'conduite', 'general'],
            default: 'general',
        },
        difficulty: {
            type: String,
            enum: ['facile', 'moyen', 'difficile'],
            default: 'moyen',
        },
        duration: {
            type: Number, // in minutes
            required: [true, 'La durée est requise'],
            default: 30,
        },
        passThreshold: {
            type: Number, // percentage to pass
            default: 70,
            min: 0,
            max: 100,
        },
        isPremium: {
            type: Boolean,
            default: false,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
        // Statistics
        attemptCount: {
            type: Number,
            default: 0,
        },
        passCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for performance optimization
testSchema.index({ category: 1 });
testSchema.index({ difficulty: 1 });
testSchema.index({ isPremium: 1 });
testSchema.index({ isPublished: 1 });
testSchema.index({ createdAt: -1 });
testSchema.index({ category: 1, difficulty: 1 }); // Compound index for filtering

// Virtual for pass rate
testSchema.virtual('passRate').get(function () {
    if (this.attemptCount === 0) return 0;
    return ((this.passCount / this.attemptCount) * 100).toFixed(2);
});

// Virtual for question count
testSchema.virtual('questionCount').get(function () {
    return this.questions ? this.questions.length : 0;
});

testSchema.set('toJSON', { virtuals: true });
testSchema.set('toObject', { virtuals: true });

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
