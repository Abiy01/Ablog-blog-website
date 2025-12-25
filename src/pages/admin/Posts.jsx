import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Star, MoreVertical } from 'lucide-react';
import { useBlog } from '../../context/BlogContext';
import { Button } from '../../components/ui/button';
import { useToast } from '../../hooks/use-toast';

export default function Posts() {
  const { blogs, deleteBlog, updateBlog } = useBlog();
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenu, setOpenMenu] = useState(null);
  const { toast } = useToast();

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteBlog(id);
        toast({
          title: 'Post deleted',
          description: 'The blog post has been permanently deleted.',
        });
      } catch (error) {
        toast({
          title: 'Delete failed',
          description: error.message || 'Failed to delete post.',
          variant: 'destructive',
        });
      }
    }
    setOpenMenu(null);
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      await updateBlog(id, { featured: !currentFeatured });
      toast({
        title: currentFeatured ? 'Removed from featured' : 'Added to featured',
        description: currentFeatured 
          ? 'The post is no longer featured.' 
          : 'The post is now featured on the homepage.',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update post.',
        variant: 'destructive',
      });
    }
    setOpenMenu(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold mb-1">All Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog posts ({blogs.length} total)
          </p>
        </div>
        <Link to="/admin/posts/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Posts Table */}
      <div className="rounded-xl bg-card border border-border/50 shadow-soft overflow-hidden">
        {filteredBlogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium text-sm">Post</th>
                  <th className="text-left py-3 px-4 font-medium text-sm hidden md:table-cell">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-sm hidden lg:table-cell">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBlogs.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-14 rounded-lg overflow-hidden bg-muted flex-shrink-0 hidden sm:block">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate max-w-[200px] lg:max-w-none">
                              {post.title}
                            </p>
                            {post.featured && (
                              <Star className="h-4 w-4 text-accent fill-accent flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground md:hidden">
                            {post.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        post.status === 'published'
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                          : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/blog/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to={`/admin/posts/${post.id}/edit`}>
                          <Button variant="ghost" size="icon" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <div className="relative">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setOpenMenu(openMenu === post.id ? null : post.id)}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                          {openMenu === post.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setOpenMenu(null)}
                              />
                              <div className="absolute right-0 mt-1 w-48 py-1 rounded-lg bg-popover border border-border shadow-elevated z-20">
                                <button
                                  onClick={() => handleToggleFeatured(post.id, post.featured)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                                >
                                  <Star className={`h-4 w-4 ${post.featured ? 'fill-accent text-accent' : ''}`} />
                                  {post.featured ? 'Remove from featured' : 'Add to featured'}
                                </button>
                                <button
                                  onClick={() => handleDelete(post.id, post.title)}
                                  className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete post
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-medium mb-1">No posts found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery 
                ? 'Try adjusting your search query.' 
                : 'Create your first blog post to get started.'
              }
            </p>
            {!searchQuery && (
              <Link to="/admin/posts/new">
                <Button>Create Post</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
