// ═══════════════════════════════════════════
// AUTH & USER
// ═══════════════════════════════════════════

export type UserRole = 'buyer' | 'seller' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string
  phone: string | null
  avatar_url: string | null
  role: UserRole
  wilaya: string | null
  commune: string | null
  created_at: string
  updated_at: string
}

// ═══════════════════════════════════════════
// SELLER / CRAFTSMAN
// ═══════════════════════════════════════════

export type SellerStatus = 'pending' | 'active' | 'blocked' | 'permanently_banned'

export interface Seller {
  id: string
  profile_id: string
  full_name: string
  category_id: number
  subcategory: string | null
  description: string | null
  wilaya: string
  commune: string
  gps_lat: number | null
  gps_lng: number | null
  phone: string
  whatsapp: string | null

  // Verification docs
  selfie_url: string | null
  id_front_url: string | null
  id_back_url: string | null
  diploma_url: string | null
  verified: boolean
  verification_notes: string | null

  // Business
  status: SellerStatus
  total_deals: number
  free_deals_remaining: number
  unpaid_commission: number
  block_count: number
  payment_deadline: string | null

  // Promotion
  promoted: boolean
  promoted_until: string | null

  // Rating
  rating_avg: number
  rating_count: number

  // Timestamps
  created_at: string
  updated_at: string

  // Joins
  category?: Category
  profile?: Profile
}

// ═══════════════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════════════

export interface Category {
  id: number
  name: string
  icon: string
  color: string
  description: string | null
  seller_count?: number
}

export interface Subcategory {
  id: number
  category_id: number
  name: string
  price_min: number | null
  price_max: number | null
}

// ═══════════════════════════════════════════
// DEALS & COMMISSIONS
// ═══════════════════════════════════════════

export type DealStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'disputed'

export interface Deal {
  id: string
  seller_id: string
  buyer_id: string
  agreed_price: number
  commission_amount: number
  commission_percent: number
  status: DealStatus
  description: string | null
  created_at: string
  completed_at: string | null

  // Joins
  seller?: Seller
  buyer?: Profile
}

// ═══════════════════════════════════════════
// PAYMENTS
// ═══════════════════════════════════════════

export type PaymentMethod = 'ccp' | 'edahabia'
export type PaymentStatus = 'pending' | 'confirmed' | 'rejected'
export type PaymentType = 'commission' | 'penalty' | 'promotion'

export interface Payment {
  id: string
  seller_id: string
  amount: number
  penalty_amount: number
  total_amount: number
  method: PaymentMethod
  status: PaymentStatus
  type: PaymentType
  receipt_url: string | null
  admin_note: string | null
  created_at: string
  confirmed_at: string | null

  seller?: Seller
}

// ═══════════════════════════════════════════
// PROMOTION
// ═══════════════════════════════════════════

export interface PromotionRequest {
  id: string
  seller_id: string
  weeks: number
  amount: number
  receipt_url: string | null
  status: PaymentStatus
  starts_at: string | null
  ends_at: string | null
  created_at: string

  seller?: Seller
}

// ═══════════════════════════════════════════
// RATINGS
// ═══════════════════════════════════════════

export interface Rating {
  id: string
  seller_id: string
  buyer_id: string
  deal_id: string | null
  stars: number          // 1-5
  comment: string | null
  created_at: string

  buyer?: Profile
}

// ═══════════════════════════════════════════
// MESSAGES / CHAT
// ═══════════════════════════════════════════

export interface Conversation {
  id: string
  seller_id: string
  buyer_id: string
  last_message: string | null
  last_message_at: string | null
  created_at: string

  seller?: Seller
  buyer?: Profile
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  read: boolean
  created_at: string
}

// ═══════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════

export type NotificationType =
  | 'payment_due'
  | 'payment_confirmed'
  | 'payment_rejected'
  | 'account_blocked'
  | 'account_unblocked'
  | 'promotion_active'
  | 'new_rating'
  | 'new_message'
  | 'deal_confirmed'
  | 'verification_approved'
  | 'verification_rejected'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  data: Record<string, unknown> | null
  created_at: string
}

// ═══════════════════════════════════════════
// SEARCH & FILTERS
// ═══════════════════════════════════════════

export interface SearchFilters {
  query?: string
  category_id?: number
  wilaya?: string
  verified_only?: boolean
  promoted_only?: boolean
  min_rating?: number
  sort_by?: 'distance' | 'rating' | 'deals' | 'price_asc' | 'price_desc'
  user_lat?: number
  user_lng?: number
}

export interface SearchResult {
  promoted_same_wilaya: Seller[]
  promoted_nearby: Seller[]
  verified_closest: Seller[]
  others: Seller[]
}

// ═══════════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════════

export interface AdminLog {
  id: string
  admin_id: string
  action: string
  target_type: 'seller' | 'payment' | 'promotion' | 'rating'
  target_id: string
  notes: string | null
  created_at: string
}

export interface DashboardStats {
  total_sellers: number
  active_sellers: number
  pending_verification: number
  blocked_sellers: number
  total_deals: number
  monthly_revenue: number
  unpaid_commissions: number
  active_promotions: number
}

// ═══════════════════════════════════════════
// FORMS (Zod-validated)
// ═══════════════════════════════════════════

export interface RegisterSellerForm {
  full_name: string
  phone: string
  whatsapp?: string
  category_id: number
  subcategory?: string
  description?: string
  wilaya: string
  commune: string
  selfie: File
  id_front: File
  id_back: File
  diploma: File
}

export interface LoginForm {
  email: string
  password: string
}

export interface SignupForm {
  email: string
  password: string
  full_name: string
  phone: string
  role: UserRole
}
