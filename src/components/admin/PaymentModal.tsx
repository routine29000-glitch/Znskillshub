import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { submitCommissionPayment, CCP_ACCOUNT } from '@/services/payment.service'
import { calculatePenaltyAmount, calculateTotalDue, getPenaltyLabel, formatDZD } from '@/utils/commission'
import { useSound } from '@/hooks/useSound'
import toast from 'react-hot-toast'

export function PaymentModal() {
  const { activeModal, closeModal } = useUIStore()
  const { seller } = useAuthStore()
  const { play } = useSound()

  const [copied, setCopied] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!seller) return null

  const unpaid  = seller.unpaid_commission
  const penalty = calculatePenaltyAmount(unpaid, seller.block_count)
  const total   = calculateTotalDue(unpaid, seller.block_count)

  const handleCopy = () => {
    navigator.clipboard?.writeText(CCP_ACCOUNT)
    setCopied(true)
    play('coin')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async () => {
    if (!file) { toast.error('يرجى رفع صورة الوصل'); return }
    setLoading(true)
    try {
      await submitCommissionPayment(seller.id, unpaid, penalty, file)
      play('success')
      toast.success('تم إرسال طلب الدفع! سيتم تأكيده خلال 24 ساعة.')
      closeModal()
    } catch {
      toast.error('فشل إرسال الطلب. حاول مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={activeModal === 'payment'}
      onClose={closeModal}
      title="💳 سداد العمولة"
      size="md"
    >
      <div className="space-y-5">

        {/* Amount summary */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">العمولة غير المدفوعة</span>
            <span className="text-white font-bold">{formatDZD(unpaid)}</span>
          </div>
          {penalty > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-red-400">الغرامة ({getPenaltyLabel(seller.block_count)})</span>
              <span className="text-red-400 font-bold">+ {formatDZD(penalty)}</span>
            </div>
          )}
          <div className="border-t border-white/10 pt-2 flex justify-between">
            <span className="font-black text-white">المجموع المطلوب</span>
            <span className="font-black text-secondary text-xl">{formatDZD(total)}</span>
          </div>
        </div>

        {/* Method tabs */}
        <div className="space-y-3">
          <div className="text-sm font-bold text-gray-300">اختر طريقة الدفع:</div>

          {/* CCP — active */}
          <div className="border-2 border-primary/50 bg-primary/5 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-xl">🏦</div>
              <div>
                <div className="font-bold text-white text-sm">CCP — بريد الجزائر</div>
                <div className="text-xs text-gray-400">تحويل بريدي (بريدي موب أو مكتب البريد)</div>
              </div>
              <span className="mr-auto bg-secondary/20 text-secondary text-xs font-bold px-2 py-1 rounded-lg">✅ متاح</span>
            </div>

            <div className="bg-black/20 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] text-gray-500 mb-0.5">رقم الحساب</div>
                <div className="font-mono text-white text-sm font-bold tracking-wide">{CCP_ACCOUNT}</div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCopy}
                className={`
                  text-xs font-bold px-3 py-2 rounded-lg transition-all
                  ${copied ? 'bg-secondary/20 text-secondary' : 'bg-white/10 text-white hover:bg-primary/20'}
                `}
              >
                {copied ? '✅ تم النسخ' : '📋 نسخ'}
              </motion.button>
            </div>

            {/* Steps */}
            <ol className="space-y-1.5 text-xs text-gray-400 list-none">
              {[
                'افتح تطبيق بريدي موب أو اذهب لمكتب البريد',
                `حوّل المبلغ (${formatDZD(total)}) على الرقم أعلاه`,
                'عُد للتطبيق وارفع صورة الوصل أدناه',
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          {/* Edahabia — coming soon */}
          <div className="border border-white/10 rounded-xl p-4 opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">💳</div>
              <div>
                <div className="font-bold text-gray-400 text-sm">البطاقة الذهبية — Edahabia</div>
                <div className="text-xs text-gray-600">سيتم تفعيلها قريباً</div>
              </div>
              <span className="mr-auto bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded-lg">🕒 قريباً</span>
            </div>
          </div>
        </div>

        {/* File upload */}
        <div>
          <div className="text-sm font-bold text-gray-300 mb-2">📤 رفع صورة الوصل</div>
          <label
            onClick={() => fileRef.current?.click()}
            className={`
              flex items-center gap-3 border-2 border-dashed rounded-xl px-4 py-4
              cursor-pointer transition-all text-sm font-semibold
              ${file
                ? 'border-secondary/60 bg-secondary/5 text-secondary'
                : 'border-white/15 text-gray-400 hover:border-primary/50 hover:text-primary'}
            `}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={e => e.target.files?.[0] && setFile(e.target.files[0])}
            />
            <span className="text-2xl">{file ? '✅' : '📸'}</span>
            <span>{file ? file.name : 'اضغط لرفع صورة أو PDF للوصل'}</span>
          </label>
          <p className="text-xs text-gray-600 mt-1">JPG, PNG, PDF — الحجم الأقصى 5MB</p>
        </div>

        <Button
          onClick={handleSubmit}
          loading={loading}
          disabled={!file}
          className="w-full"
          size="lg"
        >
          ✅ تم الدفع — إرسال للمراجعة
        </Button>

        <p className="text-center text-xs text-gray-500">
          سيتم مراجعة وصلك خلال 24 ساعة. لن يُفعَّل حسابك حتى يتأكد الأدمن.
        </p>
      </div>
    </Modal>
  )
}
