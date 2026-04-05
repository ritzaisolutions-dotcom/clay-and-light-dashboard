import type { Metadata } from 'next'
import { AnalyticsLoginForm } from '@/components/forms/AnalyticsLoginForm'

export const metadata: Metadata = { title: 'Analytics Login' }

export default function AnalyticsLoginPage() {
  return <AnalyticsLoginForm />
}
