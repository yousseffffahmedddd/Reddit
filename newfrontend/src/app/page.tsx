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
  { value: 'top', label: 'Top', icon: Award },
];

export default function HomePage() {
  const [sort, setSort] = useState<PostSortType>('hot');
  const { user, isAuthenticated } = useAuthStore();
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <div className="mx-auto max-w-[640px]">
      {/* Sort dropdown - top left */}
      <div className="mb-3 flex items-center gap-2">
        <label htmlFor="sort-select" className="text-sm font-bold text-muted-foreground">
          Sort by:
        </label>
        <select
          id="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value as PostSortType)}
          className="rounded border border-border bg-card px-3 py-1.5 text-sm font-bold text-foreground hover:bg-hover focus:outline-none focus:ring-1 focus:ring-border"
        >
          {sortOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Post feed */}
      <PostList sort={sort} />

      <CreatePostModal isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} />
    </div>
  );
}