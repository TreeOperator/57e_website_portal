import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { CompanyRosterView } from '@/components/company-roster'

export const metadata: Metadata = {
  title: 'Company Rosters — 57e de Ligne',
  description: 'The complete contrôle of commissioned officers and senior non-commissioned ranks of the 57e de Ligne.',
}

export default function RosterPage() {
  return (
    <div className="px-6 py-14 lg:px-10">
      <PageHeader
        eyebrow="Contrôle des Officiers"
        title="Company Rosters"
        description="Company rosters by battalion, sourced from the regimental spreadsheet."
      />

      <div className="mx-auto mt-12 max-w-7xl">
        <CompanyRosterView />
      </div>
    </div>
  )
}
