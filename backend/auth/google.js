const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');

// --- CẤU HÌNH URL ---
// Đây là địa chỉ Backend trên Azure của bạn
const AZURE_BACKEND_URL = 'https://project3-backend-nutritional-bqhpd8ggbze8dhcj.canadacentral-01.azurewebsites.net';

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-secret',
            // SỬA LỖI: Dùng link Azure thay vì localhost
            callbackURL: `${AZURE_BACKEND_URL}/auth/google/callback`,
            proxy: true // Quan trọng: Giúp Passport tin tưởng kết nối HTTPS qua proxy của Azure
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = {
                    id: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    picture: profile.photos[0].value,
                    provider: 'google',
                };
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// GitHub OAuth Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID || 'dummy-client-id',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy-secret',
            // SỬA LỖI: Dùng link Azure thay vì localhost
            callbackURL: `${AZURE_BACKEND_URL}/auth/github/callback`,
            proxy: true // Quan trọng cho deploy
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = {
                    id: profile.id,
                    email: profile.emails && profile.emails[0] ? profile.emails[0].value : profile.username + '@github.com',
                    name: profile.displayName || profile.username,
                    picture: profile.photos && profile.photos[0] ? profile.photos[0].value : profile.avatar_url,
                    provider: 'github',
                };
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'default-secret-key', {
        expiresIn: '24h',
    });
}

module.exports = { passport, generateToken };