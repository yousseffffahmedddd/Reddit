'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AuthUser, LoginInput, RegisterInput, AuthResponse } from '@/types';

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
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

async function login(input: LoginInput): Promise<AuthResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }
  return res.json();
}

async function register(input: RegisterInput): Promise<AuthResponse> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Registration failed');
  }
  return res.json();
}

async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
}

async function fetchCurrentUser(): Promise<AuthUser> {
  const res = await fetch('/api/auth/me');
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
  });
}

export function useCurrentUser() {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    enabled: isAuthenticated,
    initialData: user ?? undefined,
  });
}
