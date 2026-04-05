import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { getSettings } from '@/lib/supabase'

function setAuthCookie(res: NextResponse) {
  res.cookies.set('analytics_auth', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // No maxAge = session cookie: deleted when browser is closed
  })
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    if (!password) {
      return NextResponse.json({ error: 'Passwort erforderlich.' }, { status: 400 })
    }

    // Primary: check DASHBOARD_PASSWORD env var (bypasses Supabase entirely)
    const envPassword = process.env.DASHBOARD_PASSWORD
    if (envPassword) {
      if (password === envPassword) {
        const res = NextResponse.json({ ok: true })
        setAuthCookie(res)
        return res
      }
      return NextResponse.json({ error: 'Falsches Passwort.' }, { status: 401 })
    }

    // Fallback: read from Supabase settings table
    const settings = await getSettings()
    const storedHash = settings['analytics_password']

    if (!storedHash) {
      return NextResponse.json(
        { error: 'Kein Passwort konfiguriert. Bitte DASHBOARD_PASSWORD in Vercel setzen.' },
        { status: 503 }
      )
    }

    const inputHash = createHash('sha256').update(password).digest('hex')
    const matches = inputHash === storedHash || password === storedHash
    if (!matches) {
      return NextResponse.json({ error: 'Falsches Passwort.' }, { status: 401 })
    }

    const res = NextResponse.json({ ok: true })
    setAuthCookie(res)
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
