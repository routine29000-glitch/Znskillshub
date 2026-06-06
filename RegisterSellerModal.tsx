import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { useUIStore } from '@/store/ui.store'
import { useRegisterSeller } from '@/hooks/useSellers'
import { useGPS } from '@/hooks/useGPS'
import { useSound } from '@/hooks/useSound'
import { WILAYAS } from '@/data/wilayas'
import { CATEGORIES_DETAIL } from '@/data/categories'
import Confetti from 'react-confetti'

// ── Zod schema ──────────────────────────────────────────
const schema = z.object({
  full_name:   z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  phone:       z.string().min(9, 'رقم الهاتف غير صحيح'),
  whatsapp:    z.string().optional(),
  category_id: z.number({ required_error: 'اختر الفئة' }).min(1),
  subcategory: z.string().optional(),
  description: z.string().min(20, 'اكتب وصفاً لا يقل عن 20 حرف').optional(),
  wilaya:      z.string().min(1, 'اختر الولاية'),
  commune:     z.string().min(2, 'أدخل البلدية'),
})

type FormValues = z.infer<typeof schema>

// ── File Upload Zone ────────────────────────────────────
function FileZone({
  label, accept, file, onChange, required,
}: {
  label: string; accept: string; file: File | null; onChange: (f: File) => void; required?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <label
      onClick={() => inputRef.current?.click()}
      className={`
        flex items-center gap-3 border-2 border-dashed rounded-xl px-4 py-3.5
        cursor-pointer transition-all text-sm font-semibold select-none
        ${file
          ? 'border-secondary/60 bg-secondary/5 text-secondary'
          : 'border-white/10 bg-white/3 text-gray-400 hover:border-primary/50 hover:text-primary'}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => e.target.files?.[0] && onChange(e.target.files[0])}
      />
      <span className="text-xl">{file ? '✅' : '📤'}</span>
      <span className="flex-1 truncate">{file ? file.name : label}</span>
      {required && !file && <span className="text-red-400 text-xs">مطلوب</span>}
    </label>
  )
}

// ── Steps config ────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'المعلومات', icon: '👤' },
  { id: 2, label: 'الهوية',   icon: '🪪' },
  { id: 3, label: 'الشهادة',  icon: '🎓' },
  { id: 4, label: 'الموقع',   icon: '📍' },
]

// ── Main component ──────────────────────────────────────
export function RegisterSellerModal() {
  const { activeModal, closeModal } = useUIStore()
  const { mutateAsync: register, isPending } = useRegisterSeller()
  const { locate, isLoading: gpsLoading, position, status: gpsStatus } = useGPS()
  const { play } = useSound()

  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [files, setFiles] = useState<{
    selfie: File | null; id_front: File | null; id_back: File | null; diploma: File | null
  }>({ selfie: null, id_front: null, id_back: null, diploma: null })

  const { register: reg, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const selectedCat = watch('category_id')
  const subcategories = selectedCat
    ? CATEGORIES_DETAIL.find(c => c.id === Number(selectedCat))?.sections.flatMap(s => s.items.map(i => i.name)) ?? []
    : []

  const handleGPS = async () => {
    await locate()
    play('success')
  }

  const onSubmit = async (data: FormValues) => {
    if (!files.selfie || !files.id_front || !files.id_back || !files.diploma) return
    await register({
      form: {
        ...data,
        category_id: Number(data.category_id),
        selfie: files.selfie,
        id_front: files.id_front,
        id_back: files.id_back,
        diploma: files.diploma,
      },
      gps: position ? { lat: position.lat, lng: position.lng } : null,
    })
    play('celebrate')
    setDone(true)
  }

  const nextStep = () => { play('click'); setStep(s => s + 1) }
  const prevStep = () => { play('click'); setStep(s => s - 1) }

  const allDocsUploaded = files.selfie && files.id_front && files.id_back
  const diplomaUploaded = !!files.diploma

  return (
    <Modal
      isOpen={activeModal === 'register-seller'}
      onClose={closeModal}
      title={done ? '' : '🛠️ سجّل كحرفي'}
      size="lg"
    >
      {done ? (
        /* ── Success screen ── */
        <motion.div
          className="flex flex-col items-center text-center py-6 gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Confetti
            width={520} height={600} recycle={false} numberOfPieces={220}
            colors={['#6C63FF', '#00D9A5', '#FFD700', '#FF6B6B']}
          />
          <div className="text-7xl animate-bounce">🎉</div>
          <h3 className="text-2xl font-black text-white">تم إرسال طلبك!</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            سيتم مراجعة وثائقك من قِبل الإدارة خلال <strong className="text-white">24 ساعة</strong>.
            ستتلقى إشعاراً عند تفعيل حسابك.
          </p>
          <div className="bg-white/5 rounded-xl px-5 py-3 text-xs text-gray-400 space-y-1">
            <div>✅ الوثائق المرفوعة محمية وآمنة</div>
            <div>✅ أول 10 صفقات مجانية بدون عمولة</div>
            <div>✅ يمكنك الترويج بعد التفعيل</div>
          </div>
          <Button onClick={closeModal} className="mt-2">إغلاق</Button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* ── Step progress ── */}
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className={`
                  flex flex-col items-center gap-1 flex-shrink-0
                `}>
                  <div className={`
                    w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black transition-all
                    ${step > s.id ? 'bg-secondary text-gray-900' : step === s.id ? 'bg-primary text-white shadow-glow' : 'bg-white/10 text-gray-500'}
                  `}>
                    {step > s.id ? '✓' : s.icon}
                  </div>
                  <span className={`text-[10px] font-semibold ${step >= s.id ? 'text-white' : 'text-gray-600'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-all ${step > s.id ? 'bg-secondary' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>

          {/* ── Step content ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Step 1 — Personal info */}
              {step === 1 && (
                <>
                  <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 text-xs text-gray-300">
                    ⚠️ يجب أن يكون الاسم مطابقاً تماماً لبطاقة التعريف الوطنية
                  </div>
                  <Input
                    label="الاسم واللقب الحقيقي" required
                    placeholder="مثال: محمد بن علي"
                    error={errors.full_name?.message}
                    {...reg('full_name')}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="رقم الهاتف" required type="tel"
                      placeholder="0XXX XX XX XX"
                      error={errors.phone?.message}
                      {...reg('phone')}
                    />
                    <Input
                      label="واتساب (اختياري)" type="tel"
                      placeholder="0XXX XX XX XX"
                      {...reg('whatsapp')}
                    />
                  </div>
                  <Select
                    label="الفئة المهنية" required
                    placeholder="اختر فئتك..."
                    error={errors.category_id?.message}
                    options={CATEGORIES_DETAIL.map(c => ({ value: c.id, label: `${c.icon} ${c.name}` }))}
                    {...reg('category_id', { valueAsNumber: true })}
                  />
                  {subcategories.length > 0 && (
                    <Select
                      label="التخصص الدقيق (اختياري)"
                      placeholder="اختر تخصصك..."
                      options={subcategories.map(s => ({ value: s, label: s }))}
                      {...reg('subcategory')}
                    />
                  )}
                  <Textarea
                    label="وصف خدماتك (اختياري)"
                    placeholder="اشرح خبرتك وما تقدمه من خدمات..."
                    rows={3}
                    error={errors.description?.message}
                    {...reg('description')}
                  />
                </>
              )}

              {/* Step 2 — Identity docs */}
              {step === 2 && (
                <>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 text-xs text-yellow-300">
                    🔒 وثائقك مشفرة وآمنة — تُستخدم فقط للتحقق من هويتك ولا تُشارك مع أحد
                  </div>
                  <div className="space-y-3">
                    <FileZone
                      label="📸 صورة سيلفي مع بطاقة التعريف (وجهك ظاهر + البطاقة مقروءة)"
                      accept="image/*"
                      file={files.selfie}
                      onChange={f => setFiles(p => ({ ...p, selfie: f }))}
                      required
                    />
                    <FileZone
                      label="🪪 بطاقة التعريف الوطنية — الوجه الأمامي"
                      accept="image/*"
                      file={files.id_front}
                      onChange={f => setFiles(p => ({ ...p, id_front: f }))}
                      required
                    />
                    <FileZone
                      label="🪪 بطاقة التعريف الوطنية — الوجه الخلفي"
                      accept="image/*"
                      file={files.id_back}
                      onChange={f => setFiles(p => ({ ...p, id_back: f }))}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    يُقبل: JPG, PNG, WEBP — الحجم الأقصى 5MB لكل صورة
                  </p>
                </>
              )}

              {/* Step 3 — Diploma */}
              {step === 3 && (
                <>
                  <div className="bg-white/5 rounded-xl px-4 py-3 text-sm text-gray-300">
                    <div className="font-bold mb-2">🎓 شهادة مهنية أو ديبلوم</div>
                    <p className="text-xs text-gray-400">
                      ارفع شهادتك أو ديبلومك المهني الذي يثبت كفاءتك. قد تكون شهادة حرفية، دبلوم تقني، أو شهادة جامعية.
                    </p>
                  </div>
                  <FileZone
                    label="📜 ارفع الديبلوم أو الشهادة المهنية (صورة أو PDF)"
                    accept="image/*,.pdf"
                    file={files.diploma}
                    onChange={f => setFiles(p => ({ ...p, diploma: f }))}
                    required
                  />
                </>
              )}

              {/* Step 4 — Location */}
              {step === 4 && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      label="الولاية" required
                      placeholder="اختر الولاية..."
                      error={errors.wilaya?.message}
                      options={WILAYAS.map(w => ({ value: w, label: w }))}
                      {...reg('wilaya')}
                    />
                    <Input
                      label="البلدية" required
                      placeholder="مثال: باب الوادي"
                      error={errors.commune?.message}
                      {...reg('commune')}
                    />
                  </div>

                  {/* GPS capture */}
                  <div className="border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="text-sm font-bold text-white">📍 تحديد الموقع الجغرافي (مطلوب)</div>
                    <p className="text-xs text-gray-400">
                      يُستخدم لعرضك في نتائج "أقرب حرفي إليك". لن يُشارك موقعك مع أحد.
                    </p>
                    {position ? (
                      <div className="flex items-center gap-2 text-secondary text-sm font-bold">
                        <span>✅</span>
                        <span>تم تحديد موقعك بدقة {position.accuracy.toFixed(0)}م</span>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleGPS}
                        loading={gpsLoading}
                        className="w-full"
                      >
                        📍 {gpsLoading ? 'جارٍ التحديد...' : 'السماح بتحديد الموقع'}
                      </Button>
                    )}
                    {gpsStatus === 'denied' && (
                      <p className="text-red-400 text-xs">
                        ❌ تم رفض إذن الموقع. يرجى تفعيله من إعدادات المتصفح ثم المحاولة مجدداً.
                      </p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="bg-white/5 rounded-xl px-4 py-3 text-xs text-gray-400 space-y-1.5">
                    <div className="font-bold text-white text-sm mb-2">📋 تأكيد الموافقة</div>
                    <div>✅ المعلومات المُدخلة صحيحة وأتحمل مسؤولية أي بيانات مزورة</div>
                    <div>✅ أوافق على نظام العمولات (أول 10 صفقات مجانية، ثم 5%)</div>
                    <div>✅ أوافق على شروط الاستخدام وسياسة الخصوصية</div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── Navigation ── */}
          <div className="flex items-center gap-3 pt-2">
            {step > 1 && (
              <Button type="button" variant="secondary" onClick={prevStep} className="flex-1">
                ⟵ السابق
              </Button>
            )}
            {step < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={
                  (step === 2 && !allDocsUploaded) ||
                  (step === 3 && !diplomaUploaded)
                }
                className="flex-1"
              >
                التالي ⟶
              </Button>
            ) : (
              <Button
                type="submit"
                loading={isPending}
                disabled={!position}
                className="flex-1"
              >
                🚀 إرسال الطلب
              </Button>
            )}
          </div>
        </form>
      )}
    </Modal>
  )
}
