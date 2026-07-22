import { Plus, Trash2 } from 'lucide-react'
import { createId } from '../../../lib/id'
import type { EducationItem } from '../../../types/cv'
import { Button } from '../../ui/Button'
import { Field } from '../../ui/Field'
import { Input } from '../../ui/Input'

interface EducationStepProps {
  items: EducationItem[]
  onChange: (items: EducationItem[]) => void
}

export function EducationStep({ items, onChange }: EducationStepProps) {
  function addItem() {
    onChange([
      ...items,
      { id: createId(), school: '', field: '', startDate: '', endDate: '' },
    ])
  }

  function updateItem(id: string, patch: Partial<EducationItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id))
  }

  return (
    <div className="flex flex-col gap-5">
      {items.length === 0 && (
        <p className="text-sm text-text-secondary">Henüz eğitim bilgisi eklenmedi.</p>
      )}

      {items.map((item, index) => (
        <div
          key={item.id}
          className="rounded-card border border-border-subtle bg-background p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              Eğitim {index + 1}
            </span>
            <button
              type="button"
              aria-label="Bu eğitim bilgisini sil"
              onClick={() => removeItem(item.id)}
              className="rounded-lg p-1.5 text-text-muted hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Okul" htmlFor={`school-${item.id}`}>
              <Input
                id={`school-${item.id}`}
                value={item.school}
                onChange={(e) => updateItem(item.id, { school: e.target.value })}
                placeholder="Örn. İstanbul Üniversitesi"
              />
            </Field>
            <Field label="Bölüm" htmlFor={`field-${item.id}`}>
              <Input
                id={`field-${item.id}`}
                value={item.field}
                onChange={(e) => updateItem(item.id, { field: e.target.value })}
                placeholder="Örn. Bilgisayar Mühendisliği"
              />
            </Field>
            <Field label="Başlangıç" htmlFor={`edu-start-${item.id}`}>
              <Input
                id={`edu-start-${item.id}`}
                value={item.startDate}
                onChange={(e) => updateItem(item.id, { startDate: e.target.value })}
                placeholder="Örn. 2018"
              />
            </Field>
            <Field label="Bitiş" htmlFor={`edu-end-${item.id}`}>
              <Input
                id={`edu-end-${item.id}`}
                value={item.endDate}
                onChange={(e) => updateItem(item.id, { endDate: e.target.value })}
                placeholder="Örn. 2022"
              />
            </Field>
          </div>
        </div>
      ))}

      <Button variant="secondary" onClick={addItem} className="self-start">
        <Plus className="h-4 w-4" />
        Eğitim Ekle
      </Button>
    </div>
  )
}
