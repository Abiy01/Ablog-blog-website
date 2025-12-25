# Setup Guide - Ablog MERN Stack Application

This guide will help you set up both the frontend and backend of the Ablog application.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Backend Setup

### 1. Navigate to server directory

```bash
cd server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ablog
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important Notes:**
- For local MongoDB: Use `mongodb://localhost:27017/ablog`
- For MongoDB Atlas: Use your connection string from Atlas dashboard
- Change `JWT_SECRET` to a secure random string (at least 32 characters)

### 4. Start MongoDB

**Local MongoDB:**
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
# Start MongoDB service from Services panel
```

**MongoDB Atlas:**
- No local setup needed, just use your connection string

### 5. Run the backend server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to project root

```bash
cd ..  # If you're in the server directory
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the frontend

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is taken)

## Testing the Setup

### 1. Check Backend Health

Open your browser or use curl:
```bash
curl http://localhost:5000/api/health
```

You should see: `{"message":"Server is running","status":"OK"}`

### 2. Register a User

1. Open the frontend at `http://localhost:5173`
2. Navigate to `/admin/register`
3. Create an admin account
4. You should be automatically logged in

### 3. Create a Blog Post

1. After logging in, go to `/admin/posts/new`
2. Fill in the form and create a blog post
3. The post should appear in your blog list

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoServerError: connect ECONNREFUSED"**
- Make sure MongoDB is running
- Check if the connection string in `.env` is correct
- For MongoDB Atlas, ensure your IP is whitelisted

### CORS Errors

- Make sure the backend is running on port 5000
- Check that `VITE_API_URL` in frontend `.env` matches the backend URL

### Authentication Issues

- Clear browser localStorage if you're having login issues
- Check that JWT_SECRET is set in backend `.env`
- Verify the token is being sent in API requests (check browser DevTools Network tab)

### Port Already in Use

If port 5000 is taken:
- Change `PORT` in backend `.env`
- Update `VITE_API_URL` in frontend `.env` to match

## Project Structure

```
admin-dashboard-pro/
├── server/                 # Backend (Node.js/Express)
│   ├── config/            # Database configuration
│   ├── middleware/         # Auth middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── utils/             # Utilities
│   ├── .env               # Backend environment variables
│   └── server.js          # Main server file
├── src/                    # Frontend (React)
│   ├── components/         # React components
│   ├── context/           # React contexts
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── ...
├── .env                   # Frontend environment variables
└── package.json           # Frontend dependencies
```

## Next Steps

- Read [README_BACKEND.md](./README_BACKEND.md) for detailed API documentation
- Customize the blog categories and tags
- Add more features as needed
- Deploy to production (see deployment guides for your hosting platform)

## Support

If you encounter issues:
1. Check the console logs (both browser and terminal)
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check that both frontend and backend servers are running

