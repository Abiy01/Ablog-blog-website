import { useState } from 'react';
import { User, Mail, Lock, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { useToast } from '../../hooks/use-toast';

export default function Settings() {
  const { admin } = useAuth();
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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await adminAPI.updateProfile(profile);
      
      // Update local state
      setProfile({
        name: updated.name,
        email: updated.email,
      });
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been saved.',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update profile.',
        variant: 'destructive',
      });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your new passwords match.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await adminAPI.updatePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      
      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
      });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update password.',
        variant: 'destructive',
      });
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

          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
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

          <Button type="submit" className="gap-2">
            <Lock className="h-4 w-4" />
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
