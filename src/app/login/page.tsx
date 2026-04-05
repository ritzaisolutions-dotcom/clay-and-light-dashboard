import type { Metadata } from 'next'
import { DashboardLoginForm } from '@/components/forms/DashboardLoginForm'

export const metadata: Metadata = { title: 'Anmelden' }

export default function LoginPage() {
  return <DashboardLoginForm />
}
