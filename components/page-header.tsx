import { LaurelDivider } from '@/components/insignia'

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="sash-band mx-auto mb-5 h-1.5 w-16 rounded-full" aria-hidden="true" />
      <p className="text-[11px] font-semibold uppercase tracking-command text-gold">{eyebrow}</p>
      <h1 className="mt-3 text-balance font-serif text-3xl text-ivory sm:text-4xl">{title}</h1>
      {description && (
        <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      <LaurelDivider className="mx-auto mt-6 max-w-xs" />
    </div>
  )
}
