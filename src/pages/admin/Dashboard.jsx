import { Link } from 'react-router-dom';
import { FileText, Eye, TrendingUp, Users, Plus, ArrowRight } from 'lucide-react';
import { useBlog } from '../../context/BlogContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';

export default function Dashboard() {
  const { blogs, getPublishedBlogs, getFeaturedBlogs, getCategories } = useBlog();
  const { admin } = useAuth();

  const publishedCount = getPublishedBlogs().length;
  const featuredCount = getFeaturedBlogs().length;
  const categoriesCount = getCategories().length;

  const stats = [
    { label: 'Total Posts', value: blogs.length, icon: FileText, color: 'text-primary' },
    { label: 'Published', value: publishedCount, icon: Eye, color: 'text-green-500' },
    { label: 'Featured', value: featuredCount, icon: TrendingUp, color: 'text-accent' },
    { label: 'Categories', value: categoriesCount, icon: Users, color: 'text-blue-500' },
  ];

  const recentPosts = blogs.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold mb-1">
            Welcome back, {admin?.name || 'Admin'}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your blog today.
          </p>
        </div>
        <Link to="/admin/posts/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className="p-6 rounded-xl bg-card border border-border/50 shadow-soft animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold font-heading mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="rounded-xl bg-card border border-border/50 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Recent Posts</h2>
          <Link to="/admin/posts">
            <Button variant="ghost" size="sm" className="gap-1">
              View all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {recentPosts.length > 0 ? (
          <div className="divide-y divide-border">
            {recentPosts.map((post) => (
              <div key={post.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                <div className="h-12 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{post.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {post.category} • {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    post.status === 'published' 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {post.status}
                  </span>
                  <Link to={`/admin/posts/${post.id}/edit`}>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-medium mb-1">No posts yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first blog post to get started.
            </p>
            <Link to="/admin/posts/new">
              <Button>Create Post</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link 
          to="/admin/posts/new"
          className="p-6 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors group"
        >
          <Plus className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-heading font-semibold mb-1">Create New Post</h3>
          <p className="text-sm text-muted-foreground">
            Write and publish a new blog article.
          </p>
        </Link>

        <Link 
          to="/admin/posts"
          className="p-6 rounded-xl bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-colors group"
        >
          <FileText className="h-8 w-8 text-accent mb-3" />
          <h3 className="font-heading font-semibold mb-1">Manage Posts</h3>
          <p className="text-sm text-muted-foreground">
            Edit, delete, or feature existing posts.
          </p>
        </Link>

        <Link 
          to="/"
          target="_blank"
          className="p-6 rounded-xl bg-muted border border-border hover:bg-muted/80 transition-colors group"
        >
          <Eye className="h-8 w-8 text-muted-foreground mb-3" />
          <h3 className="font-heading font-semibold mb-1">View Site</h3>
          <p className="text-sm text-muted-foreground">
            Preview how your blog looks to visitors.
          </p>
        </Link>
      </div>
    </div>
  );
}
