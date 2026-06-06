import { supabase } from '@/lib/supabase'
import type { Deal, Rating } from '@/types'

// ─── Create Deal ───────────────────────────────────────
export async function createDeal(
  sellerId: string,
  buyerId: string,
  agreedPrice: number,
  description?: string
): Promise<Deal> {
  const { data, error } = await supabase
    .from('deals')
    .insert({
      seller_id: sellerId,
      buyer_id: buyerId,
      agreed_price: agreedPrice,
      commission_amount: 0, // calculated by DB trigger
      commission_percent: 0,
      description: description ?? null,
      status: 'pending',
    })
    .select()
    .single()

  if (error) throw error
  return data as Deal
}

// ─── Confirm Deal ──────────────────────────────────────
export async function confirmDeal(dealId: string): Promise<Deal> {
  const { data, error } = await supabase
    .from('deals')
    .update({ status: 'confirmed' })
    .eq('id', dealId)
    .select()
    .single()

  if (error) throw error
  return data as Deal
}

// ─── Complete Deal ─────────────────────────────────────
export async function completeDeal(dealId: string): Promise<Deal> {
  const { data, error } = await supabase
    .from('deals')
    .update({ status: 'completed' })
    .eq('id', dealId)
    .select()
    .single()

  if (error) throw error
  return data as Deal
}

// ─── Get Deals for Buyer ───────────────────────────────
export async function getBuyerDeals(buyerId: string): Promise<Deal[]> {
  const { data, error } = await supabase
    .from('deals')
    .select('*, seller:sellers(full_name, wilaya, phone, rating_avg)')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Deal[]
}

// ─── Get Deals for Seller ──────────────────────────────
export async function getSellerDeals(sellerId: string): Promise<Deal[]> {
  const { data, error } = await supabase
    .from('deals')
    .select('*, buyer:profiles(full_name, phone)')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Deal[]
}

// ─── Submit Rating ─────────────────────────────────────
export async function submitRating(
  sellerId: string,
  buyerId: string,
  dealId: string,
  stars: number,
  comment?: string
): Promise<Rating> {
  const { data, error } = await supabase
    .from('ratings')
    .upsert(
      {
        seller_id: sellerId,
        buyer_id: buyerId,
        deal_id: dealId,
        stars,
        comment: comment ?? null,
      },
      { onConflict: 'seller_id,buyer_id,deal_id' }
    )
    .select()
    .single()

  if (error) throw error
  return data as Rating
}

// ─── Get Seller Ratings ────────────────────────────────
export async function getSellerRatings(sellerId: string): Promise<Rating[]> {
  const { data, error } = await supabase
    .from('ratings')
    .select('*, buyer:profiles(full_name, avatar_url)')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return (data ?? []) as Rating[]
}
