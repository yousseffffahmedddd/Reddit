import { FormEvent, useState } from 'react'
import { CommentList } from '../components/CommentList'
import { JoinLeaveButton } from '../components/JoinLeaveButton'
import { VoteButton } from '../components/VoteButton'
import type { Comment, Community, Post } from '../types'

type PostPageProps = {
  post: Post
  community: Community
  comments: Comment[]
  joined: boolean
  onToggleJoin: () => void
  onVote: (postId: string, votes: number) => void
  onAddComment: (postId: string, body: string) => void
}

export function PostPage({ post, community, comments, joined, onToggleJoin, onVote, onAddComment }: PostPageProps) {
  const [commentValue, setCommentValue] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!commentValue.trim()) return
    onAddComment(post.id, commentValue.trim())
    setCommentValue('')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Posted in {community.name}</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{post.title}</h1>
            <p className="mt-2 text-slate-600">{post.body}</p>
          </div>
          <div className="flex items-center gap-3">
            <VoteButton initialVotes={post.votes} onVote={(votes) => onVote(post.id, votes)} />
            <JoinLeaveButton joined={joined} onToggle={onToggleJoin} />
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Posted by u/{post.author} • {post.createdAt}
        </p>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-card">
        <h2 className="text-lg font-semibold text-slate-900">Comments ({comments.length})</h2>
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <textarea
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-brand focus:outline-none"
            rows={3}
            placeholder="Share your perspective"
            value={commentValue}
            onChange={(event) => setCommentValue(event.target.value)}
          />
          <div className="flex justify-end">
            <button type="submit" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
              Comment
            </button>
          </div>
        </form>
        <div className="mt-6">
          <CommentList comments={comments} />
        </div>
      </section>
    </div>
  )
}
