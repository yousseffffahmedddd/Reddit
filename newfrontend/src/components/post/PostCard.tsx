'use client';

import Link from 'next/link';
import { MessageSquare, Share2, Bookmark, MoreHorizontal, ExternalLink, Trash2, Edit2, Sparkles, X } from 'lucide-react';
import { cn, formatTimeAgo, getDomainFromUrl, truncateText } from '@/lib/utils';
import { VoteButton } from './VoteButton';
import { useDeletePost, useUpdatePost, useAuthStore, useSummarizePost } from '@/hooks';
// Note: useSavePost removed - not implemented in backend
import type { Post } from '@/types';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ui/Modal';
import { Loader } from '@/components/ui';

interface PostCardProps {
  post: Post;
  isCompact?: boolean;
}

export function PostCard({ post, isCompact = false }: PostCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  // Note: savePost removed - not implemented in backend
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();
  const { mutate: summarizePost, isPending: isSummarizing } = useSummarizePost();
  const { user, isAuthenticated } = useAuthStore();
  const isAuthor = user?.id === post.authorId;

  // TODO: Save functionality not implemented in backend
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = window.location.origin + postUrl;

    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: url,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        // Could show a toast notification here
        console.log('Link copied to clipboard');
      });
    }
  };

  const handleDelete = () => {
    deletePost(post.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
      },
      onError: (error) => {
        console.error('Delete failed:', error);
      },
    });
  };

  const handleSummarize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      console.warn('Must be logged in to use AI summarization');
      return;
    }

    if (summary) {
      setShowSummary(!showSummary);
      return;
    }

    summarizePost(post.id, {
      onSuccess: (response) => {
        setSummary(response.summary);
        setShowSummary(true);
      },
      onError: (error) => {
        console.error('Summarization failed:', error);
      },
    });
  };

  const postUrl = `/r/${post.communityId}/post/${post.id}`;

  return (
    <>
      <article
        className={cn(
          'post-card group flex gap-0 rounded-md border bg-card',
          isCompact ? 'p-2' : 'p-0'
        )}
        data-testid="post-card"
      >
        {/* Vote column */}
        <div className="flex w-10 shrink-0 flex-col items-center bg-muted/30 py-2 md:w-12">
          <VoteButton
            targetId={post.id}
            targetType="post"
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            userVote={post.userVote}
            size={isCompact ? 'sm' : 'md'}
          />
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-1 p-2">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            <Link
              href={`/r/${post.communityId}`}
              className="font-medium text-foreground hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              r/{post.community.name}
            </Link>
            <span>•</span>
            <span>Posted by</span>
            <Link
              href={`/u/${post.author.username}`}
              className="hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              u/{post.author.username}
            </Link>
            <span>{formatTimeAgo(post.createdAt)}</span>
          </div>

          {/* Title */}
          <Link href={postUrl} className="group/title">
            <h2
              className={cn(
                'font-medium leading-snug group-hover/title:text-primary',
                isCompact ? 'text-sm' : 'text-lg'
              )}
            >
              {post.title}
              {post.type === 'link' && post.linkUrl && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs font-normal text-muted-foreground">
                  ({getDomainFromUrl(post.linkUrl)})
                  <ExternalLink className="h-3 w-3" />
                </span>
              )}
            </h2>
          </Link>

          {/* Content preview
          {!isCompact && post.content && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {truncateText(post.content, 300)}
            </p>
          )} */}
{/*stop preview image content*/ }
      {!isCompact && post.content && (
        <p className="text-sm text-muted-foreground line-clamp-3">
          {post.type === 'image' ? (
            <span className="italic text-gray-500">
            </span>
          ) : (
            // Show regular content for text/link posts
            truncateText(post.content, 300)
          )}
        </p>
      )}

          {/* Image */}
          {!isCompact && post.type === 'image' && post.imageUrl && (
            <Link href={post.imageUrl} className="mt-2 block">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="max-h-[512px] w-auto rounded-md object-contain"
              />
            </Link>
          )}

      {/* Link preview (icon only, no URL text) */}
  {!isCompact && post.type === 'link' && post.linkUrl && (
    <a
      href={post.linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 flex items-center gap-2 rounded-md border bg-muted/50 p-3 text-sm hover:bg-muted"
      onClick={(e) => e.stopPropagation()}
    >
      <ExternalLink className="h-4 w-4 shrink-0" />
      <span className="text-muted-foreground">Open link</span>
    </a>
  )}


          {/* Actions */}
          <div className="mt-1 flex items-center gap-1">
            <Link
              href={postUrl}
              className="flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{post.commentCount} Comments</span>
            </Link>

            <button 
              onClick={handleShare}
              className="flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>

            <button
              className={cn(
                'flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-medium hover:bg-muted',
                post.isSaved ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Bookmark className={cn('h-4 w-4', post.isSaved && 'fill-current')} />
              <span>{post.isSaved ? 'Saved' : 'Save'}</span>
            </button>

            {/* AI Summarize button */}
            {isAuthenticated && post.content && !isCompact && (
              <button
                onClick={handleSummarize}
                disabled={isSummarizing}
                className={cn(
                  'flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-medium hover:bg-muted',
                  showSummary ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {isSummarizing ? (
                  <Loader size="sm" />
                ) : (
                  <Sparkles className={cn('h-4 w-4', showSummary && 'fill-current')} />
                )}
                <span>{isSummarizing ? 'Summarizing...' : 'AI Summary'}</span>
              </button>
            )}

            {isAuthor && (
              <div className="relative ml-auto">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="rounded-sm p-1 text-muted-foreground hover:bg-muted"
                  disabled={isUpdating}
                >
                  {isUpdating ? <Loader size="sm" /> : <MoreHorizontal className="h-4 w-4" />}
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full z-10 mt-1 w-32 rounded-md border bg-card shadow-md">
                    <Link
                      href={`${postUrl}/edit`}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                      onClick={() => setShowMenu(false)}
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowDeleteDialog(true);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted"
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Summary display */}
          {showSummary && summary && (
            <div className="mt-2 rounded-md border border-primary/20 bg-primary/5 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-primary">
                  <Sparkles className="h-4 w-4" />
                  AI Summary
                </div>
                <button
                  onClick={() => setShowSummary(false)}
                  className="rounded p-1 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{summary}</p>
            </div>
          )}
        </div>

        {/* Thumbnail for compact mode */}
        {isCompact && post.imageUrl && (
          <div className="ml-auto shrink-0 p-2">
            <img
              src={post.imageUrl}
              alt=""
              className="h-16 w-24 rounded object-cover"
            />
          </div>
        )}
      </article>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        isLoading={isDeleting}
      />
    </>
  );
}



// 'use client';

// import Link from 'next/link';
// import { MessageSquare, Share2, Bookmark, MoreHorizontal, ExternalLink, Trash2, Edit2, Sparkles, X } from 'lucide-react';
// import { cn, formatTimeAgo, getDomainFromUrl, truncateText } from '@/lib/utils';
// import { VoteButton } from './VoteButton';
// import { useDeletePost, useAuthStore, useSummarizePost } from '@/hooks';
// // Note: useSavePost removed - not implemented in backend
// import type { Post } from '@/types';
// import { useState } from 'react';
// import { ConfirmDialog } from '@/components/ui/Modal';
// import { Loader } from '@/components/ui';

// interface PostCardProps {
//   post: Post;
//   isCompact?: boolean;
// }

// export function PostCard({ post, isCompact = false }: PostCardProps) {
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [showSummary, setShowSummary] = useState(false);
//   const [summary, setSummary] = useState<string | null>(null);
//   // Note: savePost removed - not implemented in backend
//   const { mutate: _deletePost, isPending: isDeleting } = useDeletePost();
//   const { mutate: summarizePost, isPending: isSummarizing } = useSummarizePost();
//   const { user, isAuthenticated } = useAuthStore();
//   const isAuthor = user?.id === post.authorId;

//   // TODO: Save functionality not implemented in backend
//   const handleShare = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const url = window.location.origin + postUrl;

//     if (navigator.share) {
//       navigator.share({
//         title: post.title,
//         url: url,
//       });
//     } else {
//       // Fallback: copy to clipboard
//       navigator.clipboard.writeText(url).then(() => {
//         // Could show a toast notification here
//         console.log('Link copied to clipboard');
//       });
//     }
//   };

//   const handleDelete = () => {
//     // TODO: Delete functionality not implemented in backend
//     // deletePost(post.id);
//     console.warn('Delete post functionality not implemented in backend');
//     setShowDeleteDialog(false);
//   };

//   const handleSummarize = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!isAuthenticated) {
//       console.warn('Must be logged in to use AI summarization');
//       return;
//     }

//     if (summary) {
//       setShowSummary(!showSummary);
//       return;
//     }

//     summarizePost(post.id, {
//       onSuccess: (response) => {
//         setSummary(response.summary);
//         setShowSummary(true);
//       },
//       onError: (error) => {
//         console.error('Summarization failed:', error);
//       },
//     });
//   };

//   const postUrl = `/r/${post.communityId}/post/${post.id}`;

//   return (
//     <>
//       <article
//         className={cn(
//           'group flex gap-3 bg-white hover:bg-gray-50 transition-colors',
//           isCompact ? 'px-3 py-2' : 'px-3 py-4 border border-gray-300 border-b border-l-0 border-r-0 border-t-0 first:border-t',
//           'hover:border-gray-400'
//         )}
//         data-testid="post-card"
//       >
//         {/* Vote column - Reddit style */}
//         <div className="flex shrink-0 flex-col items-center pt-1 w-10">
//           <VoteButton
//             targetId={post.id}
//             targetType="post"
//             upvotes={post.upvotes}
//             downvotes={post.downvotes}
//             userVote={post.userVote}
//             size={isCompact ? 'sm' : 'md'}
//           />
//         </div>

//         {/* Content */}
//         <div className="flex min-w-0 flex-1 flex-col gap-1">
//           {/* Meta - Reddit style */}
//           <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 mb-1">
//             <Link
//               href={`/r/${post.communityId}`}
//               className="font-semibold text-gray-900 hover:underline"
//               onClick={(e) => e.stopPropagation()}
//             >
//               r/{post.community.name}
//             </Link>
//             <span className="mx-1">•</span>
//             <span className="text-gray-600">Posted by</span>
//             <Link
//               href={`/u/${post.author.username}`}
//               className="hover:underline text-gray-900 font-medium"
//               onClick={(e) => e.stopPropagation()}
//             >
//               u/{post.author.username}
//             </Link>
//             <span className="mx-1">•</span>
//             <span className="text-gray-500">{formatTimeAgo(post.createdAt)}</span>
//           </div>

//           {/* Title - Reddit style */}
//           <Link href={postUrl} className="group/title">
//             <h2
//               className={cn(
//                 'font-medium mb-1',
//                 isCompact ? 'text-[15px]' : 'text-[18px] leading-[22px] text-gray-900'
//               )}
//             >
//               {post.title}
//               {post.type === 'link' && post.linkUrl && (
//                 <span className="ml-2 inline-flex items-center gap-1 text-xs font-normal text-gray-500">
//                   ({getDomainFromUrl(post.linkUrl)})
//                   <ExternalLink className="h-3 w-3" />
//                 </span>
//               )}
//             </h2>
//           </Link>

//           {/* Content preview - Reddit style */}
//           {!isCompact && post.content && (
//             <p className="text-[14px] text-gray-800 mb-2 leading-[21px]">
//               {post.type === 'image' ? (
//                 <span className="italic text-gray-500">
//                 </span>
//               ) : (
//                 truncateText(post.content, 300)
//               )}
//             </p>
//           )}

//           {/* Image - Reddit style */}
//           {!isCompact && post.type === 'image' && post.imageUrl && (
//             <div className="mt-2 mb-3">
//               <div className="max-w-full rounded-md overflow-hidden border border-gray-300">
//                 <img
//                   src={post.imageUrl}
//                   alt={post.title}
//                   className="max-h-[512px] w-auto mx-auto object-contain"
//                 />
//               </div>
//             </div>
//           )}

//           {/* Link preview - Reddit style */}
//           {!isCompact && post.type === 'link' && post.linkUrl && (
//             <a
//               href={post.linkUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="mt-2 mb-3 flex items-center gap-3 rounded-md border border-gray-300 bg-gray-50 p-3 text-sm hover:bg-gray-100 transition-colors max-w-xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <ExternalLink className="h-5 w-5 shrink-0 text-gray-500" />
//               <div className="flex-1 min-w-0">
//                 <span className="font-medium text-gray-900 truncate block">Open external link</span>
//                 <span className="text-xs text-gray-500 truncate block">{getDomainFromUrl(post.linkUrl)}</span>
//               </div>
//             </a>
//           )}

//           {/* Actions - Reddit style */}
//           <div className="flex items-center gap-1 mt-1">
//             <Link
//               href={postUrl}
//               className="flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
//             >
//               <MessageSquare className="h-4.5 w-4.5" />
//               <span>{post.commentCount} Comments</span>
//             </Link>

//             <button 
//               onClick={handleShare}
//               className="flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
//             >
//               <Share2 className="h-4.5 w-4.5" />
//               <span>Share</span>
//             </button>

//             <button
//               className={cn(
//                 'flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-medium hover:bg-gray-100 transition-colors',
//                 post.isSaved ? 'text-blue-600' : 'text-gray-500'
//               )}
//             >
//               <Bookmark className={cn('h-4.5 w-4.5', post.isSaved && 'fill-current')} />
//               <span>{post.isSaved ? 'Saved' : 'Save'}</span>
//             </button>

//             {/* AI Summarize button */}
//             {isAuthenticated && post.content && !isCompact && (
//               <button
//                 onClick={handleSummarize}
//                 disabled={isSummarizing}
//                 className={cn(
//                   'flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-medium hover:bg-gray-100 transition-colors',
//                   showSummary ? 'text-purple-600' : 'text-gray-500'
//                 )}
//               >
//                 {isSummarizing ? (
//                   <Loader size="sm" />
//                 ) : (
//                   <Sparkles className={cn('h-4.5 w-4.5', showSummary && 'fill-current')} />
//                 )}
//                 <span>{isSummarizing ? 'Summarizing...' : 'AI Summary'}</span>
//               </button>
//             )}

//             {isAuthor && (
//               <div className="relative ml-auto">
//                 <button
//                   onClick={() => setShowMenu(!showMenu)}
//                   className="rounded-sm p-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
//                 >
//                   <MoreHorizontal className="h-4.5 w-4.5" />
//                 </button>
//                 {showMenu && (
//                   <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-md border border-gray-300 bg-white shadow-lg py-1">
//                     <Link
//                       href={`${postUrl}/edit`}
//                       className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
//                       onClick={() => setShowMenu(false)}
//                     >
//                       <Edit2 className="h-4 w-4" />
//                       Edit
//                     </Link>
//                     <button
//                       onClick={() => {
//                         setShowMenu(false);
//                         setShowDeleteDialog(true);
//                       }}
//                       className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* AI Summary display - Reddit style */}
//           {showSummary && summary && (
//             <div className="mt-3 rounded-md border border-purple-200 bg-purple-50 p-3">
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center gap-2 text-xs font-semibold text-purple-700">
//                   <Sparkles className="h-4 w-4" />
//                   AI Summary
//                 </div>
//                 <button
//                   onClick={() => setShowSummary(false)}
//                   className="rounded p-1 hover:bg-purple-100 transition-colors"
//                 >
//                   <X className="h-3.5 w-3.5 text-purple-600" />
//                 </button>
//               </div>
//               <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
//             </div>
//           )}
//         </div>

//         {/* Thumbnail for compact mode - Reddit style */}
//         {isCompact && post.imageUrl && (
//           <div className="ml-auto shrink-0">
//             <div className="h-[56px] w-[80px] rounded border border-gray-300 overflow-hidden">
//               <img
//                 src={post.imageUrl}
//                 alt=""
//                 className="h-full w-full object-cover"
//               />
//             </div>
//           </div>
//         )}
//       </article>

//       <ConfirmDialog
//         isOpen={showDeleteDialog}
//         onClose={() => setShowDeleteDialog(false)}
//         onConfirm={handleDelete}
//         title="Delete Post"
//         message="Are you sure you want to delete this post? This action cannot be undone."
//         confirmText="Delete"
//         variant="destructive"
//         isLoading={isDeleting}
//       />
//     </>
//   );
// }