import type { Metadata } from 'next'
import { PotteryBookingForm } from '@/components/forms/PotteryBookingForm'
import { getSettings } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Töpferkurs buchen – Clay & Light',
  description: 'Buche deinen Platz im Töpferkurs bei Clay & Light.',
}

export const revalidate = 60

export default async function BuchenPage() {
  const settings = await getSettings().catch(() => ({} as Record<string, string>))
  const pricePerPerson = Number(settings['price_per_person'] ?? 45)

  return (
    <main className="min-h-screen bg-warm-linen py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-burgundy mb-2">Töpferkurs buchen</h1>
          <p className="text-dusk text-sm leading-relaxed">
            150 Minuten Töpfern, Glasieren und Brennen – donnerstags und sonntags.
          </p>
        </div>
        <PotteryBookingForm
          webhookUrl="/api/bookings"
          pricePerPerson={pricePerPerson}
        />
      </div>
    </main>
  )
}
