// filepath: /home/awail/WebstormProjects/islam_front/src/apis/chatApi.ts

const API_BASE_URL =  'http://44.192.94.63:3000';

/* =========================
   Types
========================= */

export interface ChatUser {
    _id: string;
    username: string;
    email?: string;
}

export interface Participant {
    _id: string;
    username: string;
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

export interface Conversation {
    _id: string;
    participants: Participant[] | string[];
    createdAt?: string;
    updatedAt?: string;
    lastMessage?: Message;
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
    const res = await fetch(`${API_BASE_URL}/api/chat/conversation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otherUserId }),
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create conversation");
    }

    return res.json();
}

/**
 * Get all conversations for a user
 */
export async function getUserConversations(
    userId: string
): Promise<Conversation[]> {
    const res = await fetch(`${API_BASE_URL}/api/chat/conversations/${userId}`);

    if (!res.ok) {
        throw new Error("Failed to fetch conversations");
    }

    return res.json();
}

/**
 * Get all messages in a conversation
 */
export async function getMessages(
    conversationId: string
): Promise<Message[]> {
    const res = await fetch(`${API_BASE_URL}/api/chat/messages/${conversationId}`);

    if (!res.ok) {
        throw new Error("Failed to fetch messages");
    }

    return res.json();
}

/**
 * Send a message (REST fallback – Socket.IO is preferred)
 */
export async function sendMessage(
    conversationId: string,
    senderId: string,
    text: string
): Promise<Message> {
    const res = await fetch(`${API_BASE_URL}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, senderId, text }),
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to send message");
    }

    return res.json();
}

/**
 * Get all users (for starting new conversations)
 */
export async function getAllUsers(): Promise<ChatUser[]> {
    const res = await fetch(`${API_BASE_URL}/api/chat/users`);

    if (!res.ok) {
        throw new Error("Failed to fetch users");
    }

    return res.json();
}

/**
 * Search users by username
 */
export async function searchUsers(query: string): Promise<ChatUser[]> {
    const res = await fetch(`${API_BASE_URL}/api/chat/users/search?q=${encodeURIComponent(query)}`);

    if (!res.ok) {
        throw new Error("Failed to search users");
    }

    return res.json();
}

