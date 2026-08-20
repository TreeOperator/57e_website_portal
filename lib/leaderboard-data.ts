import { allActivityRows, type ActivityRow } from '@/lib/roster-data'
import { findMedalsByUsername } from '@/lib/medals-data'

const GRADE_VALUES: Record<string, number> = {
  'F': 0,
  'D-': 1, 'D': 2, 'D+': 3,
  'C-': 4, 'C': 5, 'C+': 6,
  'B-': 7, 'B': 8, 'B+': 9,
  'A-': 10, 'A': 11, 'A+': 12,
}

/** Parses a numeric-ish string (handles "%", commas, blanks) into a number, or 0 if unparseable. */
function toNumber(value: string | undefined): number {
  if (!value) return 0
  const cleaned = value.replace(/[%,]/g, '').trim()
  const n = Number.parseFloat(cleaned)
  return Number.isFinite(n) ? n : 0
}

function gradeValue(grade: string | undefined): number {
  if (!grade) return -1
  return GRADE_VALUES[grade.trim().toUpperCase()] ?? -1
}

export interface LeaderboardRow extends ActivityRow {
  medalsCount: number
  gradeValue: number
}

/** All active (non-vacant) players with their activity stats and medal counts, ready for ranking. */
export const leaderboardRows: LeaderboardRow[] = allActivityRows
  .filter((r) => r.name.trim().length > 0)
  .map((r) => ({
    ...r,
    medalsCount: findMedalsByUsername(r.name).length,
    gradeValue: gradeValue(r.grade),
  }))

export interface LeaderboardMetric {
  key: string
  label: string
  /** Extracts the sortable numeric value for a row. */
  value: (row: LeaderboardRow) => number
  /** Formats the value for display. */
  format: (row: LeaderboardRow) => string
}

export const LEADERBOARD_METRICS: LeaderboardMetric[] = [
  {
    key: 'kpe',
    label: 'KPE',
    value: (r) => toNumber(r.kpe),
    format: (r) => r.kpe || '0',
  },
  {
    key: 'kills',
    label: 'Kills',
    value: (r) => toNumber(r.kills),
    format: (r) => r.kills || '0',
  },
  {
    key: 'kdr',
    label: 'KDR',
    value: (r) => toNumber(r.kdr),
    format: (r) => r.kdr || '0',
  },
  {
    key: 'points',
    label: 'Points',
    value: (r) => toNumber(r.points),
    format: (r) => r.points || '0',
  },
  {
    key: 'activityPct',
    label: 'Activity %',
    value: (r) => toNumber(r.activityPct),
    format: (r) => r.activityPct || '0%',
  },
  {
    key: 'grade',
    label: 'Grade',
    value: (r) => r.gradeValue,
    format: (r) => r.grade || '—',
  },
  {
    key: 'medals',
    label: 'Medals',
    value: (r) => r.medalsCount,
    format: (r) => String(r.medalsCount),
  },
]

/** Returns rows sorted descending by the given metric. */
export function rankByMetric(metric: LeaderboardMetric): LeaderboardRow[] {
  return [...leaderboardRows].sort((a, b) => metric.value(b) - metric.value(a))
}

/** Find a player's leaderboard row by Roblox username (case-insensitive). */
export function findLeaderboardRow(name: string): LeaderboardRow | undefined {
  const target = name.trim().toLowerCase()
  if (!target) return undefined
  return leaderboardRows.find((r) => r.name.toLowerCase() === target)
}

/** Every distinct company name present in the roster, in first-seen order. */
export const companyNames: string[] = Array.from(new Set(leaderboardRows.map((r) => r.company))).filter(Boolean)

export interface CompanyStats {
  company: string
  battalion: string
  memberCount: number
  /** Average value per metric key, e.g. { kpe: 42.1, kills: 210, ... }. */
  averages: Record<string, number>
  /** Total value per metric key (only meaningful for count-like metrics). */
  totals: Record<string, number>
}

/** Aggregates every metric (mean + total) per company, for company-vs-company comparison. */
export function companyStats(): CompanyStats[] {
  const map = new Map<string, LeaderboardRow[]>()
  for (const row of leaderboardRows) {
    const key = row.company || 'Unassigned'
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(row)
  }

  return Array.from(map.entries()).map(([company, members]) => {
    const averages: Record<string, number> = {}
    const totals: Record<string, number> = {}
    for (const metric of LEADERBOARD_METRICS) {
      const values = members.map((m) => metric.value(m))
      const total = values.reduce((sum, v) => sum + v, 0)
      totals[metric.key] = total
      averages[metric.key] = members.length ? total / members.length : 0
    }
    return {
      company,
      battalion: members[0]?.battalion ?? '',
      memberCount: members.length,
      averages,
      totals,
    }
  })
}
