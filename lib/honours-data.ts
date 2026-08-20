import nobilityData from '@/data/nobility.json'
import grandbattlesData from '@/data/grandbattles.json'
import venerationsData from '@/data/venerations.json'

export type HonourType = 'nobility' | 'grandbattle' | 'veneration'

export interface HonourAward {
  username: string
  profileLink: string
  type: HonourType
  /** Display badge text, e.g. "Baron", "Rank 1", "Rank 12". */
  label: string
  status: string
  date: string
}

const nobility: HonourAward[] = (nobilityData as Array<Omit<HonourAward, 'type'> & { order: string }>).map((r) => ({
  username: r.username,
  profileLink: r.profileLink,
  type: 'nobility' as const,
  label: r.label,
  status: r.status,
  date: r.date,
}))

const grandbattles = grandbattlesData as HonourAward[]
const venerations = venerationsData as HonourAward[]

const allHonours: HonourAward[] = [...nobility, ...grandbattles, ...venerations]

/** Finds every Nobility/Grand Battle/Veneration award for a player by Roblox username (case-insensitive). */
export function findHonoursByUsername(name: string): HonourAward[] {
  const target = name.trim().toLowerCase()
  if (!target) return []
  return allHonours.filter((h) => h.username.trim().toLowerCase() === target)
}

/** Tailwind classes for each honour type's badge, per regiment styling. */
export const HONOUR_BADGE_STYLES: Record<HonourType, string> = {
  nobility: 'border-purple-400/30 bg-purple-400/10 text-purple-300',
  grandbattle: 'border-blue-400/30 bg-blue-400/10 text-blue-300',
  veneration: 'border-red-400/30 bg-red-400/10 text-red-300',
}

export const HONOUR_TYPE_LABELS: Record<HonourType, string> = {
  nobility: 'Nobility',
  grandbattle: 'Grand Battle',
  veneration: 'Vénération',
}
