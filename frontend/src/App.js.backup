import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ScatterChart, Scatter, PieChart, Pie, Cell,
  ResponsiveContainer
} from 'recharts';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function App() {
  const [selectedDietType, setSelectedDietType] = useState('All Diet Types');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [nutritionalData, setNutritionalData] = useState(null);
  const [recipesData, setRecipesData] = useState(null);
  const [clustersData, setClustersData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dietTypes = ['All Diet Types', 'Vegan', 'Keto', 'Mediterranean', 'Dash', 'Paleo'];

  // Fetch nutritional insights
  const fetchNutritionalInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/nutritional-insights`, {
        params: {
          diet_type: selectedDietType === 'All Diet Types' ? null : selectedDietType.toLowerCase(),
          search: searchTerm || null
        }
      });
      setNutritionalData(response.data);
    } catch (err) {
      setError('Failed to fetch nutritional insights');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recipes
  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes`, {
        params: {
          diet_type: selectedDietType === 'All Diet Types' ? null : selectedDietType.toLowerCase(),
          page: currentPage
        }
      });
      setRecipesData(response.data);
    } catch (err) {
      setError('Failed to fetch recipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch clusters
  const fetchClusters = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/clusters`, {
        params: {
          diet_type: selectedDietType === 'All Diet Types' ? null : selectedDietType.toLowerCase()
        }
      });
      setClustersData(response.data);
    } catch (err) {
      setError('Failed to fetch clusters');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on component mount
  useEffect(() => {
    fetchNutritionalInsights();
  }, []);

  // Prepare chart data
  const prepareBarChartData = () => {
    if (!nutritionalData) return [];
    return Object.entries(nutritionalData.average_macronutrients || {}).map(([diet, values]) => ({
      diet: diet.charAt(0).toUpperCase() + diet.slice(1),
      Protein: values.protein_g,
      Carbs: values.carbs_g,
      Fat: values.fat_g
    }));
  };

  const prepareScatterData = () => {
    if (!recipesData?.recipes) return [];
    return recipesData.recipes.map(recipe => ({
      x: recipe.carbs_g || 0,
      y: recipe.protein_g || 0,
      name: recipe.recipe_name
    }));
  };

  const preparePieData = () => {
    if (!nutritionalData) return [];
    const dietTypes = Object.keys(nutritionalData.average_macronutrients || {});
    return dietTypes.map(diet => ({
      name: diet.charAt(0).toUpperCase() + diet.slice(1),
      value: 1
    }));
  };

  const prepareHeatmapData = () => {
    if (!nutritionalData) return [];
    return Object.entries(nutritionalData.average_macronutrients || {}).map(([diet, values]) => ({
      diet: diet.charAt(0).toUpperCase() + diet.slice(1),
      protein: values.protein_g,
      carbs: values.carbs_g,
      fat: values.fat_g
    }));
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <h1>Nutritional Insights</h1>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Explore Section */}
        <section className="explore-section">
          <h2>Explore Nutritional Insights</h2>
          
          <div className="charts-grid">
            {/* Bar Chart */}
            <div className="chart-card">
              <h3>Bar Chart</h3>
              <p>Average macronutrient content by diet type.</p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={prepareBarChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="diet" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Protein" fill="#FF6B6B" />
                  <Bar dataKey="Carbs" fill="#4ECDC4" />
                  <Bar dataKey="Fat" fill="#FFE66D" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Scatter Plot */}
            <div className="chart-card">
              <h3>Scatter Plot</h3>
              <p>Nutrient relationships (e.g., protein vs carbs).</p>
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" name="Carbs (g)" />
                  <YAxis dataKey="y" name="Protein (g)" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={prepareScatterData()} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Heatmap (using BarChart as approximation) */}
            <div className="chart-card">
              <h3>Heatmap</h3>
              <p>Nutrient correlations.</p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={prepareHeatmapData()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="diet" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="protein" fill="#ff7f0e" />
                  <Bar dataKey="carbs" fill="#2ca02c" />
                  <Bar dataKey="fat" fill="#d62728" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="chart-card">
              <h3>Pie Chart</h3>
              <p>Recipe distribution by diet type.</p>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={preparePieData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {preparePieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="filters-section">
          <h2>Filters and Data Interaction</h2>
          
          <div className="filter-controls">
            <input
              type="text"
              placeholder="Search by Diet Type"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            
            <div className="dropdown">
              <button className="dropdown-button">
                {selectedDietType} ▼
              </button>
              <div className="dropdown-content">
                {dietTypes.map(diet => (
                  <div
                    key={diet}
                    onClick={() => setSelectedDietType(diet)}
                    className={selectedDietType === diet ? 'selected' : ''}
                  >
                    {selectedDietType === diet && '✓'} {diet}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* API Interaction Section */}
        <section className="api-section">
          <h2>API Data Interaction</h2>
          
          <div className="api-buttons">
            <button 
              onClick={fetchNutritionalInsights} 
              disabled={loading}
              className="api-button primary"
            >
              {loading ? 'Loading...' : 'Get Nutritional Insights'}
            </button>
            <button 
              onClick={fetchRecipes} 
              disabled={loading}
              className="api-button success"
            >
              {loading ? 'Loading...' : 'Get Recipes'}
            </button>
            <button 
              onClick={fetchClusters} 
              disabled={loading}
              className="api-button info"
            >
              {loading ? 'Loading...' : 'Get Clusters'}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
          
          {nutritionalData && (
            <div className="data-display">
              <h3>Nutritional Data:</h3>
              <p>Total Recipes: {nutritionalData.total_recipes}</p>
              <p>Diet Types: {nutritionalData.diet_types?.join(', ')}</p>
            </div>
          )}
        </section>

        {/* Pagination */}
        <section className="pagination-section">
          <h2>Pagination</h2>
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button className="page-number active">{currentPage}</button>
            <button className="page-number">{currentPage + 1}</button>
            <button onClick={() => setCurrentPage(prev => prev + 1)}>
              Next
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2025 Nutritional Insights. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
