const express = require('express');
const router = express.Router();
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// In-memory storage (use database in production)
const user2FASecrets = new Map();

// POST /api/2fa/generate - Generate 2FA secret
router.post('/generate', async (req, res) => {
    try {
        const { userId, userEmail } = req.body;

        const secret = speakeasy.generateSecret({
            name: `Nutritional Insights (${userEmail})`,
            issuer: 'Nutritional Insights',
        });

        user2FASecrets.set(userId, secret.base32);

        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

        res.json({
            success: true,
            secret: secret.base32,
            qrCode: qrCodeUrl,
            message: 'Scan this QR code with Google Authenticator',
        });
    } catch (error) {
        console.error('2FA generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate 2FA secret',
        });
    }
});

// POST /api/2fa/verify - Verify 2FA code
router.post('/verify', (req, res) => {
    try {
        const { userId, token } = req.body;

        if (!userId || !token) {
            return res.status(400).json({
                success: false,
                error: 'User ID and token are required',
            });
        }

        const secret = user2FASecrets.get(userId);

        if (!secret) {
            return res.status(404).json({
                success: false,
                error: '2FA not set up for this user',
            });
        }

        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token,
            window: 2,
        });

        if (verified) {
            res.json({
                success: true,
                message: '2FA verification successful',
                verified: true,
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid 2FA code',
                verified: false,
            });
        }
    } catch (error) {
        console.error('2FA verification error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify 2FA code',
        });
    }
});

module.exports = router;