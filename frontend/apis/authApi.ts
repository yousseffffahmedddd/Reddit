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

const API_URL = "http://localhost:3000/api/auth";

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
    } catch (error: any) {
        throw new Error(error.message);
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
    } catch (error: any) {
        throw new Error(error.message);
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

export const logout = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Optional: Refresh page to update UI
        window.location.href = "/Login";
    }
};