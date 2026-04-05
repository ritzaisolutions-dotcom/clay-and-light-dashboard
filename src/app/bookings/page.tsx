import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { BookingsTable } from '@/components/tables/BookingsTable'
import { getPotteryBookings } from '@/lib/supabase'

export const metadata: Metadata = { title: 'Töpferbuchungen' }
export const revalidate = 0

export default async function BookingsPage() {
  const bookings = await getPotteryBookings().catch(() => [])

  return (
    <div>
      <Header
        title="Töpferbuchungen"
        subtitle={`${bookings.length} Buchungen gesamt`}
      />
      <div className="px-8 py-6">
        <BookingsTable initialData={bookings} />
      </div>
    </div>
  )
}
