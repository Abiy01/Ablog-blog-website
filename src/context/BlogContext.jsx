import { createContext, useContext, useState, useEffect } from 'react';
import { postsAPI } from '../lib/api';

const BlogContext = createContext(undefined);

export function BlogProvider({ children }) {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  // Initialize blogs from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [postsData, categoriesData, tagsData] = await Promise.all([
          postsAPI.getAll({ status: 'published' }),
          postsAPI.getCategories(),
          postsAPI.getTags(),
        ]);
        
        // Transform posts to match frontend format (id instead of _id)
        const transformedPosts = postsData.map(post => ({
          ...post,
          id: post._id,
        }));
        
        setBlogs(transformedPosts);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Refresh blogs from API
  const refreshBlogs = async () => {
    try {
      const postsData = await postsAPI.getAll();
      const transformedPosts = postsData.map(post => ({
        ...post,
        id: post._id,
      }));
      setBlogs(transformedPosts);
      
      // Refresh categories and tags
      const [categoriesData, tagsData] = await Promise.all([
        postsAPI.getCategories(),
        postsAPI.getTags(),
      ]);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error('Error refreshing blogs:', error);
    }
  };

  // Create a new blog post
  const createBlog = async (blogData) => {
    try {
      const newPost = await postsAPI.create(blogData);
      const transformedPost = { ...newPost, id: newPost._id };
      setBlogs([transformedPost, ...blogs]);
      await refreshBlogs(); // Refresh to get updated categories/tags
      return transformedPost;
    } catch (error) {
      throw error;
    }
  };

  // Update an existing blog post
  const updateBlog = async (id, blogData) => {
    try {
      const updatedPost = await postsAPI.update(id, blogData);
      const transformedPost = { ...updatedPost, id: updatedPost._id };
      setBlogs(blogs.map(blog => blog.id === id ? transformedPost : blog));
      await refreshBlogs(); // Refresh to get updated categories/tags
      return transformedPost;
    } catch (error) {
      throw error;
    }
  };

  // Delete a blog post
  const deleteBlog = async (id) => {
    try {
      await postsAPI.delete(id);
      setBlogs(blogs.filter(blog => blog.id !== id));
      await refreshBlogs(); // Refresh to get updated categories/tags
    } catch (error) {
      throw error;
    }
  };

  // Get a single blog by slug
  const getBlogBySlug = async (slug) => {
    try {
      const post = await postsAPI.getBySlug(slug);
      return { ...post, id: post._id };
    } catch (error) {
      console.error('Error fetching blog by slug:', error);
      return null;
    }
  };

  // Get a single blog by ID
  const getBlogById = async (id) => {
    try {
      // First check cache
      const cached = blogs.find(blog => blog.id === id);
      if (cached) return cached;
      
      // Fetch from API
      const post = await postsAPI.getById(id);
      return { ...post, id: post._id };
    } catch (error) {
      console.error('Error fetching blog by id:', error);
      return null;
    }
  };

  // Get featured blogs
  const getFeaturedBlogs = () => {
    return blogs.filter(blog => blog.featured && blog.status === 'published');
  };

  // Get published blogs
  const getPublishedBlogs = () => {
    return blogs.filter(blog => blog.status === 'published');
  };

  // Get blogs by category
  const getBlogsByCategory = (category) => {
    return blogs.filter(blog => blog.category === category && blog.status === 'published');
  };

  // Get all unique categories (from API)
  const getCategories = () => {
    return categories;
  };

  // Get all unique tags (from API)
  const getTags = () => {
    return tags;
  };

  return (
    <BlogContext.Provider value={{
      blogs,
      isLoading,
      createBlog,
      updateBlog,
      deleteBlog,
      getBlogBySlug,
      getBlogById,
      getFeaturedBlogs,
      getPublishedBlogs,
      getBlogsByCategory,
      getCategories,
      getTags,
      refreshBlogs
    }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
}
