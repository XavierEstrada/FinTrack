import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  session:      null,
  profile:      null,
  loading:      true,
  isSigningOut: false,

  setSession:   (session) => set({ session, loading: false }),
  setProfile:   (profile) => set({ profile }),

  // Marca que se está cerrando sesión para bloquear re-autenticaciones por token refresh
  startSignOut: () => set({ isSigningOut: true }),

  // Limpia todo el estado de auth (resetea isSigningOut también)
  clearAuth: () => set({ session: null, profile: null, loading: false, isSigningOut: false }),
}))
