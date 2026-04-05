import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Analytics' }

import { Header } from '@/components/layout/Header'
import { LogoutButton } from '@/components/layout/LogoutButton'
import { getAnalytics } from '@/lib/supabase'
import { RevenueAreaChart, RevenueBarChart } from '@/components/tables/RevenueChart'
import { TrendingUp, Users, CalendarDays, UtensilsCrossed, PiggyBank } from 'lucide-react'

export const revalidate = 60

export default async function AnalyticsPage() {
  const analytics = await getAnalytics().catch(() => null)

  const stats = [
    {
      label: 'Töpfer-Umsatz gesamt',
      value: `€ ${(analytics?.totalPotteryRevenue ?? 0).toFixed(2)}`,
      icon: TrendingUp,
      note: `${analytics?.totalPotteryBookings ?? 0} Buchungen`,
      color: 'text-pistachio',
      border: 'border-l-pistachio',
    },
    {
      label: 'Tisch-Umsatz (geschätzt)',
      value: `€ ${(analytics?.totalReservationRevenue ?? 0).toFixed(2)}`,
      icon: UtensilsCrossed,
      note: `${analytics?.totalReservations ?? 0} Reservierungen`,
      color: 'text-burgundy',
      border: 'border-l-burgundy',
    },
    {
      label: 'Gesamtumsatz',
      value: `€ ${(analytics?.combinedRevenue ?? 0).toFixed(2)}`,
      icon: PiggyBank,
      note: 'Töpfern + Tisch',
      color: 'text-deep-burgundy',
      border: 'border-l-deep-burgundy',
    },
    {
      label: 'Ø Personen / Töpferbuchung',
      value: (analytics?.avgPotteryPersons ?? 0).toFixed(1),
      icon: CalendarDays,
      note: 'Durchschnitt',
      color: 'text-pistachio',
      border: 'border-l-pistachio',
    },
    {
      label: 'Ø Personen / Tischreservierung',
      value: (analytics?.avgReservationPersons ?? 0).toFixed(1),
      icon: Users,
      note: 'Durchschnitt',
      color: 'text-burgundy',
      border: 'border-l-burgundy',
    },
  ]

  return (
    <div>
      <Header
        title="Analytics"
        subtitle="Umsatz & Auslastungsübersicht"
        action={<LogoutButton />}
      />

      <div className="px-8 py-6 space-y-8">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {stats.map(({ label, value, icon: Icon, note, color, border }) => (
            <div
              key={label}
              className={`stat-card border-l-4 ${border}`}
            >
              <Icon size={18} className={`${color} mb-3`} />
              <p className="text-xl font-semibold text-ink">{value}</p>
              <p className="text-xs text-dusk mt-0.5">{label}</p>
              <p className="text-xs text-dusk/60 mt-1">{note}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-pale-pistachio p-6">
            <h2 className="font-display text-lg text-burgundy mb-4">
              Umsatz über Zeit (Fläche)
            </h2>
            {(analytics?.monthlyData?.length ?? 0) === 0 ? (
              <div className="h-[280px] flex items-center justify-center text-dusk text-sm">
                Noch keine Daten vorhanden.
              </div>
            ) : (
              <RevenueAreaChart data={analytics!.monthlyData} />
            )}
          </div>

          <div className="bg-white rounded-lg border border-pale-pistachio p-6">
            <h2 className="font-display text-lg text-burgundy mb-4">
              Umsatz über Zeit (gestapelt)
            </h2>
            {(analytics?.monthlyData?.length ?? 0) === 0 ? (
              <div className="h-[280px] flex items-center justify-center text-dusk text-sm">
                Noch keine Daten vorhanden.
              </div>
            ) : (
              <RevenueBarChart data={analytics!.monthlyData} />
            )}
          </div>
        </div>

        {/* Revenue breakdown table */}
        <div className="bg-white rounded-lg border border-pale-pistachio overflow-hidden">
          <div className="px-6 py-4 border-b border-pale-pistachio">
            <h2 className="font-display text-lg text-burgundy">Monatsübersicht</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cloud border-b border-pale-pistachio">
                <tr>
                  <th className="table-th">Monat</th>
                  <th className="table-th">Töpfern</th>
                  <th className="table-th">Tisch</th>
                  <th className="table-th">Gesamt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pale-pistachio/50">
                {(analytics?.monthlyData ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-dusk text-sm">
                      Noch keine Daten vorhanden.
                    </td>
                  </tr>
                ) : (
                  [...(analytics?.monthlyData ?? [])]
                    .reverse()
                    .map(row => (
                      <tr key={row.month} className="hover:bg-cloud/50">
                        <td className="table-td font-medium">{row.month}</td>
                        <td className="table-td text-pistachio">€ {row.pottery.toFixed(2)}</td>
                        <td className="table-td text-burgundy">€ {row.reservations.toFixed(2)}</td>
                        <td className="table-td font-semibold">€ {row.total.toFixed(2)}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
