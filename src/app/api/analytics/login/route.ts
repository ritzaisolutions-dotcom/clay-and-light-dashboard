import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { getSettings } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    if (!password) {
      return NextResponse.json({ error: 'Passwort erforderlich.' }, { status: 400 })
    }

    const settings = await getSettings()
    const storedHash = settings['analytics_password']

    if (!storedHash) {
      return NextResponse.json(
        { error: 'Kein Passwort konfiguriert. Bitte zuerst in den Einstellungen setzen.' },
        { status: 503 }
      )
    }

    const inputHash = createHash('sha256').update(password).digest('hex')

    // Accept both SHA-256 hashed and plaintext stored passwords
    const matches = inputHash === storedHash || password === storedHash
    if (!matches) {
      return NextResponse.json({ error: 'Falsches Passwort.' }, { status: 401 })
    }

    const res = NextResponse.json({ ok: true })
    res.cookies.set('analytics_auth', '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      // No maxAge = session cookie: deleted when browser is closed
    })
    return res
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.message
        : typeof e === 'object' && e !== null && 'message' in e
        ? String((e as { message: unknown }).message)
        : JSON.stringify(e)
    return NextResponse.json({ error: `Server-Fehler: ${msg}` }, { status: 500 })
  }
}
