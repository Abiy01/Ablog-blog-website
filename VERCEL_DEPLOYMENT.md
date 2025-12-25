# Vercel Deployment Guide

This guide will help you deploy your Ablog MERN stack application to Vercel.

## Prerequisites

- GitHub account (for connecting to Vercel)
- MongoDB Atlas account (for production database)
- Web3Forms access key (for contact form)

## Deployment Options

### Option 1: Deploy Frontend Only (Recommended for Separate Backend)

If you want to deploy the backend separately (e.g., on Railway, Render, or another service):

1. **Deploy Frontend:**
   - Connect your GitHub repo to Vercel
   - Vercel will auto-detect it's a Vite project
   - Add environment variables (see below)
   - Deploy!

2. **Deploy Backend Separately:**
   - Use Railway, Render, or another Node.js hosting service
   - Update `VITE_API_URL` in frontend to point to your backend URL

### Option 2: Deploy Full Stack on Vercel (Current Setup)

Deploy both frontend and backend together on Vercel using serverless functions.

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Verify files are committed:**
   - ✅ `vercel.json` exists
   - ✅ `package.json` has build script
   - ✅ `.env` is in `.gitignore` (never commit secrets!)

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Vercel will auto-detect settings

### Step 3: Configure Build Settings

**Framework Preset:** Vite  
**Root Directory:** `./` (root)  
**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Install Command:** `npm install`

### Step 4: Add Environment Variables

In Vercel dashboard → Your Project → Settings → Environment Variables, add:

#### Frontend Variables:
```
VITE_API_URL=https://your-project.vercel.app/api
VITE_WEB3FORMS_ACCESS_KEY=your-web3forms-access-key
```

#### Backend Variables:
```
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-project.vercel.app
```

**Important Notes:**
- For `VITE_API_URL`, use your Vercel deployment URL (e.g., `https://your-project.vercel.app/api`)
- After first deployment, update `VITE_API_URL` with the actual Vercel URL
- MongoDB Atlas connection string should be your production database
- Generate a strong `JWT_SECRET` (at least 32 characters)

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. Your app will be live at `https://your-project.vercel.app`

### Step 6: Update API URL (After First Deployment)

After the first deployment:

1. Copy your Vercel deployment URL
2. Go to Project Settings → Environment Variables
3. Update `VITE_API_URL` to: `https://your-project.vercel.app/api`
4. Redeploy (or it will auto-redeploy on next push)

## MongoDB Atlas Setup for Production

1. **Create Production Cluster:**
   - Go to MongoDB Atlas
   - Create a new cluster (or use existing)
   - Get connection string

2. **Network Access:**
   - Add `0.0.0.0/0` to allow all IPs (or Vercel IPs)
   - Or add specific Vercel IP ranges

3. **Database User:**
   - Create a dedicated user for production
   - Use strong password
   - Grant appropriate permissions

## Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] API routes work (`/api/health` should return OK)
- [ ] User registration works
- [ ] User login works
- [ ] Blog posts can be created
- [ ] Blog posts display correctly
- [ ] Contact form sends emails
- [ ] Environment variables are set correctly

## Troubleshooting

### Issue: API Routes Return 404

**Solution:**
- Check `vercel.json` configuration
- Ensure routes are correctly configured
- Verify server files are in correct location

### Issue: CORS Errors

**Solution:**
- Update CORS origin in `server/server.js`
- Add your Vercel URL to allowed origins
- Check environment variables

### Issue: Database Connection Fails

**Solution:**
- Verify MongoDB Atlas IP whitelist includes Vercel
- Check connection string format
- Ensure database user has correct permissions

### Issue: Environment Variables Not Working

**Solution:**
- Variables must start with `VITE_` for frontend
- Restart/redeploy after adding variables
- Check variable names match exactly

### Issue: Build Fails

**Solution:**
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure Node.js version is compatible (Vercel uses Node 18+ by default)

## Custom Domain Setup

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `VITE_API_URL` if needed

## Continuous Deployment

Vercel automatically deploys on every push to your main branch:
- Push to `main` → Auto-deploy
- Create pull request → Preview deployment
- Merge PR → Production deployment

## Monitoring

- **Logs:** View in Vercel dashboard → Deployments → View Function Logs
- **Analytics:** Enable in Project Settings
- **Errors:** Check Vercel dashboard for error logs

## Production Best Practices

1. **Use MongoDB Atlas** (not local MongoDB)
2. **Strong JWT Secret** (generate random 32+ character string)
3. **Environment Variables** (never commit secrets)
4. **HTTPS Only** (Vercel provides automatically)
5. **Monitor Logs** (check for errors regularly)

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support

