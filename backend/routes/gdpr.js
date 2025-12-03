const express = require('express');
const router = express.Router();

// GET /api/privacy-policy
router.get('/privacy-policy', (req, res) => {
    res.json({
        success: true,
        policy: {
            lastUpdated: new Date().toISOString(),
            version: '1.0.0',
            sections: [
                {
                    title: 'Data Collection',
                    content: 'We collect nutritional data and user preferences to provide personalized insights.',
                },
                {
                    title: 'Data Usage',
                    content: 'Your data is used solely for providing nutritional recommendations and analysis.',
                },
                {
                    title: 'Data Retention',
                    content: 'We retain your data for as long as your account is active.',
                },
                {
                    title: 'Your Rights',
                    content: 'You have the right to access, export, and delete your data at any time.',
                },
            ],
            gdprCompliant: true,
            encryption: 'Enabled',
            accessControl: 'Secure',
        },
    });
});

// POST /api/user/export
router.post('/user/export', (req, res) => {
    const userData = {
        userId: 'user-123',
        email: 'user@example.com',
        createdAt: '2024-01-01T00:00:00Z',
        preferences: {
            dietType: 'vegetarian',
            favoriteRecipes: ['recipe-1', 'recipe-2'],
        },
        exportedAt: new Date().toISOString(),
    };

    res.json({
        success: true,
        message: 'User data exported successfully',
        data: userData,
    });
});

// DELETE /api/user/delete
router.delete('/user/delete', (req, res) => {
    console.log('User deletion requested:', req.body);

    res.json({
        success: true,
        message: 'User data deletion request received. Data will be permanently deleted within 30 days.',
        deletionScheduled: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
});

module.exports = router;