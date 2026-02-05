const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateTokens, verifyRefreshToken } = require('../utils/tokenUtils');
const { requireAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const auditLog = require('../middleware/auditLog');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
    '/register',
    authLimiter,
    auditLog('USER_REGISTER'),
    [
        body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Le nom doit contenir entre 2 et 50 caractères'),
        body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
        body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères'),
        body('phone').optional().matches(/^(\+216)?[0-9]{8}$/).withMessage('Numéro de téléphone invalide'),
    ],
    async (req, res) => {
        try {
            // Validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Erreurs de validation',
                    errors: errors.array(),
                });
            }

            const { name, email, password, phone } = req.body;

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Un compte avec cet email existe déjà',
                });
            }

            // Create user
            const user = await User.create({
                name,
                email,
                password,
                phone,
            });

            // Generate tokens
            const { accessToken, refreshToken } = generateTokens(user._id);

            // Save refresh token to user
            user.refreshToken = refreshToken;
            await user.save();

            // Return user data and tokens
            res.status(201).json({
                success: true,
                message: 'Compte créé avec succès',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    avatar: user.avatar,
                    role: user.role,
                    isPremium: user.isPremiumActive(),
                    premiumExpiryDate: user.premiumExpiryDate,
                },
                accessToken,
                refreshToken,
            });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la création du compte',
                error: error.message,
            });
        }
    }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
    '/login',
    authLimiter,
    auditLog('USER_LOGIN'),
    [
        body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
        body('password').notEmpty().withMessage('Le mot de passe est requis'),
    ],
    async (req, res) => {
        try {
            // Validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Erreurs de validation',
                    errors: errors.array(),
                });
            }

            const { email, password } = req.body;

            // Find user (include password for comparison)
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Email ou mot de passe incorrect',
                });
            }

            // Check if account is active
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Compte désactivé. Contactez l\'administrateur.',
                });
            }

            // Compare password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Email ou mot de passe incorrect',
                });
            }

            // Generate tokens
            const { accessToken, refreshToken } = generateTokens(user._id);

            // Save refresh token
            user.refreshToken = refreshToken;
            await user.save();

            // Return user data and tokens
            res.json({
                success: true,
                message: 'Connexion réussie',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    avatar: user.avatar,
                    role: user.role,
                    isPremium: user.isPremiumActive(),
                    premiumExpiryDate: user.premiumExpiryDate,
                },
                accessToken,
                refreshToken,
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la connexion',
                error: error.message,
            });
        }
    }
);

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Token de rafraîchissement manquant',
            });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Find user
        const user = await User.findById(decoded.id).select('+refreshToken');
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Token de rafraîchissement invalide',
            });
        }

        // Generate new access token
        const { accessToken } = generateTokens(user._id);

        res.json({
            success: true,
            accessToken,
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({
            success: false,
            message: 'Token de rafraîchissement invalide',
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', requireAuth, auditLog('USER_LOGOUT'), async (req, res) => {
    try {
        // Clear refresh token
        req.user.refreshToken = undefined;
        await req.user.save();

        res.json({
            success: true,
            message: 'Déconnexion réussie',
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la déconnexion',
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', requireAuth, async (req, res) => {
    try {
        res.json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
                avatar: req.user.avatar,
                role: req.user.role,
                isPremium: req.user.isPremiumActive(),
                premiumExpiryDate: req.user.premiumExpiryDate,
            },
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du profil',
        });
    }
});

const passport = require('passport');

// @route   GET /api/auth/google
// @desc    Auth with Google
// @access  Public
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET /api/auth/google/callback
// @desc    Google auth callback
// @access  Public
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(req.user._id);

        // Redirect to frontend (handling callback)
        const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173');
        res.redirect(`${frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    }
);

module.exports = router;
