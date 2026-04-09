type Ok<T> = { ok: true; value: T }
type Err = { ok: false; error: string }
type Result<T> = Ok<T> | Err

function ok<T>(value: T): Ok<T> {
  return { ok: true, value }
}
function err(error: string): Err {
  return { ok: false, error }
}

export function validateRequiredText(value: unknown, fieldName: string): Result<string> {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return err(`${fieldName} darf nicht leer sein.`)
  }
  return ok(value.trim())
}

export function validateEmail(value: unknown): Result<string> {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return err('E-Mail-Adresse darf nicht leer sein.')
  }
  const trimmed = value.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return err('Bitte gib eine gueltige E-Mail-Adresse ein.')
  }
  return ok(trimmed)
}

export function validatePersonCount(
  value: unknown,
  min: number,
  max: number,
  fieldName: string
): Result<number> {
  const n = Number(value)
  if (!Number.isInteger(n) || n < min || n > max) {
    return err(`${fieldName} muss zwischen ${min} und ${max} liegen.`)
  }
  return ok(n)
}

export function parseIsoDate(value: unknown, fieldName: string): Result<Date> {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return err(`${fieldName} fehlt.`)
  }
  const d = new Date(value)
  if (isNaN(d.getTime())) {
    return err(`${fieldName} ist kein gueltiges Datum.`)
  }
  return ok(d)
}

// Pottery: fixed 150-min slots starting at 10:00 and 16:00 (venue local time CET/CEST).
// The client sends a UTC ISO string built from local date + slot start time.
// We accept any valid future date here — slot-hour enforcement happens client-side.
// Returns the ISO string to store in the DB.
export function validatePotterySlot(date: Date): Result<string> {
  if (isNaN(date.getTime())) {
    return err('Ungültiger Slot-Zeitpunkt.')
  }
  return ok(date.toISOString())
}

// Reservations: 15-min slots within venue opening hours.
// Opening hours (CET/CEST): Sun/Tue–Thu 09:00–18:00, Fri–Sat 11:00–22:00, Mon closed.
// Timezone-aware hour validation is left to the client; server checks structural validity.
// Returns the ISO string to store in the DB.
export function validateReservationSlot(date: Date): Result<string> {
  if (isNaN(date.getTime())) {
    return err('Ungültiger Reservierungszeitpunkt.')
  }
  return ok(date.toISOString())
}
