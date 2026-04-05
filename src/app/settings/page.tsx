import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { getSettings } from '@/lib/supabase'
import { SettingsForm } from '@/components/forms/SettingsForm'
import { AnalyticsPasswordForm } from '@/components/forms/AnalyticsPasswordForm'

export const metadata: Metadata = { title: 'Einstellungen' }
export const revalidate = 0

export default async function SettingsPage() {
  const settings = await getSettings().catch(() => ({
    price_per_person: '45',
    avg_spend_per_person: '25',
    owner_email: 'hello@clayandlight.at',
    studio_name: 'Clay & Light',
    timezone: 'Europe/Vienna',
  }))

  return (
    <div>
      <Header
        title="Einstellungen"
        subtitle="Preise und Konfiguration"
      />
      <div className="px-8 py-6 max-w-2xl space-y-10">
        <SettingsForm initialSettings={settings} />
        <div>
          <h2 className="font-display text-xl text-burgundy mb-4">Zugangschutz</h2>
          <AnalyticsPasswordForm />
        </div>
      </div>
    </div>
  )
}
