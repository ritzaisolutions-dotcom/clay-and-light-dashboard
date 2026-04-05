'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff } from 'lucide-react'

export function DashboardLoginForm() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
        router.push('/dashboard')
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
        <h1 className="font-display text-2xl text-burgundy text-center mb-1">Clay & Light</h1>
        <p className="text-sm text-dusk text-center mb-6">Dashboard · Bitte anmelden</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Passwort"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field pr-10"
              autoFocus
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dusk hover:text-ink transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
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
