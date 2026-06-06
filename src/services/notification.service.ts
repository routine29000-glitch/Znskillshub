import { supabase } from '@/lib/supabase'
import type { Notification, NotificationType } from '@/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

// ─── Create Notification ───────────────────────────────
export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  data?: Record<string, unknown>
): Promise<void> {
  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    type,
    title,
    message,
    data: data ?? null,
  })
  if (error) throw error
}

// ─── Get My Notifications ──────────────────────────────
export async function getMyNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) throw error
  return (data ?? []) as Notification[]
}

// ─── Mark All as Read ──────────────────────────────────
export async function markAllNotificationsRead(userId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)

  if (error) throw error
}

// ─── Get Unread Count ──────────────────────────────────
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false)

  if (error) throw error
  return count ?? 0
}

// ─── Realtime Subscribe ────────────────────────────────
export function subscribeToNotifications(
  userId: string,
  onNotification: (n: Notification) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => onNotification(payload.new as Notification)
    )
    .subscribe()

  return channel
}

export function unsubscribeFromNotifications(channel: RealtimeChannel): void {
  supabase.removeChannel(channel)
}

// ─── Notification Templates ────────────────────────────
export const NotificationTemplates = {
  paymentDue: (amount: number, hours: number) => ({
    type: 'payment_due' as NotificationType,
    title: '⚠️ عمولة مستحقة',
    message: `لديك عمولة غير مدفوعة بقيمة ${amount} دج. لديك ${hours} ساعة للسداد قبل تعليق الحساب.`,
  }),

  accountBlocked: (blockCount: number) => ({
    type: 'account_blocked' as NotificationType,
    title: '🚫 تم تعليق حسابك',
    message: `تم تعليق حسابك (المرة ${blockCount}). يرجى سداد العمولة المستحقة + الغرامة لإعادة التفعيل.`,
  }),

  paymentConfirmed: (amount: number) => ({
    type: 'payment_confirmed' as NotificationType,
    title: '✅ تم تأكيد الدفع',
    message: `تم تأكيد دفعك بقيمة ${amount} دج. تم إعادة تفعيل حسابك بنجاح.`,
  }),

  promotionActive: (weeks: number) => ({
    type: 'promotion_active' as NotificationType,
    title: '🔥 الترويج مفعّل',
    message: `تم تفعيل ترويجك لمدة ${weeks} أسبوع. أنت الآن تظهر أولاً في نتائج البحث!`,
  }),

  verificationApproved: () => ({
    type: 'verification_approved' as NotificationType,
    title: '✅ تم توثيق حسابك',
    message: 'مبروك! تم توثيق ملفك المهني. يمكنك الآن استقبال الطلبات.',
  }),

  verificationRejected: (reason: string) => ({
    type: 'verification_rejected' as NotificationType,
    title: '❌ رُفض طلب التوثيق',
    message: `تم رفض طلب التوثيق. السبب: ${reason}. يرجى إعادة رفع الوثائق.`,
  }),

  newRating: (stars: number) => ({
    type: 'new_rating' as NotificationType,
    title: `⭐ تقييم جديد (${stars}/5)`,
    message: `حصلت على تقييم جديد بـ ${stars} نجوم.`,
  }),
}
