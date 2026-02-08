const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Le nom est requis'],
            trim: true,
            minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
            maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères'],
        },
        email: {
            type: String,
            required: [true, 'L\'email est requis'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Veuillez fournir un email valide',
            ],
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId; // Password required only if not Google OAuth
            },
            minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
            select: false, // Don't return password by default
        },
        phone: {
            type: String,
            trim: true,
            match: [/^(\+216)?[0-9]{8}$/, 'Numéro de téléphone invalide'],
        },
        avatar: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        isPremium: {
            type: Boolean,
            default: false,
        },
        premiumExpiryDate: {
            type: Date,
        },
        googleId: {
            type: String,
            sparse: true, // Allows multiple null values
        },
        // Progress tracking
        coursesCompleted: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
        }],
        testsAttempted: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TestAttempt',
        }],
        // Refresh token for JWT
        refreshToken: {
            type: String,
            select: false,
        },
        // Password reset
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        // Account status
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

// Indexes for performance optimization
// Indexes for performance optimization
userSchema.index({ role: 1 });
userSchema.index({ isPremium: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ resetPasswordToken: 1 }, { sparse: true });

// Hash password before saving
userSchema.pre('save', async function () {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Erreur lors de la comparaison du mot de passe');
    }
};

// Method to check if premium is active
userSchema.methods.isPremiumActive = function () {
    if (!this.isPremium) return false;
    if (!this.premiumExpiryDate) return true; // Lifetime premium
    return this.premiumExpiryDate > new Date();
};

// Virtual for user's full profile
userSchema.virtual('profile').get(function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        phone: this.phone,
        avatar: this.avatar,
        role: this.role,
        isPremium: this.isPremiumActive(),
        premiumExpiryDate: this.premiumExpiryDate,
    };
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
