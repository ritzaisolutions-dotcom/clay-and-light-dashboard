'use client'

import { useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

interface FormData {
  name: string
  email: string
  phone: string
  booking_date: string
  booking_slot: string
  persons: number
  notes: string
  marketing_consent: boolean
}

interface Props {
  webhookUrl: string
  pricePerPerson?: number
}

// Pottery sessions are Thursdays (4) and Sundays (0) only
const POTTERY_DAYS = new Set([0, 4])

// Fixed 150-minute slots: [label, startTime as HH:MM]
const SLOTS = [
  { label: 'Slot 1 – 10:00 bis 12:30', value: '10:00' },
  { label: 'Slot 2 – 13:00 bis 15:30', value: '13:00' },
  { label: 'Slot 3 – 16:00 bis 18:30', value: '16:00' },
]

function getTodayStr() {
  return new Date().toISOString().slice(0, 10)
}

function isPotteryDay(dateStr: string): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr + 'T00:00:00')
  return POTTERY_DAYS.has(d.getDay())
}

export function PotteryBookingForm({ webhookUrl, pricePerPerson = 45 }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [confirmedId, setConfirmedId] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: { persons: 1 } })

  const personsCount = Number(watch('persons') || 1)
  const selectedDate = watch('booking_date')
  const totalPrice = personsCount * pricePerPerson
  const isValidDay = useMemo(() => isPotteryDay(selectedDate), [selectedDate])

  async function onSubmit(data: FormData) {
    setState('loading')
    try {
      // Build ISO 8601 timeslot from date + slot start time
      const timeslot = new Date(`${data.booking_date}T${data.booking_slot}:00`).toISOString()
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone ?? null,
          timeslot,
          persons: Number(data.persons),
          notes: data.notes ?? null,
          marketing_consent: Boolean(data.marketing_consent),
          price_per_person: pricePerPerson,
          total_price: totalPrice,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Unbekannter Fehler')
      setConfirmedId(json.id || '')
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
        <h2 className="font-display text-2xl text-burgundy">Buchung bestätigt.</h2>
        <p className="text-dusk text-sm leading-relaxed">
          Wir haben deine Buchung erhalten und eine Bestätigungsmail verschickt.<br />
          Wir freuen uns auf deinen Besuch.
        </p>
        {confirmedId && (
          <p className="text-xs text-dusk/60 font-mono">ID: {confirmedId}</p>
        )}
        <button
          onClick={() => { setState('idle'); setConfirmedId('') }}
          className="btn-secondary text-sm"
        >
          Neue Buchung
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
            {...register('booking_date', {
              required: 'Bitte wähle ein Datum',
              validate: (v) =>
                isPotteryDay(v) || 'Töpfern ist nur donnerstags und sonntags möglich',
            })}
            className="input-field"
            min={getTodayStr()}
          />
          {errors.booking_date && (
            <p className="text-xs text-red-600 mt-1">{errors.booking_date.message}</p>
          )}
          {selectedDate && !isValidDay && (
            <p className="text-xs text-amber-600 mt-1">
              Töpfern ist nur donnerstags und sonntags möglich.
            </p>
          )}
          {selectedDate && isValidDay && (
            <p className="text-xs text-pistachio mt-1">Töpfertag ✓</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">
            Zeitslot (150 Min.) <span className="text-burgundy">*</span>
          </label>
          <Controller
            name="booking_slot"
            control={control}
            rules={{ required: 'Bitte wähle einen Zeitslot' }}
            render={({ field }) => (
              <select
                {...field}
                className="input-field"
                disabled={!selectedDate || !isValidDay}
              >
                <option value="">
                  {!selectedDate
                    ? 'Erst Datum wählen'
                    : !isValidDay
                    ? 'Kein Töpfertag'
                    : 'Zeitslot wählen'}
                </option>
                {isValidDay &&
                  SLOTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
              </select>
            )}
          />
          {errors.booking_slot && (
            <p className="text-xs text-red-600 mt-1">{errors.booking_slot.message}</p>
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
              max: { value: 20, message: 'Maximal 20 Personen' },
            })}
            className="input-field"
            min={1}
            max={20}
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
            placeholder="Allergien, besondere Wünsche, Anlässe…"
          />
        </div>
      </div>

      {/* Price summary */}
      <div className="flex items-center justify-between bg-pale-pistachio/40 rounded-lg px-4 py-3 text-sm">
        <span className="text-dusk">{personsCount} Person(en) × € {pricePerPerson}</span>
        <span className="font-semibold text-burgundy text-lg">€ {totalPrice.toFixed(2)}</span>
      </div>

      {/* GDPR marketing consent */}
      <div className="flex gap-3 items-start p-4 bg-cloud rounded-lg border border-pale-pistachio">
        <input
          type="checkbox"
          id="marketing_consent"
          {...register('marketing_consent')}
          className="mt-0.5 w-4 h-4 accent-pistachio"
        />
        <label htmlFor="marketing_consent" className="text-xs text-dusk leading-relaxed">
          Ich stimme zu, dass Clay &amp; Light mir gelegentlich Newsletter und
          Sonderangebote per E-Mail zusenden darf. Diese Einwilligung kann ich
          jederzeit widerrufen.{' '}
          <a href="/datenschutz" className="text-pistachio hover:underline" target="_blank">
            Datenschutzerklärung
          </a>
        </label>
      </div>

      <p className="text-xs text-dusk">
        Deine Daten werden ausschließlich zur Bearbeitung deiner Buchung
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
            Buchung wird gesendet…
          </>
        ) : (
          'Jetzt verbindlich buchen'
        )}
      </button>
    </form>
  )
}
