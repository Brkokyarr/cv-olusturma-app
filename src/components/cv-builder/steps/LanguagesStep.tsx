import { Plus, Trash2 } from 'lucide-react'
import { createId } from '../../../lib/id'
import type { LanguageItem } from '../../../types/cv'
import { Button } from '../../ui/Button'
import { Field } from '../../ui/Field'
import { Input } from '../../ui/Input'

const LEVELS = ['Başlangıç', 'Orta', 'İyi', 'Akıcı', 'Anadil']

interface LanguagesStepProps {
  items: LanguageItem[]
  onChange: (items: LanguageItem[]) => void
}

export function LanguagesStep({ items, onChange }: LanguagesStepProps) {
  function addItem() {
    onChange([...items, { id: createId(), name: '', level: LEVELS[0] }])
  }

  function updateItem(id: string, patch: Partial<LanguageItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 && (
        <p className="text-sm text-text-secondary">Henüz dil eklenmedi.</p>
      )}

      {items.map((item) => (
        <div key={item.id} className="flex items-end gap-3">
          <div className="flex-1">
            <Field label="Dil" htmlFor={`lang-name-${item.id}`}>
              <Input
                id={`lang-name-${item.id}`}
                value={item.name}
                onChange={(e) => updateItem(item.id, { name: e.target.value })}
                placeholder="Örn. İngilizce"
              />
            </Field>
          </div>
          <div className="w-40">
            <Field label="Seviye" htmlFor={`lang-level-${item.id}`}>
              <select
                id={`lang-level-${item.id}`}
                value={item.level}
                onChange={(e) => updateItem(item.id, { level: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <button
            type="button"
            aria-label="Bu dili sil"
            onClick={() => removeItem(item.id)}
            className="mb-0.5 rounded-lg p-2 text-text-muted hover:bg-danger/10 hover:text-danger"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      <Button variant="secondary" onClick={addItem} className="self-start">
        <Plus className="h-4 w-4" />
        Dil Ekle
      </Button>
    </div>
  )
}
