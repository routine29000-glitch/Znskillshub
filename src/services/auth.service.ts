import { supabase } from '@/lib/supabase'
import type { SignupForm, LoginForm, Profile } from '@/types'

// ─── Sign Up ───────────────────────────────────────────
export async function signUp(form: SignupForm): Promise<Profile> {
  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: {
      data: {
        full_name: form.full_name,
        phone: form.phone,
        role: form.role,
      },
    },
  })

  if (error) throw error
  if (!data.user) throw new Error('فشل إنشاء الحساب')

  // Update profile with extra fields
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .update({ full_name: form.full_name, phone: form.phone, role: form.role })
    .eq('id', data.user.id)
    .select()
    .single()

  if (profileError) throw profileError
  return profile as Profile
}

// ─── Sign In ───────────────────────────────────────────
export async function signIn(form: LoginForm) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: form.email,
    password: form.password,
  })

  if (error) throw error
  return data
}

// ─── Sign Out ──────────────────────────────────────────
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// ─── Get Current Session ───────────────────────────────
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

// ─── Get Current Profile ──────────────────────────────
export async function getCurrentProfile(): Promise<Profile | null> {
  const session = await getSession()
  if (!session) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (error) throw error
  return data as Profile
}

// ─── Update Profile ────────────────────────────────────
export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'full_name' | 'phone' | 'avatar_url' | 'wilaya' | 'commune'>>
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}

// ─── Reset Password ────────────────────────────────────
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}
