"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    getUserConversations,
    getOrCreateConversation,
    getAllUsers,
    searchUsers,
    Conversation,
    User,
    Participant,
} from "@/apis/chatApi";

export default function ChatListPage() {
    const router = useRouter();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(true);
    const [showNewChat, setShowNewChat] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            router.push("/Login");
            return;
        }

        setCurrentUserId(userId);


        loadConversations(userId);
        loadUsers();
    }, [router]);

    const loadConversations = async (userId: string) => {
        try {
            const data = await getUserConversations(userId);
            setConversations(data);
        } catch (error) {
            console.error("Failed to load conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        setUsersLoading(true);
        try {
            const data = await getAllUsers();
            console.log("Loaded users:", data);
            setUsers(data);
        } catch (error: any) {
            console.error("Failed to load users:", error);
            setError(error.message || "Failed to load users");
        } finally {
            setUsersLoading(false);
        }
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            const results = await searchUsers(query);
            // Filter out the current user
            setSearchResults(results.filter((u) => u._id !== currentUserId));
        } catch (error) {
            console.error("Search failed:", error);
        }
    };

    const startConversation = async (otherUser: User) => {
        if (!currentUserId) return;

        try {
            const conversation = await getOrCreateConversation(
                currentUserId,
                otherUser._id
            );
            setShowNewChat(false);
            setSearchQuery("");
            setSearchResults([]);
            router.push(`/chat/${conversation._id}`);
        } catch (error) {
            console.error("Failed to create conversation:", error);
        }
    };

    const getOtherParticipant = (conversation: Conversation): string => {
        const participants = conversation.participants as Participant[];
        const other = participants.find((p) => p._id !== currentUserId);
        return other?.username || "Unknown User";
    };

    const formatTime = (dateStr?: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0) {
            return date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
        } else if (diffDays === 1) {
            return "Yesterday";
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: "short" });
        } else {
            return date.toLocaleDateString([], {
                month: "short",
                day: "numeric",
            });
        }
    };

    const getLastMessagePreview = (conversation: Conversation): string => {
        if (!conversation.lastMessage) return "No messages yet";
        const text = conversation.lastMessage.text;
        return text.length > 40 ? text.substring(0, 40) + "..." : text;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-orange-500">Messages</h1>
                    <button
                        onClick={() => setShowNewChat(!showNewChat)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-semibold transition"
                    >
                        {showNewChat ? "Cancel" : "+ New Chat"}
                    </button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto p-4">
                {/* New Chat Search */}
                {showNewChat && (
                    <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">
                        <h2 className="text-lg font-semibold mb-3">
                            Start a new conversation
                        </h2>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-orange-500"
                        />

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {searchResults.filter(u => u.username).map((user) => (
                                    <div
                                        key={user._id}
                                        onClick={() => startConversation(user)}
                                        className="flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition"
                                    >
                                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white">
                                            {user.username?.[0]?.toUpperCase() || "?"}
                                        </div>
                                        <div className="ml-3">
                                            <div className="font-semibold">
                                                {user.username}
                                            </div>
                                            {user.email && (
                                                <div className="text-sm text-gray-400">
                                                    {user.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* All Users (when no search) */}
                        {searchQuery.length < 2 && (
                            <div className="mt-3">
                                <div className="text-sm text-gray-400 mb-2">
                                    Suggested users
                                </div>
                                {usersLoading ? (
                                    <div className="text-center py-4 text-gray-400">
                                        Loading users...
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-4 text-red-400">
                                        {error}
                                    </div>
                                ) : users.filter((u) => u._id !== currentUserId && u.username).length === 0 ? (
                                    <div className="text-center py-4 text-gray-400">
                                        No other users found
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {users
                                            .filter((u) => u._id !== currentUserId && u.username)
                                            .slice(0, 10)
                                            .map((user) => (
                                                <div
                                                    key={user._id}
                                                    onClick={() => startConversation(user)}
                                                    className="flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition"
                                                >
                                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white">
                                                        {user.username?.[0]?.toUpperCase() || "?"}
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="font-semibold">
                                                            {user.username}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Conversations List */}
                {conversations.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">💬</div>
                        <h2 className="text-xl font-semibold mb-2">
                            No conversations yet
                        </h2>
                        <p className="text-gray-400 mb-4">
                            Start chatting with other users!
                        </p>
                        <button
                            onClick={() => setShowNewChat(true)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold transition"
                        >
                            Start a conversation
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {conversations.map((conv) => (
                            <div
                                key={conv._id}
                                onClick={() => router.push(`/chat/${conv._id}`)}
                                className="flex items-center p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition border border-gray-700"
                            >
                                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white text-lg">
                                    {getOtherParticipant(conv)[0].toUpperCase()}
                                </div>
                                <div className="ml-4 flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold truncate">
                                            {getOtherParticipant(conv)}
                                        </span>
                                        <span className="text-xs text-gray-400 ml-2">
                                            {formatTime(
                                                conv.lastMessage?.createdAt ||
                                                    conv.updatedAt
                                            )}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-400 truncate">
                                        {getLastMessagePreview(conv)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

