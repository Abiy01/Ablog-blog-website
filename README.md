https://ablog-blog-website.vercel.app/

# Ablog - Blog Website

A modern, full-stack blog website built with React (Vite) frontend and MERN stack backend.

## Features

### Frontend
- Modern React UI with Tailwind CSS and shadcn/ui components
- Responsive design
- Dark mode support
- Blog post management
- Admin dashboard
- Contact form with Web3Forms integration
- Search and filtering
- Category and tag filtering

### Backend
- Express.js REST API
- MongoDB database
- JWT authentication
- Protected admin routes
- Full CRUD operations for blog posts
- Admin dashboard statistics

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- React Query

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Quick Start

#### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ablog
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

Start MongoDB (if running locally):
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
# Start MongoDB service from Services panel
```

Start the backend:
```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`

#### 2. Frontend Setup

```bash
# From project root
npm install
```

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api

# Web3Forms Configuration (for contact form)
# Get your access key from https://web3forms.com/
# Just enter your email address and you'll receive an access key
VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key_here
```

Start the frontend:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

#### 3. Configure Web3Forms (for Contact Form)

1. Visit [Web3Forms](https://web3forms.com/)
2. Enter your email address to receive an access key
3. Add the access key to your `.env` file as `VITE_WEB3FORMS_ACCESS_KEY`
4. The contact form will now send submissions directly to your email

#### 4. First Steps

1. Open `http://localhost:5173` in your browser
2. Navigate to `/admin/register` to create your first admin account
3. Login at `/admin/login`
4. Start creating blog posts!

## MongoDB Setup Options

### Option 1: Local MongoDB
- Install MongoDB locally
- Use connection string: `mongodb://localhost:27017/ablog`

### Option 2: MongoDB Atlas (Cloud)
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster
- Get connection string
- Update `MONGODB_URI` in `.env` with your Atlas connection string

## Project Structure

```
ablog-blog-website/
├── server/                 # Backend API
│   ├── config/            # Database configuration
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth and error middleware
│   └── server.js          # Express server
├── src/                   # Frontend React app
│   ├── components/        # React components
│   ├── context/           # React contexts
│   ├── pages/             # Page components
│   ├── lib/               # Utilities and API client
│   └── layouts/           # Layout components
└── public/                # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new admin
- `POST /api/auth/login` - Login admin
- `GET /api/auth/me` - Get current user (protected)

### Blog Posts
- `GET /api/posts` - Get all posts (with optional filters: status, featured, category, tag, search)
- `GET /api/posts/:id` - Get post by ID
- `GET /api/posts/slug/:slug` - Get post by slug
- `GET /api/posts/categories` - Get all categories
- `GET /api/posts/tags` - Get all tags
- `POST /api/posts` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (protected)
- `GET /api/contact/:id` - Get contact by ID (protected)
- `PUT /api/contact/:id/status` - Update contact status (protected)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics (protected)
- `PUT /api/admin/profile` - Update admin profile (protected)
- `PUT /api/admin/password` - Change password (protected)

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Database Models

### User
- name, email, password, role

### Post
- title, slug, excerpt, content, coverImage, author, authorId, category, tags, publishedAt, featured, status, views

### Contact
- name, email, subject, message, status

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Check if port 5000 is available

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend

### Authentication issues
- Clear browser localStorage
- Check JWT_SECRET is set in backend `.env`
- Verify token is being sent in API requests

### Post creation not working
- Make sure you're logged in as admin
- Check if JWT token is stored in localStorage
- Verify all required fields are filled (title, content, category)
- Check browser console and network tab for errors

### Common Issues

#### "Not authorized, no token"
**Solution**: Make sure you're logged in. Token should be in localStorage.

#### "Title is required" or validation errors
**Solution**: Make sure all required fields are filled:
- Title (required)
- Content (required)
- Category (required, must be one of: Design, Development, Technology, Business, Lifestyle)

#### "A post with this title already exists"
**Solution**: The slug generated from your title already exists. Try a different title.

#### CORS errors
**Solution**: 
- Check `FRONTEND_URL` in backend `.env` matches your frontend URL
- Default should be: `http://localhost:5173`

#### MongoDB connection errors
**Solution**:
- Make sure MongoDB is running
- Check `MONGODB_URI` in backend `.env`
- For local MongoDB: `mongodb://localhost:27017/ablog`

## Deployment to Vercel

### Frontend Deployment (Vercel)

1. **Push your code to GitHub** (if not already done)

2. **Go to [vercel.com](https://vercel.com)** and sign in

3. **Click "New Project"** and import your repository

4. **Vercel will auto-detect Vite** - no configuration needed!

5. **Add Environment Variables** in Vercel Dashboard:
   - `VITE_API_URL` - Your backend API URL (set this after deploying backend)
   - `VITE_WEB3FORMS_ACCESS_KEY` - Your Web3Forms access key

6. **Click Deploy** - Vercel will automatically build and deploy

### Backend Deployment (Render)

Render is a great option for deploying your backend. You can use the provided `render.yaml` file for easy setup:

#### Option 1: Using render.yaml (Recommended)

1. **Push your code to GitHub** (if not already done)

2. **Go to [render.com](https://render.com)** and sign in

3. **Create a New Web Service**:
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

4. **Configure Environment Variables** in Render Dashboard:
   - `NODE_ENV` = `production` (already set in render.yaml)
   - `MONGODB_URI` - Your MongoDB connection string (MongoDB Atlas recommended)
   - `JWT_SECRET` - Generate a secure secret: `openssl rand -base64 32`
   - `JWT_EXPIRE` = `7d` (already set in render.yaml)
   - `FRONTEND_URL` - Your frontend URL (e.g., `https://your-app.vercel.app`)

5. **Deploy** - Render will automatically build and deploy

#### Option 2: Manual Setup

1. **Go to [render.com](https://render.com)** and sign in

2. **Create a New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure the Service**:
   - **Name**: `ablog-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Add Environment Variables**:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render sets this automatically, but you can specify)
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Generate with: `openssl rand -base64 32`
   - `JWT_EXPIRE` = `7d`
   - `FRONTEND_URL` - Your frontend URL (e.g., `https://your-app.vercel.app`)

5. **Deploy** - Click "Create Web Service"

6. **Get Backend URL** from Render (e.g., `https://ablog-backend.onrender.com`)

7. **Update Frontend Environment Variables**:
   - Update `VITE_API_URL` to: `https://ablog-backend.onrender.com/api`

#### MongoDB Setup for Render

1. **Create MongoDB Atlas Cluster** (free tier available):
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string
   - Add your Render service IP to Atlas IP whitelist (or use `0.0.0.0/0` for all IPs)

2. **Or use Render's MongoDB**:
   - In Render dashboard, click "New +" → "MongoDB"
   - Render will provide the connection string automatically

### Alternative Backend Hosting

**Heroku**:
- Install Heroku CLI
- `heroku create your-app-name`
- `heroku config:set KEY=value`
- `git push heroku main`

### Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend `VITE_API_URL` points to backend
- [ ] Backend `FRONTEND_URL` points to Vercel frontend
- [ ] MongoDB Atlas configured (if using cloud)
- [ ] Web3Forms access key set
- [ ] Test admin registration/login
- [ ] Test creating blog posts
- [ ] Test contact form

### Important Notes

- **Backend URL**: Update `VITE_API_URL` in Vercel after backend deployment
- **CORS**: Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly (include `https://`)
- **MongoDB**: Use MongoDB Atlas free tier for production
- **Environment Variables**: Never commit `.env` files - use platform environment variables

## Environment Variables

### Frontend (.env)
- `VITE_API_URL` - Backend API URL
- `VITE_WEB3FORMS_ACCESS_KEY` - Web3Forms access key for contact form

### Backend (server/.env)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT expiration time
- `FRONTEND_URL` - Frontend URL for CORS

## License

ISC
