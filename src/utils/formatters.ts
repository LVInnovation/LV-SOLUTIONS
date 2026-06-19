import { parseIsoDate } from './dates'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR')

export function formatCurrency(value: number) {
  return currencyFormatter.format(Number(value) || 0)
}

export function formatDateBR(value?: string) {
  const parsed = parseIsoDate(value)
  return parsed ? dateFormatter.format(parsed) : 'Não informado'
}

export function normalizeUrl(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return ''
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return `https://${trimmed}`
}

export function parseTechnologies(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function formatTechnologies(technologies: string[]) {
  return technologies.filter(Boolean).join(', ')
}
