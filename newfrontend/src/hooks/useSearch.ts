'use client';

import { useQuery } from '@tanstack/react-query';
import { searchCommunities, type CommunityData } from '@/apis/communityApi';
import { searchUsers as searchChatUsers, getAllUsers, type ChatUser } from '@/apis/chatApi';
import { getUserProfile, getProfilePictureUrl } from '@/apis/userApi';
import type { SearchResult, User, Community } from '@/types';

// Transform functions
function transformCommunity(c: CommunityData): Community {
  return {
    id: c._id,
    name: c.name,
    displayName: c.name,
    description: c.description || '',
    iconUrl: null,
    bannerUrl: null,
    memberCount: c.members?.length || 0,
    createdAt: new Date().toISOString(),
    rules: [],
    moderators: [],
  };
}

function transformChatUser(u: ChatUser): User {
  return {
    id: u._id,
    username: u.username,
    displayName: u.username,
    avatarUrl: null,
    karma: 0,
    cakeDay: new Date().toISOString(),
    bio: null,
    createdAt: new Date().toISOString(),
  };
}

async function search(query: string, type?: string): Promise<SearchResult> {
  const results: SearchResult = {
    posts: [],
    communities: [],
    users: [],
  };

  // Search communities
  if (!type || type === 'all' || type === 'communities') {
    try {
      const backendCommunities = await searchCommunities(query);
      results.communities = backendCommunities.map(transformCommunity);
    } catch (error) {
      console.error('Community search error:', error);
    }
  }

  // Search users (using chat users search endpoint)
  if (!type || type === 'all' || type === 'users') {
    try {
      // Try the search endpoint first
      const users = await searchChatUsers(query);
      results.users = users.map(transformChatUser);
    } catch (error) {
      console.error('User search error:', error);
      // Fallback: get all users and filter client-side
      try {
        const allUsers = await getAllUsers();
        const queryLower = query.toLowerCase();
        const filteredUsers = allUsers.filter(u =>
          u.username.toLowerCase().includes(queryLower)
        );
        results.users = filteredUsers.map(transformChatUser);
      } catch (fallbackError) {
        console.error('User search fallback error:', fallbackError);
      }
    }
  }

  // Note: Post search not implemented in backend

  return results;
}

async function fetchUser(username: string): Promise<User> {
  const profile = await getUserProfile(username);

  return {
    id: profile._id,
    username: profile.username,
    displayName: profile.displayName || profile.username,
    avatarUrl: profile.profilePicture ? getProfilePictureUrl(profile.profilePicture) : null,
    karma: profile.karma || 0,
    cakeDay: profile.createdAt,
    bio: profile.bio || null,
    createdAt: profile.createdAt,
  };
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