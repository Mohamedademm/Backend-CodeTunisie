const rateLimit = require('express-rate-limit');

// Rate limiter strict pour les endpoints d'authentification
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentatives maximum
    message: {
        success: false,
        message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter pour les endpoints sensibles (admin, modifications)
const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: 'Trop de requêtes. Veuillez réessayer plus tard.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter général pour l'API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Trop de requêtes depuis cette IP. Veuillez réessayer plus tard.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    authLimiter,
    strictLimiter,
    apiLimiter
};
