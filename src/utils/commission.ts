// ═══════════════════════════════════════════
// Commission & Penalty Business Logic
// ═══════════════════════════════════════════

export const FREE_DEALS_LIMIT = 10
export const COMMISSION_PERCENT = 5
export const COMMISSION_TOLERANCE_DZD = 500
export const PAYMENT_DEADLINE_HOURS = 48
export const PROMOTION_PRICE_PER_WEEK = 1000

const PENALTY_RATES = [40, 60, 80, 100] // % per offense (1..4)

// ─── Commission calculation ────────────────────────────
export function calculateCommission(agreedPrice: number, dealsCompleted: number): number {
  if (dealsCompleted < FREE_DEALS_LIMIT) return 0
  return Math.round(agreedPrice * COMMISSION_PERCENT / 100)
}

// ─── Penalty calculation ───────────────────────────────
export function getPenaltyRate(blockCount: number): number {
  if (blockCount === 0) return 0
  if (blockCount > PENALTY_RATES.length) return 100
  return PENALTY_RATES[blockCount - 1]
}

export function calculatePenaltyAmount(unpaid: number, blockCount: number): number {
  const rate = getPenaltyRate(blockCount)
  return Math.round(unpaid * rate / 100)
}

export function calculateTotalDue(unpaid: number, blockCount: number): number {
  return unpaid + calculatePenaltyAmount(unpaid, blockCount)
}

// ─── Check if deadline exceeded ────────────────────────
export function isPaymentOverdue(deadline: string | null): boolean {
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

// ─── Human-readable penalty label ─────────────────────
export function getPenaltyLabel(blockCount: number): string {
  if (blockCount === 0) return 'لا توجد غرامة'
  if (blockCount >= PENALTY_RATES.length + 1) return '🚫 حظر دائم نهائي'
  return `${getPenaltyRate(blockCount)}% غرامة`
}

// ─── Promotion total ───────────────────────────────────
export function calculatePromotionTotal(weeks: number): number {
  return weeks * PROMOTION_PRICE_PER_WEEK
}

// ─── Format DZD ────────────────────────────────────────
export function formatDZD(amount: number): string {
  return `${amount.toLocaleString('ar-DZ')} دج`
}

// ─── Commission status for seller dashboard ────────────
export interface CommissionStatus {
  isFree: boolean
  dealsRemaining: number
  unpaid: number
  penalty: number
  total: number
  isBlocked: boolean
  isPermanentlyBanned: boolean
  hoursUntilDeadline: number | null
  isOverdue: boolean
}

export function getCommissionStatus(seller: {
  free_deals_remaining: number
  unpaid_commission: number
  block_count: number
  status: string
  payment_deadline: string | null
}): CommissionStatus {
  const isFree = seller.free_deals_remaining > 0
  const penalty = calculatePenaltyAmount(seller.unpaid_commission, seller.block_count)
  const total = seller.unpaid_commission + penalty

  let hoursUntilDeadline: number | null = null
  if (seller.payment_deadline) {
    const ms = new Date(seller.payment_deadline).getTime() - Date.now()
    hoursUntilDeadline = Math.max(0, Math.floor(ms / 3_600_000))
  }

  return {
    isFree,
    dealsRemaining: seller.free_deals_remaining,
    unpaid: seller.unpaid_commission,
    penalty,
    total,
    isBlocked: seller.status === 'blocked',
    isPermanentlyBanned: seller.status === 'permanently_banned',
    hoursUntilDeadline,
    isOverdue: isPaymentOverdue(seller.payment_deadline),
  }
}
