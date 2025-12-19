'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon, FileText, Users, Hash } from 'lucide-react';
import Link from 'next/link';
import { cn, formatNumber } from '@/lib/utils';
import { Avatar, Loader, Input } from '@/components/ui';
import { PostCard } from '@/components/post';
import { useSearch } from '@/hooks';

type SearchType = 'all' | 'posts' | 'communities' | 'users';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<SearchType>('all');

  const { data: results, isLoading } = useSearch(query, type === 'all' ? undefined : type);

  const tabs: { id: SearchType; label: string; icon: typeof FileText }[] = [
    { id: 'all', label: 'All', icon: SearchIcon },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'communities', label: 'Communities', icon: Hash },
    { id: 'users', label: 'People', icon: Users },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-2xl font-bold">Search</h1>

      {/* Search input */}
      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search posts, communities, and users"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <div className="mb-4 flex border-b">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setType(id)}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors',
              type === id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Results */}
      {query.length < 2 ? (
        <div className="rounded-md border bg-card p-8 text-center">
          <SearchIcon className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">Enter at least 2 characters to search</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-8">
          <Loader text="Searching..." />
        </div>
      ) : results ? (
        <div className="space-y-4">
          {/* Communities */}
          {(type === 'all' || type === 'communities') && results.communities.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">Communities</h2>
              <div className="space-y-2">
                {results.communities.map((community) => (
                  <Link
                    key={community.id}
                    href={`/r/${community.name}`}
                    className="flex items-center gap-3 rounded-md border bg-card p-3 hover:bg-muted"
                  >
                    <Avatar src={community.iconUrl} alt={community.name} />
                    <div>
                      <p className="font-medium">r/{community.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatNumber(community.memberCount)} members
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Users */}
          {(type === 'all' || type === 'users') && results.users.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">People</h2>
              <div className="space-y-2">
                {results.users.map((user) => (
                  <Link
                    key={user.id}
                    href={`/u/${user.username}`}
                    className="flex items-center gap-3 rounded-md border bg-card p-3 hover:bg-muted"
                  >
                    <Avatar src={user.avatarUrl} alt={user.username} />
                    <div>
                      <p className="font-medium">{user.displayName}</p>
                      <p className="text-sm text-muted-foreground">
                        u/{user.username} • {formatNumber(user.karma)} karma
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Posts */}
          {(type === 'all' || type === 'posts') && results.posts.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">Posts</h2>
              <div className="space-y-3">
                {results.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {results.communities.length === 0 &&
            results.users.length === 0 &&
            results.posts.length === 0 && (
              <div className="rounded-md border bg-card p-8 text-center">
                <p className="text-muted-foreground">No results found for &quot;{query}&quot;</p>
              </div>
            )}
        </div>
      ) : null}
    </div>
  );
}
