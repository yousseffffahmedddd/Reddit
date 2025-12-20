'use client';

import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Flame, Clock, TrendingUp, Users, Calendar, Settings, Camera } from 'lucide-react';
import { cn, formatNumber, formatDate } from '@/lib/utils';
import { Avatar, Loader, ErrorMessage, Button, Modal, Input, Textarea } from '@/components/ui';
import { PostList } from '@/components/post';
import { useCommunity, useAuthStore, useJoinCommunity, useOwnedCommunities, useUpdateCommunity, useUploadCommunityIcon } from '@/hooks';
import type { Community, PostSortType } from '@/types';

const sortOptions: { value: PostSortType; label: string; icon: typeof Flame }[] = [
  { value: 'hot', label: 'Hot', icon: Flame },
  { value: 'new', label: 'New', icon: Clock },
  { value: 'top', label: 'Top', icon: TrendingUp },
];

export default function CommunityPage() {
  const params = useParams();
  const communityId = params.communityId as string;
  const [sort, setSort] = useState<PostSortType>('hot');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [selectedIconFile, setSelectedIconFile] = useState<File | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: community, isLoading, isError, error, refetch } = useCommunity(communityId);
  const { data: ownedCommunitiesData } = useOwnedCommunities();
  const { mutate: joinCommunity, isPending: isJoining } = useJoinCommunity();
  const { mutateAsync: updateCommunity, isPending: isUpdating } = useUpdateCommunity();
  const { mutateAsync: uploadCommunityIcon, isPending: isUploadingIcon } = useUploadCommunityIcon();

  // Check if current user is the owner of this community
  const ownedCommunities = ownedCommunitiesData?.data || [];
  const isOwner = community && ownedCommunities.some(c => c.id === community.id);

  const handleOpenEditModal = () => {
    if (community) {
      setEditDescription(community.description || '');
      setIconPreview(null);
      setSelectedIconFile(null);
      setSaveError(null);
    }
    setShowEditModal(true);
  };

  const handleIconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveCommunity = async () => {
    if (!community) return;

    setSaveError(null);

    try {
      // Upload icon if selected
      if (selectedIconFile) {
        console.log('Uploading icon for community:', community.id);
        await uploadCommunityIcon({ communityId: community.id, file: selectedIconFile });
        console.log('Icon uploaded successfully');
      }

      // Update description
      console.log('Updating community:', community.id, 'with description:', editDescription);
      await updateCommunity({ communityId: community.id, description: editDescription });
      console.log('Community updated successfully');

      setShowEditModal(false);
      setIconPreview(null);
      setSelectedIconFile(null);
      refetch();
    } catch (err) {
      console.error('Failed to save community:', err);
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes');
    }
  };

  const handleJoin = () => {
    if (community) {
      joinCommunity(community.id, {
        onSuccess: () => {
          // Optimistically update the community state
          queryClient.setQueryData(['community', communityId], (old: Community | undefined) => {
            if (!old) return old;
            return { ...old, isJoined: !old.isJoined };
          });
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader text="Loading community..." />
      </div>
    );
  }

  if (isError || !community) {
    return (
      <ErrorMessage
        title="Community not found"
        message={error?.message || 'This community does not exist or has been removed.'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div>
      {/* Banner */}
      {/* TODO: Community banner upload not implemented in backend
          When backend supports it, add ImageUpload component here for admins */}
      {community.bannerUrl ? (
        <div
          className="-mx-4 -mt-4 h-32 bg-cover bg-center md:h-48"
          style={{ backgroundImage: `url(${community.bannerUrl})` }}
        />
      ) : (
        <div className="-mx-4 -mt-4 h-24 bg-gradient-to-r from-primary to-orange-400" />
      )}

      {/* Community header */}
      <div className="-mt-4 mb-4 rounded-md border bg-card p-4">
        <div className="flex items-start gap-4">
          {/* TODO: Community icon upload not implemented in backend
              When backend supports it, add ImageUpload component here for admins */}
          <Avatar src={community.iconUrl} alt={community.name} size="xl" className="-mt-10 border-4 border-card" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{community.displayName}</h1>
            <p className="text-sm text-muted-foreground">r/{community.name}</p>
          </div>
          <div className="flex gap-2">
            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenEditModal}
              >
                <Settings className="mr-2 h-4 w-4" />
                Manage
              </Button>
            )}
            {isAuthenticated && (
              <Button
                onClick={handleJoin}
                disabled={isJoining}
                variant={community.isJoined ? "secondary" : "default"}
              >
                {isJoining ? 'Joining...' : community.isJoined ? 'Joined' : 'Join'}
              </Button>
            )}
          </div>
        </div>

        <p className="mt-4 text-sm">{community.description}</p>

        <div className="mt-4 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formatNumber(community.memberCount)}</span>
            <span className="text-muted-foreground">Members</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Created {formatDate(community.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        {/* Sort tabs */}
        <div className="mb-4 flex items-center gap-2 rounded-md border bg-card p-2">
          {sortOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setSort(value)}
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                sort === value
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/50'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Posts */}
        <PostList communityId={communityId} sort={sort} />
      </div>

      {/* Edit Community Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Manage Community"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Community Name</label>
            <Input
              value={community.name}
              disabled
              className="bg-muted"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Community names cannot be changed
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Describe your community..."
              rows={4}
              maxLength={500}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {editDescription.length}/500 characters
            </p>
          </div>
          {/* Community Icon Upload */}
          <div>
            <label className="mb-2 block text-sm font-medium">Community Icon</label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-20 w-20 overflow-hidden rounded-full bg-muted">
                  {iconPreview || community.iconUrl ? (
                    <img
                      src={iconPreview || community.iconUrl || ''}
                      alt="Community icon"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl font-bold text-muted-foreground">
                      {community.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => iconInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity hover:opacity-100"
                >
                  <Camera className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => iconInputRef.current?.click()}
                >
                  Choose Image
                </Button>
                <p className="mt-1 text-xs text-muted-foreground">
                  Recommended: 256x256px, PNG or JPG
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
          {saveError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {saveError}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveCommunity}
              disabled={isUpdating || isUploadingIcon}
            >
              {isUpdating || isUploadingIcon ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
