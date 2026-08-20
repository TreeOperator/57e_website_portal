'use client'

import Image from 'next/image'
import { useState } from 'react'
import { getMedalIconPath } from '@/lib/medal-icons'
import { getHonourIconPath } from '@/lib/honour-icons'
import type { MedalAward } from '@/lib/medals-data'
import type { HonourAward } from '@/lib/honours-data'
import { HONOUR_TYPE_LABELS } from '@/lib/honours-data'

interface Entry {
  key: string
  iconPath: string
  title: string
  caption: string | undefined
}

function medalEntries(medals: MedalAward[]): Entry[] {
  return medals.flatMap((m, index) => {
    const iconPath = getMedalIconPath(m.medal, m.class)
    if (!iconPath) return []
    return [
      {
        key: `medal-${index}`,
        iconPath,
        title: `${m.medal}${m.class ? ` — ${m.class}` : ''}`,
        caption: m.reason,
      },
    ]
  })
}

function honourEntries(honours: HonourAward[]): Entry[] {
  return honours.flatMap((h, index) => {
    const iconPath = getHonourIconPath(h)
    if (!iconPath) return []
    return [
      {
        key: `honour-${index}`,
        iconPath,
        title: `${HONOUR_TYPE_LABELS[h.type]}: ${h.label}`,
        caption: `${h.status}${h.date ? ` — ${h.date}` : ''}`,
      },
    ]
  })
}

function EntryRow({
  entries,
  selectedKey,
  onSelect,
}: {
  entries: Entry[]
  selectedKey: string | null
  onSelect: (key: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-5">
      {entries.map((e) => (
        <button
          key={e.key}
          type="button"
          onClick={() => onSelect(e.key)}
          title={e.title}
          className={`flex size-20 items-center justify-center rounded-full bg-black/30 p-2 ring-1 transition-transform hover:scale-110 ${
            selectedKey === e.key ? 'ring-gold' : 'ring-gold/25'
          }`}
        >
          <Image src={e.iconPath} alt={e.title} width={72} height={72} className="max-h-16 w-auto object-contain" />
        </button>
      ))}
    </div>
  )
}

/**
 * Displays a player's medals and honours (Nobility/Veneration/Grand Battle)
 * like a real military shadow-box display case: a wooden frame around a
 * dark velvet-style background with the icons laid out large enough to
 * actually appreciate. Only medals/honours with a scraped icon are shown
 * (see lib/medal-icons.ts and lib/honour-icons.ts for coverage) — text-only
 * ones are intentionally omitted here since this is an image-only display.
 * Clicking an icon reveals its reason/status caption below.
 */
export function MedalDisplayCase({ medals, honours = [] }: { medals: MedalAward[]; honours?: HonourAward[] }) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  const medalRow = medalEntries(medals)
  const honourRow = honourEntries(honours)

  if (medalRow.length === 0 && honourRow.length === 0) return null

  const allEntries = [...medalRow, ...honourRow]
  const selected = allEntries.find((e) => e.key === selectedKey)

  return (
    <div className="mt-2" onClick={(e) => e.stopPropagation()}>
      <div className="rounded-sm border-[10px] border-double border-amber-800 bg-gradient-to-br from-amber-700 via-amber-900 to-amber-950 p-1 shadow-lg">
        <div className="rounded-sm bg-neutral-950 px-4 py-5">
          {medalRow.length > 0 && (
            <EntryRow
              entries={medalRow}
              selectedKey={selectedKey}
              onSelect={(key) => setSelectedKey((cur) => (cur === key ? null : key))}
            />
          )}
          {honourRow.length > 0 && (
            <div className={medalRow.length > 0 ? 'mt-5 border-t border-white/10 pt-5' : ''}>
              <EntryRow
                entries={honourRow}
                selectedKey={selectedKey}
                onSelect={(key) => setSelectedKey((cur) => (cur === key ? null : key))}
              />
            </div>
          )}
          {selected && (
            <div className="mt-4 border-t border-white/10 pt-3 text-center">
              <p className="font-serif text-sm text-ivory">{selected.title}</p>
              {selected.caption && (
                <p className="mt-1 text-xs italic text-neutral-400">&ldquo;{selected.caption}&rdquo;</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
