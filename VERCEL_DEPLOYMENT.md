# 🚀 Vercel Deployment Guide - HeaNg[Black-Cyber] V1.5

## Quick Setup ⚡

### 1. **Prerequisites**
- GitHub account with your repository
- Vercel account (free: https://vercel.com)
- Node.js 18+ (for local testing)

---

## 📋 Step-by-Step Deployment

### Step 1: Connect Your GitHub Repository
```
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Paste your GitHub repo URL
4. Click "Continue"
```

### Step 2: Configure Project Settings
```
✓ Framework Preset: Other (Static Site)
✓ Root Directory: ./
✓ Build Command: (leave blank - no build needed)
✓ Output Directory: (leave blank)
✓ Install Command: (leave blank)
```

### Step 3: Add Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables

**Add these variables**:

```env
OPENROUTER_API_KEY=sk-or-v1-xxxx...xxx
ALLOWED_ORIGIN=https://your-domain.vercel.app
NODE_ENV=production
```

**Get OPENROUTER_API_KEY**:
1. Go to https://openrouter.ai
2. Sign up / Login
3. Go to Settings → API Keys
4. Copy your API key
5. Paste in Vercel

### Step 4: Deploy
```
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your app is live! 🎉
```

---

## 🔐 Security Configuration

### Vercel Auto-Configured
✅ HTTPS enabled by default
✅ DDoS protection enabled
✅ WAF (Web Application Firewall) active
✅ Rate limiting available

### Project-Level Security
✅ All implemented in vercel.json:
- CSP headers
- Security headers
- CORS configuration
- Cache control
- API routing

---

## 📁 Project Structure (For Vercel)

```
your-repo/
├── index.html                 ✓ Main page
├── public/
│   ├── security.js           ✓ Security module
│   ├── system_prompt.txt      ✓ AI prompt
│   └── *.png                  ✓ Assets
├── api/
│   ├── proxy.js              ✓ AI API proxy
│   ├── security-log.js        ✓ Security logging
│   └── logs.js               ✓ Logs endpoint
├── package.json              ✓ Dependencies
├── vercel.json              ✓ Vercel config (UPDATED)
└── README.md                ✓ Documentation
```

---

## 🧪 Test Your Deployment

### Test 1: Check if live
```bash
curl https://your-domain.vercel.app
# Should return HTML
```

### Test 2: Check API
```bash
curl https://your-domain.vercel.app/api/proxy \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Test 3: Security headers
```bash
curl -I https://your-domain.vercel.app
# Should show:
# Strict-Transport-Security: max-age=31536000...
# X-Content-Type-Options: nosniff
# Content-Security-Policy: ...
```

### Test 4: Rate limiting
```
Send 31 requests in 1 minute to /api/proxy
Should get 429 (Too Many Requests) on 31st
```

---

## 🛠️ Custom Domain

### Add Custom Domain
```
1. Go to Vercel Dashboard
2. Your Project → Settings → Domains
3. Click "Add Domain"
4. Enter your domain: example.com
5. Follow DNS instructions
6. Wait for DNS propagation (5-30 min)
```

### DNS Configuration

**For Vercel nameservers** (Easiest):
```
1. Copy Vercel nameservers
2. Go to your domain registrar
3. Replace nameservers
4. Save
5. Wait 24-48 hours
```

**For CNAME** (If keeping current registrar):
```
Record Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 📊 Environment Variables Explained

### OPENROUTER_API_KEY
- **What**: Your API key for accessing AI models
- **Where**: Settings on openrouter.ai
- **Sensitivity**: SECRET - never share
- **Required**: YES

### ALLOWED_ORIGIN
- **What**: Domain allowed to call your API
- **Value**: `https://your-domain.vercel.app` or `*`
- **Default**: `*` (allow all origins)
- **Recommended**: Set to your actual domain

### NODE_ENV
- **What**: Environment type
- **Values**: `development` or `production`
- **Default**: `production`
- **Effect**: Changes security log availability

---

## 🔄 Updating Your App

### Push Changes
```bash
git add .
git commit -m "Update security features"
git push origin main
```

### Automatic Deployment
- Vercel automatically detects changes
- Deploys your update within 1-2 minutes
- Old version stays live until new one is ready
- Zero downtime deployment

### Manual Redeploy
```
Vercel Dashboard → Your Project → Redeploy
Click "Redeploy" button
```

---

## ⚙️ Vercel Configuration Breakdown

### vercel.json Updates

**Builds Section**:
```json
{
  "src": "api/**/*.js",
  "use": "@vercel/node",
  "config": {
    "maxDuration": 60,      // API timeout in seconds
    "memory": 1024          // Memory allocation in MB
  }
}
```

**Routes Section**:
- Maps URLs to specific files
- `/api/proxy` → `/api/proxy.js`
- `/api/security-log` → `/api/security-log.js`
- Static files served directly
- SPA routing (all URLs → index.html)

**Headers Section**:
- CORS headers for API requests
- Security headers for all requests
- Cache control per file type
- Content-Type specifications

**env Section**:
- Environment variable definitions
- Vercel dashboard auto-populates
- Required for secure deployment

---

## 📈 Monitoring

### Vercel Dashboard
```
Vercel.com → Your Project → Analytics
├── Overview
├── Web Vitals
├── Edge Function Analytics
├── Deployments
├── Logs
└── Settings
```

### View Logs
```
1. Go to Vercel Dashboard
2. Your Project → Deployments
3. Click recent deployment
4. View Logs
5. Filter by function
```

### Real-time Logs
```bash
# Via Vercel CLI (install: npm i -g vercel)
vercel logs --tail
```

---

## 🚨 Troubleshooting

### Issue: API returns 405
**Cause**: Wrong HTTP method
**Fix**: Use POST for `/api/proxy`, POST/GET for `/api/logs`

### Issue: CORS error
**Cause**: Origin not allowed
**Fix**: Set `ALLOWED_ORIGIN` in environment variables

### Issue: API key error
**Cause**: OPENROUTER_API_KEY not set
**Fix**: Add to Vercel environment variables

### Issue: Static files not found
**Cause**: Wrong path or cache issue
**Fix**: Hard refresh (Ctrl+Shift+R), check file exists

### Issue: Session timeout too aggressive
**Cause**: SESSION_TIMEOUT too short
**Fix**: Update in `public/security.js`

### Issue: Rate limiting too strict
**Cause**: LIMITS too low
**Fix**: Update in `api/proxy.js`

### Issue: Deployment stuck
**Cause**: Build taking too long
**Fix**: Check for errors in Vercel dashboard

---

## 🔐 Security Best Practices

### Keep API Key Secret
```
❌ DON'T commit API key to GitHub
✅ DO use Vercel environment variables
✅ DO rotate API keys periodically
✅ DO limit API key scope
```

### Monitor Deployments
```
✓ Review deployment logs
✓ Check security alerts
✓ Monitor rate limiting
✓ Track blocked IPs
```

### Update Regularly
```
✓ Keep dependencies updated
✓ Review security logs
✓ Update CSP policy if needed
✓ Audit access logs
```

---

## 📱 Test on Different Devices

### Desktop
```
Chrome/Edge: ✓
Firefox: ✓
Safari: ✓
```

### Mobile
```
iOS Safari: ✓
Android Chrome: ✓
```

### Test Features
```
✓ Send messages
✓ Check security (F12 blocked?)
✓ Test rate limiting
✓ File uploads
✓ Dark mode
✓ Responsive design
```

---

## 📊 Performance Optimization

### Already Configured
✓ Immutable cache for static assets (1 year)
✓ Short cache for HTML (1 hour)
✓ No-cache for API responses
✓ Compression enabled
✓ Minification enabled

### Further Optimization
```
1. Vercel → Analytics → Web Vitals
2. Identify slow pages
3. Optimize images
4. Reduce JS bundle size
5. Enable caching headers
```

---

## 💰 Pricing (Free Tier Includes)

### Vercel Free Plan
- ✓ Unlimited deployments
- ✓ Serverless functions (up to 1,000 per month)
- ✓ 100 GB bandwidth
- ✓ Edge Network (CDN)
- ✓ Custom domains
- ✓ HTTPS enabled
- ✓ Environment variables
- ✓ 24/7 monitoring

### Pro Plan (If needed)
- Unlimited serverless functions
- Priority support
- Advanced analytics
- Team collaboration

---

## 📞 Support

### Vercel Support
- Docs: https://vercel.com/docs
- Status: https://www.vercelstatus.com
- Support: vercel.com/support

### Your Project Support
- Contact: @mengheang25 (Telegram)
- Issues: GitHub Issues
- Docs: See SECURITY.md & guides

---

## ✅ Deployment Checklist

Before going live:

- [ ] GitHub repository created
- [ ] Vercel account set up
- [ ] Project imported to Vercel
- [ ] OPENROUTER_API_KEY added
- [ ] ALLOWED_ORIGIN configured
- [ ] vercel.json verified
- [ ] All files uploaded
- [ ] Deployment successful
- [ ] API endpoints tested
- [ ] Security headers verified
- [ ] Custom domain configured (optional)
- [ ] Monitoring enabled
- [ ] Backup created

---

## 🎉 You're Ready!

Your HeaNg[Black-Cyber] V1.5 is now:
```
✅ Hosted on Vercel (fast CDN)
✅ Secured with SSL/HTTPS
✅ Protected with WAF
✅ Auto-scaling for traffic spikes
✅ 99.99% uptime SLA
✅ Global distribution
✅ Automatic deployments
```

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **OpenRouter API**: https://openrouter.ai/docs
- **Security Guide**: See SECURITY.md
- **Installation Guide**: See SECURITY_INSTALLATION.md

---

**Status**: 🟢 Ready for Production
**Last Updated**: 2024
**Version**: 1.5

Your application is now deployed on Vercel! 🚀
