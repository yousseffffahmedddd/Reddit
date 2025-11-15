import type { Comment } from '../types'

type CommentListProps = {
  comments: Comment[]
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return <p className="text-sm text-slate-500">No comments yet. Be the first to share a thought.</p>
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment) => (
        <li key={comment.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">u/{comment.author}</span>
            <span>•</span>
            <span>{comment.createdAt}</span>
          </div>
          <p className="mt-2 text-sm text-slate-700">{comment.body}</p>
        </li>
      ))}
    </ul>
  )
}
