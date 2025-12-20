'use client';

import { useState } from 'react';
import { Image, Link2, FileText, ChevronDown } from 'lucide-react';
import { Button, Input, Textarea, Modal, Avatar } from '@/components/ui';
import { useCreatePost, useJoinedCommunities, useUpdatePost } from '@/hooks';
import type { PostType } from '@/types';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://44.192.94.63:3000';

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

export function CreatePostModal({
                                    isOpen,
                                    onClose,
                                    defaultCommunityId,
                                    initialData,
                                }: CreatePostModalProps) {

    /* =====================================================
       🔴 CHANGE #1
       Store selected image as a File (NOT uploading yet)
       and a local preview URL
    ===================================================== */
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isCommunitySelectorOpen, setIsCommunitySelectorOpen] = useState(false);

    const [postType, setPostType] = useState<PostType>(
        initialData?.type || 'text'
    );
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [linkUrl, setLinkUrl] = useState(initialData?.linkUrl || '');
    const [communityId, setCommunityId] = useState(
        initialData?.communityId || defaultCommunityId || ''
    );

    const { data: communitiesData } = useJoinedCommunities();
    const { mutate: createPost, isPending: isCreating, error: createError } =
        useCreatePost();
    const { mutate: updatePost, isPending: isUpdating, error: updateError } =
        useUpdatePost();

    const communities = communitiesData?.data || [];
    const isEditMode = !!initialData?.id;
    const isPending = isCreating || isUpdating;
    const error = createError || updateError;
    const selectedCommunity = communities.find((c) => c.id === communityId);

    /* =====================================================
       🔴 CHANGE #2
       Upload image ONLY inside submit handler
    ===================================================== */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !communityId) return;

        let uploadedImageUrl: string | undefined;

        if (postType === 'image' && imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);

            const res = await fetch(
                `${API_BASE_URL}/apis/Postapi/upload`,
                { method: 'POST', body: formData }
            );

            if (!res.ok) {
                console.error('Image upload failed');
                return;
            }

            const data = await res.json();
            uploadedImageUrl = data.imageUrl;
        }

        const payload = {
            title: title.trim(),
            content: postType === 'text' ? content.trim() : undefined,
            type: postType,
            imageUrl: uploadedImageUrl,
            linkUrl: postType === 'link' ? linkUrl.trim() : undefined,
            communityId,
        };

        if (isEditMode) {
            updatePost(
                { postId: initialData!.id!, ...payload },
                { onSuccess: handleClose }
            );
        } else {
            createPost(payload, { onSuccess: handleClose });
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    /* =====================================================
       🔴 CHANGE #3
       Reset image file & preview so canceled posts
       do not leave orphan images
    ===================================================== */
    const resetForm = () => {
        setTitle('');
        setContent('');
        setLinkUrl('');
        setPostType('text');
        setCommunityId(defaultCommunityId || '');
        setImageFile(null);
        setImagePreview('');
    };

    const postTypes = [
        { type: 'text' as PostType, icon: FileText, label: 'Post' },
        { type: 'image' as PostType, icon: Image, label: 'Image' },
        { type: 'link' as PostType, icon: Link2, label: 'Link' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Post" className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-3">

                <div className="relative">
                    <button
                        type="button"
                        className="w-full rounded border border-border bg-card px-3 py-2 text-sm text-left flex items-center justify-between"
                        onClick={() => setIsCommunitySelectorOpen(!isCommunitySelectorOpen)}
                        aria-haspopup="listbox"
                        aria-expanded={isCommunitySelectorOpen}
                    >
                        {selectedCommunity ? (
                            <div className="flex items-center gap-2">
                                <Avatar src={selectedCommunity.iconUrl} alt={selectedCommunity.name} size="xs" />
                                <span>r/{selectedCommunity.name}</span>
                            </div>
                        ) : (
                            <span>Choose a community</span>
                        )}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </button>
                    {isCommunitySelectorOpen && (
                        <ul
                            className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto"
                            tabIndex={-1}
                            role="listbox"
                        >
                            <li
                                className="px-3 py-2 hover:bg-muted cursor-pointer flex items-center gap-2"
                                onClick={() => {
                                    setCommunityId('');
                                    setIsCommunitySelectorOpen(false);
                                }}
                            >
                                <span>Choose a community</span>
                            </li>
                            {communities.map((c) => (
                                <li
                                    key={c.id}
                                    className="px-3 py-2 hover:bg-muted cursor-pointer flex items-center gap-2"
                                    onClick={() => {
                                        setCommunityId(c.id);
                                        setIsCommunitySelectorOpen(false);
                                    }}
                                    role="option"
                                    aria-selected={communityId === c.id}
                                >
                                    <Avatar src={c.iconUrl} alt={c.name} size="xs" />
                                    <span>r/{c.name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Tabs - Reddit style */}
                <div className="flex border-b border-border">
                    {postTypes.map(({ type, icon: Icon, label }) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setPostType(type)}
                            className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-bold transition-colors ${
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
                <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={300}
                    required
                />

                {/* Text */}
                {postType === 'text' && (
                    <Textarea
                        placeholder="Text (optional)"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
                    />
                )}

                {/* =====================================================
            🔴 CHANGE #4
            Image selection ONLY sets local preview
        ===================================================== */}
                {postType === 'image' && (
                    <div className="space-y-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                setImageFile(file);
                                setImagePreview(URL.createObjectURL(file));
                            }}
                            className="w-full rounded border border-border bg-card px-3 py-2 text-sm"
                        />

                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-h-64 rounded object-contain"
                            />
                        )}
                    </div>
                )}

                {/* Link */}
                {postType === 'link' && (
                    <Input
                        placeholder="URL"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        type="url"
                        required
                    />
                )}

                {error && <p className="text-sm text-destructive">{error.message}</p>}

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                    <Button type="button" variant="outline" onClick={onClose} size="sm">
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isPending} size="sm">
                        Post
                    </Button>
                </div>
            </form>
        </Modal>
    );
}