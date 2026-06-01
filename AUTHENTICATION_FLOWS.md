# 🔐 Authentication System - Visual Flows & Diagrams

---

## 1️⃣ Sign Up Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Sign Up Flow                         │
└─────────────────────────────────────────────────────────────┘

  FRONTEND (Browser)                  BACKEND (Server)
  ─────────────────                   ────────────────

  User visits /auth.html
           │
           ├─→ Check localStorage
           │   (if heang_token exists)
           │   └─→ Redirect to /index.html ✓
           │
           ├─→ Display Sign Up Tab
           │
           ├─→ User enters:
           │   • Full Name
           │   • Email  
           │   • Password
           │   • Confirm Password
           │
           ├─→ Validate (client-side):
           │   ✓ Name ≥ 2 chars
           │   ✓ Email format valid
           │   ✓ Password ≥ 6 chars
           │   ✓ Passwords match
           │
           ├─→ POST /api/auth
           │   {
           │     "action": "signup",
           │     "name": "John Doe",
           │     "email": "john@example.com",
           │     "password": "password123"
           │   }
           │
           │                          ├─→ Receive request
           │                          │
           │                          ├─→ Validate inputs
           │                          │   (server-side)
           │                          │
           │                          ├─→ Check duplicate email
           │                          │   └─→ If exists: return error
           │                          │
           │                          ├─→ Hash password
           │                          │   SHA256(password)
           │                          │
           │                          ├─→ Create user object:
           │                          │   {
           │                          │     id: "user_" + timestamp,
           │                          │     name: "John Doe",
           │                          │     email: "john@example.com",
           │                          │     password: "sha256hash...",
           │                          │     created_at: ISO timestamp,
           │                          │     last_login: null,
           │                          │     blocked: false,
           │                          │     sessions: []
           │                          │   }
           │                          │
           │                          ├─→ Save to data/users.json
           │                          │
           │                          └─→ Return success
           │                              {
           │                                "success": true,
           │                                "message": "Account created"
           │                              }
           │
           ├─ Receive response ◄──────┤
           │
           ├─→ Success message
           │   "✓ Account created successfully!"
           │
           ├─→ Show for 2 seconds
           │
           ├─→ Switch to Sign In tab
           │
           └─→ Ready for login

```

---

## 2️⃣ Sign In Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     User Sign In Flow                        │
└─────────────────────────────────────────────────────────────┘

  FRONTEND (Browser)                  BACKEND (Server)
  ─────────────────                   ────────────────

  User visits /auth.html
           │
           ├─→ Check localStorage
           │   (if heang_token exists)
           │   └─→ Redirect to /index.html ✓
           │
           ├─→ Display Sign In Tab
           │
           ├─→ User enters:
           │   • Email
           │   • Password
           │
           ├─→ Validate (client-side):
           │   ✓ Email not empty
           │   ✓ Password not empty
           │
           ├─→ POST /api/auth
           │   {
           │     "action": "signin",
           │     "email": "john@example.com",
           │     "password": "password123"
           │   }
           │
           │                          ├─→ Receive request
           │                          │
           │                          ├─→ Find user by email
           │                          │   └─→ If not found: return error
           │                          │
           │                          ├─→ Compare passwords:
           │                          │   Hash(input) == user.password
           │                          │   └─→ If mismatch: return error
           │                          │
           │                          ├─→ Check if blocked
           │                          │   user.blocked === true
           │                          │   └─→ If blocked: return error
           │                          │
           │                          ├─→ Update last_login
           │                          │   user.last_login = now
           │                          │
           │                          ├─→ Generate token:
           │                          │   Base64({
           │                          │     email: "john@example.com",
           │                          │     timestamp: 1234567890,
           │                          │     random: "xyz123"
           │                          │   })
           │                          │
           │                          ├─→ Save to data/users.json
           │                          │
           │                          └─→ Return success:
           │                              {
           │                                "success": true,
           │                                "token": "base64token...",
           │                                "user": {
           │                                  "id": "user_123",
           │                                  "name": "John Doe",
           │                                  "email": "john@example.com",
           │                                  "created_at": "2026-06-01T..."
           │                                }
           │                              }
           │
           ├─ Receive response ◄──────┤
           │
           ├─→ Save token to localStorage:
           │   localStorage.setItem('heang_token', token)
           │   localStorage.setItem('heang_user', JSON.stringify(user))
           │
           ├─→ Show success message:
           │   "✓ Welcome back, John Doe!"
           │
           ├─→ Wait 1 second
           │
           ├─→ Redirect to /index.html
           │
           └─→ Chat loads with user context

```

---

## 3️⃣ Page Load & Authentication Check

```
┌─────────────────────────────────────────────────────────────┐
│              Page Load Authentication Flow                   │
└─────────────────────────────────────────────────────────────┘

  User navigates to /index.html (Chat)
           │
           ├─→ HTML loads
           │
           ├─→ JavaScript executes (boot function)
           │
           ├─→ checkAuth() called:
           │   ├─→ Get token from localStorage
           │   │   localStorage.getItem('heang_token')
           │   │
           │   ├─→ Get user from localStorage
           │   │   JSON.parse(localStorage.getItem('heang_user'))
           │   │
           │   ├─→ Check if both exist:
           │   │   ├─→ If NO token or NO user:
           │   │   │   └─→ Redirect to /auth.html
           │   │   │       window.location.href = '/auth.html'
           │   │   │
           │   │   └─→ If both exist:
           │   │       └─→ Continue loading chat
           │   │
           │   └─→ Return user object
           │
           ├─→ updateUserInfo() called:
           │   ├─→ Get user from localStorage
           │   │
           │   ├─→ Find #user-info-section element
           │   │
           │   ├─→ Set user name:
           │   │   #user-name.textContent = user.name
           │   │
           │   ├─→ Set user email:
           │   │   #user-email.textContent = user.email
           │   │
           │   ├─→ Show user info:
           │   │   #user-info-section.classList.remove('hidden')
           │   │
           │   └─→ If admin:
           │       user.email === 'mengheangkh25@gmail.com'
           │       └─→ Show admin button:
           │           #admin-btn.classList.remove('hidden')
           │
           ├─→ Fetch system prompt
           │
           ├─→ Load chat sessions
           │
           ├─→ Setup event listeners
           │
           └─→ Chat ready to use ✓

```

---

## 4️⃣ Admin Dashboard Access

```
┌─────────────────────────────────────────────────────────────┐
│              Admin Dashboard Access Flow                     │
└─────────────────────────────────────────────────────────────┘

  User clicks "Admin Panel" button
           │
           ├─→ goToAdmin() function:
           │   window.location.href = '/admin.html'
           │
           └─→ Load /admin.html
               │
               ├─→ Check authentication:
               │   ├─→ Get token from localStorage
               │   ├─→ Get user from localStorage
               │   │
               │   └─→ If no token:
               │       └─→ Redirect to /auth.html
               │
               ├─→ Check authorization:
               │   ├─→ Is user email admin?
               │   │   user.email === 'mengheangkh25@gmail.com'
               │   │
               │   └─→ If not admin:
               │       └─→ Redirect to /auth.html
               │
               ├─→ Fetch users from GET /api/users:
               │   ├─→ Send Bearer token in header
               │   │   Authorization: Bearer {token}
               │   │
               │   └─→ Receive user list:
               │       {
               │         "success": true,
               │         "users": [
               │           {
               │             "id": "user_123",
               │             "name": "John Doe",
               │             "email": "john@example.com",
               │             "created_at": "2026-06-01T...",
               │             "last_login": "2026-06-01T...",
               │             "blocked": false
               │           },
               │           ...
               │         ]
               │       }
               │
               ├─→ Calculate statistics:
               │   ├─→ Total Users: count all
               │   ├─→ Active Users: count where blocked === false
               │   └─→ Blocked Users: count where blocked === true
               │
               ├─→ Display dashboard:
               │   ├─→ Stats section
               │   ├─→ Search box
               │   ├─→ User table
               │   └─→ Action buttons
               │
               ├─→ Setup event listeners:
               │   ├─→ Search input
               │   ├─→ Block button
               │   ├─→ Unblock button
               │   └─→ Logout button
               │
               └─→ Admin dashboard ready ✓

```

---

## 5️⃣ Block/Unblock User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  Block/Unblock User Flow                     │
└─────────────────────────────────────────────────────────────┘

  Admin clicks "Block" button next to user
           │
           ├─→ Show confirmation modal:
           │   "Are you sure you want to block this user?"
           │   [Cancel] [Confirm]
           │
           ├─→ User clicks "Confirm"
           │
           ├─→ Send PUT /api/users request:
           │   {
           │     "action": "block",
           │     "email": "john@example.com"
           │   }
           │   Headers: Authorization: Bearer {token}
           │
           │                          ├─→ Receive request
           │                          │
           │                          ├─→ Verify admin:
           │                          │   Authorization header
           │                          │   └─→ If not admin: error
           │                          │
           │                          ├─→ Find user by email
           │                          │   └─→ If not found: error
           │                          │
           │                          ├─→ Prevent self-block:
           │                          │   ├─→ If admin blocks self:
           │                          │   │   └─→ Return error
           │                          │   └─→ Otherwise: continue
           │                          │
           │                          ├─→ Update user object:
           │                          │   user.blocked = true
           │                          │
           │                          ├─→ Save to data/users.json
           │                          │
           │                          └─→ Return success:
           │                              {
           │                                "success": true,
           │                                "message": "User blocked"
           │                              }
           │
           ├─ Receive response ◄──────┤
           │
           ├─→ Update UI:
           │   ├─→ Change status to "🔒 Blocked"
           │   ├─→ Update Blocked count +1
           │   ├─→ Update Active count -1
           │   └─→ Change button to "Unblock"
           │
           └─→ User cannot login anymore
               (Sign in returns "account blocked" error)

```

---

## 6️⃣ Logout Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Logout Flow                             │
└─────────────────────────────────────────────────────────────┘

  User clicks "Logout" button
           │
           ├─→ Show confirmation:
           │   "Are you sure you want to logout?"
           │   [Cancel] [OK]
           │
           ├─→ User clicks "OK"
           │
           ├─→ handleLogout() function:
           │
           ├─→ Clear localStorage:
           │   ├─→ localStorage.removeItem('heang_token')
           │   └─→ localStorage.removeItem('heang_user')
           │
           ├─→ Redirect to /auth.html:
           │   window.location.href = '/auth.html'
           │
           └─→ User must login again

```

---

## 7️⃣ Data Model

```
┌─────────────────────────────────────────────────────────────┐
│                    User Data Structure                       │
└─────────────────────────────────────────────────────────────┘

  data/users.json:
  [
    {
      "id": "user_1234567890",           // Unique ID (timestamp)
      │
      "name": "John Doe",                 // User full name
      │
      "email": "john@example.com",        // User email (unique)
      │
      "password": "a665a45920422f9d...", // SHA256 hashed password
      │                                    // NOT plain text!
      "created_at": "2026-06-01T10:00:00.000Z",  // Registration time
      │
      "last_login": "2026-06-01T10:30:00.000Z",  // Last login time
      │
      "blocked": false,                   // Account status
      │                                    // true = cannot login
      "sessions": []                      // Array of active sessions
                                          // (for future use)
    },
    { ... more users ... }
  ]

```

---

## 8️⃣ Token Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Token Structure                           │
└─────────────────────────────────────────────────────────────┘

  Token Generation (Server):
  
  const tokenData = {
    email: "john@example.com",
    timestamp: 1234567890,
    random: "xyz123abc"
  }
  
  token = Base64(JSON.stringify(tokenData))
  
  Example token:
  "eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJ0aW1lc3RhbXAiOjEyMzQ1Njc4OTAsInJhbmRvbSI6Inh5ejEyM2FiYyJ9"
  
  ─────────────────────────────────────────────────
  
  Token Verification (Server):
  
  1. Decode from Base64
  2. Parse JSON
  3. Extract email
  4. Check if user exists with that email
  5. If valid: authorized
  6. If invalid: unauthorized

```

---

## 9️⃣ Error Handling

```
┌─────────────────────────────────────────────────────────────┐
│                  Error Response Examples                     │
└─────────────────────────────────────────────────────────────┘

  Sign In Errors:
  {
    "success": false,
    "error": "Invalid email or password"
  }
  
  {
    "success": false,
    "error": "Your account has been blocked by admin"
  }
  
  Sign Up Errors:
  {
    "success": false,
    "error": "Email already registered"
  }
  
  {
    "success": false,
    "error": "Name must be at least 2 characters"
  }
  
  {
    "success": false,
    "error": "Password must be at least 6 characters"
  }
  
  Admin Errors:
  {
    "success": false,
    "error": "Unauthorized - admin access required"
  }
  
  {
    "success": false,
    "error": "Invalid token"
  }

```

---

## 🔟 Component Relationships

```
┌─────────────────────────────────────────────────────────────┐
│               System Component Diagram                       │
└─────────────────────────────────────────────────────────────┘

  ┌──────────────┐
  │  auth.html   │──────────────┐
  └──────────────┘              │
       │                        │
       │ (Sign In/Up)          │ (POST Request)
       │                        │
       ├──────────────────────┤
       │                      │
       ▼                      ▼
  ┌──────────────┐      ┌──────────────┐
  │ localStorage │      │ api/auth.js  │
  │ (Token)      │      │ (Auth Logic) │
  └──────────────┘      └──────────────┘
       │                      │
       │ (Token)             │ (SHA256)
       │                     │
       ├──────────────────────┤
       │                      ▼
       │              ┌──────────────┐
       │              │ crypto.js    │
       │              │ (SHA256 Hash)│
       │              └──────────────┘
       │                      │
       ├─────────────────────┤
       │                     │
       ▼                     ▼
  ┌──────────────┐      ┌──────────────┐
  │ index.html   │      │ data/users.  │
  │ (Chat)       │      │ json (DB)    │
  └──────────────┘      └──────────────┘
       │
       ├─ checkAuth() ────► verifyToken()
       ├─ updateUserInfo()
       └─ handleLogout()
            │
            ▼
       ┌──────────────┐
       │ admin.html   │
       │ (Dashboard)  │
       └──────────────┘
            │
            ├─ GET /api/users
            ├─ PUT /api/users
            │
            ▼
       ┌──────────────┐
       │ api/users.js │
       │ (Admin API)  │
       └──────────────┘
            │
            ├─ Block User
            ├─ Unblock User
            ├─ Get User List
            │
            ▼
       ┌──────────────┐
       │ data/users.  │
       │ json (DB)    │
       └──────────────┘

```

---

This visual guide helps understand the authentication system flow and component relationships.

For more details, see AUTHENTICATION_GUIDE.md
