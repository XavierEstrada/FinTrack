import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

/**
 * Número que cuenta desde 0 hasta `value` al montar.
 * @param {number}   value     - Valor final
 * @param {function} formatter - Función que formatea el número (ej: formatCurrency)
 * @param {number}   duration  - Duración en segundos
 */
export default function AnimatedNumber({ value, formatter = (v) => v.toFixed(2), duration = 1 }) {
  const count = useMotionValue(0)
  const display = useTransform(count, formatter)

  useEffect(() => {
    const controls = animate(count, value, { duration, ease: 'easeOut' })
    return controls.stop
  }, [value])

  return <motion.span>{display}</motion.span>
}
