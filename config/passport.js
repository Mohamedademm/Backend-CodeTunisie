const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { generateTokens } = require('../utils/tokenUtils');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user exists
                let user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // Update user's googleId if not present (account linking)
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        // Avoid overwriting avatar if already set, or strictly use Google's? 
                        // Let's keep existing avatar if present, else use Google's
                        if (!user.avatar) user.avatar = profile.photos[0].value;
                        await user.save();
                    }
                    return done(null, user);
                }

                // Create new user
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    avatar: profile.photos[0].value,
                    password: '', // No password for Google auth users (or random string)
                    phone: '', // Optional
                });

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Serialization (not strictly needed for stateless JWT but good practice if session used later)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
