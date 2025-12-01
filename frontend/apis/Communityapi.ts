// 1. Export the Interface so other files can use "CommunityData"
export interface CommunityData {
    _id: string;
    name: string;
    description?: string;
}

const API_URL = "http://localhost:3000/apis/Communityapi";

// 2. Export the Function so other files can use "getAllCommunities"
export const getAllCommunities = async (): Promise<CommunityData[]> => {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};