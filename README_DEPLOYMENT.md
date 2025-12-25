# Quick Deployment Guide

## 🚀 Deploy to Vercel in 5 Minutes

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your repository

### 3. Configure Build
- **Framework Preset:** Vite (auto-detected)
- **Root Directory:** `./`
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)

### 4. Add Environment Variables

**In Vercel Dashboard → Settings → Environment Variables:**

#### Frontend:
```
VITE_API_URL=https://your-project.vercel.app/api
VITE_WEB3FORMS_ACCESS_KEY=your-key-here
```

#### Backend:
```
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-32-character-secret-key
JWT_EXPIRE=7d
NODE_ENV=production
```

### 5. Deploy!
Click "Deploy" and wait 2-5 minutes.

### 6. Update API URL
After first deployment, update `VITE_API_URL` with your actual Vercel URL and redeploy.

## 📋 Full Checklist

See `DEPLOYMENT_CHECKLIST.md` for complete pre-deployment checklist.

## 📖 Detailed Guide

See `VERCEL_DEPLOYMENT.md` for comprehensive deployment instructions.

## ⚠️ Important Notes

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Use MongoDB Atlas** for production (not local MongoDB)
3. **Generate strong JWT_SECRET** (32+ random characters)
4. **Update CORS** after deployment with your production URL
5. **Test everything** after deployment

## 🔧 Troubleshooting

- **API 404:** Check `vercel.json` and `api/index.js`
- **CORS errors:** Update CORS origin in `server/server.js`
- **Build fails:** Check Vercel logs and Node version
- **Env vars not working:** Ensure `VITE_` prefix for frontend vars

## 📞 Support

- Check deployment logs in Vercel dashboard
- Review `VERCEL_DEPLOYMENT.md` for detailed help
- Verify all environment variables are set correctly

