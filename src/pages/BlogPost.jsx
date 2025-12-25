import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Clock, Share2 } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { BlogCard } from '../components/BlogCard';
import { Button } from '../components/ui/button';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getBlogBySlug, getPublishedBlogs } = useBlog();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadBlog = async () => {
      setIsLoading(true);
      const fetchedBlog = await getBlogBySlug(slug);
      setBlog(fetchedBlog);
      setIsLoading(false);
    };
    loadBlog();
  }, [slug]);
  
  const relatedBlogs = blog ? getPublishedBlogs()
    .filter(b => b.slug !== slug && b.category === blog?.category)
    .slice(0, 3) : [];

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(blog.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Estimate reading time (avg 200 words per minute)
  const wordCount = blog.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Could add a toast here
    }
  };

  return (
    <>
      {/* SEO */}
      <title>{blog.title} - Ablog</title>
      <meta name="description" content={blog.excerpt} />

      <article className="py-12 md:py-20">
        <div className="container max-w-4xl">
          {/* Back Button */}
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-10 animate-fade-in-up">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
                {blog.category}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {readingTime} min read
              </span>
            </div>

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {blog.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-6">
              {blog.excerpt}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{blog.author}</p>
                  <p className="text-sm text-muted-foreground">Author</p>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </header>

          {/* Cover Image */}
          <div className="mb-10 rounded-2xl overflow-hidden shadow-elevated animate-fade-in">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full aspect-[16/9] object-cover"
            />
          </div>

          {/* Content */}
          <div className="prose-blog animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            {blog.content.split('\n\n').map((paragraph, index) => {
              // Handle headings
              if (paragraph.startsWith('## ')) {
                return <h2 key={index}>{paragraph.slice(3)}</h2>;
              }
              if (paragraph.startsWith('### ')) {
                return <h3 key={index}>{paragraph.slice(4)}</h3>;
              }
              // Handle blockquotes
              if (paragraph.startsWith('> ')) {
                return <blockquote key={index}>{paragraph.slice(2)}</blockquote>;
              }
              // Handle bold text inline
              const formattedParagraph = paragraph.replace(
                /\*\*(.*?)\*\*/g, 
                '<strong>$1</strong>'
              );
              return (
                <p 
                  key={index} 
                  dangerouslySetInnerHTML={{ __html: formattedParagraph }}
                />
              );
            })}
          </div>

          {/* Tags */}
          <div className="mt-10 pt-8 border-t border-border">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {blog.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/blog?tag=${tag}`}
                  className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <section className="mt-16 py-16 bg-muted/30">
            <div className="container">
              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">
                Related Articles
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedBlogs.map((relatedBlog, index) => (
                  <div 
                    key={relatedBlog.id} 
                    className="animate-fade-in-up" 
                    style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
                  >
                    <BlogCard blog={relatedBlog} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}
