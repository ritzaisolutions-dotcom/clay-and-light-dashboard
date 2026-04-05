import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { getSettings, updateSetting } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Alle Felder sind erforderlich.' }, { status: 400 })
    }

    const settings = await getSettings()
    const storedHash = settings['analytics_password']

    if (!storedHash) {
      return NextResponse.json(
        { error: 'Kein Passwort konfiguriert.' },
        { status: 503 }
      )
    }

    const currentHash = createHash('sha256').update(currentPassword).digest('hex')
    const matches = currentHash === storedHash || currentPassword === storedHash
    if (!matches) {
      return NextResponse.json({ error: 'Aktuelles Passwort ist falsch.' }, { status: 401 })
    }

    const newHash = createHash('sha256').update(newPassword).digest('hex')
    await updateSetting('analytics_password', newHash)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server-Fehler.' }, { status: 500 })
  }
}
