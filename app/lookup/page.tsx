'use client'

import { useMemo, useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { RankerTracker } from '@/components/ranker-tracker'
import { RankBadge } from '@/components/rank-badge'
import type { SpreadsheetRow } from '@/lib/csv-parser'
import { findActivityByName } from '@/lib/roster-data'
import { findMedalsByUsername } from '@/lib/medals-data'
import rosterData from '@/data/roster.json'

const roster = rosterData as SpreadsheetRow[]

export default function LookupPage() {
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return roster.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.returningUsername.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div className="px-6 py-14 lg:px-10">
      <PageHeader
        eyebrow="Recherche de Joueur"
        title="Player Lookup"
        description="Search the contrôle by Roblox username to find rank, appointment, and assignment."
      />

      <div className="mx-auto mt-12 max-w-3xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Roblox username…"
            aria-label="Search Roblox username"
            className="w-full rounded-md border border-border bg-card py-2.5 pl-10 pr-3 text-sm text-ivory placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none"
          />
        </div>

        {query.trim() && (
          <div className="mt-6">
            {results.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">No Roblox user found matching &ldquo;{query}&rdquo;.</p>
            ) : (
              <ul className="space-y-3">
                {results.map((r, i) => {
                  const key = `${r.name}-${i}`
                  const isOpen = expanded === key
                  const activity = findActivityByName(r.name)
                  const medals = findMedalsByUsername(r.name || r.returningUsername)
                  return (
                    <li
                      key={key}
                      className="cursor-pointer rounded-lg border border-border bg-card p-4 transition-colors hover:border-gold/40"
                      onClick={() => setExpanded(isOpen ? null : key)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-serif text-lg text-ivory">{r.name || r.returningUsername}</p>
                          <p className="text-[10px] uppercase tracking-wider text-gold-muted">Roblox</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{r.company}</p>
                        </div>
                        <div className="flex items-center gap-2 text-right">
                          <RankBadge rank={r.rank} className="text-sm text-gold" />
                          {activity && (
                            <ChevronDown
                              className={`size-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                            />
                          )}
                        </div>
                      </div>
                      <div className="mt-3 space-y-1 border-t border-border/60 pt-3 text-sm text-muted-foreground">
                        <p>
                          <span className="text-gold-muted">Position:</span> {r.position || '—'}
                        </p>
                        <p>
                          <span className="text-gold-muted">Points:</span> {r.points || '—'}
                        </p>
                        {r.robloxLink && (
                          <p>
                            <a
                              href={r.robloxLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gold underline hover:text-gold/80"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Roblox Profile
                            </a>
                          </p>
                        )}
                        {medals.length > 0 && (
                          <div className="pt-1">
                            <span className="text-gold-muted">Medals:</span>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {medals.map((m, mi) => (
                                <span
                                  key={mi}
                                  className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[11px] text-gold"
                                >
                                  {m.medal}
                                  {m.class ? ` — ${m.class}` : ''}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {isOpen && activity && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <RankerTracker activity={activity} />
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
