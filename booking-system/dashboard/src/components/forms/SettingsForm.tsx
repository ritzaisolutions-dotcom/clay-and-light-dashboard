'use client'

import { useState, useTransition } from 'react'
import { updateSetting } from '@/lib/supabase'
import { Save, CheckCircle2 } from 'lucide-react'

interface Props {
  initialSettings: Record<string, string>
}

const fields = [
  {
    key: 'price_per_person',
    label: 'Preis pro Person (Töpfern)',
    type: 'number',
    prefix: '€',
    description: 'Gilt für alle neuen Töpferbuchungen. Bestehende Buchungen bleiben unverändert.',
    min: 1,
    max: 999,
    step: 0.5,
  },
  {
    key: 'avg_spend_per_person',
    label: 'Ø Umsatz pro Person (Tisch)',
    type: 'number',
    prefix: '€',
    description: 'Wird für den geschätzten Umsatz bei Tischreservierungen verwendet.',
    min: 1,
    max: 999,
    step: 0.5,
  },
  {
    key: 'owner_email',
    label: 'Benachrichtigungs-E-Mail',
    type: 'email',
    prefix: null,
    description: 'An diese Adresse werden Buchungsbenachrichtigungen gesendet.',
    min: null,
    max: null,
    step: null,
  },
  {
    key: 'studio_name',
    label: 'Studioname',
    type: 'text',
    prefix: null,
    description: 'Erscheint in E-Mails und im Dashboard.',
    min: null,
    max: null,
    step: null,
  },
  {
    key: 'timezone',
    label: 'Zeitzone',
    type: 'text',
    prefix: null,
    description: 'IANA-Zeitzonen-String (z.B. Europe/Vienna).',
    min: null,
    max: null,
    step: null,
  },
]

export function SettingsForm({ initialSettings }: Props) {
  const [values, setValues] = useState(initialSettings)
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  function handleChange(key: string, value: string) {
    setValues(prev => ({ ...prev, [key]: value }))
    setSaved(prev => ({ ...prev, [key]: false }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function handleSave(key: string) {
    startTransition(async () => {
      try {
        await updateSetting(key, values[key])
        setSaved(prev => ({ ...prev, [key]: true }))
        setTimeout(() => setSaved(prev => ({ ...prev, [key]: false })), 2500)
      } catch (err) {
        setErrors(prev => ({ ...prev, [key]: 'Fehler beim Speichern. Bitte versuche es erneut.' }))
      }
    })
  }

  return (
    <div className="space-y-6">
      {fields.map(field => (
        <div
          key={field.key}
          className="bg-white rounded-lg border border-pale-pistachio p-6"
        >
          <label className="block text-sm font-medium text-ink mb-1">
            {field.label}
          </label>
          <p className="text-xs text-dusk mb-3">{field.description}</p>
          <div className="flex gap-3 items-start">
            <div className="relative flex-1">
              {field.prefix && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dusk text-sm select-none">
                  {field.prefix}
                </span>
              )}
              <input
                type={field.type}
                value={values[field.key] ?? ''}
                onChange={e => handleChange(field.key, e.target.value)}
                className={`input-field ${field.prefix ? 'pl-7' : ''}`}
                min={field.min ?? undefined}
                max={field.max ?? undefined}
                step={field.step ?? undefined}
              />
            </div>
            <button
              onClick={() => handleSave(field.key)}
              disabled={isPending}
              className={`btn-primary min-w-[100px] justify-center ${
                saved[field.key] ? 'bg-pistachio hover:bg-pistachio/90' : ''
              }`}
            >
              {saved[field.key] ? (
                <>
                  <CheckCircle2 size={14} />
                  Gespeichert
                </>
              ) : (
                <>
                  <Save size={14} />
                  Speichern
                </>
              )}
            </button>
          </div>
          {errors[field.key] && (
            <p className="text-xs text-red-600 mt-2">{errors[field.key]}</p>
          )}
        </div>
      ))}

      <div className="bg-pale-pistachio/30 rounded-lg border border-pale-pistachio p-4 text-xs text-dusk">
        <p className="font-medium text-ink mb-1">Hinweis</p>
        <p>
          Preisänderungen wirken sich nur auf <strong>neue</strong> Buchungen aus.
          Bestehende Einträge in der Datenbank bleiben unverändert, da{' '}
          <code className="bg-pale-pistachio px-1 rounded">total_price</code> und{' '}
          <code className="bg-pale-pistachio px-1 rounded">estimated_revenue</code> als
          berechnete Spalten gespeichert sind.
        </p>
      </div>
    </div>
  )
}
