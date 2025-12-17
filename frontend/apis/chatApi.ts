import axios from "axios";

/**
 * Backend is running on port 3000
 */
const API_BASE = "http://localhost:3000";

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
});

/* =========================
   Types
========================= */

export interface User {
    _id: string;
    username: string;
    email?: string;
}

export interface Participant {
    _id: string;
    username: string;
}

export interface Conversation {
    _id: string;
    participants: Participant[] | string[];
    createdAt?: string;
    updatedAt?: string;
    lastMessage?: Message;
}

export interface Message {
    _id: string;
    conversationId: string;
    sender: {
        _id: string;
        username?: string;
    } | string;
    text: string;
    createdAt?: string;
}

/* =========================
   Chat API
========================= */

/**
 * Create or get a conversation between two users
 */
export async function getOrCreateConversation(
    userId: string,
    otherUserId: string
): Promise<Conversation> {
    const res = await api.post<Conversation>(
        "/api/chat/conversation",
        {
            userId,
            otherUserId,
        }
    );
    return res.data;
}

/**
 * Get all conversations for a user
 */
export async function getUserConversations(
    userId: string
): Promise<Conversation[]> {
    const res = await api.get<Conversation[]>(
        `/api/chat/conversations/${userId}`
    );
    return res.data;
}

/**
 * Get all messages in a conversation
 */
export async function getMessages(
    conversationId: string
): Promise<Message[]> {
    const res = await api.get<Message[]>(
        `/api/chat/messages/${conversationId}`
    );
    return res.data;
}

/**
 * Send a message (REST fallback – Socket.IO is preferred)
 */
export async function sendMessage(
    conversationId: string,
    senderId: string,
    text: string
): Promise<Message> {
    const res = await api.post<Message>(
        "/api/chat/message",
        {
            conversationId,
            senderId,
            text,
        }
    );
    return res.data;
}

/**
 * Get all users (for starting new conversations)
 */
export async function getAllUsers(): Promise<User[]> {
    const res = await api.get<User[]>("/api/chat/users");
    return res.data;
}

/**
 * Search users by username
 */
export async function searchUsers(query: string): Promise<User[]> {
    const res = await api.get<User[]>(`/api/chat/users/search?q=${encodeURIComponent(query)}`);
    return res.data;
}

