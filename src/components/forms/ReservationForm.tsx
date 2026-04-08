'use client'

import { useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

interface FormData {
  name: string
  email: string
  phone: string
  reservation_date: string
  reservation_slot: string
  persons: number
  notes: string
  marketing_consent: boolean
}

interface Props {
  webhookUrl: string
}

// Opening hours per day (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat)
// null = closed; [openHour, lastSlotHour] where lastSlot = closing - 1h
const HOURS: Record<number, [number, number] | null> = {
  0: [9, 17],    // Sun: 09:00–18:00 close, last slot at 17:00 (before 18:00)
  1: null,       // Mon: closed
  2: [9, 17],    // Tue
  3: [9, 17],    // Wed
  4: [9, 17],    // Thu
  5: [11, 21],   // Fri: 11:00–22:00 close, last slot at 21:00 (before 22:00)
  6: [11, 21],   // Sat
}

function getDateMin() {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 15)
  return now.toISOString().slice(0, 10)
}

function generateSlots(dateStr: string): string[] {
  if (!dateStr) return []
  const d = new Date(dateStr + 'T00:00:00')
  const dow = d.getDay()
  const hours = HOURS[dow]
  if (!hours) return []
  const [startH, endH] = hours
  const slots: string[] = []
  for (let h = startH; h <= endH; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === endH && m > 0) break
      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      slots.push(`${hh}:${mm}`)
    }
  }
  return slots
}

function isDayClosed(dateStr: string): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr + 'T00:00:00')
  return HOURS[d.getDay()] === null
}

export function ReservationForm({ webhookUrl }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: { persons: 2 } })

  const selectedDate = watch('reservation_date')
  const slots = useMemo(() => generateSlots(selectedDate), [selectedDate])
  const closed = isDayClosed(selectedDate)

  async function onSubmit(data: FormData) {
    setState('loading')
    try {
      // Combine date + time into ISO 8601 for the API
      const reservation_time = new Date(`${data.reservation_date}T${data.reservation_slot}:00`).toISOString()
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          reservation_time,
          persons: data.persons,
          notes: data.notes,
          marketing_consent: data.marketing_consent,
        }),
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
            Datum <span className="text-burgundy">*</span>
          </label>
          <input
            type="date"
            {...register('reservation_date', { required: 'Bitte wähle ein Datum' })}
            className="input-field"
            min={getDateMin()}
          />
          {errors.reservation_date && (
            <p className="text-xs text-red-600 mt-1">{errors.reservation_date.message}</p>
          )}
          {closed && selectedDate && (
            <p className="text-xs text-amber-600 mt-1">Montags sind wir leider geschlossen. Bitte wähle einen anderen Tag.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">
            Uhrzeit <span className="text-burgundy">*</span>
          </label>
          <Controller
            name="reservation_slot"
            control={control}
            rules={{ required: 'Bitte wähle eine Uhrzeit' }}
            render={({ field }) => (
              <select
                {...field}
                className="input-field"
                disabled={!selectedDate || closed || slots.length === 0}
              >
                <option value="">
                  {!selectedDate
                    ? 'Erst Datum wählen'
                    : closed
                    ? 'Kein Betrieb'
                    : 'Uhrzeit wählen'}
                </option>
                {slots.map((s) => (
                  <option key={s} value={s}>
                    {s} Uhr
                  </option>
                ))}
              </select>
            )}
          />
          {errors.reservation_slot && (
            <p className="text-xs text-red-600 mt-1">{errors.reservation_slot.message}</p>
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

      {/* GDPR marketing consent — optional, separate from booking data processing */}
      <div className="flex gap-3 items-start p-4 bg-cloud rounded-lg border border-pale-pistachio">
        <input
          type="checkbox"
          id="res_marketing_consent"
          {...register('marketing_consent')}
          className="mt-0.5 w-4 h-4 accent-pistachio"
        />
        <label htmlFor="res_marketing_consent" className="text-xs text-dusk leading-relaxed">
          Ich stimme zu, dass Clay &amp; Light mir gelegentlich Newsletter und
          Sonderangebote per E-Mail zusenden darf. Diese Einwilligung kann ich
          jederzeit widerrufen.{' '}
          <a href="/datenschutz" className="text-pistachio hover:underline" target="_blank">
            Datenschutzerklärung
          </a>
        </label>
      </div>

      <p className="text-xs text-dusk">
        Deine Daten werden ausschließlich zur Bearbeitung deiner Reservierung
        verwendet (Art. 6 Abs. 1 lit. b DSGVO).{' '}
        <a href="/datenschutz" className="text-pistachio hover:underline" target="_blank">
          Datenschutzerklärung
        </a>
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
