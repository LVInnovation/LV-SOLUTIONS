export function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function todayIsoDate() {
  const today = new Date()
  return toIsoDate(today)
}

export function toIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseIsoDate(value?: string) {
  if (!value) {
    return null
  }

  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) {
    return null
  }

  return new Date(year, month - 1, day)
}

export function isSameMonth(date: Date, comparison: Date) {
  return (
    date.getFullYear() === comparison.getFullYear() &&
    date.getMonth() === comparison.getMonth()
  )
}

export function daysBetween(later: Date, earlier: Date) {
  const msPerDay = 24 * 60 * 60 * 1000
  const startLater = new Date(
    later.getFullYear(),
    later.getMonth(),
    later.getDate(),
  )
  const startEarlier = new Date(
    earlier.getFullYear(),
    earlier.getMonth(),
    earlier.getDate(),
  )

  return Math.max(
    0,
    Math.floor((startLater.getTime() - startEarlier.getTime()) / msPerDay),
  )
}

export function dueDateForMonth(dueDay: number, today = new Date()) {
  const safeDueDay = Math.min(Math.max(Number(dueDay) || 1, 1), 31)
  const year = today.getFullYear()
  const month = today.getMonth()
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate()

  return new Date(year, month, Math.min(safeDueDay, lastDayOfMonth))
}
