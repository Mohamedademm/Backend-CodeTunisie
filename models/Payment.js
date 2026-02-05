const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: [true, 'Le montant est requis'],
            min: 0,
        },
        currency: {
            type: String,
            default: 'TND', // Tunisian Dinar
        },
        paymentMethod: {
            type: String,
            enum: ['card', 'd17', 'other'],
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
        premiumDuration: {
            type: Number, // in months
            required: true,
            enum: [1, 3, 12], // 1 month, 3 months, 1 year
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed, // Additional payment gateway data
        },
    },
    {
        timestamps: true,
    }
);

// Index for user payment history
paymentSchema.index({ user: 1, createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
