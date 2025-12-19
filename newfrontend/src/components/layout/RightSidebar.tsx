'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Home as HomeIcon } from 'lucide-react';
import { Avatar, Button } from '@/components/ui';
import { useCommunities, useAuthStore } from '@/hooks';
import { formatNumber } from '@/lib/utils';
import logo from './logo.svg';
import { CreateCommunityModal } from '@/components/community';
import { CreatePostModal } from '@/components/post';
import { ChatPopup } from './ChatPopup';

interface RightSidebarProps {
  onAuthClick?: (mode: 'login' | 'register') => void;
}

export function RightSidebar({ onAuthClick }: RightSidebarProps) {
  const { data: communitiesData } = useCommunities();
  const { isAuthenticated } = useAuthStore();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);

  const communities = communitiesData?.data || [];
  const topCommunities = [...communities].sort((a, b) => b.memberCount - a.memberCount).slice(0, 5);

  return (
    <aside className="fixed right-0 top-12 z-30 hidden h-[calc(100vh-48px)] w-[312px] shrink-0 overflow-y-auto border-l border-border bg-card py-4 pl-4 pr-6 lg:block">
      {/* Home card (for authenticated users) */}
      {isAuthenticated && (
        <div className="mb-4 overflow-hidden rounded border border-border bg-card">
          <div className="h-8 bg-gradient-to-r from-orange-400 to-red-500" />
          <div className="p-3">
            <div className="mb-3 flex items-start gap-2">
              <div className="-mt-6 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-card bg-card">
                <HomeIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-1">
                <h3 className="text-sm font-medium text-foreground">Home</h3>
              </div>
            </div>
            <p className="mb-3 text-sm leading-snug text-muted-foreground">
              Your personal Reddit frontpage. Come here to check in with your favorite communities.
            </p>
            <hr className="mb-3 border-border" />
            <div className="flex flex-col gap-2">
              <Button onClick={() => setShowCreatePost(true)} className="h-8 w-full text-sm font-bold">
                Create Post
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateCommunity(true)}
                className="h-8 w-full border-primary text-sm font-bold text-primary hover:bg-primary/10"
              >
                Create Community
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sign up card (for non-authenticated users) */}
      {!isAuthenticated && (
        <div className="mb-4 overflow-hidden rounded border border-border bg-card">
          <div className="bg-primary h-8" />
          <div className="p-3">
            <div className="flex items-start gap-2 mb-3">
              <img src={logo.src} alt="Home" className="-mt-6 h-10 w-10 rounded-full border-4 border-card bg-card object-contain" />
              <div>
                <h3 className="text-sm font-medium text-foreground">Home</h3>
              </div>
            </div>
            <p className="mb-3 text-sm leading-snug text-foreground">
              Your personal Reddit frontpage. Come here to check in with your favorite communities.
            </p>
            <hr className="border-border mb-3" />
            <div className="flex flex-col gap-2">
              <Button className="w-full h-8 text-sm font-bold" onClick={() => onAuthClick?.('register')}>
                Create Account
              </Button>
              <Button
                variant="outline"
                className="w-full h-8 border-primary text-sm font-bold text-primary hover:bg-primary/10"
                onClick={() => onAuthClick?.('login')}
              >
                Log In
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Top Communities */}
      <div className="mb-4 overflow-hidden rounded border border-border bg-card">
        <div className="flex items-center gap-2 bg-secondary/50 px-3 py-2.5 border-b border-border">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">Top Communities</h3>
        </div>
        <div className="divide-y divide-border">
          {topCommunities.map((community, index) => (
            <Link
              key={community.id}
              href={`/r/${community.name}`}
              className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-hover group"
            >
              <span className="w-5 text-sm font-medium text-muted-foreground">{index + 1}</span>
              <Avatar src={community.iconUrl} alt={community.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">r/{community.name}</p>
                <p className="text-xs text-muted-foreground">{formatNumber(community.memberCount)} members</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div className="rounded border border-border bg-card p-3">
        <div className="mb-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <Link href="/legal/user-agreement" className="hover:text-foreground hover:underline">User Agreement</Link>
          <Link href="/legal/privacy-policy" className="hover:text-foreground hover:underline">Privacy Policy</Link>
          <Link href="/legal/content-policy" className="hover:text-foreground hover:underline">Content Policy</Link>
        </div>
        <p className="text-xs text-muted-foreground">
          Reddit Clone © {new Date().getFullYear()}
        </p>
      </div>

      <CreatePostModal isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} />
      <CreateCommunityModal isOpen={showCreateCommunity} onClose={() => setShowCreateCommunity(false)} />
      
      <ChatPopup />
    </aside>
  );
}
