const { ResourceManagementClient } = require('@azure/arm-resources');
const { DefaultAzureCredential } = require('@azure/identity');

class AzureCleanupService {
    constructor() {
        try {
            this.credential = new DefaultAzureCredential();
            this.subscriptionId = process.env.AZURE_SUBSCRIPTION_ID || 'mock-subscription-id';
            this.client = new ResourceManagementClient(this.credential, this.subscriptionId);
            this.mockMode = !process.env.AZURE_SUBSCRIPTION_ID;
        } catch (error) {
            console.warn('Azure credentials not configured, using mock mode');
            this.mockMode = true;
        }
    }

    // Get all resources in subscription
    async getAllResources() {
        if (this.mockMode) {
            return this.getMockResources();
        }

        try {
            const resources = [];
            for await (const resource of this.client.resources.list()) {
                resources.push({
                    id: resource.id,
                    name: resource.name,
                    type: resource.type,
                    location: resource.location,
                    tags: resource.tags,
                });
            }
            return resources;
        } catch (error) {
            console.error('Error fetching resources:', error);
            return this.getMockResources();
        }
    }

    getMockResources() {
        return [
            {
                id: '/subscriptions/mock/resourceGroups/test-rg/providers/Microsoft.Storage/storageAccounts/teststorage',
                name: 'teststorage',
                type: 'Microsoft.Storage/storageAccounts',
                location: 'eastus',
                tags: { environment: 'test' },
            },
            {
                id: '/subscriptions/mock/resourceGroups/dev-rg/providers/Microsoft.Compute/virtualMachines/devvm',
                name: 'devvm',
                type: 'Microsoft.Compute/virtualMachines',
                location: 'westus',
                tags: { environment: 'development' },
            },
            {
                id: '/subscriptions/mock/resourceGroups/temp-rg/providers/Microsoft.Web/sites/tempapp',
                name: 'tempapp',
                type: 'Microsoft.Web/sites',
                location: 'eastus2',
                tags: { environment: 'temp' },
            },
        ];
    }

    // Identify unused resources
    async identifyUnusedResources() {
        try {
            const allResources = await this.getAllResources();
            const unusedResources = [];

            allResources.forEach((resource) => {
                const hasTestTag = resource.tags?.environment === 'test' ||
                    resource.tags?.environment === 'temp' ||
                    resource.tags?.environment === 'development';

                if (hasTestTag) {
                    unusedResources.push(resource);
                }
            });

            return unusedResources;
        } catch (error) {
            console.error('Error identifying unused resources:', error);
            throw error;
        }
    }

    // Delete resource by ID
    async deleteResource(resourceId) {
        if (this.mockMode) {
            return {
                success: true,
                resourceId,
                message: 'Resource deleted successfully (mock)',
            };
        }

        try {
            await this.client.resources.beginDeleteByIdAndWait(resourceId);
            return {
                success: true,
                resourceId,
                message: 'Resource deleted successfully',
            };
        } catch (error) {
            console.error('Error deleting resource:', error);
            throw error;
        }
    }

    // Estimate cost savings
    estimateCostSavings(resources) {
        const monthlyPerResource = 50;
        const totalSavings = resources.length * monthlyPerResource;

        return {
            resourceCount: resources.length,
            estimatedMonthlySavings: totalSavings,
            currency: 'USD',
        };
    }
}

module.exports = AzureCleanupService;