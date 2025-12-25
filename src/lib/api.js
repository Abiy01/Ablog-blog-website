const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to make API requests
async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    // Check if response has content
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    }

    if (!response.ok) {
      // Handle validation errors
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessage = data.errors.map(err => err.msg || err.message).join(', ');
        throw new Error(errorMessage);
      }
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    // If it's already an Error object, throw it
    if (error instanceof Error) {
      throw error;
    }
    // Otherwise, wrap it in an Error
    throw new Error(error.message || 'Network error occurred');
  }
}

// Auth API
export const authAPI = {
  register: async (name, email, password) => {
    return request('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
  },

  login: async (email, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    // Store token
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  },

  getMe: async () => {
    return request('/auth/me');
  },
};

// Posts API
export const postsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.featured !== undefined) params.append('featured', filters.featured);
    if (filters.category) params.append('category', filters.category);
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.search) params.append('search', filters.search);

    const queryString = params.toString();
    return request(`/posts${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return request(`/posts/${id}`);
  },

  getBySlug: async (slug) => {
    return request(`/posts/slug/${slug}`);
  },

  create: async (postData) => {
    return request('/posts', {
      method: 'POST',
      body: postData,
    });
  },

  update: async (id, postData) => {
    return request(`/posts/${id}`, {
      method: 'PUT',
      body: postData,
    });
  },

  delete: async (id) => {
    return request(`/posts/${id}`, {
      method: 'DELETE',
    });
  },

  getCategories: async () => {
    return request('/posts/categories');
  },

  getTags: async () => {
    return request('/posts/tags');
  },
};

// Contact API
export const contactAPI = {
  submit: async (contactData) => {
    return request('/contact', {
      method: 'POST',
      body: contactData,
    });
  },
};

// Admin API
export const adminAPI = {
  getStats: async () => {
    return request('/admin/stats');
  },

  updateProfile: async (profileData) => {
    return request('/admin/profile', {
      method: 'PUT',
      body: profileData,
    });
  },

  updatePassword: async (passwordData) => {
    return request('/admin/password', {
      method: 'PUT',
      body: passwordData,
    });
  },
};

