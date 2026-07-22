import { clsx } from 'clsx'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface SectionHeadingProps {
  icon: LucideIcon
  children: ReactNode
  className?: string
}

export function SectionHeading({ icon: Icon, children, className }: SectionHeadingProps) {
  return (
    <h2 className={clsx('flex items-center gap-1.5 font-semibold uppercase tracking-wide', className)}>
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {children}
    </h2>
  )
}
