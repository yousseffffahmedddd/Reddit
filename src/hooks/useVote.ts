'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserId } from '@/apis/authApi';
import { voteOnPost } from '@/apis/postApi';
import type { VoteInput, Post } from '@/types';

async function submitVote(input: VoteInput) {
  const userId = getUserId();
  if (!userId) throw new Error('Must be logged in to vote');

  // Backend only supports voting on posts currently
  if (input.targetType === 'comment') {
    // TODO: Comment voting not implemented in backend
    console.warn('Comment voting not implemented in backend');
    return { success: false };
  }

  await voteOnPost(input.targetId, userId, input.value);
  return { success: true };
}

export function useVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitVote,
    onMutate: async (input) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistically update posts
      queryClient.setQueriesData({ queryKey: ['posts'] }, (old: { pages?: { data: Post[] }[] } | undefined) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((post) => {
              if (post.id !== input.targetId) return post;
              const prevVote = post.userVote;
              let upvotes = post.upvotes;
              let downvotes = post.downvotes;

              // Remove previous vote
              if (prevVote === 1) upvotes--;
              if (prevVote === -1) downvotes--;

              // Add new vote
              if (input.value === 1) upvotes++;
              if (input.value === -1) downvotes++;

              return { ...post, upvotes, downvotes, userVote: input.value };
            }),
          })),
        };
      });

      return { previousPosts };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}