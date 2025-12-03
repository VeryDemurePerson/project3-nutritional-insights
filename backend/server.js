const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
require('dotenv').config();
// Import new middleware and routes for Project 3
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { securityMiddleware, limiter } = require('./middleware/security');
const { passport } = require('./auth/google');
const gdprRoutes = require('./routes/gdpr');
const authRoutes = require('./routes/auth');
const twoFARoutes = require('./routes/2fa');
const azureRoutes = require('./routes/azure');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Security middleware
app.use(securityMiddleware);
app.use(limiter);

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', gdprRoutes);
app.use('/auth', authRoutes);
app.use('/api/2fa', twoFARoutes);
app.use('/api/azure', azureRoutes);

// In-memory data storage
let dietData = [];

// Load CSV data on server start
function loadCSVData() {
  const csvPath = path.join(__dirname, 'data', 'All_Diets.csv');

  console.log('Loading CSV data from:', csvPath);

  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => {
        results.push({
          diet_type: data.Diet_type?.toLowerCase(),
          recipe_name: data.Recipe_name,
          cuisine_type: data.Cuisine_type,
          protein_g: parseFloat(data['Protein(g)']) || 0,
          carbs_g: parseFloat(data['Carbs(g)']) || 0,
          fat_g: parseFloat(data['Fat(g)']) || 0
        });
      })
      .on('end', () => {
        dietData = results;
        console.log(`Loaded ${dietData.length} recipes from CSV`);
        resolve();
      })
      .on('error', (error) => {
        console.error('Error loading CSV:', error);
        reject(error);
      });
  });
}

// Helper function to calculate average macronutrients
function calculateAverageMacros(data) {
  const grouped = {};

  data.forEach(recipe => {
    const diet = recipe.diet_type;
    if (!grouped[diet]) {
      grouped[diet] = {
        protein_sum: 0,
        carbs_sum: 0,
        fat_sum: 0,
        count: 0
      };
    }
    grouped[diet].protein_sum += recipe.protein_g;
    grouped[diet].carbs_sum += recipe.carbs_g;
    grouped[diet].fat_sum += recipe.fat_g;
    grouped[diet].count += 1;
  });

  const averages = {};
  Object.keys(grouped).forEach(diet => {
    const g = grouped[diet];
    averages[diet] = {
      protein_g: g.protein_sum / g.count,
      carbs_g: g.carbs_sum / g.count,
      fat_g: g.fat_sum / g.count
    };
  });

  return averages;
}

// Health check endpoint
app.get('/api/health'
  , (req, res) => {
    res.json({
      status: 'OK',
      message: 'Nutritional Insights API is running',
      timestamp: new Date().toISOString(),
      data_loaded: dietData.length > 0,
      total_recipes: dietData.length
    });
  });



// API Endpoint 1: Get Nutritional Insights
app.get('/api/nutritional-insights', (req, res) => {
  try {
    const { diet_type, search } = req.query;

    let filteredData = [...dietData];

    // Filter by diet type if specified
    if (diet_type && diet_type !== 'all') {
      filteredData = filteredData.filter(recipe =>
        recipe.diet_type === diet_type.toLowerCase()
      );
    }

    // Filter by search term if specified
    if (search) {
      filteredData = filteredData.filter(recipe =>
        recipe.diet_type.includes(search.toLowerCase()) ||
        recipe.recipe_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Calculate statistics
    const averageMacros = calculateAverageMacros(filteredData);
    const dietTypes = [...new Set(filteredData.map(r => r.diet_type))];

    res.json({
      success: true,
      total_recipes: filteredData.length,
      diet_types: dietTypes,
      average_macronutrients: averageMacros,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in nutritional-insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch nutritional insights'
    });
  }
});

// API Endpoint 2: Get Recipes
app.get('/api/recipes', (req, res) => {
  try {
    const { diet_type, page = 1, limit = 20 } = req.query;

    let filteredData = [...dietData];

    // Filter by diet type if specified
    if (diet_type && diet_type !== 'all') {
      filteredData = filteredData.filter(recipe =>
        recipe.diet_type === diet_type.toLowerCase()
      );
    }

    // Sort by protein content (descending)
    filteredData.sort((a, b) => b.protein_g - a.protein_g);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedData = filteredData.slice(startIndex, endIndex);

    res.json({
      success: true,
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredData.length,
      total_pages: Math.ceil(filteredData.length / limit),
      recipes: paginatedData
    });

  } catch (error) {
    console.error('Error in recipes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recipes'
    });
  }
});

// API Endpoint 3: Get Clusters (Diet Type Analysis)
app.get('/api/clusters', (req, res) => {
  try {
    const { diet_type } = req.query;

    let filteredData = [...dietData];

    // Filter by diet type if specified
    if (diet_type && diet_type !== 'all') {
      filteredData = filteredData.filter(recipe =>
        recipe.diet_type === diet_type.toLowerCase()
      );
    }

    // Group by cuisine type within each diet
    const clusters = {};

    filteredData.forEach(recipe => {
      const diet = recipe.diet_type;
      const cuisine = recipe.cuisine_type;

      if (!clusters[diet]) {
        clusters[diet] = {};
      }

      if (!clusters[diet][cuisine]) {
        clusters[diet][cuisine] = {
          count: 0,
          avg_protein: 0,
          avg_carbs: 0,
          avg_fat: 0,
          recipes: []
        };
      }

      clusters[diet][cuisine].count += 1;
      clusters[diet][cuisine].recipes.push(recipe);
    });

    // Calculate averages for each cluster
    Object.keys(clusters).forEach(diet => {
      Object.keys(clusters[diet]).forEach(cuisine => {
        const recipes = clusters[diet][cuisine].recipes;
        const count = recipes.length;

        clusters[diet][cuisine].avg_protein =
          recipes.reduce((sum, r) => sum + r.protein_g, 0) / count;
        clusters[diet][cuisine].avg_carbs =
          recipes.reduce((sum, r) => sum + r.carbs_g, 0) / count;
        clusters[diet][cuisine].avg_fat =
          recipes.reduce((sum, r) => sum + r.fat_g, 0) / count;

        // Remove individual recipes from response to reduce size
        delete clusters[diet][cuisine].recipes;
      });
    });

    res.json({
      success: true,
      clusters: clusters,
      total_clusters: Object.values(clusters).reduce(
        (sum, diet) => sum + Object.keys(diet).length, 0
      ),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in clusters:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch clusters'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
loadCSVData()
  .then(() => {
    app.listen(PORT, () => {
      console.log('='.repeat(70));
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API endpoints available:`);
      console.log(`  - GET /api/health`);
      console.log(`  - GET /api/nutritional-insights`);
      console.log(`  - GET /api/recipes`);
      console.log(`  - GET /api/clusters`);
      console.log('='.repeat(70));
    });
  })
  .catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

module.exports = app;
