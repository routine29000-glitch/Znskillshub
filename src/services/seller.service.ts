import { supabase, BUCKETS, uploadFile } from '@/lib/supabase'
import type { Seller, RegisterSellerForm, SearchFilters, SearchResult } from '@/types'

// ─── Register New Seller ───────────────────────────────
export async function registerSeller(
  profileId: string,
  form: RegisterSellerForm,
  gps: { lat: number; lng: number } | null
): Promise<Seller> {
  const sellerId = crypto.randomUUID()
  const basePath = `${profileId}/${sellerId}`

  // Upload all 4 documents in parallel
  const [selfie_url, id_front_url, id_back_url, diploma_url] = await Promise.all([
    uploadFile(BUCKETS.VERIFICATIONS, `${basePath}/selfie`, form.selfie),
    uploadFile(BUCKETS.VERIFICATIONS, `${basePath}/id_front`, form.id_front),
    uploadFile(BUCKETS.VERIFICATIONS, `${basePath}/id_back`, form.id_back),
    uploadFile(BUCKETS.VERIFICATIONS, `${basePath}/diploma`, form.diploma),
  ])

  const { data, error } = await supabase
    .from('sellers')
    .insert({
      id: sellerId,
      profile_id: profileId,
      full_name: form.full_name,
      category_id: form.category_id,
      subcategory: form.subcategory ?? null,
      description: form.description ?? null,
      wilaya: form.wilaya,
      commune: form.commune,
      gps_lat: gps?.lat ?? null,
      gps_lng: gps?.lng ?? null,
      phone: form.phone,
      whatsapp: form.whatsapp ?? null,
      selfie_url,
      id_front_url,
      id_back_url,
      diploma_url,
      status: 'pending',
      free_deals_remaining: 10,
    })
    .select('*, category:categories(*)')
    .single()

  if (error) throw error
  return data as Seller
}

// ─── Get Single Seller ─────────────────────────────────
export async function getSellerById(id: string): Promise<Seller> {
  const { data, error } = await supabase
    .from('sellers')
    .select('*, category:categories(*), profile:profiles(*)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Seller
}

// ─── Get Seller by Profile ID ──────────────────────────
export async function getSellerByProfileId(profileId: string): Promise<Seller | null> {
  const { data, error } = await supabase
    .from('sellers')
    .select('*, category:categories(*)')
    .eq('profile_id', profileId)
    .maybeSingle()

  if (error) throw error
  return data as Seller | null
}

// ─── Search Sellers (with priority algorithm) ──────────
export async function searchSellers(filters: SearchFilters): Promise<SearchResult> {
  // If GPS provided, use the DB function
  if (filters.user_lat && filters.user_lng) {
    const { data, error } = await supabase.rpc('search_sellers_by_distance', {
      p_lat: filters.user_lat,
      p_lng: filters.user_lng,
      p_category_id: filters.category_id ?? null,
      p_wilaya: filters.wilaya ?? null,
      p_radius_km: 200,
    })
    if (error) throw error

    const all = data as Seller[]
    return {
      promoted_same_wilaya: all.filter(s => s.promoted && s.wilaya === filters.wilaya),
      promoted_nearby: all.filter(s => s.promoted && s.wilaya !== filters.wilaya),
      verified_closest: all.filter(s => !s.promoted && s.verified),
      others: all.filter(s => !s.promoted && !s.verified),
    }
  }

  // Standard search without GPS
  let query = supabase
    .from('sellers')
    .select('*, category:categories(*)')
    .eq('status', 'active')

  if (filters.category_id) query = query.eq('category_id', filters.category_id)
  if (filters.wilaya) query = query.eq('wilaya', filters.wilaya)
  if (filters.verified_only) query = query.eq('verified', true)
  if (filters.min_rating) query = query.gte('rating_avg', filters.min_rating)
  if (filters.query) {
    query = query.or(
      `full_name.ilike.%${filters.query}%,description.ilike.%${filters.query}%,subcategory.ilike.%${filters.query}%`
    )
  }

  // Sorting
  switch (filters.sort_by) {
    case 'rating':
      query = query.order('rating_avg', { ascending: false })
      break
    case 'deals':
      query = query.order('total_deals', { ascending: false })
      break
    default:
      // Default: promoted first, then rating
      query = query.order('promoted', { ascending: false }).order('rating_avg', { ascending: false })
  }

  const { data, error } = await query.limit(60)
  if (error) throw error

  const all = (data ?? []) as Seller[]

  return {
    promoted_same_wilaya: all.filter(s => s.promoted && (!filters.wilaya || s.wilaya === filters.wilaya)),
    promoted_nearby: all.filter(s => s.promoted && filters.wilaya && s.wilaya !== filters.wilaya),
    verified_closest: all.filter(s => !s.promoted && s.verified),
    others: all.filter(s => !s.promoted && !s.verified),
  }
}

// ─── Get Promoted Sellers (homepage) ──────────────────
export async function getPromotedSellers(wilaya?: string): Promise<Seller[]> {
  let query = supabase
    .from('sellers')
    .select('*, category:categories(*)')
    .eq('status', 'active')
    .eq('promoted', true)
    .gte('promoted_until', new Date().toISOString())
    .order('rating_avg', { ascending: false })
    .limit(8)

  if (wilaya) query = query.eq('wilaya', wilaya)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Seller[]
}

// ─── Update Seller Profile ─────────────────────────────
export async function updateSeller(
  id: string,
  updates: Partial<Pick<Seller, 'description' | 'subcategory' | 'phone' | 'whatsapp' | 'commune'>>
): Promise<Seller> {
  const { data, error } = await supabase
    .from('sellers')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Seller
}

// ─── Get All Sellers (Admin) ───────────────────────────
export async function getAllSellersAdmin(): Promise<Seller[]> {
  const { data, error } = await supabase
    .from('sellers')
    .select('*, category:categories(*), profile:profiles(*)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Seller[]
}

// ─── Block Seller (Admin) ──────────────────────────────
export async function blockSeller(sellerId: string): Promise<void> {
  const { error } = await supabase.rpc('block_seller_for_nonpayment', {
    p_seller_id: sellerId,
  })
  if (error) throw error
}

// ─── Verify Seller (Admin) ─────────────────────────────
export async function verifySeller(sellerId: string, notes?: string): Promise<void> {
  const { error } = await supabase
    .from('sellers')
    .update({
      verified: true,
      status: 'active',
      verification_notes: notes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sellerId)

  if (error) throw error
}

// ─── Reject Seller Verification (Admin) ───────────────
export async function rejectSellerVerification(sellerId: string, reason: string): Promise<void> {
  const { error } = await supabase
    .from('sellers')
    .update({
      verified: false,
      status: 'pending',
      verification_notes: reason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sellerId)

  if (error) throw error
}
