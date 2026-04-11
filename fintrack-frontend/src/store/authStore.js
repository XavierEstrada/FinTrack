import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  session: null,
  profile: null,
  loading: true,
  setSession: (session) => set({ session, loading: false }),
  setProfile: (profile) => set({ profile }),
  clearAuth: () => set({ session: null, profile: null }),
}))
