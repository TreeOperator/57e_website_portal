import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Network, Users, BookOpen, Trophy } from 'lucide-react'
import { LaurelDivider, StarAccent } from '@/components/insignia'
import { regimentMeta, battleHonours, notableEngagements, regimentHistory } from '@/lib/regiment-data'

const stats = [
  { label: 'Established', value: regimentMeta.formed, note: regimentMeta.empire },
  { label: 'Battalions', value: String(regimentMeta.battalions), note: `${regimentMeta.companies} companies` },
  { label: 'Peak Strength', value: regimentMeta.peakStrength, note: 'in one campaign battle' },
  { label: 'Historical Engagements', value: String(battleHonours.length), note: 'per the regimental record' },
]

const sections = [
  {
    href: '/order-of-battle',
    icon: Network,
    title: 'Chain of Command',
    desc: 'The chain of command from the colonel to the company officers, arranged by battalion.',
  },
  {
    href: '/roster',
    icon: Users,
    title: 'Company Rosters',
    desc: 'The complete contrôle of commissioned officers and senior non-commissioned ranks.',
  },
  {
    href: '/regimental-information',
    icon: BookOpen,
    title: 'Regimental Information',
    desc: 'Full regimental history, departments, and command structure, from the regimental wiki.',
  },
  {
    href: '/leaderboards',
    icon: Trophy,
    title: 'Leaderboards',
    desc: 'Rankings by kills, KPE, activity, and grade, plus head-to-head player comparisons.',
  },
]

export default function OverviewPage() {
  return (
    <div>
      {/* Hero */}
      <section className="gold-sheen relative overflow-hidden border-b border-border">
        {/* Diagonal crimson sash — the single signature accent, as on the dress coat */}
        <div
          className="sash-diagonal pointer-events-none absolute -top-1/2 right-[12%] h-[200%] w-16 origin-center rotate-[24deg] opacity-25 sm:right-[18%] sm:w-20"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-16 text-center sm:py-20">
          <span className="relative mb-6 flex size-28 items-center justify-center rounded-full border border-gold/40 bg-background/40">
            <Image
              src="/57e_logo.png"
              alt="Regimental emblem of the 57e de Ligne"
              width={112}
              height={112}
              className="size-24 rounded-full object-cover"
              priority
            />
          </span>
          <p className="text-[11px] font-semibold uppercase tracking-command text-gold">
            Portail du Régiment · Grande Armée
          </p>
          <h1 className="mt-4 text-balance font-serif text-4xl leading-tight text-ivory sm:text-5xl">
            57<sup className="text-2xl">e</sup> Régiment d&apos;Infanterie de Ligne
          </h1>
          <p className="mt-4 font-serif text-xl italic text-gold">« {regimentMeta.motto} »</p>
          <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
            The official register and archive of the regiment nicknamed <em>{regimentMeta.nickname}</em> — its
            order of battle, its officers, and the standing regulations of the corps, maintained by the
            État-Major.
          </p>
          <LaurelDivider className="mt-8 w-full max-w-sm" />
          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs uppercase tracking-wider-2 text-muted-foreground">
            <span>{regimentMeta.unitType}</span>
            <StarAccent className="size-2" />
            <span>{regimentMeta.corps}</span>
            <StarAccent className="size-2" />
            <span>&ldquo;{regimentMeta.nickname}&rdquo;</span>
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-border md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center px-4 py-8 text-center">
              <span className="font-serif text-3xl text-gold">{s.value}</span>
              <span className="mt-2 text-[11px] font-semibold uppercase tracking-wider-2 text-ivory">
                {s.label}
              </span>
              <span className="mt-1 text-[11px] text-muted-foreground">{s.note}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        {/* Section quick links */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {sections.map((s) => {
            const Icon = s.icon
            return (
              <Link
                key={s.href}
                href={s.href}
                className="group relative flex flex-col rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50"
              >
                <span className="flex size-11 items-center justify-center rounded-md border border-gold/30 bg-background text-gold transition-colors group-hover:border-gold/60">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 flex items-center gap-1.5 font-serif text-xl text-ivory">
                  {s.title}
                  <ArrowUpRight className="size-4 text-gold opacity-0 transition-opacity group-hover:opacity-100" />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </Link>
            )
          })}
        </div>

        {/* History */}
        <section className="mt-16 max-w-3xl">
          <h2 className="font-serif text-2xl text-ivory">History</h2>
          <div className="mt-5 space-y-4">
            {regimentHistory.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
          <Link
            href="/regimental-information"
            className="mt-4 inline-flex items-center gap-1 text-[11px] uppercase tracking-wider-2 text-gold hover:underline"
          >
            Read the full regimental history
            <ArrowUpRight className="size-3.5" />
          </Link>
        </section>

        {/* Historical engagements + in-game record */}
        <div className="mt-16 grid gap-12 lg:grid-cols-5">
          {/* Historical engagements */}
          <section className="lg:col-span-3">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-2xl text-ivory">Historical Engagements</h2>
              <span className="text-[11px] uppercase tracking-wider-2 text-muted-foreground">
                Real-life history
              </span>
            </div>
            <div className="mt-5 overflow-hidden rounded-lg border border-border">
              {battleHonours.map((h, i) => (
                <div
                  key={h.name}
                  className={`flex items-start gap-4 px-5 py-4 transition-colors hover:bg-accent/40 ${
                    i !== 0 ? 'border-t border-border' : ''
                  }`}
                >
                  <StarAccent className="mt-1 size-3.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-serif text-lg text-ivory">{h.name}</h3>
                      <span className="font-mono text-xs text-gold">{h.year}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{h.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* In-game record */}
          <section className="lg:col-span-2">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-2xl text-ivory">In-Game Record</h2>
              <span className="text-[11px] uppercase tracking-wider-2 text-muted-foreground">
                Napoleonic Wars
              </span>
            </div>
            <ul className="mt-5 flex flex-col gap-3">
              {notableEngagements.map((e) => (
                <li key={e.name} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-serif text-base leading-snug text-ivory">{e.name}</h3>
                    <span className="font-mono text-xs text-gold">{e.result}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{e.note}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
