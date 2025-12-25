import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';

const AuthContext = createContext(undefined);

const CURRENT_ADMIN_KEY = 'blog_current_admin';

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from token
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedAdmin = localStorage.getItem(CURRENT_ADMIN_KEY);
      
      if (token && storedAdmin) {
        try {
          // Verify token is still valid by fetching current user
          const userData = await authAPI.getMe();
          setAdmin({
            id: userData._id,
            name: userData.name,
            email: userData.email,
          });
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem(CURRENT_ADMIN_KEY);
          setAdmin(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Register a new admin
  const register = async (name, email, password) => {
    try {
      const data = await authAPI.register(name, email, password);
      
      // Store token and admin data
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      const adminData = {
        id: data._id,
        name: data.name,
        email: data.email,
      };
      localStorage.setItem(CURRENT_ADMIN_KEY, JSON.stringify(adminData));
      setAdmin(adminData);

      return adminData;
    } catch (error) {
      throw error;
    }
  };

  // Login admin
  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      
      const adminData = {
        id: data._id,
        name: data.name,
        email: data.email,
      };
      localStorage.setItem(CURRENT_ADMIN_KEY, JSON.stringify(adminData));
      setAdmin(adminData);

      return adminData;
    } catch (error) {
      throw error;
    }
  };

  // Logout admin
  const logout = () => {
    authAPI.logout();
    localStorage.removeItem(CURRENT_ADMIN_KEY);
    setAdmin(null);
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
      logout
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
