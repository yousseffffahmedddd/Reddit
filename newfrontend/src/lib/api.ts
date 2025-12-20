// filepath: /home/awail/WebstormProjects/islam_front/src/lib/api.ts
// Re-export API utilities for backward compatibility
// All API logic is now in /src/apis/*

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://44.192.94.63:3000';

// Re-export from authApi
export { getToken, getUserId, setToken, setUserId } from '@/apis/authApi';

// Re-export from userApi
export { getProfilePictureUrl } from '@/apis/userApi';

/**
 * Get authorization headers with the stored token
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Helper function for API requests with error handling
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);
  
  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data;
}
