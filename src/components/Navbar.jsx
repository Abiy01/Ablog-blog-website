import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PenSquare, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';

const publicLinks = [
  { name: 'Home', path: '/' },
  { name: 'Blog', path: '/blog' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, admin, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight transition-colors hover:text-primary"
        >
          <PenSquare className="h-6 w-6 text-primary" />
          <span>Ablog</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-1">
          {publicLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.path) 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex md:items-center md:gap-3">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/admin/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/admin/login">
              <Button variant="default" size="sm">
                Admin Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-border/50 bg-background md:hidden animate-fade-in">
          <div className="container py-4 space-y-2">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.path) 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="border-t border-border/50 pt-3 mt-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-muted"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm font-medium rounded-lg text-destructive hover:bg-destructive/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground text-center"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
