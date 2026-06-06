import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, Seller } from '@/types'
import { supabase } from '@/lib/supabase'

interface AuthState {
  profile: Profile | null
  seller: Seller | null
  isLoading: boolean
  isAdminAuthed: boolean

  setProfile: (profile: Profile | null) => void
  setSeller: (seller: Seller | null) => void
  setLoading: (loading: boolean) => void
  setAdminAuthed: (v: boolean) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      profile: null,
      seller: null,
      isLoading: true,
      isAdminAuthed: false,

      setProfile: (profile) => set({ profile }),
      setSeller: (seller) => set({ seller }),
      setLoading: (isLoading) => set({ isLoading }),
      setAdminAuthed: (isAdminAuthed) => set({ isAdminAuthed }),
      reset: () => set({ profile: null, seller: null, isAdminAuthed: false }),
    }),
    {
      name: 'zn-auth',
      partialize: (state) => ({
        profile: state.profile,
        isAdminAuthed: state.isAdminAuthed,
      }),
    }
  )
)

// Initialize auth listener (call once in main.tsx)
export function initAuthListener() {
  supabase.auth.onAuthStateChange(async (event, session) => {
    const store = useAuthStore.getState()

    if (event === 'SIGNED_OUT' || !session) {
      store.reset()
      store.setLoading(false)
      return
    }

    if (session?.user) {
      store.setLoading(true)
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profile) store.setProfile(profile as Profile)

        // If seller role, fetch seller record
        if (profile?.role === 'seller') {
          const { data: seller } = await supabase
            .from('sellers')
            .select('*, category:categories(*)')
            .eq('profile_id', session.user.id)
            .maybeSingle()

          store.setSeller(seller as Seller | null)
        }
      } finally {
        store.setLoading(false)
      }
    }
  })
}
