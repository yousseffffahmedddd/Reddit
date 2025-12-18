// filepath: /home/awail/WebstormProjects/islam_front/src/apis/authApi.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/api/auth`;

// 1. Define Types
export interface AuthResponse {
    message: string;
    token?: string;
    user?: {
        id: string;
        username: string;
        email: string;
    };
}

export interface LoginData {
    email?: string;
    password?: string;
}

export interface SignupData {
    username?: string;
    email?: string;
    password?: string;
}

// 2. API Functions
export const signupUser = async (userData: SignupData): Promise<AuthResponse> => {
    try {
        const res = await fetch(`${API_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Signup failed");
        return data;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Signup failed";
        throw new Error(message);
    }
};

export const loginUser = async (userData: LoginData): Promise<AuthResponse> => {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");
        return data;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Login failed";
        throw new Error(message);
    }
};

// 3. Token Helpers (LocalStorage)
export const setToken = (token: string) => {
    if (typeof window !== "undefined") localStorage.setItem("token", token);
};

export const getToken = () => {
    if (typeof window !== "undefined") return localStorage.getItem("token");
    return null;
};

export const setUserId = (userId: string) => {
    if (typeof window !== "undefined") localStorage.setItem("userId", userId);
};

export const getUserId = () => {
    if (typeof window !== "undefined") return localStorage.getItem("userId");
    return null;
};

export const logout = async (): Promise<void> => {
    if (typeof window === "undefined") return;

    try {
        // Optional: notify backend (not required, but clean)
        await fetch(`${API_URL}/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch {
        // Ignore backend errors – logout should still proceed
    } finally {
        // ✅ REAL logout happens here
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
    }
};

