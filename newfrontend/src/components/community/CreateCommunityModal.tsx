'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera } from 'lucide-react';
import { Button, Input, Textarea, Modal } from '@/components/ui';
import { createCommunity, uploadCommunityIcon } from '@/apis/communityApi';
import { getUserId } from '@/apis/authApi';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCommunityModal({ isOpen, onClose }: CreateCommunityModalProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const handleIconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Please use JPEG, PNG, GIF, or WebP.');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('File too large. Maximum size is 5MB.');
        return;
      }
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Community name is required');
      return;
    }

    // Validate name format (lowercase, no spaces, alphanumeric with underscores)
    const nameRegex = /^[a-zA-Z0-9_]+$/;
    if (!nameRegex.test(name)) {
      setError('Community name can only contain letters, numbers, and underscores');
      return;
    }

    if (name.length < 3) {
      setError('Community name must be at least 3 characters');
      return;
    }

    if (name.length > 21) {
      setError('Community name cannot exceed 21 characters');
      return;
    }

    const userId = getUserId();
    if (!userId) {
      setError('You must be logged in to create a community');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create the community first
      const newCommunity = await createCommunity({
        name,
        description: description || undefined,
        userId,
      });

      // Upload icon if selected
      if (iconFile) {
        try {
          await uploadCommunityIcon(newCommunity._id, userId, iconFile);
        } catch (iconError) {
          console.error('Failed to upload icon:', iconError);
          // Continue even if icon upload fails
        }
      }

      handleClose();
      router.push(`/r/${newCommunity.name}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create community');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setError(null);
    setIsLoading(false);
    setIconFile(null);
    setIconPreview(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create a Community">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Community Icon */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-foreground">
            Community Icon (optional)
          </label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-muted">
                {iconPreview ? (
                  <img
                    src={iconPreview}
                    alt="Community icon preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xl font-bold text-muted-foreground">
                    {name ? name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => iconInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity hover:opacity-100"
              >
                <Camera className="h-5 w-5 text-white" />
              </button>
            </div>
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => iconInputRef.current?.click()}
              >
                {iconPreview ? 'Change Icon' : 'Upload Icon'}
              </Button>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG, GIF or WebP. Max 5MB.
              </p>
            </div>
            <input
              ref={iconInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleIconSelect}
              className="hidden"
            />
          </div>
        </div>

        <div>
          <label htmlFor="community-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-foreground">
            Name
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              r/
            </span>
            <Input
              id="community-name"
              placeholder="community_name"
              value={name}
              onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s/g, '_'))}
              className="pl-8"
              maxLength={21}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Community names cannot be changed after creation
          </p>
        </div>

        <div>
          <label htmlFor="community-description" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-foreground">
            Description (optional)
          </label>
          <Textarea
            id="community-description"
            placeholder="What is your community about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {error && (
          <div className="rounded border border-destructive/20 bg-destructive/10 p-2.5 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button type="button" variant="outline" onClick={handleClose} size="sm">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !name.trim()} size="sm">
            {isLoading ? 'Creating...' : 'Create Community'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
