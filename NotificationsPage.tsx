import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth.store'
import { getMyNotifications, markAllNotificationsRead } from '@/services/notification.service'
import type { Notification } from '@/types'
import { timeAgo } from '@/utils/formatters'
import { Button } from '@/components/ui/Button'

const TYPE_ICONS: Record<string, string> = {
  payment_due:             '⚠️',
  payment_confirmed:       '✅',
  payment_rejected:        '❌',
  account_blocked:         '🚫',
  account_unblocked:       '🔓',
  promotion_active:        '🔥',
  new_rating:              '⭐',
  new_message:             '💬',
  deal_confirmed:          '🤝',
  verification_approved:   '✅',
  verification_rejected:   '❌',
}

const TYPE_COLORS: Record<string, string> = {
  payment_due:           'border-yellow-500/30 bg-yellow-500/5',
  payment_confirmed:     'border-green-500/30 bg-green-500/5',
  payment_rejected:      'border-red-500/30 bg-red-500/5',
  account_blocked:       'border-red-500/30 bg-red-500/5',
  promotion_active:      'border-gold/30 bg-gold/5',
  verification_approved: 'border-green-500/30 bg-green-500/5',
  verification_rejected: 'border-red-500/30 bg-red-500/5',
}

function NotifCard({ notif }: { notif: Notification }) {
  const icon   = TYPE_ICONS[notif.type]  ?? '🔔'
  const border = TYPE_COLORS[notif.type] ?? 'border-white/10'

  return (
    <motion.div
      className={`
        relative border rounded-xl px-5 py-4 flex gap-4 items-start
        ${!notif.read ? border : 'border-white/5 bg-white/3'}
        transition-colors
      `}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {/* Unread dot */}
      {!notif.read && (
        <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-primary" />
      )}

      <div className="text-2xl flex-shrink-0">{icon}</div>

      <div className="flex-1 min-w-0">
        <div className={`font-bold text-sm ${notif.read ? 'text-gray-400' : 'text-white'}`}>
          {notif.title}
        </div>
        <div className="text-gray-400 text-xs mt-1 leading-relaxed">{notif.message}</div>
        <div className="text-gray-600 text-[10px] mt-2">{timeAgo(notif.created_at)}</div>
      </div>
    </motion.div>
  )
}

export default function NotificationsPage() {
  const navigate    = useNavigate()
  const { profile } = useAuthStore()
  const qc          = useQueryClient()

  useEffect(() => { if (!profile) navigate('/') }, [profile, navigate])

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', profile?.id],
    queryFn:  () => getMyNotifications(profile!.id),
    enabled:  !!profile,
  })

  const markReadMut = useMutation({
    mutationFn: () => markAllNotificationsRead(profile!.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const unreadCount = notifications.filter(n => !n.read).length

  if (!profile) return null

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">🔔 الإشعارات</h1>
          {unreadCount > 0 && (
            <p className="text-gray-400 text-sm mt-1">{unreadCount} إشعار غير مقروء</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => markReadMut.mutate()}
            loading={markReadMut.isPending}
          >
            ✓ قراءة الكل
          </Button>
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white/5 rounded-xl px-5 py-4 h-20 animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">🔔</div>
          <div className="font-bold text-white mb-1">لا توجد إشعارات</div>
          <div className="text-sm">ستظهر هنا الإشعارات المتعلقة بحسابك</div>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => <NotifCard key={n.id} notif={n} />)}
        </div>
      )}
    </div>
  )
}
