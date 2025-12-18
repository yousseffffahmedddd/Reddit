'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserId } from '@/apis/authApi';
import {
    getUserConversations,
    getMessages as fetchMessages,
    sendMessage as sendMessageApi,
    getOrCreateConversation,
    getAllUsers,
    searchUsers,
    type ChatUser,
    type Conversation,
    type Message,
    type Participant,
} from '@/apis/chatApi';

// Re-export types
export type { ChatUser, Conversation, Message, Participant };

// Hooks
export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const userId = getUserId();
      if (!userId) return [];
      return getUserConversations(userId);
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessages(conversationId!),
    enabled: !!conversationId,
    refetchInterval: 3000, // Poll for new messages every 3 seconds
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, text }: { conversationId: string; text: string }) => {
      const userId = getUserId();
      if (!userId) throw new Error('Must be logged in to send messages');
      return sendMessageApi(conversationId, userId, text);
    },
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (otherUserId: string) => {
      const userId = getUserId();
      if (!userId) throw new Error('Must be logged in to create conversations');
      return getOrCreateConversation(userId, otherUserId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useChatUsers() {
  return useQuery({
    queryKey: ['chatUsers'],
    queryFn: getAllUsers,
  });
}

export function useSearchChatUsers(query: string) {
  return useQuery({
    queryKey: ['chatUsers', 'search', query],
    queryFn: () => searchUsers(query),
    enabled: query.length > 0,
  });
}