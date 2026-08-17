'use client'

import Image from 'next/image'
import { Bicorne, RankInsignia } from '@/components/insignia'
import { cn } from '@/lib/utils'
import { regimentStaff, battalions, type Member, type Battalion, type Unit } from '@/lib/regiment-data'

function MemberRow({ member }: { member: Member }) {
  const filled = Boolean(member.name && member.tier)
  return (
    <tr className="border-b border-border/40 last:border-0">
      <td className="px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-gold-muted">
        {member.position}
      </td>
      <td className="px-2.5 py-1.5 text-center text-[11px] text-muted-foreground">
        {filled ? member.rank : '—'}
      </td>
      <td className="px-2.5 py-1.5 text-right">
        {filled ? (
          <span className="flex items-center justify-end gap-2">
            <RankInsignia tier={member.tier!} size="sm" />
            <span className="font-serif text-sm text-ivory">{member.name}</span>
          </span>
        ) : (
          <span className="text-[11px] italic text-muted-foreground/50">Vacant</span>
        )}
      </td>
    </tr>
  )
}

function UnitTable({ unit, className }: { unit: Unit; className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-md border border-border bg-card', className)}>
      <div className="flex items-center gap-3 border-b border-border bg-background/60 px-3 py-2">
        <div className="flex size-10 shrink-0 items-center justify-center rounded border border-dashed border-gold/30 bg-background">
          {unit.icon ? (
            <Image src={unit.icon} alt="" width={32} height={32} className="h-8 w-auto object-contain" />
          ) : (
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Hat</span>
          )}
        </div>
        <p className="font-serif text-[13px] leading-tight text-ivory">{unit.name}</p>
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
            <th className="px-2.5 py-1.5 text-right text-[9px] font-semibold uppercase tracking-wider text-gold-muted">
              Name
            </th>
          </tr>
        </thead>
        <tbody>
          {unit.members.map((m, i) => (
            <MemberRow key={`${m.position}-${i}`} member={m} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StaffTable({ members, title }: { members: Member[]; title: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-3">
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-gold">{title}</p>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border/60 bg-accent/30">
            <th className="px-2.5 py-1.5 text-left text-[9px] font-semibold uppercase tracking-wider text-gold-muted">
              Position
            </th>
            <th className="px-2.5 py-1.5 text-center text-[9px] font-semibold uppercase tracking-wider text-gold-muted">
              Rank
            </th>
            <th className="px-2.5 py-1.5 text-right text-[9px] font-semibold uppercase tracking-wider text-gold-muted">
              Name
            </th>
          </tr>
        </thead>
        <tbody>
          {members.map((m, i) => (
            <MemberRow key={`${m.position}-${i}`} member={m} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BattalionSection({ battalion }: { battalion: Battalion }) {
  return (
    <div className="rounded-lg border border-gold/30 bg-card p-4">
      <div className="mb-3 border-b border-border pb-2 text-center">
        <h3 className="font-serif text-lg text-ivory">{battalion.name}</h3>
        <p className="text-[10px] uppercase tracking-wider-2 text-gold">{battalion.short}</p>
      </div>
      <StaffTable members={battalion.staff} title="État-Major du Bataillon" />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {battalion.units.map((u) => (
          <UnitTable key={u.id} unit={u} className="h-full" />
        ))}
      </div>
    </div>
  )
}

function RegimentalStaff() {
  return (
    <div className="rounded-lg border border-gold/50 bg-gradient-to-b from-accent/60 to-card p-5 text-center">
      <div className="mx-auto mb-3 flex w-fit items-center gap-2 text-gold">
        <Bicorne className="h-auto w-8" />
        <span className="text-[10px] font-semibold uppercase tracking-wider-2">Etat Major du Régiment</span>
      </div>
      <StaffTable members={regimentStaff} title="" />
    </div>
  )
}

export function RosterTable() {
  return (
    <div className="space-y-8">
      <RegimentalStaff />
      <div className="grid gap-6 xl:grid-cols-2">
        {battalions.map((b) => (
          <BattalionSection key={b.id} battalion={b} />
        ))}
      </div>
    </div>
  )
}
