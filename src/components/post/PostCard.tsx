'use client';

import Link from 'next/link';
import { MessageSquare, Share2, Bookmark, MoreHorizontal, ExternalLink, Trash2, Edit2 } from 'lucide-react';
import { cn, formatTimeAgo, getDomainFromUrl, truncateText } from '@/lib/utils';
import { Avatar, Button } from '@/components/ui';
import { VoteButton } from './VoteButton';
import { useSavePost, useDeletePost, useAuthStore } from '@/hooks';
import type { Post } from '@/types';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ui/Modal';

interface PostCardProps {
  post: Post;
  isCompact?: boolean;
}

export function PostCard({ post, isCompact = false }: PostCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { mutate: savePost } = useSavePost();
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  const { user } = useAuthStore();
  const isAuthor = user?.id === post.authorId;

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    savePost(post.id);
  };

  const handleDelete = () => {
    deletePost(post.id);
    setShowDeleteDialog(false);
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

          {/* Content preview */}
          {!isCompact && post.content && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {truncateText(post.content, 300)}
            </p>
          )}

          {/* Image */}
          {!isCompact && post.type === 'image' && post.imageUrl && (
            <Link href={postUrl} className="mt-2 block">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="max-h-[512px] w-auto rounded-md object-contain"
              />
            </Link>
          )}

          {/* Link preview */}
          {!isCompact && post.type === 'link' && post.linkUrl && (
            <a
              href={post.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-2 rounded-md border bg-muted/50 p-3 text-sm hover:bg-muted"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
              <span className="truncate">{post.linkUrl}</span>
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

            <button className="flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>

            <button
              onClick={handleSave}
              className={cn(
                'flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-medium hover:bg-muted',
                post.isSaved ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Bookmark className={cn('h-4 w-4', post.isSaved && 'fill-current')} />
              <span>{post.isSaved ? 'Saved' : 'Save'}</span>
            </button>

            {isAuthor && (
              <div className="relative ml-auto">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="rounded-sm p-1 text-muted-foreground hover:bg-muted"
                >
                  <MoreHorizontal className="h-4 w-4" />
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
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
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
