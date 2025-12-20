'use client';

import { PostList } from '@/components/post';

export default function PopularPage() {
  return (
    <div className="mx-auto max-w-[640px]">
      {/* Page header */}
      <div className="mb-4 rounded border border-border bg-card px-4 py-3">
        <h1 className="text-lg font-bold text-foreground">Popular Posts</h1>
        <p className="text-sm text-muted-foreground">
          Posts ranked by Reddit's hot score algorithm (balancing votes and recency)
        </p>
      </div>

      {/* Popular posts feed */}
      <PostList sort="popular" />
    </div>
  );
}
