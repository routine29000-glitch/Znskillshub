import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'
import { useSound } from '@/hooks/useSound'
import { verifyAdminPassword, getDashboardStats, adminApproveSeller, adminRejectSeller, adminBlockSeller, adminConfirmPayment, adminRejectPayment, adminConfirmPromotion } from '@/services/admin.service'
import { getAllSellersAdmin } from '@/services/seller.service'
import { getAllPaymentsAdmin, getAllPromotionRequestsAdmin } from '@/services/payment.service'
import { getAdminLogs } from '@/services/admin.service'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { formatDate, formatDateTime, formatDZD, sellerStatusLabel, paymentStatusLabel } from '@/utils/formatters'
import { getPublicUrl, BUCKETS } from '@/lib/supabase'
import toast from 'react-hot-toast'

// ─── Tab definition ────────────────────────────────────
type AdminTab = 'stats' | 'sellers' | 'payments' | 'promotions' | 'logs'

const TABS: { id: AdminTab; label: string }[] = [
  { id: 'stats',      label: '📊 الإحصائيات'  },
  { id: 'sellers',    label: '👤 الحرفيون'    },
  { id: 'payments',   label: '💰 المدفوعات'   },
  { id: 'promotions', label: '🔥 الترويج'     },
  { id: 'logs',       label: '📋 السجل'       },
]

// ─── Auth gate ─────────────────────────────────────────
function AdminAuthGate({ onAuth }: { onAuth: () => void }) {
  const [pwd, setPwd] = useState('')
  const { isAdminAuthed, setAdminAuthed } = useAuthStore()

  if (isAdminAuthed) { onAuth(); return null }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (verifyAdminPassword(pwd)) {
      setAdminAuthed(true)
      onAuth()
    } else {
      toast.error('كلمة السر غير صحيحة')
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        className="bg-surface border border-white/10 rounded-2xl p-8 w-full max-w-sm text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-xl font-black text-white mb-6">لوحة الإدارة</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            label="كلمة سر الأدمن"
            placeholder="••••••••••"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
          />
          <Button type="submit" className="w-full">دخول</Button>
        </form>
      </motion.div>
    </div>
  )
}

// ─── Stat card ─────────────────────────────────────────
function AdminStat({ icon, label, value, color = 'text-primary' }: {
  icon: string; label: string; value: number | string; color?: string
}) {
  return (
    <div className="bg-surface border border-white/10 rounded-xl p-5">
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`text-3xl font-black ${color}`}>
        {typeof value === 'number' ? value.toLocaleString('ar-DZ') : value}
      </div>
      <div className="text-gray-400 text-sm mt-1">{label}</div>
    </div>
  )
}

// ─── Sellers tab ───────────────────────────────────────
function SellersTab({ adminId }: { adminId: string }) {
  const qc = useQueryClient()
  const { play } = useSound()
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const { data: sellers = [], isLoading } = useQuery({
    queryKey: ['admin-sellers'],
    queryFn:  getAllSellersAdmin,
  })

  const approveMut = useMutation({
    mutationFn: ({ sid, pid }: { sid: string; pid: string }) =>
      adminApproveSeller(adminId, sid, pid),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-sellers'] }); play('success'); toast.success('تم توثيق الحرفي ✅') },
    onError:   () => toast.error('فشل الإجراء'),
  })

  const rejectMut = useMutation({
    mutationFn: ({ sid, pid, reason }: { sid: string; pid: string; reason: string }) =>
      adminRejectSeller(adminId, sid, pid, reason),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-sellers'] }); toast.success('تم رفض الطلب') },
  })

  const blockMut = useMutation({
    mutationFn: ({ sid, pid, bc }: { sid: string; pid: string; bc: number }) =>
      adminBlockSeller(adminId, sid, pid, bc),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-sellers'] }); play('block'); toast.success('تم حظر الحرفي') },
  })

  const filtered = sellers
    .filter(s => filter === 'all' || s.status === filter)
    .filter(s => !search || s.full_name.includes(search) || s.wilaya.includes(search))

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 ابحث بالاسم أو الولاية..."
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-primary font-arabic flex-1 min-w-[200px]"
        />
        {(['all', 'pending', 'active', 'blocked'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all
              ${filter === f ? 'bg-primary border-primary text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
          >
            {{ all: 'الكل', pending: '⏳ انتظار', active: '✅ نشط', blocked: '🚫 موقوف' }[f]}
            <span className="mr-1.5 text-xs opacity-60">
              ({f === 'all' ? sellers.length : sellers.filter(s => s.status === f).length})
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {['الاسم', 'الفئة', 'الولاية', 'الصفقات', 'العمولة', 'الحالة', 'الإجراءات'].map(h => (
                <th key={h} className="text-right py-3 px-4 text-gray-500 font-bold text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="py-3 px-4">
                        <div className="h-3 bg-white/5 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : filtered.map(seller => {
                  const sl = sellerStatusLabel(seller.status)
                  return (
                    <tr key={seller.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{seller.full_name}</div>
                        <div className="text-xs text-gray-500">{seller.phone}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-xs">{seller.category?.name ?? '—'}</td>
                      <td className="py-3 px-4 text-gray-300 text-xs">{seller.wilaya}</td>
                      <td className="py-3 px-4">
                        <span className="text-primary font-bold">{seller.total_deals}</span>
                        {seller.free_deals_remaining > 0 && (
                          <span className="text-secondary text-xs mr-1">({seller.free_deals_remaining} مجاني)</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {seller.unpaid_commission > 0
                          ? <span className="text-red-400 font-bold">{formatDZD(seller.unpaid_commission)}</span>
                          : <span className="text-gray-600">—</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-bold ${sl.color}`}>{sl.label}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          {seller.status === 'pending' && (
                            <>
                              {/* View docs */}
                              <a
                                href={getPublicUrl(BUCKETS.VERIFICATIONS, seller.selfie_url ?? '')}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-400 hover:underline"
                              >
                                📄 الوثائق
                              </a>
                              <button
                                onClick={() => approveMut.mutate({ sid: seller.id, pid: seller.profile_id })}
                                disabled={approveMut.isPending}
                                className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-lg font-bold hover:bg-secondary/30 transition-all disabled:opacity-50"
                              >
                                ✅ توثيق
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('سبب الرفض:')
                                  if (reason) rejectMut.mutate({ sid: seller.id, pid: seller.profile_id, reason })
                                }}
                                className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-lg font-bold hover:bg-red-500/30 transition-all"
                              >
                                ❌ رفض
                              </button>
                            </>
                          )}
                          {seller.status === 'active' && (
                            <button
                              onClick={() => blockMut.mutate({ sid: seller.id, pid: seller.profile_id, bc: seller.block_count })}
                              className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-lg font-bold hover:bg-orange-500/30 transition-all"
                            >
                              🚫 حظر
                            </button>
                          )}
                          {seller.status === 'blocked' && (
                            <span className="text-xs text-gray-500">
                              مرات الحظر: {seller.block_count}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
            }
          </tbody>
        </table>
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">لا توجد نتائج</div>
        )}
      </div>
    </div>
  )
}

// ─── Payments tab ──────────────────────────────────────
function PaymentsTab({ adminId }: { adminId: string }) {
  const qc = useQueryClient()
  const { play } = useSound()

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['admin-payments'],
    queryFn:  getAllPaymentsAdmin,
  })

  const confirmMut = useMutation({
    mutationFn: ({ pid, sid, spid, amount }: { pid: string; sid: string; spid: string; amount: number }) =>
      adminConfirmPayment(adminId, pid, sid, spid, amount),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-payments'] })
      qc.invalidateQueries({ queryKey: ['admin-sellers'] })
      play('coin')
      toast.success('✅ تم تأكيد الدفع وإعادة تفعيل الحساب')
    },
    onError: () => toast.error('فشل تأكيد الدفع'),
  })

  const rejectMut = useMutation({
    mutationFn: ({ pid, reason }: { pid: string; reason: string }) =>
      adminRejectPayment(adminId, pid, reason),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-payments'] }); toast.success('تم رفض الدفع') },
  })

  return (
    <div className="space-y-3">
      {isLoading
        ? <div className="text-center py-10 text-gray-500">جارٍ التحميل...</div>
        : payments.length === 0
        ? <div className="text-center py-10 text-gray-500 text-sm">لا توجد مدفوعات</div>
        : payments.map(payment => {
            const ps = paymentStatusLabel(payment.status)
            return (
              <div key={payment.id} className="bg-surface border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-sm">
                      {(payment as any).seller?.full_name ?? 'حرفي'}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {formatDateTime(payment.created_at)} · {payment.type === 'commission' ? 'عمولة' : payment.type === 'penalty' ? 'غرامة' : 'ترويج'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-white text-lg">{formatDZD(payment.total_amount)}</div>
                    {payment.penalty_amount > 0 && (
                      <div className="text-xs text-red-400">غرامة: {formatDZD(payment.penalty_amount)}</div>
                    )}
                  </div>
                  <span className={`text-xs font-bold ${ps.color}`}>{ps.label}</span>
                  <div className="flex items-center gap-2">
                    {payment.receipt_url && (
                      <a
                        href={getPublicUrl(BUCKETS.RECEIPTS, payment.receipt_url)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-500/30 transition-all"
                      >
                        👁️ الوصل
                      </a>
                    )}
                    {payment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => confirmMut.mutate({
                            pid: payment.id,
                            sid: payment.seller_id,
                            spid: payment.seller_id, // seller profile_id fetched server-side
                            amount: payment.total_amount,
                          })}
                          disabled={confirmMut.isPending}
                          className="text-xs bg-secondary/20 text-secondary px-3 py-1.5 rounded-lg font-bold hover:bg-secondary/30 transition-all disabled:opacity-50"
                        >
                          ✅ تأكيد
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('سبب الرفض:')
                            if (reason) rejectMut.mutate({ pid: payment.id, reason })
                          }}
                          className="text-xs bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg font-bold hover:bg-red-500/30 transition-all"
                        >
                          ❌ رفض
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })
      }
    </div>
  )
}

// ─── Promotions tab ────────────────────────────────────
function PromotionsTab({ adminId }: { adminId: string }) {
  const qc = useQueryClient()
  const { play } = useSound()

  const { data: promos = [], isLoading } = useQuery({
    queryKey: ['admin-promotions'],
    queryFn:  getAllPromotionRequestsAdmin,
  })

  const confirmMut = useMutation({
    mutationFn: ({ prid, sid, spid, weeks }: { prid: string; sid: string; spid: string; weeks: number }) =>
      adminConfirmPromotion(adminId, prid, sid, spid, weeks),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-promotions'] })
      qc.invalidateQueries({ queryKey: ['admin-sellers'] })
      play('celebrate')
      toast.success('🔥 تم تفعيل الترويج!')
    },
  })

  return (
    <div className="space-y-3">
      {isLoading
        ? <div className="text-center py-10 text-gray-500">جارٍ التحميل...</div>
        : promos.length === 0
        ? <div className="text-center py-10 text-gray-500 text-sm">لا توجد طلبات ترويج</div>
        : promos.map(promo => (
            <div key={promo.id} className="bg-surface border border-white/10 rounded-xl p-4 flex items-center gap-4 flex-wrap">
              <div className="flex-1">
                <div className="font-bold text-white text-sm">
                  {(promo as any).seller?.full_name ?? '—'}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {promo.weeks} أسبوع · {formatDateTime(promo.created_at)}
                </div>
              </div>
              <div className="font-black text-gold">{formatDZD(promo.amount)}</div>
              <Badge variant={promo.status === 'confirmed' ? 'success' : promo.status === 'rejected' ? 'error' : 'warning'}>
                {promo.status === 'confirmed' ? '✅ مفعّل' : promo.status === 'rejected' ? '❌ مرفوض' : '⏳ انتظار'}
              </Badge>
              {promo.status === 'pending' && (
                <div className="flex gap-2">
                  {promo.receipt_url && (
                    <a
                      href={getPublicUrl(BUCKETS.RECEIPTS, promo.receipt_url)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg font-bold"
                    >
                      👁️ الوصل
                    </a>
                  )}
                  <button
                    onClick={() => confirmMut.mutate({
                      prid:  promo.id,
                      sid:   promo.seller_id,
                      spid:  promo.seller_id,
                      weeks: promo.weeks,
                    })}
                    disabled={confirmMut.isPending}
                    className="text-xs bg-gold/20 text-gold px-3 py-1.5 rounded-lg font-bold hover:bg-gold/30 transition-all disabled:opacity-50"
                  >
                    🔥 تفعيل
                  </button>
                </div>
              )}
            </div>
          ))
      }
    </div>
  )
}

// ─── Logs tab ──────────────────────────────────────────
function LogsTab() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['admin-logs'],
    queryFn:  getAdminLogs,
  })

  return (
    <div className="space-y-2">
      {isLoading
        ? <div className="text-center py-10 text-gray-500">جارٍ التحميل...</div>
        : logs.map(log => (
            <div key={log.id} className="bg-surface border border-white/5 rounded-xl px-5 py-3 flex items-center gap-4">
              <div className="text-2xl">
                {{ verify_seller: '✅', reject_seller: '❌', block_seller: '🚫', confirm_payment: '💰', reject_payment: '🔴', confirm_promotion: '🔥' }[log.action] ?? '📋'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white capitalize">{log.action.replace(/_/g, ' ')}</div>
                {log.notes && <div className="text-xs text-gray-500 mt-0.5 truncate">{log.notes}</div>}
              </div>
              <div className="text-xs text-gray-600 flex-shrink-0">{formatDateTime(log.created_at)}</div>
            </div>
          ))
      }
      {!isLoading && logs.length === 0 && (
        <div className="text-center py-10 text-gray-500 text-sm">السجل فارغ</div>
      )}
    </div>
  )
}

// ─── Main admin page ───────────────────────────────────
export default function AdminPage() {
  const { isAdminAuthed, profile } = useAuthStore()
  const [authed, setAuthed]  = useState(isAdminAuthed)
  const [tab, setTab]        = useState<AdminTab>('stats')

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn:  getDashboardStats,
    enabled:  authed,
    refetchInterval: 60_000,
  })

  if (!authed) return <AdminAuthGate onAuth={() => setAuthed(true)} />

  const adminId = profile?.id ?? 'admin'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">⚙️ لوحة الإدارة</h1>
          <p className="text-gray-400 text-sm mt-1">Zn_SkillsHub Admin Panel</p>
        </div>
        <div className="text-xs text-gray-600 bg-white/5 px-3 py-1.5 rounded-lg">
          آخر تحديث: الآن
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-6 border-b border-white/10">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-shrink-0 px-5 py-3 text-sm font-bold border-b-2 transition-all
              ${tab === t.id ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'stats' && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <AdminStat icon="👤" label="حرفي مسجل"          value={stats.total_sellers}        color="text-primary" />
                <AdminStat icon="✅" label="حرفي نشط"            value={stats.active_sellers}       color="text-secondary" />
                <AdminStat icon="⏳" label="بانتظار التوثيق"     value={stats.pending_verification} color="text-yellow-400" />
                <AdminStat icon="🚫" label="محظور"               value={stats.blocked_sellers}      color="text-red-400" />
                <AdminStat icon="🤝" label="صفقة مكتملة"         value={stats.total_deals}          color="text-primary" />
                <AdminStat icon="💰" label="إيرادات الشهر"       value={`${formatDZD(stats.monthly_revenue)}`}  color="text-gold" />
                <AdminStat icon="⚠️" label="عمولات غير مدفوعة" value={`${formatDZD(stats.unpaid_commissions)}`} color="text-red-400" />
                <AdminStat icon="🔥" label="ترويج نشط"          value={stats.active_promotions}    color="text-gold" />
              </div>

              {/* Quick actions */}
              <div className="bg-surface border border-white/10 rounded-xl p-5">
                <h3 className="font-black text-white mb-4">⚡ إجراءات سريعة</h3>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" onClick={() => setTab('sellers')}>
                    👤 مراجعة طلبات التوثيق ({stats.pending_verification})
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setTab('payments')}>
                    💰 مراجعة المدفوعات
                  </Button>
                  <Button size="sm" variant="gold" onClick={() => setTab('promotions')}>
                    🔥 تفعيل الترويج
                  </Button>
                </div>
              </div>

              {/* Commission rules reminder */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                <h3 className="font-black text-white mb-3 text-sm">📋 قواعد النظام (مرجع سريع)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-400">
                  <div>✅ أول 10 صفقات: مجاناً بدون عمولة</div>
                  <div>💰 من الصفقة 11+: عمولة 5%</div>
                  <div>⏰ عند 500 دج+: مهلة 48 ساعة للدفع</div>
                  <div>🚫 تجاوز المهلة: حظر فوري للحساب</div>
                  <div>⚠️ الغرامة 1: +40% من المبلغ المستحق</div>
                  <div>⚠️ الغرامة 2: +60% · 3: +80% · 4: +100%</div>
                  <div>❌ الحظر 5: حظر دائم نهائي لا يُرفع</div>
                  <div>🔥 الترويج: 1000 دج / أسبوع (1-12 أسبوع)</div>
                </div>
              </div>
            </div>
          )}

          {tab === 'sellers'    && <SellersTab    adminId={adminId} />}
          {tab === 'payments'   && <PaymentsTab   adminId={adminId} />}
          {tab === 'promotions' && <PromotionsTab adminId={adminId} />}
          {tab === 'logs'       && <LogsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
