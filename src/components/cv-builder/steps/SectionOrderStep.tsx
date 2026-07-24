import { clsx } from 'clsx'
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react'
import { useState } from 'react'
import { SECTION_ICONS, SECTION_LABELS } from '../../../lib/cvSections'
import type { CvData, SectionKey } from '../../../types/cv'

interface SectionOrderStepProps {
  data: CvData
  order: SectionKey[]
  onChange: (order: SectionKey[]) => void
}

function isSectionEmpty(data: CvData, key: SectionKey): boolean {
  switch (key) {
    case 'summary':
      return !data.summary.trim()
    case 'experience':
      return data.experience.length === 0
    case 'education':
      return data.education.length === 0
    case 'skills':
      return data.skills.length === 0
    case 'languages':
      return data.languages.length === 0
    case 'certificates':
      return data.certificates.length === 0
    case 'references':
      return data.references.length === 0
    case 'customFields':
      return data.customFields.length === 0
    default:
      return true
  }
}

export function SectionOrderStep({ data, order, onChange }: SectionOrderStepProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  function moveSection(index: number, direction: -1 | 1) {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= order.length) return
    const next = [...order]
    ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
    onChange(next)
  }

  function handleDragOver(index: number) {
    if (draggedIndex === null || draggedIndex === index) return
    const next = [...order]
    const [moved] = next.splice(draggedIndex, 1)
    next.splice(index, 0, moved)
    onChange(next)
    setDraggedIndex(index)
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-text-secondary">
        Bölümleri sürükleyip bırakarak ya da ok tuşlarıyla CV'deki sırasını değiştirin. Boş
        bölümler CV'de görünmez, ama sırasını yine de ayarlayabilirsiniz.
      </p>

      <div className="flex flex-col gap-2">
        {order.map((key, index) => {
          const Icon = SECTION_ICONS[key]
          const isEmpty = isSectionEmpty(data, key)
          return (
            <div
              key={key}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragOver={(event) => {
                event.preventDefault()
                handleDragOver(index)
              }}
              onDrop={(event) => event.preventDefault()}
              onDragEnd={() => setDraggedIndex(null)}
              className={clsx(
                'flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5 transition-colors',
                draggedIndex === index ? 'opacity-50' : 'hover:border-primary/40',
              )}
            >
              <span className="cursor-grab text-text-muted active:cursor-grabbing" aria-hidden="true">
                <GripVertical className="h-4 w-4" />
              </span>
              <Icon className="h-4 w-4 shrink-0 text-text-secondary" />
              <span className="flex-1 text-sm font-medium text-text-primary">
                {SECTION_LABELS[key]}
              </span>
              {isEmpty && (
                <span className="rounded-full bg-surface-hover px-2 py-0.5 text-[10px] font-medium text-text-muted">
                  Boş
                </span>
              )}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveSection(index, -1)}
                  disabled={index === 0}
                  aria-label={`${SECTION_LABELS[key]} bölümünü yukarı taşı`}
                  className="rounded p-1 text-text-secondary hover:bg-surface-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(index, 1)}
                  disabled={index === order.length - 1}
                  aria-label={`${SECTION_LABELS[key]} bölümünü aşağı taşı`}
                  className="rounded p-1 text-text-secondary hover:bg-surface-hover hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
