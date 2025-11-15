import { FormEvent, useState } from 'react'
import type { Community } from '../types'
import { Modal } from './Modal'

type CreatePostModalProps = {
  isOpen: boolean
  communities: Community[]
  onClose: () => void
  onCreate: (payload: { title: string; body: string; communityId: string }) => void
}

export function CreatePostModal({ isOpen, communities, onClose, onCreate }: CreatePostModalProps) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [communityId, setCommunityId] = useState(communities[0]?.id ?? '')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!title.trim() || !body.trim() || !communityId) return
    onCreate({ title: title.trim(), body: body.trim(), communityId })
    setTitle('')
    setBody('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Post">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-slate-600">
          Title
          <input
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-brand focus:outline-none"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Share something insightful..."
          />
        </label>
        <label className="block text-sm font-medium text-slate-600">
          Body
          <textarea
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-brand focus:outline-none"
            rows={4}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Tell the full story with mock data."
          />
        </label>
        <label className="block text-sm font-medium text-slate-600">
          Community
          <select
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-brand focus:outline-none"
            value={communityId}
            onChange={(event) => setCommunityId(event.target.value)}
          >
            {communities.map((community) => (
              <option key={community.id} value={community.id}>
                {community.name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex justify-end gap-3 text-sm font-semibold">
          <button type="button" className="rounded-full px-4 py-2 text-slate-500 hover:bg-slate-100" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="rounded-full bg-brand px-5 py-2 text-white hover:bg-brand-dark">
            Create
          </button>
        </div>
      </form>
    </Modal>
  )
}
