"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateCommunityPage = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3000/apis/Communityapi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description }),
            });

            if (!response.ok) {
                throw new Error('Failed to create community');
            }

            // Success! Redirect back to the list
            router.push('/Community');
            router.refresh(); // Refresh to show the new data
        } catch (err) {
            setError('Error creating community. Try again.');
            console.error(err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-lg bg-white">
            <h1 className="text-2xl font-bold mb-6">Create a Community</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-bold mb-2">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="e.g. r/programming"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="What is this community about?"
                        rows={4}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                    Create Community
                </button>
            </form>
        </div>
    );
};

export default CreateCommunityPage;