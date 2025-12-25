import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts (with optional filters)
// @access  Public
router.get(
  '/',
  [
    query('status').optional().isIn(['published', 'draft']),
    query('featured').optional().isBoolean(),
    query('category').optional().isString(),
    query('tag').optional().isString(),
    query('search').optional().isString(),
  ],
  async (req, res) => {
    try {
      const { status, featured, category, tag, search } = req.query;

      // Build query
      const queryObj = {};

      // If not admin, only show published posts
      if (!req.headers.authorization) {
        queryObj.status = 'published';
      } else if (status) {
        queryObj.status = status;
      }

      if (featured !== undefined) {
        queryObj.featured = featured === 'true';
      }

      if (category) {
        queryObj.category = category;
      }

      if (tag) {
        queryObj.tags = { $in: [tag] };
      }

      if (search) {
        queryObj.$or = [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ];
      }

      const posts = await Post.find(queryObj)
        .populate('authorId', 'name email')
        .sort({ publishedAt: -1 });

      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/posts/categories
// @desc    Get all unique categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Post.distinct('category', {
      status: 'published',
    });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/tags
// @desc    Get all unique tags
// @access  Public
router.get('/tags', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' }).select('tags');
    const allTags = posts.flatMap((post) => post.tags);
    const uniqueTags = [...new Set(allTags)];
    res.json(uniqueTags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'authorId',
      'name email'
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/slug/:slug
// @desc    Get post by slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate(
      'authorId',
      'name email'
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post(
  '/',
  protect,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('category')
      .isIn(['Design', 'Development', 'Technology', 'Business', 'Lifestyle'])
      .withMessage('Invalid category'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        title,
        excerpt,
        content,
        coverImage,
        category,
        tags,
        featured,
        status,
      } = req.body;

      // Generate slug
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if slug already exists
      const existingPost = await Post.findOne({ slug });
      if (existingPost) {
        return res
          .status(400)
          .json({ message: 'A post with this title already exists' });
      }

      // Process tags - handle both string and array
      let tagsArray = [];
      if (tags) {
        if (Array.isArray(tags)) {
          tagsArray = tags.map((tag) => String(tag).trim()).filter(Boolean);
        } else {
          tagsArray = tags.split(',').map((tag) => tag.trim()).filter(Boolean);
        }
      }

      const post = await Post.create({
        title,
        slug,
        excerpt: excerpt || '',
        content,
        coverImage: coverImage || '',
        author: req.user.name,
        authorId: req.user._id,
        category,
        tags: tagsArray,
        featured: featured || false,
        status: status || 'published',
        publishedAt: status === 'published' ? new Date() : null,
      });

      const populatedPost = await Post.findById(post._id).populate(
        'authorId',
        'name email'
      );

      res.status(201).json(populatedPost);
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Slug already exists' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put(
  '/:id',
  protect,
  [
    body('title').optional().trim().notEmpty(),
    body('category')
      .optional()
      .isIn(['Design', 'Development', 'Technology', 'Business', 'Lifestyle']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Check if user is the author
      if (post.authorId.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: 'Not authorized to update this post' });
      }

      const {
        title,
        excerpt,
        content,
        coverImage,
        category,
        tags,
        featured,
        status,
      } = req.body;

      // Update slug if title changed
      if (title && title !== post.title) {
        const newSlug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        // Check if new slug exists
        const existingPost = await Post.findOne({ slug: newSlug });
        if (existingPost && existingPost._id.toString() !== post._id.toString()) {
          return res
            .status(400)
            .json({ message: 'A post with this title already exists' });
        }

        post.slug = newSlug;
        post.title = title;
      }

      if (excerpt !== undefined) post.excerpt = excerpt;
      if (content !== undefined) post.content = content;
      if (coverImage !== undefined) post.coverImage = coverImage;
      if (category !== undefined) post.category = category;
      if (tags !== undefined) {
        // Handle both string and array
        if (Array.isArray(tags)) {
          post.tags = tags.map((tag) => String(tag).trim()).filter(Boolean);
        } else {
          post.tags = tags.split(',').map((tag) => tag.trim()).filter(Boolean);
        }
      }
      if (featured !== undefined) post.featured = featured;
      if (status !== undefined) {
        post.status = status;
        if (status === 'published' && !post.publishedAt) {
          post.publishedAt = new Date();
        }
      }

      await post.save();

      const updatedPost = await Post.findById(post._id).populate(
        'authorId',
        'name email'
      );

      res.json(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.authorId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

