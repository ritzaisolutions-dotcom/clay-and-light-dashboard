import { Header } from '@/components/layout/Header'
import { getSettings } from '@/lib/supabase'
import { SettingsForm } from '@/components/forms/SettingsForm'

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
      <div className="px-8 py-6 max-w-2xl">
        <SettingsForm initialSettings={settings} />
      </div>
    </div>
  )
}
