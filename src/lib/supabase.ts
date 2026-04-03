import { createClient } from '@supabase/supabase-js'
import type { PotteryBooking, Reservation, Setting, AnalyticsSummary } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Pottery Bookings ──────────────────────────────────────────────────────────

export async function getPotteryBookings(filters?: {
  status?: string
  from?: string
  to?: string
  search?: string
}): Promise<PotteryBooking[]> {
  let query = supabase
    .from('pottery_bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }
  if (filters?.from) {
    query = query.gte('timeslot', filters.from)
  }
  if (filters?.to) {
    query = query.lte('timeslot', filters.to)
  }
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data as PotteryBooking[]
}

export async function updatePotteryBookingStatus(id: string, status: string) {
  const { error } = await supabase
    .from('pottery_bookings')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}

// ── Reservations ──────────────────────────────────────────────────────────────

export async function getReservations(filters?: {
  status?: string
  from?: string
  to?: string
  search?: string
}): Promise<Reservation[]> {
  let query = supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }
  if (filters?.from) {
    query = query.gte('reservation_time', filters.from)
  }
  if (filters?.to) {
    query = query.lte('reservation_time', filters.to)
  }
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Reservation[]
}

export async function updateReservationStatus(id: string, status: string) {
  const { error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('settings').select('*')
  if (error) throw error
  return Object.fromEntries((data as Setting[]).map(s => [s.key, s.value]))
}

export async function updateSetting(key: string, value: string) {
  const { error } = await supabase
    .from('settings')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', key)
  if (error) throw error
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export async function getAnalytics(): Promise<AnalyticsSummary> {
  const [potteryRes, reservationsRes, monthlyRes] = await Promise.all([
    supabase
      .from('pottery_bookings')
      .select('total_price, persons')
      .neq('status', 'cancelled'),
    supabase
      .from('reservations')
      .select('estimated_revenue, persons')
      .neq('status', 'cancelled'),
    supabase
      .from('monthly_revenue')
      .select('*')
      .order('month', { ascending: true })
      .limit(12),
  ])

  if (potteryRes.error) throw potteryRes.error
  if (reservationsRes.error) throw reservationsRes.error

  const pottery = potteryRes.data || []
  const reservations = reservationsRes.data || []
  const monthly = monthlyRes.data || []

  const totalPotteryRevenue = pottery.reduce((s, r) => s + (r.total_price || 0), 0)
  const totalReservationRevenue = reservations.reduce((s, r) => s + (r.estimated_revenue || 0), 0)

  // Aggregate monthly data into {month, pottery, reservations, total}
  const monthMap: Record<string, MonthlyRow> = {}
  for (const row of monthly) {
    const key = row.month as string
    if (!monthMap[key]) monthMap[key] = { month: key, pottery: 0, reservations: 0, total: 0 }
    if (row.source === 'pottery') monthMap[key].pottery = Number(row.revenue) || 0
    if (row.source === 'reservation') monthMap[key].reservations = Number(row.revenue) || 0
    monthMap[key].total = monthMap[key].pottery + monthMap[key].reservations
  }

  return {
    totalPotteryRevenue,
    totalReservationRevenue,
    combinedRevenue: totalPotteryRevenue + totalReservationRevenue,
    avgPotteryPersons: pottery.length
      ? pottery.reduce((s, r) => s + r.persons, 0) / pottery.length
      : 0,
    avgReservationPersons: reservations.length
      ? reservations.reduce((s, r) => s + r.persons, 0) / reservations.length
      : 0,
    totalPotteryBookings: pottery.length,
    totalReservations: reservations.length,
    monthlyData: Object.values(monthMap),
  }
}

interface MonthlyRow {
  month: string
  pottery: number
  reservations: number
  total: number
}
