import { Link } from 'react-router-dom';
import { LogOut, ExternalLink, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';

export function AdminHeader() {
  const { admin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="flex items-center justify-between h-full px-6">
        <div>
          <h1 className="text-lg font-heading font-semibold text-foreground">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" target="_blank">
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View Site
            </Button>
          </Link>
          
          <ThemeToggle />

          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">
                {admin?.name || 'Admin'}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-muted-foreground hover:text-destructive"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
