# 🚀 Quick Vercel Deployment

## Before You Deploy

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Get MongoDB Atlas Connection String:**
   - Go to MongoDB Atlas
   - Get your production connection string
   - Make sure IP whitelist allows all (0.0.0.0/0) or Vercel IPs

3. **Get Web3Forms Access Key:**
   - Visit https://web3forms.com/
   - Get your access key

## Deploy Steps

### 1. Connect to Vercel
- Go to [vercel.com](https://vercel.com)
- Sign in with GitHub
- Click "Add New Project"
- Import your repository

### 2. Configure Project
Vercel will auto-detect:
- **Framework:** Vite ✅
- **Build Command:** `npm run build` ✅
- **Output Directory:** `dist` ✅

### 3. Add Environment Variables

**In Vercel Dashboard → Settings → Environment Variables:**

#### Frontend Variables:
```
VITE_API_URL=https://your-project-name.vercel.app/api
VITE_WEB3FORMS_ACCESS_KEY=your-web3forms-key
```

#### Backend Variables:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ablog
JWT_SECRET=generate-a-random-32-character-string-here
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-project-name.vercel.app
```

**Important:** 
- Replace `your-project-name` with your actual Vercel project name
- Generate a strong JWT_SECRET (use: `openssl rand -base64 32`)

### 4. Deploy!
Click "Deploy" and wait 2-5 minutes.

### 5. Update API URL (After First Deploy)
1. Copy your actual Vercel URL from the deployment
2. Go to Settings → Environment Variables
3. Update `VITE_API_URL` with your actual URL
4. Redeploy (or push a new commit)

## ✅ Test After Deployment

1. Visit your Vercel URL
2. Test `/api/health` endpoint
3. Register a new user
4. Create a blog post
5. Test contact form

## 📋 Full Documentation

- **Detailed Guide:** See `VERCEL_DEPLOYMENT.md`
- **Checklist:** See `DEPLOYMENT_CHECKLIST.md`

## ⚠️ Common Issues

**API 404:** Check that `api/index.js` exists and `vercel.json` is correct

**CORS Errors:** Update `FRONTEND_URL` in environment variables

**Database Connection:** Verify MongoDB Atlas IP whitelist

**Build Fails:** Check Vercel logs and ensure all dependencies are in package.json

