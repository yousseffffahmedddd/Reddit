'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreatePost: React.FC = () => {
  const router = useRouter();

  // Optional: You can track selected values with state
  const [community, setCommunity] = useState<string>('user profile (/u)');
  const [postType, setPostType] = useState<string>('Text');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handlePost = () => {
    // You can handle form submission here
    console.log({ community, postType, title, content });
    router.push('/CommunityPage');
  };

  const handleSaveDraft = () => {
    console.log('Saved as draft', { community, postType, title, content });
    // Navigate somewhere if needed, e.g., drafts page
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Choose Community</label>
        <select
          className="w-full border border-gray-300 rounded p-2"
          value={community}
          onChange={(e) => setCommunity(e.target.value)}
        >
          <option>user profile (/u)</option>
          <option>reddit community (/r)</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Post Type</label>
        <select
          className="w-full border border-gray-300 rounded p-2"
          value={postType}
          onChange={(e) => setPostType(e.target.value)}
        >
          <option>Text</option>
          <option>Image & video</option>
          <option>Link</option>
        </select>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

      <div className="mb-4">
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 h-32"
        ></textarea>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handlePost}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Post
        </button>

        <button
          onClick={handleSaveDraft}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Save as Draft
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
