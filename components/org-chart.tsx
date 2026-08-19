'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Bicorne } from '@/components/insignia'
import { regimentStaffFromSheet, type OrbatStaffMember } from '@/lib/orbat-data'
import { battalionRosters, getCommandStaff, type ActivityRow, type BattalionRoster } from '@/lib/roster-data'
import { RankBadge } from '@/components/rank-badge'

/* A single billet row: position on the left, holder on the right. */
function StaffRow({ member, command = false }: { member: OrbatStaffMember; command?: boolean }) {
  const filled = Boolean(member.name)
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider-2 text-gold-muted">
        {command && filled && <Bicorne className="h-auto w-4 shrink-0" />}
        {member.position}
      </span>
      {filled ? (
        <span className="flex items-center gap-2 text-right">
          <span className="font-mono text-[11px] text-muted-foreground">{member.rank}</span>
          <span className="font-serif text-sm text-ivory">{member.name}</span>
        </span>
      ) : (
        <span className="text-[11px] italic text-muted-foreground/60">Vacant</span>
      )}
    </div>
  )
}

function CompanyMemberRow({ member }: { member: ActivityRow }) {
  const filled = Boolean(member.name)
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-[10px] font-medium uppercase tracking-wider-2 text-gold-muted">
        {member.position}
      </span>
      {filled ? (
        <span className="flex items-center gap-2 text-right">
          <RankBadge rank={member.rank} className="font-mono text-[11px] text-muted-foreground" />
          <span className="font-serif text-sm text-ivory">{member.name}</span>
        </span>
      ) : (
        <span className="text-[11px] italic text-muted-foreground/60">Vacant</span>
      )}
    </div>
  )
}

/* Vertical gold connector */
function Stem({ className }: { className?: string }) {
  return <span className={cn('mx-auto block w-px bg-gold/40', className)} aria-hidden="true" />
}

function CompanyCard({ name, members }: { name: string; members: ActivityRow[] }) {
  const command = getCommandStaff(members)
  return (
    <div className="rounded-md border border-border/70 bg-background/40 px-3.5 py-3 transition-colors duration-300 hover:border-gold/40">
      <p className="border-b border-border/60 pb-2 text-center font-serif text-[13px] leading-snug text-ivory text-pretty">
        {name}
      </p>
      <div className="mt-1 divide-y divide-border/40">
        {command.length > 0 ? (
          command.map((m, i) => <CompanyMemberRow key={`${m.position}-${i}`} member={m} />)
        ) : (
          <p className="py-2 text-center text-[11px] italic text-muted-foreground/60">No command data</p>
        )}
      </div>
    </div>
  )
}

function BattalionColumn({ battalion }: { battalion: BattalionRoster }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="flex h-full flex-col items-center">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group w-full rounded-lg border border-gold/40 bg-gradient-to-b from-accent/60 to-card px-4 py-3.5 text-center transition-all duration-300 hover:border-gold/70 hover:shadow-[0_0_0_1px_var(--gold)]"
      >
        <span className="mx-auto flex w-fit items-center gap-2 text-gold">
          <Bicorne className="h-auto w-5" />
          <span className="text-[10px] font-semibold uppercase tracking-wider-2">{battalion.key.toUpperCase()}</span>
        </span>
        <p className="mt-1.5 font-serif text-[15px] leading-tight text-ivory text-balance">
          {battalion.label}
        </p>
        <span className="mt-2.5 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider-2 text-gold-muted">
          {battalion.companies.length} {battalion.companies.length === 1 ? 'company' : 'companies'}
          <ChevronDown
            className={cn('size-3 transition-transform duration-300', open ? 'rotate-180' : '')}
          />
        </span>
      </button>

      {/* Expandable body with smooth height transition */}
      <div
        className={cn(
          'grid w-full transition-[grid-template-rows] duration-500 ease-in-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <Stem className={cn('transition-all', open ? 'h-5' : 'h-0')} />

          {/* Companies */}
          <ul className="flex flex-col gap-3">
            {battalion.companies.map((c) => (
              <li key={c.name}>
                <CompanyCard name={c.name} members={c.members} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export function OrgChart() {
  return (
    <div className="flex flex-col items-center">
      {/* Regimental command */}
      <div className="w-full max-w-md rounded-lg border border-gold/50 bg-gradient-to-b from-accent/60 to-card px-6 py-5 text-center">
        <Bicorne className="mx-auto h-auto w-11" />
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-command text-gold">
          Etat Major du Régiment
        </p>
        <p className="mt-1 font-serif text-2xl text-ivory text-balance">57e Régiment d&apos;Infanterie Ligne</p>
        <div className="mt-3 divide-y divide-border/50 border-t border-border/50 pt-1 text-left">
          {regimentStaffFromSheet.map((m, i) => (
            <StaffRow key={`${m.position}-${i}`} member={m} command={m.position.startsWith('Comm')} />
          ))}
        </div>
      </div>

      <Stem className="h-6" />

      {/* Horizontal bus above the battalion row */}
      <div className="w-full max-w-6xl px-4">
        <div className="mx-auto h-px w-full max-w-5xl bg-gold/40" aria-hidden="true" />
      </div>

      {/* Battalion row — symmetrical grid */}
      <div className="mt-0 grid w-full max-w-6xl items-start gap-6 px-4 pt-6 md:grid-cols-2 xl:grid-cols-4">
        {battalionRosters.map((b) => (
          <div key={b.key} className="flex flex-col items-center">
            <Stem className="-mt-6 h-6" />
            <BattalionColumn battalion={b} />
          </div>
        ))}
      </div>
    </div>
  )
}
