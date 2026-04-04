'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'

const HIDE_SIDEBAR = ['/analytics/login']

export function ConditionalSidebar() {
  const pathname = usePathname()
  if (HIDE_SIDEBAR.some(p => pathname.startsWith(p))) return null
  return <Sidebar />
}
