'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Palette,
  Bell,
  Shield,
  LogOut,
  Camera,
  Trash2,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Input, Textarea, Avatar, Loader } from '@/components/ui';
import {
  useAuthStore,
  useLogout,
  useUpdateProfile,
  useUploadProfilePicture,
  useDeleteProfilePicture,
  useUserProfile,
} from '@/hooks';
import { useTheme } from '@/providers/ThemeProvider';

type SettingsTab = 'account' | 'appearance' | 'notifications' | 'privacy';

const tabs: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & Safety', icon: Shield },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { mutate: logout } = useLogout();
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Notification settings (local state - would need backend support)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [mentionNotifications, setMentionNotifications] = useState(true);
  const [commentNotifications, setCommentNotifications] = useState(true);

  // Privacy settings (local state - would need backend support)
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowDMs, setAllowDMs] = useState(true);

  const { data: userProfile, isLoading: profileLoading } = useUserProfile(user?.username || null);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: uploadPicture, isPending: isUploading } = useUploadProfilePicture();
  const { mutate: deletePicture, isPending: isDeleting } = useDeleteProfilePicture();

  // Initialize form fields when profile loads
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setBio(userProfile.bio || '');
    }
  }, [userProfile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex justify-center py-8">
        <Loader text="Loading..." />
      </div>
    );
  }

  const handleSaveProfile = () => {
    updateProfile(
      { displayName, bio },
      {
        onSuccess: () => {
          setSaveMessage('Profile updated successfully!');
          setTimeout(() => setSaveMessage(null), 3000);
        },
        onError: (error) => {
          setSaveMessage(`Error: ${error.message}`);
          setTimeout(() => setSaveMessage(null), 3000);
        },
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadPicture(file, {
        onSuccess: () => {
          setSaveMessage('Profile picture updated!');
          setTimeout(() => setSaveMessage(null), 3000);
        },
        onError: (error) => {
          setSaveMessage(`Error: ${error.message}`);
          setTimeout(() => setSaveMessage(null), 3000);
        },
      });
    }
  };

  const handleDeletePicture = () => {
    deletePicture(undefined, {
      onSuccess: () => {
        setSaveMessage('Profile picture removed!');
        setTimeout(() => setSaveMessage(null), 3000);
      },
    });
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Settings</h1>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Sidebar tabs */}
        <div className="w-full shrink-0 md:w-56">
          <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap rounded px-3 py-2 text-sm font-medium transition-colors',
                  activeTab === id
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-hover hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
            <hr className="my-2 hidden border-border md:block" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </nav>
        </div>

        {/* Content area */}
        <div className="flex-1 rounded border border-border bg-card p-6">
          {/* Account Settings */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-4 text-lg font-bold text-foreground">Profile</h2>

                {/* Profile Picture */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative">
                    <Avatar
                      src={userProfile?.avatarUrl || null}
                      alt={user.username}
                      size="xl"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute -bottom-1 -right-1 rounded-full border-2 border-card bg-primary p-1.5 text-primary-foreground hover:bg-primary/90"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-foreground">Profile Picture</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? 'Uploading...' : 'Upload'}
                      </Button>
                      {userProfile?.avatarUrl && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleDeletePicture}
                          disabled={isDeleting}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Username (read-only) */}
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Username
                  </label>
                  <Input value={user.username} disabled className="bg-muted" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Usernames cannot be changed
                  </p>
                </div>

                {/* Display Name */}
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Display Name
                  </label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter display name"
                    maxLength={30}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {displayName.length}/30 characters
                  </p>
                </div>

                {/* Bio */}
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Bio
                  </label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    rows={3}
                    maxLength={200}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {bio.length}/200 characters
                  </p>
                </div>

                {/* Save button */}
                <div className="flex items-center gap-3">
                  <Button onClick={handleSaveProfile} disabled={isUpdating}>
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                  {saveMessage && (
                    <span
                      className={cn(
                        'text-sm',
                        saveMessage.startsWith('Error') ? 'text-destructive' : 'text-green-600'
                      )}
                    >
                      {saveMessage}
                    </span>
                  )}
                </div>
              </div>

              <hr className="border-border" />

              {/* Account Info */}
              <div>
                <h2 className="mb-4 text-lg font-bold text-foreground">Account Info</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="text-foreground">{user.email || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cake Day</span>
                    <span className="text-foreground">
                      {new Date(user.cakeDay || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Karma</span>
                    <span className="text-foreground">{user.karma || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="mb-4 text-lg font-bold text-foreground">Appearance</h2>

              <div>
                <label className="mb-3 block text-sm font-medium text-foreground">Theme</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors',
                      theme === 'light'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground'
                    )}
                  >
                    <Sun className="h-6 w-6" />
                    <span className="text-sm font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors',
                      theme === 'dark'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground'
                    )}
                  >
                    <Moon className="h-6 w-6" />
                    <span className="text-sm font-medium">Dark</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="mb-4 text-lg font-bold text-foreground">Notifications</h2>

              <div className="space-y-4">
                <ToggleSetting
                  label="Email Notifications"
                  description="Receive email notifications for important updates"
                  checked={emailNotifications}
                  onChange={setEmailNotifications}
                />
                <ToggleSetting
                  label="Push Notifications"
                  description="Receive push notifications in your browser"
                  checked={pushNotifications}
                  onChange={setPushNotifications}
                />
                <ToggleSetting
                  label="Mentions"
                  description="Get notified when someone mentions you"
                  checked={mentionNotifications}
                  onChange={setMentionNotifications}
                />
                <ToggleSetting
                  label="Comments"
                  description="Get notified when someone comments on your posts"
                  checked={commentNotifications}
                  onChange={setCommentNotifications}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Note: Notification preferences are stored locally. Full notification support requires backend integration.
              </p>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h2 className="mb-4 text-lg font-bold text-foreground">Privacy & Safety</h2>

              <div className="space-y-4">
                <ToggleSetting
                  label="Show Online Status"
                  description="Let others see when you're online"
                  checked={showOnlineStatus}
                  onChange={setShowOnlineStatus}
                />
                <ToggleSetting
                  label="Allow Direct Messages"
                  description="Allow other users to send you direct messages"
                  checked={allowDMs}
                  onChange={setAllowDMs}
                />
              </div>

              <hr className="border-border" />

              <div>
                <h3 className="mb-3 text-sm font-bold text-foreground">Danger Zone</h3>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  This action is irreversible. All your data will be permanently deleted.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Toggle setting component
function ToggleSetting({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 rounded-full transition-colors',
          checked ? 'bg-primary' : 'bg-muted'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'left-[22px]' : 'left-0.5'
          )}
        />
      </button>
    </div>
  );
}
