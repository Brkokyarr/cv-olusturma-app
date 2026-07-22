import { Plus, Trash2 } from 'lucide-react'
import { createId } from '../../../lib/id'
import type { ReferenceItem } from '../../../types/cv'
import { Button } from '../../ui/Button'
import { Field } from '../../ui/Field'
import { Input } from '../../ui/Input'

interface ReferencesStepProps {
  items: ReferenceItem[]
  onChange: (items: ReferenceItem[]) => void
}

export function ReferencesStep({ items, onChange }: ReferencesStepProps) {
  function addItem() {
    onChange([...items, { id: createId(), name: '', relation: '', contact: '' }])
  }

  function updateItem(id: string, patch: Partial<ReferenceItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-text-muted">Bu bölüm opsiyoneldir.</p>

      {items.length === 0 && (
        <p className="text-sm text-text-secondary">Henüz referans eklenmedi.</p>
      )}

      {items.map((item, index) => (
        <div
          key={item.id}
          className="rounded-card border border-border-subtle bg-background p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              Referans {index + 1}
            </span>
            <button
              type="button"
              aria-label="Bu referansı sil"
              onClick={() => removeItem(item.id)}
              className="rounded-lg p-1.5 text-text-muted hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Ad Soyad" htmlFor={`ref-name-${item.id}`}>
              <Input
                id={`ref-name-${item.id}`}
                value={item.name}
                onChange={(e) => updateItem(item.id, { name: e.target.value })}
                placeholder="Örn. Ayşe Yılmaz"
              />
            </Field>
            <Field label="İlişki" htmlFor={`ref-relation-${item.id}`}>
              <Input
                id={`ref-relation-${item.id}`}
                value={item.relation}
                onChange={(e) => updateItem(item.id, { relation: e.target.value })}
                placeholder="Örn. Yöneticim"
              />
            </Field>
            <Field label="İletişim" htmlFor={`ref-contact-${item.id}`}>
              <Input
                id={`ref-contact-${item.id}`}
                value={item.contact}
                onChange={(e) => updateItem(item.id, { contact: e.target.value })}
                placeholder="E-posta veya telefon"
              />
            </Field>
          </div>
        </div>
      ))}

      <Button variant="secondary" onClick={addItem} className="self-start">
        <Plus className="h-4 w-4" />
        Referans Ekle
      </Button>
    </div>
  )
}
