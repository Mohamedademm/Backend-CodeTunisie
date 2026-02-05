const mongoose = require('mongoose');

const testAttemptSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        test: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Test',
            required: true,
        },
        answers: [{
            question: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Question',
                required: true,
            },
            selectedAnswer: {
                type: Number,
                required: true,
            },
            isCorrect: {
                type: Boolean,
                required: true,
            },
        }],
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        passed: {
            type: Boolean,
            required: true,
        },
        timeTaken: {
            type: Number, // in seconds
            required: true,
        },
        completedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Index for user's test history
testAttemptSchema.index({ user: 1, createdAt: -1 });

const TestAttempt = mongoose.model('TestAttempt', testAttemptSchema);

module.exports = TestAttempt;
