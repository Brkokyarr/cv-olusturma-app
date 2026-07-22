import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  tone?: 'primary' | 'accent' | 'success' | 'warning'
}

const TONE_CLASSES: Record<NonNullable<BadgeProps['tone']>, string> = {
  primary: 'bg-primary-muted text-primary',
  accent: 'bg-accent/15 text-accent',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
}

export function Badge({ children, tone = 'primary' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        TONE_CLASSES[tone],
      )}
    >
      {children}
    </span>
  )
}
