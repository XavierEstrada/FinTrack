import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  formatCurrency,
  formatDate,
  formatRelativeDate,
  monthLabel,
  toYearMonth,
  monthDisplay,
  getAvatarGradient,
} from '../lib/utils'

// ─── formatCurrency ───────────────────────────────────────────────────────────

describe('formatCurrency', () => {
  it('formatea USD correctamente', () => {
    expect(formatCurrency(1500, 'USD')).toBe('$1,500.00')
  })

  it('formatea cero', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00')
  })

  it('formatea decimales', () => {
    expect(formatCurrency(9.99, 'USD')).toBe('$9.99')
  })

  it('usa USD como moneda por defecto', () => {
    expect(formatCurrency(100)).toBe('$100.00')
  })

  it('formatea EUR con símbolo distinto', () => {
    const result = formatCurrency(200, 'EUR')
    expect(result).toContain('200')
    expect(result).not.toContain('$')
  })
})

// ─── toYearMonth ──────────────────────────────────────────────────────────────

describe('toYearMonth', () => {
  it('convierte una fecha a formato YYYY-MM', () => {
    expect(toYearMonth(new Date(2026, 3, 15))).toBe('2026-04')  // mes 3 = abril
  })

  it('agrega cero a meses de un dígito', () => {
    expect(toYearMonth(new Date(2026, 0, 1))).toBe('2026-01')   // mes 0 = enero
  })

  it('maneja diciembre correctamente', () => {
    expect(toYearMonth(new Date(2025, 11, 31))).toBe('2025-12') // mes 11 = diciembre
  })
})

// ─── monthLabel ───────────────────────────────────────────────────────────────

describe('monthLabel', () => {
  it('devuelve abreviatura del mes en español', () => {
    expect(monthLabel('2026-04')).toMatch(/abr/i)
  })

  it('devuelve la abreviatura correcta para enero', () => {
    expect(monthLabel('2026-01')).toMatch(/ene/i)
  })

  it('devuelve la abreviatura correcta para diciembre', () => {
    expect(monthLabel('2025-12')).toMatch(/dic/i)
  })
})

// ─── monthDisplay ─────────────────────────────────────────────────────────────

describe('monthDisplay', () => {
  it('devuelve el mes en mayúscula con el año', () => {
    const result = monthDisplay('2026-04')
    expect(result).toMatch(/abril/i)
    expect(result).toContain('2026')
  })

  it('empieza con mayúscula', () => {
    const result = monthDisplay('2026-01')
    expect(result[0]).toBe(result[0].toUpperCase())
  })
})

// ─── formatDate ───────────────────────────────────────────────────────────────

describe('formatDate', () => {
  it('formatea una fecha ISO en español', () => {
    const result = formatDate('2026-04-15')
    expect(result).toContain('2026')
    expect(result).toContain('15')
  })
})

// ─── formatRelativeDate ───────────────────────────────────────────────────────

describe('formatRelativeDate', () => {
  let now

  beforeEach(() => {
    // Fijamos la fecha del sistema para que los tests sean deterministas
    now = new Date('2026-04-15T12:00:00')
    vi.setSystemTime(now)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('devuelve "Hoy" para la fecha actual', () => {
    expect(formatRelativeDate('2026-04-15')).toBe('Hoy')
  })

  it('devuelve "Ayer" para el día anterior', () => {
    expect(formatRelativeDate('2026-04-14')).toBe('Ayer')
  })

  it('devuelve días para fechas recientes', () => {
    expect(formatRelativeDate('2026-04-12')).toBe('Hace 3 días')
  })

  it('devuelve semanas para fechas de más de 7 días', () => {
    expect(formatRelativeDate('2026-04-07')).toBe('Hace 1 sem.')
  })

  it('devuelve "Mañana" para el día siguiente', () => {
    expect(formatRelativeDate('2026-04-16')).toBe('Mañana')
  })
})

// ─── getAvatarGradient ────────────────────────────────────────────────────────

describe('getAvatarGradient', () => {
  it('devuelve un string con linear-gradient', () => {
    expect(getAvatarGradient('Xavier')).toContain('linear-gradient')
  })

  it('devuelve el mismo gradiente para el mismo nombre', () => {
    expect(getAvatarGradient('Ana')).toBe(getAvatarGradient('Ana'))
  })

  it('funciona con string vacío', () => {
    expect(getAvatarGradient('')).toContain('linear-gradient')
  })
})
