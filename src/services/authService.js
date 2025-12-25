import api from './api';

export const authService = {
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data.token) {
      localStorage.setItem('blog_auth_token', response.data.token);
      localStorage.setItem('blog_current_admin', JSON.stringify({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      }));
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('blog_auth_token', response.data.token);
      localStorage.setItem('blog_current_admin', JSON.stringify({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      }));
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('blog_auth_token');
    localStorage.removeItem('blog_current_admin');
  },

  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/update-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/update-profile', profileData);
    if (response.data) {
      // Update stored admin data
      const currentAdmin = JSON.parse(localStorage.getItem('blog_current_admin') || '{}');
      localStorage.setItem('blog_current_admin', JSON.stringify({
        ...currentAdmin,
        ...response.data
      }));
    }
    return response.data;
  }
};

