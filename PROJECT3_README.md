# Project 3: Enhanced Nutritional Insights with Security, OAuth & Cloud Management

**Student:** Lai Nhat Duong Phan (Tony)  
**Student ID:** [Your ID]  
**Course:** Cloud Computing (CPSY 300) - SAIT  
**Date:** December 3, 2025  
**Graduation:** December 17, 2025

---

## 📋 Project Overview

Project 3 builds upon Project 2 by adding enterprise-grade security, authentication, and cloud resource management features:

- ✅ **Security & Compliance:** Helmet.js, rate limiting, data encryption, GDPR endpoints
- ✅ **OAuth Integration:** Google OAuth 2.0 authentication (FULLY WORKING)
- ✅ **Two-Factor Authentication (2FA):** TOTP-based 2FA with QR code generation (FULLY WORKING)
- ✅ **Cloud Resource Cleanup:** Azure SDK integration for resource management

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────────┐
│                  React Frontend (Port 3000)              │
│  - Project 2 features (charts, filters, API buttons)    │
│  + Security Status Display                              │
│  + OAuth Login Buttons (Google, GitHub)                 │
│  + 2FA Code Input                                       │
│  + Cloud Cleanup Interface                              │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
                     │
┌────────────────────▼────────────────────────────────────┐
│              Node.js Backend (Port 5000)                 │
│  PROJECT 2 ENDPOINTS:                                    │
│  - GET /api/health                                       │
│  - GET /api/nutritional-insights                         │
│  - GET /api/recipes                                      │
│  - GET /api/clusters                                     │
│                                                          │
│  PROJECT 3 NEW ENDPOINTS:                                │
│  - GET  /api/privacy-policy        (GDPR)               │
│  - POST /api/user/export           (GDPR)               │
│  - DEL  /api/user/delete           (GDPR)               │
│  - GET  /auth/google               (OAuth)              │
│  - GET  /auth/google/callback      (OAuth)              │
│  - POST /api/2fa/generate          (2FA)                │
│  - POST /api/2fa/verify            (2FA)                │
│  - GET  /api/azure/resources       (Azure)              │
│  - GET  /api/azure/unused          (Azure)              │
│  - POST /api/azure/cleanup         (Azure)              │
└──────────────────────────────────────────────────────────┘
```

---

## ✨ New Features (Project 3)

### 1. Security & Compliance

**Security Middleware:**
- Helmet.js for HTTP security headers
- Rate limiting (100 requests per 15 minutes)
- Data encryption/decryption utilities
- CORS configuration

**GDPR Compliance:**
- Privacy policy endpoint
- User data export functionality
- User data deletion requests
- Compliance status display

**Status Display:**
```
Encryption:      ✅ Enabled
Access Control:  ✅ Secure
Compliance:      ✅ GDPR Compliant
```

### 2. OAuth Integration (FULLY WORKING ✅)


**Test Results:**
- ✅ Google login screen displays correctly
- ✅ User authentication successful
- ✅ JWT token generated and returned
- ✅ User profile data retrieved (email, name, ID)

### 3. Two-Factor Authentication (FULLY WORKING ✅)

**TOTP Implementation:**
- Speakeasy library for TOTP generation
- QR code generation for Google Authenticator
- 6-digit codes with 30-second expiry
- Verification endpoint

**Test Results:**
- ✅ QR code generated successfully
- ✅ Google Authenticator integration working
- ✅ Code verification successful
- ✅ Time-based validation working correctly

**Example Response:**
```json
{
  "success": true,
  "message": "2FA verification successful",
  "verified": true
}
```

### 4. Cloud Resource Cleanup

**Azure SDK Integration:**
- Resource listing across subscription
- Unused resource identification (by tags)
- Cleanup functionality
- Cost savings estimation

**Mock Mode:**
- Runs without Azure credentials for demo
- Returns 3 sample resources
- Estimates $150/month savings

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- npm 9+
- Google Cloud account (for OAuth)
- Google Authenticator app (for 2FA)

### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
code .env
```

**Environment Variables (.env):**
```env
PORT=5000
NODE_ENV=development

# JWT & Security
JWT_SECRET=my-super-secret-jwt-key-32-characters-long-12345
ENCRYPTION_KEY=my-encryption-key-must-be-exactly-32-chars!!
SESSION_SECRET=my-session-secret-key-for-express-sessions



# Azure (optional - leave empty for mock mode)
AZURE_SUBSCRIPTION_ID=
AZURE_TENANT_ID=
AZURE_CLIENT_ID=
AZURE_CLIENT_SECRET=
```

**Start Backend:**
```bash
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start React app
npm start
# App runs on http://localhost:3000
```

---

## 🧪 Testing Guide

### 1. Test Security Features

**Check Security Headers:**
```bash
curl -I http://localhost:5000/api/health
```

**Expected headers:**
- X-Content-Type-Options
- X-Frame-Options
- Strict-Transport-Security

**Test Rate Limiting:**
- Make 101 requests in 15 minutes
- 101st request should return 429 (Too Many Requests)

### 2. Test GDPR Endpoints

**Privacy Policy:**
```bash
curl http://localhost:5000/api/privacy-policy
```

**User Export:**
```bash
curl -X POST http://localhost:5000/api/user/export
```

**User Delete:**
```bash
curl -X DELETE http://localhost:5000/api/user/delete \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-123"}'
```

### 3. Test OAuth (FULLY WORKING ✅)

**Steps:**
1. Open `http://localhost:3000`
2. Scroll to "OAuth & 2FA Integration"
3. Click "Login with Google"
4. Select Google account
5. Grant permissions
6. Verify redirect to `localhost:3000/auth/success?token=...`

**Success Criteria:**
- ✅ Google login screen appears
- ✅ JWT token in URL after login
- ✅ Token contains user data (email, name, ID)

### 4. Test 2FA (FULLY WORKING ✅)

**Generate QR Code:**
```javascript
fetch('http://localhost:5000/api/2fa/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user-123',
    userEmail: 'your-email@gmail.com'
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

**Verify Code:**
```javascript
fetch('http://localhost:5000/api/2fa/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user-123',
    token: '123456'  // From Google Authenticator
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

**Success Criteria:**
- ✅ QR code generated
- ✅ Google Authenticator shows account
- ✅ 6-digit codes verify successfully

### 5. Test Azure Cleanup

**List Resources:**
```bash
curl http://localhost:5000/api/azure/resources
```

**List Unused:**
```bash
curl http://localhost:5000/api/azure/unused
```

**Cleanup:**
```bash
curl -X POST http://localhost:5000/api/azure/cleanup \
  -H "Content-Type: application/json" \
  -d '{"resourceIds": ["/subscriptions/mock/..."]}'
```

---

## 📦 Dependencies

### Backend
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "helmet": "latest",
  "express-rate-limit": "latest",
  "bcrypt": "^5.1.1",
  "crypto-js": "latest",
  "passport": "^0.7.0",
  "passport-google-oauth20": "^2.0.0",
  "jsonwebtoken": "^9.0.2",
  "express-session": "latest",
  "cookie-parser": "latest",
  "speakeasy": "^2.0.0",
  "qrcode": "^1.5.3",
  "@azure/arm-resources": "^5.2.0",
  "@azure/identity": "^4.0.0"
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "recharts": "^2.10.0",
  "axios": "^1.6.0"
}
```

---

## 📸 Screenshots

### 1. Security & Compliance Section
[Screenshot showing Encryption: Enabled, Access Control: Secure, GDPR Compliant]

### 2. OAuth Integration
[Screenshot of Google login screen]
[Screenshot of successful JWT token in URL]

### 3. 2FA Integration
[Screenshot of QR code generation]
[Screenshot of Google Authenticator app]
[Screenshot of successful verification]

### 4. Cloud Resource Cleanup
[Screenshot of resource listing]
[Screenshot of cleanup interface]

### 5. API Testing
[Screenshot of Postman/curl tests]

---

## 🎥 Demo Video

**Video includes:**
1. Overview of Project 3 features (30 sec)
2. Security status display (20 sec)
3. Google OAuth login flow (60 sec)
4. 2FA setup and verification (60 sec)
5. Azure resource cleanup demo (40 sec)
6. API endpoint testing (30 sec)

**Total Duration:** 4-5 minutes

---

## 🔒 Security Considerations

### Production Deployment Checklist:
- [ ] Use HTTPS in production
- [ ] Store secrets in environment variables
- [ ] Enable production mode (NODE_ENV=production)
- [ ] Set secure cookie flags
- [ ] Implement proper session management
- [ ] Add input validation
- [ ] Enable CSRF protection
- [ ] Setup proper CORS origins
- [ ] Use production-ready database
- [ ] Implement proper logging
- [ ] Add monitoring and alerts

---

## 📚 API Documentation

### Security Headers
All responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security: max-age=31536000`

### Rate Limiting
- Window: 15 minutes
- Max requests: 100
- Response: 429 Too Many Requests

### Authentication
- OAuth: JWT token in Authorization header
- 2FA: TOTP 6-digit code
- Session: Express session with secure cookies

---

## 🎓 Learning Outcomes

Through Project 3, I demonstrated:
- ✅ Enterprise security implementation
- ✅ OAuth 2.0 integration with Google
- ✅ Two-factor authentication implementation
- ✅ Cloud SDK integration (Azure)
- ✅ GDPR compliance features
- ✅ RESTful API design
- ✅ Full-stack development
- ✅ Testing and documentation

---

## 📧 Contact

**Student:** Lai Nhat Duong Phan (Tony)  
**Email:** [your-email@sait.ca]  
**GitHub:** [your-github]  
**Graduation:** December 17, 2025

---

## 📄 License

This project is for educational purposes as part of SAIT coursework.

---

**Submission Date:** December [Date], 2025  
**Course:** CPSY 300 - Cloud Computing  
**Institution:** Southern Alberta Institute of Technology (SAIT)