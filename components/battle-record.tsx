import type { BattleEntry } from '@/lib/battles-data'
import { battleTotals } from '@/lib/battles-data'

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 px-3 py-2 text-center">
      <p className="text-[9px] uppercase tracking-wider text-gold-muted">{label}</p>
      <p className="mt-0.5 font-serif text-sm text-ivory">{value || '—'}</p>
    </div>
  )
}

function parseDate(date: string): number {
  const [d, m, y] = date.split('/').map(Number)
  return d && m && y ? Date.UTC(y, m - 1, d) : 0
}

interface BattlePoint {
  date: string
  t: number
  /** Fraction of a day used to spread multiple same-date battles along the axis. */
  offset: number
  kills: number
  /** Moving-average kills at this point — the per-battle performance trend. */
  trend: number
}

/** One point per battle (chronological), with a centered moving-average trend. */
function battlePoints(entries: BattleEntry[]): BattlePoint[] {
  const battles = entries
    .map((e, i) => ({ e, i }))
    .filter(({ e }) => (Number(e.kills) || 0) > 0 && e.date)
    .sort((a, b) => parseDate(a.e.date) - parseDate(b.e.date) || a.i - b.i)

  // Same-date battles get evenly spaced sub-day offsets so each keeps its own bar.
  const points: BattlePoint[] = battles.map(({ e }) => ({
    date: e.date,
    t: parseDate(e.date),
    offset: 0,
    kills: Number(e.kills),
    trend: 0,
  }))
  for (let i = 0; i < points.length; ) {
    let j = i
    while (j < points.length && points[j].t === points[i].t) j++
    const n = j - i
    for (let k = i; k < j; k++) points[k].offset = (k - i + 1) / (n + 1)
    i = j
  }

  const window = Math.min(5, points.length)
  for (let i = 0; i < points.length; i++) {
    const lo = Math.max(0, i - Math.floor(window / 2))
    const hi = Math.min(points.length, lo + window)
    const slice = points.slice(lo, hi)
    points[i].trend = slice.reduce((s, p) => s + p.kills, 0) / slice.length
  }
  return points
}

const W = 560
const H = 160
const PAD = { top: 12, right: 12, bottom: 20, left: 32 }

const DAY_MS = 86400000

function BattleChart({ points }: { points: BattlePoint[] }) {
  if (points.length === 0) return null

  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const tMin = points[0].t
  const tMax = points[points.length - 1].t + DAY_MS
  const yMax = Math.max(...points.map((p) => p.kills), 1)

  const x = (p: BattlePoint) =>
    PAD.left + (((p.t + p.offset * DAY_MS) - tMin) / (tMax - tMin)) * innerW
  const y = (v: number) => PAD.top + innerH - (v / yMax) * innerH

  const trend = points.map((p) => `${x(p).toFixed(1)},${y(p.trend).toFixed(1)}`).join(' ')

  return (
    <div className="mt-4">
      <p className="mb-2 text-[10px] uppercase tracking-wider text-gold-muted">
        Kill Progression
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Kills per battle with performance trend">
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line
              x1={PAD.left} x2={W - PAD.right}
              y1={y(yMax * f)} y2={y(yMax * f)}
              className="stroke-border" strokeDasharray="3 4" strokeWidth="0.5"
            />
            <text x={PAD.left - 5} y={y(yMax * f) + 3} textAnchor="end" className="fill-muted-foreground" fontSize="8">
              {Math.round(yMax * f)}
            </text>
          </g>
        ))}
        {points.map((p, i) => (
          <g key={`${p.date}-${i}`}>
            <line x1={x(p)} x2={x(p)} y1={y(0)} y2={y(p.kills)} className="stroke-crimson/60" strokeWidth="2.5" />
            <circle cx={x(p)} cy={y(p.trend)} r="2.5" className="fill-gold" />
            <title>{`${p.date}: ${p.kills} kills (trend ${p.trend.toFixed(1)})`}</title>
          </g>
        ))}
        <polyline points={trend} fill="none" className="stroke-gold" strokeWidth="1.5" strokeLinejoin="round" />
        <text x={PAD.left} y={H - 5} className="fill-muted-foreground" fontSize="8">
          {points[0].date}
        </text>
        <text x={W - PAD.right} y={H - 5} textAnchor="end" className="fill-muted-foreground" fontSize="8">
          {points[points.length - 1].date}
        </text>
      </svg>
      <p className="mt-1 text-center text-[9px] text-muted-foreground">
        <span className="text-gold">—</span> kills-per-battle trend &nbsp;·&nbsp;{' '}
        <span className="text-crimson">▎</span> kills per battle
      </p>
    </div>
  )
}

export function BattleRecord({ entries }: { entries: BattleEntry[] }) {
  const totals = battleTotals(entries)
  const points = battlePoints(entries)

  return (
    <div className="mt-3 rounded-lg border border-gold/30 bg-card/60 p-4">
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-wider-2 text-gold">
        Battle Record — Registre des Combats
      </p>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        <StatBox label="Engagements" value={String(totals.battles)} />
        <StatBox label="Kills" value={String(totals.kills)} />
        <StatBox label="Deaths" value={String(totals.deaths)} />
        <StatBox label="Assists" value={String(totals.assists)} />
        <StatBox label="KDR" value={totals.kdr !== null ? totals.kdr.toFixed(2) : '—'} />
        <StatBox label="Points" value={String(totals.points)} />
      </div>

      <BattleChart points={points} />

      <p className="mb-2 mt-4 text-[10px] uppercase tracking-wider text-gold-muted">
        Engagements ({entries.length})
      </p>
      <ul className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
        {entries.map((e, i) => (
          <li
            key={`${e.date}-${i}`}
            className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-background/40 px-3 py-1.5 text-xs"
          >
            <span className="shrink-0 font-serif text-ivory">{e.date || 'Undated'}</span>
            {e.kills || e.deaths || e.assists ? (
              <span className="flex items-center gap-2 text-muted-foreground">
                {e.company && <span className="text-gold-muted">{e.company}</span>}
                <span>
                  <span className="text-gold">{e.kills || '0'}</span>K /{' '}
                  <span className="text-gold">{e.deaths || '0'}</span>D /{' '}
                  <span className="text-gold">{e.assists || '0'}</span>A
                </span>
                {e.points && <span className="text-muted-foreground/70">+{e.points}pt</span>}
              </span>
            ) : (
              <span className="text-muted-foreground">
                {e.battles && e.battles > 1 ? `${e.battles} point entries` : 'Point awarded'}
                {e.company ? ` · ${e.company}` : ''}
                {e.points ? ` · +${e.points}pt` : ''}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
