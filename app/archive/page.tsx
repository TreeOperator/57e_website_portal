import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Clock } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { StarAccent } from '@/components/insignia'
import { wikiArticles, type WikiArticle } from '@/lib/regiment-data'

export const metadata: Metadata = {
  title: 'Regimental Archive — 57e de Ligne',
  description: 'History, doctrine, and standing regulations of the 57e Régiment d\'Infanterie de Ligne.',
}

const CATEGORIES: WikiArticle['category'][] = ['History', 'Establishment', 'Doctrine', 'Regulations']

export default function ArchivePage() {
  return (
    <div className="px-6 py-14 lg:px-10">
      <PageHeader
        eyebrow="Archives du Régiment"
        title="Regimental Archive"
        description="The knowledge base of the corps — its lineage and honours, the doctrine of manoeuvre, and the standing regulations that govern all ranks."
      />

      <div className="mx-auto mt-12 max-w-5xl">
        {CATEGORIES.map((cat) => {
          const items = wikiArticles.filter((a) => a.category === cat)
          if (items.length === 0) return null
          return (
            <section key={cat} className="mb-12">
              <div className="mb-4 flex items-center gap-3">
                <StarAccent className="size-3" />
                <h2 className="font-serif text-xl text-ivory">{cat}</h2>
                <span className="gold-hairline flex-1" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/archive/${a.slug}`}
                    className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif text-lg leading-snug text-ivory transition-colors group-hover:text-gold">
                        {a.title}
                      </h3>
                      <ArrowUpRight className="mt-1 size-4 shrink-0 text-gold opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{a.summary}</p>
                    <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-foreground">
                      <span className="uppercase tracking-wider-2">{a.author}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {a.readingTime}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
