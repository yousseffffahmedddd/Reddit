'use client';

import { useState } from 'react';
import { Flame, Clock, TrendingUp, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PostList } from '@/components/post';
import type { PostSortType } from '@/types';

const sortOptions: { value: PostSortType; label: string; icon: typeof Flame }[] = [
  { value: 'hot', label: 'Hot', icon: Flame },
  { value: 'new', label: 'New', icon: Clock },
  { value: 'top', label: 'Top', icon: TrendingUp },
  { value: 'rising', label: 'Rising', icon: Award },
];

export default function HomePage() {
  const [sort, setSort] = useState<PostSortType>('hot');

  return (
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

      {/* Post feed */}
      <PostList sort={sort} />
    </div>
  );
}
