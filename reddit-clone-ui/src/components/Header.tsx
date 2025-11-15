import type { ChangeEvent } from 'react'

type HeaderProps = {
  searchTerm: string
  onSearchChange: (value: string) => void
  onOpenCreatePost: () => void
  onNavigateHome: () => void
  onNavigateProfile: () => void
}

export function Header({ searchTerm, onSearchChange, onOpenCreatePost, onNavigateHome, onNavigateProfile }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <button className="flex items-center gap-2" onClick={onNavigateHome}>
          <span className="text-2xl">🤖</span>
          <div>
            <p className="text-base font-bold leading-none text-slate-900">Reddit Remix</p>
            <p className="text-xs uppercase tracking-wide text-slate-500">UI prototype</p>
          </div>
        </button>
        <div className="flex-1">
          <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500 focus-within:border-brand">
            <span>🔍</span>
            <input
              type="search"
              placeholder="Search posts or communities"
              value={searchTerm}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </label>
        </div>
        <button
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
          onClick={onOpenCreatePost}
        >
          Create Post
        </button>
        <button
          className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
          onClick={onNavigateProfile}
        >
          <span>u/you</span>
          <span className="text-lg">🧑‍🚀</span>
        </button>
      </div>
    </header>
  )
}
