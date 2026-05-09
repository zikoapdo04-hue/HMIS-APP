import type { Timestamp } from 'firebase/firestore'

/** Safely convert any Firestore date value to a JS Date */
function toJsDate(ts: unknown): Date {
  if (!ts) return new Date(0)
  // Real Firestore Timestamp object
  if (typeof (ts as Timestamp).toDate === 'function') return (ts as Timestamp).toDate()
  // Plain object with seconds/nanoseconds (Firestore REST / serialised)
  if (typeof (ts as { seconds?: number }).seconds === 'number') {
    return new Date((ts as { seconds: number }).seconds * 1000)
  }
  // Already a Date
  if (ts instanceof Date) return ts
  // ISO string or millis
  const d = new Date(ts as string | number)
  return isNaN(d.getTime()) ? new Date(0) : d
}

export function toDate(ts: Timestamp): Date {
  return toJsDate(ts)
}

export function toISOString(ts: Timestamp): string {
  return toJsDate(ts).toISOString()
}

export function formatDate(ts: Timestamp, locale = 'ar-EG'): string {
  return toJsDate(ts).toLocaleDateString(locale, {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  })
}

export function formatTime(ts: Timestamp, locale = 'ar-EG'): string {
  return toJsDate(ts).toLocaleTimeString(locale, {
    hour:   '2-digit',
    minute: '2-digit',
  })
}

export function formatDateTime(ts: Timestamp, locale = 'ar-EG'): string {
  return toJsDate(ts).toLocaleString(locale, {
    year:   'numeric',
    month:  'short',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  })
}

export function isAppointmentDue(date: Timestamp, withinMs = 30 * 60 * 1000): boolean {
  const diff = toJsDate(date).getTime() - Date.now()
  return diff > 0 && diff <= withinMs
}

export function isAppointmentPast(date: Timestamp): boolean {
  return toJsDate(date).getTime() < Date.now()
}
