import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, User } from 'lucide-react'
import { LaurelDivider, StarAccent } from '@/components/insignia'
import { wikiArticles } from '@/lib/regiment-data'

export function generateStaticParams() {
  return wikiArticles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = wikiArticles.find((a) => a.slug === slug)
  if (!article) return { title: 'Archive — 57e de Ligne' }
  return { title: `${article.title} — 57e de Ligne`, description: article.summary }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = wikiArticles.find((a) => a.slug === slug)
  if (!article) notFound()

  const related = wikiArticles.filter((a) => a.slug !== article.slug).slice(0, 3)

  return (
    <article className="px-6 py-14 lg:px-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/archive"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider-2 text-gold transition-colors hover:text-ivory"
        >
          <ArrowLeft className="size-3.5" />
          Back to Archive
        </Link>

        {/* Header */}
        <header className="mt-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-command text-gold">
            {article.category}
          </p>
          <h1 className="mt-3 text-balance font-serif text-3xl leading-tight text-ivory sm:text-4xl">
            {article.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="size-3.5 text-gold-muted" />
              {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-gold-muted" />
              {article.readingTime}
            </span>
            <span>Updated {article.updated}</span>
          </div>
          <LaurelDivider className="mx-auto mt-8 max-w-xs" />
        </header>

        {/* Summary */}
        <p className="mt-8 text-pretty font-serif text-lg italic leading-relaxed text-ivory/90">
          {article.summary}
        </p>

        {/* Body */}
        <div className="mt-8 flex flex-col gap-8">
          {article.body.map((section) => (
            <section key={section.heading}>
              <h2 className="flex items-center gap-2.5 font-serif text-xl text-gold">
                <StarAccent className="size-3.5" />
                {section.heading}
              </h2>
              <div className="mt-3 flex flex-col gap-4">
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="text-[15px] leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Related */}
      <div className="mx-auto mt-16 max-w-2xl">
        <LaurelDivider className="mb-8" />
        <h2 className="text-center text-[11px] font-semibold uppercase tracking-command text-gold">
          Elsewhere in the Archive
        </h2>
        <ul className="mt-6 flex flex-col gap-3">
          {related.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/archive/${a.slug}`}
                className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-5 py-4 transition-colors hover:border-gold/40"
              >
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider-2 text-gold">
                    {a.category}
                  </span>
                  <p className="mt-0.5 font-serif text-base text-ivory group-hover:text-gold">{a.title}</p>
                </div>
                <StarAccent className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
