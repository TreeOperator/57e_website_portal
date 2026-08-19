import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { OrgChart } from '@/components/org-chart'
import { regimentMeta } from '@/lib/regiment-data'

export const metadata: Metadata = {
  title: 'Chain of Command — 57e de Ligne',
  description: 'The chain of command of the 57e Régiment d\'Infanterie de Ligne, from the colonel to the company officers.',
}

const legend = [
  { label: 'Field Officers', desc: 'Colonel · Major · Chefs de Bataillon' },
  { label: 'Company Officers', desc: 'Capitaines · Lieutenants · Sous-Lieutenants' },
  { label: 'Non-Commissioned', desc: 'Adjudants · Sergents' },
]

export default function OrderOfBattlePage() {
  return (
    <div className="px-6 py-14 lg:px-10">
      <PageHeader
        eyebrow="Ordre de Bataille"
        title="Chain of Command"
        description={`The chain of command of the regiment, organised across ${regimentMeta.battalions} battalions. Select a battalion to review its companies.`}
      />

      <div className="mx-auto mt-14 max-w-6xl">
        <OrgChart />
      </div>

      {/* Legend */}
      <div className="mx-auto mt-16 max-w-3xl rounded-lg border border-border bg-card p-6">
        <p className="text-center text-[11px] font-semibold uppercase tracking-command text-gold">
          Insignia of Rank
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {legend.map((l) => (
            <div key={l.label} className="text-center">
              <p className="font-serif text-base text-ivory">{l.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{l.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
