'use client';

import { useState } from 'react';
import { X, Image, Link2, FileText } from 'lucide-react';
import { Button, Input, Textarea, Modal } from '@/components/ui';
import { useCreatePost, useCommunities } from '@/hooks';
import type { PostType } from '@/types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCommunityId?: string;
}

export function CreatePostModal({ isOpen, onClose, defaultCommunityId }: CreatePostModalProps) {
  const [postType, setPostType] = useState<PostType>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [communityId, setCommunityId] = useState(defaultCommunityId || '');

  const { data: communitiesData } = useCommunities();
  const { mutate: createPost, isPending, error } = useCreatePost();

  const communities = communitiesData?.data || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !communityId) return;

    createPost(
      {
        title: title.trim(),
        content: postType === 'text' ? content.trim() : undefined,
        type: postType,
        imageUrl: postType === 'image' ? imageUrl.trim() : undefined,
        linkUrl: postType === 'link' ? linkUrl.trim() : undefined,
        communityId,
      },
      {
        onSuccess: () => {
          resetForm();
          onClose();
        },
      }
    );
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setImageUrl('');
    setLinkUrl('');
    setPostType('text');
  };

  const postTypes: { type: PostType; icon: typeof FileText; label: string }[] = [
    { type: 'text', icon: FileText, label: 'Post' },
    { type: 'image', icon: Image, label: 'Image' },
    { type: 'link', icon: Link2, label: 'Link' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Post" className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Community selector */}
        <div>
          <label className="mb-1 block text-sm font-medium">Community</label>
          <select
            value={communityId}
            onChange={(e) => setCommunityId(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          >
            <option value="">Choose a community</option>
            {communities.map((community) => (
              <option key={community.id} value={community.id}>
                r/{community.name}
              </option>
            ))}
          </select>
        </div>

        {/* Post type tabs */}
        <div className="flex gap-2 border-b">
          {postTypes.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => setPostType(type)}
              className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                postType === type
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Title */}
        <div>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={300}
            required
          />
          <p className="mt-1 text-xs text-muted-foreground">{title.length}/300</p>
        </div>

        {/* Content based on type */}
        {postType === 'text' && (
          <Textarea
            placeholder="Text (optional)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
          />
        )}

        {postType === 'image' && (
          <div className="space-y-2">
            <Input
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              type="url"
            />
            {imageUrl && (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-h-64 rounded-md object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        )}

        {postType === 'link' && (
          <Input
            placeholder="URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            type="url"
            required={postType === 'link'}
          />
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive">{error.message}</p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending} disabled={!title.trim() || !communityId}>
            Post
          </Button>
        </div>
      </form>
    </Modal>
  );
}
