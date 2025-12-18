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
    createdAt: string;
    author: { _id: string; username: string } | string;
    community: { _id: string; name: string } | string;
    score: number;
    userVote?: number;
}

export interface CreatePostData {
    title: string;
    content: string;
    postType: string;
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

export const fetchPosts = async (): Promise<BackendPost[]> => {
    const response = await fetch(POST_API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch posts");
    }

    return response.json();
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

