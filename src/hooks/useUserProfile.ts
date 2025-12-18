'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserId } from '@/apis/authApi';
import {
    getUserProfile as getUserProfileApi,
    updateUserProfile as updateUserProfileApi,
    uploadProfilePicture as uploadProfilePictureApi,
    deleteProfilePicture as deleteProfilePictureApi,
    getProfilePictureUrl as getProfilePictureUrlApi,
    type UserProfile,
} from '@/apis/userApi';
import type { User } from '@/types';

// Re-export getProfilePictureUrl for components
export const getProfilePictureUrl = getProfilePictureUrlApi;

// Transform backend user profile to frontend User type
function transformUserProfile(profile: UserProfile): User {
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

export function useUserProfile(username: string | null) {
  return useQuery({
    queryKey: ['userProfile', username],
    queryFn: async () => {
      if (!username) throw new Error('Username is required');
      const profile = await getUserProfileApi(username);
      return transformUserProfile(profile);
    },
    enabled: !!username,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { bio?: string; displayName?: string }) => {
      const userId = getUserId();
      if (!userId) throw new Error('Must be logged in to update profile');
      return updateUserProfileApi(userId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useUploadProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const userId = getUserId();
      if (!userId) throw new Error('Must be logged in to upload profile picture');
      return uploadProfilePictureApi(userId, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useDeleteProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const userId = getUserId();
      if (!userId) throw new Error('Must be logged in to delete profile picture');
      return deleteProfilePictureApi(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
