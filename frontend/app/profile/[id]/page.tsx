// frontend/app/profile/[id]/page.tsx
import PostCard from "@/app/components/PostCard";

async function getUser(id: string) {
    const res = await fetch(`http://localhost:3000/api/users/${id}`, { cache: "no-store" });
    return res.ok ? await res.json() : null;
}

async function getUserPosts(id: string) {
    const res = await fetch(`http://localhost:3000/api/users/${id}/posts`, { cache: "no-store" });
    return res.ok ? await res.json() : [];
}

export default async function ProfilePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;  // ← THIS IS THE CRITICAL LINE

    const user = await getUser(id);
    const posts = await getUserPosts(id);

    if (!user) {
        return <div className="text-center py-20 text-2xl text-gray-600">User not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-1 mb-10">
                <div className="bg-white rounded-3xl p-10 text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-6xl font-bold shadow-2xl">
                        {user.username?.[0].toUpperCase() || "U"}
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900">u/{user.username}</h1>
                    <p className="text-xl text-gray-600 mt-2">Karma: {user.karma || 0}</p>
                </div>
            </div>

            <h2 className="text-3xl font-bold mb-6">Posts</h2>
            <div className="space-y-6">
                {posts.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-xl">
                        <p className="text-xl text-gray-500">This user hasn't posted anything yet</p>
                    </div>
                ) : (
                    posts.map((post: any) => <PostCard key={post._id} post={post} />)
                )}
            </div>
        </div>
    );
}