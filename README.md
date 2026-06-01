# 🛡️ HeaNg[Black-Cyber] AI Chat - Secure Edition

**Version:** 1.5 | **Status:** ✅ Production Ready | **Security:** Enterprise Grade

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
# http://localhost:3000
```

---

## 📋 Features

### Core Features
- 🤖 Advanced AI Chat Interface
- ⚡ Real-time Streaming Responses
- 🎨 Modern Cyberpunk UI
- 💾 Chat History & Context
- 🌙 Dark Mode Support
- 📱 Fully Responsive Design

### Security Features ✅
- 🛡️ **Developer Tools Protection** - Blocks F12, Inspect, Console
- 🔐 **DDoS Protection** - Multi-level rate limiting
- 🚫 **Spam Prevention** - Advanced pattern detection
- ⚔️ **XSS Protection** - CSP & input sanitization
- 🔑 **CSRF Protection** - Token-based validation
- 👤 **User-Agent Validation** - Blocks malicious bots
- 🎯 **SQL Injection Prevention** - Input validation
- 📊 **Rate Limiting** - Per minute/hour/day limits
- 🔒 **Session Security** - Activity monitoring
- 📡 **Security Headers** - Industry-standard headers

---

## 🔒 Security System Overview

### Three-Layer Protection

```
┌─────────────────────────────────────────┐
│   Client-Side Protection                │
│   (public/security.js)                  │
│   • DevTools blocking                   │
│   • XSS prevention                      │
│   • Session monitoring                  │
│   • CSRF token management               │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│   Request Validation                    │
│   (Transit Security)                    │
│   • Input sanitization                  │
│   • CSRF verification                   │
│   • User-Agent validation               │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│   Server-Side Protection                │
│   (api/proxy.js)                        │
│   • Rate limiting (3-tier)              │
│   • Spam detection                      │
│   • SQL injection prevention            │
│   • Model whitelist                     │
│   • Security headers                    │
└─────────────────────────────────────────┘
```

---

## 📊 Security Specifications

### Rate Limiting
```
Per Minute:  20 requests per IP
Per Hour:    200 requests per IP
Per Day:     2000 requests per IP
Block Time:  1 hour (after limit exceeded)
Algorithm:   Sliding Window
```

### Spam Detection
- Detects repeated characters (20+)
- Identifies multiple URLs
- Flags excessive special characters
- Catches repeated words (15+)
- Blocks script injection attempts
- Prevents SQL injection

### Blocked Protections
- ✓ F12 Key
- ✓ Ctrl+Shift+I (Inspect)
- ✓ Ctrl+Shift+C (Inspect Alt)
- ✓ Ctrl+Shift+J (Console)
- ✓ Ctrl+I (Inspector)
- ✓ Right-click Context Menu
- ✓ Developer Tools Detection
- ✓ Debugger Statements

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 14+ 
- npm or yarn
- Vercel account (for deployment)

### Local Setup

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd "AI HeaNg[Black-Cyber] .v1.5"
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Environment Variables**
   ```bash
   # Create .env.local file
   OPENROUTER_API_KEY=your_api_key_here
   ALLOWED_ORIGIN=http://localhost:3000
   NODE_ENV=development
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   ```
   http://localhost:3000
   ```

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Security update"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Select your repository
   - Configure settings

3. **Add Environment Variables**
   - `OPENROUTER_API_KEY` - Your OpenRouter API key
   - `ALLOWED_ORIGIN` - Your domain
   - `NODE_ENV` - Set to `production`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

---

## 📚 Documentation

### Quick Reference

| Document | Purpose |
|----------|---------|
| `SECURITY_DOCUMENTATION.md` | Comprehensive security guide |
| `SECURITY_SETUP.sh` | Security feature checklist |
| `public/security.js` | Client-side security system |
| `api/proxy.js` | Server-side security & API proxy |

### Key Files

```
├── index.html                      # Main application
├── public/
│   ├── security.js                 # 🛡️ Security system (NEW)
│   └── system_prompt.txt           # AI system prompt
├── api/
│   └── proxy.js                    # 🔐 Enhanced with security (UPDATED)
├── package.json                    # Dependencies
├── vercel.json                     # Vercel config
├── README.md                       # This file
└── SECURITY_DOCUMENTATION.md       # 📖 Full security guide (NEW)
```

---

## 🔐 Security Configuration

### Basic Configuration

**Modify Rate Limits** (api/proxy.js, line 20):
```javascript
const RATE_LIMIT_CONFIG = {
  perMinute: 20,
  perHour: 200,
  perDay: 2000,
  blockDurationMs: 3600000,
};
```

**Add Allowed Models** (api/proxy.js, line 220):
```javascript
const allowedModels = [
  'deepseek/deepseek-v4-flash',
  'deepseek/deepseek-chat',
  // Add more models
];
```

### Advanced Configuration

See `SECURITY_DOCUMENTATION.md` for:
- Spam pattern customization
- User-Agent rules
- CSP policies
- Custom security rules

---

## 🧪 Testing Security

### Test Cases

```bash
# Test rate limiting
curl -X POST http://localhost:3000/api/proxy \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'

# Test spam detection
curl -X POST http://localhost:3000/api/proxy \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"aaaaaaaaaaaaaaaaaaaaaaaaa"}]}'
```

### Browser Tests

1. **F12 Blocking:** Press F12 → Should be blocked
2. **Inspect Element:** Ctrl+Shift+I → Should be blocked
3. **Right-Click:** Right-click anywhere → Should be disabled
4. **Console:** Ctrl+Shift+J → Should be blocked

---

## 📊 Monitoring

### View Security Alerts

**In Browser Console:**
```javascript
// View all security alerts
JSON.parse(sessionStorage.getItem('security_alerts'))

// View CSRF token
sessionStorage.getItem('csrf_token')

// Check security system status
console.log(window.Security)
```

### Server Logs

Check Vercel dashboard for:
- Request logs
- Rate limit events
- Error tracking
- Performance metrics

---

## 🐛 Troubleshooting

### Issue: Cannot Open DevTools
**Solution:** Modify security.js config to disable protection
```javascript
config: {
  enableF12Protection: false,  // Set to false
  // ...
}
```

### Issue: Rate Limit Too Strict
**Solution:** Increase rate limits in api/proxy.js
```javascript
const RATE_LIMIT_CONFIG = {
  perMinute: 50,    // Increased from 20
  perHour: 500,     // Increased from 200
  perDay: 5000,     // Increased from 2000
};
```

### Issue: API Key Not Working
**Solution:** Verify environment variables
```bash
# Check if set correctly
echo $OPENROUTER_API_KEY

# Test API key directly
curl -X GET https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer YOUR_KEY"
```

---

## 🔄 API Reference

### Chat Endpoint

**Endpoint:** `POST /api/proxy`

**Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "model": "deepseek/deepseek-v4-flash",
  "temperature": 0.75,
  "stream": false
}
```

**Response (Success):**
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "I'm doing well, thank you for asking!"
      }
    }
  ]
}
```

**Response (Error):**
```json
{
  "error": "Too many requests",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

---

## 🎯 Best Practices

### ✅ Security Best Practices

1. **Always use HTTPS** - CSP requires secure context
2. **Keep security.js updated** - Check for patches regularly
3. **Monitor rate limits** - Review logs for abuse patterns
4. **Test in staging** - Verify security doesn't break UX
5. **Use environment variables** - Never hardcode secrets
6. **Review spam patterns** - Update periodically
7. **Monitor API usage** - Check OpenRouter metrics
8. **Keep dependencies updated** - Security patches

### ❌ Security Anti-Patterns

1. ❌ Disabling security features for convenience
2. ❌ Committing API keys to Git
3. ❌ Using overly permissive CORS
4. ❌ Ignoring security alerts
5. ❌ Bypassing rate limiting
6. ❌ Exposing internal errors to users
7. ❌ Using old, vulnerable libraries

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "tailwindcss": "^3.x",
    "font-awesome": "^6.x"
  },
  "devDependencies": {
    "serve": "^14.x"
  }
}
```

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Author

**HeaNg[Black-Cyber] Team**

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request
4. Ensure security features are tested

---

## 🔗 Links

- 🌐 [Live Demo](https://heang-ai.vercel.app)
- 📚 [Security Docs](./SECURITY_DOCUMENTATION.md)
- 🔧 [Setup Guide](./SECURITY_SETUP.sh)
- 🤖 [OpenRouter API](https://openrouter.ai)

---

## ⚠️ Important Notes

1. **Developer Tools Blocking** - Not 100% foolproof in determined hands
2. **Always Validate Server-Side** - Client-side protections are enhanced by server validation
3. **Monitor Actively** - Keep an eye on security logs and alerts
4. **Update Regularly** - Check for security patches and updates
5. **Test Thoroughly** - Verify security features don't break functionality

---

## ✅ Security Checklist

- [x] Client-side DevTools protection
- [x] Server-side rate limiting
- [x] Spam detection system
- [x] XSS prevention
- [x] CSRF protection
- [x] User-Agent validation
- [x] SQL injection prevention
- [x] Security headers
- [x] Input validation
- [x] Session monitoring

---

**Last Updated:** June 1, 2026  
**Version:** 1.5  
**Status:** ✅ Production Ready

🛡️ **Your security is our priority!**
