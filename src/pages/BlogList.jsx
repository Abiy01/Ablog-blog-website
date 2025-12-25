import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { BlogCard } from '../components/BlogCard';
import { Button } from '../components/ui/button';

export default function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getPublishedBlogs, getCategories, getTags } = useBlog();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const selectedCategory = searchParams.get('category') || '';
  const selectedTag = searchParams.get('tag') || '';

  const blogs = getPublishedBlogs();
  const categories = getCategories();
  const tags = getTags();

  // Filter blogs based on search, category, and tag
  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesSearch = !searchQuery || 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || blog.category === selectedCategory;
      const matchesTag = !selectedTag || blog.tags.includes(selectedTag);
      
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [blogs, searchQuery, selectedCategory, selectedTag]);

  const handleCategoryChange = (category) => {
    if (category === selectedCategory) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleTagChange = (tag) => {
    if (tag === selectedTag) {
      searchParams.delete('tag');
    } else {
      searchParams.set('tag', tag);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedTag;

  return (
    <>
      {/* SEO */}
      <title>Blog - Ablog</title>
      <meta name="description" content="Explore our collection of articles on design, development, and technology." />

      <div className="py-12 md:py-20">
        <div className="container">
          {/* Header */}
          <div className="max-w-2xl mb-12 animate-fade-in-up">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              The Blog
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore our collection of articles on design, development, technology, and more.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mb-10 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Filter Toggle (Mobile) */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    !
                  </span>
                )}
              </Button>
            </div>

            {/* Filters (Desktop always visible, Mobile toggle) */}
            <div className={`space-y-4 ${showFilters ? 'block' : 'hidden sm:block'}`}>
              {/* Categories */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground mr-2">
                  Categories:
                </span>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategoryChange(category)}
                    className="text-xs"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground mr-2">
                  Tags:
                </span>
                {tags.map(tag => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTagChange(tag)}
                    className="text-xs"
                  >
                    {tag}
                  </Button>
                ))}
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground gap-1"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </Button>
              )}
            </div>
          </div>

          {/* Results */}
          {filteredBlogs.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Showing {filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBlogs.map((blog, index) => (
                  <div 
                    key={blog.id} 
                    className="animate-fade-in-up" 
                    style={{ opacity: 0, animationDelay: `${index * 0.1}s` }}
                  >
                    <BlogCard blog={blog} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
