'use client';

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserId } from '@/apis/authApi';
import {
    fetchPosts as fetchPostsApi,
    fetchPost as fetchPostApi,
    createPost as createPostApi,
    updatePost as updatePostApi,
    deletePost as deletePostApi,
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
    : backendPost.author?._id || 'unknown';
  const authorUsername = typeof backendPost.author === 'string'
    ? 'Unknown'
    : backendPost.author?.username || 'Unknown';

  const communityId = typeof backendPost.community === 'string'
    ? backendPost.community
    : backendPost.community?._id || 'unknown';
  const communityName = typeof backendPost.community === 'string'
    ? 'Unknown'
    : backendPost.community?.name || 'Unknown';

  return {
    id: backendPost._id,
    title: backendPost.title,
    content: backendPost.content,
    type: backendPost.postType as 'text' | 'image' | 'link',
    imageUrl: backendPost.imageUrl || null,
    linkUrl: backendPost.linkUrl || null,
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
    upvotes: backendPost.upvotes || 0,
    downvotes: backendPost.downvotes || 0,
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
  } else if (params.sort === 'top' || params.sort === 'popular') {
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
  const backendPost = await fetchPostApi(postId);
  return transformPost(backendPost);
}

async function createPost(input: CreatePostInput): Promise<Post> {
  const userId = getUserId();
  if (!userId) throw new Error('Must be logged in to create a post');

  const postData: CreatePostData = {
    title: input.title,
    content: input.content || '',
    postType: input.type,
    imageUrl: input.imageUrl,
    linkUrl: input.linkUrl,
    author: userId,
    community: input.communityId,
  };

  const backendPost = await createPostApi(postData);
  return transformPost(backendPost);
}

async function updatePost(input: UpdatePostInput & { postId: string }): Promise<Post> {
  const userId = getUserId();
  if (!userId) throw new Error('Must be logged in to update a post');

  const backendPost = await updatePostApi(input.postId, {
    title: input.title,
    content: input.content,
  });
  return transformPost(backendPost);
}

async function deletePost(postId: string): Promise<void> {
  await deletePostApi(postId);
}

async function voteOnPost(postId: string, value: number): Promise<void> {
  const userId = getUserId();
  if (!userId) throw new Error('Must be logged in to vote');

  await voteOnPostApi(postId, userId, value);
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

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', updatedPost.id] });
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

export function useVoteOnPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, value }: { postId: string; value: number }) =>
      voteOnPost(postId, value),
    onMutate: async ({ postId, value }) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistic update
queryClient.setQueriesData(
  { queryKey: ['posts'] },
  (old: { pages?: { data: Post[] }[] } | undefined) => {
    if (!old?.pages) return old;

    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        data: page.data.map((post) => {
          if (post.id !== postId) return post;

          let upvotes = post.upvotes;
          let downvotes = post.downvotes;
          let userVote = post.userVote || 0; // 0 = no vote, 1 = upvote, 2 = downvote

          // If clicking upvote
          if (value === 1) {
            if (userVote === 1) {
              upvotes--; // remove upvote
              userVote = 0;
            } else {
              if (userVote === 2) downvotes--; // remove previous downvote
              upvotes++; // add upvote
              userVote = 1;
            }
          }

          // If clicking downvote
          if (value === 2) {
            if (userVote === 2) {
              downvotes--; // remove downvote
              userVote = 0;
            } else {
              if (userVote === 1) upvotes--; // remove previous upvote
              downvotes++; // add downvote
              userVote = 2;
            }
          }

          return { ...post, upvotes, downvotes, userVote };
        }),
      })),
    };
  }
);




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


export function useSavePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
