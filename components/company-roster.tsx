'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { battalionRosters, type ActivityRow, type CompanyRoster } from '@/lib/roster-data'

function MemberRow({ member }: { member: ActivityRow }) {
  const vacant = !member.name
  return (
    <tr className="border-b border-border/40 last:border-0">
      <td className="px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-gold-muted">
        {member.position || '—'}
      </td>
      <td className="px-2.5 py-1.5 text-center text-[11px] text-muted-foreground">
        {vacant ? '—' : member.rank}
      </td>
      <td className="px-2.5 py-1.5 text-ivory font-serif text-sm">
        {vacant ? <span className="text-[11px] italic text-muted-foreground/50">Vacant</span> : member.name}
      </td>
      <td className="px-2.5 py-1.5 text-right text-[11px] text-muted-foreground">
        {vacant ? '—' : member.points}
      </td>
      <td className="px-2.5 py-1.5 text-right text-[11px] text-muted-foreground">
        {vacant ? '—' : member.grade}
      </td>
    </tr>
  )
}

function CompanyTable({ company, className }: { company: CompanyRoster; className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-md border border-border bg-card', className)}>
      <div className="border-b border-border bg-background/60 px-3 py-2">
        <p className="font-serif text-[13px] leading-tight text-ivory">{company.name}</p>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {company.members.length} {company.members.length === 1 ? 'member' : 'members'}
        </p>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border/60 bg-accent/30">
            <th className="px-2.5 py-1.5 text-left text-[9px] font-semibold uppercase tracking-wider text-gold-muted">
              Position
            </th>
            <th className="px-2.5 py-1.5 text-center text-[9px] font-semibold uppercase tracking-wider text-gold-muted">
              Rank
            </th>
            <th className="px-2.5 py-1.5 text-left text-[9px] font-semibold uppercase tracking-wider text-gold-muted">
              Name
            </th>
            <th className="px-2.5 py-1.5 text-right text-[9px] font-semibold uppercase tracking-wider text-gold-muted">
              Points
            </th>
            <th className="px-2.5 py-1.5 text-right text-[9px] font-semibold uppercase tracking-wider text-gold-muted">
              Grade
            </th>
          </tr>
        </thead>
        <tbody>
          {company.members.map((m, i) => (
            <MemberRow key={`${m.position}-${m.name}-${i}`} member={m} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function CompanyRosterView() {
  const [activeKey, setActiveKey] = useState(battalionRosters[0].key)
  const active = battalionRosters.find((b) => b.key === activeKey) ?? battalionRosters[0]

  return (
    <div>
      <div className="mb-6 flex flex-wrap justify-center gap-2 border-b border-border pb-4">
        {battalionRosters.map((b) => (
          <button
            key={b.key}
            onClick={() => setActiveKey(b.key)}
            className={cn(
              'rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-wider-2 transition-colors',
              b.key === activeKey
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-border text-muted-foreground hover:border-gold/40 hover:text-ivory',
            )}
          >
            {b.key}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-gold/30 bg-card p-4">
        <div className="mb-3 border-b border-border pb-2 text-center">
          <h3 className="font-serif text-lg text-ivory">{active.label}</h3>
          <p className="text-[10px] uppercase tracking-wider-2 text-gold">{active.key.toUpperCase()}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {active.companies.map((c) => (
            <CompanyTable key={c.name} company={c} className="h-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
