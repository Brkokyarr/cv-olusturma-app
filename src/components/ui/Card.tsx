import { clsx } from 'clsx'
import type { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-card border border-border bg-surface p-5',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
