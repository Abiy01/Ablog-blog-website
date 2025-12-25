# Ablog Backend - MERN Stack

This is the backend API for the Ablog application built with Node.js, Express, and MongoDB.

## Features

- User authentication (Register, Login, JWT)
- Blog CRUD operations
- Protected routes with JWT middleware
- MongoDB database with Mongoose
- Express validation
- CORS enabled

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ablog
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` to a secure random string in production!

### 3. MongoDB Setup

Make sure MongoDB is installed and running on your system:

- **Local MongoDB**: Install from [mongodb.com](https://www.mongodb.com/try/download/community)
- **MongoDB Atlas**: Use a cloud MongoDB instance

Update `MONGODB_URI` in `.env` accordingly.

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new admin user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Blogs

- `GET /api/blogs` - Get all blogs (Protected - admins see all, public see only published)
- `GET /api/blogs/:slug` - Get blog by slug
- `POST /api/blogs` - Create new blog (Protected)
- `PUT /api/blogs/:id` - Update blog (Protected)
- `DELETE /api/blogs/:id` - Delete blog (Protected)
- `GET /api/blogs/categories/list` - Get all categories
- `GET /api/blogs/tags/list` - Get all tags

### Health Check

- `GET /api/health` - Server health check

## Frontend Configuration

Update your frontend `.env` file (or create one) with:

```env
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
server/
├── config/
│   └── database.js      # MongoDB connection
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── models/
│   ├── User.js          # User model
│   └── Blog.js          # Blog model
├── routes/
│   ├── authRoutes.js    # Authentication routes
│   └── blogRoutes.js    # Blog routes
├── utils/
│   └── generateToken.js # JWT token generator
├── .env                 # Environment variables
├── .gitignore
├── package.json
└── server.js            # Main server file
```

## Testing the API

You can test the API using tools like:
- Postman
- Thunder Client (VS Code extension)
- curl
- Frontend application

### Example: Register a user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@ablog.com",
    "password": "password123"
  }'
```

### Example: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ablog.com",
    "password": "password123"
  }'
```

### Example: Create blog (with token)

```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Blog Post",
    "excerpt": "This is an excerpt",
    "content": "Full content here",
    "coverImage": "https://example.com/image.jpg",
    "author": "Admin User",
    "category": "Development",
    "tags": ["React", "Node.js"]
  }'
```

## Notes

- All passwords are hashed using bcryptjs
- JWT tokens expire after 7 days (configurable)
- Only blog creators can update/delete their own blogs
- Public users can only see published blogs
- Admins can see all blogs (published and draft)

