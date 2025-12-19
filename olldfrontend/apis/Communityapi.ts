// filepath: /frontend/apis/Communityapi.ts

export interface CommunityData {
    _id: string;
    name: string;
    description?: string;
    members: string[];
}

const API_URL = "http://localhost:3000/apis/Communityapi";
const JOIN_URL = "http://localhost:3000/apis/Communityapi/join";

// 1. Get All Communities
export const getAllCommunities = async (): Promise<CommunityData[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch");
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

// 2. Search Communities
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

        if (!response.ok) throw new Error("Failed to join/leave");

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