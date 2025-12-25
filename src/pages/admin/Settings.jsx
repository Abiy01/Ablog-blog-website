import { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Button } from '../../components/ui/button';
import { useToast } from '../../hooks/use-toast';

export default function Settings() {
  const { admin, refreshAdmin } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  // Update profile state when admin changes
  useEffect(() => {
    if (admin) {
      setProfile({
        name: admin.name || '',
        email: admin.email || '',
      });
    }
  }, [admin]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingProfile(true);

    try {
      const updatedProfile = await authService.updateProfile(profile);
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been saved.',
      });
      // Refresh admin data in context
      if (updatedProfile) {
        await refreshAdmin();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to update profile.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all password fields.',
        variant: 'destructive',
      });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your new passwords match.',
        variant: 'destructive',
      });
      return;
    }

    if (passwords.new.length < 6) {
      toast({
        title: 'Password too short',
        description: 'New password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoadingPassword(true);

    try {
      await authService.updatePassword(passwords.current, passwords.new);
      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
      });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to update password.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Profile Settings */}
      <div className="rounded-xl bg-card border border-border/50 shadow-soft p-6 mb-6">
        <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Profile Information
        </h2>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Display Name
            </label>
            <input
              type="text"
              id="name"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={profile.email}
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <Button type="submit" className="gap-2" disabled={isLoadingProfile}>
            {isLoadingProfile ? (
              <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </form>
      </div>

      {/* Password Settings */}
      <div className="rounded-xl bg-card border border-border/50 shadow-soft p-6 mb-6">
        <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Change Password
        </h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="current" className="block text-sm font-medium mb-2">
              Current Password
            </label>
            <input
              type="password"
              id="current"
              value={passwords.current}
              onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="new" className="block text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              id="new"
              value={passwords.new}
              onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="block text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirm"
              value={passwords.confirm}
              onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <Button type="submit" className="gap-2" disabled={isLoadingPassword}>
            {isLoadingPassword ? (
              <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            Update Password
          </Button>
        </form>
      </div>

    </div>
  );
}
