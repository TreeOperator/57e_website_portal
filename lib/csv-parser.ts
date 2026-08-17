import { readFileSync } from 'fs'
import { join } from 'path'

export interface SpreadsheetRow {
  rank: string
  company: string
  position: string
  name: string
  discordId: string
  robloxLink: string
  points: string
  missing: string
  returningUsername: string
  returningDiscId: string
  notes: string
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const next = line[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

function unquote(value: string): string {
  return value.trim().replace(/^"/, '').replace(/"$/, '').replace(/""/g, '"').trim()
}

export function parseRosterCsv(): SpreadsheetRow[] {
  const filePath = join(process.cwd(), 'public', 'data', 'roster.csv')
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split(/\r?\n/)

  const rows: SpreadsheetRow[] = []
  let headerFound = false
  const columnMap: Record<string, number> = {}

  for (const line of lines) {
    const rawFields = parseCsvLine(line)
    const fields = rawFields.map(unquote)

    if (!headerFound) {
      const rankIndex = fields.indexOf('Rank')
      if (rankIndex !== -1) {
        columnMap.rank = rankIndex
        columnMap.company = fields.indexOf('Company')
        columnMap.position = fields.indexOf('Position')
        columnMap.name = fields.indexOf('Name')
        columnMap.discordId = fields.indexOf('Discord ID')
        columnMap.robloxLink = fields.indexOf('Roblox Profile Link')
        columnMap.points = fields.indexOf('Points')
        columnMap.missing = fields.indexOf('Missing?')
        columnMap.returningUsername = fields.indexOf('Username')
        columnMap.returningDiscId = fields.indexOf('Disc ID')
        headerFound = true
      }
      continue
    }

    const get = (key: keyof typeof columnMap): string => {
      const index = columnMap[key]
      if (index === undefined || index < 0) return ''
      return rawFields[index] ? unquote(rawFields[index]) : ''
    }

    const name = get('name').trim()
    const returningUsername = get('returningUsername').trim()

    if (!name && !returningUsername) continue

    const notesParts: string[] = []
    for (let i = Math.max(...Object.values(columnMap)) + 1; i < rawFields.length; i++) {
      const value = unquote(rawFields[i]).trim()
      if (value) notesParts.push(value)
    }

    rows.push({
      rank: get('rank'),
      company: get('company'),
      position: get('position'),
      name,
      discordId: get('discordId'),
      robloxLink: get('robloxLink'),
      points: get('points'),
      missing: get('missing'),
      returningUsername,
      returningDiscId: get('returningDiscId'),
      notes: notesParts.join(' '),
    })
  }

  return rows
}
