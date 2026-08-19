import medalsData from '@/data/medals.json'

export interface MedalAward {
  username: string
  profileLink: string
  medal: string
  class: string
}

const medals = medalsData as MedalAward[]

/** Finds every medal awarded to a player by Roblox username (case-insensitive). */
export function findMedalsByUsername(name: string): MedalAward[] {
  const target = name.trim().toLowerCase()
  if (!target) return []
  return medals.filter((m) => m.username.trim().toLowerCase() === target)
}
