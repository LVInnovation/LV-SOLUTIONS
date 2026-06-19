import type { ProjectStatus } from '../types/project'
import {
  daysBetween,
  dueDateForMonth,
  isSameMonth,
  parseIsoDate,
} from './dates'

export type PaymentStatusResult = {
  status: 'paid' | 'warning' | 'late' | 'inactive'
  label: string
  daysLate: number
  tone: 'green' | 'yellow' | 'red' | 'neutral'
  classes: string
}

export function calculatePaymentStatus(
  dueDay: number,
  lastPaymentDate: string,
  projectStatus: ProjectStatus,
  today = new Date(),
): PaymentStatusResult {
  if (projectStatus === 'cancelled' || projectStatus === 'inactive') {
    return {
      status: 'inactive',
      label: 'Cobrança inativa',
      daysLate: 0,
      tone: 'neutral',
      classes: 'border-slate-500/40 bg-slate-900/55 text-slate-200',
    }
  }

  const lastPayment = parseIsoDate(lastPaymentDate)
  const hasPaidCurrentMonth = lastPayment ? isSameMonth(lastPayment, today) : false
  const dueDate = dueDateForMonth(dueDay, today)

  if (hasPaidCurrentMonth || today <= dueDate) {
    return {
      status: 'paid',
      label: 'Em dia',
      daysLate: 0,
      tone: 'green',
      classes: 'border-emerald-400/50 bg-emerald-950/35 text-emerald-200',
    }
  }

  const daysLate = daysBetween(today, dueDate)
  const singular = daysLate === 1 ? 'dia' : 'dias'

  if (daysLate <= 7) {
    return {
      status: 'warning',
      label: `Vencido há ${daysLate} ${singular}`,
      daysLate,
      tone: 'yellow',
      classes: 'border-amber-300/55 bg-amber-950/35 text-amber-100',
    }
  }

  return {
    status: 'late',
    label: `Atrasado há ${daysLate} ${singular}`,
    daysLate,
    tone: 'red',
    classes: 'border-rose-400/55 bg-rose-950/35 text-rose-100',
  }
}
