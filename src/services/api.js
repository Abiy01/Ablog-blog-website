import axios from 'axios';

// Use environment variable or default to localhost for development
// In production, VITE_API_URL should be set to your Vercel deployment URL
const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD 
    ? '/api'  // Use relative path in production (same domain)
    : 'http://localhost:5000/api'  // Local development
);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('blog_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('blog_auth_token');
      localStorage.removeItem('blog_current_admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;

