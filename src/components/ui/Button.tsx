import { clsx } from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger-ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-text-primary hover:bg-primary-hover',
  secondary:
    'border border-border bg-surface text-text-primary hover:bg-surface-hover',
  ghost: 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
  'danger-ghost': 'text-danger hover:bg-danger/10',
}

export function Button({
  variant = 'secondary',
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...rest}
    />
  )
}
