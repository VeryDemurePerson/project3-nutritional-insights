# 🪟 Windows Setup Guide - Project 2

Complete step-by-step guide for running Project 2 on Windows.

---

## ✅ Prerequisites Check

Open **Command Prompt** (CMD) or **PowerShell** and run:

```powershell
# Check Node.js
node --version
# Should show: v18.x.x or higher

# Check npm
npm --version
# Should show: 9.x.x or higher

# Check Git
git --version
# Should show: git version 2.x.x
```

**If any command fails, install:**
- Node.js: https://nodejs.org/ (download LTS version)
- Git: https://git-scm.com/download/win

---

## 📦 Step 1: Download Project Files

### Option A: From ZIP (Easiest)
1. Download all project files from submission
2. Extract to: `C:\Users\YourName\Desktop\project2-nutritional-insights`

### Option B: From GitHub
```powershell
cd Desktop
git clone https://github.com/<your-username>/project2-nutritional-insights.git
cd project2-nutritional-insights
```

---

## 🗂️ Step 2: Prepare Data File

**IMPORTANT:** Copy `All_Diets.csv` from Project 1 to backend:

```powershell
# Navigate to project root
cd C:\Users\YourName\Desktop\project2-nutritional-insights

# Create data directory
mkdir backend\data

# Copy CSV file from Project 1
copy C:\Path\To\Project1\All_Diets.csv backend\data\All_Diets.csv
```

Verify file is there:
```powershell
dir backend\data
# Should show: All_Diets.csv (703 KB)
```

---

## 🚀 Step 3: Setup Backend

Open **Command Prompt** or **PowerShell**:

```powershell
# Navigate to backend folder
cd C:\Users\YourName\Desktop\project2-nutritional-insights\backend

# Install dependencies (takes 1-2 minutes)
npm install

# You should see:
# added 50 packages in 30s

# Start backend server
npm start
```

**Expected Output:**
```
======================================================================
Server running on http://localhost:5000
API endpoints available:
  - GET /api/health
  - GET /api/nutritional-insights
  - GET /api/recipes
  - GET /api/clusters
======================================================================
```

**✅ KEEP THIS WINDOW OPEN!** Backend must run continuously.

---

## 🌐 Step 4: Setup Frontend

Open **NEW Command Prompt/PowerShell window**:

```powershell
# Navigate to frontend folder
cd C:\Users\YourName\Desktop\project2-nutritional-insights\frontend

# Install dependencies (takes 2-3 minutes)
npm install

# You should see:
# added 1500+ packages in 90s

# Start React development server
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view nutritional-insights-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

**Browser should auto-open to:** `http://localhost:3000`

---

## ✅ Step 5: Test the Application

### Test 1: Check if page loads
- ✅ Header says "Nutritional Insights"
- ✅ 4 chart cards visible (Bar, Scatter, Heatmap, Pie)
- ✅ Filter dropdown shows "All Diet Types"
- ✅ 3 API buttons visible

### Test 2: API Connection
1. Click **"Get Nutritional Insights"** button
2. Wait 1-2 seconds
3. ✅ Charts should populate with data
4. ✅ Bottom should show: "Total Recipes: 7806"

### Test 3: Filters
1. Click dropdown → Select **"Vegan"**
2. Click **"Get Nutritional Insights"** again
3. ✅ Charts update with vegan-only data

### Test 4: Pagination
1. Click **"Get Recipes"** button
2. ✅ Recipe data loads
3. Click **"Next"** button
4. ✅ Page number increases

---

## 📸 Step 6: Take Screenshots

For your submission, capture:

1. **Backend running:**
   ```
   Screenshot: Command Prompt showing backend server running
   ```

2. **Frontend homepage:**
   ```
   Screenshot: Browser showing full page with 4 charts
   ```

3. **API response:**
   ```
   Screenshot: After clicking "Get Nutritional Insights", show populated charts
   ```

4. **Filters working:**
   ```
   Screenshot: Dropdown menu open showing diet types
   ```

**Tip:** Use **Windows Key + Shift + S** to take screenshots

---

## 🛑 Common Issues & Solutions

### Issue 1: "npm is not recognized"
**Solution:**
1. Install Node.js from: https://nodejs.org/
2. Restart Command Prompt
3. Try again

### Issue 2: "EACCES: permission denied"
**Solution:**
```powershell
# Run Command Prompt as Administrator
# Right-click → "Run as administrator"
```

### Issue 3: Port 3000 already in use
**Solution:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F

# Start frontend again
npm start
```

### Issue 4: Backend shows "Cannot find module"
**Solution:**
```powershell
cd backend
rm -r node_modules
rm package-lock.json
npm install
npm start
```

### Issue 5: Charts not showing data
**Solution:**
1. Check backend is running on port 5000
2. Open browser console (F12)
3. Look for errors
4. Verify `All_Diets.csv` is in `backend\data\` folder

### Issue 6: "Failed to fetch nutritional insights"
**Solution:**
```powershell
# Check backend is running
# Open browser and visit: http://localhost:5000/api/health

# Should see JSON response:
{
  "status": "OK",
  "total_recipes": 7806
}
```

---

## 🧹 Stopping the Application

**Frontend:**
- In frontend terminal: Press **Ctrl + C**
- Type: **Y**
- Press **Enter**

**Backend:**
- In backend terminal: Press **Ctrl + C**
- Terminal will stop

---

## 🏗️ Building for Production

When ready to deploy:

```powershell
# Build frontend
cd frontend
npm run build

# Creates optimized build in: frontend\build\
```

---

## 📝 Quick Command Reference

```powershell
# Start Backend
cd backend
npm start

# Start Frontend (new window)
cd frontend
npm start

# Install dependencies
npm install

# Build production
npm run build

# Check if ports are free
netstat -ano | findstr :3000
netstat -ano | findstr :5000
```

---

## ✅ Checklist Before Submission

- [ ] Backend runs without errors
- [ ] Frontend opens in browser
- [ ] All 4 charts display data
- [ ] API buttons work (Get Nutritional Insights, Get Recipes, Get Clusters)
- [ ] Filter dropdown works
- [ ] Pagination buttons work
- [ ] Screenshots taken
- [ ] README.md updated with any changes
- [ ] All files zipped for submission

---

## 🆘 Need Help?

1. **Check backend terminal** for error messages
2. **Check browser console** (F12 → Console tab)
3. **Verify file paths** are correct
4. **Restart both servers** (backend then frontend)

---

**Good luck! 🚀**
