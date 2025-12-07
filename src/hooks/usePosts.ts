'use client';

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Post, PaginatedResponse, CreatePostInput, UpdatePostInput, PostSortType } from '@/types';

interface FetchPostsParams {
  communityId?: string;
  userId?: string;
  sort?: PostSortType;
  cursor?: string;
  limit?: number;
}

async function fetchPosts(params: FetchPostsParams): Promise<PaginatedResponse<Post>> {
  const searchParams = new URLSearchParams();
  if (params.communityId) searchParams.set('communityId', params.communityId);
  if (params.userId) searchParams.set('userId', params.userId);
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.cursor) searchParams.set('cursor', params.cursor);
  if (params.limit) searchParams.set('limit', params.limit.toString());

  const res = await fetch(`/api/posts?${searchParams}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

async function fetchPost(postId: string): Promise<Post> {
  const res = await fetch(`/api/posts/${postId}`);
  if (!res.ok) throw new Error('Post not found');
  return res.json();
}

async function createPost(input: CreatePostInput): Promise<Post> {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create post');
  }
  return res.json();
}

async function updatePost({ postId, ...input }: UpdatePostInput & { postId: string }): Promise<Post> {
  const res = await fetch(`/api/posts/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to update post');
  return res.json();
}

async function deletePost(postId: string): Promise<void> {
  const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete post');
}

async function savePost(postId: string): Promise<{ isSaved: boolean }> {
  const res = await fetch(`/api/posts/${postId}/save`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to save post');
  return res.json();
}

export function usePosts(params: Omit<FetchPostsParams, 'cursor'> = {}) {
  return useInfiniteQuery({
    queryKey: ['posts', params],
    queryFn: ({ pageParam }) => fetchPosts({ ...params, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function usePost(postId: string) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPost(postId),
    enabled: !!postId,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onSuccess: (data) => {
      queryClient.setQueryData(['post', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useSavePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      const previousPost = queryClient.getQueryData<Post>(['post', postId]);

      queryClient.setQueryData<Post>(['post', postId], (old) =>
        old ? { ...old, isSaved: !old.isSaved } : old
      );

      return { previousPost };
    },
    onError: (_err, postId, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(['post', postId], context.previousPost);
      }
    },
    onSettled: (_data, _error, postId) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}
