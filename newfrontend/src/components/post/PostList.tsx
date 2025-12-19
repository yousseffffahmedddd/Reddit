'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { PostCard } from './PostCard';
import { Loader, ErrorMessage } from '@/components/ui';
import { usePosts } from '@/hooks';
import type { PostSortType } from '@/types';

interface PostListProps {
  communityId?: string;
  userId?: string;
  sort?: PostSortType;
}

export function PostList({ communityId, userId, sort = 'hot' }: PostListProps) {
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = usePosts({ communityId, userId, sort });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader text="Loading posts..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorMessage
        message={error?.message || 'Failed to load posts'}
        onRetry={() => refetch()}
      />
    );
  }

  const posts = data?.pages.flatMap((page) => page.data) || [];

  if (posts.length === 0) {
    return (
      <div className="rounded border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2" data-testid="post-list">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* Infinite scroll trigger */}
      <div ref={ref} className="flex justify-center py-3">
        {isFetchingNextPage && <Loader size="sm" />}
        {!hasNextPage && posts.length > 0 && (
          <p className="text-xs text-muted-foreground">No more posts</p>
        )}
      </div>
    </div>
  );
}
