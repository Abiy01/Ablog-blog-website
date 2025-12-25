import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Image, X } from 'lucide-react';
import { useBlog } from '../../context/BlogContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { useToast } from '../../hooks/use-toast';

const categories = ['Design', 'Development', 'Technology', 'Business', 'Lifestyle'];

const defaultCoverImages = [
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1485988412941-77a35537dae4?w=1200&h=600&fit=crop',
];

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBlogById, createBlog, updateBlog } = useBlog();
  const { admin } = useAuth();
  const { toast } = useToast();

  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Development',
    tags: '',
    coverImage: defaultCoverImages[0],
    featured: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Load existing post data if editing
  useEffect(() => {
    const loadPost = async () => {
      if (isEditing) {
        try {
          const post = await getBlogById(id);
          if (post) {
            setFormData({
              title: post.title,
              excerpt: post.excerpt || '',
              content: post.content,
              category: post.category,
              tags: post.tags ? post.tags.join(', ') : '',
              coverImage: post.coverImage || '',
              featured: post.featured || false,
            });
          } else {
            toast({
              title: 'Post not found',
              description: 'The post you are trying to edit does not exist.',
              variant: 'destructive',
            });
            navigate('/admin/posts');
          }
        } catch (error) {
          toast({
            title: 'Error loading post',
            description: 'Failed to load post data.',
            variant: 'destructive',
          });
          navigate('/admin/posts');
        }
      }
    };
    loadPost();
  }, [id, isEditing, getBlogById, navigate, toast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in the title and content.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const postData = {
        title: formData.title,
        excerpt: formData.excerpt || '',
        content: formData.content,
        coverImage: formData.coverImage || '',
        category: formData.category,
        tags: formData.tags, // Send as string, backend will process it
        featured: formData.featured || false,
        status: 'published', // Default to published
      };

      if (isEditing) {
        await updateBlog(id, postData);
        toast({
          title: 'Post updated',
          description: 'Your blog post has been successfully updated.',
        });
      } else {
        await createBlog(postData);
        toast({
          title: 'Post created',
          description: 'Your blog post has been successfully published.',
        });
      }

      navigate('/admin/posts');
    } catch (error) {
      console.error('Error creating/updating post:', error);
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/admin/posts"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to posts
        </Link>
        <h1 className="font-heading text-2xl font-bold">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Image */}
        <div className="rounded-xl border border-border overflow-hidden bg-card">
          <div className="aspect-[21/9] relative">
            <img
              src={formData.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowImagePicker(!showImagePicker)}
                className="gap-2"
              >
                <Image className="h-4 w-4" />
                Change Cover
              </Button>
            </div>
          </div>

          {showImagePicker && (
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">Select a cover image</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowImagePicker(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {defaultCoverImages.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, coverImage: img }));
                      setShowImagePicker(false);
                    }}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                      formData.coverImage === img ? 'border-primary' : 'border-transparent hover:border-border'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <input
                  type="url"
                  placeholder="Or paste an image URL..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background"
                  onBlur={(e) => {
                    if (e.target.value) {
                      setFormData(prev => ({ ...prev, coverImage: e.target.value }));
                      setShowImagePicker(false);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 text-lg font-heading rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter a compelling title..."
          />
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            placeholder="A brief summary of your post..."
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Content <span className="text-destructive">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={15}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-y font-body"
            placeholder="Write your post content here. Use ## for headings, > for quotes, **text** for bold..."
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Tip: Use ## for headings, {'>'} for blockquotes, and **text** for bold.
          </p>
        </div>

        {/* Category & Tags */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="React, JavaScript, Web Dev"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Separate tags with commas
            </p>
          </div>
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
          />
          <label htmlFor="featured" className="text-sm font-medium">
            Feature this post on the homepage
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
          <Link to="/admin/posts">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEditing ? 'Update Post' : 'Publish Post'}
          </Button>
        </div>
      </form>
    </div>
  );
}
