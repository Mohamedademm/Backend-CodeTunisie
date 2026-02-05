// Error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: 'Erreur de validation',
            errors,
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            message: `${field} existe déjà`,
        });
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'ID invalide',
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Token invalide',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expiré',
        });
    }

    // Default error
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Erreur serveur',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

// Not found handler
const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route non trouvée: ${req.originalUrl}`,
    });
};

module.exports = {
    errorHandler,
    notFound,
};
