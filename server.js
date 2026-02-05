require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// Connect to MongoDB
// Connect to MongoDB
connectDB();
require('./config/passport'); // Passport config

// Global Passport middleware
const passport = require('passport');
app.use(passport.initialize());


// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Compression middleware for better performance
const compression = require('compression');
app.use(compression());

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting with custom limiters
const { apiLimiter } = require('./middleware/rateLimiter');
app.use('/api/', apiLimiter);

// Serve uploaded files
const path = require('path');
const uploadsPath = path.join(__dirname, 'uploads');
console.log('📁 Serving static files from:', uploadsPath);
console.log('📁 __dirname:', __dirname);
app.use('/uploads', express.static(uploadsPath));

// Swagger Documentation
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Bienvenue sur l\'API CodeTunisiePro',
        version: '1.0.0',
    });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/assistant', require('./routes/assistant'));

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server (only if not in Vercel)
// Start server
const PORT = process.env.PORT || 5000;

// Only start listening if run directly (Render/Local), not when imported (Vercel)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

// Export for Vercel
module.exports = app;
