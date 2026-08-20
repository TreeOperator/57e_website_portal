'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { RankBadge } from '@/components/rank-badge'
import { cn } from '@/lib/utils'
import {
  LEADERBOARD_METRICS,
  leaderboardRows,
  rankByMetric,
  companyNames,
  companyStats,
  type LeaderboardRow,
  type CompanyStats,
} from '@/lib/leaderboard-data'

const PAGE_SIZE = 10

function RankBubble({ position }: { position: number }) {
  const tier =
    position === 1 ? 'border-gold bg-gold/15 text-gold' :
    position === 2 ? 'border-ivory/40 bg-ivory/10 text-ivory' :
    position === 3 ? 'border-amber-700/50 bg-amber-700/10 text-amber-400' :
    'border-border text-muted-foreground'
  return (
    <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold', tier)}>
      {position}
    </span>
  )
}

function LeaderboardTab() {
  const [metricKey, setMetricKey] = useState(LEADERBOARD_METRICS[0].key)
  const [company, setCompany] = useState('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const metric = LEADERBOARD_METRICS.find((m) => m.key === metricKey) ?? LEADERBOARD_METRICS[0]
  const ranked = useMemo(() => {
    const rows = rankByMetric(metric)
    return company === 'all' ? rows : rows.filter((r) => r.company === company)
  }, [metric, company])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [metricKey, company])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, ranked.length))
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [ranked.length])

  const visible = ranked.slice(0, visibleCount)

  return (
    <div>
      <div className="mb-6 flex flex-wrap justify-center gap-2 border-b border-border pb-4">
        {LEADERBOARD_METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setMetricKey(m.key)}
            className={cn(
              'rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-wider-2 transition-colors',
              m.key === metricKey
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-border text-muted-foreground hover:border-gold/40 hover:text-ivory',
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mb-6 flex justify-center">
        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="rounded-md border border-border bg-card px-3 py-2 text-xs uppercase tracking-wider text-ivory focus:border-gold/50 focus:outline-none"
        >
          <option value="all">All Companies</option>
          {companyNames.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-gold/30 bg-card">
        <div className="border-b border-border bg-background/60 px-4 py-2.5 text-center">
          <p className="font-serif text-sm text-ivory">
            Top by {metric.label}{company !== 'all' ? ` — ${company}` : ''}
          </p>
        </div>
        <ul className="divide-y divide-border/60">
          {visible.map((row, i) => (
            <li key={`${row.name}-${i}`} className="flex items-center gap-3 px-4 py-3">
              <RankBubble position={i + 1} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-sm text-ivory">{row.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{row.company}</p>
              </div>
              <RankBadge rank={row.rank} className="hidden shrink-0 text-xs text-gold-muted sm:flex" />
              <span className="shrink-0 text-right font-serif text-base text-gold">{metric.format(row)}</span>
            </li>
          ))}
        </ul>
        {visibleCount < ranked.length && (
          <div ref={sentinelRef} className="py-3 text-center text-xs text-muted-foreground">
            Loading more…
          </div>
        )}
      </div>
    </div>
  )
}

function PlayerPicker({
  label,
  value,
  onSelect,
}: {
  label: string
  value: LeaderboardRow | null
  onSelect: (row: LeaderboardRow) => void
}) {
  const [query, setQuery] = useState('')

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return leaderboardRows.filter((r) => r.name.toLowerCase().includes(q)).slice(0, 8)
  }, [query])

  return (
    <div className="relative flex-1">
      <p className="mb-1.5 text-[10px] uppercase tracking-wider text-gold-muted">{label}</p>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={value ? value.name : query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (value) onSelect(null as unknown as LeaderboardRow)
          }}
          placeholder="Search a player…"
          className="w-full rounded-md border border-border bg-card py-2.5 pl-10 pr-3 text-sm text-ivory placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none"
        />
      </div>
      {!value && query.trim() && matches.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
          {matches.map((m, i) => (
            <li key={`${m.name}-${i}`}>
              <button
                onClick={() => {
                  onSelect(m)
                  setQuery('')
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-ivory hover:bg-accent/40"
              >
                <span>{m.name}</span>
                <span className="text-[11px] text-muted-foreground">{m.company}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function CompareTab() {
  const [a, setA] = useState<LeaderboardRow | null>(null)
  const [b, setB] = useState<LeaderboardRow | null>(null)

  const better = (metricValue: (r: LeaderboardRow) => number) => {
    if (!a || !b) return null
    const av = metricValue(a)
    const bv = metricValue(b)
    if (av === bv) return 'tie'
    return av > bv ? 'a' : 'b'
  }

  return (
    <div>
      <div className="mx-auto flex max-w-2xl flex-col gap-4 sm:flex-row">
        <PlayerPicker label="Player A" value={a} onSelect={setA} />
        <PlayerPicker label="Player B" value={b} onSelect={setB} />
      </div>

      {a && b ? (
        <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-lg border border-gold/30 bg-card">
          <div className="grid grid-cols-3 border-b border-border bg-background/60 px-4 py-3 text-center">
            <p className="truncate font-serif text-sm text-ivory">{a.name}</p>
            <p className="text-[10px] uppercase tracking-wider text-gold-muted">Metric</p>
            <p className="truncate font-serif text-sm text-ivory">{b.name}</p>
          </div>
          <ul className="divide-y divide-border/60">
            {LEADERBOARD_METRICS.map((m) => {
              const winner = better(m.value)
              return (
                <li key={m.key} className="grid grid-cols-3 items-center px-4 py-2.5 text-center">
                  <span className={cn('font-serif text-sm', winner === 'a' ? 'text-gold' : 'text-ivory')}>
                    {m.format(a)}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{m.label}</span>
                  <span className={cn('font-serif text-sm', winner === 'b' ? 'text-gold' : 'text-ivory')}>
                    {m.format(b)}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Select two players above to compare their stats side by side.
        </p>
      )}
    </div>
  )
}

function CompanyPicker({
  label,
  value,
  onSelect,
  stats,
}: {
  label: string
  value: CompanyStats | null
  onSelect: (c: CompanyStats | null) => void
  stats: CompanyStats[]
}) {
  return (
    <div className="flex-1">
      <p className="mb-1.5 text-[10px] uppercase tracking-wider text-gold-muted">{label}</p>
      <select
        value={value?.company ?? ''}
        onChange={(e) => onSelect(stats.find((s) => s.company === e.target.value) ?? null)}
        className="w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm text-ivory focus:border-gold/50 focus:outline-none"
      >
        <option value="">Select a company…</option>
        {stats.map((s) => (
          <option key={s.company} value={s.company}>
            {s.company}
          </option>
        ))}
      </select>
    </div>
  )
}

function CompanyTab() {
  const [metricKey, setMetricKey] = useState(LEADERBOARD_METRICS[0].key)
  const stats = useMemo(() => companyStats(), [])
  const metric = LEADERBOARD_METRICS.find((m) => m.key === metricKey) ?? LEADERBOARD_METRICS[0]
  const ranked = useMemo(
    () => [...stats].sort((a, b) => b.averages[metric.key] - a.averages[metric.key]),
    [stats, metric],
  )
  const maxAvg = ranked[0] ? ranked[0].averages[metric.key] : 0

  const [a, setA] = useState<CompanyStats | null>(null)
  const [b, setB] = useState<CompanyStats | null>(null)
  const better = (key: string) => {
    if (!a || !b) return null
    if (a.averages[key] === b.averages[key]) return 'tie'
    return a.averages[key] > b.averages[key] ? 'a' : 'b'
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap justify-center gap-2 border-b border-border pb-4">
        {LEADERBOARD_METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setMetricKey(m.key)}
            className={cn(
              'rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-wider-2 transition-colors',
              m.key === metricKey
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-border text-muted-foreground hover:border-gold/40 hover:text-ivory',
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-gold/30 bg-card">
        <div className="border-b border-border bg-background/60 px-4 py-2.5 text-center">
          <p className="font-serif text-sm text-ivory">Companies ranked by average {metric.label}</p>
        </div>
        <ul className="divide-y divide-border/60">
          {ranked.map((c, i) => {
            const avg = c.averages[metric.key]
            const pct = maxAvg > 0 ? Math.max(4, (avg / maxAvg) * 100) : 0
            return (
              <li key={c.company} className="px-4 py-3">
                <div className="mb-1.5 flex items-center gap-3">
                  <RankBubble position={i + 1} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-sm text-ivory">{c.company}</p>
                    <p className="text-[11px] text-muted-foreground">{c.memberCount} members</p>
                  </div>
                  <span className="shrink-0 font-serif text-base text-gold">{avg.toFixed(1)}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-background">
                  <div className="h-full rounded-full bg-gold/70" style={{ width: `${pct}%` }} />
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-4 sm:flex-row">
        <CompanyPicker label="Company A" value={a} onSelect={setA} stats={stats} />
        <CompanyPicker label="Company B" value={b} onSelect={setB} stats={stats} />
      </div>

      {a && b ? (
        <div className="mx-auto mt-6 max-w-2xl overflow-hidden rounded-lg border border-gold/30 bg-card">
          <div className="grid grid-cols-3 border-b border-border bg-background/60 px-4 py-3 text-center">
            <p className="truncate font-serif text-sm text-ivory">{a.company}</p>
            <p className="text-[10px] uppercase tracking-wider text-gold-muted">Avg. Metric</p>
            <p className="truncate font-serif text-sm text-ivory">{b.company}</p>
          </div>
          <ul className="divide-y divide-border/60">
            {LEADERBOARD_METRICS.map((m) => {
              const winner = better(m.key)
              return (
                <li key={m.key} className="grid grid-cols-3 items-center px-4 py-2.5 text-center">
                  <span className={cn('font-serif text-sm', winner === 'a' ? 'text-gold' : 'text-ivory')}>
                    {a.averages[m.key].toFixed(1)}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{m.label}</span>
                  <span className={cn('font-serif text-sm', winner === 'b' ? 'text-gold' : 'text-ivory')}>
                    {b.averages[m.key].toFixed(1)}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Select two companies above to compare their average stats.
        </p>
      )}
    </div>
  )
}

export default function LeaderboardsPage() {
  const [tab, setTab] = useState<'rankings' | 'compare' | 'companies'>('rankings')

  return (
    <div className="px-6 py-14 lg:px-10">
      <PageHeader
        eyebrow="Classement"
        title="Leaderboards"
        description="See who leads the regiment in kills, KPE, activity, grade, and medals — or compare two players head to head."
      />

      <div className="mx-auto mt-10 max-w-3xl">
        <div className="mb-8 flex justify-center gap-2">
          <button
            onClick={() => setTab('rankings')}
            className={cn(
              'rounded-md border px-5 py-2 text-xs font-semibold uppercase tracking-wider-2 transition-colors',
              tab === 'rankings'
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-border text-muted-foreground hover:border-gold/40 hover:text-ivory',
            )}
          >
            Rankings
          </button>
          <button
            onClick={() => setTab('compare')}
            className={cn(
              'rounded-md border px-5 py-2 text-xs font-semibold uppercase tracking-wider-2 transition-colors',
              tab === 'compare'
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-border text-muted-foreground hover:border-gold/40 hover:text-ivory',
            )}
          >
            Compare Players
          </button>
          <button
            onClick={() => setTab('companies')}
            className={cn(
              'rounded-md border px-5 py-2 text-xs font-semibold uppercase tracking-wider-2 transition-colors',
              tab === 'companies'
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-border text-muted-foreground hover:border-gold/40 hover:text-ivory',
            )}
          >
            Companies
          </button>
        </div>

        {tab === 'rankings' ? <LeaderboardTab /> : tab === 'compare' ? <CompareTab /> : <CompanyTab />}
      </div>
    </div>
  )
}
