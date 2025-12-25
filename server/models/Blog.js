import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    sparse: true // Allow multiple null values for uniqueness
  },
  excerpt: {
    type: String,
    required: [true, 'Please provide an excerpt'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please provide content']
  },
  coverImage: {
    type: String,
    required: [true, 'Please provide a cover image URL']
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Design', 'Development', 'Technology']
  },
  tags: [{
    type: String,
    trim: true
  }],
  publishedAt: {
    type: Date,
    default: Date.now
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Generate slug from title before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    if (this.title) {
      let slug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Ensure slug is not empty
      if (!slug) {
        slug = 'blog-' + Date.now();
      }
      
      this.slug = slug;
    } else if (!this.slug) {
      // Fallback if no title
      this.slug = 'blog-' + Date.now();
    }
  }
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;

