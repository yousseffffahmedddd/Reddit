"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// Define what a Community looks like
interface Community {
    _id: string;
    name: string;
    description: string;
}

const CommunitiesPage = () => {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch data when component mounts
    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const response = await fetch('http://localhost:3000/apis/Communityapi');
                const data = await response.json();
                setCommunities(data);
            } catch (error) {
                console.error("Error fetching communities:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCommunities();
    }, []);

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-500">
                Loading communities...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Header Section with Title and Create Button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Communities</h1>
                <Link
                    href="/Community/create"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow transition-colors"
                >
                    + Create Community
                </Link>
            </div>

            {/* Community Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {communities.map((community) => (
                    <div key={community._id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{community.name}</h2>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {community.description || "No description provided."}
                        </p>
                        <button className="w-full mt-auto bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded hover:bg-blue-200 transition-colors">
                            Join Community
                        </button>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {communities.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg mb-2">No communities found.</p>
                    <p className="text-gray-400 text-sm">Be the first to create one!</p>
                </div>
            )}
        </div>
    );
};

export default CommunitiesPage;