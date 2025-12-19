"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";
import { getMessages, Conversation } from "@/apis/chatApi";
import axios from "axios";

interface PopulatedMessage {
    _id: string;
    conversationId: string;
    sender: {
        _id: string;
        username: string;
    };
    text: string;
    createdAt?: string;
}

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const conversationId = params.conversationId as string;
    const socket = getSocket();

    const [messages, setMessages] = useState<PopulatedMessage[]>([]);
    const [text, setText] = useState("");
    const [userId, setUserId] = useState<string>("");
    const [otherUsername, setOtherUsername] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const id = localStorage.getItem("userId");

        if (!id) {
            router.push("/Login");
            return;
        }

        setUserId(id);

        // Load existing messages
        loadMessages();

        // Join conversation room
        socket.emit("joinConversation", conversationId);

        // Listen for new messages
        socket.on("newMessage", (msg: PopulatedMessage) => {
            setMessages((prev) => {
                // Avoid duplicates
                if (prev.find((m) => m._id === msg._id)) {
                    return prev;
                }
                return [...prev, msg];
            });
        });

        return () => {
            socket.off("newMessage");
        };
    }, [conversationId, socket, router]);

    const loadMessages = async () => {
        try {
            const data = await getMessages(conversationId);
            setMessages(data as PopulatedMessage[]);

            // Get the other participant's username from the conversation
            const res = await axios.get<Conversation[]>(
                `http://localhost:3000/api/chat/conversations/${localStorage.getItem("userId")}`
            );
            const conversations = res.data;
            const currentConv = conversations.find((c) => c._id === conversationId);

            if (currentConv) {
                const participants = currentConv.participants as { _id: string; username: string }[];
                const other = participants.find(
                    (p) => p._id !== localStorage.getItem("userId")
                );
                if (other) {
                    setOtherUsername(other.username);
                }
            }
        } catch (error) {
            console.error("Failed to load messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const send = () => {
        if (!text.trim() || sending) return;

        setSending(true);

        socket.emit("sendMessage", {
            conversationId,
            senderId: userId,
            text: text.trim(),
        });

        setText("");
        setSending(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    const getSenderName = (msg: PopulatedMessage): string => {
        return msg.sender?.username || "User";
    };

    const isOwnMessage = (msg: PopulatedMessage): boolean => {
        return msg.sender?._id === userId;
    };

    const formatTime = (dateStr?: string): string => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-white text-xl">Loading chat...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center">
                <button
                    onClick={() => router.push("/chat")}
                    className="mr-4 text-gray-400 hover:text-white transition"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white">
                    {otherUsername ? otherUsername[0].toUpperCase() : "?"}
                </div>
                <div className="ml-3">
                    <div className="font-semibold">{otherUsername || "Chat"}</div>
                    <div className="text-xs text-gray-400">Online</div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                        <div className="text-4xl mb-2">👋</div>
                        <p>No messages yet. Say hello!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isOwn = isOwnMessage(msg);
                        return (
                            <div
                                key={msg._id}
                                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[70%] ${
                                        isOwn
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-700 text-white"
                                    } rounded-2xl px-4 py-2`}
                                >
                                    {!isOwn && (
                                        <div className="text-xs text-gray-300 font-semibold mb-1">
                                            {getSenderName(msg)}
                                        </div>
                                    )}
                                    <div className="break-words">{msg.text}</div>
                                    <div
                                        className={`text-xs mt-1 ${
                                            isOwn ? "text-orange-200" : "text-gray-400"
                                        }`}
                                    >
                                        {formatTime(msg.createdAt)}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-gray-800 border-t border-gray-700 p-4">
                <div className="flex items-center space-x-3 max-w-4xl mx-auto">
                    <input
                        ref={inputRef}
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-full border border-gray-600 focus:outline-none focus:border-orange-500 transition"
                    />
                    <button
                        onClick={send}
                        disabled={!text.trim() || sending}
                        className={`p-3 rounded-full transition ${
                            text.trim()
                                ? "bg-orange-500 hover:bg-orange-600 text-white"
                                : "bg-gray-700 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
