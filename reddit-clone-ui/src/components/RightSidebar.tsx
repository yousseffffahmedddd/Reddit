import type { Community } from '../types'

type RightSidebarProps = {
  trendingCommunities: Community[]
}

export function RightSidebar({ trendingCommunities }: RightSidebarProps) {
  return (
    <aside className="sticky top-24 hidden h-[calc(100vh-6rem)] w-72 flex-shrink-0 flex-col gap-6 overflow-y-auto rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm xl:flex">
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Trending communities</h3>
        <ul className="mt-3 space-y-3">
          {trendingCommunities.map((community, index) => (
            <li key={community.id} className="flex items-center gap-3">
              <span className="text-lg font-semibold text-slate-400">#{index + 1}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{community.name}</p>
                <p className="text-xs text-slate-500">{(community.members / 1000).toFixed(1)}k members</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-2xl bg-slate-900 p-5 text-white">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">About</p>
        <p className="mt-2 text-lg font-semibold">Prototype UI</p>
        <p className="mt-1 text-sm text-slate-200">This experience uses mock data only — perfect for showcasing flows without a backend.</p>
      </section>
    </aside>
  )
}
