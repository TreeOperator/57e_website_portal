import grensData from '@/data/grens.json'
import voltsData from '@/data/volts.json'
import depotData from '@/data/depot.json'
import fusiliersData from '@/data/fusiliers.json'
import flagGuardData from '@/data/flag_guard.json'

export interface ActivityRow {
  battalion: string
  company: string
  points: string
  position: string
  rank: string
  name: string
  discordId: string
  kills: string
  kpe: string
  kdr: string
  activity: string
  activityPct: string
  loa: string
  grade: string
  attendance: Record<string, string>
}

export interface CompanyRoster {
  name: string
  members: ActivityRow[]
}

export interface BattalionRoster {
  key: string
  label: string
  companies: CompanyRoster[]
}

function groupByCompany(rows: ActivityRow[]): CompanyRoster[] {
  const map = new Map<string, ActivityRow[]>()

  for (const row of rows) {
    const key = row.company || 'Unassigned'
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(row)
  }

  return Array.from(map.entries()).map(([name, members]) => ({ name, members }))
}

const COMMAND_POSITIONS = ['CO de Compagnie', 'XO de Compagnie', 'Etat Major']

export function getCommandStaff(members: ActivityRow[]): ActivityRow[] {
  return COMMAND_POSITIONS.map((pos) => members.find((m) => m.position === pos)).filter(
    (m): m is ActivityRow => Boolean(m),
  )
}

/** Formats a member as "Rank Name", or "N/A" if the billet is empty/unassigned. */
function fmtMember(member: ActivityRow | undefined): string {
  if (!member || !member.name) return 'N/A'
  return `${member.rank} ${member.name}`.trim()
}

export interface CompanyCommandRow {
  company: string
  battalionCommandant: string
  companyCommandant: string
  companyExecutif: string
  etatMajor: string[]
}

/**
 * Builds a live company-command table (Commandant/Exécutif de Compagnie,
 * Etat-Major, and — where the sheet records it — Commandant de Bataillon)
 * straight from the parsed activity JSON, so this never has to be
 * hand-transcribed/hardcoded.
 */
export function companyCommandRows(members: ActivityRow[]): CompanyCommandRow[] {
  return groupByCompany(members).map(({ name, members: companyMembers }) => ({
    company: name,
    battalionCommandant: fmtMember(companyMembers.find((m) => m.position === 'CO de Bataillon')),
    companyCommandant: fmtMember(companyMembers.find((m) => m.position === 'CO de Compagnie')),
    companyExecutif: fmtMember(companyMembers.find((m) => m.position === 'XO de Compagnie')),
    etatMajor: companyMembers.filter((m) => m.position === 'Etat Major').map(fmtMember),
  }))
}

const BATTALION_LABELS: Record<string, string> = {
  grens: 'Grenadiers de Amiens',
  volts: 'Voltigeurs de Liévin',
  depot: 'Dépôt de Montbéliard',
  fusiliers: 'Bataillons de Fusiliers',
  flag_guard: 'Garde du Drapeau',
}

export const battalionRosters: BattalionRoster[] = [
  { key: 'grens', label: BATTALION_LABELS.grens, companies: groupByCompany(grensData as ActivityRow[]) },
  { key: 'volts', label: BATTALION_LABELS.volts, companies: groupByCompany(voltsData as ActivityRow[]) },
  { key: 'depot', label: BATTALION_LABELS.depot, companies: groupByCompany(depotData as ActivityRow[]) },
  { key: 'fusiliers', label: BATTALION_LABELS.fusiliers, companies: groupByCompany(fusiliersData as ActivityRow[]) },
  { key: 'flag_guard', label: BATTALION_LABELS.flag_guard, companies: groupByCompany(flagGuardData as ActivityRow[]) },
]

export const allActivityRows: ActivityRow[] = [
  ...(grensData as ActivityRow[]),
  ...(voltsData as ActivityRow[]),
  ...(depotData as ActivityRow[]),
  ...(fusiliersData as ActivityRow[]),
]

/** Find a player's activity/attendance record by Roblox username (case-insensitive). */
export function findActivityByName(name: string): ActivityRow | undefined {
  const target = name.trim().toLowerCase()
  if (!target) return undefined
  return allActivityRows.find((r) => r.name.toLowerCase() === target)
}
