// filepath: /home/awail/WebstormProjects/islam_front/src/apis/communityApi.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/apis/Communityapi`;
const JOIN_URL = `${API_BASE_URL}/apis/Communityapi/join`;

export interface CommunityData {
    _id: string;
    name: string;
    description?: string;
    members: string[];
}

export interface CreateCommunityData {
    name: string;
    description?: string;
    userId: string;
}

// 1. Get All Communities
export const getAllCommunities = async (): Promise<CommunityData[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch communities");
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

// 2. Create a Community
export const createCommunity = async (data: CreateCommunityData): Promise<CommunityData> => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to create community");
        }

        return await response.json();
    } catch (error) {
        console.error("Create Community API Error:", error);
        throw error;
    }
};

// 3. Search Communities
export const searchCommunities = async (query: string): Promise<CommunityData[]> => {
    try {
        const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error("Failed to search communities");
        }

        return await response.json();
    } catch (error) {
        console.error("Search API Error:", error);
        throw error;
    }
};

// 3. Function to Join or Leave
export const joinCommunity = async (communityId: string, userId: string) => {
    try {
        const response = await fetch(JOIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ communityId, userId }),
        });

        if (!response.ok) throw new Error("Failed to join/leave community");

        return await response.json();
    } catch (error) {
        console.error("Join API Error:", error);
        throw error;
    }
};

// 4. Function to get communities a user has joined
export const getJoinedCommunities = async (userId: string): Promise<CommunityData[]> => {
    try {
        const response = await fetch(`${API_URL}/user/${userId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch joined communities");
        }

        return await response.json();
    } catch (error) {
        console.error("API Error (Joined Communities):", error);
        throw error;
    }
};

