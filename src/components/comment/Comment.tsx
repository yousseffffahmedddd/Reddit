'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronUp, ChevronDown, MessageSquare, MoreHorizontal, Trash2 } from 'lucide-react';
import { cn, formatTimeAgo } from '@/lib/utils';
import { Avatar, Button } from '@/components/ui';
import { VoteButton } from '@/components/post/VoteButton';
import { CommentForm } from './CommentForm';
import { useAuthStore, useDeleteComment } from '@/hooks';
import type { Comment as CommentType } from '@/types';
import { ConfirmDialog } from '@/components/ui/Modal';

interface CommentProps {
  comment: CommentType;
  postId: string;
  depth?: number;
  maxDepth?: number;
}

export function Comment({ comment, postId, depth = 0, maxDepth = 6 }: CommentProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { user } = useAuthStore();
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();
  const isAuthor = user?.id === comment.authorId;

  const handleDelete = () => {
    deleteComment(comment.id);
    setShowDeleteDialog(false);
  };

  const hasReplies = comment.replies && comment.replies.length > 0;
  const isDeepThread = depth >= maxDepth;

  return (
    <>
      <div
        className={cn('relative', depth > 0 && 'ml-4 border-l-2 border-border pl-4')}
        data-testid="comment"
      >
        {/* Collapse line */}
        {depth > 0 && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="comment-thread-line"
            aria-label={isCollapsed ? 'Expand comment' : 'Collapse comment'}
          />
        )}

        {/* Comment header */}
        <div className="flex items-center gap-2">
          <Avatar src={comment.author.avatarUrl} alt={comment.author.username} size="xs" />
          <Link
            href={`/u/${comment.author.username}`}
            className="text-xs font-medium hover:underline"
          >
            {comment.author.username}
          </Link>
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(comment.createdAt)}
          </span>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto text-muted-foreground hover:text-foreground"
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Comment content (collapsible) */}
        {!isCollapsed && (
          <>
            <div className="mt-1 text-sm">{comment.content}</div>

            {/* Actions */}
            <div className="mt-1 flex items-center gap-2">
              <VoteButton
                targetId={comment.id}
                targetType="comment"
                upvotes={comment.upvotes}
                downvotes={comment.downvotes}
                userVote={comment.userVote}
                orientation="horizontal"
                size="sm"
              />

              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
              >
                <MessageSquare className="h-3 w-3" />
                Reply
              </button>

              {isAuthor && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="rounded p-1 text-muted-foreground hover:bg-muted"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {showMenu && (
                    <div className="absolute left-0 top-full z-10 mt-1 w-32 rounded-md border bg-card shadow-md">
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

            {/* Reply form */}
            {showReplyForm && (
              <div className="mt-2">
                <CommentForm
                  postId={postId}
                  parentId={comment.id}
                  onSuccess={() => setShowReplyForm(false)}
                  onCancel={() => setShowReplyForm(false)}
                  autoFocus
                />
              </div>
            )}

            {/* Nested replies */}
            {hasReplies && !isDeepThread && (
              <div className="mt-2 space-y-2">
                {comment.replies.map((reply) => (
                  <Comment
                    key={reply.id}
                    comment={reply}
                    postId={postId}
                    depth={depth + 1}
                    maxDepth={maxDepth}
                  />
                ))}
              </div>
            )}

            {/* Continue thread link for deep threads */}
            {hasReplies && isDeepThread && (
              <Link
                href={`/r/${postId}/post/${postId}?comment=${comment.id}`}
                className="mt-2 block text-xs text-primary hover:underline"
              >
                Continue this thread →
              </Link>
            )}
          </>
        )}

        {/* Collapsed indicator */}
        {isCollapsed && hasReplies && (
          <span className="text-xs text-muted-foreground">
            [{comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'} hidden]
          </span>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Comment"
        message="Are you sure you want to delete this comment?"
        confirmText="Delete"
        variant="destructive"
        isLoading={isDeleting}
      />
    </>
  );
}
