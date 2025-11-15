type JoinLeaveButtonProps = {
  joined: boolean
  onToggle: () => void
}

export function JoinLeaveButton({ joined, onToggle }: JoinLeaveButtonProps) {
  return (
    <button
      className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
        joined
          ? 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200'
          : 'border-brand bg-brand text-white hover:bg-brand-dark'
      }`}
      onClick={onToggle}
    >
      {joined ? 'Joined' : 'Join'}
    </button>
  )
}
