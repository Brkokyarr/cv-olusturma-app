import { Check } from 'lucide-react'
import { clsx } from 'clsx'

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
  onStepSelect: (index: number) => void
}

export function StepIndicator({ steps, currentStep, onStepSelect }: StepIndicatorProps) {
  return (
    <ol className="flex flex-wrap gap-2">
      {steps.map((label, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep

        return (
          <li key={label}>
            <button
              type="button"
              onClick={() => onStepSelect(index)}
              aria-current={isActive ? 'step' : undefined}
              className={clsx(
                'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                isActive && 'border-primary bg-primary-muted text-primary',
                isCompleted && !isActive && 'border-border bg-surface text-text-secondary hover:bg-surface-hover',
                !isActive && !isCompleted && 'border-border-subtle text-text-muted hover:bg-surface-hover',
              )}
            >
              <span
                className={clsx(
                  'flex h-4 w-4 items-center justify-center rounded-full text-[10px]',
                  isCompleted ? 'bg-success text-background' : 'bg-surface-hover',
                )}
              >
                {isCompleted ? <Check className="h-3 w-3" /> : index + 1}
              </span>
              {label}
            </button>
          </li>
        )
      })}
    </ol>
  )
}
