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
import logo from './logo.svg';

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
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="flex h-12 w-full items-center justify-between gap-3 px-4 lg:px-5">
          {/* Mobile menu */}
          <button
            onClick={onMenuClick}
            className="rounded p-1.5 hover:bg-hover"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <img src={logo.src} alt="Reddit" className="h-8 w-8 object-contain" />
            <span className="hidden text-lg font-semibold tracking-tight text-foreground md:block">reddit</span>
          </Link>

          {/* Search - Reddit pill style */}
          <form onSubmit={handleSearch} className="relative mx-auto flex-1 max-w-2xl">
            <div className="relative flex items-center rounded-full border-2 border-orange-500/50 bg-secondary hover:bg-secondary/80 focus-within:bg-card focus-within:border-orange-500 transition-colors">
              <Search className="ml-3.5 h-4 w-4 text-muted-foreground pointer-events-none shrink-0" />
              <input
                type="search"
                placeholder="Search Reddit"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearch(true)}
                onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                className="h-10 flex-1 bg-transparent border-none px-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0"
              />
              <Link
                href="/ask"
                className="mr-1.5 flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-3 py-1.5 text-xs font-bold text-white hover:opacity-90 shrink-0"
              >
                <Bot className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Ask AI</span>
              </Link>
            </div>

            {/* Search dropdown */}
            {showSearch && searchQuery.length >= 2 && searchResults && (
              <div className="absolute left-0 right-0 top-full mt-2 rounded border border-border bg-card py-2 shadow-lg">
                {searchResults.communities.length > 0 && (
                  <div className="mb-2">
                    <p className="mb-1 px-3 text-2xs font-bold uppercase tracking-wide text-muted-foreground">Communities</p>
                    {searchResults.communities.slice(0, 3).map((community) => (
                      <Link
                        key={community.id}
                        href={`/r/${community.name}`}
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-hover"
                      >
                        <Avatar src={community.iconUrl} alt={community.name} size="xs" />
                        <span className="text-sm font-medium">r/{community.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
                {searchResults.posts.length > 0 && (
                  <div>
                    <p className="mb-1 px-3 text-2xs font-bold uppercase tracking-wide text-muted-foreground">Posts</p>
                    {searchResults.posts.slice(0, 3).map((post) => (
                      <Link
                        key={post.id}
                        href={`/r/${post.communityId}/post/${post.id}`}
                        className="block px-3 py-1.5 hover:bg-hover"
                      >
                        <p className="truncate text-sm">{post.title}</p>
                        <p className="text-xs text-muted-foreground">r/{post.community.name}</p>
                      </Link>
                    ))}
                  </div>
                )}
                {searchResults.communities.length === 0 && searchResults.posts.length === 0 && (
                  <p className="px-3 py-4 text-center text-sm text-muted-foreground">No results found</p>
                )}
              </div>
            )}
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded hover:bg-hover"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                {/* Create post */}
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="hidden h-8 w-8 items-center justify-center rounded hover:bg-hover md:flex"
                >
                  <Plus className="h-5 w-5 text-muted-foreground" />
                </button>

                {/* User menu */}
                <div className="relative ml-1" ref={userMenuRef}>
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                    }}
                    className="flex items-center gap-1.5 rounded px-2 py-1 hover:bg-hover"
                  >
                    <Avatar src={user?.avatarUrl || null} alt={user?.username || ''} size="xs" />
                    <span className="hidden max-w-[100px] truncate text-xs font-medium text-foreground md:block">{user?.username}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded border border-border bg-card py-2 shadow-lg">
                      <Link
                        href={`/u/${user?.username}`}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-hover"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        Profile
                      </Link>
                      <Link
                        href="/chat"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-hover"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        Chat
                      </Link>
                      <Link
                        href="/ask"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-hover"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Bot className="h-4 w-4 text-muted-foreground" />
                        Ask AI
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-hover"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        Settings
                      </Link>
                      <hr className="my-2 border-border" />
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-hover"
                      >
                        <LogOut className="h-4 w-4 text-muted-foreground" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Button onClick={() => onAuthClick?.('login')} size="sm" className="ml-2 h-8 px-4 text-xs font-bold">
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
