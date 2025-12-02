"use client";

import React, { useState } from "react";
import { joinCommunity } from "../../apis/Communityapi";

interface JoinButtonProps {
    communityId: string;
    initialMembers: string[];
}

const JoinButton: React.FC<JoinButtonProps> = ({ communityId, initialMembers }) => {
    // 🛠️ HARDCODED USER ID (Must match what you use in CreatePost!)
    const TEST_USER_ID = "67a0123bcf1234abcd567890";

    // Safe check: Ensure initialMembers is an array before checking
    const safeMembers = Array.isArray(initialMembers) ? initialMembers : [];
    const isAlreadyMember = safeMembers.includes(TEST_USER_ID);

    const [joined, setJoined] = useState(isAlreadyMember);
    const [loading, setLoading] = useState(false);

    const handleJoin = async (e: React.MouseEvent) => {
        e.preventDefault(); // Stop link navigation (parent card click)
        e.stopPropagation();

        setLoading(true);
        try {
            console.log(`Attempting to join/leave community: ${communityId}`);
            const result = await joinCommunity(communityId, TEST_USER_ID);

            if (result.success) {
                setJoined(result.isMember);
                console.log("Success! New status:", result.isMember ? "Joined" : "Left");
            }
        } catch (err) {
            console.error("Join Failed:", err);
            alert("Failed to join. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleJoin}
            disabled={loading}
            className={`px-4 py-1 rounded-full text-sm font-bold transition-all z-10 relative ${
                joined
                    ? "border border-gray-400 text-gray-600 hover:bg-gray-100"
                    : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
        >
            {loading ? "..." : joined ? "Joined" : "Join"}
        </button>
    );
};

export default JoinButton;