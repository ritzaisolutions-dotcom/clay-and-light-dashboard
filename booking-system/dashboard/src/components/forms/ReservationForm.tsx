'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

interface FormData {
  name: string
  email: string
  phone: string
  reservation_time: string
  persons: number
  notes: string
}

interface Props {
  webhookUrl: string
}

export function ReservationForm({ webhookUrl }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: { persons: 2 } })

  async function onSubmit(data: FormData) {
    setState('loading')
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Unbekannter Fehler')
      setState('success')
      reset()
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Bitte versuche es erneut.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="bg-white rounded-xl border border-pale-pistachio p-8 text-center space-y-4 max-w-lg mx-auto">
        <CheckCircle2 size={48} className="text-pistachio mx-auto" />
        <h2 className="font-display text-2xl text-burgundy">Reservierung bestätigt.</h2>
        <p className="text-dusk text-sm leading-relaxed">
          Wir haben deine Reservierung erhalten und eine Bestätigungsmail geschickt.<br />
          Bis bald bei Clay &amp; Light.
        </p>
        <button
          onClick={() => setState('idle')}
          className="btn-secondary text-sm"
        >
          Neue Reservierung
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg mx-auto">
      {state === 'error' && (
        <div className="flex gap-3 items-start p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <strong>Fehler:</strong> {errorMsg}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-ink mb-1.5">
            Name <span className="text-burgundy">*</span>
          </label>
          <input
            {...register('name', { required: 'Name ist erforderlich' })}
            className="input-field"
            placeholder="Dein Name"
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">
            E-Mail <span className="text-burgundy">*</span>
          </label>
          <input
            type="email"
            {...register('email', {
              required: 'E-Mail ist erforderlich',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Ungültige E-Mail' },
            })}
            className="input-field"
            placeholder="deine@email.at"
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Telefon</label>
          <input
            type="tel"
            {...register('phone')}
            className="input-field"
            placeholder="+43 …"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">
            Datum &amp; Uhrzeit <span className="text-burgundy">*</span>
          </label>
          <input
            type="datetime-local"
            {...register('reservation_time', { required: 'Bitte wähle Datum und Uhrzeit' })}
            className="input-field"
          />
          {errors.reservation_time && (
            <p className="text-xs text-red-600 mt-1">{errors.reservation_time.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">
            Personen <span className="text-burgundy">*</span>
          </label>
          <input
            type="number"
            {...register('persons', {
              required: 'Personenanzahl ist erforderlich',
              min: { value: 1, message: 'Mindestens 1 Person' },
              max: { value: 50, message: 'Maximal 50 Personen' },
            })}
            className="input-field"
            min={1}
            max={50}
          />
          {errors.persons && (
            <p className="text-xs text-red-600 mt-1">{errors.persons.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-ink mb-1.5">Notizen</label>
          <textarea
            {...register('notes')}
            className="input-field resize-none"
            rows={3}
            placeholder="Allergien, Anlässe, Wünsche…"
          />
        </div>
      </div>

      <p className="text-xs text-dusk">
        Mit dem Absenden akzeptierst du unsere{' '}
        <a href="/datenschutz" className="text-pistachio hover:underline" target="_blank">
          Datenschutzerklärung
        </a>
        .
      </p>

      <button
        type="submit"
        disabled={state === 'loading'}
        className="btn-primary w-full justify-center py-3"
      >
        {state === 'loading' ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Reservierung wird gesendet…
          </>
        ) : (
          'Tisch reservieren'
        )}
      </button>
    </form>
  )
}
