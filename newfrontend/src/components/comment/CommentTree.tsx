'use client';

import { useState } from 'react';
import { Comment } from './Comment';
import { CommentForm } from './CommentForm';
import { Loader, ErrorMessage } from '@/components/ui';
import { useComments } from '@/hooks';
import type { CommentSortType } from '@/types';

interface CommentTreeProps {
  postId: string;
}

const sortOptions: { value: CommentSortType; label: string }[] = [
  { value: 'best', label: 'Best' },
  { value: 'top', label: 'Top' },
  { value: 'new', label: 'New' },
  { value: 'controversial', label: 'Controversial' },
  { value: 'old', label: 'Old' },
];

export function CommentTree({ postId }: CommentTreeProps) {
  const [sort, setSort] = useState<CommentSortType>('best');
  const { data, isLoading, isError, error, refetch } = useComments(postId, sort);

  return (
    <div className="space-y-4">
      {/* Comment form */}
      <CommentForm postId={postId} placeholder="What are your thoughts?" />

      {/* Sort selector */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-bold text-muted-foreground">Sort by:</span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as CommentSortType)}
          className="rounded border border-border bg-card px-2 py-1 text-xs font-bold text-primary hover:bg-hover focus:outline-none focus:ring-1 focus:ring-border"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Comments list */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader text="Loading comments..." />
        </div>
      )}

      {isError && (
        <ErrorMessage
          message={error?.message || 'Failed to load comments'}
          onRetry={() => refetch()}
        />
      )}

      {data && (
        <div className="space-y-3" data-testid="comment-tree">
          {data.data.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            data.data.map((comment) => (
              <Comment key={comment.id} comment={comment} postId={postId} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
