import { supabase, BUCKETS, uploadFile } from '@/lib/supabase'
import type { Payment, PromotionRequest } from '@/types'

const CCP_ACCOUNT = import.meta.env.VITE_CCP_ACCOUNT as string

export { CCP_ACCOUNT }

// ─── Calculate Penalty ─────────────────────────────────
export function calculatePenalty(unpaidAmount: number, blockCount: number): number {
  const penaltyRates = [40, 60, 80, 100]
  if (blockCount === 0) return 0
  if (blockCount > penaltyRates.length) return unpaidAmount // permanent ban scenario
  const rate = penaltyRates[blockCount - 1]
  return Math.round(unpaidAmount * rate / 100)
}

// ─── Calculate Total Due ────────────────────────────────
export function calculateTotalDue(unpaidAmount: number, blockCount: number): number {
  return unpaidAmount + calculatePenalty(unpaidAmount, blockCount)
}

// ─── Submit Commission Payment ─────────────────────────
export async function submitCommissionPayment(
  sellerId: string,
  amount: number,
  penaltyAmount: number,
  receiptFile: File
): Promise<Payment> {
  const path = `${sellerId}/receipt-${Date.now()}`
  const receipt_url = await uploadFile(BUCKETS.RECEIPTS, path, receiptFile)

  const totalAmount = amount + penaltyAmount

  const { data, error } = await supabase
    .from('payments')
    .insert({
      seller_id: sellerId,
      amount,
      penalty_amount: penaltyAmount,
      total_amount: totalAmount,
      method: 'ccp',
      type: penaltyAmount > 0 ? 'penalty' : 'commission',
      receipt_url,
      status: 'pending',
    })
    .select()
    .single()

  if (error) throw error
  return data as Payment
}

// ─── Get Seller Payments ───────────────────────────────
export async function getSellerPayments(sellerId: string): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Payment[]
}

// ─── Get All Payments (Admin) ──────────────────────────
export async function getAllPaymentsAdmin(): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*, seller:sellers(full_name, wilaya, block_count)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Payment[]
}

// ─── Confirm Payment (Admin) ───────────────────────────
export async function confirmPayment(paymentId: string, note?: string): Promise<void> {
  const { error } = await supabase
    .from('payments')
    .update({
      status: 'confirmed',
      admin_note: note ?? null,
      confirmed_at: new Date().toISOString(),
    })
    .eq('id', paymentId)

  if (error) throw error
}

// ─── Reject Payment (Admin) ────────────────────────────
export async function rejectPayment(paymentId: string, reason: string): Promise<void> {
  const { error } = await supabase
    .from('payments')
    .update({ status: 'rejected', admin_note: reason })
    .eq('id', paymentId)

  if (error) throw error
}

// ─── Submit Promotion Request ──────────────────────────
export async function submitPromotionRequest(
  sellerId: string,
  weeks: number,
  receiptFile: File
): Promise<PromotionRequest> {
  const amount = weeks * 1000 // 1000 DZD/week
  const path = `${sellerId}/promo-${Date.now()}`
  const receipt_url = await uploadFile(BUCKETS.RECEIPTS, path, receiptFile)

  const { data, error } = await supabase
    .from('promotion_requests')
    .insert({
      seller_id: sellerId,
      weeks,
      amount,
      receipt_url,
      status: 'pending',
    })
    .select()
    .single()

  if (error) throw error
  return data as PromotionRequest
}

// ─── Get All Promotion Requests (Admin) ────────────────
export async function getAllPromotionRequestsAdmin(): Promise<PromotionRequest[]> {
  const { data, error } = await supabase
    .from('promotion_requests')
    .select('*, seller:sellers(full_name, wilaya, promoted)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as PromotionRequest[]
}

// ─── Confirm Promotion (Admin) ─────────────────────────
export async function confirmPromotion(promotionId: string): Promise<void> {
  const { error } = await supabase
    .from('promotion_requests')
    .update({ status: 'confirmed' })
    .eq('id', promotionId)

  if (error) throw error
}

// ─── Check & Auto-Block Overdue Sellers (cron-like) ───
export async function checkAndBlockOverdueSellers(): Promise<string[]> {
  // Sellers whose payment_deadline has passed
  const { data, error } = await supabase
    .from('sellers')
    .select('id')
    .eq('status', 'active')
    .not('payment_deadline', 'is', null)
    .lt('payment_deadline', new Date().toISOString())

  if (error) throw error
  if (!data || data.length === 0) return []

  const blockedIds: string[] = []
  for (const seller of data) {
    await supabase.rpc('block_seller_for_nonpayment', { p_seller_id: seller.id })
    blockedIds.push(seller.id)
  }

  return blockedIds
}
