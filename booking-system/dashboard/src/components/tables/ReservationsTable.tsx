'use client'

import { useState, useTransition } from 'react'
import type { Reservation, BookingStatus } from '@/lib/types'
import { updateReservationStatus } from '@/lib/supabase'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { ChevronUp, ChevronDown, Search, Filter, Mail, Phone } from 'lucide-react'
import clsx from 'clsx'

type SortField = 'created_at' | 'reservation_time' | 'name' | 'persons' | 'estimated_revenue' | 'status'
type SortDir = 'asc' | 'desc'

interface Props {
  initialData: Reservation[]
}

export function ReservationsTable({ initialData }: Props) {
  const [data, setData] = useState(initialData)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [isPending, startTransition] = useTransition()

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  function handleStatusChange(id: string, status: BookingStatus) {
    startTransition(async () => {
      await updateReservationStatus(id, status)
      setData(prev => prev.map(r => (r.id === id ? { ...r, status } : r)))
    })
  }

  const filtered = data
    .filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          (r.phone || '').includes(q)
        )
      }
      return true
    })
    .sort((a, b) => {
      let av: string | number = a[sortField] as string | number
      let bv: string | number = b[sortField] as string | number
      if (typeof av === 'string') av = av.toLowerCase()
      if (typeof bv === 'string') bv = bv.toLowerCase()
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronUp size={14} className="opacity-20" />
    return sortDir === 'asc'
      ? <ChevronUp size={14} className="text-pistachio" />
      : <ChevronDown size={14} className="text-pistachio" />
  }

  const totalRevenue = filtered
    .filter(r => r.status !== 'cancelled')
    .reduce((s, r) => s + r.estimated_revenue, 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dusk" />
          <input
            className="input-field pl-9"
            placeholder="Name, E-Mail oder Telefon suchen…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dusk pointer-events-none" />
          <select
            className="select-field pl-9 pr-8 min-w-36"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">Alle Status</option>
            <option value="confirmed">Bestätigt</option>
            <option value="completed">Abgeschlossen</option>
            <option value="cancelled">Storniert</option>
            <option value="pending">Ausstehend</option>
          </select>
        </div>
        <div className="text-sm text-dusk ml-auto">
          {filtered.length} Einträge · <span className="text-burgundy font-semibold">€ {totalRevenue.toFixed(0)}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-pale-pistachio overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="bg-cloud border-b border-pale-pistachio">
              <tr>
                {(
                  [
                    ['created_at',        'Erstellt'],
                    ['reservation_time',  'Reservierung'],
                    ['name',              'Name'],
                    ['persons',           'Pers.'],
                    ['estimated_revenue', 'Umsatz (est.)'],
                    ['status',            'Status'],
                  ] as [SortField, string][]
                ).map(([field, label]) => (
                  <th
                    key={field}
                    className="table-th cursor-pointer hover:text-ink select-none"
                    onClick={() => toggleSort(field)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {label}
                      <SortIcon field={field} />
                    </span>
                  </th>
                ))}
                <th className="table-th">Kontakt</th>
                <th className="table-th">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pale-pistachio/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-dusk text-sm">
                    Keine Reservierungen gefunden.
                  </td>
                </tr>
              ) : (
                filtered.map(r => (
                  <tr key={r.id} className="hover:bg-cloud/50 transition-colors">
                    <td className="table-td text-dusk">
                      {format(new Date(r.created_at), 'dd.MM.yy')}
                    </td>
                    <td className="table-td font-medium">
                      {format(new Date(r.reservation_time), 'dd.MM.yy', { locale: de })}<br />
                      <span className="text-dusk font-normal">
                        {format(new Date(r.reservation_time), 'HH:mm')} Uhr
                      </span>
                    </td>
                    <td className="table-td">
                      <p className="font-medium">{r.name}</p>
                      <p className="text-xs text-dusk">{r.email}</p>
                    </td>
                    <td className="table-td text-center">{r.persons}</td>
                    <td className="table-td font-semibold text-burgundy">
                      € {Number(r.estimated_revenue).toFixed(2)}
                    </td>
                    <td className="table-td">
                      <span className={`badge-${r.status}`}>{r.status}</span>
                    </td>
                    <td className="table-td">
                      <div className="flex gap-2">
                        <a href={`mailto:${r.email}`} className="text-dusk hover:text-pistachio transition-colors" title={r.email}>
                          <Mail size={14} />
                        </a>
                        {r.phone && (
                          <a href={`tel:${r.phone}`} className="text-dusk hover:text-pistachio transition-colors" title={r.phone}>
                            <Phone size={14} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="table-td">
                      <select
                        className="text-xs border border-pale-pistachio rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-pistachio"
                        value={r.status}
                        disabled={isPending}
                        onChange={e => handleStatusChange(r.id, e.target.value as BookingStatus)}
                      >
                        <option value="confirmed">Bestätigt</option>
                        <option value="completed">Abgeschlossen</option>
                        <option value="cancelled">Storniert</option>
                        <option value="pending">Ausstehend</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
