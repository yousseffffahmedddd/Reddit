// filepath: /home/awail/WebstormProjects/Reddit_clone/frontend/apis/commentApi.ts
import axios from 'axios';

const API_BASE = "http://localhost:3000/api/comments";

// Comment interface
export interface Comment {
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
    replies?: Comment[];
}

// Data for creating a new comment
export interface CreateCommentData {
    postId: string;
    userId: string;
    content: string;
    parentCommentId?: string | null;
}

// Data for updating a comment
export interface UpdateCommentData {
    userId: string;
    content: string;
}

// Create a new comment
export const createComment = async (commentData: CreateCommentData): Promise<Comment> => {
    const { data } = await axios.post<Comment>(API_BASE, commentData);
    return data;
};

// Get all comments for a post (returns nested structure with replies)
export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
    const { data } = await axios.get<Comment[]>(`${API_BASE}/post/${postId}`);
    return data;
};

// Get comment count for a post
export const getCommentCount = async (postId: string): Promise<number> => {
    const { data } = await axios.get<{ count: number }>(`${API_BASE}/post/${postId}/count`);
    return data.count;
};

// Get a single comment by ID
export const getCommentById = async (commentId: string): Promise<Comment> => {
    const { data } = await axios.get<Comment>(`${API_BASE}/${commentId}`);
    return data;
};

// Update a comment
export const updateComment = async (commentId: string, updateData: UpdateCommentData): Promise<Comment> => {
    const { data } = await axios.put<Comment>(`${API_BASE}/${commentId}`, updateData);
    return data;
};

// Delete a comment
export const deleteComment = async (commentId: string, userId: string): Promise<{ message: string }> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await axios({
        method: 'delete',
        url: `${API_BASE}/${commentId}`,
        data: { userId }
    });
    return response.data;
};

// Get all comments by a user
export const getUserComments = async (userId: string): Promise<Comment[]> => {
    const { data } = await axios.get<Comment[]>(`${API_BASE}/user/${userId}`);
    return data;
};

// Reply to a comment (convenience function)
export const replyToComment = async (
    postId: string,
    userId: string,
    content: string,
    parentCommentId: string
): Promise<Comment> => {
    return createComment({
        postId,
        userId,
        content,
        parentCommentId
    });
};

