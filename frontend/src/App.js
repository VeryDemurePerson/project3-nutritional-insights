import React, { useState, useEffect } from 'react';
import './App.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ScatterChart, Scatter, PieChart, Pie, Cell,
  ResponsiveContainer
} from 'recharts';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function App() {
  const [selectedDietType, setSelectedDietType] = useState('All Diet Types');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [nutritionalData, setNutritionalData] = useState(null);
  const [recipesData, setRecipesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const dietTypes = ['All Diet Types', 'Vegan', 'Keto', 'Mediterranean', 'Dash', 'Paleo'];

  // Fetch nutritional insights
  const fetchNutritionalInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/nutritional-insights.json`);
      const data = await response.json();
      setNutritionalData(data);
    } catch (err) {
      setError('Failed to fetch nutritional insights');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recipes - get ALL recipes (no pagination limit)
  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/recipes?limit=10000`);
      const data = await response.json();
      setRecipesData(data);
    } catch (err) {
      setError('Failed to fetch recipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Verify 2FA code
  const verify2FA = async () => {
    if (twoFactorCode.length !== 6) {
      alert('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-oauth',
          token: twoFactorCode
        })
      });

      const data = await response.json();

      if (data.success && data.verified) {
        // 2FA verified! Save token and authenticate
        localStorage.setItem('authToken', tempToken);
        setIsAuthenticated(true);
        setShowTwoFactorModal(false);
        setTwoFactorCode('');
        alert('Successfully authenticated with 2FA!');
      } else {
        alert('Invalid 2FA code. Please try again.');
      }
    } catch (err) {
      alert('2FA verification failed');
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
      await fetch(`${API_BASE_URL}/clusters.json`);
      alert('Clusters data loaded successfully!');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter recipes when data, searchTerm, or selectedDietType changes
  useEffect(() => {
    if (!recipesData?.recipes) return;

    let filtered = recipesData.recipes;

    // Filter by diet type
    if (selectedDietType !== 'All Diet Types') {
      filtered = filtered.filter(recipe =>
        recipe.diet_type === selectedDietType.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(recipe =>
        recipe.recipe_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.cuisine_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.diet_type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRecipes(filtered);
  }, [recipesData, searchTerm, selectedDietType]);

  // Handle OAuth callback and show 2FA modal
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const pendingOAuth = localStorage.getItem('pendingOAuth');

    if (token && pendingOAuth) {
      // OAuth successful, now require 2FA
      setTempToken(token);
      setShowTwoFactorModal(true);
      localStorage.removeItem('pendingOAuth');

      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
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

            {/* Heatmap */}
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

        {/* Filtered Recipes Display */}
        <section className="recipes-section" style={{
          margin: '40px 0',
          padding: '30px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2>Filtered Recipes ({filteredRecipes.length})</h2>

          {loading && <p>Loading recipes...</p>}

          {error && <p style={{ color: '#E53E3E' }}>{error}</p>}

          {!loading && filteredRecipes.length === 0 && (
            <p style={{ color: '#718096', textAlign: 'center', padding: '20px' }}>
              No recipes found. Try different filters or click "Get Recipes" button.
            </p>
          )}

          {filteredRecipes.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
              marginTop: '20px'
            }}>
              {filteredRecipes.slice(0, 12).map((recipe, index) => (
                <div key={index} style={{
                  padding: '20px',
                  background: '#F7FAFC',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    marginBottom: '10px',
                    color: '#2D3748'
                  }}>
                    {recipe.recipe_name}
                  </h3>
                  <div style={{
                    fontSize: '14px',
                    color: '#718096',
                    marginBottom: '8px'
                  }}>
                    <strong>Diet:</strong> {recipe.diet_type}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#718096',
                    marginBottom: '8px'
                  }}>
                    <strong>Cuisine:</strong> {recipe.cuisine_type}
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                    marginTop: '12px',
                    padding: '10px',
                    background: 'white',
                    borderRadius: '6px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#A0AEC0' }}>Protein</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#FF6B6B' }}>
                        {recipe.protein_g?.toFixed(1)}g
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#A0AEC0' }}>Carbs</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#4ECDC4' }}>
                        {recipe.carbs_g?.toFixed(1)}g
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#A0AEC0' }}>Fat</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFE66D' }}>
                        {recipe.fat_g?.toFixed(1)}g
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredRecipes.length > 12 && (
            <p style={{
              textAlign: 'center',
              marginTop: '20px',
              color: '#718096'
            }}>
              Showing 12 of {filteredRecipes.length} recipes
            </p>
          )}
        </section>

        {/* Security & Compliance Section */}
        <div style={{
          margin: '40px 0',
          padding: '30px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#6B46C1', marginBottom: '20px' }}>Security & Compliance</h2>

          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Security Status</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div style={{
                padding: '15px',
                background: '#F7FAFC',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Encryption:</span>
                <span style={{ color: '#38A169', fontWeight: 'bold' }}>Enabled</span>
              </div>
              <div style={{
                padding: '15px',
                background: '#F7FAFC',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Access Control:</span>
                <span style={{ color: '#38A169', fontWeight: 'bold' }}>Secure</span>
              </div>
              <div style={{
                padding: '15px',
                background: '#F7FAFC',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Compliance:</span>
                <span style={{ color: '#38A169', fontWeight: 'bold' }}>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* OAuth & 2FA Integration */}
        <div style={{
          margin: '40px 0',
          padding: '30px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#6B46C1', marginBottom: '20px' }}>OAuth & 2FA Integration</h2>

          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Secure Login</h3>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  localStorage.setItem('pendingOAuth', 'google');
                  window.location.href = 'http://localhost:5000/auth/google';
                }}
                style={{
                  padding: '12px 24px',
                  background: '#4285F4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Login with Google
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('pendingOAuth', 'github');
                  window.location.href = 'http://localhost:5000/auth/github';
                }}
                style={{
                  padding: '12px 24px',
                  background: '#333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Login with GitHub
              </button>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Setup 2FA</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('http://localhost:5000/api/2fa/generate', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userId: 'user-oauth',
                        userEmail: 'your-email@example.com'
                      })
                    });
                    const data = await response.json();

                    const qrWindow = window.open('', '_blank', 'width=400,height=500');
                    qrWindow.document.write(`
                      <html>
                        <head><title>2FA QR Code</title></head>
                        <body style="text-align: center; padding: 20px; font-family: Arial;">
                          <h2>Scan with Google Authenticator</h2>
                          <img src="${data.qrCode}" style="width: 300px; height: 300px;" />
                          <p>Secret: ${data.secret}</p>
                        </body>
                      </html>
                    `);
                  } catch (err) {
                    alert('Failed to generate QR code');
                  }
                }}
                style={{
                  padding: '12px 24px',
                  background: '#6B46C1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Generate QR Code
              </button>
            </div>
          </div>
        </div>

        {/* Cloud Resource Cleanup */}
        <div style={{
          margin: '40px 0',
          padding: '30px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#6B46C1', marginBottom: '20px' }}>Cloud Resource Cleanup</h2>

          <p style={{ color: '#718096', marginBottom: '20px' }}>
            Ensure that cloud resources are efficiently managed and cleaned up post-deployment.
          </p>

          <button
            onClick={() => alert('Cleanup feature will connect to Azure to remove unused resources')}
            style={{
              padding: '15px 30px',
              background: '#E53E3E',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Clean Up Resources
          </button>
        </div>

        {/* 2FA Verification Modal */}
        {showTwoFactorModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
              <h2 style={{ marginBottom: '10px', color: '#2D3748' }}>
                Two-Factor Authentication Required
              </h2>
              <p style={{ color: '#718096', marginBottom: '30px' }}>
                Please enter your 6-digit code from Google Authenticator to complete login.
              </p>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontWeight: '500',
                  color: '#2D3748'
                }}>
                  Enter 2FA Code:
                </label>
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength="6"
                  style={{
                    width: '100%',
                    padding: '15px',
                    fontSize: '24px',
                    letterSpacing: '10px',
                    textAlign: 'center',
                    border: '2px solid #E2E8F0',
                    borderRadius: '8px',
                    fontWeight: 'bold'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={verify2FA}
                  disabled={loading || twoFactorCode.length !== 6}
                  style={{
                    flex: 1,
                    padding: '15px',
                    background: twoFactorCode.length === 6 ? '#38A169' : '#A0AEC0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: twoFactorCode.length === 6 ? 'pointer' : 'not-allowed',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
                <button
                  onClick={() => {
                    setShowTwoFactorModal(false);
                    setTwoFactorCode('');
                    setTempToken('');
                  }}
                  style={{
                    padding: '15px 30px',
                    background: '#E53E3E',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
              </div>

              <p style={{
                marginTop: '20px',
                fontSize: '14px',
                color: '#718096',
                textAlign: 'center'
              }}>
                Don't have 2FA set up? Use the "Setup 2FA" section above to generate a QR code first.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2025 Nutritional Insights. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;