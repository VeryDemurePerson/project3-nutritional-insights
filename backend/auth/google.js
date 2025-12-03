const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-secret',
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback',
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
            callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/auth/github/callback',
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