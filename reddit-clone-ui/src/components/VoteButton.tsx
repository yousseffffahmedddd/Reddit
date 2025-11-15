import { useEffect, useState } from 'react'

type VoteButtonProps = {
  initialVotes: number
  onVote?: (votes: number) => void
}

type Direction = -1 | 0 | 1

export function VoteButton({ initialVotes, onVote }: VoteButtonProps) {
  const [direction, setDirection] = useState<Direction>(0)
  const [displayVotes, setDisplayVotes] = useState(initialVotes)

  useEffect(() => {
    setDisplayVotes(initialVotes + direction)
  }, [initialVotes, direction])

  const handleVote = (next: Direction) => {
    setDirection((current: Direction) => {
      const updated = current === next ? 0 : next
      const optimisticVotes = initialVotes + updated
      setDisplayVotes(optimisticVotes)
      onVote?.(optimisticVotes)
      return updated
    })
  }

  return (
    <div className="flex flex-col items-center rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-600">
      <button
        className={`rounded-full p-1 transition hover:bg-slate-200 ${direction === 1 ? 'text-brand' : ''}`}
        onClick={() => handleVote(1)}
      >
        ▲
      </button>
      <span className="px-1 text-slate-800">{displayVotes}</span>
      <button
        className={`rounded-full p-1 transition hover:bg-slate-200 ${direction === -1 ? 'text-brand' : ''}`}
        onClick={() => handleVote(-1)}
      >
        ▼
      </button>
    </div>
  )
}
