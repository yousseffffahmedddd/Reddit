import axios from 'axios';

// 1. UPDATE THIS INTERFACE
export interface Post {
    _id: string;
    title: string;
    content: string;
    postType: string;
    createdAt: string;
    author: { _id: string; username: string };
    community: { _id: string; name: string };

    // New fields for voting:
    score: number;      // Total votes (e.g., 5, -2)
    userVote?: number;  // Did the current user vote? (1 = up, -1 = down, 0 = none)
}

export interface CreatePostData {
    title: string;
    content: string;
    postType: string;
    author: string;
    community: string;
}

// Check your backend URLs - 'apis' vs 'api' might be a typo in your code?
const API_BASE = "http://localhost:3000/apis/Postapi";
const VOTE_API_URL = "http://localhost:3000/api/votes";

export const createPost = async (postData: CreatePostData): Promise<Post> => {
    const { data } = await axios.post<Post>(API_BASE, postData);
    return data;
};

export const fetchPosts = async (): Promise<Post[]> => {
    const { data } = await axios.get<Post[]>(API_BASE);
    return data;
};

export const voteOnPost = async (postId: string, userId: string, value: number) => {
    try {
        const response = await axios.post(VOTE_API_URL, {
            postId,
            userId,
            value
        });
        return response.data;
    } catch (error) {
        console.error("Vote API Error:", error);
        throw error;
    }
};