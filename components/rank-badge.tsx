import { parseRank } from '@/lib/rank-icons'
import { cn } from '@/lib/utils'

/**
 * Renders a rank string (e.g. "A0. Conscrit"). If an insignia PNG is
 * registered for the rank's tier code, shows the icon + rank name;
 * otherwise falls back to the raw rank text unchanged.
 */
export function RankBadge({
  rank,
  className,
  iconClassName,
}: {
  rank: string
  className?: string
  /** Override the icon's size/vertical offset. Defaults to matching the surrounding text's line height. */
  iconClassName?: string
}) {
  const { icon, label } = parseRank(rank)

  if (!icon) {
    return <span className={className}>{rank}</span>
  }

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <img
        src={icon}
        alt={label}
        className={cn('h-[2em] w-[2em] shrink-0 object-contain', iconClassName)}
      />
      <span>{label}</span>
    </span>
  )
}
