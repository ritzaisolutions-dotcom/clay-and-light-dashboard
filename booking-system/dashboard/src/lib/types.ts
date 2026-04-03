export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'pending'

export interface PotteryBooking {
  id: string
  created_at: string
  name: string
  email: string
  phone: string | null
  timeslot: string
  persons: number
  price_per_person: number
  total_price: number
  notes: string | null
  marketing_consent: boolean
  status: BookingStatus
}

export interface Reservation {
  id: string
  created_at: string
  name: string
  email: string
  phone: string | null
  reservation_time: string
  persons: number
  notes: string | null
  avg_spend_per_person: number
  estimated_revenue: number
  status: BookingStatus
}

export interface Setting {
  key: string
  value: string
  updated_at: string
}

export interface AnalyticsSummary {
  totalPotteryRevenue: number
  totalReservationRevenue: number
  combinedRevenue: number
  avgPotteryPersons: number
  avgReservationPersons: number
  totalPotteryBookings: number
  totalReservations: number
  monthlyData: MonthlyDataPoint[]
}

export interface MonthlyDataPoint {
  month: string
  pottery: number
  reservations: number
  total: number
}
