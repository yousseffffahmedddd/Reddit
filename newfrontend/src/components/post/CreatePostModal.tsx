'use client';

import { useState } from 'react';
import { Image, Link2, FileText } from 'lucide-react';
import { Button, Input, Textarea, Modal } from '@/components/ui';
import { useCreatePost, useCommunities, useUpdatePost } from '@/hooks';
import type { PostType } from '@/types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCommunityId?: string;
  initialData?: {
    id?: string;
    title: string;
    content: string;
    type: PostType;
    imageUrl: string;
    linkUrl: string;
    communityId: string;
  };
}

export function CreatePostModal({ isOpen, onClose, defaultCommunityId, initialData }: CreatePostModalProps) {
  const [postType, setPostType] = useState<PostType>(initialData?.type || 'text');
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [linkUrl, setLinkUrl] = useState(initialData?.linkUrl || '');
  const [communityId, setCommunityId] = useState(initialData?.communityId || defaultCommunityId || '');

  const { data: communitiesData } = useCommunities();
  const { mutate: createPost, isPending: isCreating, error: createError } = useCreatePost();
  const { mutate: updatePost, isPending: isUpdating, error: updateError } = useUpdatePost();

  const communities = communitiesData?.data || [];

  const isEditMode = !!initialData?.id;
  const isPending = isCreating || isUpdating;
  const error = createError || updateError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !communityId) return;

    if (isEditMode) {
      updatePost(
        {
          postId: initialData!.id!,
          title: title.trim(),
          content: postType === 'text' ? content.trim() : undefined,
        },
        {
          onSuccess: () => {
            resetForm();
            onClose();
          },
        }
      );
    } else {
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
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setImageUrl('');
    setLinkUrl('');
    setPostType('text');
    setCommunityId(defaultCommunityId || '');
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
            disabled={isPending}
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
            disabled={isPending}
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
            disabled={isPending}
          />
        )}

        {postType === 'image' && (
          <div className="space-y-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append('image', file);
                    
                    try {
                      const response = await fetch('/apis/Postapi/upload', {
                        method: 'POST',
                        body: formData,
                      });
                      
                      if (response.ok) {
                        const data = await response.json();
                        setImageUrl(data.imageUrl);
                      } else {
                        console.error('Upload failed');
                      }
                    } catch (error) {
                      console.error('Upload error:', error);
                    }
                  }
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
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
