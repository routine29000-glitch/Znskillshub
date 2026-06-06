// ─── Date ──────────────────────────────────────────────
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ar-DZ', {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date(iso))
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('ar-DZ', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}

export function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'منذ لحظات'
  if (seconds < 3600) return `منذ ${Math.floor(seconds / 60)} دقيقة`
  if (seconds < 86400) return `منذ ${Math.floor(seconds / 3600)} ساعة`
  if (seconds < 2592000) return `منذ ${Math.floor(seconds / 86400)} يوم`
  return formatDate(iso)
}

// ─── Numbers ───────────────────────────────────────────
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}م`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}ك`
  return n.toString()
}

export function formatDZD(amount: number): string {
  return `${amount.toLocaleString('ar-DZ')} دج`
}

// ─── Phone ─────────────────────────────────────────────
export function formatPhone(phone: string): string {
  // DZ phone: 0XXX XX XX XX
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `${digits.slice(0,4)} ${digits.slice(4,6)} ${digits.slice(6,8)} ${digits.slice(8)}`
  }
  return phone
}

// ─── Truncate ──────────────────────────────────────────
export function truncate(str: string, max: number): string {
  if (str.length <= max) return str
  return str.slice(0, max).trimEnd() + '…'
}

// ─── Status labels ─────────────────────────────────────
export function sellerStatusLabel(status: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    pending:           { label: '⏳ بانتظار التوثيق', color: 'text-yellow-500' },
    active:            { label: '✅ نشط',              color: 'text-green-500' },
    blocked:           { label: '🚫 محظور',            color: 'text-red-500' },
    permanently_banned:{ label: '❌ محظور نهائياً',   color: 'text-red-700' },
  }
  return map[status] ?? { label: status, color: 'text-gray-400' }
}

export function paymentStatusLabel(status: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    pending:   { label: '⏳ انتظار تأكيد', color: 'text-yellow-500' },
    confirmed: { label: '✅ مؤكد',         color: 'text-green-500' },
    rejected:  { label: '❌ مرفوض',        color: 'text-red-500' },
  }
  return map[status] ?? { label: status, color: 'text-gray-400' }
}
