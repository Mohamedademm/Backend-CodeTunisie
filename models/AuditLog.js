const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    action: {
        type: String,
        required: true,
        enum: [
            'USER_LOGIN',
            'USER_REGISTER',
            'USER_LOGOUT',
            'USER_UPDATE',
            'USER_DELETE',
            'ADMIN_CREATE_TEST',
            'ADMIN_UPDATE_TEST',
            'ADMIN_DELETE_TEST',
            'ADMIN_CREATE_QUESTION',
            'ADMIN_UPDATE_QUESTION',
            'ADMIN_DELETE_QUESTION',
            'ADMIN_APPROVE_USER',
            'ADMIN_REJECT_USER',
            'PASSWORD_RESET',
            'OTHER'
        ]
    },
    method: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    userAgent: String,
    timestamp: {
        type: Date,
        default: Date.now
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Index pour optimiser les requêtes de recherche
auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });

// Supprimer automatiquement les logs de plus de 90 jours
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // 90 jours

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
