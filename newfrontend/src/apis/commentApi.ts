// filepath: /home/awail/WebstormProjects/islam_front/src/apis/commentApi.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const COMMENT_API_URL = `${API_BASE_URL}/api/comments`;

/* =========================
   Types
========================= */

export interface BackendComment {
    _id: string;
    postId: string;
    userId: {
        _id: string;
        username: string;
        profilePicture?: string;
    };
    content: string;
    parentCommentId: string | null;
    createdAt: string;
    replies?: BackendComment[];
    // Vote data
    score?: number;
    upvotes?: number;
    downvotes?: number;
    userVote?: number;
}

export interface CreateCommentData {
    postId: string;
    userId: string;
    content: string;
    parentCommentId?: string | null;
}

export interface UpdateCommentData {
    userId: string;
    content: string;
}

/* =========================
   Comment API Functions
========================= */

/**
 * Create a new comment
 */
export const createComment = async (data: CreateCommentData): Promise<BackendComment> => {
    const response = await fetch(COMMENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create comment');
    }

    return response.json();
};

/**
 * Get all comments for a post (with nested replies)
 */
export const getCommentsByPostId = async (postId: string, userId?: string): Promise<BackendComment[]> => {
    const url = userId
        ? `${COMMENT_API_URL}/post/${postId}?userId=${userId}`
        : `${COMMENT_API_URL}/post/${postId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch comments');
    }

    return response.json();
};

/**
 * Get comment count for a post
 */
export const getCommentCount = async (postId: string): Promise<{ count: number }> => {
    const response = await fetch(`${COMMENT_API_URL}/post/${postId}/count`);

    if (!response.ok) {
        throw new Error('Failed to fetch comment count');
    }

    return response.json();
};

/**
 * Get a single comment by ID
 */
export const getCommentById = async (commentId: string): Promise<BackendComment> => {
    const response = await fetch(`${COMMENT_API_URL}/${commentId}`);

    if (!response.ok) {
        throw new Error('Failed to fetch comment');
    }

    return response.json();
};

/**
 * Update a comment
 */
export const updateComment = async (
    commentId: string,
    data: UpdateCommentData
): Promise<BackendComment> => {
    const response = await fetch(`${COMMENT_API_URL}/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update comment');
    }

    return response.json();
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId: string, userId: string): Promise<void> => {
    const response = await fetch(`${COMMENT_API_URL}/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete comment');
    }
};

/**
 * Get all comments by a user
 */
export const getUserComments = async (userId: string): Promise<BackendComment[]> => {
    const response = await fetch(`${COMMENT_API_URL}/user/${userId}`);

    if (!response.ok) {
        throw new Error('Failed to fetch user comments');
    }

    return response.json();
};

/**
 * Vote on a comment
 */
export const voteOnComment = async (
    commentId: string,
    userId: string,
    value: number
): Promise<{ success: boolean; score: number; upvotes: number; downvotes: number }> => {
    const response = await fetch(`${COMMENT_API_URL}/${commentId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, value }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to vote on comment');
    }

    return response.json();
};

