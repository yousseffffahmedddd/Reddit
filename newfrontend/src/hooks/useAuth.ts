'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    loginUser,
    signupUser,
    googleAuth,
    logout as logoutApi,
    setToken,
    setUserId,
    type AuthResponse
} from '@/apis/authApi';
import type { AuthUser, GoogleAuthInput, LoginInput, RegisterInput } from '@/types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        // Store in localStorage for API calls
        setToken(token);
        setUserId(user.id);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
        }
        set({ user, token, isAuthenticated: true });
      },
      clearAuth: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Transform backend response to frontend AuthUser type
function transformAuthResponse(response: AuthResponse): { user: AuthUser; token: string } {
  if (!response.user || !response.token) {
    throw new Error('Invalid auth response');
  }

  return {
    user: {
      id: response.user.id,
      username: response.user.username,
      email: response.user.email,
      displayName: response.user.username,
      avatarUrl: response.user.avatarUrl || null,
      karma: 0,
      cakeDay: new Date().toISOString(),
      bio: null,
      createdAt: new Date().toISOString(),
    },
    token: response.token,
  };
}

async function login(input: LoginInput): Promise<{ user: AuthUser; token: string }> {
  // Backend expects email for login
  const response = await loginUser({
    email: input.username.includes('@') ? input.username : input.username,
    password: input.password,
  });

  return transformAuthResponse(response);
}

async function register(input: RegisterInput): Promise<{ user: AuthUser; token: string }> {
  const response = await signupUser({
    username: input.username,
    email: input.email,
    password: input.password,
  });

  return transformAuthResponse(response);
}

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      // Ensure token is in localStorage before redirect
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userId', data.user.id);
        // Force a small delay to ensure localStorage is written
        setTimeout(() => {
          window.location.href = '/';
        }, 50);
      }
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: register,
    // Don't automatically log in after registration
    // User must explicitly log in to become authenticated
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
  });
}

// Note: useCurrentUser returns stored user from zustand
// The backend doesn't have a GET /api/auth/me endpoint
export function useCurrentUser() {
  const { user, isAuthenticated } = useAuthStore();

  return {
    data: user,
    isAuthenticated,
    isLoading: false,
    isError: false,
    error: null,
  };
}

async function googleAuthLogin(input: GoogleAuthInput): Promise<{ user: AuthUser; token: string }> {
  const response = await googleAuth({
    token: input.token,
  });

  return transformAuthResponse(response);
}

export function useGoogleAuth() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: googleAuthLogin,
    onSuccess: (data) => {
      console.log('Google OAuth successful:', data);
      setAuth(data.user, data.token);
      // Ensure token is in localStorage before redirect
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userId', data.user.id);
        console.log('Auth data stored in localStorage');
        // Force a small delay to ensure localStorage is written
        setTimeout(() => {
          window.location.href = '/';
        }, 50);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
    },
  });
}
