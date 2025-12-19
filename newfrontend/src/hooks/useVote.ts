'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserId } from '@/apis/authApi';
import { voteOnPost } from '@/apis/postApi';
import type { VoteInput, Post } from '@/types';

async function submitVote(input: VoteInput) {
  const userId = getUserId();
  if (!userId) throw new Error('Must be logged in to vote');

  if (input.targetType === 'comment') {
    // Comment voting
    const response = await fetch(`/api/comments/${input.targetId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId: input.targetId, userId, value: input.value }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to vote on comment');
    }
    return response.json();
  }

  // Post voting
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
      await queryClient.cancelQueries({ queryKey: ['comments'] });

      // Snapshot the previous values
      const previousPosts = queryClient.getQueryData(['posts']);
      const previousComments = queryClient.getQueryData(['comments']);

      if (input.targetType === 'post') {
        // Optimistically update posts
        queryClient.setQueriesData(
          { queryKey: ['posts'] },
          (old: { pages?: { data: Post[] }[] } | undefined) => {
            if (!old?.pages) return old;

            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                data: page.data.map((post) => {
                  if (post.id !== input.targetId) return post;

                  let upvotes = post.upvotes;
                  let downvotes = post.downvotes;
                  let userVote = post.userVote || 0; // 0 = no vote, 1 = upvote, -1 = downvote

                  // Upvote clicked
                  if (input.value === 1) {
                    if (userVote === 1) {
                      upvotes = Math.max(upvotes - 1, 0);
                      userVote = 0;
                    } else {
                      if (userVote === -1) downvotes = Math.max(downvotes - 1, 0);
                      upvotes++;
                      userVote = 1;
                    }
                  }

                  // Downvote clicked
                  if (input.value === -1) {
                    if (userVote === -1) {
                      downvotes = Math.max(downvotes - 1, 0);
                      userVote = 0;
                    } else {
                      if (userVote === 1) upvotes = Math.max(upvotes - 1, 0);
                      downvotes++;
                      userVote = -1;
                    }
                  }

                  return { ...post, upvotes, downvotes, userVote };
                }),
              })),
            };
          }
        );
      }

      // For comments, we don't do optimistic updates since they're nested
      // The invalidation will refetch them

      return { previousPosts, previousComments };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      if (context?.previousComments) {
        queryClient.setQueryData(['comments'], context.previousComments);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}
