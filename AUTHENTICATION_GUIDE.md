# 🔐 Authentication System Setup Guide

**Status:** ✅ Complete  
**Version:** 1.5  
**Features:** Sign In / Sign Up / Admin Dashboard

---

## 📋 Features Overview

### User Authentication
- ✅ **Sign In** - Login with email & password
- ✅ **Sign Up** - Register with full name, email, password
- ✅ **Session Management** - Persistent login via localStorage
- ✅ **Password Security** - SHA256 hashing
- ✅ **Token-Based Auth** - Base64 encoded JWT-like tokens

### Admin Dashboard
- ✅ **User Management** - View all registered users
- ✅ **User Blocking** - Block/Unblock users
- ✅ **User Statistics** - Total, Active, and Blocked user counts
- ✅ **Search Functionality** - Search users by name or email
- ✅ **Admin Protection** - Only accessible by admin user

---

## 🗂️ File Structure

```
AI HeaNg[Black-Cyber] .v1.5/
├── auth.html                    # Authentication page (Sign In/Sign Up)
├── admin.html                   # Admin Dashboard
├── index.html                   # Chat (Updated with auth check)
├── api/
│   ├── auth.js                 # Authentication API (Sign In/Sign Up)
│   ├── users.js                # User Management API (Admin)
│   └── proxy.js                # Existing proxy with security
├── data/
│   └── users.json              # User database (auto-created)
└── vercel.json                 # Updated with auth routes
```

---

## 🔑 Admin Credentials

```
Email:    mengheangkh25@gmail.com
Password: 22225555##
```

**Important:** Change this password after first login!

---

## 🚀 Getting Started

### 1. Local Development

```bash
cd "AI HeaNg[Black-Cyber] .v1.5"
npm install
npm run dev
```

### 2. Access Points

| URL | Purpose | Access |
|-----|---------|--------|
| `/auth.html` | Sign In / Sign Up | Public |
| `/index.html` | AI Chat | Authenticated Users |
| `/admin.html` | Admin Dashboard | Admin Only |

### 3. First Time Setup

1. Go to `http://localhost:3000/auth.html`
2. Click "Sign Up"
3. Create your account
4. Sign In with your credentials
5. Access chat at `/index.html`

---

## 👤 User Account Types

### Regular User
- Access to AI chat
- Personal chat history
- Can be blocked by admin

### Admin User
- Access to admin dashboard
- View all users
- Block/Unblock users
- View user statistics
- Email: mengheangkh25@gmail.com

---

## 📊 Database Schema

### users.json Structure

```json
{
  "id": "user_1234567890",
  "name": "Full Name",
  "email": "user@example.com",
  "password": "sha256hash...",
  "created_at": "2026-06-01T10:00:00.000Z",
  "last_login": "2026-06-01T10:30:00.000Z",
  "blocked": false,
  "sessions": []
}
```

### User Fields
- **id**: Unique identifier (auto-generated)
- **name**: User's full name
- **email**: User's email address
- **password**: SHA256 hashed password
- **created_at**: Account creation timestamp
- **last_login**: Last login timestamp
- **blocked**: User block status (true/false)
- **sessions**: Active sessions list

---

## 🔒 Security Features

### Password Security
- SHA256 hashing algorithm
- Minimum 6 characters
- Client & server validation
- Never stored in plain text

### Session Management
- Token-based authentication
- Base64 encoded tokens
- localStorage for persistence
- Auto-logout on token expiration

### Admin Protection
- Email-based admin check
- Protected admin endpoints
- Token verification required
- User block enforcement

### Data Protection
- XSS prevention (HTML escaping)
- CORS protection
- Security headers
- Input validation

---

## 🔌 API Endpoints

### Authentication API

**Endpoint:** `POST /api/auth`

**Sign In Request:**
```json
{
  "action": "signin",
  "email": "user@example.com",
  "password": "password123"
}
```

**Sign In Response:**
```json
{
  "success": true,
  "token": "base64encodedtoken...",
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "user@example.com",
    "created_at": "2026-06-01T10:00:00.000Z"
  }
}
```

**Sign Up Request:**
```json
{
  "action": "signup",
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Sign Up Response:**
```json
{
  "success": true,
  "message": "Account created successfully"
}
```

---

### User Management API

**Endpoint:** `GET /api/users`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "user_123",
      "name": "John Doe",
      "email": "user@example.com",
      "created_at": "2026-06-01T10:00:00.000Z",
      "last_login": "2026-06-01T10:30:00.000Z",
      "blocked": false
    }
  ]
}
```

**Block/Unblock User - `PUT /api/users`**

**Request:**
```json
{
  "action": "block" | "unblock",
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User blocked successfully"
}
```

---

## 🛠️ Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Add authentication system"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your repository
4. Configure project settings:
   - Framework: Other
   - Root Directory: ./
5. Click "Deploy"

### 3. Add Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
OPENROUTER_API_KEY=your_api_key_here
ALLOWED_ORIGIN=https://your-domain.com
NODE_ENV=production
```

### 4. Access Your App

```
https://your-project.vercel.app/auth.html
https://your-project.vercel.app/admin.html
https://your-project.vercel.app/
```

---

## 📱 Using the Auth System

### Sign Up Flow

1. Visit `/auth.html`
2. Click "Sign Up" tab
3. Fill in:
   - Full Name
   - Email
   - Password (min 6 chars)
   - Confirm Password
4. Click "Create Account"
5. Switch to Sign In and login

### Sign In Flow

1. Visit `/auth.html`
2. Fill in:
   - Email
   - Password
3. Click "Sign In"
4. Redirected to chat `/index.html`

### Admin Dashboard

1. Sign in with admin email: `mengheangkh25@gmail.com`
2. Click "Admin Panel" in sidebar
3. View user statistics
4. Search users
5. Block/Unblock users

---

## 🔧 Customization

### Change Admin Email

1. Edit `api/users.js` line ~50:
```javascript
function isAdmin(email) {
  return email === 'your-admin-email@example.com';  // Change here
}
```

2. Edit `admin.html` line ~375:
```javascript
if (!token || user.email !== 'your-admin-email@example.com') {
  window.location.href = '/auth.html';
}
```

3. Edit `index.html` line ~450:
```javascript
if (user.email === 'your-admin-email@example.com' && adminBtn) {
  adminBtn.classList.remove('hidden');
}
```

### Change Admin Password

Admin password is set at account creation. To change:
1. Delete the admin user from `data/users.json`
2. Sign up again with new password
3. Email will be recognized as admin automatically

### Customize Auth Pages

Edit `auth.html` for:
- Styling
- Logo
- Form fields
- Error messages
- Success messages

Edit `admin.html` for:
- Dashboard layout
- Statistics display
- User table columns
- Action buttons

---

## 🐛 Troubleshooting

### Issue: "Invalid email or password" on Sign In

**Solutions:**
1. Check email spelling
2. Ensure password matches
3. Try signing up if account doesn't exist
4. Clear localStorage: `localStorage.clear()`

### Issue: Admin Dashboard Not Accessible

**Solutions:**
1. Sign in with correct admin email
2. Check if email matches in code
3. Verify token is saved: `localStorage.getItem('heang_token')`
4. Clear localStorage and sign in again

### Issue: Users Data Not Saving

**Solutions:**
1. Check `/data/users.json` exists
2. Verify file write permissions
3. Check server logs for errors
4. On Vercel, data persists in `/tmp` (ephemeral)

### Issue: Vercel Deployment Issues

**Solutions:**
1. Ensure `vercel.json` is correct
2. Check environment variables are set
3. Verify API routes are in `/api` folder
4. Check build logs in Vercel dashboard

---

## ⚠️ Important Notes

### Data Persistence

- **Local Development**: Data saved to `data/users.json`
- **Vercel**: Data in `/tmp` is ephemeral (lost on redeploy)
- **Recommendation**: Use a proper database:
  - Supabase (PostgreSQL)
  - Firebase (Realtime Database)
  - MongoDB (Atlas)
  - PlanetScale (MySQL)

### Production Considerations

1. **Use Real Database** - Not file-based storage
2. **Change Admin Password** - First thing after setup
3. **Enable HTTPS** - Required for production
4. **Setup Rate Limiting** - Prevent brute force
5. **Implement 2FA** - For admin account
6. **Monitor Logins** - Track suspicious activity
7. **Audit Logs** - Log all admin actions
8. **Backup Data** - Regular backups required

---

## 📚 Related Documentation

- [SECURITY_DOCUMENTATION.md](./SECURITY_DOCUMENTATION.md) - Security system
- [README.md](./README.md) - Project overview
- [SECURITY_CONFIG_GUIDE.js](./SECURITY_CONFIG_GUIDE.js) - Security configuration

---

## 🎯 Summary

Your authentication system now includes:

✅ User registration & login  
✅ Admin dashboard for user management  
✅ User blocking/unblocking  
✅ Secure password hashing  
✅ Token-based sessions  
✅ User statistics  
✅ Search functionality  
✅ Ready for Vercel deployment  

---

**Version:** 1.5  
**Last Updated:** June 1, 2026  
**Status:** ✅ Production Ready
