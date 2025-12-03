const express = require('express');
const router = express.Router();
const AzureCleanupService = require('../services/azure-cleanup');

const cleanupService = new AzureCleanupService();

// GET /api/azure/resources - List all resources
router.get('/resources', async (req, res) => {
    try {
        const resources = await cleanupService.getAllResources();

        res.json({
            success: true,
            count: resources.length,
            resources: resources,
        });
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch Azure resources',
        });
    }
});

// GET /api/azure/unused - Identify unused resources
router.get('/unused', async (req, res) => {
    try {
        const unusedResources = await cleanupService.identifyUnusedResources();
        const costEstimate = cleanupService.estimateCostSavings(unusedResources);

        res.json({
            success: true,
            unusedResources: unusedResources,
            costSavings: costEstimate,
        });
    } catch (error) {
        console.error('Error identifying unused resources:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to identify unused resources',
        });
    }
});

// POST /api/azure/cleanup - Delete unused resources
router.post('/cleanup', async (req, res) => {
    try {
        const { resourceIds } = req.body;

        if (!resourceIds || !Array.isArray(resourceIds)) {
            return res.status(400).json({
                success: false,
                error: 'Resource IDs array is required',
            });
        }

        const results = [];

        for (const resourceId of resourceIds) {
            try {
                const result = await cleanupService.deleteResource(resourceId);
                results.push(result);
            } catch (error) {
                results.push({
                    success: false,
                    resourceId,
                    error: error.message,
                });
            }
        }

        res.json({
            success: true,
            message: 'Cleanup completed',
            results: results,
            successCount: results.filter((r) => r.success).length,
            failureCount: results.filter((r) => !r.success).length,
        });
    } catch (error) {
        console.error('Error during cleanup:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to cleanup resources',
        });
    }
});

module.exports = router;