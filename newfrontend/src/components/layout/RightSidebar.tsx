'use client';

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { Avatar, Button } from '@/components/ui';
import { useCommunities, useAuthStore } from '@/hooks';
import { formatNumber } from '@/lib/utils';

interface RightSidebarProps {
  onAuthClick?: (mode: 'login' | 'register') => void;
}

export function RightSidebar({ onAuthClick }: RightSidebarProps) {
  const { data: communitiesData } = useCommunities();
  const { isAuthenticated } = useAuthStore();

  const communities = communitiesData?.data || [];
  const topCommunities = [...communities].sort((a, b) => b.memberCount - a.memberCount).slice(0, 5);

  return (
    <aside className="sticky top-12 hidden h-[calc(100vh-48px)] w-80 shrink-0 overflow-y-auto p-4 lg:block">
      {/* Sign up card (for non-authenticated users) */}
      {!isAuthenticated && (
        <div className="mb-4 rounded-md border bg-card p-4">
          <h3 className="mb-2 font-medium">Welcome to Reddit</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Join communities and share your thoughts with millions of people.
          </p>
          <div className="flex flex-col gap-2">
            <Button className="w-full" onClick={() => onAuthClick?.('register')}>Sign Up</Button>
            <Button variant="outline" className="w-full" onClick={() => onAuthClick?.('login')}>Log In</Button>
          </div>
        </div>
      )}

      {/* Trending communities */}
      <div className="mb-4 rounded-md border bg-card">
        <div className="flex items-center gap-2 border-b p-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Top Communities</h3>
        </div>
        <div className="divide-y">
          {topCommunities.map((community, index) => (
            <Link
              key={community.id}
              href={`/r/${community.name}`}
              className="flex items-center gap-3 p-3 hover:bg-muted"
            >
              <span className="w-5 text-sm text-muted-foreground">{index + 1}</span>
              <Avatar src={community.iconUrl} alt={community.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">r/{community.name}</p>
                <p className="text-xs text-muted-foreground">{formatNumber(community.memberCount)} members</p>
              </div>
            </Link>
          ))}
        </div>
      </div>


      {/* Footer links */}
      <div className="rounded-md border bg-card p-4">
        <div className="mb-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <Link href="/legal/user-agreement" className="hover:underline">User Agreement</Link>
          <Link href="/legal/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <Link href="/legal/content-policy" className="hover:underline">Content Policy</Link>
          <Link href="/legal" className="hover:underline">Help Center</Link>
        </div>
        <p className="text-xs text-muted-foreground">
          Reddit Clone © {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
    </aside>
  );
}
// 'use client';

// import Link from 'next/link';
// import { TrendingUp, Flame, Users, Award, ExternalLink, ChevronUp, ChevronDown, Sparkles, Shield, HelpCircle, FileText } from 'lucide-react';
// import { Avatar, Button } from '@/components/ui';
// import { useCommunities, useAuthStore } from '@/hooks';
// import { formatNumber } from '@/lib/utils';

// interface RightSidebarProps {
//   onAuthClick?: (mode: 'login' | 'register') => void;
// }

// export function RightSidebar({ onAuthClick }: RightSidebarProps) {
//   const { data: communitiesData } = useCommunities();
//   const { isAuthenticated } = useAuthStore();

//   const communities = communitiesData?.data || [];
//   const topCommunities = [...communities].sort((a, b) => b.memberCount - a.memberCount).slice(0, 10);

//   return (
//     <aside className="sticky top-12 hidden h-[calc(100vh-48px)] w-80 shrink-0 overflow-y-auto border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 lg:block">
//       {/* Sign up card (for non-authenticated users) */}
//       {!isAuthenticated && (
//         <div className="mb-6 rounded-lg border border-gray-300 dark:border-gray-700 bg-gradient-to-b from-orange-50 to-white dark:from-gray-800 dark:to-gray-900 p-5">
//           <div className="mb-4">
//             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Home</h3>
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               Your personal Reddit frontpage. Come here to check in with your favorite communities.
//             </p>
//           </div>
//           <div className="space-y-3">
//             <Button 
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full h-10"
//               onClick={() => onAuthClick?.('register')}
//             >
//               Create Account
//             </Button>
//             <Button 
//               variant="outline"
//               className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold rounded-full h-10"
//               onClick={() => onAuthClick?.('login')}
//             >
//               Log In
//             </Button>
//           </div>
//           <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//             <p className="text-xs text-gray-500 dark:text-gray-400">
//               By continuing, you agree to our User Agreement and Privacy Policy.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Reddit Premium */}
//       {isAuthenticated && (
//         <div className="mb-6 rounded-lg border border-gray-300 dark:border-gray-700 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-5">
//           <div className="flex items-start gap-3 mb-3">
//             <div className="bg-white rounded-full p-2">
//               <Award className="h-6 w-6 text-orange-500" />
//             </div>
//             <div>
//               <h3 className="text-white font-bold">Reddit Premium</h3>
//               <p className="text-white/80 text-sm">The best Reddit experience, with monthly Coins</p>
//             </div>
//           </div>
//           <Button className="w-full bg-white text-orange-600 hover:bg-gray-100 font-bold rounded-full h-9">
//             Try Now
//           </Button>
//         </div>
//       )}

//       {/* Trending communities */}
//       <div className="mb-6 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
//         <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3 border-b border-gray-300 dark:border-gray-700">
//           <div className="flex items-center gap-2">
//             <TrendingUp className="h-5 w-5 text-orange-500" />
//             <h3 className="font-bold text-gray-900 dark:text-white">Top Communities</h3>
//           </div>
//         </div>
//         <div className="divide-y divide-gray-200 dark:divide-gray-800">
//           {topCommunities.map((community, index) => (
//             <Link
//               key={community.id}
//               href={`/r/${community.name}`}
//               className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
//             >
//               <div className="flex items-center gap-3 flex-1 min-w-0">
//                 <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
//                   {index + 1}
//                 </span>
//                 <Avatar 
//                   src={community.iconUrl} 
//                   alt={community.name} 
//                   size="sm"
//                   className="border border-gray-300 dark:border-gray-700 group-hover:border-gray-400 dark:group-hover:border-gray-600"
//                 />
//                 <div className="min-w-0 flex-1">
//                   <p className="truncate font-medium text-gray-900 dark:text-white">r/{community.name}</p>
//                   <div className="flex items-center gap-1">
//                     <Users className="h-3 w-3 text-gray-400" />
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       {formatNumber(community.memberCount)} members
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <button className="rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1 text-xs font-bold transition-colors">
//                 Join
//               </button>
//             </Link>
//           ))}
//         </div>
//         <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3">
//           <Link 
//             href="/communities"
//             className="flex items-center justify-center text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold text-sm"
//           >
//             View All
//             <ExternalLink className="h-4 w-4 ml-1" />
//           </Link>
//         </div>
//       </div>

//       {/* Trending Topics */}
//       <div className="mb-6 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
//         <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3 border-b border-gray-300 dark:border-gray-700">
//           <div className="flex items-center gap-2">
//             <Flame className="h-5 w-5 text-orange-500" />
//             <h3 className="font-bold text-gray-900 dark:text-white">Trending Today</h3>
//           </div>
//         </div>
//         <div className="divide-y divide-gray-200 dark:divide-gray-800">
//           {[
//             { id: 1, title: 'New AI Breakthrough Announced', community: 'technology' },
//             { id: 2, title: 'Major Game Release This Week', community: 'gaming' },
//             { id: 3, title: 'Discussion: Future of Social Media', community: 'discussion' },
//             { id: 4, title: 'Community Event This Weekend', community: 'events' },
//           ].map((topic) => (
//             <Link
//               key={topic.id}
//               href={`/r/${topic.community}`}
//               className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//             >
//               <div className="flex items-start gap-2 mb-1">
//                 <ChevronUp className="h-4 w-4 text-orange-500 mt-0.5" />
//                 <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
//                   {topic.title}
//                 </p>
//               </div>
//               <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">r/{topic.community}</p>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="text-xs text-gray-500 dark:text-gray-400 space-y-4">
//         <div className="flex flex-wrap gap-3">
//           <Link href="/legal/user-agreement" className="hover:underline hover:text-gray-700 dark:hover:text-gray-300">User Agreement</Link>
//           <Link href="/legal/privacy-policy" className="hover:underline hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</Link>
//           <Link href="/legal/content-policy" className="hover:underline hover:text-gray-700 dark:hover:text-gray-300">Content Policy</Link>
//           <Link href="/legal" className="hover:underline hover:text-gray-700 dark:hover:text-gray-300">Help Center</Link>
//         </div>
        
//         <div className="flex flex-wrap gap-3">
//           <Link href="/about" className="hover:underline hover:text-gray-700 dark:hover:text-gray-300">About</Link>
//           <Link href="/careers" className="hover:underline hover:text-gray-700 dark:hover:text-gray-300">Careers</Link>
//           <Link href="/press" className="hover:underline hover:text-gray-700 dark:hover:text-gray-300">Press</Link>
//           <Link href="/advertise" className="hover:underline hover:text-gray-700 dark:hover:text-gray-300">Advertise</Link>
//           <Link href="/blog" className="hover:underline hover:text-gray-700 dark:hover:text-gray-300">Blog</Link>
//         </div>
        
//         <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
//           <p className="text-xs text-gray-500 dark:text-gray-400">
//             Reddit Clone © {new Date().getFullYear()}. All rights reserved.
//           </p>
//           <div className="flex items-center gap-2 mt-2">
//             <div className="flex items-center gap-1">
//               <Shield className="h-3 w-3" />
//               <span>Privacy</span>
//             </div>
//             <span>•</span>
//             <div className="flex items-center gap-1">
//               <HelpCircle className="h-3 w-3" />
//               <span>Help</span>
//             </div>
//             <span>•</span>
//             <div className="flex items-center gap-1">
//               <FileText className="h-3 w-3" />
//               <span>Terms</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }