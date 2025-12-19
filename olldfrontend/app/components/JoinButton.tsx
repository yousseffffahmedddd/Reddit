"use client";

import React, { useState, useEffect } from "react";
import { joinCommunity } from "../../apis/Communityapi";

interface JoinButtonProps {
    communityId: string;
    initialMembers: string[];
}

const JoinButton: React.FC<JoinButtonProps> = ({ communityId, initialMembers }) => {
    const [user, setUser] = useState<{ id: string } | null>(null);
    const [joined, setJoined] = useState(false);
    const [loading, setLoading] = useState(false);

    // 1. Fetch User from LocalStorage on mount
    useEffect(() => {
        // Check if running in browser
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);

                // 2. Check if THIS user is already a member
                // (Ensure initialMembers is an array to avoid crashes)
                const safeMembers = Array.isArray(initialMembers) ? initialMembers : [];
                if (safeMembers.includes(parsedUser.id)) {
                    setJoined(true);
                }
            }
        }
    }, [initialMembers]);

    const handleJoin = async (e: React.MouseEvent) => {
        e.preventDefault(); // Stop parent link click
        e.stopPropagation();

        if (!user) {
            alert("You must be logged in to join communities!");
            return;
        }

        setLoading(true);
        try {
            console.log(`User ${user.id} is toggling join for ${communityId}`);
            const result = await joinCommunity(communityId, user.id);

            if (result.success) {
                setJoined(result.isMember);
            }
        } catch (err) {
            console.error("Join Failed:", err);
            alert("Failed to join. Check console.");
        } finally {
            setLoading(false);
        }
    };

    // If user is not logged in, we can disable or change text
    if (!user) {
        return (
            <button
                onClick={(e) => { e.preventDefault(); alert("Please log in first."); }}
                className="px-4 py-1 rounded-full text-sm font-bold bg-gray-200 text-gray-500 hover:bg-gray-300 z-10 relative"
            >
                Join
            </button>
        );
    }

    return (
        <button
            onClick={handleJoin}
            disabled={loading}
            className={`px-4 py-1 rounded-full text-sm font-bold transition-all z-10 relative ${
                joined
                    ? "border border-gray-400 text-gray-600 hover:bg-gray-100" // Style for "Joined"
                    : "bg-blue-600 text-white hover:bg-blue-700"               // Style for "Join"
            }`}
        >
            {loading ? "..." : joined ? "Joined" : "Join"}
        </button>
    );
};

export default JoinButton;