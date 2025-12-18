'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserId } from '@/apis/authApi';
import {
    getCommentsByPostId,
    createComment as createCommentApi,
    deleteComment as deleteCommentApi,
    updateComment as updateCommentApi,
    getCommentCount,
    getUserComments,
    type BackendComment,
} from '@/apis/commentApi';
import { getProfilePictureUrl } from '@/apis/userApi';
import type { Comment, CreateCommentInput, CommentSortType } from '@/types';

// Transform backend comment to frontend format
function transformComment(backendComment: BackendComment): Comment {
    return {
        id: backendComment._id,
        content: backendComment.content,
        authorId: backendComment.userId._id,
        author: {
            id: backendComment.userId._id,
            username: backendComment.userId.username,
            displayName: backendComment.userId.username,
            avatarUrl: backendComment.userId.profilePicture
                ? getProfilePictureUrl(backendComment.userId.profilePicture)
                : null,
            karma: 0,
            cakeDay: new Date().toISOString(),
            bio: null,
            createdAt: new Date().toISOString(),
        },
        postId: backendComment.postId,
        parentId: backendComment.parentCommentId,
        upvotes: 0,
        downvotes: 0,
        userVote: 0,
        replies: backendComment.replies?.map(transformComment) || [],
        replyCount: backendComment.replies?.length || 0,
        isCollapsed: false,
        createdAt: backendComment.createdAt,
        updatedAt: backendComment.createdAt,
    };
}

interface FetchCommentsParams {
    postId: string;
    sort?: CommentSortType;
}

async function fetchComments(params: FetchCommentsParams): Promise<{ data: Comment[]; total: number }> {
    const backendComments = await getCommentsByPostId(params.postId);

    const comments = backendComments.map(transformComment);

    // Sort comments on client side
    if (params.sort === 'new') {
        comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (params.sort === 'old') {
        comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (params.sort === 'top') {
        comments.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    }
    // 'best' is default from backend

    return {
        data: comments,
        total: comments.length
    };
}

async function createComment(input: CreateCommentInput): Promise<Comment> {
    const userId = getUserId();
    if (!userId) throw new Error('Must be logged in to comment');

    const backendComment = await createCommentApi({
        postId: input.postId,
        userId: userId,
        content: input.content,
        parentCommentId: input.parentId || null,
    });

    return transformComment(backendComment);
}

async function deleteComment(commentId: string): Promise<void> {
    const userId = getUserId();
    if (!userId) throw new Error('Must be logged in to delete comment');

    await deleteCommentApi(commentId, userId);
}

export function useComments(postId: string, sort?: CommentSortType) {
    return useQuery({
        queryKey: ['comments', postId, sort],
        queryFn: () => fetchComments({ postId, sort }),
        enabled: !!postId,
    });
}

export function useCommentCount(postId: string) {
    return useQuery({
        queryKey: ['commentCount', postId],
        queryFn: () => getCommentCount(postId),
        enabled: !!postId,
    });
}

export function useUserComments(userId: string) {
    return useQuery({
        queryKey: ['userComments', userId],
        queryFn: async () => {
            const backendComments = await getUserComments(userId);
            return backendComments.map(transformComment);
        },
        enabled: !!userId,
    });
}

export function useCreateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createComment,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['comments', data.postId] });
            queryClient.invalidateQueries({ queryKey: ['commentCount', data.postId] });
            queryClient.invalidateQueries({ queryKey: ['post', data.postId] });
        },
    });
}

export function useDeleteComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] });
            queryClient.invalidateQueries({ queryKey: ['commentCount'] });
        },
    });
}

export function useUpdateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
            const userId = getUserId();
            if (!userId) throw new Error('Must be logged in to update comment');

            const backendComment = await updateCommentApi(commentId, { userId, content });
            return transformComment(backendComment);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['comments', data.postId] });
        },
    });
}
