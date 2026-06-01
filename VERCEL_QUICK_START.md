# 🚀 Vercel Deployment Quick Reference

## Deploy in 5 Minutes ⚡

### 1. Create Vercel Account
```
Visit: https://vercel.com
Sign up with GitHub
```

### 2. Deploy Repository
```
Click: "New Project"
Select: Your GitHub repo
Click: "Import"
```

### 3. Add Environment Variables
```
Go to: Project Settings → Environment Variables
Add:
  OPENROUTER_API_KEY = sk-or-v1-...
  ALLOWED_ORIGIN = https://yourapp.vercel.app
  NODE_ENV = production
```

### 4. Deploy
```
Click: "Deploy"
Wait: 2-3 minutes
Done: Your app is live! ✅
```

---

## 🔗 Your Live URLs

After deployment:
```
Main App:      https://your-project-name.vercel.app
API Endpoint:  https://your-project-name.vercel.app/api/proxy
Custom Domain: https://yourdomain.com (optional)
```

---

## 📊 Important Files

| File | Purpose | Status |
|------|---------|--------|
| `vercel.json` | Deployment config | ✅ Updated |
| `public/security.js` | Security module | ✅ Ready |
| `api/proxy.js` | AI API proxy | ✅ Ready |
| `api/security-log.js` | Security logging | ✅ Ready |
| `index.html` | Main page | ✅ Ready |
| `.env.example` | Environment template | ✅ Ready |

---

## 🧪 Verify Deployment

```bash
# Test main page
curl https://your-app.vercel.app

# Test API
curl https://your-app.vercel.app/api/proxy -X POST

# Check security headers
curl -I https://your-app.vercel.app
```

---

## ⚠️ Important Notes

### API Key Security
```
❌ NEVER commit API key to GitHub
✅ ALWAYS use Vercel environment variables
✅ NEVER share API key publicly
✅ Rotate keys periodically
```

### Custom Domain Setup
```
1. Go to Vercel Project → Settings → Domains
2. Add your custom domain
3. Update DNS at your registrar
4. Wait for propagation (5-30 min)
```

### Environment Variables
```
Set in Vercel Dashboard:
Settings → Environment Variables

Or in .env file for local development:
(Never commit .env to GitHub!)
```

---

## 📈 Monitor Your App

```
Vercel Dashboard:
✓ View deployments
✓ Check logs
✓ Monitor uptime
✓ View analytics
✓ Manage domains
✓ Configure security
```

---

## 🆘 Troubleshooting

### API Key Error
```
Error: OPENROUTER_API_KEY is not set

Fix: Add to Vercel environment variables
1. Go to Project Settings
2. Add OPENROUTER_API_KEY
3. Redeploy
```

### CORS Error
```
Error: CORS policy blocked

Fix: Update ALLOWED_ORIGIN
In vercel.json and Vercel env variables
Set to your actual domain
```

### 405 Method Not Allowed
```
Error: Method POST not allowed

Fix: Check HTTP method
proxy.js accepts: POST
logs.js accepts: GET
security-log.js accepts: POST
```

### Static Files Not Found
```
Error: 404 on /public/security.js

Fix: Hard refresh browser
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

---

## 📞 Get Help

**Vercel Support**:
- Docs: https://vercel.com/docs
- Status: https://vercelstatus.com
- Support: vercel.com/support

**Your Project**:
- Issues: GitHub Issues
- Contact: @mengheang25
- Docs: See VERCEL_DEPLOYMENT.md

---

## ✅ Deployment Checklist

- [ ] Vercel account created
- [ ] GitHub repo connected
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] API tested
- [ ] Custom domain configured (optional)
- [ ] Monitoring enabled
- [ ] Backup created

---

**Status**: 🟢 Ready to Deploy
**Version**: 1.5
**Last Updated**: 2024

Your app is ready for Vercel! 🚀
