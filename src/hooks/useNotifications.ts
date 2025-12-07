'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Notification } from '@/types';

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

async function fetchNotifications(): Promise<NotificationsResponse> {
  const res = await fetch('/api/notifications');
  if (!res.ok) {
    if (res.status === 401) {
      return { notifications: [], unreadCount: 0 };
    }
    throw new Error('Failed to fetch notifications');
  }
  return res.json();
}

async function markAsRead(id: string): Promise<Notification> {
  const res = await fetch(`/api/notifications/${id}/read`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to mark notification as read');
  return res.json();
}

async function markAllAsRead(): Promise<void> {
  const res = await fetch('/api/notifications/read-all', {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to mark all notifications as read');
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
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
