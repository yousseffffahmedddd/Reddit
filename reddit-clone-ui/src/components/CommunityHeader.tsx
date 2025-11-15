import type { Community } from '../types'
import { JoinLeaveButton } from './JoinLeaveButton'

type CommunityHeaderProps = {
  community: Community
  joined: boolean
  onToggleJoin: () => void
}

export function CommunityHeader({ community, joined, onToggleJoin }: CommunityHeaderProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">Community</p>
          <h2 className="text-2xl font-bold text-slate-900">{community.name}</h2>
          <p className="mt-1 text-slate-600">{community.description}</p>
          <p className="mt-2 text-sm text-slate-500">{(community.members / 1000).toFixed(1)}k members</p>
        </div>
        <JoinLeaveButton joined={joined} onToggle={onToggleJoin} />
      </div>
    </div>
  )
}
