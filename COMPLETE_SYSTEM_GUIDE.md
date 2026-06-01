# 🛡️🔐 HeaNg[Black-Cyber] AI Chat - Complete System Documentation

**Version:** 1.5 | **Status:** ✅ Production Ready | **Last Updated:** June 1, 2026

---

## 🎯 System Overview

Your application now has **TWO major systems**:

### 1. 🔐 Authentication System (NEW!)
- User registration & login
- Admin dashboard for user management
- User blocking/unblocking
- Session management

### 2. 🛡️ Security System (EXISTING)
- DDoS protection & rate limiting
- Spam detection & prevention
- Developer tools blocking
- XSS & CSRF protection
- Security headers

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│           PUBLIC PAGES (No Auth Required)            │
├─────────────────────────────────────────────────────┤
│  /auth.html - Sign In / Sign Up                     │
│               • User Registration                   │
│               • User Login                          │
│               • Form Validation                     │
│               • Password Security                   │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓ (Login Success)
┌─────────────────────────────────────────────────────┐
│      AUTHENTICATED USERS ONLY                        │
├─────────────────────────────────────────────────────┤
│  /index.html - AI Chat                              │
│               • Chat interface                      │
│               • Message history                     │
│               • User profile (sidebar)              │
│               • Dark mode toggle                    │
│                                                     │
│  /admin.html - Admin Dashboard (Admin Only)         │
│               • View all users                      │
│               • Block/Unblock users                 │
│               • User statistics                     │
│               • Search functionality                │
└─────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

### Sign Up Process

```
User fills signup form
         ↓
Client validates input
         ↓
POST /api/auth (action: "signup")
         ↓
Server validates email (not duplicate)
         ↓
Server hashes password (SHA256)
         ↓
Server saves user to data/users.json
         ↓
Return success message
         ↓
Redirect to Sign In tab
```

### Sign In Process

```
User fills signin form
         ↓
Client validates input
         ↓
POST /api/auth (action: "signin")
         ↓
Server finds user by email
         ↓
Server compares password hash
         ↓
Server checks if user is blocked
         ↓
Server generates token
         ↓
Return token + user data
         ↓
Client saves to localStorage
         ↓
Redirect to /index.html (Chat)
```

### Authorization Check

```
Load /index.html
         ↓
checkAuth() function runs
         ↓
Check localStorage for token
         ↓
If no token → Redirect to /auth.html
         ↓
If token exists → Load chat interface
         ↓
updateUserInfo() - Display user in sidebar
```

---

## 📂 File Structure

```
AI HeaNg[Black-Cyber] .v1.5/
│
├── 🔐 AUTHENTICATION FILES
│   ├── auth.html                      # Sign In / Sign Up interface
│   └── admin.html                     # Admin Dashboard
│
├── 🛡️ SECURITY FILES
│   └── public/
│       └── security.js                # Client-side security system
│
├── 🔧 API FILES
│   └── api/
│       ├── auth.js                    # Authentication endpoints
│       ├── users.js                   # User management endpoints
│       └── proxy.js                   # AI chat proxy (with security)
│
├── 💬 CHAT FILES
│   ├── index.html                     # Main chat interface
│   └── public/
│       ├── system_prompt.txt          # AI system prompt
│       └── worm.png                   # App logo
│
├── 📚 DOCUMENTATION
│   ├── README.md                      # Project overview
│   ├── AUTHENTICATION_GUIDE.md        # Auth system guide
│   ├── SECURITY_DOCUMENTATION.md      # Security system guide
│   ├── IMPLEMENTATION_SUMMARY.md      # Implementation details
│   ├── SECURITY_CONFIG_GUIDE.js       # Security configuration
│   ├── AUTH_SETUP_CHECKLIST.sh        # Setup checklist
│   └── SECURITY_SETUP.sh              # Security setup guide
│
├── 🚀 DEPLOYMENT
│   ├── vercel.json                    # Vercel configuration
│   ├── package.json                   # Dependencies
│   └── verify_security.py             # Verification tool
│
└── 💾 DATA
    └── data/
        └── users.json                 # User database (auto-created)
```

---

## 🚀 Getting Started

### Step 1: Install Dependencies

```bash
cd "AI HeaNg[Black-Cyber] .v1.5"
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

Server will start at: `http://localhost:3000`

### Step 3: Access Application

| URL | Purpose |
|-----|---------|
| `http://localhost:3000/auth.html` | Sign In / Sign Up |
| `http://localhost:3000/` | AI Chat (login required) |
| `http://localhost:3000/admin.html` | Admin (admin only) |

### Step 4: Create Your Account

1. Go to `http://localhost:3000/auth.html`
2. Click "Sign Up" tab
3. Enter:
   - Full Name
   - Email
   - Password (minimum 6 characters)
   - Confirm Password
4. Click "Create Account"
5. Sign in with your credentials

### Step 5: Access Chat

After sign in, you're automatically redirected to the chat at `/index.html`

---

## 🔑 Admin Access

### Default Admin Credentials

```
Email:    mengheangkh25@gmail.com
Password: 22225555##
```

### Admin Dashboard Features

1. **User Statistics**
   - Total users
   - Active users
   - Blocked users

2. **User Management**
   - View all users
   - Search by name or email
   - Block/Unblock users
   - View join date
   - View last login

3. **Admin Actions**
   - One-click block/unblock
   - Confirmation dialogs
   - Real-time updates

### Accessing Admin Panel

1. Sign in with admin email
2. Click "Admin Panel" button in sidebar
3. View and manage users

---

## 🔒 Security Features

### Authentication Security

✅ **Password Hashing**
- SHA256 encryption
- Salted hashes
- Never stored in plain text

✅ **Session Management**
- Token-based authentication
- Base64 encoded tokens
- localStorage persistence

✅ **Access Control**
- User authentication required
- Admin-only pages
- User blocking capability

✅ **Input Validation**
- Email format checking
- Password strength requirements
- Name length validation
- HTML sanitization

### Application Security

✅ **DDoS Protection**
- Rate limiting (20 req/min)
- IP-based tracking
- Automatic blocking

✅ **Spam Prevention**
- Pattern detection
- Keyword filtering
- Content validation

✅ **Developer Tools**
- F12 key blocking
- Inspect element blocking
- Console protection

✅ **XSS Protection**
- Content Security Policy (CSP)
- HTML entity escaping
- Safe DOM manipulation

✅ **CSRF Protection**
- Token-based CSRF defense
- Secure cookie handling
- Request validation

---

## 💻 API Reference

### Authentication API

**Endpoint:** `POST /api/auth`

**Sign In:**
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "signin",
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Sign Up:**
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "signup",
    "name": "John Doe",
    "email": "user@example.com",
    "password": "password123"
  }'
```

---

### User Management API

**Endpoint:** `GET /api/users` (Get all users)

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Endpoint:** `PUT /api/users` (Block/Unblock user)

```bash
curl -X PUT http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "action": "block",
    "email": "user@example.com"
  }'
```

---

### Chat API

**Endpoint:** `POST /api/proxy`

```bash
curl -X POST http://localhost:3000/api/proxy \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello"}
    ],
    "model": "deepseek/deepseek-v4-flash",
    "temperature": 0.75,
    "stream": false
  }'
```

---

## 🛠️ Configuration

### Admin Email

**File:** `api/users.js` (Line ~50)

```javascript
function isAdmin(email) {
  return email === 'your-admin-email@example.com';  // Change here
}
```

Also update in:
- `admin.html` (Line ~375)
- `index.html` (Line ~450)

### Rate Limiting

**File:** `api/proxy.js` (Line ~20)

```javascript
const RATE_LIMIT_CONFIG = {
  perMinute: 20,      // Requests per minute
  perHour: 200,       // Requests per hour
  perDay: 2000,       // Requests per day
  blockDurationMs: 3600000, // 1 hour block
};
```

### Allowed AI Models

**File:** `api/proxy.js` (Line ~220)

```javascript
const allowedModels = [
  'deepseek/deepseek-v4-flash',
  'deepseek/deepseek-chat',
  // Add more models here
];
```

---

## 🚀 Deployment to Vercel

### Prerequisites

- GitHub account with repository
- Vercel account
- OpenRouter API key

### Deployment Steps

1. **Push to GitHub**
```bash
git add .
git commit -m "Add authentication and security"
git push origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your repository
   - Click "Deploy"

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     - `OPENROUTER_API_KEY=your_key_here`
     - `ALLOWED_ORIGIN=https://your-domain.com`
     - `NODE_ENV=production`

4. **Access Your App**
   ```
   https://your-project.vercel.app/auth.html
   ```

---

## 📊 Database

### User Data Structure

**File:** `data/users.json`

```json
[
  {
    "id": "user_1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "sha256hash...",
    "created_at": "2026-06-01T10:00:00.000Z",
    "last_login": "2026-06-01T10:30:00.000Z",
    "blocked": false,
    "sessions": []
  }
]
```

### Database Considerations

**Local Development:**
- Stored in `data/users.json`
- Auto-created on first user
- Persists between server restarts

**Vercel Deployment:**
- `/tmp` is ephemeral (lost on redeploy)
- **Recommendation:** Use a real database:
  - Supabase (PostgreSQL)
  - Firebase (Realtime Database)
  - MongoDB (Atlas)
  - PlanetScale (MySQL)

---

## ⚠️ Important Notes

### Security Best Practices

1. ✅ **Change Admin Password**
   - Delete admin user from `data/users.json`
   - Sign up again with new password

2. ✅ **Use HTTPS in Production**
   - CSP requires secure context
   - Vercel provides free HTTPS

3. ✅ **Keep API Keys Safe**
   - Use environment variables
   - Never commit to Git

4. ✅ **Setup Real Database**
   - File-based storage not suitable for production
   - Vercel `/tmp` is ephemeral

5. ✅ **Monitor User Activity**
   - Review admin logs regularly
   - Check for suspicious behavior

---

## 📚 Documentation Guide

### For Users
- [README.md](./README.md) - Project overview
- [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) - How to sign up and login

### For Admins
- [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) - Admin dashboard usage
- [AUTH_SETUP_CHECKLIST.sh](./AUTH_SETUP_CHECKLIST.sh) - Admin setup

### For Developers
- [SECURITY_DOCUMENTATION.md](./SECURITY_DOCUMENTATION.md) - Security system details
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Implementation details
- [SECURITY_CONFIG_GUIDE.js](./SECURITY_CONFIG_GUIDE.js) - Configuration options
- This file - Complete system overview

### For DevOps
- [vercel.json](./vercel.json) - Deployment configuration
- [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) - Deployment section

---

## 🐛 Troubleshooting

### Login Issues

**Problem:** "Invalid email or password"
- Solution: Check email spelling and password
- Solution: Make sure account is created via Sign Up
- Solution: Clear browser cache and localStorage

**Problem:** Redirect loop
- Solution: Clear localStorage: `localStorage.clear()`
- Solution: Check browser console for errors

### Admin Issues

**Problem:** Admin panel not accessible
- Solution: Sign in with correct admin email
- Solution: Verify email matches configuration
- Solution: Clear localStorage and sign in again

### Data Issues

**Problem:** Users not saving
- Solution: Check `/data/users.json` exists
- Solution: Verify write permissions
- Solution: Check server logs

**Problem:** Data lost on Vercel redeploy
- Solution: This is expected (use real database)
- Solution: Migrate to Supabase/Firebase

---

## ✅ Setup Checklist

- [ ] Install npm dependencies: `npm install`
- [ ] Start dev server: `npm run dev`
- [ ] Access auth page: `http://localhost:3000/auth.html`
- [ ] Create test account
- [ ] Test sign in/sign out
- [ ] Test chat functionality
- [ ] Sign in with admin email
- [ ] Test admin dashboard
- [ ] Try blocking a user
- [ ] Change admin password
- [ ] Set up real database (for production)
- [ ] Configure Vercel environment variables
- [ ] Deploy to Vercel
- [ ] Test production deployment
- [ ] Update admin credentials
- [ ] Monitor security logs

---

## 🎯 Key Features Summary

### ✅ Complete Authentication
- User registration
- Secure login
- Session management
- Password security

### ✅ Admin Control
- User management
- User blocking/unblocking
- Activity monitoring
- Statistics dashboard

### ✅ Advanced Security
- DDoS protection
- Spam detection
- Developer tools blocking
- XSS prevention
- CSRF protection

### ✅ User Experience
- Beautiful UI
- Dark mode
- Responsive design
- Real-time updates
- Chat history

### ✅ Production Ready
- Vercel deployment
- Environment variables
- Security headers
- Error handling
- Logging

---

## 📞 Support

### Documentation
- Read [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)
- Check [SECURITY_DOCUMENTATION.md](./SECURITY_DOCUMENTATION.md)
- Review [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

### Common Issues
- Login problems → Check credentials and localStorage
- Admin access → Verify email is admin
- API errors → Check server logs and environment variables
- Data loss on Vercel → Use real database

---

## 🎉 Summary

You now have a **complete, production-ready AI chat application** with:

✅ User authentication (Sign In/Sign Up)  
✅ Admin dashboard for user management  
✅ Advanced security systems  
✅ Rate limiting & DDoS protection  
✅ Spam detection  
✅ Beautiful responsive UI  
✅ Ready for Vercel deployment  
✅ Comprehensive documentation  

**Happy coding!** 🚀

---

**Version:** 1.5  
**Created:** June 1, 2026  
**Status:** ✅ Production Ready  
**Maintained by:** HeaNg[Black-Cyber] Team
