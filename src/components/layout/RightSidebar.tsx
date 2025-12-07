'use client';

import Link from 'next/link';
import { TrendingUp, Users, Info, Shield, FileText } from 'lucide-react';
import { Avatar, Button } from '@/components/ui';
import { useCommunities, useAuthStore } from '@/hooks';
import { formatNumber } from '@/lib/utils';

export function RightSidebar() {
  const { data: communitiesData } = useCommunities();
  const { isAuthenticated } = useAuthStore();

  const communities = communitiesData?.data || [];
  const topCommunities = [...communities].sort((a, b) => b.memberCount - a.memberCount).slice(0, 5);

  return (
    <aside className="sticky top-12 hidden h-[calc(100vh-48px)] w-80 shrink-0 overflow-y-auto p-4 lg:block">
      {/* Sign up card (for non-authenticated users) */}
      {!isAuthenticated && (
        <div className="mb-4 rounded-md border bg-card p-4">
          <h3 className="mb-2 font-medium">Welcome to Reddit</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Join communities and share your thoughts with millions of people.
          </p>
          <div className="flex flex-col gap-2">
            <Button className="w-full">Sign Up</Button>
            <Button variant="outline" className="w-full">Log In</Button>
          </div>
        </div>
      )}

      {/* Trending communities */}
      <div className="mb-4 rounded-md border bg-card">
        <div className="flex items-center gap-2 border-b p-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Top Communities</h3>
        </div>
        <div className="divide-y">
          {topCommunities.map((community, index) => (
            <Link
              key={community.id}
              href={`/r/${community.name}`}
              className="flex items-center gap-3 p-3 hover:bg-muted"
            >
              <span className="w-5 text-sm text-muted-foreground">{index + 1}</span>
              <Avatar src={community.iconUrl} alt={community.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">r/{community.name}</p>
                <p className="text-xs text-muted-foreground">{formatNumber(community.memberCount)} members</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Reddit Premium ad (simplified) */}
      <div className="mb-4 rounded-md border bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
        <h3 className="mb-2 font-medium">Reddit Premium</h3>
        <p className="mb-3 text-sm opacity-90">
          The best Reddit experience, with monthly Coins
        </p>
        <Button variant="secondary" size="sm" className="w-full">
          Try Now
        </Button>
      </div>

      {/* Footer links */}
      <div className="rounded-md border bg-card p-4">
        <div className="mb-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <Link href="/legal/user-agreement" className="hover:underline">User Agreement</Link>
          <Link href="/legal/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <Link href="/legal/content-policy" className="hover:underline">Content Policy</Link>
          <Link href="/legal" className="hover:underline">Help Center</Link>
        </div>
        <p className="text-xs text-muted-foreground">
          Reddit Clone © {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
    </aside>
  );
}
