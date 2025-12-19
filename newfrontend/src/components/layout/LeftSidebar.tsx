'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Flame, TrendingUp, Star, Plus, MessageCircle, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui';
import { useCommunities, useAuthStore } from '@/hooks';
import { CreateCommunityModal } from '@/components/community';

interface LeftSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function LeftSidebar({ isOpen = true, onClose }: LeftSidebarProps) {
  const pathname = usePathname();
  const { data: communitiesData } = useCommunities();
  const { isAuthenticated } = useAuthStore();
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);

  const communities = communitiesData?.data || [];

  const mainLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/popular', label: 'Popular', icon: Flame },
    { href: '/all', label: 'All', icon: TrendingUp },
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
          {isAuthenticated && authLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <hr className="my-4" />

        {/* Communities */}
        <div>
          <div className="mb-2 flex items-center justify-between px-3">
            <span className="text-xs font-medium uppercase text-muted-foreground">Communities</span>
            {isAuthenticated && (
              <button
                onClick={() => setShowCreateCommunity(true)}
                className="rounded p-1 hover:bg-muted"
                aria-label="Create community"
              >
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

      <CreateCommunityModal
        isOpen={showCreateCommunity}
        onClose={() => setShowCreateCommunity(false)}
      />
    </aside>
  );
}


// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Home, Flame, TrendingUp, Star, Plus, MessageCircle, Bot, ChevronRight } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { Avatar } from '@/components/ui';
// import { useCommunities, useAuthStore } from '@/hooks';
// import { CreateCommunityModal } from '@/components/community';

// interface LeftSidebarProps {
//   isOpen?: boolean;
//   onClose?: () => void;
// }

// export function LeftSidebar({ isOpen = true, onClose }: LeftSidebarProps) {
//   const pathname = usePathname();
//   const { data: communitiesData } = useCommunities();
//   const { isAuthenticated } = useAuthStore();
//   const [showCreateCommunity, setShowCreateCommunity] = useState(false);
//   const [showMoreCommunities, setShowMoreCommunities] = useState(false);

//   const communities = communitiesData?.data || [];
//   const displayedCommunities = showMoreCommunities ? communities.slice(0, 20) : communities.slice(0, 10);

//   const mainLinks = [
//     { href: '/', label: 'Home', icon: Home },
//     { href: '/popular', label: 'Popular', icon: Flame },
//     { href: '/all', label: 'All', icon: TrendingUp },
//     { href: '/ask', label: 'Ask AI', icon: Bot },
//   ];

//   // Links that require authentication
//   const authLinks = [
//     { href: '/chat', label: 'Chat', icon: MessageCircle },
//   ];

//   const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: typeof Home }) => {
//     const isActive = pathname === href || pathname.startsWith(`${href}/`);
//     return (
//       <Link
//         href={href}
//         onClick={onClose}
//         className={cn(
//           'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
//           isActive 
//             ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
//             : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
//         )}
//       >
//         <Icon className="h-5 w-5" />
//         {label}
//       </Link>
//     );
//   };

//   return (
//     <>
//       {/* Backdrop for mobile */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 z-30 bg-black/50 md:hidden"
//           onClick={onClose}
//           aria-hidden="true"
//         />
//       )}

//       <aside
//         className={cn(
//           'fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 pt-12 transition-transform md:sticky md:top-12 md:z-0 md:h-[calc(100vh-48px)] md:translate-x-0',
//           isOpen ? 'translate-x-0' : '-translate-x-full'
//         )}
//       >
//         <div className="relative h-full p-4">
//           {/* Main navigation */}
//           <nav className="space-y-1 mb-6">
//             <p className="mb-2 px-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
//               FEED
//             </p>
//             {mainLinks.map((link) => (
//               <NavLink key={link.href} {...link} />
//             ))}
//             {isAuthenticated && authLinks.map((link) => (
//               <NavLink key={link.href} {...link} />
//             ))}
//           </nav>

//           {/* Communities */}
//           <div className="mb-6">
//             <div className="mb-3 flex items-center justify-between px-3">
//               <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
//                 TOP COMMUNITIES
//               </span>
//               {isAuthenticated && (
//                 <button
//                   onClick={() => setShowCreateCommunity(true)}
//                   className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                   aria-label="Create community"
//                 >
//                   <Plus className="h-4 w-4 text-gray-500 dark:text-gray-400" />
//                 </button>
//               )}
//             </div>

//             <nav className="space-y-1">
//               {displayedCommunities.map((community) => {
//                 const isActive = pathname === `/r/${community.name}` || pathname.startsWith(`/r/${community.name}/`);
//                 return (
//                   <Link
//                     key={community.id}
//                     href={`/r/${community.name}`}
//                     onClick={onClose}
//                     className={cn(
//                       'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors group',
//                       isActive 
//                         ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
//                         : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
//                     )}
//                   >
//                     <div className="flex items-center gap-3 min-w-0">
//                       <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
//                         {communities.indexOf(community) + 1}
//                       </span>
//                       <Avatar 
//                         src={community.iconUrl} 
//                         alt={community.name} 
//                         size="sm"
//                         className="border border-gray-300 dark:border-gray-700"
//                       />
//                       <div className="min-w-0">
//                         <span className="font-medium truncate">r/{community.name}</span>
//                         <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
//                           {community.memberCount?.toLocaleString() || '0'} members
//                         </p>
//                       </div>
//                     </div>
//                     {isActive && (
//                       <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
//                     )}
//                   </Link>
//                 );
//               })}
//             </nav>

//             {communities.length > 10 && (
//               <button
//                 onClick={() => setShowMoreCommunities(!showMoreCommunities)}
//                 className="mt-3 w-full rounded-md px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-2 justify-center"
//               >
//                 <ChevronRight className={cn(
//                   'h-4 w-4 transition-transform',
//                   showMoreCommunities ? 'rotate-90' : ''
//                 )} />
//                 {showMoreCommunities ? 'Show Less' : 'Show More'}
//               </button>
//             )}
//           </div>

//           {/* Favorites */}
//           {isAuthenticated && (
//             <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
//               <div className="mb-3 flex items-center gap-2 px-3">
//                 <Star className="h-4 w-4 text-gray-500 dark:text-gray-400" />
//                 <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
//                   Favorites
//                 </span>
//               </div>
//               <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4">
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   Star communities to add them to your favorites
//                 </p>
//                 <button className="mt-2 w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 transition-colors">
//                   Explore Communities
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         <CreateCommunityModal
//           isOpen={showCreateCommunity}
//           onClose={() => setShowCreateCommunity(false)}
//         />
//       </aside>
//     </>
//   );
// }


// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Home, Flame, TrendingUp, Star, Plus, MessageCircle, Bot, ChevronRight } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { Avatar } from '@/components/ui';
// import { useCommunities, useAuthStore } from '@/hooks';
// import { CreateCommunityModal } from '@/components/community';

// interface LeftSidebarProps {
//   isOpen?: boolean;
//   onClose?: () => void;
// }

// export function LeftSidebar({ isOpen = true, onClose }: LeftSidebarProps) {
//   const pathname = usePathname();
//   const { data: communitiesData } = useCommunities();
//   const { isAuthenticated } = useAuthStore();
//   const [showCreateCommunity, setShowCreateCommunity] = useState(false);
//   const [showMoreCommunities, setShowMoreCommunities] = useState(false);

//   const communities = communitiesData?.data || [];
//   const displayedCommunities = showMoreCommunities ? communities.slice(0, 20) : communities.slice(0, 10);

//   const mainLinks = [
//     { href: '/', label: 'Home', icon: Home },
//     { href: '/popular', label: 'Popular', icon: Flame },
//     { href: '/all', label: 'All', icon: TrendingUp },
//     { href: '/ask', label: 'Ask AI', icon: Bot },
//   ];

//   // Links that require authentication
//   const authLinks = [
//     { href: '/chat', label: 'Chat', icon: MessageCircle },
//   ];

//   const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: typeof Home }) => {
//     const isActive = pathname === href || pathname.startsWith(`${href}/`);
//     return (
//       <Link
//         href={href}
//         onClick={onClose}
//         className={cn(
//           'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
//           isActive 
//             ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
//             : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
//         )}
//       >
//         <Icon className="h-5 w-5" />
//         {label}
//       </Link>
//     );
//   };

//   return (
//     <>
//       {/* Backdrop for mobile */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 z-30 bg-black/50 md:hidden"
//           onClick={onClose}
//           aria-hidden="true"
//         />
//       )}

//       <aside
//         className={cn(
//           'fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 pt-12 transition-transform md:sticky md:top-12 md:z-0 md:h-[calc(100vh-48px)] md:translate-x-0',
//           isOpen ? 'translate-x-0' : '-translate-x-full'
//         )}
//       >
//         <div className="relative h-full p-4">
//           {/* Main navigation */}
//           <nav className="space-y-1 mb-6">
//             <p className="mb-2 px-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
//               FEED
//             </p>
//             {mainLinks.map((link) => (
//               <NavLink key={link.href} {...link} />
//             ))}
//             {isAuthenticated && authLinks.map((link) => (
//               <NavLink key={link.href} {...link} />
//             ))}
//           </nav>

//           {/* Communities */}
//           <div className="mb-6">
//             <div className="mb-3 flex items-center justify-between px-3">
//               <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
//                 TOP COMMUNITIES
//               </span>
//               {isAuthenticated && (
//                 <button
//                   onClick={() => setShowCreateCommunity(true)}
//                   className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                   aria-label="Create community"
//                 >
//                   <Plus className="h-4 w-4 text-gray-500 dark:text-gray-400" />
//                 </button>
//               )}
//             </div>

//             <nav className="space-y-1">
//               {displayedCommunities.map((community) => {
//                 const isActive = pathname === `/r/${community.name}` || pathname.startsWith(`/r/${community.name}/`);
//                 return (
//                   <Link
//                     key={community.id}
//                     href={`/r/${community.name}`}
//                     onClick={onClose}
//                     className={cn(
//                       'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors group',
//                       isActive 
//                         ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
//                         : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
//                     )}
//                   >
//                     <div className="flex items-center gap-3 min-w-0">
//                       <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
//                         {communities.indexOf(community) + 1}
//                       </span>
//                       <Avatar 
//                         src={community.iconUrl} 
//                         alt={community.name} 
//                         size="sm"
//                         className="border border-gray-300 dark:border-gray-700"
//                       />
//                       <div className="min-w-0">
//                         <span className="font-medium truncate">r/{community.name}</span>
//                         <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
//                           {community.memberCount?.toLocaleString() || '0'} members
//                         </p>
//                       </div>
//                     </div>
//                     {isActive && (
//                       <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
//                     )}
//                   </Link>
//                 );
//               })}
//             </nav>

//             {communities.length > 10 && (
//               <button
//                 onClick={() => setShowMoreCommunities(!showMoreCommunities)}
//                 className="mt-3 w-full rounded-md px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-2 justify-center"
//               >
//                 <ChevronRight className={cn(
//                   'h-4 w-4 transition-transform',
//                   showMoreCommunities ? 'rotate-90' : ''
//                 )} />
//                 {showMoreCommunities ? 'Show Less' : 'Show More'}
//               </button>
//             )}
//           </div>

//           {/* Favorites */}
//           {isAuthenticated && (
//             <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
//               <div className="mb-3 flex items-center gap-2 px-3">
//                 <Star className="h-4 w-4 text-gray-500 dark:text-gray-400" />
//                 <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
//                   Favorites
//                 </span>
//               </div>
//               <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4">
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   Star communities to add them to your favorites
//                 </p>
//                 <button className="mt-2 w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 transition-colors">
//                   Explore Communities
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         <CreateCommunityModal
//           isOpen={showCreateCommunity}
//           onClose={() => setShowCreateCommunity(false)}
//         />
//       </aside>
//     </>
//   );
// }