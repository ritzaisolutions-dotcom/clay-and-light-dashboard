'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export function AnalyticsLoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/analytics/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/analytics')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Anmeldung fehlgeschlagen.')
      }
    } catch {
      setError('Netzwerkfehler. Bitte versuche es erneut.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-cloud flex items-center justify-center z-50">
      <div className="bg-white rounded-lg border border-pale-pistachio p-8 w-full max-w-sm shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-burgundy/10">
            <Lock size={22} className="text-burgundy" />
          </div>
        </div>
        <h1 className="font-display text-2xl text-burgundy text-center mb-1">Analytics</h1>
        <p className="text-sm text-dusk text-center mb-6">Bitte Passwort eingeben</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input-field"
            autoFocus
            autoComplete="current-password"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Prüfe…' : 'Anmelden'}
          </button>
        </form>
      </div>
    </div>
  )
}
