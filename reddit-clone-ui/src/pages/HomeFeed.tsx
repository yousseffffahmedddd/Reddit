import { PostCard } from '../components/PostCard'
import type { Community, Post } from '../types'

type HomeFeedProps = {
  posts: Post[]
  communities: Community[]
  onSelectPost: (post: Post) => void
  onSelectCommunity: (communityId: string) => void
  onVote: (postId: string, votes: number) => void
}

export function HomeFeed({ posts, communities, onSelectPost, onSelectCommunity, onVote }: HomeFeedProps) {
  const communityLabel = Object.fromEntries(communities.map((community) => [community.id, community.name]))

  return (
    <div className="space-y-4">
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
          No posts match the current filters.
        </div>
      )}
    </div>
  )
}
