const rateLimit = require('express-rate-limit');

// Rate limiter strict pour les endpoints d'authentification
const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minute
    max: 10, // 10 tentatives maximum
    message: {
        success: false,
        message: 'Trop de tentatives de connexion. Veuillez réessayer dans 1 minute.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter pour les endpoints sensibles (admin, modifications)
const strictLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 200,
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
    max: 1000,
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
