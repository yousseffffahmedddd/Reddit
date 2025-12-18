'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserId } from '@/apis/authApi';
import {
    getAllCommunities,
    searchCommunities,
    joinCommunity as joinCommunityApi,
    getJoinedCommunities,
    type CommunityData,
} from '@/apis/communityApi';
import type { Community } from '@/types';

// Transform backend community to frontend format
function transformCommunity(backendCommunity: CommunityData): Community {
  return {
    id: backendCommunity._id,
    name: backendCommunity.name,
    displayName: backendCommunity.name,
    description: backendCommunity.description || '',
    iconUrl: null,
    bannerUrl: null,
    memberCount: backendCommunity.members?.length || 0,
    createdAt: new Date().toISOString(),
    rules: [],
    moderators: [],
  };
}

async function fetchCommunities(search?: string): Promise<{ data: Community[]; total: number }> {
  const backendCommunities = search
    ? await searchCommunities(search)
    : await getAllCommunities();

  const communities = backendCommunities.map(transformCommunity);

  return {
    data: communities,
    total: communities.length,
  };
}

async function fetchCommunity(id: string): Promise<Community> {
  const backendCommunities = await getAllCommunities();
  const backendCommunity = backendCommunities.find(c => c._id === id || c.name === id);

  if (!backendCommunity) throw new Error('Community not found');

  return transformCommunity(backendCommunity);
}

async function joinCommunity(communityId: string): Promise<void> {
  const userId = getUserId();
  if (!userId) throw new Error('Must be logged in to join a community');

  await joinCommunityApi(communityId, userId);
}

async function fetchJoinedCommunities(): Promise<{ data: Community[]; total: number }> {
  const userId = getUserId();
  if (!userId) return { data: [], total: 0 };

  const backendCommunities = await getJoinedCommunities(userId);
  const communities = backendCommunities.map(transformCommunity);

  return {
    data: communities,
    total: communities.length,
  };
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

export function useJoinedCommunities() {
  return useQuery({
    queryKey: ['communities', 'joined'],
    queryFn: fetchJoinedCommunities,
  });
}

export function useJoinCommunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });
}
