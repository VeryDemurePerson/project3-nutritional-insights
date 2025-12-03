# Project 2: Nutritional Insights Application with Frontend, Backend, and Continuous Deployment

**Author:** Lai Nhat Duong Phan  
**Date:** November 2025  
**Course:** Cloud Computing (CPSY 300)

---

## 📋 Project Overview

This project builds upon Project 1 by creating a **full-stack web application** that allows users to interact with nutritional insights through a modern web interface. The application features:

- **React Frontend** with interactive data visualizations
- **Node.js/Express Backend** with RESTful API endpoints
- **Azure Cloud Deployment** for scalable hosting
- **CI/CD Pipeline** for automated deployments
- **Responsive Design** for desktop and mobile

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Azure Static Web Apps                     │
│                      (React Frontend)                        │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Azure App Service                          │
│                  (Node.js Backend API)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   All_Diets.csv Data                         │
│              (From Project 1 - 7,806 recipes)                │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Features

### Frontend (React)
- ✅ **4 Interactive Charts:**
  - Bar Chart: Average macronutrients by diet type
  - Scatter Plot: Protein vs Carbs relationships
  - Heatmap: Nutrient correlations
  - Pie Chart: Recipe distribution

- ✅ **Filter System:**
  - Diet type dropdown (All, Vegan, Keto, Mediterranean, Dash, Paleo)
  - Search functionality

- ✅ **API Integration:**
  - Get Nutritional Insights
  - Get Recipes
  - Get Clusters

- ✅ **Pagination:** Navigate through large datasets

### Backend (Node.js/Express)
- ✅ **3 RESTful API Endpoints:**
  - `GET /api/nutritional-insights` - Average macros analysis
  - `GET /api/recipes` - Top protein-rich recipes
  - `GET /api/clusters` - Diet type clustering by cuisine

- ✅ **Features:**
  - CORS enabled for frontend access
  - Query parameter filtering
  - Pagination support
  - Error handling

### Cloud Services (Azure)
- ✅ **Azure Static Web Apps** - Frontend hosting
- ✅ **Azure App Service** - Backend API hosting
- ✅ **GitHub Actions** - CI/CD automation

---

## 📁 Project Structure

```
project2-nutritional-insights/
├── frontend/                    # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js              # Main React component
│   │   ├── App.css             # Styling
│   │   ├── index.js            # Entry point
│   │   └── index.css
│   ├── package.json
│   └── staticwebapp.config.json # Azure config
│
├── backend/                     # Node.js/Express API
│   ├── data/
│   │   └── All_Diets.csv       # Dataset from Project 1
│   ├── server.js               # Express server
│   ├── package.json
│   └── .env.example
│
├── .github/
│   └── workflows/
│       ├── azure-static-web-apps.yml  # Frontend CI/CD
│       └── deploy-backend.yml         # Backend CI/CD
│
└── README.md
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Git
- Azure account (free tier OK)
- GitHub account

### Local Development

#### 1. Clone the repository
```bash
git clone <your-repo-url>
cd project2-nutritional-insights
```

#### 2. Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Copy All_Diets.csv from Project 1
# Place it in: backend/data/All_Diets.csv

# Create .env file
cp .env.example .env

# Start backend server
npm start
# Server runs on http://localhost:5000
```

#### 3. Setup Frontend (in a new terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
# App runs on http://localhost:3000
```

#### 4. Test Locally
- Open browser: `http://localhost:3000`
- Click "Get Nutritional Insights" button
- Verify charts display data
- Test filters and pagination

---

## ☁️ Azure Deployment

### Step 1: Deploy Frontend to Azure Static Web Apps

1. **Create Azure Static Web App:**
   ```bash
   # Login to Azure
   az login
   
   # Create resource group
   az group create --name nutritional-insights-rg --location eastus
   
   # Create static web app
   az staticwebapp create \
     --name nutritional-insights-frontend \
     --resource-group nutritional-insights-rg \
     --location eastus \
     --source https://github.com/<your-username>/<your-repo>
   ```

2. **Get deployment token:**
   ```bash
   az staticwebapp secrets list \
     --name nutritional-insights-frontend \
     --resource-group nutritional-insights-rg
   ```

3. **Add to GitHub Secrets:**
   - Go to: Repository → Settings → Secrets → Actions
   - Add: `AZURE_STATIC_WEB_APPS_API_TOKEN`

### Step 2: Deploy Backend to Azure App Service

1. **Create App Service:**
   ```bash
   # Create App Service plan
   az appservice plan create \
     --name nutritional-insights-plan \
     --resource-group nutritional-insights-rg \
     --sku B1 \
     --is-linux
   
   # Create Web App
   az webapp create \
     --name nutritional-insights-api \
     --resource-group nutritional-insights-rg \
     --plan nutritional-insights-plan \
     --runtime "NODE:18-lts"
   ```

2. **Upload CSV file to Web App:**
   ```bash
   # Via FTP or Azure CLI
   az webapp deployment source config-zip \
     --resource-group nutritional-insights-rg \
     --name nutritional-insights-api \
     --src backend-deploy.zip
   ```

3. **Get publish profile:**
   ```bash
   az webapp deployment list-publishing-profiles \
     --name nutritional-insights-api \
     --resource-group nutritional-insights-rg \
     --xml
   ```

4. **Add to GitHub Secrets:**
   - `AZURE_WEBAPP_NAME`: nutritional-insights-api
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: (from step 3)

### Step 3: Update Frontend API URL

Edit `frontend/src/App.js`:
```javascript
const API_BASE_URL = 'https://nutritional-insights-api.azurewebsites.net/api';
```

Commit and push → CI/CD will auto-deploy!

---

## 🔄 CI/CD Pipeline

### Automatic Deployment Flow:

1. **Developer pushes code to `main` branch**
2. **GitHub Actions triggers**:
   - Installs dependencies
   - Builds React app
   - Runs tests (if configured)
   - Deploys to Azure Static Web Apps
   - Deploys backend to Azure App Service
3. **Application is live** in ~2-3 minutes

### Manual Deployment:
```bash
# Frontend
cd frontend
npm run build
az staticwebapp deploy \
  --name nutritional-insights-frontend \
  --resource-group nutritional-insights-rg \
  --app-location frontend/build

# Backend
cd backend
zip -r deploy.zip . -x "node_modules/*"
az webapp deployment source config-zip \
  --resource-group nutritional-insights-rg \
  --name nutritional-insights-api \
  --src deploy.zip
```

---

## 📊 API Documentation

### Base URL (Local)
```
http://localhost:5000/api
```

### Base URL (Production)
```
https://nutritional-insights-api.azurewebsites.net/api
```

### Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Nutritional Insights API is running",
  "timestamp": "2025-11-19T10:00:00.000Z",
  "total_recipes": 7806
}
```

#### 2. Nutritional Insights
```http
GET /api/nutritional-insights?diet_type=vegan&search=protein
```

**Parameters:**
- `diet_type` (optional): Filter by diet (vegan, keto, mediterranean, dash, paleo)
- `search` (optional): Search term

**Response:**
```json
{
  "success": true,
  "total_recipes": 1542,
  "diet_types": ["vegan"],
  "average_macronutrients": {
    "vegan": {
      "protein_g": 56.15,
      "carbs_g": 254.00,
      "fat_g": 103.30
    }
  }
}
```

#### 3. Recipes
```http
GET /api/recipes?diet_type=keto&page=1&limit=20
```

**Parameters:**
- `diet_type` (optional): Filter by diet
- `page` (default: 1): Page number
- `limit` (default: 20): Items per page

**Response:**
```json
{
  "success": true,
  "page": 1,
  "limit": 20,
  "total": 1560,
  "total_pages": 78,
  "recipes": [
    {
      "diet_type": "keto",
      "recipe_name": "Grilled Salmon",
      "cuisine_type": "American",
      "protein_g": 150.5,
      "carbs_g": 12.3,
      "fat_g": 180.2
    }
  ]
}
```

#### 4. Clusters
```http
GET /api/clusters?diet_type=all
```

**Parameters:**
- `diet_type` (optional): Filter by diet

**Response:**
```json
{
  "success": true,
  "clusters": {
    "keto": {
      "American": {
        "count": 250,
        "avg_protein": 101.2,
        "avg_carbs": 57.9,
        "avg_fat": 153.1
      }
    }
  },
  "total_clusters": 45
}
```

---

## 🧪 Testing

### Local Testing
```bash
# Backend
cd backend
npm start

# Test endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/nutritional-insights
curl "http://localhost:5000/api/recipes?diet_type=vegan&page=1"
```

### Frontend Testing
```bash
cd frontend
npm start
# Open http://localhost:3000
# Test all buttons and filters
```

---

## 🐛 Troubleshooting

### Issue: Frontend can't connect to backend
**Solution:** Check CORS settings in `backend/server.js` and API_BASE_URL in `frontend/src/App.js`

### Issue: CSV file not found
**Solution:** Ensure `All_Diets.csv` is in `backend/data/` directory

### Issue: Charts not rendering
**Solution:** Verify Recharts is installed: `npm install recharts`

### Issue: Azure deployment fails
**Solution:** Check GitHub Secrets are correctly set:
- `AZURE_STATIC_WEB_APPS_API_TOKEN`
- `AZURE_WEBAPP_NAME`
- `AZURE_WEBAPP_PUBLISH_PROFILE`

---

## 📈 Performance

- **Frontend Build:** ~30 seconds
- **Backend Start:** ~2 seconds
- **API Response Time:** < 100ms (local), < 500ms (Azure)
- **Dataset:** 7,806 recipes, 5 diet types
- **Deployment Time:** 2-3 minutes (full CI/CD)

---

## 🔒 Security

- ✅ CORS configured for specific frontend URL
- ✅ Environment variables for sensitive data
- ✅ No API keys exposed in frontend
- ✅ HTTPS enforced in production (Azure)
- ✅ Input validation on backend endpoints

---

## 📝 Differences from Project 1

| Aspect | Project 1 | Project 2 |
|--------|-----------|-----------|
| **Interface** | Python scripts (CLI) | React web app (GUI) |
| **Backend** | Python (local) | Node.js API (cloud) |
| **Storage** | Azurite (local) | Azure App Service |
| **Deployment** | Docker containers | Azure Static Web Apps + CI/CD |
| **User Interaction** | None (batch processing) | Interactive filters, charts, buttons |
| **Scalability** | Single machine | Cloud-based, auto-scaling |

---

## 🎓 Learning Outcomes

✅ Built full-stack application with React + Node.js  
✅ Implemented RESTful API design  
✅ Deployed to Azure cloud services  
✅ Setup CI/CD pipeline with GitHub Actions  
✅ Integrated data visualization with Recharts  
✅ Applied responsive web design principles  

---

## 📧 Contact

**Student:** Lai Nhat Duong Phan  
**Email:** [your-email]  
**GitHub:** [your-github]  
**Course:** CPSY 300 - Cloud Computing  
**Institution:** SAIT

---

## 📄 License

This project is for educational purposes as part of SAIT coursework.

---

**Submission Date:** November 19, 2025  
**Graduation:** December 17, 2025
