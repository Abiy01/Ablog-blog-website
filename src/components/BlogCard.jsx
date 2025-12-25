import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

export function BlogCard({ blog, variant = 'default' }) {
  const formattedDate = new Date(blog.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (variant === 'featured') {
    return (
      <article className="group relative overflow-hidden rounded-2xl bg-gradient-card shadow-soft transition-all duration-300 hover:shadow-elevated">
        <Link to={`/blog/${blog.slug}`} className="block">
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 text-xs font-medium bg-primary/90 text-primary-foreground rounded-full">
                {blog.category}
              </span>
              <span className="text-sm text-background/80 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate}
              </span>
            </div>
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-background mb-2 group-hover:text-primary-foreground transition-colors">
              {blog.title}
            </h3>
            <p className="text-background/80 text-sm md:text-base line-clamp-2 mb-4">
              {blog.excerpt}
            </p>
            <div className="flex items-center gap-2 text-sm text-background/70">
              <User className="h-4 w-4" />
              <span>{blog.author}</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-card border border-border/50 shadow-soft transition-all duration-300 hover:shadow-elevated hover:border-border">
      <Link to={`/blog/${blog.slug}`} className="block">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
            {blog.category}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </span>
        </div>
        <Link to={`/blog/${blog.slug}`}>
          <h3 className="font-heading text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {blog.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {blog.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span>{blog.author}</span>
          </div>
          <Link 
            to={`/blog/${blog.slug}`}
            className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all"
          >
            Read more
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
