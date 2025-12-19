'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    MessageSquare,
    ExternalLink,
    ArrowLeft,
} from 'lucide-react';
import { formatTimeAgo, getDomainFromUrl } from '@/lib/utils';
import { Avatar, Loader, ErrorMessage } from '@/components/ui';
import { VoteButton } from '@/components/post/VoteButton';
import { CommentTree } from '@/components/comment';
import { usePost, useAuthStore } from '@/hooks';

/* =====================================================
   Normalize backend image URLs so browser can load them
===================================================== */
const getFullImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${url}`;
};

export default function PostPage() {
    const params = useParams();
    const communityId = params.communityId as string;
    const postId = params.postId as string;

    const { data: post, isLoading, isError, error, refetch } = usePost(postId);
    const { isAuthenticated } = useAuthStore();

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Loader text="Loading post..." />
            </div>
        );
    }

    if (isError || !post) {
        return (
            <ErrorMessage
                title="Post not found"
                message={error?.message || 'This post does not exist or has been removed.'}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="mx-auto max-w-3xl">
            {/* Back */}
            <Link
                href={`/r/${communityId}`}
                className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to r/{communityId}
            </Link>

            <article className="rounded-md border bg-card">
                <div className="flex">
                    {/* Vote */}
                    <div className="flex w-12 shrink-0 flex-col items-center bg-muted/30 py-4">
                        <VoteButton
                            targetId={post.id}
                            targetType="post"
                            upvotes={post.upvotes}
                            downvotes={post.downvotes}
                            userVote={post.userVote}
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <Link
                                href={`/r/${post.communityId}`}
                                className="flex items-center gap-2 font-medium text-foreground"
                            >
                                <Avatar
                                    src={post.community.iconUrl}
                                    alt={post.community.name}
                                    size="xs"
                                />
                                r/{post.community.name}
                            </Link>
                            <span>•</span>
                            <Link href={`/u/${post.author.username}`}>
                                u/{post.author.username}
                            </Link>
                            <span>{formatTimeAgo(post.createdAt)}</span>
                        </div>

                        {/* Title */}
                        <h1 className="mt-2 text-xl font-semibold">
                            {post.title}
                            {post.type === 'link' && post.linkUrl && (
                                <span className="ml-2 text-sm text-muted-foreground">
                  ({getDomainFromUrl(post.linkUrl)})
                </span>
                            )}
                        </h1>

                        {/* Text */}
                        {post.content && post.type !== 'image' && (
                            <div className="mt-4 whitespace-pre-wrap text-sm">
                                {post.content}
                            </div>
                        )}

                        {/* =====================================================
               🔴 CHANGE #2
               Image rendering FIXED:
               - src restored
               - full URL
               - key forces rerender
            ===================================================== */}
                        {post.type === 'image' && post.imageUrl && (
                            <div className="mt-4">
                                <img
                                    key={post.imageUrl} // 🔴 CHANGE #3 (force rerender)
                                    src={getFullImageUrl(post.imageUrl)} // 🔴 CHANGE #2
                                    alt={post.title}
                                    className="max-h-[600px] w-auto rounded-md object-contain"
                                />
                            </div>
                        )}

                        {/* Link */}
                        {post.type === 'link' && post.linkUrl && (
                            <a
                                href={post.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 flex items-center gap-2 rounded-md border bg-muted/50 p-4"
                            >
                                <ExternalLink className="h-5 w-5" />
                                <span className="truncate">{post.linkUrl}</span>
                            </a>
                        )}

                        {/* Actions */}
                        <div className="mt-4 flex items-center gap-2 border-t pt-4">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MessageSquare className="h-4 w-4" />
                                {post.commentCount} Comments
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            {/* Comments */}
            <div className="mt-4 rounded-md border bg-card p-4">
                <CommentTree postId={postId} />
            </div>
        </div>
    );
}