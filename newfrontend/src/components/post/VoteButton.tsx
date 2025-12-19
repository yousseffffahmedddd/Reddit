'use client';

import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { cn, formatNumber, getScoreColor } from '@/lib/utils';
import type { VoteValue, VoteTargetType } from '@/types';
import { useVote } from '@/hooks';

interface VoteButtonProps {
  targetId: string;
  targetType: VoteTargetType;
  upvotes: number;
  downvotes: number;
  userVote: VoteValue;
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md';
}

export function VoteButton({
  targetId,
  targetType,
  upvotes,
  downvotes,
  userVote,
  orientation = 'vertical',
  size = 'md',
}: VoteButtonProps) {
  const { mutate: vote, isPending } = useVote();

  const score = upvotes - downvotes;
  const scoreColor = getScoreColor(score);

  const handleVote = (value: VoteValue) => {
    // Toggle off if clicking the same vote
    const newValue = userVote === value ? 0 : value;
    vote({ targetId, targetType, value: newValue });
  };

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const buttonPadding = size === 'sm' ? 'p-0.5' : 'p-1';

  return (
    <div
      className={cn(
        'flex items-center',
        orientation === 'vertical' ? 'flex-col gap-0' : 'flex-row gap-1'
      )}
      data-testid="vote-button"
    >
      <button
        onClick={() => handleVote(1)}
        disabled={isPending}
        className={cn(
          'vote-button rounded hover:bg-hover',
          buttonPadding,
          userVote === 1 ? 'text-upvote' : 'text-muted-foreground hover:text-upvote'
        )}
        aria-label="Upvote"
      >
        <ArrowBigUp className={cn(iconSize, userVote === 1 && 'fill-current')} />
      </button>

      <span
        className={cn(
          'min-w-[2ch] text-center text-xs font-bold leading-none',
          size === 'md' && 'text-xs',
          userVote === 1 ? 'text-upvote' : userVote === -1 ? 'text-downvote' : 'text-foreground'
        )}
      >
        {formatNumber(score)}
      </span>

      <button
        onClick={() => handleVote(-1)}
        disabled={isPending}
        className={cn(
          'vote-button rounded hover:bg-hover',
          buttonPadding,
          userVote === -1 ? 'text-downvote' : 'text-muted-foreground hover:text-downvote'
        )}
        aria-label="Downvote"
      >
        <ArrowBigDown className={cn(iconSize, userVote === -1 && 'fill-current')} />
      </button>
    </div>
  );
}
