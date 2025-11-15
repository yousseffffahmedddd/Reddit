import type { Community } from '../types'

type LeftSidebarProps = {
  communities: Community[]
  joinedCommunityIds: string[]
  onSelectHome: () => void
  onSelectCommunity: (communityId: string) => void
  onOpenCreatePost: () => void
}

export function LeftSidebar({ communities, joinedCommunityIds, onSelectHome, onSelectCommunity, onOpenCreatePost }: LeftSidebarProps) {
  const myCommunities = communities.filter((community) => joinedCommunityIds.includes(community.id))

  return (
    <aside className="sticky top-24 hidden h-[calc(100vh-6rem)] w-64 flex-shrink-0 flex-col gap-4 overflow-y-auto rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm lg:flex">
      <nav className="space-y-2 text-sm font-medium text-slate-600">
        <button className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 transition hover:bg-slate-100" onClick={onSelectHome}>
          🏠 Home
        </button>
        <button className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 transition hover:bg-slate-100" onClick={onOpenCreatePost}>
          ✏️ Create Post
        </button>
      </nav>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">My Communities</p>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          {myCommunities.length === 0 && <li className="text-slate-400">Not following any yet</li>}
          {myCommunities.map((community) => (
            <li key={community.id}>
              <button className="flex w-full items-center justify-between rounded-xl px-3 py-2 transition hover:bg-slate-100" onClick={() => onSelectCommunity(community.id)}>
                <span>{community.name}</span>
                <span className="text-xs text-slate-400">{Math.round(community.members / 1000)}k</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
