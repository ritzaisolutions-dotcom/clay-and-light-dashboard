'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import type { MonthlyDataPoint } from '@/lib/types'
import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'

interface Props {
  data: MonthlyDataPoint[]
}

function formatMonth(dateStr: string) {
  try {
    return format(parseISO(dateStr), 'MMM yy', { locale: de })
  } catch {
    return dateStr
  }
}

function euroFormatter(value: number) {
  return `€ ${value.toFixed(0)}`
}

export function RevenueAreaChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPottery" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6B9A5A" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6B9A5A" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="colorReservations" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6B1E2E" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6B1E2E" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#C2D6B8" strokeOpacity={0.5} />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonth}
          tick={{ fontSize: 11, fill: '#9E9189' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={euroFormatter}
          tick={{ fontSize: 11, fill: '#9E9189' }}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            `€ ${value.toFixed(2)}`,
            name === 'pottery' ? 'Töpfern' : 'Tisch',
          ]}
          labelFormatter={formatMonth}
          contentStyle={{
            background: '#fff',
            border: '1px solid #C2D6B8',
            borderRadius: 6,
            fontSize: 12,
          }}
        />
        <Legend
          formatter={(value) => value === 'pottery' ? 'Töpfern' : 'Tisch'}
          wrapperStyle={{ fontSize: 12, color: '#9E9189' }}
        />
        <Area
          type="monotone"
          dataKey="pottery"
          stroke="#6B9A5A"
          strokeWidth={2}
          fill="url(#colorPottery)"
        />
        <Area
          type="monotone"
          dataKey="reservations"
          stroke="#6B1E2E"
          strokeWidth={2}
          fill="url(#colorReservations)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function RevenueBarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#C2D6B8" strokeOpacity={0.5} />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonth}
          tick={{ fontSize: 11, fill: '#9E9189' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={euroFormatter}
          tick={{ fontSize: 11, fill: '#9E9189' }}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            `€ ${value.toFixed(2)}`,
            name === 'pottery' ? 'Töpfern' : 'Tisch',
          ]}
          labelFormatter={formatMonth}
          contentStyle={{
            background: '#fff',
            border: '1px solid #C2D6B8',
            borderRadius: 6,
            fontSize: 12,
          }}
        />
        <Legend
          formatter={(value) => value === 'pottery' ? 'Töpfern' : 'Tisch'}
          wrapperStyle={{ fontSize: 12, color: '#9E9189' }}
        />
        <Bar dataKey="pottery" stackId="a" fill="#6B9A5A" radius={[0, 0, 0, 0]} />
        <Bar dataKey="reservations" stackId="a" fill="#6B1E2E" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
