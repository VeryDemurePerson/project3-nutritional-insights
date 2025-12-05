const express = require('express');
const router = express.Router();
// Đảm bảo đường dẫn này trỏ đúng tới file cấu hình passport của bạn
const { passport, generateToken } = require('../auth/google');

// --- SỬA LỖI Ở ĐÂY ---
// Thay vì localhost, chúng ta trỏ về Frontend trên Azure
const FRONTEND_URL = "https://project3-backend-nutritional-bqhpd8ggbze8dhcj.canadacentral-01.azurewebsites.net";

// 1. Route bắt đầu đăng nhập Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// 2. Route nhận kết quả từ Google (Callback)
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Tạo token cho user
        const token = generateToken(req.user);

        // QUAN TRỌNG: Redirect về Azure, KHÔNG PHẢI localhost
        // Token được gắn vào URL để Frontend lấy ra dùng
        res.redirect(`${FRONTEND_URL}?token=${token}`);
    }
);

// 3. Route GitHub (Sửa tương tự)
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

// 4. Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ success: false, error: 'Logout failed' });
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

module.exports = router;