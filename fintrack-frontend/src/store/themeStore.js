import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set) => ({
      dark: false,
      toggle: () =>
        set((s) => {
          const next = !s.dark
          document.documentElement.classList.toggle('dark', next)
          return { dark: next }
        }),
    }),
    { name: 'fintrack-theme' }
  )
)

// Aplica el tema guardado antes del primer render
const stored = JSON.parse(localStorage.getItem('fintrack-theme') || '{}')
if (stored?.state?.dark) document.documentElement.classList.add('dark')
