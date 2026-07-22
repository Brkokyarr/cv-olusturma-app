import { clsx } from 'clsx'
import { Check } from 'lucide-react'
import { ACCENT_COLORS, TEMPLATE_OPTIONS } from '../../../lib/theme'
import type { CvTheme, TemplateId } from '../../../types/cv'

interface TemplateStepProps {
  theme: CvTheme
  onChange: (theme: CvTheme) => void
}

function TemplateMiniPreview({ id }: { id: TemplateId }) {
  switch (id) {
    case 'klasik':
      return (
        <div className="flex w-full flex-col items-center gap-1 px-3">
          <div className="h-1.5 w-10 rounded-full bg-text-muted" />
          <div className="h-1 w-14 rounded-full bg-text-muted/50" />
          <div className="mt-1 h-px w-16 bg-text-muted/40" />
          <div className="h-1 w-16 rounded-full bg-text-muted/30" />
        </div>
      )
    case 'minimalist':
      return (
        <div className="flex w-full items-stretch gap-2 px-3">
          <div className="w-0.5 shrink-0 rounded-full bg-text-muted/50" />
          <div className="flex flex-1 flex-col justify-center gap-1.5">
            <div className="h-1.5 w-12 rounded-full bg-text-muted" />
            <div className="h-1 w-16 rounded-full bg-text-muted/30" />
            <div className="h-1 w-10 rounded-full bg-text-muted/30" />
          </div>
        </div>
      )
    case 'yaratici':
      return (
        <div className="flex h-full w-full items-stretch gap-1.5 px-3">
          <div className="w-1/3 rounded bg-text-muted/60" />
          <div className="flex flex-1 flex-col justify-center gap-1.5">
            <div className="h-1 w-full rounded-full bg-text-muted/30" />
            <div className="h-1 w-3/4 rounded-full bg-text-muted/30" />
            <div className="h-1 w-full rounded-full bg-text-muted/30" />
          </div>
        </div>
      )
    case 'zaman-cizelgesi':
      return (
        <div className="flex w-full items-stretch gap-2 px-3">
          <div className="flex w-1 shrink-0 flex-col items-center gap-2 py-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-text-muted" />
            <div className="w-px flex-1 bg-text-muted/30" />
            <div className="h-1.5 w-1.5 rounded-full bg-text-muted" />
          </div>
          <div className="flex flex-1 flex-col justify-between gap-1.5">
            <div className="h-1 w-full rounded-full bg-text-muted/40" />
            <div className="h-1 w-2/3 rounded-full bg-text-muted/30" />
          </div>
        </div>
      )
    case 'bold':
      return (
        <div className="flex w-full flex-col gap-1.5">
          <div className="h-4 w-full rounded-t-md bg-text-muted/60" />
          <div className="flex flex-col gap-1.5 px-3 pb-1">
            <div className="h-1 w-3/4 rounded-full bg-text-muted/40" />
            <div className="h-1 w-full rounded-full bg-text-muted/30" />
            <div className="h-1 w-2/3 rounded-full bg-text-muted/30" />
          </div>
        </div>
      )
    case 'modern':
    default:
      return (
        <div className="flex w-full flex-col gap-1.5 px-3">
          <div className="h-1.5 w-14 rounded-full bg-text-muted" />
          <div className="h-1 w-10 rounded-full bg-text-muted/40" />
          <div className="mt-1 h-1 w-full rounded-full bg-text-muted/30" />
          <div className="h-1 w-full rounded-full bg-text-muted/30" />
          <div className="h-1 w-2/3 rounded-full bg-text-muted/30" />
        </div>
      )
  }
}

export function TemplateStep({ theme, onChange }: TemplateStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-primary">Şablon Stili</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TEMPLATE_OPTIONS.map((option) => {
            const isSelected = theme.template === option.id
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onChange({ ...theme, template: option.id })}
                aria-pressed={isSelected}
                className={clsx(
                  'flex flex-col items-center gap-2 rounded-card border p-3 text-center transition-colors',
                  isSelected
                    ? 'border-primary bg-primary-muted'
                    : 'border-border bg-background hover:bg-surface-hover',
                )}
              >
                <div className="flex h-16 w-full items-center justify-center rounded-md bg-surface py-2">
                  <TemplateMiniPreview id={option.id} />
                </div>
                <span
                  className={clsx(
                    'text-xs font-medium',
                    isSelected ? 'text-primary' : 'text-text-secondary',
                  )}
                >
                  {option.label}
                </span>
                <span className="text-[11px] leading-snug text-text-muted">
                  {option.description}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-primary">Renk Teması</h3>
        <div className="flex flex-wrap gap-3">
          {ACCENT_COLORS.map((color) => {
            const isSelected = theme.accentColor === color.id
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => onChange({ ...theme, accentColor: color.id })}
                aria-label={color.label}
                aria-pressed={isSelected}
                className={clsx(
                  'flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-surface transition-shadow',
                  color.swatchClass,
                  isSelected ? 'ring-text-primary' : 'ring-transparent',
                )}
              >
                {isSelected && <Check className="h-4 w-4 text-white" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
