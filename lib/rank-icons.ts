/**
 * Maps a rank's letter/number tier code (e.g. "A0", "B3", "C1") to the
 * insignia PNG filename in /public. Add more entries here as insignia
 * images are dropped into /public — anything not listed here (or any
 * rank string without a code prefix) simply falls back to plain text.
 */
const RANK_ICON_FILES: Record<string, string> = {
  A0: 'A0_conscrit.png',
  A1: 'A1_soldat.png',
  A2: 'A2_soldat_de_premier.png',
  A3: 'A3_caporal.png',
  A4: 'A4_caporal_de_premier.png',
  A5: 'A5_caporal_fourrier.png',
  A6: 'A6_honorary_sergent.png',
  B1: 'B1_sergent.png',
  B2: 'B2_sergent_major.png',
  B3: 'B3_adjutant.png',
  B4: 'B4_adjudant_sous_officier.png',
  C1: 'C1_sous_lieutenant.png',
  C2: 'C2_lieutenant.png',
  C3: 'C3_capitaine.png',
  C4: 'C4_chef_de_bataillon.png',
  C5: 'C5_major.png',
  C6: 'C6_colonel.png',
  D1: 'D1_general_de_brigade.png',
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

/** Parses a raw rank string like "A0. Conscrit" into its code, label, and icon path. */
export function parseRank(rank: string): ParsedRank {
  const trimmed = rank.trim()
  const match = CODE_PATTERN.exec(trimmed)
  if (!match) {
    return { code: null, label: trimmed, icon: null }
  }
  const [, code, label] = match
  const file = RANK_ICON_FILES[code.toUpperCase()]
  return { code, label, icon: file ? `/${file}` : null }
}
