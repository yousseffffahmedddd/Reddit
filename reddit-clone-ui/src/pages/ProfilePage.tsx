import type { Community, Post, UserProfile } from '../types'
import { PostCard } from '../components/PostCard'

type ProfilePageProps = {
  user: UserProfile
  posts: Post[]
  communities: Community[]
  onSelectPost: (post: Post) => void
  onSelectCommunity: (communityId: string) => void
  onVote: (postId: string, votes: number) => void
}

export function ProfilePage({ user, posts, communities, onSelectPost, onSelectCommunity, onVote }: ProfilePageProps) {
  const communityLabel = Object.fromEntries(communities.map((community) => [community.id, community.name]))

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-card">
        <div className="flex flex-wrap items-center gap-4">
          <img src={user.avatar} alt={user.username} className="h-16 w-16 rounded-2xl object-cover" />
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Profile</p>
            <h1 className="text-3xl font-bold">u/{user.username}</h1>
            <p className="mt-1 text-slate-200">{user.bio}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-300">
          <span>Communities: {user.joinedCommunityIds.length}</span>
          <span>Posts shared: {posts.length}</span>
        </div>
      </section>
      <section className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            communityName={communityLabel[post.communityId] ?? 'Unknown'}
            onSelectPost={onSelectPost}
            onSelectCommunity={onSelectCommunity}
            onVote={onVote}
          />
        ))}
        {posts.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500">
            This profile has no posts yet.
          </div>
        )}
      </section>
    </div>
  )
}
