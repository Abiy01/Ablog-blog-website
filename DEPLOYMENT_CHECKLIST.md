# Pre-Deployment Checklist

Use this checklist before deploying to Vercel to ensure everything is ready.

## ✅ Code Preparation

- [ ] All code is committed to Git
- [ ] `.env` files are in `.gitignore` (never commit secrets!)
- [ ] No hardcoded API keys or secrets in code
- [ ] All dependencies are in `package.json`
- [ ] Build command works locally (`npm run build`)

## ✅ Environment Variables

### Frontend (.env or Vercel Environment Variables):
- [ ] `VITE_API_URL` - Your production API URL
- [ ] `VITE_WEB3FORMS_ACCESS_KEY` - Web3Forms access key

### Backend (Vercel Environment Variables):
- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Strong secret (32+ characters)
- [ ] `JWT_EXPIRE` - Token expiration (e.g., "7d")
- [ ] `NODE_ENV` - Set to "production"
- [ ] `PORT` - Optional (Vercel handles this)

## ✅ Database Setup

- [ ] MongoDB Atlas cluster is created
- [ ] Database user is created with proper permissions
- [ ] Network Access allows Vercel IPs (or 0.0.0.0/0 for development)
- [ ] Connection string is tested and working
- [ ] Database name is correct (e.g., "ablog")

## ✅ API Configuration

- [ ] CORS is configured for production domain
- [ ] API routes are properly set up
- [ ] Error handling is in place
- [ ] Health check endpoint works (`/api/health`)

## ✅ Frontend Configuration

- [ ] API service points to correct URL
- [ ] All environment variables use `VITE_` prefix
- [ ] Build output directory is `dist`
- [ ] No console errors in production build

## ✅ Third-Party Services

- [ ] Web3Forms access key is obtained
- [ ] Web3Forms email is verified
- [ ] All external API keys are ready

## ✅ Testing

- [ ] Test user registration
- [ ] Test user login
- [ ] Test blog post creation
- [ ] Test blog post viewing
- [ ] Test contact form submission
- [ ] Test password change
- [ ] Test profile update

## ✅ Files Created

- [ ] `vercel.json` exists and is configured
- [ ] `api/index.js` exists (for serverless functions)
- [ ] `.vercelignore` exists
- [ ] All necessary files are committed

## ✅ Documentation

- [ ] README is updated
- [ ] Deployment guide is ready
- [ ] Environment variables are documented

## Pre-Deployment Commands

Run these locally to verify everything works:

```bash
# Install dependencies
npm install
cd server && npm install && cd ..

# Test build
npm run build

# Check for errors
npm run lint

# Verify environment variables (don't commit .env!)
# Make sure .env exists with all required variables
```

## After Deployment

1. [ ] Test all features on production URL
2. [ ] Verify emails are received from contact form
3. [ ] Check Vercel logs for any errors
4. [ ] Update `VITE_API_URL` with actual production URL
5. [ ] Test on mobile devices
6. [ ] Verify HTTPS is working
7. [ ] Check loading times and performance

## Common Issues to Watch For

- **CORS errors:** Update CORS origin in server
- **404 on API routes:** Check vercel.json configuration
- **Database connection fails:** Verify MongoDB Atlas IP whitelist
- **Environment variables not working:** Check VITE_ prefix and redeploy
- **Build fails:** Check Node.js version compatibility

## Quick Deploy Commands

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy from CLI
vercel

# Deploy to production
vercel --prod
```

## Need Help?

- Check `VERCEL_DEPLOYMENT.md` for detailed guide
- Review Vercel logs in dashboard
- Check MongoDB Atlas logs
- Verify all environment variables are set

