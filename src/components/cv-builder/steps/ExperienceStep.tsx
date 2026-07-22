import { Plus, Trash2 } from 'lucide-react'
import { createId } from '../../../lib/id'
import type { ExperienceItem } from '../../../types/cv'
import { Button } from '../../ui/Button'
import { Field } from '../../ui/Field'
import { Input } from '../../ui/Input'
import { Textarea } from '../../ui/Textarea'

interface ExperienceStepProps {
  items: ExperienceItem[]
  onChange: (items: ExperienceItem[]) => void
}

export function ExperienceStep({ items, onChange }: ExperienceStepProps) {
  function addItem() {
    onChange([
      ...items,
      {
        id: createId(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    ])
  }

  function updateItem(id: string, patch: Partial<ExperienceItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id))
  }

  return (
    <div className="flex flex-col gap-5">
      {items.length === 0 && (
        <p className="text-sm text-text-secondary">Henüz iş deneyimi eklenmedi.</p>
      )}

      {items.map((item, index) => (
        <div
          key={item.id}
          className="rounded-card border border-border-subtle bg-background p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              Deneyim {index + 1}
            </span>
            <button
              type="button"
              aria-label="Bu deneyimi sil"
              onClick={() => removeItem(item.id)}
              className="rounded-lg p-1.5 text-text-muted hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Şirket" htmlFor={`company-${item.id}`}>
              <Input
                id={`company-${item.id}`}
                value={item.company}
                onChange={(e) => updateItem(item.id, { company: e.target.value })}
                placeholder="Örn. Acme A.Ş."
              />
            </Field>
            <Field label="Pozisyon" htmlFor={`position-${item.id}`}>
              <Input
                id={`position-${item.id}`}
                value={item.position}
                onChange={(e) => updateItem(item.id, { position: e.target.value })}
                placeholder="Örn. Yazılım Geliştirici"
              />
            </Field>
            <Field label="Başlangıç" htmlFor={`start-${item.id}`}>
              <Input
                id={`start-${item.id}`}
                value={item.startDate}
                onChange={(e) => updateItem(item.id, { startDate: e.target.value })}
                placeholder="Örn. 2022"
              />
            </Field>
            <Field label="Bitiş" htmlFor={`end-${item.id}`}>
              <Input
                id={`end-${item.id}`}
                value={item.endDate}
                onChange={(e) => updateItem(item.id, { endDate: e.target.value })}
                placeholder="Örn. Halen"
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Açıklama" htmlFor={`desc-${item.id}`}>
              <Textarea
                id={`desc-${item.id}`}
                rows={3}
                value={item.description}
                onChange={(e) => updateItem(item.id, { description: e.target.value })}
                placeholder="Sorumluluklarınız ve başarılarınız..."
              />
            </Field>
          </div>
        </div>
      ))}

      <Button variant="secondary" onClick={addItem} className="self-start">
        <Plus className="h-4 w-4" />
        Deneyim Ekle
      </Button>
    </div>
  )
}
