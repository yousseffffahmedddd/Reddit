import React from "react";

// define the type for props
interface PageProps {
    params: Promise<{ name: string }>;
}

// 1. Make the component 'async' to handle data fetching/params safely
export default async function CommunityPage(props: PageProps) {

    // 2. Await the params (works in Next.js 15 and 14)
    const resolvedParams = await props.params;
    const rawName = resolvedParams.name;

    // 3. Decode the name (NextJS -> NextJS, New%20York -> New York)
    const communityName = decodeURIComponent(rawName);

    return (
        <div className="max-w-4xl mx-auto mt-6">
            {/* Banner / Header */}
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-sm">
                        r/
                    </div>

                    {/* Text Info */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            r/{communityName}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Welcome to the {communityName} community.
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3 mt-4">
                            <button className="px-6 py-1.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition">
                                Join
                            </button>
                            <button className="px-6 py-1.5 border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition">
                                Create Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="mt-6 p-10 bg-white rounded shadow-sm border border-gray-200 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
                <p className="text-gray-500">
                    Be the first to post in r/{communityName}!
                </p>
            </div>
        </div>
    );
}