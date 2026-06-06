import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { searchSellers, getPromotedSellers, getSellerById, registerSeller } from '@/services/seller.service'
import type { SearchFilters, RegisterSellerForm } from '@/types'
import { useAuthStore } from '@/store/auth.store'
import toast from 'react-hot-toast'

export function useSearchSellers(filters: SearchFilters) {
  return useQuery({
    queryKey: ['sellers', 'search', filters],
    queryFn: () => searchSellers(filters),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  })
}

export function usePromotedSellers(wilaya?: string) {
  return useQuery({
    queryKey: ['sellers', 'promoted', wilaya],
    queryFn: () => getPromotedSellers(wilaya),
    staleTime: 2 * 60_000,
  })
}

export function useSellerById(id: string | undefined) {
  return useQuery({
    queryKey: ['seller', id],
    queryFn: () => getSellerById(id!),
    enabled: !!id,
  })
}

export function useRegisterSeller() {
  const qc = useQueryClient()
  const { profile, setSeller } = useAuthStore()

  return useMutation({
    mutationFn: ({
      form,
      gps,
    }: {
      form: RegisterSellerForm
      gps: { lat: number; lng: number } | null
    }) => {
      if (!profile) throw new Error('يجب تسجيل الدخول أولاً')
      return registerSeller(profile.id, form, gps)
    },
    onSuccess: (seller) => {
      setSeller(seller)
      qc.invalidateQueries({ queryKey: ['sellers'] })
      toast.success('تم إرسال طلبك! ستتلقى إشعاراً عند التوثيق 🎉')
    },
    onError: (e: Error) => toast.error(e.message || 'فشل التسجيل'),
  })
}
