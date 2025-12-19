'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea, Modal } from '@/components/ui';
import { createCommunity } from '@/apis/communityApi';
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
      const newCommunity = await createCommunity({
        name,
        description: description || undefined,
        userId,
      });

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
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create a Community">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="community-name" className="mb-1 block text-sm font-medium">
            Name
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
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
          <label htmlFor="community-description" className="mb-1 block text-sm font-medium">
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
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !name.trim()}>
            {isLoading ? 'Creating...' : 'Create Community'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
