import Image from 'next/image'
import type { RankTier } from '@/lib/regiment-data'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/*  Rank insignia — gold stars for officers, chevrons for NCOs         */
/* ------------------------------------------------------------------ */

type Insignia = { kind: 'star' | 'chevron' | 'bar'; count: number }

const RANK_INSIGNIA: Record<RankTier, Insignia> = {
  general: { kind: 'star', count: 5 },
  colonel: { kind: 'star', count: 5 },
  major: { kind: 'star', count: 4 },
  'chef-bataillon': { kind: 'star', count: 3 },
  capitaine: { kind: 'star', count: 3 },
  lieutenant: { kind: 'star', count: 2 },
  'sous-lieutenant': { kind: 'star', count: 1 },
  'adjudant-chef': { kind: 'bar', count: 3 },
  adjudant: { kind: 'bar', count: 2 },
  'sergent-major': { kind: 'chevron', count: 3 },
  sergent: { kind: 'chevron', count: 2 },
  caporal: { kind: 'chevron', count: 1 },
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.2l2.7 5.9 6.4.7-4.8 4.3 1.3 6.3L12 16.9 6.4 19.7l1.3-6.3L2.9 8.8l6.4-.7z" />
    </svg>
  )
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 12" className={className} fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M2 10L12 3l10 7" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function RankInsignia({
  tier,
  size = 'md',
  className,
}: {
  tier: RankTier
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const insignia = RANK_INSIGNIA[tier]
  const dims = size === 'lg' ? 'size-4' : size === 'sm' ? 'size-2.5' : 'size-3'
  const chevW = size === 'lg' ? 'w-4' : size === 'sm' ? 'w-2.5' : 'w-3'

  return (
    <span
      className={cn('inline-flex items-center gap-0.5 text-gold', className)}
      aria-label={`Rank insignia: ${insignia.count} ${insignia.kind}`}
    >
      {insignia.kind === 'star' &&
        Array.from({ length: insignia.count }).map((_, i) => <Star key={i} className={dims} />)}
      {insignia.kind === 'chevron' &&
        Array.from({ length: insignia.count }).map((_, i) => <Chevron key={i} className={cn(chevW, 'h-auto')} />)}
      {insignia.kind === 'bar' &&
        Array.from({ length: insignia.count }).map((_, i) => (
          <span key={i} className={cn('block h-0.5 rounded-full bg-gold', size === 'lg' ? 'w-4' : 'w-3')} />
        ))}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Bicorne — Napoleon's dress hat, worn fore-and-aft with a cockade   */
/* ------------------------------------------------------------------ */

export function Bicorne({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 24"
      className={cn('text-gold', className)}
      fill="none"
      aria-hidden="true"
    >
      {/* Hat body — a low crescent rising to two peaks */}
      <path
        d="M2 17.5C6.5 5.5 18.5 3.5 24 9.5C29.5 3.5 41.5 5.5 46 17.5C46.4 18.6 45.4 19.6 44.3 19.3C37.5 17.5 30.5 16.7 24 16.7C17.5 16.7 10.5 17.5 3.7 19.3C2.6 19.6 1.6 18.6 2 17.5Z"
        fill="currentColor"
      />
      {/* Gold trim along the upper edge */}
      <path
        d="M2 17.5C6.5 5.5 18.5 3.5 24 9.5C29.5 3.5 41.5 5.5 46 17.5"
        stroke="var(--background)"
        strokeOpacity="0.35"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Tricolour cockade */}
      <circle cx="10" cy="11" r="2.4" fill="var(--crimson)" stroke="currentColor" strokeWidth="0.7" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Decorative gold hairline with a small diamond / star at centre     */
/* ------------------------------------------------------------------ */

export function LaurelDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)} aria-hidden="true">
      <span className="gold-hairline flex-1" />
      <Star className="size-3 shrink-0 text-gold" />
      <span className="gold-hairline flex-1" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Small standalone star accent                                       */
/* ------------------------------------------------------------------ */

export function StarAccent({ className }: { className?: string }) {
  return <Star className={cn('text-gold', className)} />
}

/* ------------------------------------------------------------------ */
/*  Ornate star-and-laurel section divider (57e_star_divider.png)      */
/* ------------------------------------------------------------------ */

export function StarDivider({ className }: { className?: string }) {
  return (
    <Image
      src="/57e_star_divider.png"
      alt=""
      width={558}
      height={46}
      aria-hidden="true"
      className={cn('h-auto max-h-14 w-full object-contain opacity-90', className)}
    />
  )
}
