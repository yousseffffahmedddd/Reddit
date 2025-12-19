'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Plus,
  Menu,
  Moon,
  Sun,
  LogIn,
  LogOut,
  User,
  Settings,
  MessageSquare,
  ArrowUp,
  Award,
  AtSign,
  Users,
  Check,
  MessageCircle,
  Bot,
} from 'lucide-react';
import { cn, formatTimeAgo } from '@/lib/utils';
import { Button, Avatar } from '@/components/ui';
import { useAuthStore, useLogout, useSearch, useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '@/hooks';
import { useTheme } from '@/providers/ThemeProvider';
import { CreatePostModal } from '@/components/post';
import type { NotificationType } from '@/types';

interface HeaderProps {
  onMenuClick?: () => void;
  onAuthClick?: (mode: 'login' | 'register') => void;
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  comment_reply: <MessageSquare className="h-4 w-4 text-blue-500" />,
  post_reply: <MessageSquare className="h-4 w-4 text-green-500" />,
  mention: <AtSign className="h-4 w-4 text-purple-500" />,
  upvote: <ArrowUp className="h-4 w-4 text-orange-500" />,
  award: <Award className="h-4 w-4 text-yellow-500" />,
  community_update: <Users className="h-4 w-4 text-cyan-500" />,
};

export function Header({ onMenuClick, onAuthClick }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const { user, isAuthenticated } = useAuthStore();
  const { mutate: logout } = useLogout();
  const { theme, toggleTheme } = useTheme();
  const { data: searchResults } = useSearch(searchQuery);
  const { data: notificationsData } = useNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();

  const unreadCount = notificationsData?.unreadCount || 0;
  const notifications = notificationsData?.notifications || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-card">
        <div className="mx-auto flex h-12 max-w-7xl items-center gap-2 px-4">
          {/* Mobile menu */}
          <button
            onClick={onMenuClick}
            className="rounded p-1 hover:bg-muted md:hidden"
            aria-label="Menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <span className="text-lg font-bold text-primary-foreground">R</span>
            </div>
            <span className="hidden text-xl font-bold md:block">reddit</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative mx-4 flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search Reddit"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              className="h-9 w-full rounded-full border bg-muted/50 pl-10 pr-4 text-sm focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />

            {/* Search dropdown */}
            {showSearch && searchQuery.length >= 2 && searchResults && (
              <div className="absolute left-0 right-0 top-full mt-1 rounded-md border bg-card p-2 shadow-lg">
                {searchResults.communities.length > 0 && (
                  <div className="mb-2">
                    <p className="mb-1 px-2 text-xs font-medium text-muted-foreground">Communities</p>
                    {searchResults.communities.slice(0, 3).map((community) => (
                      <Link
                        key={community.id}
                        href={`/r/${community.name}`}
                        className="flex items-center gap-2 rounded px-2 py-1 hover:bg-muted"
                      >
                        <Avatar src={community.iconUrl} alt={community.name} size="xs" />
                        <span className="text-sm">r/{community.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
                {searchResults.posts.length > 0 && (
                  <div>
                    <p className="mb-1 px-2 text-xs font-medium text-muted-foreground">Posts</p>
                    {searchResults.posts.slice(0, 3).map((post) => (
                      <Link
                        key={post.id}
                        href={`/r/${post.communityId}/post/${post.id}`}
                        className="block rounded px-2 py-1 hover:bg-muted"
                      >
                        <p className="truncate text-sm">{post.title}</p>
                        <p className="text-xs text-muted-foreground">r/{post.community.name}</p>
                      </Link>
                    ))}
                  </div>
                )}
                {searchResults.communities.length === 0 && searchResults.posts.length === 0 && (
                  <p className="px-2 py-4 text-center text-sm text-muted-foreground">No results found</p>
                )}
              </div>
            )}
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 hover:bg-muted"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                {/* Create post */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCreatePost(true)}
                  className="hidden md:flex"
                >
                  <Plus className="h-5 w-5" />
                </Button>

                {/* Notifications */}
                <div className="relative hidden md:block" ref={notificationsRef}>
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="relative rounded-full p-2 hover:bg-muted"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-1 w-80 rounded-md border bg-card shadow-lg">
                      <div className="flex items-center justify-between border-b px-4 py-3">
                        <h3 className="font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAllAsRead()}
                            className="flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <Check className="h-3 w-3" />
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <Link
                              key={notification.id}
                              href={notification.linkUrl}
                              onClick={() => {
                                if (!notification.read) {
                                  markAsRead(notification.id);
                                }
                                setShowNotifications(false);
                              }}
                              className={cn(
                                'flex gap-3 px-4 py-3 hover:bg-muted',
                                !notification.read && 'bg-primary/5'
                              )}
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                                {notificationIcons[notification.type]}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className={cn('text-sm', !notification.read && 'font-medium')}>
                                  {notification.title}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {notification.message}
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {formatTimeAgo(notification.createdAt)}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                              )}
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 rounded-md p-1 hover:bg-muted"
                  >
                    <Avatar src={user?.avatarUrl || null} alt={user?.username || ''} size="sm" />
                    <span className="hidden text-sm md:block">{user?.username}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-1 w-48 rounded-md border bg-card py-1 shadow-lg">
                      <Link
                        href={`/u/${user?.username}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <Link
                        href="/chat"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat
                      </Link>
                      <Link
                        href="/ask"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Bot className="h-4 w-4" />
                        Ask AI
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                      >
                        <LogOut className="h-4 w-4" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Button onClick={() => onAuthClick?.('login')} size="sm">
                <LogIn className="mr-2 h-4 w-4" />
                Log In
              </Button>
            )}
          </div>
        </div>
      </header>

      <CreatePostModal isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} />
    </>
  );
}
