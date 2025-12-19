'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import { useLogin, useRegister, useGoogleAuth } from '@/hooks';
import { GoogleLogin } from '@react-oauth/google';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const { mutate: login, isPending: isLoggingIn, error: loginError } = useLogin();
  const { mutate: register, isPending: isRegistering, error: registerError } = useRegister();
  const { mutate: googleAuth, isPending: isGoogleAuthing } = useGoogleAuth();

  const isPending = isLoggingIn || isRegistering || isGoogleAuthing;
  const error = mode === 'login' ? loginError : registerError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      // Backend expects email for login
      // We use the email field for login
      login(
        { username: email, password },
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
            // Registration successful - close modal
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
        {mode === 'register' && (
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
        )}

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

        {/* Google OAuth available in both login and register modes */}
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log('Google OAuth credential received:', credentialResponse);
            if (credentialResponse.credential) {
              googleAuth({ token: credentialResponse.credential });
              // Close modal after successful auth
              onClose();
            }
          }}
          onError={() => {
            console.error('Google OAuth failed');
          }}
          useOneTap
          theme="outline"
          size="large"
          width="100%"
          text="signin_with"
        />

        <div className="relative flex items-center justify-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

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
