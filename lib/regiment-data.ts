export type RankTier =
  | 'general'
  | 'colonel'
  | 'major'
  | 'chef-bataillon'
  | 'capitaine'
  | 'lieutenant'
  | 'sous-lieutenant'
  | 'adjudant-chef'
  | 'adjudant'
  | 'sergent-major'
  | 'sergent'
  | 'caporal'

/* A single billet in the order of battle. `tier` is null when the post is vacant. */
export interface Member {
  position: string
  rank: string
  name: string
  tier: RankTier | null
}

export interface Unit {
  id: string
  name: string
  icon?: string
  members: Member[]
}

export interface Battalion {
  id: string
  name: string
  short: string
  staff: Member[]
  units: Unit[]
}

export const regimentMeta = {
  name: "57e Régiment d'Infanterie de Ligne",
  nickname: 'Les Terribles',
  motto: 'Les Terribles',
  formed: '2020',
  garrison: 'Antibes',
  brigade: '1re Brigade, 2e Division',
  corps: 'Deuxième Corps',
  formerCorps: 'Troisième Corps',
  empire: 'Empire Français',
  unitType: 'Line Infantry',
  battalions: 3,
  companies: 7,
  auxiliaryDepartments: 5,
  peakStrength: '200+',
}

/* Historical (real-world) engagements — sourced from the "Real life History" */
/* section of the Fandom wiki. Note: despite the "Leipzig" company nickname,  */
/* the regiment's I Corps did NOT participate at the actual Battle of        */
/* Leipzig (per the wiki's own Trivia section).                              */
export const battleHonours = [
  { name: 'Austerlitz', year: '1805', note: "Assaulted the Pratzen Heights as part of Marshal Soult's IV Corps." },
  { name: 'Peninsular War', year: '1808–1814', note: 'Deployed to Spain against British-led forces and Spanish guerrillas.' },
  { name: 'Russian Campaign', year: '1812', note: 'Endured the catastrophic retreat from Moscow.' },
  { name: 'German Campaign', year: '1813', note: 'Fought at Dresden and Kulm; did not fight at Leipzig.' },
  { name: 'La Suffel', year: '1815', note: "Fought under Jean Rapp during the Rhine Campaign of the Hundred Days." },
]

/* Notable in-game (Roblox Napoleonic Wars) engagements, sourced from the */
/* "History in the Napoleonic Wars Genre" section of the wiki.            */
export const notableEngagements = [
  { name: 'Smohain', result: 'Victory', note: 'Fought Sweden alone and won.' },
  { name: 'Waterloo', result: '4–0', note: 'Fought Russia four times and won four times.' },
  { name: 'Asian Grand Battle', result: 'Victory', note: 'Defeated Naples and the British Army alone in a 6K victory with no eagles or standards lost.' },
]

/* History, sourced verbatim from the regiment's Fandom wiki entry. See      */
/* lib/regimental-info.ts and the /regimental-information page for the full */
/* transcription. */
export const regimentHistory = [
  "The 57e Régiment d'Infanterie de Ligne is one of the oldest regiments within Troisième Corps (now under " +
    "Deuxième Corps) under General Gory's Empire Français. The regiment was led by Colonel HunnterHyper and " +
    "Colonel AQEEP_vbn, successor to previous Colonel Jake122410 and before him, Colonel Zoldon and Maréchal " +
    "Chrothium. It is now led by the beloved Colonel Vurellis.",
  '57th Line Infantry Regiment, nicknamed "Les Terribles", was a renowned unit of the French Grande Armée ' +
    'during the Napoleonic Wars. Known for its discipline, bravery, and resilience, the regiment earned its ' +
    'place in history through its exceptional performance in several key battles, including Austerlitz.',
  "In February 2024, the EU/NA parts of 57e split off to create the 45e Régiment d'Infanterie de Ligne. " +
    'After the split, 45e stayed in Troisième Corps (EU/NA) while 57e moved to Deuxième Corps (AS/OC), ' +
    'joining their 9e and Irish (now Leib-Regiment von Hessen-Darmstadt) counterparts.',
]

/* ------------------------------------------------------------------ */
/*  Order of Battle — transcribed from the regimental ORBAT           */
/*  (Quartier Général), preserved verbatim.                            */
/* ------------------------------------------------------------------ */

const vacant = (position: string): Member => ({ position, rank: '—', name: '', tier: null })

export const regimentStaff: Member[] = [
  { position: 'Commandant du Régiment', rank: 'Colonel', name: 'Vurelis', tier: 'colonel' },
  { position: 'Executif du Régiment', rank: 'Major', name: 'JustinTheGreat2006', tier: 'major' },
  { position: 'Adjoint du Régiment', rank: 'Adjutant', name: 'Alynum', tier: 'adjudant' },
]

export const battalions: Battalion[] = [
  {
    id: 'b1',
    name: '1er Bataillon de Spécialistes',
    short: 'I · Spécialistes',
    staff: [
      { position: 'Commandant du Bataillon', rank: 'Colonel', name: 'Vurelis', tier: 'colonel' },
      vacant('Executif du Bataillon'),
    ],
    units: [
      {
        id: 'b1-leipzig',
        name: 'Quartier Général des 2eme Grenadiers de Amiens "Leipzig"',
        icon: '/gren_hat.png',
        members: [
          { position: 'Commadant du Compagnie', rank: "Gen. d'B.", name: 'dullqd', tier: 'general' },
          { position: 'Executif du Compagnie', rank: 'S-Lt.', name: 'hauntedbydwell', tier: 'sous-lieutenant' },
          { position: 'Etat-Major', rank: 'Adj-S.', name: 'SHADOW_FAX', tier: 'adjudant-chef' },
        ],
      },
      {
        id: 'b1-austerlitz',
        name: 'Quartier Général des 1er Voltiguers de Liévin "Austerlitz"',
        members: [
          vacant('Commadant du Compagnie'),
          vacant('Executif du Compagnie'),
          vacant('Etat-Major'),
        ],
      },
      {
        id: 'b1-arcole',
        name: 'Quartier Général des 2eme Voltiguers de Liévin "Arcole"',
        members: [
          vacant('Commadant du Compagnie'),
          vacant('Executif du Compagnie'),
          vacant('Etat-Major'),
        ],
      },
    ],
  },
  {
    id: 'b2',
    name: '2eme Bataillon de Fusiliers',
    short: 'II · Fusiliers',
    staff: [
      { position: 'Commandant du Bataillon', rank: 'Chef de Battailion', name: 'kjvif', tier: 'chef-bataillon' },
      vacant('Executif du Bataillon'),
    ],
    units: [
      {
        id: 'b2-terribles',
        name: 'Quartier Général des 1er Fusiliers "Les Terribles"',
        members: [
          { position: 'Commadant du Compagnie', rank: 'Adj.', name: 'Axzlat', tier: 'adjudant' },
          { position: 'Executif du Compagnie', rank: 'Adj.', name: 'ahkdedn', tier: 'adjudant' },
          { position: 'Etat-Major', rank: 'Sgt.', name: 'Iplazroblox291', tier: 'sergent' },
        ],
      },
      {
        id: 'b2-moscowa',
        name: 'Quartier Général des 2eme Fusiliers "La Moscowa"',
        members: [
          { position: 'Commadant du Compagnie', rank: 'Adj.', name: 'ash4561g', tier: 'adjudant' },
          { position: 'Executif du Compagnie', rank: 'Adj.', name: 'XywBoyo', tier: 'adjudant' },
          { position: 'Etat-Major', rank: 'Sgt-M.', name: 'ArcoBoyo', tier: 'sergent-major' },
          { position: 'Etat-Major', rank: 'Cpl-f', name: 'exante802', tier: 'caporal' },
        ],
      },
    ],
  },
  {
    id: 'b3',
    name: '3eme Bataillon de Fusiliers',
    short: 'III · Fusiliers',
    staff: [
      { position: 'Commandant du Bataillon', rank: 'Capitane', name: 'eenaz', tier: 'capitaine' },
      vacant('Executif du Bataillon'),
    ],
    units: [
      {
        id: 'b3-rivoli',
        name: 'Quartier Général des 3eme Fusiliers "Rivoli"',
        members: [
          { position: 'Commadant du Compagnie', rank: 'S-Lt.', name: 'Puppywad2', tier: 'sous-lieutenant' },
          { position: 'Executif du Compagnie', rank: 'Adj.', name: 'Hydrabailen', tier: 'adjudant' },
          { position: 'Etat-Major', rank: 'Sgt.', name: 'PolishKosmos', tier: 'sergent' },
          { position: 'Etat-Major', rank: 'Sgt-M.', name: 'MnoanBoyo', tier: 'sergent-major' },
        ],
      },
      {
        id: 'b3-borondino',
        name: 'Quartier Général des 4eme Fusiliers "Borondino"',
        members: [
          { position: 'Commadant du Compagnie', rank: 'S-Lt.', name: 'fadedstoriess', tier: 'sous-lieutenant' },
          { position: 'Executif du Compagnie', rank: 'Adj.', name: 'S_Cormac', tier: 'adjudant' },
          { position: 'Etat-Major', rank: 'Adj.', name: 'Pop_SamBlade', tier: 'adjudant' },
        ],
      },
      {
        id: 'b3-depot',
        name: 'Quartier Général du Depot "Montbeliard"',
        members: [
          { position: 'Commadant du Compagnie', rank: 'S-Lt.', name: 'Puppywad2', tier: 'sous-lieutenant' },
          { position: 'Executif du Compagnie', rank: 'Sgt-M.', name: 'nexxustheirinco', tier: 'sergent-major' },
          { position: 'Etat-Major', rank: 'Adj.', name: 'Aspectious', tier: 'adjudant' },
          { position: 'Etat-Major', rank: 'Sgt.', name: 'Sajeedur', tier: 'sergent' },
          { position: 'Etat-Major', rank: 'Cpl-f', name: 'Neospearton2', tier: 'caporal' },
        ],
      },
    ],
  },
  {
    id: 'baux',
    name: 'Bataillon Auxiliaire',
    short: 'Auxiliaire',
    staff: [
      { position: 'Commandant du Auxiliaire', rank: 'Adj.', name: 'Alynum', tier: 'adjudant' },
      vacant('Executif du Auxiliaire'),
    ],
    units: [
      {
        id: 'baux-1',
        name: 'Quartier Général du Auxiliaire',
        members: [
          { position: 'Commadant du Administration', rank: 'Adj.', name: 'Alynum', tier: 'adjudant' },
          { position: 'Executif du Administration', rank: 'Sgt.', name: 'S_Cormac', tier: 'sergent' },
          { position: 'Commadant du Recrutement', rank: 'Sgt-M.', name: 'nexxustheirinco', tier: 'sergent-major' },
          { position: 'Executif du Recrutement', rank: 'Sgt-M.', name: 'Pop_SamBlade', tier: 'sergent-major' },
        ],
      },
      {
        id: 'baux-2',
        name: 'Quartier Général du Auxiliaire',
        members: [
          { position: 'Commadant du Propagande', rank: 'Sgt-M.', name: 'tobuyas', tier: 'sergent-major' },
          { position: 'Executif du Propagande', rank: 'Cpl-f', name: 'Lovelyrules12', tier: 'caporal' },
          { position: 'Commadant du Porte-Aigles', rank: 'Adj.', name: '1Tanyaaaaa', tier: 'adjudant' },
          { position: 'Executif du Porte-Aigles', rank: 'Adj.', name: 'ahkdedn', tier: 'adjudant' },
        ],
      },
      {
        id: 'baux-3',
        name: 'Quartier Général du Auxiliaire',
        members: [
          { position: 'Commandant du Retention', rank: 'Adj-S.', name: 'fadedstoriess', tier: 'adjudant-chef' },
          { position: 'Executif du Retention', rank: 'Cpl-F', name: 'S_Cormac', tier: 'caporal' },
        ],
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Roster — every filled billet flattened into a single contrôle      */
/* ------------------------------------------------------------------ */

export interface Officer {
  id: string
  name: string
  rank: string
  tier: RankTier
  position: string
  unit: string
  battalion: string
}

function buildRoster(): Officer[] {
  const rows: Officer[] = []
  let n = 0

  for (const m of regimentStaff) {
    if (m.name && m.tier) {
      rows.push({
        id: `r-${n++}`,
        name: m.name,
        rank: m.rank,
        tier: m.tier,
        position: m.position,
        unit: 'État-Major du Régiment',
        battalion: 'État-Major',
      })
    }
  }

  for (const b of battalions) {
    for (const m of b.staff) {
      if (m.name && m.tier) {
        rows.push({
          id: `r-${n++}`,
          name: m.name,
          rank: m.rank,
          tier: m.tier,
          position: m.position,
          unit: `État-Major · ${b.short}`,
          battalion: b.short,
        })
      }
    }
    for (const u of b.units) {
      for (const m of u.members) {
        if (m.name && m.tier) {
          rows.push({
            id: `r-${n++}`,
            name: m.name,
            rank: m.rank,
            tier: m.tier,
            position: m.position,
            unit: u.name,
            battalion: b.short,
          })
        }
      }
    }
  }

  return rows
}

export const officers: Officer[] = buildRoster()

export const battalionFilters = ['All', 'État-Major', ...battalions.map((b) => b.short)]

export interface WikiArticle {
  slug: string
  title: string
  category: 'History' | 'Doctrine' | 'Regulations' | 'Establishment'
  summary: string
  updated: string
  author: string
  readingTime: string
  body: { heading: string; paragraphs: string[] }[]
}

export const wikiArticles: WikiArticle[] = [
  {
    slug: 'lineage-and-formation',
    title: 'Lineage & Formation of the Regiment',
    category: 'History',
    summary:
      'Origins of the 57e de Ligne from the ancien régime, its renumbering under the Revolution, and the road to Rivoli.',
    updated: '12 Ventôse',
    author: 'Adjudant-Major M. Aubert',
    readingTime: '6 min',
    body: [
      {
        heading: 'Origins',
        paragraphs: [
          'The regiment traces its lineage to the infantry establishments of the ancien régime, reconstituted and renumbered during the reorganisation of the line infantry in 1791. Its depot was fixed at Antibes, from which successive drafts of conscripts and volunteers were formed, drilled, and forwarded to the field battalions.',
          'From its earliest service the regiment cultivated a reputation for steadiness under fire — a quality that would define its conduct across two decades of campaigning and earn it a name spoken with respect across the Grande Armée.',
        ],
      },
      {
        heading: 'The Name "Le Terrible"',
        paragraphs: [
          'At Rivoli in 1797, the regiment held its ground against repeated assaults and delivered volleys of such discipline that the commanding general is said to have declared it "terrible" in the execution of its duty. The sobriquet was thereafter borne with pride and, by tradition, inscribed upon the regimental colour.',
        ],
      },
    ],
  },
  {
    slug: 'order-of-battle',
    title: 'Establishment & Order of Battle',
    category: 'Establishment',
    summary:
      'The battalion establishment, company composition, and the distinction between élite and centre companies.',
    updated: '3 Germinal',
    author: 'État-Major du Régiment',
    readingTime: '5 min',
    body: [
      {
        heading: 'The Battalion Establishment',
        paragraphs: [
          'The regiment fields its battalions of six companies each. Every battalion comprises one company of grenadiers, one of voltigeurs, and four companies of the centre (fusiliers). The grenadiers and voltigeurs constitute the élite companies, drawn from the tallest, steadiest, and most agile soldiers respectively.',
          'A full company at establishment numbers between 108 and 140 men, though field strength is invariably reduced by detachment, sickness, and the ordinary attrition of campaign.',
        ],
      },
      {
        heading: 'Colours & Command',
        paragraphs: [
          'The regimental eagle is carried by the porte-aigle and guarded by a détachement of the most decorated grenadiers. Its loss is accounted the gravest dishonour a regiment may suffer, and its defence the highest duty of the porte-aigle.',
        ],
      },
    ],
  },
  {
    slug: 'line-and-column',
    title: 'Manoeuvre: Line, Column & Square',
    category: 'Doctrine',
    summary:
      'The principal battlefield formations and the circumstances governing the passage from column of march to line of battle.',
    updated: '21 Pluviôse',
    author: 'Chef de Bataillon L. Perrin',
    readingTime: '8 min',
    body: [
      {
        heading: 'Column of Attack',
        paragraphs: [
          'The column offers speed of movement and ease of control, and lends moral weight to the assault. The battalion advances by division, its frontage narrow and its depth considerable, screened by a cloud of voltigeurs thrown forward to harass and disorder the enemy line.',
        ],
      },
      {
        heading: 'Deployment into Line',
        paragraphs: [
          'Where the ground and the enemy permit, the column deploys into line to bring the maximum number of muskets to bear. The manoeuvre demands cool heads and drilled cadres, for a battalion caught deploying under close fire is a battalion in peril.',
        ],
      },
      {
        heading: 'The Square',
        paragraphs: [
          'Against cavalry the battalion forms square, presenting a hedge of bayonets on every face. Well-formed and steady, an infantry square is very nearly proof against horsemen; broken or hurried, it invites catastrophe.',
        ],
      },
    ],
  },
  {
    slug: 'interior-service',
    title: 'Regulations for the Interior Service',
    category: 'Regulations',
    summary:
      'Standing orders governing daily routine, the mounting of guards, roll-calls, and the conduct expected of all ranks in garrison.',
    updated: '7 Nivôse',
    author: 'Major É. Marchand',
    readingTime: '4 min',
    body: [
      {
        heading: 'Daily Routine',
        paragraphs: [
          'The day opens with the drummers beating the diane at first light, followed by roll-call and inspection of arms. Companies parade for drill at the appointed hours, and no soldier may absent himself from quarters without a written permission signed by his company officer.',
        ],
      },
      {
        heading: 'Conduct & Discipline',
        paragraphs: [
          'Every rank is held to the strictest cleanliness of person, arms, and equipment. Infractions are entered in the company book and dealt with according to the gravity of the offence, that the honour of the regiment may never be compromised by the negligence of the individual.',
        ],
      },
    ],
  },
]
