'use client';

// TODO: Notifications API is NOT implemented in the backend
// All notification hooks are stubbed until backend implements:
// - GET /api/notifications
// - PATCH /api/notifications/:id/read
// - PATCH /api/notifications/read-all

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Notification } from '@/types';

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

// Stub implementation that returns empty data
async function fetchNotifications(): Promise<NotificationsResponse> {
  // Backend doesn't have notifications endpoint
  // Return empty data to prevent errors
  return { notifications: [], unreadCount: 0 };
}

async function markAsRead(_id: string): Promise<Notification | null> {
  // Backend doesn't have this endpoint
  console.warn('markAsRead: Notifications not implemented in backend');
  return null;
}

async function markAllAsRead(): Promise<void> {
  // Backend doesn't have this endpoint
  console.warn('markAllAsRead: Notifications not implemented in backend');
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 30000,
    staleTime: 10000,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousData = queryClient.getQueryData<NotificationsResponse>(['notifications']);

      queryClient.setQueryData<NotificationsResponse>(['notifications'], (old) => {
        if (!old) return old;
        return {
          notifications: old.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, old.unreadCount - 1),
        };
      });

      return { previousData };
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['notifications'], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousData = queryClient.getQueryData<NotificationsResponse>(['notifications']);

      queryClient.setQueryData<NotificationsResponse>(['notifications'], (old) => {
        if (!old) return old;
        return {
          notifications: old.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        };
      });

      return { previousData };
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['notifications'], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

