// filepath: /home/awail/WebstormProjects/Reddit_clone/frontend/apis/commentApi.ts
import axios from 'axios';

const API_BASE = "http://localhost:3000/api/comments";

// ---- Types ----
export interface CommentUser {
    _id: string;
    username: string;
}

export interface Comment {
    _id: string;
    postId: string;
    userId: CommentUser;
    content: string;
    parentCommentId: string | null;
    createdAt: string;
    replies?: Comment[];
}

export interface CreateCommentData {
    postId: string;
    userId: string;
    content: string;
    parentCommentId?: string;
}

export interface UpdateCommentData {
    content: string;
    userId: string;
}

export interface CommentCountResponse {
    count: number;
}

// ---- API Functions ----

/**
 * Create a new comment
 */
export const createComment = async (data: CreateCommentData): Promise<Comment> => {
    const response = await axios.post<Comment>(API_BASE, data);
    return response.data;
};

/**
 * Get all comments for a post (nested structure with replies)
 */
export const getCommentsByPost = async (postId: string): Promise<Comment[]> => {
    const response = await axios.get<Comment[]>(`${API_BASE}/post/${postId}`);
    return response.data;
};

/**
 * Get all comments for a post (flat list)
 */
export const getCommentsByPostFlat = async (postId: string): Promise<Comment[]> => {
    const response = await axios.get<Comment[]>(`${API_BASE}/post/${postId}/flat`);
    return response.data;
};

/**
 * Get comment count for a post
 */
export const getCommentCount = async (postId: string): Promise<number> => {
    const response = await axios.get<CommentCountResponse>(`${API_BASE}/post/${postId}/count`);
    return response.data.count;
};

/**
 * Get a single comment by ID
 */
export const getCommentById = async (commentId: string): Promise<Comment> => {
    const response = await axios.get<Comment>(`${API_BASE}/${commentId}`);
    return response.data;
};

/**
 * Get replies to a comment
 */
export const getReplies = async (commentId: string): Promise<Comment[]> => {
    const response = await axios.get<Comment[]>(`${API_BASE}/${commentId}/replies`);
    return response.data;
};

/**
 * Update a comment
 */
export const updateComment = async (commentId: string, data: UpdateCommentData): Promise<Comment> => {
    const response = await axios.put<Comment>(`${API_BASE}/${commentId}`, data);
    return response.data;
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId: string, userId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE}/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete comment');
    return data;
};

/**
 * Reply to a comment (convenience function)
 */
export const replyToComment = async (
    postId: string,
    parentCommentId: string,
    userId: string,
    content: string
): Promise<Comment> => {
    return createComment({
        postId,
        userId,
        content,
        parentCommentId
    });
};

