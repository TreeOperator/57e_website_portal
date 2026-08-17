import orbatRaw from '@/data/orbat.json'

export interface OrbatEntry {
  group: string
  position: string
  rank: string
  name: string
}

export interface OrbatStaffMember {
  position: string
  rank: string
  name: string
}

export interface OrbatBattalion {
  name: string
  staff: OrbatStaffMember[]
}

const entries = orbatRaw as OrbatEntry[]

const REGIMENT_GROUP = "Etat Major du Régiment d'Infanterie Ligne"

// Only these groups have reliable, uniquely-named labels in the sheet.
// Lower-level per-company blocks don't consistently carry their group name
// (some collapse to blank or a shared generic label like "Etat-Major"), so
// we don't attempt to render those here to avoid showing merged/wrong data.
const KNOWN_BATTALION_GROUPS = [
  'Etat Major du 1er Bataillon de Spécialistes',
  'Etat Major du 2eme Bataillon de Fusiliers',
  'Etat Major du 3eme Bataillon de Fusiliers',
  'Etat Major du Bataillon Auxiliaire',
]

function toStaff(group: string): OrbatStaffMember[] {
  return entries
    .filter((e) => e.group === group)
    .map(({ position, rank, name }) => ({ position, rank, name }))
}

export const regimentStaffFromSheet: OrbatStaffMember[] = toStaff(REGIMENT_GROUP)

export const battalionCommandFromSheet: OrbatBattalion[] = KNOWN_BATTALION_GROUPS.map((group) => ({
  name: group.replace('Etat Major du ', ''),
  staff: toStaff(group),
}))
