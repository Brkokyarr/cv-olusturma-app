export function formatRelativeDate(iso: string): string {
  const date = new Date(iso)
  const diffMinutes = Math.round((Date.now() - date.getTime()) / 60000)

  if (diffMinutes < 1) return 'az önce'
  if (diffMinutes < 60) return `${diffMinutes} dakika önce`

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} saat önce`

  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 7) return `${diffDays} gün önce`

  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}
