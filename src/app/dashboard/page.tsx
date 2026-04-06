import type { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { TrendingUp, Users, CalendarDays, UtensilsCrossed, ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { getPotteryBookings, getReservations, getAnalytics } from '@/lib/supabase'

export const metadata: Metadata = { title: 'Übersicht' }
export const revalidate = 60

export default async function DashboardPage() {
  const [analytics, recentBookings, recentReservations] = await Promise.all([
    getAnalytics().catch(() => null),
    getPotteryBookings().then(d => d.slice(0, 5)).catch(() => []),
    getReservations().then(d => d.slice(0, 5)).catch(() => []),
  ])

  const stats = [
    {
      label: 'Töpfer-Umsatz',
      value: `€ ${(analytics?.totalPotteryRevenue ?? 0).toFixed(0)}`,
      icon: TrendingUp,
      color: 'text-pistachio',
      bg: 'bg-pale-pistachio/30',
    },
    {
      label: 'Tisch-Umsatz (geschätzt)',
      value: `€ ${(analytics?.totalReservationRevenue ?? 0).toFixed(0)}`,
      icon: UtensilsCrossed,
      color: 'text-burgundy',
      bg: 'bg-burgundy/5',
    },
    {
      label: 'Töpferbuchungen',
      value: analytics?.totalPotteryBookings ?? 0,
      icon: CalendarDays,
      color: 'text-pistachio',
      bg: 'bg-pale-pistachio/30',
    },
    {
      label: 'Tischreservierungen',
      value: analytics?.totalReservations ?? 0,
      icon: Users,
      color: 'text-burgundy',
      bg: 'bg-burgundy/5',
    },
  ]

  return (
    <div>
      <Header
        title="Übersicht"
        subtitle={`Stand: ${format(new Date(), 'dd. MMMM yyyy', { locale: de })}`}
      />

      <div className="px-8 py-6 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="stat-card">
              <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
                <Icon size={18} className={color} />
              </div>
              <p className="text-2xl font-semibold text-ink">{value}</p>
              <p className="text-xs text-dusk mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-warm-linen p-6 text-ink">
          <p className="text-sm text-dusk uppercase tracking-wider mb-1">
            Gesamtumsatz
          </p>
          <p className="font-display text-5xl text-ink">
            € {(analytics?.combinedRevenue ?? 0).toFixed(0)}
          </p>
          <div className="flex gap-6 mt-4 text-sm text-dusk">
            <span>Ø Töpfergruppe: {(analytics?.avgPotteryPersons ?? 0).toFixed(1)} Pers.</span>
            <span>Ø Tischgruppe: {(analytics?.avgReservationPersons ?? 0).toFixed(1)} Pers.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-warm-linen rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-display text-lg text-ink">Letzte Buchungen</h2>
              <Link href="/bookings" className="text-xs text-pistachio flex items-center gap-1 hover:underline">
                Alle <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-border/70">
              {recentBookings.length === 0 ? (
                <p className="px-5 py-8 text-sm text-dusk text-center">Keine Buchungen vorhanden.</p>
              ) : (
                recentBookings.map(b => (
                  <div key={b.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">{b.name}</p>
                      <p className="text-xs text-dusk">
                        {format(new Date(b.timeslot), 'dd.MM.yy HH:mm')} · {b.persons} Pers.
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-burgundy">€ {b.total_price}</p>
                      <span className={`badge-${b.status}`}>{b.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-warm-linen rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-display text-lg text-ink">Letzte Reservierungen</h2>
              <Link href="/reservations" className="text-xs text-pistachio flex items-center gap-1 hover:underline">
                Alle <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-border/70">
              {recentReservations.length === 0 ? (
                <p className="px-5 py-8 text-sm text-dusk text-center">Keine Reservierungen vorhanden.</p>
              ) : (
                recentReservations.map(r => (
                  <div key={r.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">{r.name}</p>
                      <p className="text-xs text-dusk">
                        {format(new Date(r.reservation_time), 'dd.MM.yy HH:mm')} · {r.persons} Pers.
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-burgundy">€ {r.estimated_revenue}</p>
                      <span className={`badge-${r.status}`}>{r.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
