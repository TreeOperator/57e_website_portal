/**
 * Maps medal names (+ class, where the medal has multiple classes) to local
 * badge icon images downloaded from the French Empire Fandom wiki's
 * "Honours & Medals" table on the `French_Empire` page (see
 * scripts/fetch_medal_icons.py and scripts/fetch_medal_icons2.py).
 *
 * Covers 25 of the ~30 distinct medal names seen in data/medals.json.
 * Not mapped: "Médaille du Mérite des Douanes" (not found on the scraped
 * wiki section — very low occurrence in the data, 1 row). Lookups for
 * unmapped medals fall through to `undefined`, and callers should render a
 * plain text badge.
 */

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .toLowerCase()
    .trim()
}

interface MedalIconEntry {
  /** Icon used when no class-specific match is found. */
  default?: string
  classes?: Record<string, string>
}

const ICONS: Record<string, MedalIconEntry> = {
  "legion d'honneur": {
    default: '/medals/legion-honneur-legionnaire.png',
    classes: {
      'grand aigle': '/medals/legion-honneur-grand-aigle.png',
      'grand officier': '/medals/legion-honneur-grand-officier.png',
      'grand officer': '/medals/legion-honneur-grand-officier.png',
      commandeur: '/medals/legion-honneur-commandeur.png',
      officier: '/medals/legion-honneur-officier.png',
      legionnaire: '/medals/legion-honneur-legionnaire.png',
    },
  },
  'ordre de la fidele': {
    default: '/medals/fidele-legionnaire.png',
    classes: {
      commandeur: '/medals/fidele-commandeur.png',
      officier: '/medals/fidele-officier.png',
      legionnaire: '/medals/fidele-legionnaire.png',
    },
  },
  'medaille du merite initiatif': {
    default: '/medals/merite-initiatif-or.png',
    classes: {
      "d'or": '/medals/merite-initiatif-or.png',
      "d'argent": '/medals/merite-initiatif-argent.png',
      'de bronze': '/medals/merite-initiatif-bronze.png',
    },
  },
  // Sheet has a typo ("Initiaf" instead of "Initiatif") — map both.
  'medaille du merite initiaf': {
    default: '/medals/merite-initiatif-or.png',
    classes: {
      "d'or": '/medals/merite-initiatif-or.png',
      "d'argent": '/medals/merite-initiatif-argent.png',
      'de bronze': '/medals/merite-initiatif-bronze.png',
    },
  },
  'medaille du merite commandant': {
    default: '/medals/merite-commandant-or.png',
    classes: {
      "d'or": '/medals/merite-commandant-or.png',
      "d'argent": '/medals/merite-commandant-argent.png',
      'de bronze': '/medals/merite-commandant-bronze.png',
    },
  },
  'medaille du croix de battaile': {
    default: '/medals/croix-bataille-or.png',
    classes: {
      "d'or": '/medals/croix-bataille-or.png',
      "d'argent": '/medals/croix-bataille-argent.png',
      'de bronze': '/medals/croix-bataille-bronze.png',
    },
  },
  'medaille du merite militaire': {
    default: '/medals/merite-militaire-or.png',
    classes: {
      "d'or": '/medals/merite-militaire-or.png',
      "d'argent": '/medals/merite-militaire-argent.png',
      'de bronze': '/medals/merite-militaire-bronze.png',
    },
  },
  'medaille du merite porte-aigle': {
    default: '/medals/merite-porte-aigle-or.png',
    classes: {
      "d'or": '/medals/merite-porte-aigle-or.png',
      "d'argent": '/medals/merite-porte-aigle-argent.png',
      'de bronze': '/medals/merite-porte-aigle-bronze.png',
    },
  },
  'medaille du merite en recrutement': {
    default: '/medals/merite-recrutement-or.png',
    classes: {
      "d'or": '/medals/merite-recrutement-or.png',
      "d'argent": '/medals/merite-recrutement-argent.png',
      'de bronze': '/medals/merite-recrutement-bronze.png',
    },
  },
  'medaille du merite sociaux': {
    default: '/medals/merite-sociaux-argent.png',
  },
  'medaille du merite artistique': {
    default: '/medals/merite-artistique-or.png',
    classes: {
      "d'or": '/medals/merite-artistique-or.png',
      "d'argent": '/medals/merite-artistique-argent.png',
      'de bronze': '/medals/merite-artistique-bronze.png',
    },
  },
  "medaille de l'indefectible": {
    default: '/medals/indefectible.png',
  },
  'neuvieme merite': {
    default: '/medals/neuvieme-merite-commandeur.png',
    classes: {
      commandeur: '/medals/neuvieme-merite-commandeur.png',
      officier: '/medals/neuvieme-merite-officier.png',
      legionnaire: '/medals/neuvieme-merite-legionnaire.png',
    },
  },
  'cinquieme ordre du merite': {
    default: '/medals/cinquieme-merite-commandeur.png',
    classes: {
      commandeur: '/medals/cinquieme-merite-commandeur.png',
      officier: '/medals/cinquieme-merite-officier.png',
      legionnaire: '/medals/cinquieme-merite-legionnaire.png',
    },
  },
  'medaille du merite developpement': {
    default: '/medals/merite-developpement-argent.png',
  },
  'medaille de la merite de haut bord': {
    default: '/medals/haut-bord-or.png',
    classes: {
      "d'or": '/medals/haut-bord-or.png',
      "d'argent": '/medals/haut-bord-argent.png',
      'de bronze': '/medals/haut-bord-bronze.png',
    },
  },
  'medaille du merite du timonier': {
    default: '/medals/timonier-or.png',
    classes: {
      "d'or": '/medals/timonier-or.png',
      "d'argent": '/medals/timonier-argent.png',
      'de bronze': '/medals/timonier-bronze.png',
    },
  },
  'pendantif benevole': {
    default: '/medals/pendantif-benevole-or.png',
    classes: {
      "d'or": '/medals/pendantif-benevole-or.png',
      "d'argent": '/medals/pendantif-benevole-argent.png',
      'de bronze': '/medals/pendantif-benevole-bronze.png',
    },
  },
  "pendantif d'elite": {
    default: '/medals/pendantif-elite-bronze.png',
  },
  "pendantif de l'outre-mer": {
    default: '/medals/outre-mer-or.png',
    classes: {
      "d'or": '/medals/outre-mer-or.png',
      "d'argent": '/medals/outre-mer-argent.png',
      'de bronze': '/medals/outre-mer-bronze.png',
    },
  },
  "medaille campagne d'egypte": {
    default: '/medals/campagne-egypte-legionnaire.png',
  },
  "medaille campagne d'autriche": {
    default: '/medals/campagne-autriche-or.png',
    classes: {
      "d'or": '/medals/campagne-autriche-or.png',
      "d'argent": '/medals/campagne-autriche-argent.png',
      'de bronze': '/medals/campagne-autriche-bronze.png',
    },
  },
  "medaille campagne d'italie": {
    default: '/medals/campagne-italie-or.png',
    classes: {
      "d'or": '/medals/campagne-italie-or.png',
      "d'argent": '/medals/campagne-italie-argent.png',
      'de bronze': '/medals/campagne-italie-bronze.png',
    },
  },
  "medaille de la campagne d'allemagne": {
    default: '/medals/campagne-allemagne-or.png',
    classes: {
      "d'or": '/medals/campagne-allemagne-or.png',
      "d'argent": '/medals/campagne-allemagne-argent.png',
      'de bronze': '/medals/campagne-allemagne-bronze.png',
    },
  },
  'medaille campagne de saint-nicolas': {
    default: '/medals/campagne-saint-nicolas-or.png',
    classes: {
      "d'or": '/medals/campagne-saint-nicolas-or.png',
      "d'argent": '/medals/campagne-saint-nicolas-argent.png',
      'de bronze': '/medals/campagne-saint-nicolas-bronze.png',
    },
  },
  "ordre de l'aigle imperiale": {
    default: '/medals/aigle-imperiale-commandeur.png',
    classes: {
      'grand aigle': '/medals/aigle-imperiale-grand-aigle.png',
      commandeur: '/medals/aigle-imperiale-commandeur.png',
      officier: '/medals/aigle-imperiale-officier.png',
      legionnaire: '/medals/aigle-imperiale-legionnaire.png',
    },
  },
  'premier merite': {
    default: '/medals/premier-merite-commandeur.png',
    classes: {
      commandeur: '/medals/premier-merite-commandeur.png',
      officier: '/medals/premier-merite-officier.png',
      legionnaire: '/medals/premier-merite-legionnaire.png',
    },
  },
  'deuxieme merite': {
    default: '/medals/deuxieme-merite-commandeur.png',
    classes: {
      commandeur: '/medals/deuxieme-merite-commandeur.png',
      officier: '/medals/deuxieme-merite-officier.png',
      legionnaire: '/medals/deuxieme-merite-legionnaire.png',
    },
  },
  'croix de la troisieme valliance': {
    default: '/medals/troisieme-valliance-commandeur.png',
    classes: {
      commandeur: '/medals/troisieme-valliance-commandeur.png',
      officier: '/medals/troisieme-valliance-officier.png',
      legionnaire: '/medals/troisieme-valliance-legionnaire.png',
    },
  },
  "ordre du merite de l'athenmatique": {
    default: '/medals/athenmatique-commandeur.png',
    classes: {
      commandeur: '/medals/athenmatique-commandeur.png',
      officier: '/medals/athenmatique-officier.png',
      legionnaire: '/medals/athenmatique-legionnaire.png',
    },
  },
}

/** Returns a local icon path for a medal (+ optional class), or undefined if not scraped yet. */
export function getMedalIconPath(medal: string, medalClass?: string): string | undefined {
  const entry = ICONS[normalize(medal)]
  if (!entry) return undefined
  if (medalClass) {
    const classMatch = entry.classes?.[normalize(medalClass)]
    if (classMatch) return classMatch
  }
  return entry.default
}
