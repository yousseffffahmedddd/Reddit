// frontend/app/popular/page.tsx
import PostCard from "@/app/components/PostCard";
import TrendingSidebar from "@/app/components/TrendingSidebar";

async function getPopularPosts() {
    const res = await fetch("http://localhost:3000/api/posts/popular", {
        cache: "no-store",
    });
    return res.ok ? await res.json() : [];
}

export default async function PopularPage() {
    const posts = await getPopularPosts();

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-orange-600 mb-8">Popular</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {posts.length === 0 ? (
                        <div className="bg-white rounded-lg p-12 text-center shadow">
                            <p className="text-xl text-gray-500">No popular posts yet</p>
                            <p className="text-sm text-gray-400 mt-2">Database might not be connected</p>
                        </div>
                    ) : (
                        posts.map((post: any) => <PostCard key={post._id} post={post} />)
                    )}
                </div>

                <div className="hidden lg:block">
                    <TrendingSidebar />
                </div>
            </div>
        </div>
    );
}