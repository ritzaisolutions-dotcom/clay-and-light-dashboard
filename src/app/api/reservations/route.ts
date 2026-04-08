import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/supabase'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const { name, email, reservation_time, persons } = body
    if (!name || !email || !reservation_time || !persons) {
      return NextResponse.json(
        { success: false, error: 'Pflichtfelder fehlen.' },
        { status: 400, headers: CORS }
      )
    }

    // Reject past dates
    if (new Date(reservation_time) <= new Date()) {
      return NextResponse.json(
        { success: false, error: 'Der gewählte Zeitpunkt liegt in der Vergangenheit.' },
        { status: 400, headers: CORS }
      )
    }

    // Idempotency key — becomes the Supabase record id
    const reservationId = crypto.randomUUID()

    // Fetch avg spend from settings for estimated revenue calculation
    const settings = await getSettings().catch(() => ({} as Record<string, string>))
    const avgSpendPerPerson = Number(settings['avg_spend_per_person'] ?? 25)
    const estimatedRevenue = Number(persons) * avgSpendPerPerson

    const webhookUrl = process.env.N8N_RESERVATION_WEBHOOK
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET
    if (!webhookUrl) {
      console.error('[api/reservations] N8N_RESERVATION_WEBHOOK is not set')
      return NextResponse.json(
        { success: false, error: 'Reservierungsdienst nicht verfügbar. Bitte versuche es später erneut.' },
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
        name,
        email,
        phone: body.phone ?? null,
        reservation_time,
        persons: Number(persons),
        notes: body.notes ?? null,
        marketing_consent: Boolean(body.marketing_consent),
        avg_spend_per_person: avgSpendPerPerson,
        estimated_revenue: estimatedRevenue,
      }),
    })

    const json = await n8nRes.json().catch(() => ({}))

    if (!n8nRes.ok) {
      console.error('[api/reservations] n8n returned', n8nRes.status, json)
      return NextResponse.json(
        { success: false, error: json.error || 'Reservierung fehlgeschlagen. Bitte versuche es erneut.' },
        { status: n8nRes.status, headers: CORS }
      )
    }

    return NextResponse.json({ success: true, id: json.id ?? reservationId }, { headers: CORS })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unbekannter Fehler'
    console.error('[api/reservations] unexpected error:', msg)
    return NextResponse.json({ success: false, error: msg }, { status: 500, headers: CORS })
  }
}
