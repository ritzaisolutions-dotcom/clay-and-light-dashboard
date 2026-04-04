'use client'

import { useState, FormEvent } from 'react'
import { updateSetting } from '@/lib/supabase'
import { Save, CheckCircle2, Eye, EyeOff } from 'lucide-react'

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export function AnalyticsPasswordForm() {
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (newPassword.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein.')
      return
    }
    if (newPassword !== confirm) {
      setError('Passwörter stimmen nicht überein.')
      return
    }

    setLoading(true)
    try {
      const hash = await sha256(newPassword)
      await updateSetting('analytics_password', hash)
      setSaved(true)
      setNewPassword('')
      setConfirm('')
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Fehler beim Speichern. Bitte versuche es erneut.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-pale-pistachio p-6">
      <label className="block text-sm font-medium text-ink mb-1">
        Analytics-Passwort
      </label>
      <p className="text-xs text-dusk mb-4">
        Schützt den Analytics-Bereich mit einem Passwort. Beim ersten Setzen wird der Bereich sofort gesperrt.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type={showNew ? 'text' : 'password'}
            placeholder="Neues Passwort"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="input-field pr-10"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowNew(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dusk hover:text-ink transition-colors"
          >
            {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Passwort bestätigen"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="input-field pr-10"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dusk hover:text-ink transition-colors"
          >
            {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading || !newPassword || !confirm}
          className={`btn-primary min-w-[140px] justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
            saved ? 'bg-pistachio hover:bg-pistachio/90' : ''
          }`}
        >
          {saved ? (
            <>
              <CheckCircle2 size={14} />
              Gespeichert
            </>
          ) : (
            <>
              <Save size={14} />
              {loading ? 'Speichere…' : 'Passwort setzen'}
            </>
          )}
        </button>
      </form>
    </div>
  )
}
