'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarDays,
  UtensilsCrossed,
  BarChart3,
  Settings,
  FileText,
  Shield,
  ExternalLink,
  LogOut,
} from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { href: '/dashboard',     label: 'Übersicht',         icon: LayoutDashboard },
  { href: '/bookings',      label: 'Töpferbuchungen',   icon: CalendarDays },
  { href: '/reservations',  label: 'Tischreservierung', icon: UtensilsCrossed },
  { href: '/analytics',     label: 'Analytics',         icon: BarChart3 },
  { href: '/settings',      label: 'Einstellungen',     icon: Settings },
]

const legalItems = [
  { href: '/impressum',   label: 'Impressum',   icon: FileText },
  { href: '/datenschutz', label: 'Datenschutz', icon: Shield },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/analytics/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-warm-linen text-ink flex flex-col h-full border-r border-border">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-border">
        <Link href="/dashboard" className="block">
          <p className="font-display text-xl text-ink leading-tight">Clay & Light</p>
          <p className="text-xs text-dusk tracking-widest uppercase mt-0.5">
            Kaffee. Ton. Stille.
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors',
                active
                  ? 'bg-burgundy text-cloud font-medium shadow-sm'
                  : 'text-dusk hover:bg-sage/20 hover:text-ink'
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors text-dusk hover:bg-sage/20 hover:text-ink mt-0.5"
        >
          <LogOut size={16} />
          Abmelden
        </button>

        <div className="pt-4 mt-4 border-t border-border">
          <p className="px-3 pb-2 text-xs text-dusk/70 uppercase tracking-wider">
            Rechtliches
          </p>
          {legalItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors',
                  active
                    ? 'bg-burgundy text-cloud font-medium shadow-sm'
                    : 'text-dusk hover:bg-sage/20 hover:text-ink'
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border">
        <a
          href="https://clay-and-light.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-dusk hover:text-burgundy transition-colors"
        >
          <ExternalLink size={12} />
          clay-and-light.vercel.app
        </a>
      </div>
    </aside>
  )
}
