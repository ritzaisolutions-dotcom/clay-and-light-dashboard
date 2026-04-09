import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSettings } from '@/lib/supabase'
import {
  parseIsoDate,
  validateEmail,
  validatePersonCount,
  validatePotterySlot,
  validateRequiredText,
} from '@/lib/venue-rules'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

type DownstreamResponse = {
  success?: boolean
  stored?: boolean
  error?: string
  id?: string
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function confirmBookingStored(id: string) {
  const db = supabaseAdmin()

  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await db
      .from('pottery_bookings')
      .select('id')
      .eq('id', id)
      .maybeSingle()

    if (data?.id === id) {
      return true
    }

    if (error && error.code !== 'PGRST116') {
      console.error('[api/bookings] confirmation query failed:', error.message)
      return false
    }

    if (attempt < 2) {
      await new Promise(resolve => setTimeout(resolve, 150))
    }
  }

  return false
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const nameResult = validateRequiredText(body.name, 'Name')
    if (!nameResult.ok) {
      return NextResponse.json(
        { success: false, error: nameResult.error },
        { status: 400, headers: CORS }
      )
    }

    const emailResult = validateEmail(body.email)
    if (!emailResult.ok) {
      return NextResponse.json(
        { success: false, error: emailResult.error },
        { status: 400, headers: CORS }
      )
    }

    if (body.privacy_acknowledged !== true && body.privacy_acknowledged !== 'true') {
      return NextResponse.json(
        {
          success: false,
          error: 'Bitte bestaetige vor dem Absenden die Datenschutzerklaerung.',
        },
        { status: 400, headers: CORS }
      )
    }

    const personsResult = validatePersonCount(body.persons, 1, 20, 'Personenzahl')
    if (!personsResult.ok) {
      return NextResponse.json(
        { success: false, error: personsResult.error },
        { status: 400, headers: CORS }
      )
    }

    const timeslotResult = parseIsoDate(body.timeslot, 'Toepfer-Slot')
    if (!timeslotResult.ok) {
      return NextResponse.json(
        { success: false, error: timeslotResult.error },
        { status: 400, headers: CORS }
      )
    }

    const timeslotDate = timeslotResult.value
    if (timeslotDate <= new Date()) {
      return NextResponse.json(
        { success: false, error: 'Der gewaehlte Termin liegt in der Vergangenheit.' },
        { status: 400, headers: CORS }
      )
    }

    const scheduleResult = validatePotterySlot(timeslotDate)
    if (!scheduleResult.ok) {
      return NextResponse.json(
        { success: false, error: scheduleResult.error },
        { status: 400, headers: CORS }
      )
    }

    const normalizedTimeslot = scheduleResult.value
    const persons = personsResult.value

    const db = supabaseAdmin()
    const { data: conflicts, error: conflictError } = await db
      .from('pottery_bookings')
      .select('id')
      .eq('timeslot', normalizedTimeslot)
      .neq('status', 'cancelled')
      .limit(1)

    if (conflictError) {
      console.error('[api/bookings] availability check failed:', conflictError.message)
      return NextResponse.json(
        { success: false, error: 'Slot-Pruefung fehlgeschlagen. Bitte versuche es erneut.' },
        { status: 503, headers: CORS }
      )
    }

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Dieser Termin ist bereits vergeben. Bitte waehle einen anderen Zeitpunkt.' },
        { status: 409, headers: CORS }
      )
    }

    const bookingId = crypto.randomUUID()

    const settings = await getSettings().catch(() => ({} as Record<string, string>))
    const pricePerPerson = Number(settings['price_per_person'] ?? body.price_per_person ?? 45)
    const totalPrice = persons * pricePerPerson

    const webhookUrl = process.env.N8N_POTTERY_WEBHOOK
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET
    if (!webhookUrl) {
      console.error('[api/bookings] N8N_POTTERY_WEBHOOK is not set')
      return NextResponse.json(
        { success: false, error: 'Buchungsdienst nicht verfuegbar. Bitte versuche es spaeter erneut.' },
        { status: 503, headers: CORS }
      )
    }
    if (!webhookSecret) {
      console.error('[api/bookings] N8N_WEBHOOK_SECRET is not set')
      return NextResponse.json(
        { success: false, error: 'Buchungsdienst nicht konfiguriert.' },
        { status: 503, headers: CORS }
      )
    }

    const n8nRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': webhookSecret,
      },
      body: JSON.stringify({
        booking_id: bookingId,
        name: nameResult.value,
        email: emailResult.value,
        phone: body.phone ?? null,
        timeslot: normalizedTimeslot,
        persons,
        notes: body.notes ?? null,
        privacy_acknowledged: true,
        marketing_consent: Boolean(body.marketing_consent),
        price_per_person: pricePerPerson,
        total_price: totalPrice,
      }),
    })

    const json = (await n8nRes.json().catch(() => null)) as DownstreamResponse | null
    if (!n8nRes.ok || !json || json.success !== true) {
      console.error('[api/bookings] n8n returned', n8nRes.status, json)

      const errorMessage =
        json && typeof json.error === 'string'
          ? json.error
          : 'Buchung fehlgeschlagen. Bitte versuche es erneut.'
      const normalizedError = errorMessage.toLowerCase()
      const status =
        !n8nRes.ok
          ? n8nRes.status
          : normalizedError.includes('bereits') ||
              normalizedError.includes('unique') ||
              normalizedError.includes('duplicate') ||
              normalizedError.includes('conflict')
            ? 409
            : 502

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status, headers: CORS }
      )
    }

    if (json.id && json.id !== bookingId) {
      console.error('[api/bookings] n8n returned mismatched id', {
        expected: bookingId,
        received: json.id,
      })
      return NextResponse.json(
        { success: false, error: 'Buchung konnte nicht bestaetigt werden. Bitte versuche es erneut.' },
        { status: 502, headers: CORS }
      )
    }

    const stored = await confirmBookingStored(bookingId)
    if (!stored) {
      console.error('[api/bookings] n8n reported success but booking was not stored', {
        bookingId,
        downstream: json,
      })
      return NextResponse.json(
        { success: false, error: 'Buchung konnte nicht gespeichert werden. Bitte versuche es erneut.' },
        { status: 502, headers: CORS }
      )
    }

    return NextResponse.json({ success: true, id: bookingId }, { headers: CORS })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unbekannter Fehler'
    console.error('[api/bookings] unexpected error:', msg)
    return NextResponse.json({ success: false, error: msg }, { status: 500, headers: CORS })
  }
}
