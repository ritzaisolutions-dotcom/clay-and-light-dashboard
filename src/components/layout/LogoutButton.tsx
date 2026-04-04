'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/analytics/logout', { method: 'POST' })
    router.push('/analytics/login')
    router.refresh()
  }

  return (
    <button onClick={handleLogout} className="btn-secondary">
      <LogOut size={14} />
      Abmelden
    </button>
  )
}
