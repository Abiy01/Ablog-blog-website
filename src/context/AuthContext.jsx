import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(undefined);

const AUTH_TOKEN_KEY = 'blog_auth_token';
const CURRENT_ADMIN_KEY = 'blog_current_admin';

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage and verify with API
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedAdmin = localStorage.getItem(CURRENT_ADMIN_KEY);
      
      if (token && storedAdmin) {
        try {
          // Verify token with backend
          const userData = await authService.getCurrentUser();
          setAdmin({
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            role: userData.role
          });
        } catch (error) {
          // Token invalid, clear storage
          authService.logout();
          setAdmin(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Register a new admin
  const register = async (name, email, password) => {
    try {
      const userData = await authService.register(name, email, password);
      setAdmin({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      });
      return userData;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  // Login admin
  const login = async (email, password) => {
    try {
      const userData = await authService.login(email, password);
      setAdmin({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      });
      return userData;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Invalid email or password');
    }
  };

  // Logout admin
  const logout = () => {
    authService.logout();
    setAdmin(null);
  };

  // Refresh admin data
  const refreshAdmin = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setAdmin({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      });
      return userData;
    } catch (error) {
      console.error('Error refreshing admin:', error);
    }
  };

  // Check if authenticated
  const isAuthenticated = !!admin;

  return (
    <AuthContext.Provider value={{
      admin,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refreshAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
