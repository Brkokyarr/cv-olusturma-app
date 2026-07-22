import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  htmlFor: string
  children: ReactNode
  hint?: string
}

export function Field({ label, htmlFor, children, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-text-primary">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  )
}
