'use client'

import { useState, useTransition } from 'react'
import type { PotteryBooking, BookingStatus } from '@/lib/types'
import { updatePotteryBookingStatus } from '@/lib/supabase'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import {
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
} from 'lucide-react'
import clsx from 'clsx'

type SortField = 'created_at' | 'timeslot' | 'name' | 'persons' | 'total_price' | 'status'
type SortDir = 'asc' | 'desc'

interface Props {
  initialData: PotteryBooking[]
}

export function BookingsTable({ initialData }: Props) {
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
      await updatePotteryBookingStatus(id, status)
      setData(prev => prev.map(b => (b.id === id ? { ...b, status } : b)))
    })
  }

  const filtered = data
    .filter(b => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          b.name.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q) ||
          (b.phone || '').includes(q)
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
    .filter(b => b.status !== 'cancelled')
    .reduce((s, b) => s + b.total_price, 0)

  return (
    <div className="space-y-4">
      {/* Filters */}
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

      {/* Table */}
      <div className="bg-white rounded-lg border border-pale-pistachio overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-cloud border-b border-pale-pistachio">
              <tr>
                {(
                  [
                    ['created_at', 'Erstellt'],
                    ['timeslot',   'Termin'],
                    ['name',       'Name'],
                    ['persons',    'Pers.'],
                    ['total_price','Betrag'],
                    ['status',     'Status'],
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
                <th className="table-th">Marketing</th>
                <th className="table-th">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pale-pistachio/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-dusk text-sm">
                    Keine Buchungen gefunden.
                  </td>
                </tr>
              ) : (
                filtered.map(b => (
                  <tr key={b.id} className="hover:bg-cloud/50 transition-colors">
                    <td className="table-td text-dusk">
                      {format(new Date(b.created_at), 'dd.MM.yy')}
                    </td>
                    <td className="table-td font-medium">
                      {format(new Date(b.timeslot), 'dd.MM.yy', { locale: de })}<br />
                      <span className="text-dusk font-normal">
                        {format(new Date(b.timeslot), 'HH:mm')} Uhr
                      </span>
                    </td>
                    <td className="table-td">
                      <p className="font-medium">{b.name}</p>
                      <p className="text-xs text-dusk">{b.email}</p>
                    </td>
                    <td className="table-td text-center">{b.persons}</td>
                    <td className="table-td font-semibold text-burgundy">
                      € {Number(b.total_price).toFixed(2)}
                    </td>
                    <td className="table-td">
                      <span className={`badge-${b.status}`}>{b.status}</span>
                    </td>
                    <td className="table-td">
                      <div className="flex gap-2">
                        <a
                          href={`mailto:${b.email}`}
                          className="text-dusk hover:text-pistachio transition-colors"
                          title={b.email}
                        >
                          <Mail size={14} />
                        </a>
                        {b.phone && (
                          <a
                            href={`tel:${b.phone}`}
                            className="text-dusk hover:text-pistachio transition-colors"
                            title={b.phone}
                          >
                            <Phone size={14} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="table-td">
                      {b.marketing_consent
                        ? <CheckCircle2 size={14} className="text-pistachio" />
                        : <XCircle size={14} className="text-dusk/40" />
                      }
                    </td>
                    <td className="table-td">
                      <select
                        className="text-xs border border-pale-pistachio rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-pistachio"
                        value={b.status}
                        disabled={isPending}
                        onChange={e => handleStatusChange(b.id, e.target.value as BookingStatus)}
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
