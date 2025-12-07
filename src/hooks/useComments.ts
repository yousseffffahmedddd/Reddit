'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Comment, CreateCommentInput, CommentSortType } from '@/types';

interface FetchCommentsParams {
  postId: string;
  sort?: CommentSortType;
}

async function fetchComments(params: FetchCommentsParams): Promise<{ data: Comment[]; total: number }> {
  const searchParams = new URLSearchParams();
  if (params.sort) searchParams.set('sort', params.sort);

  const res = await fetch(`/api/posts/${params.postId}/comments?${searchParams}`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}

async function createComment(input: CreateCommentInput): Promise<Comment> {
  const res = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create comment');
  }
  return res.json();
}

async function deleteComment(commentId: string): Promise<void> {
  const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete comment');
}

export function useComments(postId: string, sort?: CommentSortType) {
  return useQuery({
    queryKey: ['comments', postId, sort],
    queryFn: () => fetchComments({ postId, sort }),
    enabled: !!postId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.postId] });
      queryClient.invalidateQueries({ queryKey: ['post', data.postId] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
