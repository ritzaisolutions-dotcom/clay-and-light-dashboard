import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSettings } from '@/lib/supabase'

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const { name, email, timeslot, persons } = body
    if (!name || !email || !timeslot || !persons) {
      return NextResponse.json(
        { success: false, error: 'Pflichtfelder fehlen.' },
        { status: 400 }
      )
    }

    // Reject past dates
    if (new Date(timeslot) <= new Date()) {
      return NextResponse.json(
        { success: false, error: 'Der gewählte Termin liegt in der Vergangenheit.' },
        { status: 400 }
      )
    }

    // Availability check — reject if the slot is already taken
    const db = supabaseAdmin()
    const { data: conflicts, error: conflictError } = await db
      .from('pottery_bookings')
      .select('id')
      .eq('timeslot', new Date(timeslot).toISOString())
      .neq('status', 'cancelled')
      .limit(1)

    if (conflictError) {
      console.error('[api/bookings] availability check failed:', conflictError.message)
      // Log and continue — the DB unique constraint is the hard guard
    } else if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Dieser Termin ist bereits vergeben. Bitte wähle einen anderen Zeitpunkt.' },
        { status: 409 }
      )
    }

    // Idempotency key — becomes the Supabase record id
    const bookingId = crypto.randomUUID()

    // Fetch authoritative price from settings
    const settings = await getSettings().catch(() => ({} as Record<string, string>))
    const pricePerPerson = Number(settings['price_per_person'] ?? body.price_per_person ?? 45)
    const totalPrice = Number(persons) * pricePerPerson

    const webhookUrl = process.env.N8N_POTTERY_WEBHOOK
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET
    if (!webhookUrl) {
      console.error('[api/bookings] N8N_POTTERY_WEBHOOK is not set')
      return NextResponse.json(
        { success: false, error: 'Buchungsdienst nicht verfügbar. Bitte versuche es später erneut.' },
        { status: 503 }
      )
    }
    if (!webhookSecret) {
      console.error('[api/bookings] N8N_WEBHOOK_SECRET is not set')
      return NextResponse.json(
        { success: false, error: 'Buchungsdienst nicht konfiguriert.' },
        { status: 503 }
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
        name,
        email,
        phone: body.phone ?? null,
        timeslot,
        persons: Number(persons),
        notes: body.notes ?? null,
        marketing_consent: Boolean(body.marketing_consent),
        price_per_person: pricePerPerson,
        total_price: totalPrice,
      }),
    })

    const json = await n8nRes.json().catch(() => ({}))

    if (!n8nRes.ok) {
      console.error('[api/bookings] n8n returned', n8nRes.status, json)
      return NextResponse.json(
        { success: false, error: json.error || 'Buchung fehlgeschlagen. Bitte versuche es erneut.' },
        { status: n8nRes.status }
      )
    }

    return NextResponse.json({ success: true, id: json.id ?? bookingId })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unbekannter Fehler'
    console.error('[api/bookings] unexpected error:', msg)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
