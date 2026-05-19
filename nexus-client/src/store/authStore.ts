import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthStore {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setTokens: (accessToken, refreshToken) => {
        // Also store in localStorage for axios interceptor
        // localStorage.setItem('accessToken', accessToken)
        // localStorage.setItem('refreshToken', refreshToken)
        set({ accessToken, refreshToken })
      },
      setUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({ user: null, accessToken: null, refreshToken: null })
      },
    }),
    { name: 'nexus-auth' }
  )
)