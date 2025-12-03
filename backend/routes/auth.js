const express = require('express');
const router = express.Router();
const { passport, generateToken } = require('../auth/google');

// GET /auth/google - Initiate Google OAuth
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// GET /auth/google/callback - Google OAuth callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const token = generateToken(req.user);
        res.redirect(`http://localhost:3000/auth/success?token=${token}`);
    }
);

// GET /auth/github - Initiate GitHub OAuth
router.get('/github', passport.authenticate('github', {
    scope: ['user:email']
}));

// GET /auth/github/callback - GitHub OAuth callback
router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        const token = generateToken(req.user);
        res.redirect(`http://localhost:3000/auth/success?token=${token}`);
    }
);

// GET /auth/logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Logout failed' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// GET /auth/me - Get current user
router.get('/me', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    res.json({
        success: true,
        user: req.user,
    });
});

module.exports = router;