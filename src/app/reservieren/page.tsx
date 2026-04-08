import type { Metadata } from 'next'
import { ReservationForm } from '@/components/forms/ReservationForm'

export const metadata: Metadata = {
  title: 'Tisch reservieren – Clay & Light',
  description: 'Reserviere deinen Tisch bei Clay & Light.',
}

export default function ReservierenPage() {
  return (
    <main className="min-h-screen bg-warm-linen py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-burgundy mb-2">Tisch reservieren</h1>
          <p className="text-dusk text-sm leading-relaxed">
            Reserviere deinen Tisch – wir freuen uns auf deinen Besuch.
          </p>
        </div>
        <ReservationForm webhookUrl="/api/reservations" />
      </div>
    </main>
  )
}
