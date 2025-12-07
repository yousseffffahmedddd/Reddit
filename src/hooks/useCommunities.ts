'use client';

import { useQuery } from '@tanstack/react-query';
import type { Community } from '@/types';

async function fetchCommunities(search?: string): Promise<{ data: Community[]; total: number }> {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await fetch(`/api/communities${params}`);
  if (!res.ok) throw new Error('Failed to fetch communities');
  return res.json();
}

async function fetchCommunity(id: string): Promise<Community> {
  const res = await fetch(`/api/communities/${id}`);
  if (!res.ok) throw new Error('Community not found');
  return res.json();
}

export function useCommunities(search?: string) {
  return useQuery({
    queryKey: ['communities', search],
    queryFn: () => fetchCommunities(search),
  });
}

export function useCommunity(id: string) {
  return useQuery({
    queryKey: ['community', id],
    queryFn: () => fetchCommunity(id),
    enabled: !!id,
  });
}
