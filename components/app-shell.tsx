'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, Network, Users, Search, BookOpen, Shield, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { regimentMeta } from '@/lib/regiment-data'

const NAV = [
  { href: '/', label: 'Overview', french: 'Aperçu', icon: Home },
  { href: '/regimental-information', label: 'Regimental Information', french: 'Informations', icon: BookOpen },
  { href: '/order-of-battle', label: 'Chain of Command', french: 'Ordre de Bataille', icon: Network },
  { href: '/roster', label: 'Company Rosters', french: 'Contrôle des Officiers', icon: Users },
  { href: '/lookup', label: 'Player Lookup', french: 'Recherche de Joueur', icon: Search },
  { href: '/leaderboards', label: 'Leaderboards', french: 'Classement', icon: Trophy },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      {/* Emblem / crest */}
      <div className="gold-sheen border-b border-sidebar-border px-6 py-7">
        <Link href="/" onClick={onNavigate} className="group flex flex-col items-center text-center">
          <span className="relative mb-3 flex size-16 items-center justify-center rounded-full border border-gold/40 bg-background/40 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/57e_logo.png"
              alt=""
              width={64}
              height={64}
              className="size-14 rounded-full object-cover"
              aria-hidden="true"
            />
          </span>
          <span className="font-serif text-lg leading-tight text-ivory">57e de Ligne</span>
          <span className="mt-1 font-serif text-xs italic text-gold">« {regimentMeta.motto} »</span>
        </Link>
        {/* Crimson sash band, edged in gold */}
        <div className="sash-band mx-auto mt-5 h-1.5 w-24 rounded-full" aria-hidden="true" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6" aria-label="Regimental sections">
        <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-command text-muted-foreground">
          Sections
        </p>
        <ul className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative flex items-center gap-3 overflow-hidden rounded-md border border-transparent px-3 py-2.5 transition-colors duration-200',
                    active
                      ? 'border-gold/30 bg-sidebar-accent text-ivory'
                      : 'text-muted-foreground hover:border-sidebar-border hover:bg-sidebar-accent/50 hover:text-ivory',
                  )}
                >
                  {/* Crimson sash marking the active section */}
                  <span
                    className={cn(
                      'absolute inset-y-0 left-0 w-1 rounded-r-sm bg-crimson transition-opacity duration-200',
                      active ? 'opacity-100' : 'opacity-0',
                    )}
                    aria-hidden="true"
                  />
                  <Icon className={cn('size-4 shrink-0', active ? 'text-gold' : 'text-gold-muted')} />
                  <span className="flex flex-col">
                    <span className="text-sm font-medium leading-none">{item.label}</span>
                    <span className="mt-0.5 text-[11px] italic leading-none text-muted-foreground">
                      {item.french}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer plate */}
      <div className="border-t border-sidebar-border px-6 py-4">
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-wider-2 text-muted-foreground">
          <Shield className="size-3.5 text-gold-muted" />
          Ministère de la Guerre
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">Garrison · {regimentMeta.garrison}</p>
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-sidebar-border bg-sidebar">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-muted-foreground hover:text-ivory"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            onClick={() => setOpen(true)}
            className="rounded-md border border-border p-2 text-ivory"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <span className="font-serif text-base text-ivory">57e de Ligne</span>
          <Image src="/57e_logo.png" alt="" width={32} height={32} className="size-8 rounded-full" aria-hidden="true" />
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border px-6 py-8 lg:px-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center">
            <Image
              src="/Deuxieme_eagle_flags.png"
              alt="Insignia of the Deuxième Corps"
              width={550}
              height={230}
              className="h-auto w-full max-w-xs opacity-90 sm:max-w-sm"
            />
            <p className="font-serif text-sm text-gold">« {regimentMeta.motto} »</p>
            <p className="text-xs text-muted-foreground">
              {regimentMeta.name} — Portail du Régiment · Registre tenu par l&apos;État-Major
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
