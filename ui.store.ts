import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light'
type Modal =
  | 'login'
  | 'signup'
  | 'register-seller'
  | 'payment'
  | 'promotion'
  | 'admin'
  | 'rating'
  | null

interface UIState {
  theme: Theme
  isMuted: boolean
  activeModal: Modal
  modalData: Record<string, unknown>

  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setMuted: (muted: boolean) => void
  toggleMuted: () => void
  openModal: (modal: Modal, data?: Record<string, unknown>) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      isMuted: false,
      activeModal: null,
      modalData: {},

      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: next })
        applyTheme(next)
      },

      setMuted: (isMuted) => set({ isMuted }),
      toggleMuted: () => set((s) => ({ isMuted: !s.isMuted })),

      openModal: (activeModal, data = {}) => set({ activeModal, modalData: data }),
      closeModal: () => set({ activeModal: null, modalData: {} }),
    }),
    {
      name: 'zn-ui',
      partialize: (s) => ({ theme: s.theme, isMuted: s.isMuted }),
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    }
  )
)

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
