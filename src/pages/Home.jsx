import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { BlogCard } from '../components/BlogCard';
import { Button } from '../components/ui/button';

export default function Home() {
  const { getFeaturedBlogs, getPublishedBlogs } = useBlog();
  const featuredBlogs = getFeaturedBlogs();
  const recentBlogs = getPublishedBlogs().slice(0, 6);

  return (
    <>
      {/* SEO */}
      <title>Ablog - A Modern Blog for Ideas & Stories</title>
      <meta name="description" content="Discover thoughtful articles on design, development, and technology. Join our community of curious minds." />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Welcome to Ablog
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Where Ideas Take
              <span className="text-primary"> Flight</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A curated space for thoughtful writing on design, development, and the intersection of technology with everyday life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/blog">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Explore Articles
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </section>

      {/* Featured Posts */}
      {featuredBlogs.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">
                  Featured Stories
                </h2>
                <p className="text-muted-foreground">
                  Handpicked articles worth your time
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {featuredBlogs.slice(0, 2).map((blog, index) => (
                <div key={blog.id} className={`animate-fade-in-up stagger-${index + 1}`} style={{ opacity: 0 }}>
                  <BlogCard blog={blog} variant="featured" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">
                Latest Articles
              </h2>
              <p className="text-muted-foreground">
                Fresh perspectives and new ideas
              </p>
            </div>
            <Link to="/blog">
              <Button variant="outline" className="hidden sm:flex gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentBlogs.map((blog, index) => (
              <div key={blog.id} className={`animate-fade-in-up stagger-${index + 1}`} style={{ opacity: 0 }}>
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link to="/blog">
              <Button variant="outline" className="gap-2">
                View All Articles
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-2xl bg-primary p-8 md:p-16 text-center">
            <div className="relative z-10">
              <h2 className="font-heading text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Share Your Story?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Join our community of writers and share your unique perspective with the world.
              </p>
              <Link to="/contact">
                <Button variant="secondary" size="lg" className="gap-2">
                  Get in Touch
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/10 rounded-full blur-2xl" />
          </div>
        </div>
      </section>
    </>
  );
}
