// filepath: /home/awail/WebstormProjects/islam_front/src/apis/postApi.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const POST_API_URL = `${API_BASE_URL}/apis/Postapi`;
const VOTE_API_URL = `${API_BASE_URL}/api/votes`;

// Types - author and community can be either populated objects or just IDs
export interface BackendPost {
    _id: string;
    title: string;
    content: string;
    postType: string;
    imageUrl?: string;
    linkUrl?: string;
    createdAt: string;
    author: { _id: string; username: string } | string;
    community: { _id: string; name: string } | string;
    score: number;
    upvotes: number;
    downvotes: number;
    userVote?: number;
    commentCount?: number;
}

export interface CreatePostData {
    title: string;
    content?: string;
    postType: string;
    imageUrl?: string;
    linkUrl?: string;
    author: string;
    community: string;
}

// API Functions
export const createPost = async (postData: CreatePostData): Promise<BackendPost> => {
    const response = await fetch(POST_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create post");
    }

    return response.json();
};

export const fetchPosts = async (userId?: string): Promise<BackendPost[]> => {
    const url = userId
        ? `${POST_API_URL}?userId=${userId}`
        : POST_API_URL;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch posts");
    }

    return response.json();
};

export const fetchPopularPosts = async (userId?: string): Promise<BackendPost[]> => {
    const url = userId
        ? `${POST_API_URL}/popular?userId=${userId}`
        : `${POST_API_URL}/popular`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch popular posts");
    }

    return response.json();
};

export const fetchPost = async (postId: string): Promise<BackendPost> => {
    const response = await fetch(`${POST_API_URL}/${postId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch post");
    }
    return response.json();
};

export const updatePost = async (postId: string, postData: Partial<CreatePostData>): Promise<BackendPost> => {
    const response = await fetch(`${POST_API_URL}/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update post");
    }

    return response.json();
};

export const deletePost = async (postId: string): Promise<void> => {
    const response = await fetch(`${POST_API_URL}/${postId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete post");
    }
};

export const voteOnPost = async (postId: string, userId: string, value: number) => {
    try {
        const response = await fetch(VOTE_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, userId, value }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to vote");
        }

        return response.json();
    } catch (error) {
        console.error("Vote API Error:", error);
        throw error;
    }
};

