import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  isDark: boolean
  toggle: () => void
}

export const useThemeStore = create<ThemeStore>()(
  // persist saves theme preference to localStorage
  persist(
    (set, get) => ({
      isDark: false,
      toggle: () => {
        const next = !get().isDark
        set({ isDark: next })
        // Apply dark class to html element
        document.documentElement.classList.toggle('dark', next)
      },
    }),
    { name: 'nexus-theme' }
  )
)