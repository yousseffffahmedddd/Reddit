'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Flame, Clock, TrendingUp, Users, Calendar } from 'lucide-react';
import { cn, formatNumber, formatDate } from '@/lib/utils';
import { Avatar, Loader, ErrorMessage, Button } from '@/components/ui';
import { PostList } from '@/components/post';
import { useCommunity, useAuthStore } from '@/hooks';
import type { PostSortType } from '@/types';

const sortOptions: { value: PostSortType; label: string; icon: typeof Flame }[] = [
  { value: 'hot', label: 'Hot', icon: Flame },
  { value: 'new', label: 'New', icon: Clock },
  { value: 'top', label: 'Top', icon: TrendingUp },
];

export default function CommunityPage() {
  const params = useParams();
  const communityId = params.communityId as string;
  const [sort, setSort] = useState<PostSortType>('hot');
  const { isAuthenticated } = useAuthStore();

  const { data: community, isLoading, isError, error, refetch } = useCommunity(communityId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader text="Loading community..." />
      </div>
    );
  }

  if (isError || !community) {
    return (
      <ErrorMessage
        title="Community not found"
        message={error?.message || 'This community does not exist or has been removed.'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div>
      {/* Banner */}
      {community.bannerUrl ? (
        <div
          className="-mx-4 -mt-4 h-32 bg-cover bg-center md:h-48"
          style={{ backgroundImage: `url(${community.bannerUrl})` }}
        />
      ) : (
        <div className="-mx-4 -mt-4 h-24 bg-gradient-to-r from-primary to-orange-400" />
      )}

      {/* Community header */}
      <div className="-mt-4 mb-4 rounded-md border bg-card p-4">
        <div className="flex items-start gap-4">
          <Avatar src={community.iconUrl} alt={community.name} size="xl" className="-mt-10 border-4 border-card" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{community.displayName}</h1>
            <p className="text-sm text-muted-foreground">r/{community.name}</p>
          </div>
          {isAuthenticated && (
            <Button>Join</Button>
          )}
        </div>

        <p className="mt-4 text-sm">{community.description}</p>

        <div className="mt-4 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formatNumber(community.memberCount)}</span>
            <span className="text-muted-foreground">Members</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Created {formatDate(community.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        {/* Sort tabs */}
        <div className="mb-4 flex items-center gap-2 rounded-md border bg-card p-2">
          {sortOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setSort(value)}
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                sort === value
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/50'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Posts */}
        <PostList communityId={communityId} sort={sort} />
      </div>
    </div>
  );
}
