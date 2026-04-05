import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { ReservationsTable } from '@/components/tables/ReservationsTable'
import { getReservations } from '@/lib/supabase'

export const metadata: Metadata = { title: 'Tischreservierungen' }
export const revalidate = 0

export default async function ReservationsPage() {
  const reservations = await getReservations().catch(() => [])

  return (
    <div>
      <Header
        title="Tischreservierungen"
        subtitle={`${reservations.length} Reservierungen gesamt`}
      />
      <div className="px-8 py-6">
        <ReservationsTable initialData={reservations} />
      </div>
    </div>
  )
}
