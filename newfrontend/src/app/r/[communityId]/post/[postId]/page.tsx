'use client';

import { useParams, useRouter } from 'next/navigation';
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
    const router = useRouter();
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
            <button
                onClick={() => router.back()}
                className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </button>

            <article className="rounded border border-border bg-card">
                <div className="flex">
                    {/* Vote */}
                    <div className="flex w-10 shrink-0 flex-col items-center py-3">
                        <VoteButton
                            targetId={post.id}
                            targetType="post"
                            upvotes={post.upvotes}
                            downvotes={post.downvotes}
                            userVote={post.userVote}
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 px-3 py-3">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            <Link
                                href={`/r/${post.communityId}`}
                                className="flex items-center gap-1.5 font-bold text-foreground hover:underline"
                            >
                                <Avatar
                                    src={post.community.iconUrl}
                                    alt={post.community.name}
                                    size="xs"
                                />
                                r/{post.community.name}
                            </Link>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">Posted by</span>
                            <Link href={`/u/${post.author.username}`} className="text-muted-foreground hover:underline">
                                u/{post.author.username}
                            </Link>
                            <span className="text-muted-foreground">{formatTimeAgo(post.createdAt)}</span>
                        </div>

                        {/* Title */}
                        <h1 className="mt-1.5 text-lg font-semibold leading-snug text-foreground">
                            {post.title}
                            {post.type === 'link' && post.linkUrl && (
                                <span className="ml-1.5 inline-flex items-center gap-0.5 text-xs font-normal text-primary">
                  ({getDomainFromUrl(post.linkUrl)})
                  <ExternalLink className="h-3 w-3" />
                </span>
                            )}
                        </h1>

                        {/* Text */}
                        {post.content && post.type !== 'image' && (
                            <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                                {post.content}
                            </div>
                        )}

                        {/* Image */}
                        {post.type === 'image' && post.imageUrl && (
                            <div className="mt-3">
                                <img
                                    key={post.imageUrl}
                                    src={getFullImageUrl(post.imageUrl)}
                                    alt={post.title}
                                    className="max-h-[600px] w-auto rounded object-contain"
                                />
                            </div>
                        )}

                        {/* Link */}
                        {post.type === 'link' && post.linkUrl && (
                            <a
                                href={post.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 flex items-center gap-2 rounded border border-border bg-secondary/30 p-2.5 hover:bg-hover"
                            >
                                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="truncate text-sm text-primary">{post.linkUrl}</span>
                            </a>
                        )}

                        {/* Actions */}
                        <div className="mt-3 flex items-center gap-1 border-t border-border pt-3">
                            <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold text-muted-foreground hover:bg-hover">
                                <MessageSquare className="h-4 w-4" />
                                {post.commentCount} Comments
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            {/* Comments */}
            <div className="mt-4 rounded border border-border bg-card p-3">
                <CommentTree postId={postId} />
            </div>
        </div>
    );
}