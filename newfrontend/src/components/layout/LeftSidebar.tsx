'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, MessageCircle, Bot, ChevronDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui';
import { useCommunities, useAuthStore, useOwnedCommunities } from '@/hooks';
import { CreateCommunityModal } from '@/components/community';

interface LeftSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function LeftSidebar({ isOpen = true, onClose }: LeftSidebarProps) {
  const pathname = usePathname();
  const { data: communitiesData } = useCommunities();
  const { data: ownedCommunitiesData } = useOwnedCommunities();
  const { isAuthenticated } = useAuthStore();
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ feeds: true, owned: true, communities: true });

  const communities = communitiesData?.data || [];
  const ownedCommunities = ownedCommunitiesData?.data || [];

  const feedLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/popular', label: 'Popular', icon: TrendingUp },
  ];

  const otherLinks = [
    { href: '/ask', label: 'Ask AI', icon: Bot },
  ];

  // Links that require authentication
  const authLinks = [
    { href: '/chat', label: 'Chat', icon: MessageCircle },
  ];

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: typeof Home }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => {
          if (window.innerWidth < 768) onClose?.();
        }}
        className={cn(
          'flex items-center gap-2.5 rounded px-2 py-1.5 text-sm transition-colors',
          isActive 
            ? 'bg-secondary/60 font-medium text-foreground' 
            : 'text-foreground hover:bg-hover'
        )}
      >
        <Icon className={cn('h-5 w-5', isActive ? 'text-foreground' : 'text-muted-foreground')} />
        {label}
      </Link>
    );
  };

  const toggleSection = (section: 'feeds' | 'owned' | 'communities') => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 w-[270px] transform bg-card pt-12 transition-transform duration-300 ease-in-out md:top-12 md:h-[calc(100vh-48px)] md:pt-0',
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

      <div className="relative h-full overflow-y-auto border-r border-border bg-card px-3 py-4">
        {/* Feeds */}
        <div className="mb-3">
          <button
            onClick={() => toggleSection('feeds')}
            className="flex w-full items-center justify-between px-2.5 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            <span>Feeds</span>
            <ChevronDown className={cn('h-4 w-4 transition-transform', !expandedSections.feeds && '-rotate-90')} />
          </button>

          {expandedSections.feeds && (
            <nav className="mt-1 space-y-0.5">
              {feedLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </nav>
          )}
        </div>

        {/* Other / Apps */}
        <div className="mb-3">
          <div className="px-2.5 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Apps
          </div>
          <nav className="mt-1 space-y-0.5">
            {otherLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
            {isAuthenticated && authLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>
        </div>

        <hr className="my-3 border-border" />

        {/* Your Communities - communities you created */}
        {isAuthenticated && ownedCommunities.length > 0 && (
          <>
            <div>
              <button
                onClick={() => toggleSection('owned')}
                className="flex w-full items-center justify-between px-2.5 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                <span>Your Communities</span>
                <ChevronDown className={cn('h-4 w-4 transition-transform', !expandedSections.owned && '-rotate-90')} />
              </button>

              {expandedSections.owned && (
                <nav className="mt-1 space-y-0.5">
                  {ownedCommunities.map((community) => {
                    const isActive = pathname === `/r/${community.name}`;
                    return (
                      <Link
                        key={community.id}
                        href={`/r/${community.name}`}
                        onClick={() => {
                          if (window.innerWidth < 768) onClose?.();
                        }}
                        className={cn(
                          'group flex items-center gap-2 rounded px-2.5 py-1.5 text-sm transition-colors',
                          isActive 
                            ? 'bg-secondary font-medium text-foreground' 
                            : 'text-foreground hover:bg-hover'
                        )}
                      >
                        <Avatar src={community.iconUrl} alt={community.name} size="xs" />
                        <span className="truncate">r/{community.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              )}
            </div>
            <hr className="my-3 border-border" />
          </>
        )}

        {/* Communities */}
        <div>
          <div className="flex items-center justify-between px-2.5 py-2">
            <button
              onClick={() => toggleSection('communities')}
              className="flex items-center gap-1 text-2xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              <span>Communities</span>
              <ChevronDown className={cn('h-4 w-4 transition-transform', !expandedSections.communities && '-rotate-90')} />
            </button>
            {isAuthenticated && (
              <button
                onClick={() => setShowCreateCommunity(true)}
                className="rounded p-1 text-muted-foreground hover:bg-hover hover:text-foreground"
                aria-label="Create community"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>

          {expandedSections.communities && (
            <nav className="mt-1 space-y-0.5">
              {communities.slice(0, 10).map((community) => {
                const isActive = pathname === `/r/${community.name}`;
                return (
                  <Link
                    key={community.id}
                    href={`/r/${community.name}`}
                    onClick={() => {
                      if (window.innerWidth < 768) onClose?.();
                    }}
                    className={cn(
                      'flex items-center gap-2 rounded px-2.5 py-1.5 text-sm transition-colors',
                      isActive 
                        ? 'bg-secondary font-medium text-foreground' 
                        : 'text-foreground hover:bg-hover'
                    )}
                  >
                    <Avatar src={community.iconUrl} alt={community.name} size="xs" />
                    <span className="truncate">r/{community.name}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </div>

      <CreateCommunityModal
        isOpen={showCreateCommunity}
        onClose={() => setShowCreateCommunity(false)}
      />
    </aside>
  );
}
