'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Award, FileText, MessageSquare, Bookmark } from 'lucide-react';
import { cn, formatNumber, formatDate } from '@/lib/utils';
import { Avatar, Loader, ErrorMessage, Button } from '@/components/ui';
import { PostList } from '@/components/post';
import { useUser } from '@/hooks';

type Tab = 'posts' | 'comments' | 'saved';

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [activeTab, setActiveTab] = useState<Tab>('posts');

  const { data: user, isLoading, isError, error, refetch } = useUser(username);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader text="Loading profile..." />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <ErrorMessage
        title="User not found"
        message={error?.message || 'This user does not exist.'}
        onRetry={() => refetch()}
      />
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof FileText }[] = [
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'saved', label: 'Saved', icon: Bookmark },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      {/* Profile header */}
      <div className="mb-6 rounded-md border bg-card p-6">
        <div className="flex items-start gap-6">
          <Avatar src={user.avatarUrl} alt={user.username} size="xl" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.displayName}</h1>
            <p className="text-muted-foreground">u/{user.username}</p>
            {user.bio && <p className="mt-2 text-sm">{user.bio}</p>}
          </div>
          <Button variant="outline">Follow</Button>
        </div>

        <div className="mt-6 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <span className="font-medium">{formatNumber(user.karma)}</span>
            <span className="text-muted-foreground">Karma</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Cake day {formatDate(user.cakeDay)}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex border-b">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors',
              activeTab === id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-2xl">
        {activeTab === 'posts' && <PostList userId={user.id} />}
        {activeTab === 'comments' && (
          <div className="rounded-md border bg-card p-8 text-center">
            <p className="text-muted-foreground">User comments will appear here</p>
          </div>
        )}
        {activeTab === 'saved' && (
          <div className="rounded-md border bg-card p-8 text-center">
            <p className="text-muted-foreground">Saved posts are private</p>
          </div>
        )}
      </div>
    </div>
  );
}
