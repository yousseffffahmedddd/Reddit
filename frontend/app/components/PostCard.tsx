// frontend/app/components/PostCard.tsx
import { ArrowUp, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";

type Post = {
    _id: string;
    title: string;
    upvotes: number;
    author: { _id: string; username: string };
    community: { name: string };
    comments: any[];
};

export default function PostCard({ post }: { post: Post }) {
    return (
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all border">
            <div className="flex">
                {/* Vote Section */}
                <div className="bg-gray-50 p-3 flex flex-col items-center w-16">
                    <ArrowUp className="w-6 h-6 text-orange-600 hover:bg-orange-100 rounded transition cursor-pointer" />
                    <span className="text-lg font-bold my-1">{post.upvotes || 0}</span>
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                    <div className="text-sm text-gray-600 mb-1">
                        r/{post.community?.name || "unknown"} • posted by{" "}
                        <Link
                            href={`/profile/${post.author?._id}`}
                            className="hover:underline text-gray-800 font-medium"
                            onClick={(e) => e.stopPropagation()}
                        >
                            u/{post.author?.username || "user"}
                        </Link>
                    </div>

                    <Link href={`/post/${post._id}`}>
                        <h3 className="text-xl font-semibold line-clamp-2 hover:text-blue-600 transition">
                            {post.title}
                        </h3>
                    </Link>

                    <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
                        <Link
                            href={`/post/${post._id}`}
                            className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-full transition"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span>{post.comments?.length || 0} Comments</span>
                        </Link>
                        <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-full transition">
                            <Share2 className="w-5 h-5" />
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}