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

/**
 * Some sheets (activity tabs, Quartier Général) drop the tier-code prefix
 * and use bare rank names — map those names back to their icon code.
 * Keys are lowercase; matched case-insensitively.
 */
const NAME_TO_CODE: Record<string, string> = {
  'conscrit': 'A0',
  'soldat': 'A1',
  'soldat de premier': 'A2',
  'caporal': 'A3',
  'caporal de premier': 'A4',
  'caporal fourrier': 'A5',
  'caporal-fourrier': 'A5',
  'honorary sergent': 'A6',
  'sergent': 'B1',
  'sergent major': 'B2',
  'adjudant': 'B3',
  'adjudant sous-officier': 'B4',
  'sous-lieutenant': 'C1',
  'lieutenant': 'C2',
  'capitaine': 'C3',
  'chef de bataillon': 'C4',
  'chef de battalion': 'C4',
  'major': 'C5',
  'colonel': 'C6',
  'general de brigade': 'D1',
  'général de brigade': 'D1',
}

export interface ParsedRank {
  /** Tier code, e.g. "A0" — null if the rank string has no code prefix. */
  code: string | null
  /** Rank name with the code prefix stripped, e.g. "Conscrit". */
  label: string
  /** Public path to the insignia image, or null if none is available yet. */
  icon: string | null
}

const CODE_PATTERN = /^([A-Za-z]\d+)\.\s*(.+)$/

/** Parses a raw rank string like "A0. Conscrit" or bare "Sergent" into its code, label, and icon path. */
export function parseRank(rank: string): ParsedRank {
  const trimmed = rank.trim()
  const match = CODE_PATTERN.exec(trimmed)
  if (!match) {
    const code = NAME_TO_CODE[trimmed.toLowerCase()] ?? null
    return {
      code,
      label: trimmed,
      icon: code && RANK_ICON_CODES.has(code) ? `/ranks/${code}.png` : null,
    }
  }
  const [, code, label] = match
  const upperCode = code.toUpperCase()
  return { code, label, icon: RANK_ICON_CODES.has(upperCode) ? `/ranks/${upperCode}.png` : null }
}
