import { useState } from 'react'
import type { Post } from '../types'
import { VoteButton } from './VoteButton'

type PostCardProps = {
  post: Post
  communityName: string
  onSelectPost: (post: Post) => void
  onSelectCommunity?: (communityId: string) => void
  onVote: (postId: string, votes: number) => void
}

export function PostCard({ post, communityName, onSelectPost, onSelectCommunity, onVote }: PostCardProps) {
  const [showSummary, setShowSummary] = useState(false)

  return (
    <article className="flex gap-4 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <VoteButton initialVotes={post.votes} onVote={(votes) => onVote(post.id, votes)} />
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <button
            className="font-semibold hover:text-brand"
            onClick={() => onSelectCommunity?.(post.communityId)}
            disabled={!onSelectCommunity}
          >
            {communityName}
          </button>
          <span>•</span>
          <span>Posted by u/{post.author}</span>
          <span>•</span>
          <span>{post.createdAt}</span>
        </div>
        <h3 className="mt-2 cursor-pointer text-xl font-semibold text-slate-900" onClick={() => onSelectPost(post)}>
          {post.title}
        </h3>
        <p className="mt-1 line-clamp-3 text-slate-600">{post.body}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <button className="rounded-full bg-slate-100 px-3 py-1 hover:bg-slate-200" onClick={() => onSelectPost(post)}>
            💬 {post.commentsCount} comments
          </button>
          <button
            className={`rounded-full px-3 py-1 transition ${showSummary ? 'bg-brand text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
            onClick={() => setShowSummary((prev) => !prev)}
          >
            {showSummary ? 'Hide summary' : 'Summarize'}
          </button>
          {showSummary && (
            <span className="text-xs text-slate-500">
              TL;DR: {post.body.slice(0, 80)}...
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
