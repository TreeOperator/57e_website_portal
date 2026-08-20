/**
 * Rank tier codes (e.g. "A0", "B3", "C1") with a corresponding insignia
 * image in public/ranks/{code}.png, scraped from the French Empire Fandom
 * wiki's "Ranks" table (see scripts/fetch_rank_icons.py). Anything not
 * listed here (or any rank string without a code prefix) simply falls
 * back to plain text.
 */
const RANK_ICON_CODES = new Set([
  'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6',
  'B1', 'B2', 'B3', 'B4',
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6',
  'D1',
])

export interface ParsedRank {
  /** Tier code, e.g. "A0" — null if the rank string has no code prefix. */
  code: string | null
  /** Rank name with the code prefix stripped, e.g. "Conscrit". */
  label: string
  /** Public path to the insignia image, or null if none is available yet. */
  icon: string | null
}

const CODE_PATTERN = /^([A-Za-z]\d+)\.\s*(.+)$/

/** Parses a raw rank string like "A0. Conscrit" into its code, label, and icon path. */
export function parseRank(rank: string): ParsedRank {
  const trimmed = rank.trim()
  const match = CODE_PATTERN.exec(trimmed)
  if (!match) {
    return { code: null, label: trimmed, icon: null }
  }
  const [, code, label] = match
  const upperCode = code.toUpperCase()
  return { code, label, icon: RANK_ICON_CODES.has(upperCode) ? `/ranks/${upperCode}.png` : null }
}
