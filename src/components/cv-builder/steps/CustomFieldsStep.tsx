import { Plus, Trash2 } from 'lucide-react'
import { createId } from '../../../lib/id'
import type { CustomFieldItem } from '../../../types/cv'
import { Button } from '../../ui/Button'
import { Field } from '../../ui/Field'
import { Input } from '../../ui/Input'

interface CustomFieldsStepProps {
  items: CustomFieldItem[]
  onChange: (items: CustomFieldItem[]) => void
}

export function CustomFieldsStep({ items, onChange }: CustomFieldsStepProps) {
  function addItem() {
    onChange([...items, { id: createId(), label: '', value: '' }])
  }

  function updateItem(id: string, patch: Partial<CustomFieldItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-text-muted">
        Standart bölümlerde yer almayan, eklemek istediğin her şey için kendi kategorini
        oluşturabilirsin. Örn. "Sigara Kullanımı: Hayır", "Sürücü Belgesi: B Sınıfı", "Askerlik: Yapıldı".
        Bu bölüm opsiyoneldir.
      </p>

      {items.length === 0 && (
        <p className="text-sm text-text-secondary">Henüz ek bilgi eklenmedi.</p>
      )}

      {items.map((item, index) => (
        <div
          key={item.id}
          className="rounded-card border border-border-subtle bg-background p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">Ek Bilgi {index + 1}</span>
            <button
              type="button"
              aria-label="Bu ek bilgiyi sil"
              onClick={() => removeItem(item.id)}
              className="rounded-lg p-1.5 text-text-muted hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Kategori" htmlFor={`custom-label-${item.id}`}>
              <Input
                id={`custom-label-${item.id}`}
                value={item.label}
                onChange={(e) => updateItem(item.id, { label: e.target.value })}
                placeholder="Örn. Sigara Kullanımı"
              />
            </Field>
            <Field label="Değer" htmlFor={`custom-value-${item.id}`}>
              <Input
                id={`custom-value-${item.id}`}
                value={item.value}
                onChange={(e) => updateItem(item.id, { value: e.target.value })}
                placeholder="Örn. Hayır"
              />
            </Field>
          </div>
        </div>
      ))}

      <Button variant="secondary" onClick={addItem} className="self-start">
        <Plus className="h-4 w-4" />
        Kategori Ekle
      </Button>
    </div>
  )
}
