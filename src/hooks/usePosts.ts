'use client';

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserId } from '@/apis/authApi';
import {
    fetchPosts as fetchPostsApi,
    createPost as createPostApi,
    voteOnPost as voteOnPostApi,
    type BackendPost,
    type CreatePostData,
} from '@/apis/postApi';
import type { Post, PaginatedResponse, CreatePostInput, UpdatePostInput, PostSortType } from '@/types';

// Transform backend post to frontend format
function transformPost(backendPost: BackendPost): Post {
  // Handle both populated objects and plain string IDs
  const authorId = typeof backendPost.author === 'string'
    ? backendPost.author
    : backendPost.author._id;
  const authorUsername = typeof backendPost.author === 'string'
    ? 'Unknown'
    : backendPost.author.username;

  const communityId = typeof backendPost.community === 'string'
    ? backendPost.community
    : backendPost.community._id;
  const communityName = typeof backendPost.community === 'string'
    ? 'Unknown'
    : backendPost.community.name;

  return {
    id: backendPost._id,
    title: backendPost.title,
    content: backendPost.content,
    type: backendPost.postType as 'text' | 'image' | 'link',
    imageUrl: null,
    linkUrl: null,
    authorId: authorId,
    author: {
      id: authorId,
      username: authorUsername,
      displayName: authorUsername,
      avatarUrl: null,
      karma: 0,
      cakeDay: new Date().toISOString(),
      bio: null,
      createdAt: new Date().toISOString(),
    },
    communityId: communityId,
    community: {
      id: communityId,
      name: communityName,
      displayName: communityName,
      description: '',
      iconUrl: null,
      bannerUrl: null,
      memberCount: 0,
      createdAt: new Date().toISOString(),
      rules: [],
      moderators: [],
    },
    upvotes: backendPost.score > 0 ? backendPost.score : 0,
    downvotes: backendPost.score < 0 ? Math.abs(backendPost.score) : 0,
    commentCount: 0,
    userVote: (backendPost.userVote || 0) as 0 | 1 | -1,
    isSaved: false,
    createdAt: backendPost.createdAt,
    updatedAt: backendPost.createdAt,
  };
}

interface FetchPostsParams {
  communityId?: string;
  userId?: string;
  sort?: PostSortType;
  cursor?: string;
  limit?: number;
}

async function fetchPosts(params: FetchPostsParams): Promise<PaginatedResponse<Post>> {
  const backendPosts = await fetchPostsApi();

  // Transform and filter posts on client side
  let posts = backendPosts.map(transformPost);

  // Filter by community if specified (match by ID or name)
  if (params.communityId) {
    const communityFilter = params.communityId.toLowerCase();
    posts = posts.filter(post =>
      post.communityId === params.communityId ||
      post.community.name === params.communityId ||
      (post.community.name && post.community.name.toLowerCase() === communityFilter)
    );
  }

  // Filter by user if specified (match by ID or username)
  if (params.userId) {
    const userFilter = params.userId.toLowerCase();
    posts = posts.filter(post =>
      post.authorId === params.userId ||
      post.author.username === params.userId ||
      (post.author.username && post.author.username.toLowerCase() === userFilter)
    );
  }

  // Sort posts (client-side since backend doesn't support it)
  if (params.sort === 'new') {
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (params.sort === 'top') {
    posts.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
  }

  return {
    data: posts,
    nextCursor: null,
    hasMore: false,
    total: posts.length,
  };
}

async function fetchPost(postId: string): Promise<Post> {
  const backendPosts = await fetchPostsApi();
  const backendPost = backendPosts.find(p => p._id === postId);

  if (!backendPost) throw new Error('Post not found');

  return transformPost(backendPost);
}

async function createPost(input: CreatePostInput): Promise<Post> {
  const userId = getUserId();
  if (!userId) throw new Error('Must be logged in to create a post');

  const postData: CreatePostData = {
    title: input.title,
    content: input.content || '',
    postType: input.type,
    author: userId,
    community: input.communityId,
  };

  const backendPost = await createPostApi(postData);
  return transformPost(backendPost);
}

async function voteOnPost(postId: string, value: number): Promise<void> {
  const userId = getUserId();
  if (!userId) throw new Error('Must be logged in to vote');

  await voteOnPostApi(postId, userId, value);
}

// Note: Update and Delete post endpoints not found in backend
async function updatePost(_input: UpdatePostInput & { postId: string }): Promise<Post> {
  throw new Error('Update post not implemented in backend');
}

async function deletePost(_postId: string): Promise<void> {
  throw new Error('Delete post not implemented in backend');
}

async function savePost(_postId: string): Promise<{ isSaved: boolean }> {
  throw new Error('Save post not implemented in backend');
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

export function useVoteOnPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, value }: { postId: string; value: number }) =>
      voteOnPost(postId, value),
    onMutate: async ({ postId, value }) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistic update
      queryClient.setQueriesData({ queryKey: ['posts'] }, (old: { pages?: { data: Post[] }[] } | undefined) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((post) => {
              if (post.id !== postId) return post;
              const prevVote = post.userVote;
              let upvotes = post.upvotes;
              let downvotes = post.downvotes;

              if (prevVote === 1) upvotes--;
              if (prevVote === -1) downvotes--;
              if (value === 1) upvotes++;
              if (value === -1) downvotes++;

              return { ...post, upvotes, downvotes, userVote: value as 0 | 1 | -1 };
            }),
          })),
        };
      });

      return { previousPosts };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
