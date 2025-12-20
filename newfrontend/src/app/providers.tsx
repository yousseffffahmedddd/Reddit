'use client';

import { useState, useEffect } from 'react';
import { QueryProvider, ThemeProvider } from '@/providers';
// MSW Provider removed - using real backend API
// import { MSWProvider } from '@/mocks/MSWProvider';
import { Header, LeftSidebar, RightSidebar, AuthModal } from '@/components/layout';
import { ErrorBoundary } from '@/components/ui';
import { cn } from '@/lib/utils';

export function Providers({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  useEffect(() => {
    // Open sidebar by default on desktop
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);

  return (
    // MSWProvider removed - using real backend at http://44.192.94.63:3000
    <QueryProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-background">
            <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} onAuthClick={openAuthModal} />
            <div className="flex min-h-[calc(100vh-48px)]">
              <LeftSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
              <div className={cn("flex-1 transition-all duration-300 ease-in-out", sidebarOpen ? "md:ml-[270px]" : "")}>
                <div className="lg:mr-[312px]">
                  <div className="mx-auto max-w-[1000px]">
                    <main className="flex-1 px-4 py-4 lg:px-6">{children}</main>
                  </div>
                </div>
              </div>
              <RightSidebar onAuthClick={openAuthModal} />
            </div>
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialMode={authMode} />
          </div>
        </ErrorBoundary>
      </ThemeProvider>
    </QueryProvider>
  );
}
