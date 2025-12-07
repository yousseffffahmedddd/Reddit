'use client';

import { useQuery } from '@tanstack/react-query';
import type { SearchResult, User } from '@/types';

async function search(query: string, type?: string): Promise<SearchResult> {
  const params = new URLSearchParams({ q: query });
  if (type) params.set('type', type);
  const res = await fetch(`/api/search?${params}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

async function fetchUser(username: string): Promise<User> {
  const res = await fetch(`/api/users/${username}`);
  if (!res.ok) throw new Error('User not found');
  return res.json();
}

export function useSearch(query: string, type?: string) {
  return useQuery({
    queryKey: ['search', query, type],
    queryFn: () => search(query, type),
    enabled: query.length >= 2,
  });
}

export function useUser(username: string) {
  return useQuery({
    queryKey: ['user', username],
    queryFn: () => fetchUser(username),
    enabled: !!username,
  });
}
