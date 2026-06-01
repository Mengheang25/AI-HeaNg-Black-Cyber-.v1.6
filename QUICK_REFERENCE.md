# ⚡ Quick Reference Guide

**Version:** 1.5 | **Status:** ✅ Complete | **Date:** June 1, 2026

---

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Install
npm install

# 2. Start
npm run dev

# 3. Open
http://localhost:3000/auth.html

# 4. Create account
Sign Up → Enter Name, Email, Password → Create Account

# 5. Login
Sign In → Enter Email, Password → Sign In

# 6. Chat
You're now in the chat! Click Logout when done
```

---

## 📍 Important URLs

```
http://localhost:3000/auth.html        # Login / Register
http://localhost:3000/                 # Chat (login required)
http://localhost:3000/admin.html       # Admin (admin only)
```

---

## 🔑 Default Admin Credentials

```
Email:    mengheangkh25@gmail.com
Password: 22225555##
```

⚠️ **Change after first login!**

---

## 👤 User Accounts

### Create New Account
1. Go to `/auth.html`
2. Click "Sign Up"
3. Fill in form
4. Click "Create Account"
5. Sign In with your credentials

### Sign In
1. Email
2. Password
3. Click "Sign In"
4. Auto-redirected to chat

### Logout
- Click "Logout" button (red, bottom of sidebar)
- Confirms, then redirects to auth page

---

## 🛡️ Admin Dashboard

### Access
- Sign in with admin email
- Click "Admin Panel" in sidebar
- Or go to `/admin.html`

### Features
- **View Users** - See all registered users
- **Search** - Filter by name or email
- **Block Users** - Click Block button → Confirm
- **Unblock Users** - Click Unblock button → Confirm
- **Stats** - Total, Active, Blocked user counts
- **Logout** - Sign out from admin panel

---

## 🔐 Security

### Passwords
- Minimum 6 characters
- Hashed with SHA256
- Never stored in plain text
- Never visible in admin panel

### Sessions
- Token-based authentication
- Stored in browser localStorage
- Auto-redirects if token missing
- Clear with Logout button

### Admin
- Email-based authorization
- Only `mengheangkh25@gmail.com` is admin
- To change: Delete user from `data/users.json` and re-sign up

---

## 💾 Data Location

```
data/users.json        # User database (auto-created on first signup)
                       # Contains: id, name, email, password hash, created_at, last_login, blocked
```

---

## 🔧 Configuration

### Change Admin Email

**File:** `api/users.js` (Line ~50)
```javascript
function isAdmin(email) {
  return email === 'your-email@example.com';  // Change here
}
```

Also update:
- `admin.html` (Line ~375)
- `index.html` (Line ~450)

### Change Admin Password
1. Delete admin user from `data/users.json`
2. Sign up again with new password
3. Email auto-recognized as admin

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid email/password" | Check spelling, make sure account exists |
| Can't access chat | Make sure logged in (token in localStorage) |
| Admin panel not showing | Sign in with admin email |
| Users not saving | Check `data/users.json` exists, has write permissions |
| Token error | Clear localStorage: `localStorage.clear()` |

---

## 📚 Documentation

| File | For |
|------|-----|
| AUTHENTICATION_GUIDE.md | Complete usage guide |
| COMPLETE_SYSTEM_GUIDE.md | Full system overview |
| SECURITY_DOCUMENTATION.md | Security features |
| VERIFICATION_GUIDE.md | Testing & verification |
| This file | Quick reference |

---

## 🚀 Deployment (Vercel)

### 1. Push to GitHub
```bash
git add .
git commit -m "Add auth system"
git push origin main
```

### 2. Deploy on Vercel
- Go to vercel.com
- Select your repo
- Click Deploy
- Add environment variables:
  - `OPENROUTER_API_KEY`
  - `NODE_ENV=production`

### 3. Access
```
https://your-project.vercel.app/auth.html
```

---

## 📋 Files Overview

```
auth.html               ← Login/Register page
admin.html             ← Admin dashboard
index.html             ← Chat (updated)
api/auth.js            ← Authentication API
api/users.js           ← User management API
api/proxy.js           ← Chat API (existing)
data/users.json        ← User database
vercel.json            ← Deployment config
```

---

## 🎯 Key Features

✅ User Registration (Sign Up)  
✅ User Login (Sign In)  
✅ Admin Dashboard  
✅ User Management (Block/Unblock)  
✅ User Statistics  
✅ Search Functionality  
✅ Session Management  
✅ Password Hashing  
✅ Protected Pages  
✅ Beautiful UI  

---

## ⚠️ Important Notes

1. **Change Admin Password** - Delete admin user and re-sign up
2. **Production Database** - Use Supabase/Firebase instead of file storage
3. **Keep Secrets Safe** - Use environment variables for API keys
4. **HTTPS Required** - Essential for production
5. **Monitor Activity** - Check admin logs regularly

---

## 🆘 Need Help?

1. **Read docs** - Check AUTHENTICATION_GUIDE.md
2. **Check console** - Browser dev tools (F12)
3. **Check logs** - Server terminal output
4. **Verify setup** - Run VERIFICATION_GUIDE.md steps
5. **Check files** - Ensure all files exist

---

## 📞 Quick Commands

```bash
# Start development
npm run dev

# Check files
ls -la auth.html api/auth.js api/users.js

# View users database
cat data/users.json

# Clear database
rm data/users.json

# Check for errors
grep -r "Error\|error" index.html

# Test API
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"signin","email":"x@y.com","password":"pass"}'
```

---

## ✅ Checklist

- [ ] Files created (auth.html, admin.html, api/auth.js, api/users.js)
- [ ] Dependencies installed (npm install)
- [ ] Dev server running (npm run dev)
- [ ] Can sign up
- [ ] Can sign in
- [ ] Can access chat
- [ ] Can access admin
- [ ] Can block users
- [ ] Can logout
- [ ] Ready for deployment

---

**Version:** 1.5 | **Status:** ✅ COMPLETE | **Last Updated:** June 1, 2026

👉 **Start with:** `npm install && npm run dev`  
👉 **Then visit:** `http://localhost:3000/auth.html`  
👉 **Questions?** Read `AUTHENTICATION_GUIDE.md`
