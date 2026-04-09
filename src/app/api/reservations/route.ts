import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/supabase'
import {
  parseIsoDate,
  validateEmail,
  validatePersonCount,
  validateReservationSlot,
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

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function confirmReservationStored(id: string) {
  const db = supabaseAdmin()

  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await db
      .from('reservations')
      .select('id')
      .eq('id', id)
      .maybeSingle()

    if (data?.id === id) {
      return true
    }

    if (error && error.code !== 'PGRST116') {
      console.error('[api/reservations] confirmation query failed:', error.message)
      return false
    }

    if (attempt < 2) {
      await new Promise(resolve => setTimeout(resolve, 150))
    }
  }

  return false
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
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

    const personsResult = validatePersonCount(body.persons, 1, 50, 'Personenzahl')
    if (!personsResult.ok) {
      return NextResponse.json(
        { success: false, error: personsResult.error },
        { status: 400, headers: CORS }
      )
    }

    const reservationTimeResult = parseIsoDate(body.reservation_time, 'Reservierungszeit')
    if (!reservationTimeResult.ok) {
      return NextResponse.json(
        { success: false, error: reservationTimeResult.error },
        { status: 400, headers: CORS }
      )
    }

    const reservationTime = reservationTimeResult.value
    if (reservationTime <= new Date()) {
      return NextResponse.json(
        { success: false, error: 'Der gewaehlte Zeitpunkt liegt in der Vergangenheit.' },
        { status: 400, headers: CORS }
      )
    }

    const scheduleResult = validateReservationSlot(reservationTime)
    if (!scheduleResult.ok) {
      return NextResponse.json(
        { success: false, error: scheduleResult.error },
        { status: 400, headers: CORS }
      )
    }

    const normalizedReservationTime = scheduleResult.value
    const persons = personsResult.value
    const reservationId = crypto.randomUUID()

    const settings = await getSettings().catch(() => ({} as Record<string, string>))
    const avgSpendPerPerson = Number(settings['avg_spend_per_person'] ?? 25)
    const estimatedRevenue = persons * avgSpendPerPerson

    const webhookUrl = process.env.N8N_RESERVATION_WEBHOOK
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET
    if (!webhookUrl) {
      console.error('[api/reservations] N8N_RESERVATION_WEBHOOK is not set')
      return NextResponse.json(
        { success: false, error: 'Reservierungsdienst nicht verfuegbar. Bitte versuche es spaeter erneut.' },
        { status: 503, headers: CORS }
      )
    }
    if (!webhookSecret) {
      console.error('[api/reservations] N8N_WEBHOOK_SECRET is not set')
      return NextResponse.json(
        { success: false, error: 'Reservierungsdienst nicht konfiguriert.' },
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
        reservation_id: reservationId,
        name: nameResult.value,
        email: emailResult.value,
        phone: body.phone ?? null,
        reservation_time: normalizedReservationTime,
        persons,
        notes: body.notes ?? null,
        privacy_acknowledged: true,
        marketing_consent: Boolean(body.marketing_consent),
        avg_spend_per_person: avgSpendPerPerson,
        estimated_revenue: estimatedRevenue,
      }),
    })

    const json = (await n8nRes.json().catch(() => null)) as DownstreamResponse | null
    if (!n8nRes.ok || !json || json.success !== true) {
      console.error('[api/reservations] n8n returned', n8nRes.status, json)
      const errorMessage =
        json && typeof json.error === 'string'
          ? json.error
          : 'Reservierung fehlgeschlagen. Bitte versuche es erneut.'
      const status = !n8nRes.ok ? n8nRes.status : 502

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status, headers: CORS }
      )
    }

    if (json.id && json.id !== reservationId) {
      console.error('[api/reservations] n8n returned mismatched id', {
        expected: reservationId,
        received: json.id,
      })
      return NextResponse.json(
        { success: false, error: 'Reservierung konnte nicht bestaetigt werden. Bitte versuche es erneut.' },
        { status: 502, headers: CORS }
      )
    }

    const stored = await confirmReservationStored(reservationId)
    if (!stored) {
      console.error('[api/reservations] n8n reported success but reservation was not stored', {
        reservationId,
        downstream: json,
      })
      return NextResponse.json(
        { success: false, error: 'Reservierung konnte nicht gespeichert werden. Bitte versuche es erneut.' },
        { status: 502, headers: CORS }
      )
    }

    return NextResponse.json({ success: true, id: reservationId }, { headers: CORS })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unbekannter Fehler'
    console.error('[api/reservations] unexpected error:', msg)
    return NextResponse.json({ success: false, error: msg }, { status: 500, headers: CORS })
  }
}
