// filepath: /home/awail/WebstormProjects/islam_front/src/apis/userApi.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/api/users`;

// Define the shape of the User object
export interface UserProfile {
    _id: string;
    username: string;
    email: string;
    bio?: string;
    profilePicture?: string;
    displayName?: string;
    createdAt: string;
    karma?: number;
}

/**
 * Get a user's public profile info
 * @param username - The username to look up
 */
export const getUserProfile = async (username: string): Promise<UserProfile> => {
    try {
        const response = await fetch(`${API_URL}/profile/${username}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch user profile");
        }

        return await response.json();
    } catch (error) {
        console.error("API Error (Get Profile):", error);
        throw error;
    }
};

/**
 * Update the logged-in user's profile
 * @param userId - ID of the user updating their profile
 * @param data - Object containing fields to update (bio, avatar, etc.)
 */
export const updateUserProfile = async (
    userId: string,
    data: { bio?: string; profilePicture?: string; displayName?: string }
): Promise<UserProfile> => {
    try {
        const response = await fetch(`${API_URL}/profile`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, ...data }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update profile");
        }

        return await response.json();
    } catch (error) {
        console.error("API Error (Update Profile):", error);
        throw error;
    }
};

/**
 * Upload a profile picture
 * @param userId - ID of the user uploading the picture
 * @param file - The image file to upload
 */
export const uploadProfilePicture = async (
    userId: string,
    file: File
): Promise<{ message: string; user: UserProfile; profilePicture: string }> => {
    try {
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("profilePicture", file);

        const response = await fetch(`${API_URL}/profile/picture`, {
            method: "POST",
            body: formData,
            // Don't set Content-Type header - let browser set it with boundary
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to upload profile picture");
        }

        return await response.json();
    } catch (error) {
        console.error("API Error (Upload Profile Picture):", error);
        throw error;
    }
};

/**
 * Delete the user's profile picture
 * @param userId - ID of the user deleting their picture
 */
export const deleteProfilePicture = async (
    userId: string
): Promise<{ message: string; user: UserProfile }> => {
    try {
        const response = await fetch(`${API_URL}/profile/picture`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete profile picture");
        }

        return await response.json();
    } catch (error) {
        console.error("API Error (Delete Profile Picture):", error);
        throw error;
    }
};

/**
 * Get the full URL for a profile picture
 * @param profilePicture - The profile picture path from the user object
 */
export const getProfilePictureUrl = (profilePicture: string | null | undefined): string => {
    if (!profilePicture) {
        return "/default-avatar.png";
    }
    // If it's already a full URL, return it
    if (profilePicture.startsWith("http")) {
        return profilePicture;
    }
    // Otherwise, prepend the backend URL
    return `${API_BASE_URL}${profilePicture}`;
};

