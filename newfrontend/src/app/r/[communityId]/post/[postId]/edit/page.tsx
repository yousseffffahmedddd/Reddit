'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Input, Textarea, Modal } from '@/components/ui';
import { usePost, useUpdatePost, useCommunities } from '@/hooks';
import { Loader } from '@/components/ui';
import type { PostType } from '@/types';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { communityId, postId } = params;

  const { data: post, isLoading: isLoadingPost } = usePost(postId as string);
  const { data: communitiesData } = useCommunities();
  const { mutate: updatePost, isPending: isUpdating, error } = useUpdatePost();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [communityIdState, setCommunityIdState] = useState(communityId as string);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const communities = communitiesData?.data || [];

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content || '');
      setCommunityIdState(post.communityId);
    }
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !communityIdState) return;

    updatePost(
      {
        postId: postId as string,
        title: title.trim(),
        content: content.trim(),
      },
      {
        onSuccess: () => {
          setShowSuccessModal(true);
        },
        onError: (error) => {
          console.error('Update failed:', error);
        },
      }
    );
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push(`/r/${communityId}/post/${postId}`);
    router.refresh();
  };

  if (isLoadingPost) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <p className="text-gray-500">The post you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h1 className="text-xl font-semibold">Edit Post</h1>
            <p className="text-gray-500 text-sm">Update your post details</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Community selector */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Community</label>
              <select
                value={communityIdState}
                onChange={(e) => setCommunityIdState(e.target.value)}
                disabled={isUpdating}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a community</option>
                {communities.map((community) => (
                  <option key={community.id} value={community.id}>
                    r/{community.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={300}
                required
                disabled={isUpdating}
              />
              <p className="mt-1 text-xs text-gray-500">{title.length}/300</p>
            </div>

            {/* Content */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Content</label>
              <Textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                disabled={isUpdating}
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-destructive">{error.message}</p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isUpdating}
                disabled={!title.trim() || !communityIdState}
              >
                Update Post
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Post Updated"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Your post has been successfully updated.</p>
          <div className="flex justify-end">
            <Button onClick={handleSuccessModalClose}>OK</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}