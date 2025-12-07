'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { VoteInput, Post, Comment } from '@/types';

async function submitVote(input: VoteInput) {
  const res = await fetch('/api/votes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to vote');
  return res.json();
}

export function useVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitVote,
    onMutate: async (variables) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      await queryClient.cancelQueries({ queryKey: ['comments'] });

      // Get previous data
      const previousPosts = queryClient.getQueryData(['posts']);
      const previousComments = queryClient.getQueryData(['comments']);

      // Optimistically update
      if (variables.targetType === 'post') {
        queryClient.setQueriesData({ queryKey: ['posts'] }, (old: { pages?: { data: Post[] }[] } | undefined) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((post) => {
                if (post.id !== variables.targetId) return post;
                const prevVote = post.userVote;
                let upvotes = post.upvotes;
                let downvotes = post.downvotes;

                // Remove previous vote
                if (prevVote === 1) upvotes--;
                if (prevVote === -1) downvotes--;

                // Add new vote
                if (variables.value === 1) upvotes++;
                if (variables.value === -1) downvotes++;

                return { ...post, upvotes, downvotes, userVote: variables.value };
              }),
            })),
          };
        });

        // Also update single post query
        queryClient.setQueryData(['post', variables.targetId], (old: Post | undefined) => {
          if (!old) return old;
          const prevVote = old.userVote;
          let upvotes = old.upvotes;
          let downvotes = old.downvotes;

          if (prevVote === 1) upvotes--;
          if (prevVote === -1) downvotes--;
          if (variables.value === 1) upvotes++;
          if (variables.value === -1) downvotes++;

          return { ...old, upvotes, downvotes, userVote: variables.value };
        });
      }

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
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}
