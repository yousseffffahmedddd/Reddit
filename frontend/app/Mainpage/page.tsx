'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const Layout: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md flex items-center px-4 py-2 sticky top-0 z-50">
        {/* Logo */}
        <div
          className="text-orange-500 font-bold text-2xl cursor-pointer"
          onClick={() => router.push('/')}
        >
          RedditClone
        </div>

        {/* Search Bar */}
        <div className="ml-6 flex-1 max-w-xl relative">
          <input
            type="text"
            placeholder="Search Reddit"
            className="w-full pl-10 pr-4 py-1 rounded bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"
            />
          </svg>
        </div>

        {/* Buttons */}
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

      {/* Main Section */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-60 bg-white border-r p-4 space-y-3 sticky top-[60px] h-[calc(100vh-60px)]">
          <p className="font-bold text-gray-700 mb-2">Home</p>
          <button
            className="text-left hover:bg-gray-100 px-2 py-1 rounded"
            onClick={() => router.push('/')}
          >
            Home Feed
          </button>
          <button
            className="text-left hover:bg-gray-100 px-2 py-1 rounded"
            onClick={() => router.push('/Community')}
          >
            Community
          </button>
          <button
            className="text-left hover:bg-gray-100 px-2 py-1 rounded"
            onClick={() => router.push('/profile')}
          >
            Profile
          </button>
          <button
            className="text-left hover:bg-gray-100 px-2 py-1 rounded"
            onClick={() => router.push('/about')}
          >
            About
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4">
          <div className="bg-white rounded shadow p-4 mb-4">
            <h2 className="font-bold text-lg">Post Title</h2>
            <p className="text-gray-700 mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Reddit
              clone post content goes here.
            </p>
          </div>
          <div className="bg-white rounded shadow p-4 mb-4">
            <h2 className="font-bold text-lg">Another Post</h2>
            <p className="text-gray-700 mt-2">
              Another example post content for Reddit-style UI.
            </p>
          </div>
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
