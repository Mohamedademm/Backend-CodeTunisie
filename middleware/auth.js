const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const verifyToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Accès non autorisé. Token manquant.',
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // Get user from token
        const user = await User.findById(decoded.id).select('-password -refreshToken');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non trouvé.',
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Compte désactivé.',
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token invalide.',
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expiré.',
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la vérification du token.',
        });
    }
};

// Require authentication
const requireAuth = verifyToken;

// Require admin role
const requireAdmin = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentification requise.',
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Accès refusé. Droits administrateur requis.',
        });
    }

    next();
};

// Require premium subscription
const requirePremium = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentification requise.',
        });
    }

    if (!req.user.isPremiumActive()) {
        return res.status(403).json({
            success: false,
            message: 'Abonnement Premium requis.',
            isPremium: false,
        });
    }

    next();
};

module.exports = {
    verifyToken,
    requireAuth,
    requireAdmin,
    requirePremium,
};
