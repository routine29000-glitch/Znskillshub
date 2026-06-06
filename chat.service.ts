import { supabase } from '@/lib/supabase'
import type { Conversation, Message } from '@/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

// ─── Get or Create Conversation ───────────────────────
export async function getOrCreateConversation(
  sellerId: string,
  buyerId: string
): Promise<Conversation> {
  // Try to find existing
  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('seller_id', sellerId)
    .eq('buyer_id', buyerId)
    .maybeSingle()

  if (existing) return existing as Conversation

  // Create new
  const { data, error } = await supabase
    .from('conversations')
    .insert({ seller_id: sellerId, buyer_id: buyerId })
    .select()
    .single()

  if (error) throw error
  return data as Conversation
}

// ─── Get My Conversations ──────────────────────────────
export async function getMyConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*, seller:sellers(full_name, wilaya), buyer:profiles(full_name)')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('last_message_at', { ascending: false, nullsFirst: false })

  if (error) throw error
  return (data ?? []) as Conversation[]
}

// ─── Get Messages ──────────────────────────────────────
export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as Message[]
}

// ─── Send Message ──────────────────────────────────────
export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, content })
    .select()
    .single()

  if (error) throw error
  return data as Message
}

// ─── Mark Messages as Read ─────────────────────────────
export async function markMessagesRead(
  conversationId: string,
  readerId: string
): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', readerId)
    .eq('read', false)

  if (error) throw error
}

// ─── Realtime Subscription ─────────────────────────────
export function subscribeToMessages(
  conversationId: string,
  onMessage: (msg: Message) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => onMessage(payload.new as Message)
    )
    .subscribe()

  return channel
}

// ─── Unsubscribe ───────────────────────────────────────
export function unsubscribeFromMessages(channel: RealtimeChannel): void {
  supabase.removeChannel(channel)
}

// ─── Get Unread Count ──────────────────────────────────
export async function getUnreadCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('read', false)
    .neq('sender_id', userId)

  if (error) throw error
  return count ?? 0
}
