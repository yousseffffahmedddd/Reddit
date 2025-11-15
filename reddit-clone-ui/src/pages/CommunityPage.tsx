import { CommunityHeader } from '../components/CommunityHeader'
import { PostCard } from '../components/PostCard'
import type { Community, Post } from '../types'

type CommunityPageProps = {
  community: Community
  posts: Post[]
  joined: boolean
  onToggleJoin: () => void
  onSelectPost: (post: Post) => void
  onVote: (postId: string, votes: number) => void
}

export function CommunityPage({ community, posts, joined, onToggleJoin, onSelectPost, onVote }: CommunityPageProps) {
  return (
    <div className="space-y-4">
      <CommunityHeader community={community} joined={joined} onToggleJoin={onToggleJoin} />
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          communityName={community.name}
          onSelectPost={onSelectPost}
          onVote={onVote}
        />
      ))}
      {posts.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500">
          This community has no posts yet.
        </div>
      )}
    </div>
  )
}
