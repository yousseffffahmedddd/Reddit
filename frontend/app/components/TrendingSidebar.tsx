// frontend/components/TrendingSidebar.tsx
export default function TrendingSidebar() {
    const trending = [
        { name: "programming", members: "1.2M" },
        { name: "funny", members: "980k" },
        { name: "memes", members: "2.1M" },
        { name: "AskReddit", members: "3.8M" },
    ];

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Trending Communities</h3>
            <div className="space-y-4">
                {trending.map((comm, i) => (
                    <div key={i} className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition">
                        <div>
                            <p className="font-semibold">r/{comm.name}</p>
                            <p className="text-sm text-gray-500">{comm.members} members</p>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition">
                            Join
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}