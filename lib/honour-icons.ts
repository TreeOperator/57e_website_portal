/**
 * Maps Veneration/Nobility/Grand Battle honour awards to their badge icon
 * in public/honours/, scraped from the French Empire Fandom wiki (see
 * scripts/fetch_honour_icons.py).
 */
import type { HonourAward } from '@/lib/honours-data'

const NOBILITY_ICONS: Record<string, string> = {
  duc: '/honours/nobility-duc.png',
  comte: '/honours/nobility-comte.png',
  baron: '/honours/nobility-baron.png',
  chevalier: '/honours/nobility-chevalier.png',
}

/** Extracts the numeric rank from a label like "Rank 12". */
function labelRank(label: string): number | null {
  const match = /(\d+)/.exec(label)
  return match ? Number(match[1]) : null
}

/** Returns a local icon path for a Nobility/Veneration/Grand Battle honour, or undefined if none is scraped. */
export function getHonourIconPath(honour: Pick<HonourAward, 'type' | 'label'>): string | undefined {
  if (honour.type === 'nobility') {
    return NOBILITY_ICONS[honour.label.trim().toLowerCase()]
  }
  if (honour.type === 'veneration') {
    const rank = labelRank(honour.label)
    if (rank && rank >= 1 && rank <= 12) {
      return `/honours/veneration-${rank}.png`
    }
  }
  if (honour.type === 'grandbattle') {
    const rank = labelRank(honour.label)
    if (rank && rank >= 1 && rank <= 4) {
      return `/honours/grandbattle-${rank}.png`
    }
  }
  return undefined
}
