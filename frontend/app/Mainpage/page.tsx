

'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { fetchPosts } from '../../apis/Postapi';

interface Post {
  _id: string;
  title: string;
  content: string;
  postType: string;
  createdAt: string;
  author: { _id: string; username: string };   // assuming your User schema has username
  community: { _id: string; name: string };    // assuming Community schema has name
}

const Layout: React.FC = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);


useEffect(() => {
  const getPosts = async () => {
    try {
      const allPosts = await fetchPosts();
      setPosts(allPosts);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };
  getPosts();
}, []);


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md flex items-center px-4 py-2 sticky top-0 z-50">
        <div
          className="text-orange-500 font-bold text-2xl cursor-pointer"
          onClick={() => router.push('/')}
        >
          RedditClone
        </div>
        <div className="ml-6 flex-1 max-w-xl relative">
          <input
            type="text"
            placeholder="Search Reddit"
            className="w-full pl-10 pr-4 py-1 rounded bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div className="ml-6 flex items-center gap-2">
          <button
            className="px-3 py-1 rounded hover:bg-gray-200"
            onClick={() => router.push('/Login')}
          >
            Login
          </button>
          <button
            className="px-3 py-1 rounded bg-orange-500 text-white hover:bg-orange-600"
            onClick={() => router.push('/Signup')}
          >
            Sign Up
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-60 bg-white border-r p-4 space-y-3 sticky top-[60px] h-[calc(100vh-60px)]">
          <p className="font-bold text-gray-700 mb-2">Home</p>
          <button className="text-left hover:bg-gray-100 px-2 py-1 rounded" onClick={() => router.push('/')}>
            Home Feed
          </button>
          <button className="text-left hover:bg-gray-100 px-2 py-1 rounded" onClick={() => router.push('/Community')}>
            Community
          </button>
          <button className="text-left hover:bg-gray-100 px-2 py-1 rounded" onClick={() => router.push('/profile')}>
            Profile
          </button>
          <button className="text-left hover:bg-gray-100 px-2 py-1 rounded" onClick={() => router.push('/about')}>
            About
          </button>
          <button className="text-left hover:bg-gray-100 px-2 py-1 rounded" onClick={() => router.push('/CreatePost')}>
            Create Post
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4">
          {posts.length === 0 && <p className="text-gray-500">No posts yet. Create one!</p>}
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded shadow p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-lg">{post.title}</h2>
                <span className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-gray-700 mt-1">{post.content}</p>
              <div className="mt-2 text-sm text-gray-500">
                Posted by {post.author.username} in {post.community.name}
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t p-4 text-center text-gray-500 text-sm">
        © 2025 RedditClone. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
