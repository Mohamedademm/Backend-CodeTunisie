const AuditLog = require('../models/AuditLog');

/**
 * Middleware pour logger les actions sensibles (admin, modifications importantes)
 */
const auditLog = (action) => {
    return async (req, res, next) => {
        const originalSend = res.send;

        res.send = function (data) {
            // Logger seulement si la requête est réussie (status 2xx)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const logEntry = {
                    user: req.user ? req.user._id : null,
                    action: action,
                    method: req.method,
                    path: req.originalUrl,
                    ip: req.ip || req.connection.remoteAddress,
                    userAgent: req.get('user-agent'),
                    timestamp: new Date(),
                    details: {
                        body: req.body,
                        params: req.params,
                        query: req.query
                    }
                };

                // Sauvegarder de manière asynchrone sans bloquer la réponse
                AuditLog.create(logEntry).catch(err => {
                    console.error('Erreur lors de la sauvegarde du log d\'audit:', err);
                });
            }

            originalSend.call(this, data);
        };

        next();
    };
};

module.exports = auditLog;
