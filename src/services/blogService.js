import api from './api';

export const blogService = {
  getAllBlogs: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append('category', params.category);
    if (params.tag) queryParams.append('tag', params.tag);
    if (params.featured) queryParams.append('featured', params.featured);
    if (params.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    const url = `/blogs${queryString ? `?${queryString}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  getBlogBySlug: async (slug) => {
    const response = await api.get(`/blogs/${slug}`);
    return response.data;
  },

  getBlogById: async (id) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  createBlog: async (blogData) => {
    try {
      const response = await api.post('/blogs', blogData);
      return response.data;
    } catch (error) {
      console.error('Create blog API error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create blog';
      throw new Error(errorMessage);
    }
  },

  updateBlog: async (id, blogData) => {
    const response = await api.put(`/blogs/${id}`, blogData);
    return response.data;
  },

  deleteBlog: async (id) => {
    try {
      const response = await api.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete blog API error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete blog';
      throw new Error(errorMessage);
    }
  },

  getCategories: async () => {
    const response = await api.get('/blogs/categories/list');
    return response.data;
  },

  getTags: async () => {
    const response = await api.get('/blogs/tags/list');
    return response.data;
  }
};

