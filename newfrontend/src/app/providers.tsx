'use client';

import { useState } from 'react';
import { QueryProvider, ThemeProvider } from '@/providers';
// MSW Provider removed - using real backend API
// import { MSWProvider } from '@/mocks/MSWProvider';
import { Header, LeftSidebar, RightSidebar, AuthModal } from '@/components/layout';
import { ErrorBoundary } from '@/components/ui';

export function Providers({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    // MSWProvider removed - using real backend at http://localhost:3000
    <QueryProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-background">
            <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} onAuthClick={openAuthModal} />
            <div className="mx-auto flex max-w-7xl">
              <LeftSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
              <main className="min-h-[calc(100vh-48px)] flex-1 p-4">{children}</main>
              <RightSidebar onAuthClick={openAuthModal} />
            </div>
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialMode={authMode} />
          </div>
        </ErrorBoundary>
      </ThemeProvider>
    </QueryProvider>
  );
}
