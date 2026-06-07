import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth.store'
import {
  getMyConversations,
  getMessages,
  sendMessage,
  markMessagesRead,
  subscribeToMessages,
  unsubscribeFromMessages,
} from '@/services/chat.service'
import type { Conversation, Message } from '@/types'
import { timeAgo } from '@/utils/formatters'
import { Button } from '@/components/ui/Button'
import { useSound } from '@/hooks/useSound'

export default function MessagesPage() {
  const navigate  = useNavigate()
  const { profile } = useAuthStore()
  const { play }  = useSound()
  const qc        = useQueryClient()

  const [activeConv, setActiveConv]   = useState<Conversation | null>(null)
  const [draft, setDraft]             = useState('')
  const [localMsgs, setLocalMsgs]     = useState<Message[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (!profile) navigate('/') }, [profile, navigate])

  /* ── Conversations list ── */
  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations', profile?.id],
    queryFn:  () => getMyConversations(profile!.id),
    enabled:  !!profile,
    refetchInterval: 15_000,
  })

  /* ── Messages in active conversation ── */
  const { data: fetchedMessages = [] } = useQuery({
    queryKey: ['messages', activeConv?.id],
    queryFn:  () => getMessages(activeConv!.id),
    enabled:  !!activeConv,
    onSuccess: (msgs) => {
      setLocalMsgs(msgs)
      if (profile && activeConv) markMessagesRead(activeConv.id, profile.id).catch(() => null)
    },
  })

  /* ── Realtime subscription ── */
  useEffect(() => {
    if (!activeConv) return
    const channel = subscribeToMessages(activeConv.id, (msg) => {
      setLocalMsgs(prev => [...prev, msg])
      play('notification')
      qc.invalidateQueries({ queryKey: ['conversations'] })
    })
    return () => unsubscribeFromMessages(channel)
  }, [activeConv?.id])

  /* ── Auto-scroll ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [localMsgs])

  /* ── Send message ── */
  const sendMut = useMutation({
    mutationFn: () => sendMessage(activeConv!.id, profile!.id, draft.trim()),
    onSuccess: (msg) => {
      setLocalMsgs(prev => [...prev, msg])
      setDraft('')
      play('click')
      qc.invalidateQueries({ queryKey: ['conversations'] })
    },
  })

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.trim() || !activeConv || sendMut.isPending) return
    sendMut.mutate()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e as any) }
  }

  const getConvName = (conv: Conversation) => {
    if (profile?.role === 'seller') return (conv as any).buyer?.full_name ?? 'زبون'
    return (conv as any).seller?.full_name ?? 'حرفي'
  }

  const messages = localMsgs.length ? localMsgs : fetchedMessages

  if (!profile) return null

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-80px)] flex gap-5">

      {/* ── Conversations sidebar ── */}
      <div className="w-full sm:w-72 flex-shrink-0 bg-surface border border-white/10 rounded-2xl overflow-hidden flex flex-col">
        <div className="px-4 py-4 border-b border-white/10">
          <h2 className="font-black text-white text-base">💬 المحادثات</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm px-4">
              <div className="text-3xl mb-3">💬</div>
              لا توجد محادثات بعد
            </div>
          ) : (
            conversations.map(conv => (
              <motion.button
                key={conv.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setActiveConv(conv); setLocalMsgs([]) }}
                className={`
                  w-full text-right px-4 py-3.5 border-b border-white/5
                  flex items-start gap-3 transition-colors
                  ${activeConv?.id === conv.id ? 'bg-primary/15' : 'hover:bg-white/5'}
                `}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center font-black text-white flex-shrink-0">
                  {getConvName(conv)?.[0] ?? '؟'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-sm truncate">{getConvName(conv)}</div>
                  {conv.last_message && (
                    <div className="text-xs text-gray-500 truncate mt-0.5">{conv.last_message}</div>
                  )}
                  {conv.last_message_at && (
                    <div className="text-[10px] text-gray-600 mt-0.5">{timeAgo(conv.last_message_at)}</div>
                  )}
                </div>
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* ── Chat panel ── */}
      <div className="flex-1 bg-surface border border-white/10 rounded-2xl overflow-hidden flex flex-col">
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center text-center text-gray-500">
            <div>
              <div className="text-5xl mb-4">💬</div>
              <div className="font-bold text-white mb-1">اختر محادثة</div>
              <div className="text-sm">اختر محادثة من القائمة لعرض الرسائل</div>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center font-black text-white text-sm">
                {getConvName(activeConv)?.[0] ?? '؟'}
              </div>
              <div>
                <div className="font-black text-white text-sm">{getConvName(activeConv)}</div>
                <div className="text-xs text-secondary">نشط</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isMine = msg.sender_id === profile.id
                  return (
                    <motion.div
                      key={msg.id}
                      className={`flex ${isMine ? 'justify-start' : 'justify-end'}`}
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className={`
                          max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                          ${isMine
                            ? 'bg-primary text-white rounded-tr-sm'
                            : 'bg-white/10 text-gray-200 rounded-tl-sm'}
                        `}
                      >
                        {msg.content}
                        <div className={`text-[10px] mt-1 ${isMine ? 'text-white/60' : 'text-gray-500'}`}>
                          {timeAgo(msg.created_at)}
                          {isMine && <span className="mr-1">{msg.read ? ' ✓✓' : ' ✓'}</span>}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="px-4 py-4 border-t border-white/10 flex items-end gap-3">
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اكتب رسالة... (Enter للإرسال)"
                rows={1}
                className="
                  flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5
                  text-sm text-white placeholder-gray-500 outline-none resize-none
                  focus:border-primary transition-all font-arabic max-h-28
                "
                style={{ minHeight: '44px' }}
              />
              <Button
                type="submit"
                size="sm"
                loading={sendMut.isPending}
                disabled={!draft.trim()}
                className="flex-shrink-0"
              >
                إرسال
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
