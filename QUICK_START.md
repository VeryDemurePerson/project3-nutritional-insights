# ⚡ QUICK START - Project 2

## 🎯 IMMEDIATE ACTIONS (DO THIS FIRST!)

### ⏰ Timeline: ~10 hours total
- **Tonight (6 hours):** Setup + Local Testing
- **Tomorrow morning (4 hours):** Azure Deployment + Documentation

---

## ✅ STEP-BY-STEP CHECKLIST

### 📥 STEP 1: Download & Extract (5 minutes)
- [ ] Download project2-nutritional-insights folder
- [ ] Extract to: `C:\Users\YourName\Desktop\project2-nutritional-insights`
- [ ] Copy `All_Diets.csv` from Project 1 to: `backend\data\All_Diets.csv`

### 🔧 STEP 2: Backend Setup (10 minutes)
```powershell
cd backend
npm install
npm start
```
- [ ] Backend runs on http://localhost:5000
- [ ] No errors in terminal
- [ ] Visit http://localhost:5000/api/health (should show JSON)

### 🌐 STEP 3: Frontend Setup (15 minutes)
**Open NEW terminal window:**
```powershell
cd frontend
npm install
npm start
```
- [ ] Browser opens to http://localhost:3000
- [ ] Page displays "Nutritional Insights" header
- [ ] 4 chart cards visible
- [ ] No errors in browser console (F12)

### ✅ STEP 4: Test Locally (20 minutes)
- [ ] Click "Get Nutritional Insights" → Charts populate
- [ ] Change filter to "Vegan" → Click button again → Charts update
- [ ] Click "Get Recipes" → Data loads
- [ ] Click "Next" in pagination → Page changes
- [ ] All 3 API buttons work (Insights, Recipes, Clusters)

### 📸 STEP 5: Screenshots (10 minutes)
Take screenshots of:
- [ ] Backend terminal running
- [ ] Frontend with all 4 charts showing data
- [ ] Dropdown menu open (showing diet types)
- [ ] After clicking "Get Nutritional Insights" (data displayed at bottom)

---

## 🚨 IF SOMETHING DOESN'T WORK:

### Backend won't start?
```powershell
# Delete node_modules and reinstall
cd backend
rmdir /s node_modules
del package-lock.json
npm install
npm start
```

### Frontend errors?
```powershell
# Delete node_modules and reinstall
cd frontend
rmdir /s node_modules
del package-lock.json
npm install
npm start
```

### Can't see charts?
1. Open browser console: Press F12
2. Go to "Console" tab
3. Look for red errors
4. Check if backend is running (http://localhost:5000/api/health)

---

## ☁️ AZURE DEPLOYMENT (Tomorrow Morning)

### Prerequisites:
- [ ] Azure account created (free tier: https://azure.microsoft.com/free/)
- [ ] GitHub repo created
- [ ] Code pushed to GitHub

### Quick Deploy Commands:
```powershell
# Install Azure CLI
winget install Microsoft.AzureCLI

# Login
az login

# Create Static Web App (Frontend)
az staticwebapp create \
  --name nutritional-insights-frontend \
  --resource-group nutritional-insights-rg \
  --location eastus

# Create App Service (Backend)
az webapp create \
  --name nutritional-insights-api \
  --resource-group nutritional-insights-rg \
  --plan nutritional-insights-plan \
  --runtime "NODE:18-lts"
```

**Full deployment guide:** See README.md section "Azure Deployment"

---

## 📝 DOCUMENTATION (Tomorrow Morning)

- [ ] Update README.md with your Azure URLs
- [ ] Take deployment screenshots
- [ ] Create submission document with:
  - Project overview
  - Screenshots (local + Azure)
  - API endpoints documentation
  - Challenges faced & solutions
  - Architecture diagram

---

## ⏱️ DETAILED TIMELINE

### **TONIGHT (18:00 - 00:00) - 6 hours**

**18:00 - 18:30** (30 min)
- Extract files
- Copy All_Diets.csv
- Read WINDOWS_SETUP.md

**18:30 - 19:00** (30 min)
- Install backend dependencies
- Start backend server
- Test /api/health endpoint

**19:00 - 19:30** (30 min)
- Install frontend dependencies
- Start frontend
- Verify page loads

**19:30 - 20:30** (1 hour)
- Test all features thoroughly
- Click every button
- Try all filters
- Test pagination
- Fix any bugs

**20:30 - 21:00** (30 min)
- Take all required screenshots
- Organize screenshot folder

**21:00 - 23:00** (2 hours)
- BREAK / BUFFER TIME
- Review code
- Test again if needed

**23:00 - 00:00** (1 hour)
- Create GitHub repo
- Push code to GitHub
- Verify repo is accessible

### **TOMORROW (07:00 - 11:00) - 4 hours**

**07:00 - 08:00** (1 hour)
- Create Azure account (if needed)
- Install Azure CLI
- Login to Azure

**08:00 - 09:30** (1.5 hours)
- Deploy frontend to Azure Static Web Apps
- Deploy backend to Azure App Service
- Upload All_Diets.csv to backend

**09:30 - 10:00** (30 min)
- Test deployed application
- Fix any issues
- Take deployment screenshots

**10:00 - 10:45** (45 min)
- Write final documentation
- Create submission PDF/DOCX
- Include all screenshots

**10:45 - 11:00** (15 min)
- SUBMIT! ✅

---

## 🎯 SUCCESS CRITERIA

✅ Frontend displays 4 charts with real data
✅ All 3 API buttons work correctly
✅ Filters change the displayed data
✅ Pagination navigates through results
✅ Backend API responds to all endpoints
✅ Application deployed to Azure (working URLs)
✅ CI/CD pipeline configured (GitHub Actions)
✅ Complete documentation with screenshots

---

## 📞 EMERGENCY CONTACTS

If stuck, check:
1. README.md (full documentation)
2. WINDOWS_SETUP.md (step-by-step Windows guide)
3. Browser console (F12) for frontend errors
4. Backend terminal for backend errors

---

## 💪 YOU GOT THIS!

**Total work time:** 8-10 hours
**Time available:** 21 hours
**Buffer:** 11-13 hours (for sleep, breaks, unexpected issues)

**This is VERY achievable!**

Start NOW and you'll be done by tomorrow morning! 🚀

---

**Created:** November 18, 2025, 13:40
**Deadline:** November 19, 2025, 11:00
**Time Remaining:** 21 hours 20 minutes
