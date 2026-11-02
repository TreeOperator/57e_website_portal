import killLogData from '@/data/kill_log.json'

export interface BattleEntry {
  date: string
  kills: string
  deaths: string
  assists: string
  company: string
  points: string
  /** Present only on merged point-tick entries: how many raw rows were combined. */
  battles?: number
}

const killLog = killLogData as Record<string, BattleEntry[]>

/** DD/MM/YYYY -> sortable timestamp; returns 0 for unparseable/empty dates. */
function parseDate(date: string): number {
  const [d, m, y] = date.split('/').map(Number)
  return d && m && y ? Date.UTC(y, m - 1, d) : 0
}

/**
 * A player's recorded battle history from the kill log, newest first.
 * Entries with kills/deaths/assists are individual battle results; entries
 * with a `battles` count are merged point-award ticks for that date.
 */
export function findBattlesByUsername(name: string): BattleEntry[] {
  const key = Object.keys(killLog).find((k) => k.toLowerCase() === name.trim().toLowerCase())
  if (!key) return []
  return [...killLog[key]].sort((a, b) => parseDate(b.date) - parseDate(a.date))
}

export interface BattleTotals {
  battles: number
  kills: number
  deaths: number
  assists: number
  points: number
  kdr: number | null
}

/** Career totals across all recorded entries (merged point ticks count toward points, not kills). */
export function battleTotals(entries: BattleEntry[]): BattleTotals {
  let battles = 0, kills = 0, deaths = 0, assists = 0, points = 0
  for (const e of entries) {
    battles += e.battles ?? 1
    kills += Number(e.kills) || 0
    deaths += Number(e.deaths) || 0
    assists += Number(e.assists) || 0
    points += Number(e.points) || 0
  }
  return { battles, kills, deaths, assists, points, kdr: deaths > 0 ? kills / deaths : null }
}
