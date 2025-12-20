'use client';

import { useState } from 'react';
import { Flame, Clock, TrendingUp, Award, Image, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PostList, CreatePostModal } from '@/components/post';
import { Avatar } from '@/components/ui';
import { useAuthStore } from '@/hooks';
import type { PostSortType } from '@/types';

const sortOptions: { value: PostSortType; label: string; icon: typeof Flame }[] = [
  { value: 'hot', label: 'Hot', icon: Flame },
  { value: 'new', label: 'New', icon: Clock },
  // { value: 'popular', label: 'Popular', icon: TrendingUp },
  { value: 'top', label: 'Top', icon: Award },
];

export default function HomePage() {
  const [sort, setSort] = useState<PostSortType>('hot');
  const { user, isAuthenticated } = useAuthStore();
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <div className="mx-auto max-w-[640px]">
      {/* Create Post Bar */}
      {/* {isAuthenticated && (
        <div className="mb-4 flex items-center gap-2 rounded border border-border bg-card p-2">
          <Avatar src={user?.avatarUrl} alt={user?.username} size="sm" />
          <input
            type="text"
            placeholder="Create Post"
            className="flex-1 rounded border border-border bg-secondary px-4 py-2 text-sm text-muted-foreground hover:bg-secondary/80 focus:outline-none"
            onClick={() => setShowCreatePost(true)}
            readOnly
          />
          <button onClick={() => setShowCreatePost(true)} className="rounded p-2 hover:bg-hover">
            <Image className="h-5 w-5 text-muted-foreground" />
          </button>
          <button onClick={() => setShowCreatePost(true)} className="rounded p-2 hover:bg-hover">
            <Link2 className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      )} */}

      {/* Sort tabs - Reddit pill style */}
      <div className="mb-3 flex items-center gap-1.5 rounded border border-border bg-card px-2 py-2">
        {sortOptions.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setSort(value)}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-colors',
              sort === value
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:bg-hover'
            )}
          >
            <Icon className={cn('h-5 w-5', sort === value && 'text-primary')} />
            {label}
          </button>
        ))}
      </div>

      {/* Post feed */}
      <PostList sort={sort} />

      <CreatePostModal isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} />
    </div>
  );
}