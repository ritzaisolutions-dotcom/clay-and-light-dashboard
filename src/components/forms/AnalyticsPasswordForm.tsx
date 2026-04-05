'use client'

import { useState, FormEvent } from 'react'
import { Save, CheckCircle2, Eye, EyeOff } from 'lucide-react'

function PasswordInput({
  placeholder,
  value,
  onChange,
  autoComplete,
}: {
  placeholder: string
  value: string
  onChange: (v: string) => void
  autoComplete?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input-field pr-10"
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-dusk hover:text-ink transition-colors"
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  )
}

export function AnalyticsPasswordForm() {
  const [current, setCurrent] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (newPw.length < 6) {
      setError('Neues Passwort muss mindestens 6 Zeichen lang sein.')
      return
    }
    if (newPw !== confirm) {
      setError('Neue Passwörter stimmen nicht überein.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/analytics/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: newPw }),
      })

      if (res.ok) {
        setSaved(true)
        setCurrent('')
        setNewPw('')
        setConfirm('')
        setTimeout(() => setSaved(false), 3000)
      } else {
        const data = await res.json()
        setError(data.error || 'Fehler beim Speichern.')
      }
    } catch {
      setError('Netzwerkfehler. Bitte versuche es erneut.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-pale-pistachio p-6">
      <label className="block text-sm font-medium text-ink mb-1">
        Analytics-Passwort ändern
      </label>
      <p className="text-xs text-dusk mb-4">
        Schützt den Analytics-Bereich. Das aktuelle Passwort wird zur Bestätigung benötigt.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <PasswordInput
          placeholder="Aktuelles Passwort"
          value={current}
          onChange={setCurrent}
          autoComplete="current-password"
        />
        <PasswordInput
          placeholder="Neues Passwort"
          value={newPw}
          onChange={setNewPw}
          autoComplete="new-password"
        />
        <PasswordInput
          placeholder="Neues Passwort bestätigen"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
        />

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading || !current || !newPw || !confirm}
          className={`btn-primary min-w-[160px] justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
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
              {loading ? 'Speichere…' : 'Passwort ändern'}
            </>
          )}
        </button>
      </form>
    </div>
  )
}
