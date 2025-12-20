'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MessageSquare,
  Share2,
  MoreHorizontal,
  ExternalLink,
  Trash2,
  Edit2,
  Sparkles,
  X,
} from 'lucide-react';
import { cn, formatTimeAgo, getDomainFromUrl, truncateText } from '@/lib/utils';
import { VoteButton } from './VoteButton';
import {
  useDeletePost,
  useUpdatePost,
  useAuthStore,
  useSummarizePost,
  useJoinCommunity,
  useJoinedCommunities,
} from '@/hooks';
import type { Post } from '@/types';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ConfirmDialog } from '@/components/ui/Modal';
import { Loader } from '@/components/ui';
import { Button } from '@/components/ui';

/* =====================================================
   Helper to convert relative image paths returned
   by backend into absolute URLs for browser rendering
===================================================== */
const getFullImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${url}`;
};

interface PostCardProps {
  post: Post;
  isCompact?: boolean;
}

export function PostCard({ post, isCompact = false }: PostCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();
  const { mutate: summarizePost, isPending: isSummarizing } = useSummarizePost();
  const { mutate: joinCommunity, isPending: isJoining } = useJoinCommunity();
  const { data: joinedCommunitiesData } = useJoinedCommunities();
  const { user, isAuthenticated } = useAuthStore();

  const isAuthor = user?.id === post.authorId;
  const postUrl = `/r/${post.community.name}/post/${post.id}`;
  const isJoined = joinedCommunitiesData?.data.some(c => c.id === post.community.id);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const fullUrl = window.location.origin + postUrl;

    if (navigator.share) {
      navigator.share({ title: post.title, url: fullUrl });
    } else {
      navigator.clipboard.writeText(fullUrl).then(() => {
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 2000);
      });
    }
  };

  const handleDelete = () => {
    deletePost(post.id, {
      onSuccess: () => setShowDeleteDialog(false),
    });
  };

  const handleSummarize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) return;

    if (summary) {
      setShowSummary(!showSummary);
      return;
    }

    summarizePost(post.id, {
      onSuccess: (res) => {
        setSummary(res.summary);
        setShowSummary(true);
      },
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;
    router.push(postUrl);
  };

  return (
    <>
      <article
        className={cn(
          'post-card group flex cursor-pointer rounded-xl border border-border bg-card transition-colors hover:border-muted-foreground/30 hover:bg-secondary/5',
          isCompact ? 'p-2' : ''
        )}
        data-testid="post-card"
        onClick={handleCardClick}
      >
        {/* Vote column - Reddit style */}
        <div
          className={cn('flex shrink-0 flex-col items-center py-2', isCompact ? 'w-9' : 'w-10')}
          onClick={(e) => e.stopPropagation()}
        >
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
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 px-3 py-2">
          {/* Meta - smaller and muted like Reddit */}
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <Link
              href={`/r/${post.communityId}`}
              className="font-bold text-foreground hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              r/{post.community.name}
            </Link>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Posted by</span>
            <Link
              href={`/u/${post.author.username}`}
              className="text-muted-foreground hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              u/{post.author.username}
            </Link>
            <span className="text-muted-foreground">{formatTimeAgo(post.createdAt)}</span>
            {isAuthenticated && !isJoined && (
              <div className="ml-auto flex items-center" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                <span className="text-muted-foreground mx-1">•</span>
                <Button
                  size="xs"
                  variant="ghost"
                  className="bg-downvote text-primary-foreground hover:bg-downvote hover:brightness-90"
                  onClick={() => joinCommunity(post.community.id)}
                  disabled={isJoining}
                >
                  {isJoining ? 'Joining...' : 'Join'}
                </Button>
              </div>
            )}
          </div>

          {/* Title - Reddit weight and size */}
          <Link
            href={postUrl}
            className="group/title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className={cn(
                'font-semibold leading-snug text-foreground group-hover/title:text-foreground',
                isCompact ? 'text-sm' : 'text-base'
              )}
            >
              {post.title}
              {post.type === 'link' && post.linkUrl && (
                <span className="ml-1.5 inline-flex items-center gap-0.5 text-xs font-normal text-primary">
                  ({getDomainFromUrl(post.linkUrl)})
                  <ExternalLink className="h-3 w-3" />
                </span>
              )}
            </h2>
          </Link>

          {/* Text preview (hidden for image posts) */}
          {!isCompact && post.content && post.type !== 'image' && (
            <p className="mt-1 text-sm text-foreground/80 line-clamp-3">
              {truncateText(post.content, 300)}
            </p>
          )}

          {/* Image preview - uses normalized FULL URL */}
          {!isCompact && post.type === 'image' && post.imageUrl && (
            <Link
              href={getFullImageUrl(post.imageUrl)}
              className="mt-2 block"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getFullImageUrl(post.imageUrl)}
                alt={post.title}
                className="max-h-[512px] w-auto rounded object-contain"
              />
            </Link>
          )}

          {/* Link preview */}
          {!isCompact && post.type === 'link' && post.linkUrl && (
            <a
              href={post.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-2 rounded border border-border bg-secondary/30 p-2 text-sm hover:bg-hover"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate text-primary">{post.linkUrl}</span>
            </a>
          )}

          {/* Actions - Reddit style with rounded hover */}
          <div className="mt-1.5 flex items-center gap-1">
            <Link
              href={postUrl}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold text-muted-foreground hover:bg-hover"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{post.commentCount} Comments</span>
            </Link>

            <button
              onClick={handleShare}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold hover:bg-hover',
                showCopiedMessage ? 'text-green-600' : 'text-muted-foreground'
              )}
            >
              <Share2 className="h-4 w-4" />
              <span>{showCopiedMessage ? 'Copied!' : 'Share'}</span>
            </button>


            {/* AI Summarize button */}
            {isAuthenticated && post.content && !isCompact && (
              <button
                onClick={handleSummarize}
                disabled={isSummarizing}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold hover:bg-hover',
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-hover"
                  disabled={isUpdating}
                >
                  {isUpdating ? <Loader size="sm" /> : <MoreHorizontal className="h-4 w-4" />}
                </button>
                {showMenu && (
                  <div
                    className="absolute right-0 top-full z-10 mt-1 w-36 rounded border border-border bg-card py-1 shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      href={`${postUrl}/edit`}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-hover"
                      onClick={() => setShowMenu(false)}
                    >
                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowDeleteDialog(true);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-hover"
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
            <div className="mt-2 rounded border border-primary/20 bg-primary/5 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <Sparkles className="h-4 w-4" />
                  AI Summary
                </div>
                <button
                  onClick={() => setShowSummary(false)}
                  className="rounded p-1 hover:bg-hover"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{summary}</p>
            </div>
          )}
        </div>

        {/* Compact thumbnail - uses normalized image URL */}
        {isCompact && post.imageUrl && (
          <div className="ml-auto shrink-0 p-2">
            <img
              src={getFullImageUrl(post.imageUrl)}
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
