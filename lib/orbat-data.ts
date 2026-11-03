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

const REGIMENT_GROUP = "Quartier Général du 57e Régiment d'Infanterie de Ligne"

// The Quartier Général sheet holds one Position/Rank/Name block per
// battalion/department, each under its own "Quartier Général ..." label.
const KNOWN_BATTALION_GROUPS = [
  'Quartier Général des 1er Grenadiers',
  'Quartier Général des 2eme Grenadiers',
  'Quartier Général des 1er Voltigeurs',
  'Quartier Général des 2eme Voltigeurs',
  'Quartier Général des 1er Fusiliers',
  'Quartier Général des 2eme Fusiliers',
  'Quartier Général des 3eme Fusiliers',
  'Quartier Général des 4eme Fusiliers',
  'Quartier Général des Depot',
]

// Department-level Quartier Général blocks (not battalions, but shown on
// the Chain of Command page as their own staff cards).
const KNOWN_DEPARTMENT_GROUPS = [
  'Quartier Général de Recrutement',
  'Quartier Général du Propaganda',
  'Quartier Général du Administration',
  'Quartier Général des Défense du Drapeau',
]

function toStaff(group: string): OrbatStaffMember[] {
  return entries
    .filter((e) => e.group === group)
    .map(({ position, rank, name }) => ({ position, rank, name }))
}

export const regimentStaffFromSheet: OrbatStaffMember[] = toStaff(REGIMENT_GROUP)

export const battalionCommandFromSheet: OrbatBattalion[] = KNOWN_BATTALION_GROUPS.map((group) => ({
  name: group.replace('Quartier Général des ', '').replace('Quartier Général du ', ''),
  staff: toStaff(group),
}))

export const departmentCommandFromSheet: OrbatBattalion[] = KNOWN_DEPARTMENT_GROUPS.map((group) => ({
  name: group.replace('Quartier Général des ', '').replace('Quartier Général du ', '').replace('Quartier Général de ', ''),
  staff: toStaff(group),
}))
