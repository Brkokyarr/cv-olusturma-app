import { clsx } from 'clsx'
import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...rest }: InputProps) {
  return (
    <input
      className={clsx(
        'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted',
        'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
        className,
      )}
      {...rest}
    />
  )
}
