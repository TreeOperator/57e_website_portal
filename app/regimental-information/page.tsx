import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import {
  infobox,
  introParagraph,
  realLifeHistoryIntro,
  realLifeHistory,
  nwGenreHistory,
  orgIntro,
  etatMajorRegimentaireIntro,
  etatMajorRegimentaireTable,
  departments,
  fusiliersDepotParagraph,
  fusiliersBattalionsParagraph,
  voltigeursParagraph,
  grenadiersParagraph,
  grenadiersEliteParagraph,
  sapeursParagraph,
  commandStructureDate,
  commandStructureHQTable,
  trivia,
  type InfoTable as InfoTableType,
} from '@/lib/regimental-info'
import { companyCommandRows, type CompanyCommandRow, type ActivityRow } from '@/lib/roster-data'
import fusiliersData from '@/data/fusiliers.json'
import voltsData from '@/data/volts.json'
import grensData from '@/data/grens.json'
import depotData from '@/data/depot.json'

const COMMAND_HEADERS = [
  'Compagnie', 'Commandant de Bataillon', 'Commandant de Compagnie', 'Exécutif de Compagnie', 'Etat-Major',
]

/** Live company command tables, sourced directly from the parsed activity JSON (not hand-transcribed). */
function toCommandTable(title: string, rows: CompanyCommandRow[]): InfoTableType {
  return {
    title,
    headers: COMMAND_HEADERS,
    rows: rows.map((r) => [
      r.company,
      r.battalionCommandant,
      r.companyCommandant,
      r.companyExecutif,
      r.etatMajor.length > 0 ? r.etatMajor.join('\n') : 'N/A',
    ]),
  }
}

const fusiliersTable = toCommandTable(
  'Etat Général des Bataillon 57ème Fusiliers (live, from fusiliers.json + depot.json)',
  [...companyCommandRows(fusiliersData as ActivityRow[]), ...companyCommandRows(depotData as ActivityRow[])],
)
const voltigeursTable = toCommandTable(
  'Etat Général des 57ème Voltigeurs des Liévin (live, from volts.json)',
  companyCommandRows(voltsData as ActivityRow[]),
)
const grenadiersTable = toCommandTable(
  'Etat Général des 57ème Grenadiers de Amiens (live, from grens.json)',
  companyCommandRows(grensData as ActivityRow[]),
)

export const metadata: Metadata = {
  title: 'Regimental Information — 57e de Ligne',
  description: "Regimental information transcribed from the 57e de Ligne's Fandom wiki page.",
}

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split('\n\n').map((p, i) => (
        <p key={i} className="text-sm leading-relaxed text-muted-foreground">
          {p}
        </p>
      ))}
    </>
  )
}

function InfoTable({ table }: { table: InfoTableType }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      {table.title && (
        <p className="border-b border-border bg-accent/40 px-4 py-2 text-center font-serif text-sm text-ivory">
          {table.title}
        </p>
      )}
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead className="bg-accent/30 text-left">
          <tr>
            {table.headers.map((h) => (
              <th key={h} className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {table.rows.map((row, i) => (
            <tr key={i} className="hover:bg-accent/20">
              {row.map((cell, j) => (
                <td key={j} className="whitespace-pre-line px-3 py-2 text-ivory">
                  {cell || '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="border-b border-border pb-3 font-serif text-2xl text-ivory">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  )
}

export default function RegimentalInformationPage() {
  return (
    <div className="px-6 py-14 lg:px-10">
      <PageHeader
        eyebrow="Informations Régimentaires"
        title="Regimental Information"
        description="Transcribed from the regiment's Fandom wiki page."
      />

      <div className="mx-auto mt-12 max-w-4xl">
        {/* Infobox summary */}
        <div className="rounded-lg border border-gold/30 bg-card p-6">
          <p className="text-center font-serif text-xl text-ivory">57e Régiment d&apos;Infanterie de Ligne</p>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gold-muted">Commanding Officers</p>
              <p className="mt-0.5 text-ivory">{infobox.commandingOfficers.join(', ')}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gold-muted">Period of Activity</p>
              <p className="mt-0.5 text-ivory">{infobox.periodOfActivity}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gold-muted">Nation</p>
              <p className="mt-0.5 text-ivory">{infobox.nation}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gold-muted">Brigade / Division / Corps</p>
              <p className="mt-0.5 text-ivory">{infobox.brigadeDivisionCorps}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gold-muted">Type of Unit</p>
              <p className="mt-0.5 text-ivory">{infobox.typeOfUnit}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gold-muted">Number of Lines Fielded</p>
              <p className="mt-0.5 text-ivory">{infobox.numberOfLinesFielded}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gold-muted">Nickname(s)</p>
              <p className="mt-0.5 text-ivory">{infobox.nickname}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[10px] uppercase tracking-wider text-gold-muted">Notable Commanders</p>
              <p className="mt-0.5 text-ivory">{infobox.notableCommanders.join(', ')}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[10px] uppercase tracking-wider text-red-400">Blacklisted Commanders</p>
              <p className="mt-0.5 text-muted-foreground">{infobox.blacklistedCommanders.join(', ')}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <Paragraphs text={introParagraph} />
        </div>

        <Section title="Real life History">
          <Paragraphs text={realLifeHistoryIntro} />
          {realLifeHistory.map((h) => (
            <div key={h.heading} className="mt-4">
              <h3 className="font-serif text-lg text-ivory">{h.heading}</h3>
              <div className="mt-2">
                <Paragraphs text={h.text} />
              </div>
            </div>
          ))}
        </Section>

        <Section title="History in the Napoleonic Wars Genre">
          {nwGenreHistory.map((p, i) => (
            <Paragraphs key={i} text={p} />
          ))}
        </Section>

        <Section title="Organisations of Battalions, Companies, and Auxiliary Departments">
          <Paragraphs text={orgIntro} />

          <div className="mt-8">
            <h3 className="font-serif text-lg text-ivory">État-major Régimentaire</h3>
            <div className="mt-2">
              <Paragraphs text={etatMajorRegimentaireIntro} />
            </div>
            <div className="mt-4">
              <InfoTable table={etatMajorRegimentaireTable} />
            </div>
          </div>

          {departments.map((d) => (
            <div key={d.name} className="mt-8">
              <h3 className="font-serif text-lg text-ivory">{d.name}</h3>
              <div className="mt-2">
                <Paragraphs text={d.intro} />
              </div>
              <div className="mt-4">
                <InfoTable table={d.table} />
              </div>
            </div>
          ))}
        </Section>

        <Section title="1er/2eme Battalion du Fusiliers">
          <Paragraphs text={fusiliersDepotParagraph} />
          <Paragraphs text={fusiliersBattalionsParagraph} />
          <InfoTable table={fusiliersTable} />
        </Section>

        <Section title="1er Bataillon de Spécialistes">
          <div>
            <h3 className="font-serif text-lg text-ivory">Voltigeurs &quot;Austerlitz&quot;/&quot;Arcole&quot;</h3>
            <div className="mt-2">
              <Paragraphs text={voltigeursParagraph} />
            </div>
            <div className="mt-4">
              <InfoTable table={voltigeursTable} />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-serif text-lg text-ivory">Grenadiers &quot;Les Terribles&quot;/&quot;Leipzig&quot;</h3>
            <div className="mt-2">
              <Paragraphs text={grenadiersParagraph} />
            </div>
            <div className="mt-4">
              <InfoTable table={grenadiersTable} />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-serif text-lg text-ivory italic">Grenadiers d&apos;Elite</h3>
            <div className="mt-2">
              <Paragraphs text={grenadiersEliteParagraph} />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-serif text-lg text-ivory italic">Sapeurs</h3>
            <div className="mt-2">
              <Paragraphs text={sapeursParagraph} />
            </div>
          </div>
        </Section>

        <Section title={`Command Structure Overview (As of ${commandStructureDate})`}>
          <InfoTable table={commandStructureHQTable} />
          <p className="text-xs text-muted-foreground">
            Company-level command staff are shown live above, under each battalion&apos;s own section — sourced
            directly from the roster spreadsheet rather than hand-transcribed here.
          </p>
        </Section>

        <Section title="Trivia">
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {trivia.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </Section>

        <p className="mt-14 text-center text-xs text-muted-foreground">
          Source:{' '}
          <a
            href="https://napoleonic-wars-rblx.fandom.com/wiki/57%C3%A8me_R%C3%A9giment_d%27Infanterie_de_Ligne"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline hover:text-gold/80"
          >
            Napoleonic Wars Wiki — 57ème Régiment d&apos;Infanterie de Ligne
          </a>
        </p>
      </div>
    </div>
  )
}
