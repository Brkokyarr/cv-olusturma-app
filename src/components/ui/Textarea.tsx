import { clsx } from 'clsx'
import type { TextareaHTMLAttributes } from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({ className, ...rest }: TextareaProps) {
  return (
    <textarea
      className={clsx(
        'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted',
        'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
        className,
      )}
      {...rest}
    />
  )
}
