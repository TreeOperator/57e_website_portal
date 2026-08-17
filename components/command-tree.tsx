'use client'

import { cn } from '@/lib/utils'
import { Bicorne } from '@/components/insignia'
import { regimentStaffFromSheet, battalionCommandFromSheet, type OrbatStaffMember } from '@/lib/orbat-data'

function Stem({ className }: { className?: string }) {
  return <span className={cn('mx-auto block w-px bg-gold/40', className)} aria-hidden="true" />
}

function StaffRow({ member }: { member: OrbatStaffMember }) {
  const filled = Boolean(member.name)
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-[10px] font-medium uppercase tracking-wider-2 text-gold-muted">
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

function BattalionNode({ name, staff }: { name: string; staff: OrbatStaffMember[] }) {
  return (
    <div className="flex flex-col items-center">
      <Stem className="-mt-6 h-6" />
      <div className="w-full rounded-lg border border-gold/40 bg-gradient-to-b from-accent/60 to-card px-4 py-3.5 text-center">
        <p className="font-serif text-[15px] leading-tight text-ivory text-balance">{name}</p>
      </div>
      <Stem className="h-4" />
      <div className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5">
        <div className="divide-y divide-border/40">
          {staff.length > 0 ? (
            staff.map((m, i) => <StaffRow key={`${m.position}-${i}`} member={m} />)
          ) : (
            <p className="py-2 text-center text-[11px] italic text-muted-foreground/60">No data</p>
          )}
        </div>
      </div>
    </div>
  )
}

export function CommandTree() {
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
            <StaffRow key={`${m.position}-${i}`} member={m} />
          ))}
        </div>
      </div>

      <Stem className="h-6" />

      {/* Horizontal bus above the battalion row */}
      <div className="w-full max-w-6xl px-4">
        <div className="mx-auto h-px w-full max-w-5xl bg-gold/40" aria-hidden="true" />
      </div>

      {/* Battalion row */}
      <div className="mt-0 grid w-full max-w-6xl items-start gap-6 px-4 pt-6 md:grid-cols-2 xl:grid-cols-4">
        {battalionCommandFromSheet.map((b) => (
          <BattalionNode key={b.name} name={b.name} staff={b.staff} />
        ))}
      </div>
    </div>
  )
}
