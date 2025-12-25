import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Optional authentication - doesn't fail if no token, but sets req.user if valid token exists
export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Invalid token, but continue without user
      req.user = null;
    }
  }

  next();
};

