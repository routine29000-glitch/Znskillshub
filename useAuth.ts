import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth.store'
import { signIn, signOut, signUp, getCurrentProfile } from '@/services/auth.service'
import { getSellerByProfileId } from '@/services/seller.service'
import type { LoginForm, SignupForm } from '@/types'
import toast from 'react-hot-toast'

export function useAuth() {
  const { profile, seller, isLoading, setProfile, setSeller, setLoading, reset } = useAuthStore()
  const qc = useQueryClient()

  // Sign in
  const loginMutation = useMutation({
    mutationFn: (form: LoginForm) => signIn(form),
    onSuccess: async (data) => {
      if (data.user) {
        const p = await getCurrentProfile()
        setProfile(p)
        if (p?.role === 'seller') {
          const s = await getSellerByProfileId(data.user.id)
          setSeller(s)
        }
      }
      toast.success('مرحباً بك! 👋')
    },
    onError: () => toast.error('بيانات الدخول غير صحيحة'),
  })

  // Sign up
  const signupMutation = useMutation({
    mutationFn: (form: SignupForm) => signUp(form),
    onSuccess: (p) => {
      setProfile(p)
      toast.success('تم إنشاء حسابك بنجاح! 🎉')
    },
    onError: () => toast.error('فشل إنشاء الحساب. البريد مستخدم مسبقاً.'),
  })

  // Sign out
  const logoutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      reset()
      qc.clear()
      toast.success('تم تسجيل الخروج')
    },
  })

  return {
    profile,
    seller,
    isLoading,
    isAuthenticated: !!profile,
    isSeller: profile?.role === 'seller',
    isAdmin: profile?.role === 'admin',

    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout: logoutMutation.mutate,

    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
  }
}

// Hook to fetch current seller dashboard data
export function useSellerDashboard() {
  const { seller } = useAuthStore()

  return useQuery({
    queryKey: ['seller-dashboard', seller?.id],
    queryFn: async () => {
      if (!seller?.id) return null
      const { data } = await import('@/services/seller.service').then(m =>
        m.getSellerById(seller.id)
      )
      return data
    },
    enabled: !!seller?.id,
    refetchInterval: 30_000, // refresh every 30s for commission updates
  })
}
