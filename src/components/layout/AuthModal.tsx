'use client';

import { useState } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import { useLogin, useRegister } from '@/hooks';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: login, isPending: isLoggingIn, error: loginError } = useLogin();
  const { mutate: register, isPending: isRegistering, error: registerError } = useRegister();

  const isPending = isLoggingIn || isRegistering;
  const error = mode === 'login' ? loginError : registerError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      login(
        { username, password },
        {
          onSuccess: () => {
            resetForm();
            onClose();
          },
        }
      );
    } else {
      register(
        { username, email, password },
        {
          onSuccess: () => {
            resetForm();
            onClose();
          },
        }
      );
    }
  };

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Log In' : 'Sign Up'}
      description={
        mode === 'login'
          ? 'Welcome back! Log in to continue.'
          : 'Create an account to join the community.'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Username</label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            required
            autoComplete="username"
          />
        </div>

        {mode === 'register' && (
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              autoComplete="email"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive">{error.message}</p>
        )}

        <Button type="submit" className="w-full" isLoading={isPending}>
          {mode === 'login' ? 'Log In' : 'Sign Up'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={switchMode}
            className="text-primary hover:underline"
          >
            {mode === 'login' ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </form>
    </Modal>
  );
}
