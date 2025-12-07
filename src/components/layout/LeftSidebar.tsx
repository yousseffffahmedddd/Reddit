'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Flame, TrendingUp, Star, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, Button } from '@/components/ui';
import { useCommunities, useAuthStore } from '@/hooks';

interface LeftSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function LeftSidebar({ isOpen = true, onClose }: LeftSidebarProps) {
  const pathname = usePathname();
  const { data: communitiesData } = useCommunities();
  const { isAuthenticated } = useAuthStore();

  const communities = communitiesData?.data || [];

  const mainLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/popular', label: 'Popular', icon: Flame },
    { href: '/all', label: 'All', icon: TrendingUp },
  ];

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: typeof Home }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={onClose}
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
      >
        <Icon className="h-5 w-5" />
        {label}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 w-64 transform bg-card pt-12 transition-transform md:sticky md:top-12 md:z-0 md:h-[calc(100vh-48px)] md:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div className="relative h-full overflow-y-auto border-r bg-card p-4">
        {/* Main navigation */}
        <nav className="space-y-1">
          {mainLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <hr className="my-4" />

        {/* Communities */}
        <div>
          <div className="mb-2 flex items-center justify-between px-3">
            <span className="text-xs font-medium uppercase text-muted-foreground">Communities</span>
            {isAuthenticated && (
              <button className="rounded p-1 hover:bg-muted" aria-label="Create community">
                <Plus className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <nav className="space-y-1">
            {communities.slice(0, 10).map((community) => {
              const isActive = pathname === `/r/${community.name}`;
              return (
                <Link
                  key={community.id}
                  href={`/r/${community.name}`}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                    isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Avatar src={community.iconUrl} alt={community.name} size="xs" />
                  <span className="truncate">r/{community.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Favorites */}
        {isAuthenticated && (
          <>
            <hr className="my-4" />
            <div>
              <div className="mb-2 flex items-center gap-2 px-3">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium uppercase text-muted-foreground">Favorites</span>
              </div>
              <p className="px-3 text-xs text-muted-foreground">
                Star communities to add them to your favorites
              </p>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
