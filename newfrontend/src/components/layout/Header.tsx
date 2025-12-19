'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Menu,
  Moon,
  Sun,
  LogIn,
  LogOut,
  User,
  Settings,
  MessageCircle,
  Bot,
} from 'lucide-react';
import { Button, Avatar } from '@/components/ui';
import { useAuthStore, useLogout, useSearch } from '@/hooks';
import { useTheme } from '@/providers/ThemeProvider';
import { CreatePostModal } from '@/components/post';

interface HeaderProps {
  onMenuClick?: () => void;
  onAuthClick?: (mode: 'login' | 'register') => void;
}


export function Header({ onMenuClick, onAuthClick }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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

                {/* User menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
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
