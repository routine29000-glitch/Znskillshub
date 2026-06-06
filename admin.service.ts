import { supabase } from '@/lib/supabase'
import type { DashboardStats, AdminLog } from '@/types'
import { verifySeller, rejectSellerVerification, blockSeller } from './seller.service'
import { confirmPayment, rejectPayment, confirmPromotion } from './payment.service'
import { createNotification, NotificationTemplates } from './notification.service'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string

// ─── Verify Admin Password ─────────────────────────────
export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

// ─── Log Admin Action ──────────────────────────────────
async function logAction(
  adminId: string,
  action: string,
  targetType: string,
  targetId: string,
  notes?: string
): Promise<void> {
  await supabase.from('admin_logs').insert({
    admin_id: adminId,
    action,
    target_type: targetType,
    target_id: targetId,
    notes: notes ?? null,
  })
}

// ─── Dashboard Stats ───────────────────────────────────
export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    { count: totalSellers },
    { count: activeSellers },
    { count: pendingVerification },
    { count: blockedSellers },
    dealsResult,
    paymentsResult,
    unpaidResult,
    promoResult,
  ] = await Promise.all([
    supabase.from('sellers').select('id', { count: 'exact', head: true }),
    supabase.from('sellers').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('sellers').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('sellers').select('id', { count: 'exact', head: true }).in('status', ['blocked', 'permanently_banned']),
    supabase.from('deals').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase
      .from('payments')
      .select('total_amount')
      .eq('status', 'confirmed')
      .gte('confirmed_at', new Date(new Date().setDate(1)).toISOString()),
    supabase
      .from('sellers')
      .select('unpaid_commission')
      .gt('unpaid_commission', 0),
    supabase.from('sellers').select('id', { count: 'exact', head: true }).eq('promoted', true),
  ])

  const monthlyRevenue = (paymentsResult.data ?? []).reduce(
    (sum, p) => sum + (p.total_amount as number),
    0
  )
  const totalUnpaid = (unpaidResult.data ?? []).reduce(
    (sum, s) => sum + (s.unpaid_commission as number),
    0
  )

  return {
    total_sellers: totalSellers ?? 0,
    active_sellers: activeSellers ?? 0,
    pending_verification: pendingVerification ?? 0,
    blocked_sellers: blockedSellers ?? 0,
    total_deals: dealsResult.count ?? 0,
    monthly_revenue: monthlyRevenue,
    unpaid_commissions: totalUnpaid,
    active_promotions: promoResult.count ?? 0,
  }
}

// ─── Admin: Approve Seller ─────────────────────────────
export async function adminApproveSeller(
  adminId: string,
  sellerId: string,
  sellerProfileId: string
): Promise<void> {
  await verifySeller(sellerId)
  await logAction(adminId, 'verify_seller', 'seller', sellerId)

  const tmpl = NotificationTemplates.verificationApproved()
  await createNotification(sellerProfileId, tmpl.type, tmpl.title, tmpl.message)
}

// ─── Admin: Reject Seller ──────────────────────────────
export async function adminRejectSeller(
  adminId: string,
  sellerId: string,
  sellerProfileId: string,
  reason: string
): Promise<void> {
  await rejectSellerVerification(sellerId, reason)
  await logAction(adminId, 'reject_seller', 'seller', sellerId, reason)

  const tmpl = NotificationTemplates.verificationRejected(reason)
  await createNotification(sellerProfileId, tmpl.type, tmpl.title, tmpl.message)
}

// ─── Admin: Block Seller ───────────────────────────────
export async function adminBlockSeller(
  adminId: string,
  sellerId: string,
  sellerProfileId: string,
  blockCount: number
): Promise<void> {
  await blockSeller(sellerId)
  await logAction(adminId, 'block_seller', 'seller', sellerId)

  const tmpl = NotificationTemplates.accountBlocked(blockCount + 1)
  await createNotification(sellerProfileId, tmpl.type, tmpl.title, tmpl.message)
}

// ─── Admin: Confirm Payment ────────────────────────────
export async function adminConfirmPayment(
  adminId: string,
  paymentId: string,
  sellerId: string,
  sellerProfileId: string,
  amount: number
): Promise<void> {
  await confirmPayment(paymentId)
  await logAction(adminId, 'confirm_payment', 'payment', paymentId)

  const tmpl = NotificationTemplates.paymentConfirmed(amount)
  await createNotification(sellerProfileId, tmpl.type, tmpl.title, tmpl.message)
}

// ─── Admin: Reject Payment ─────────────────────────────
export async function adminRejectPayment(
  adminId: string,
  paymentId: string,
  reason: string
): Promise<void> {
  await rejectPayment(paymentId, reason)
  await logAction(adminId, 'reject_payment', 'payment', paymentId, reason)
}

// ─── Admin: Confirm Promotion ──────────────────────────
export async function adminConfirmPromotion(
  adminId: string,
  promotionId: string,
  sellerId: string,
  sellerProfileId: string,
  weeks: number
): Promise<void> {
  await confirmPromotion(promotionId)
  await logAction(adminId, 'confirm_promotion', 'promotion', promotionId)

  const tmpl = NotificationTemplates.promotionActive(weeks)
  await createNotification(sellerProfileId, tmpl.type, tmpl.title, tmpl.message)
}

// ─── Get Admin Logs ────────────────────────────────────
export async function getAdminLogs(): Promise<AdminLog[]> {
  const { data, error } = await supabase
    .from('admin_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw error
  return (data ?? []) as AdminLog[]
}
