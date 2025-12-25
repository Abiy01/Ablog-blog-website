import { createContext, useContext, useState, useEffect } from 'react';
import { blogService } from '../services/blogService';

const BlogContext = createContext(undefined);

// Initial mock blog data (for fallback)
const initialBlogs = [
  {
    id: '1',
    title: 'The Art of Minimalist Design',
    slug: 'art-of-minimalist-design',
    excerpt: 'Discover how less truly becomes more in the world of modern design. We explore the principles that make minimalism so powerful.',
    content: `Minimalist design has revolutionized how we approach visual communication. At its core, minimalism is about stripping away the unnecessary to focus on what truly matters.

## The Core Principles

The foundation of minimalist design rests on several key principles that guide every decision:

**1. Less is More**

Every element must earn its place. If it doesn't serve a purpose, it shouldn't exist. This doesn't mean designs should be boring—it means every detail should be intentional.

**2. Whitespace is Your Friend**

Negative space isn't empty—it's breathing room. It gives your content space to shine and helps guide the viewer's eye through your design.

**3. Typography as Art**

In minimalist design, typography often takes center stage. Choose fonts carefully and let them speak for themselves.

> "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away." — Antoine de Saint-Exupéry

## Practical Application

When applying minimalist principles to your work, start by auditing your current designs. Ask yourself: Does this element serve the user? Does it communicate something essential?

The beauty of minimalism lies not in its simplicity, but in the clarity it brings to communication.`,
    coverImage: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1200&h=600&fit=crop',
    author: 'Sarah Chen',
    category: 'Design',
    tags: ['Design', 'Minimalism', 'UI/UX'],
    publishedAt: '2024-01-15',
    featured: true,
    status: 'published'
  },
  {
    id: '2',
    title: 'Building Scalable React Applications',
    slug: 'building-scalable-react-applications',
    excerpt: 'Learn the architectural patterns and best practices that will help your React applications grow sustainably.',
    content: `Building applications that scale is one of the biggest challenges developers face. In this guide, we'll explore patterns that have proven effective in production environments.

## Architecture Patterns

### Component Composition

The key to scalable React apps is thinking in terms of composition. Instead of building monolithic components, break them down into smaller, reusable pieces.

### State Management

As your application grows, state management becomes crucial. Consider these approaches:

- **Context API** for simple global state
- **Redux** for complex state with many interactions
- **React Query** for server state

## Code Organization

A well-organized codebase is easier to maintain and scale:

\`\`\`
src/
  components/
  pages/
  hooks/
  context/
  services/
  utils/
\`\`\`

## Performance Optimization

Don't optimize prematurely, but keep these tools in your arsenal:

1. React.memo for expensive components
2. useMemo and useCallback for expensive calculations
3. Code splitting with React.lazy

Remember: the best code is code that's easy to delete.`,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop',
    author: 'Michael Torres',
    category: 'Development',
    tags: ['React', 'JavaScript', 'Architecture'],
    publishedAt: '2024-01-10',
    featured: true,
    status: 'published'
  },
  {
    id: '3',
    title: 'The Future of Web Development',
    slug: 'future-of-web-development',
    excerpt: 'Explore emerging trends and technologies that are shaping the future of how we build for the web.',
    content: `The web platform is evolving faster than ever. Let's look at the trends that will define the next decade of web development.

## AI-Assisted Development

AI is transforming how we write code. From intelligent autocomplete to entire feature generation, developers are becoming more productive than ever.

## Edge Computing

The edge is bringing computation closer to users, reducing latency and enabling new types of applications.

## WebAssembly

WASM is opening the door to running any language in the browser at near-native speeds.

## What This Means for Developers

Stay curious, keep learning, and embrace change. The developers who thrive will be those who adapt.`,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop',
    author: 'Emily Watson',
    category: 'Technology',
    tags: ['Web Dev', 'Future', 'AI'],
    publishedAt: '2024-01-05',
    featured: false,
    status: 'published'
  },
  {
    id: '4',
    title: 'Mastering CSS Grid Layout',
    slug: 'mastering-css-grid-layout',
    excerpt: 'A comprehensive guide to CSS Grid—the most powerful layout system available in CSS today.',
    content: `CSS Grid has revolutionized web layouts. This guide will take you from basics to advanced techniques.

## Why Grid?

Grid gives us two-dimensional control over layouts. Unlike Flexbox, which is one-dimensional, Grid lets us control rows and columns simultaneously.

## Basic Concepts

The fundamental building blocks:

- **Grid Container**: The parent element
- **Grid Items**: Direct children
- **Grid Lines**: The dividing lines
- **Grid Tracks**: Rows and columns
- **Grid Cells**: Individual units
- **Grid Areas**: Named regions

## Practical Examples

Grid shines in complex layouts like dashboards, galleries, and magazine-style designs.

Start experimenting—Grid's power reveals itself through practice.`,
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop',
    author: 'Alex Rivera',
    category: 'Development',
    tags: ['CSS', 'Layout', 'Frontend'],
    publishedAt: '2024-01-01',
    featured: false,
    status: 'published'
  },
  {
    id: '5',
    title: 'The Psychology of Color in Design',
    slug: 'psychology-of-color-in-design',
    excerpt: 'Understanding how color affects user perception and behavior can transform your design decisions.',
    content: `Color is one of the most powerful tools in a designer's arsenal. Let's explore how to use it effectively.

## Color Psychology Basics

Different colors evoke different emotional responses:

- **Blue**: Trust, calm, professionalism
- **Red**: Energy, urgency, passion
- **Green**: Growth, nature, success
- **Yellow**: Optimism, warmth, caution
- **Purple**: Luxury, creativity, wisdom

## Cultural Considerations

Color meanings vary across cultures. What works in one market may not work in another.

## Creating Effective Palettes

Start with your brand values. What emotions do you want to evoke? Build your palette around that foundation.

## Accessibility

Always ensure sufficient contrast. Color should enhance, not hinder, usability.`,
    coverImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&h=600&fit=crop',
    author: 'Sarah Chen',
    category: 'Design',
    tags: ['Design', 'Color', 'Psychology'],
    publishedAt: '2023-12-28',
    featured: false,
    status: 'published'
  }
];

export function BlogProvider({ children }) {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  // Load blogs from API
  const loadBlogs = async () => {
    try {
      setIsLoading(true);
      const fetchedBlogs = await blogService.getAllBlogs();
      // Transform _id to id for compatibility
      const transformedBlogs = fetchedBlogs.map(blog => ({
        ...blog,
        id: blog._id,
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      }));
      setBlogs(transformedBlogs);
    } catch (error) {
      console.error('Error loading blogs:', error);
      // Fallback to empty array on error
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load categories and tags
  const loadCategoriesAndTags = async () => {
    try {
      const [cats, tagList] = await Promise.all([
        blogService.getCategories(),
        blogService.getTags()
      ]);
      setCategories(cats);
      setTags(tagList);
    } catch (error) {
      console.error('Error loading categories/tags:', error);
    }
  };

  // Initialize blogs from API
  useEffect(() => {
    loadBlogs();
    loadCategoriesAndTags();
  }, []);

  // Create a new blog post
  const createBlog = async (blogData) => {
    try {
      const newBlog = await blogService.createBlog(blogData);
      await loadBlogs(); // Reload blogs
      return {
        ...newBlog,
        id: newBlog._id,
        publishedAt: newBlog.publishedAt ? new Date(newBlog.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      };
    } catch (error) {
      // Error is already formatted by blogService
      throw error;
    }
  };

  // Update an existing blog post
  const updateBlog = async (id, blogData) => {
    try {
      const updatedBlog = await blogService.updateBlog(id, blogData);
      await loadBlogs(); // Reload blogs
      return {
        ...updatedBlog,
        id: updatedBlog._id,
        publishedAt: updatedBlog.publishedAt ? new Date(updatedBlog.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update blog');
    }
  };

  // Delete a blog post
  const deleteBlog = async (id) => {
    try {
      await blogService.deleteBlog(id);
      await loadBlogs(); // Reload blogs
    } catch (error) {
      // Error is already formatted by blogService
      throw error;
    }
  };

  // Get a single blog by slug (checks local first, then API)
  const getBlogBySlug = async (slug) => {
    // First check local state
    const localBlog = blogs.find(blog => blog.slug === slug);
    if (localBlog) {
      return localBlog;
    }
    // If not found locally, fetch from API
    try {
      const blog = await blogService.getBlogBySlug(slug);
      if (!blog) return null;
      const transformedBlog = {
        ...blog,
        id: blog._id,
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      };
      // Add to local state
      setBlogs(prev => [...prev, transformedBlog]);
      return transformedBlog;
    } catch (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
  };

  // Get a single blog by ID (from local state)
  const getBlogById = (id) => {
    return blogs.find(blog => blog.id === id || blog._id === id);
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

  // Get all unique categories (from API or local)
  const getCategories = () => {
    if (categories.length > 0) return categories;
    const localCategories = blogs.map(blog => blog.category);
    return [...new Set(localCategories)];
  };

  // Get all unique tags (from API or local)
  const getTags = () => {
    if (tags.length > 0) return tags;
    const localTags = blogs.flatMap(blog => blog.tags || []);
    return [...new Set(localTags)];
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
      getTags
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
