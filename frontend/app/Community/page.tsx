"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAllCommunities, CommunityData } from "../../apis/Communityapi";
import JoinButton from "../components/JoinButton"; // Import the button

const Community = () => {
    const [communities, setCommunities] = useState<CommunityData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllCommunities();
                setCommunities(data);
            } catch (err) {
                console.error("Failed to load communities:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">All Communities</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {communities.map((community) => (
                    <Link
                        key={community._id}
                        href={`/r/${community.name}`}
                        className="block group relative"
                    >
                        <div className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md hover:border-blue-500 transition-all bg-white cursor-pointer h-full">

                            {/* Header: Icon + Name + Button */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                        r/
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
                                        r/{community.name}
                                    </h2>
                                </div>

                                {/* 👇 The Join Button Component */}
                                <JoinButton
                                    communityId={community._id}
                                    initialMembers={community.members}
                                />
                            </div>

                            <p className="text-sm text-gray-500 line-clamp-2">
                                {community.description || "No description available."}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Community;