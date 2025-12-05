const express = require('express');
const router = express.Router();
// Đảm bảo đường dẫn này trỏ đúng tới file cấu hình passport của bạn
const { passport, generateToken } = require('../auth/google');

// --- SỬA LỖI Ở ĐÂY ---
// Đây là địa chỉ trang web của bạn trên Azure
const FRONTEND_URL = "https://purple-ocean-0b078a80f.3.azurestaticapps.net";
// Lưu ý: Mình lấy link từ ảnh "Static Web App" bạn gửi (purple-ocean...). 
// Nếu link web frontend của bạn khác, hãy thay vào đây nhé!

// 1. Google Auth
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const token = generateToken(req.user);
        // QUAN TRỌNG: Chuyển hướng về Azure, KHÔNG VỀ LOCALHOST
        res.redirect(`${FRONTEND_URL}?token=${token}`);
    }
);

// 2. GitHub Auth
router.get('/github', passport.authenticate('github', {
    scope: ['user:email']
}));

router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        const token = generateToken(req.user);
        res.redirect(`${FRONTEND_URL}?token=${token}`);
    }
);

// 3. Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ success: false, error: 'Logout failed' });
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// 4. Get User
router.get('/me', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    res.json({ success: true, user: req.user });
});

module.exports = router;