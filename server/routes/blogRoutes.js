import express from 'express';
import { body, validationResult } from 'express-validator';
import Blog from '../models/Blog.js';
import { protect } from '../middleware/auth.js';
import { optionalAuth } from '../middleware/optionalAuth.js';

const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all blogs (public - only published)
// @access  Public (optional auth for admins)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, tag, featured, status } = req.query;
    let query = {};

    // Only show published blogs to public
    if (!req.user) {
      query.status = 'published';
    } else {
      // Admins can see all blogs
      if (status) {
        query.status = status;
      }
    }

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1 })
      .populate('createdBy', 'name email');

    res.json(blogs);
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/blogs/:slug
// @desc    Get single blog by slug
// @access  Public (optional auth for admins)
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('createdBy', 'name email');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Only show published blogs to non-authenticated users
    if (!req.user && blog.status !== 'published') {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blogs
// @desc    Create a new blog
// @access  Private
router.post('/', protect, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('excerpt').trim().notEmpty().withMessage('Excerpt is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('coverImage').notEmpty().withMessage('Cover image is required'),
  body('author').trim().notEmpty().withMessage('Author is required'),
  body('category').isIn(['Design', 'Development', 'Technology']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    // Log received data for debugging
    console.log('Creating blog with data:', {
      title: req.body.title,
      category: req.body.category,
      author: req.body.author,
      hasContent: !!req.body.content,
      hasExcerpt: !!req.body.excerpt,
      hasCoverImage: !!req.body.coverImage,
      tags: req.body.tags,
      userId: req.user._id
    });

    const blogData = {
      ...req.body,
      createdBy: req.user._id
    };

    const blog = await Blog.create(blogData);
    const populatedBlog = await Blog.findById(blog._id)
      .populate('createdBy', 'name email');

    console.log('Blog created successfully:', blog._id);
    res.status(201).json(populatedBlog);
  } catch (error) {
    console.error('Create blog error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      errors: error.errors
    });
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A blog with this slug already exists' });
    }
    
    // Return more specific error message
    const errorMessage = error.message || 'Server error';
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private
router.put('/:id', protect, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('category').optional().isIn(['Design', 'Development', 'Technology']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the creator
    if (blog.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }

    // Update blog
    Object.assign(blog, req.body);
    
    // Regenerate slug if title changed
    if (req.body.title) {
      blog.slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    await blog.save();
    const updatedBlog = await Blog.findById(blog._id)
      .populate('createdBy', 'name email');

    res.json(updatedBlog);
  } catch (error) {
    console.error('Update blog error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A blog with this slug already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the creator
    if (blog.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/blogs/categories/list
// @desc    Get all unique categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Blog.distinct('category', { status: 'published' });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/blogs/tags/list
// @desc    Get all unique tags
// @access  Public
router.get('/tags/list', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' }).select('tags');
    const allTags = blogs.flatMap(blog => blog.tags);
    const uniqueTags = [...new Set(allTags)];
    res.json(uniqueTags);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

