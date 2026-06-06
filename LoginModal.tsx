import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useUIStore } from '@/store/ui.store'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { resetPassword } from '@/services/auth.service'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  email:    z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة السر 6 أحرف على الأقل'),
})

const signupSchema = z.object({
  full_name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email:     z.string().email('البريد الإلكتروني غير صحيح'),
  phone:     z.string().min(9, 'رقم الهاتف غير صحيح'),
  password:  z.string().min(8, 'كلمة السر 8 أحرف على الأقل'),
  role:      z.enum(['buyer', 'seller']),
})

type LoginForm   = z.infer<typeof loginSchema>
type SignupForm  = z.infer<typeof signupSchema>
type AuthMode    = 'login' | 'signup' | 'reset'

export function LoginModal() {
  const { activeModal, closeModal, openModal } = useUIStore()
  const { login, signup, isLoggingIn, isSigningUp } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })
  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'buyer' },
  })

  const handleLogin = async (data: LoginForm) => {
    await login(data)
    closeModal()
  }

  const handleSignup = async (data: SignupForm) => {
    await signup(data)
    if (data.role === 'seller') openModal('register-seller')
    else closeModal()
  }

  const handleReset = async (data: { email: string }) => {
    await resetPassword(data.email)
    toast.success('تم إرسال رابط إعادة تعيين كلمة السر إلى بريدك')
    setMode('login')
  }

  return (
    <Modal
      isOpen={activeModal === 'login'}
      onClose={closeModal}
      size="sm"
      title={mode === 'login' ? '🔐 تسجيل الدخول' : mode === 'signup' ? '✨ إنشاء حساب' : '🔑 استعادة كلمة السر'}
    >
      <div className="space-y-5">

        {/* ── Login ── */}
        {mode === 'login' && (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <Input
              label="البريد الإلكتروني"
              type="email"
              placeholder="example@mail.com"
              error={loginForm.formState.errors.email?.message}
              {...loginForm.register('email')}
            />
            <Input
              label="كلمة السر"
              type="password"
              placeholder="••••••••"
              error={loginForm.formState.errors.password?.message}
              {...loginForm.register('password')}
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setMode('reset')}
                className="text-xs text-gray-400 hover:text-primary transition-colors"
              >
                نسيت كلمة السر؟
              </button>
            </div>
            <Button type="submit" loading={isLoggingIn} className="w-full">
              دخول
            </Button>
            <div className="text-center text-sm text-gray-400">
              ليس لديك حساب؟{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-primary font-bold hover:underline"
              >
                أنشئ حساباً
              </button>
            </div>
          </form>
        )}

        {/* ── Sign up ── */}
        {mode === 'signup' && (
          <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
            <Input
              label="الاسم الكامل"
              placeholder="محمد بن علي"
              error={signupForm.formState.errors.full_name?.message}
              {...signupForm.register('full_name')}
            />
            <Input
              label="البريد الإلكتروني"
              type="email"
              placeholder="example@mail.com"
              error={signupForm.formState.errors.email?.message}
              {...signupForm.register('email')}
            />
            <Input
              label="رقم الهاتف"
              type="tel"
              placeholder="0XXX XX XX XX"
              error={signupForm.formState.errors.phone?.message}
              {...signupForm.register('phone')}
            />
            <Input
              label="كلمة السر"
              type="password"
              placeholder="8 أحرف على الأقل"
              error={signupForm.formState.errors.password?.message}
              {...signupForm.register('password')}
            />

            {/* Role selector */}
            <div>
              <label className="text-sm font-semibold text-gray-300 block mb-2">أنت:</label>
              <div className="grid grid-cols-2 gap-2">
                {([['buyer', '🛒 زبون'], ['seller', '🛠️ حرفي']] as const).map(([val, lbl]) => (
                  <motion.label
                    key={val}
                    whileTap={{ scale: 0.97 }}
                    className={`
                      flex items-center justify-center gap-2 border-2 rounded-xl py-3 cursor-pointer
                      text-sm font-bold transition-all
                      ${signupForm.watch('role') === val
                        ? 'border-primary bg-primary/15 text-primary'
                        : 'border-white/10 text-gray-400 hover:border-white/30'}
                    `}
                  >
                    <input type="radio" value={val} className="hidden" {...signupForm.register('role')} />
                    {lbl}
                  </motion.label>
                ))}
              </div>
            </div>

            <Button type="submit" loading={isSigningUp} className="w-full">
              إنشاء الحساب
            </Button>
            <div className="text-center text-sm text-gray-400">
              لديك حساب؟{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-primary font-bold hover:underline"
              >
                سجّل الدخول
              </button>
            </div>
          </form>
        )}

        {/* ── Password reset ── */}
        {mode === 'reset' && (
          <form
            onSubmit={loginForm.handleSubmit(d => handleReset({ email: d.email }))}
            className="space-y-4"
          >
            <p className="text-sm text-gray-400">
              أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة السر.
            </p>
            <Input
              label="البريد الإلكتروني"
              type="email"
              placeholder="example@mail.com"
              {...loginForm.register('email')}
            />
            <Button type="submit" className="w-full">إرسال الرابط</Button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                ← العودة لتسجيل الدخول
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
