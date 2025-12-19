// filepath: /home/awail/WebstormProjects/islam_front/src/apis/communityApi.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/apis/Communityapi`;
const JOIN_URL = `${API_BASE_URL}/apis/Communityapi/join`;

export interface CommunityData {
    _id: string;
    name: string;
    description?: string;
    members: string[];
    ownerId?: string; // The creator of the community
    createdAt?: string;
    iconUrl?: string;
    bannerUrl?: string;
}

export interface CreateCommunityData {
    name: string;
    description?: string;
    userId: string;
}

export interface UpdateCommunityData {
    name?: string;
    description?: string;
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

// 5. Function to get communities owned/created by a user
// Since the backend doesn't have a specific endpoint, we filter all communities
// where the user is the first member (creator) or matches ownerId
export const getOwnedCommunities = async (userId: string): Promise<CommunityData[]> => {
    try {
        const allCommunities = await getAllCommunities();
        // Filter communities where the user is the owner (first member = creator)
        return allCommunities.filter(community =>
            community.ownerId === userId ||
            (community.members && community.members[0] === userId)
        );
    } catch (error) {
        console.error("API Error (Owned Communities):", error);
        throw error;
    }
};

// 6. Update community
export const updateCommunity = async (
    communityId: string,
    userId: string,
    data: UpdateCommunityData
): Promise<CommunityData> => {
    try {
        const response = await fetch(`${API_URL}/${communityId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, ...data }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update community");
        }

        return await response.json();
    } catch (error) {
        console.error("Update Community API Error:", error);
        throw error;
    }
};

// 7. Upload community icon
export const uploadCommunityIcon = async (
    communityId: string,
    userId: string,
    file: File
): Promise<{ message: string; community: CommunityData; iconUrl: string }> => {
    try {
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("icon", file);

        const response = await fetch(`${API_URL}/${communityId}/icon`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to upload community icon");
        }

        return await response.json();
    } catch (error) {
        console.error("Upload Community Icon API Error:", error);
        throw error;
    }
};

// 8. Get community icon URL
export const getCommunityIconUrl = (iconUrl: string | null | undefined): string | null => {
    if (!iconUrl) {
        return null;
    }
    // If it's already a full URL, return it
    if (iconUrl.startsWith("http")) {
        return iconUrl;
    }
    // Otherwise, prepend the backend URL
    return `${API_BASE_URL}${iconUrl}`;
};

