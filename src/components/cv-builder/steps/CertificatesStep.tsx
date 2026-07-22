import { Plus, Trash2 } from 'lucide-react'
import { createId } from '../../../lib/id'
import type { CertificateItem } from '../../../types/cv'
import { Button } from '../../ui/Button'
import { Field } from '../../ui/Field'
import { Input } from '../../ui/Input'

interface CertificatesStepProps {
  items: CertificateItem[]
  onChange: (items: CertificateItem[]) => void
}

export function CertificatesStep({ items, onChange }: CertificatesStepProps) {
  function addItem() {
    onChange([...items, { id: createId(), name: '', issuer: '', year: '' }])
  }

  function updateItem(id: string, patch: Partial<CertificateItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-text-muted">Bu bölüm opsiyoneldir.</p>

      {items.length === 0 && (
        <p className="text-sm text-text-secondary">Henüz sertifika eklenmedi.</p>
      )}

      {items.map((item, index) => (
        <div
          key={item.id}
          className="rounded-card border border-border-subtle bg-background p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              Sertifika {index + 1}
            </span>
            <button
              type="button"
              aria-label="Bu sertifikayı sil"
              onClick={() => removeItem(item.id)}
              className="rounded-lg p-1.5 text-text-muted hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Sertifika Adı" htmlFor={`cert-name-${item.id}`}>
              <Input
                id={`cert-name-${item.id}`}
                value={item.name}
                onChange={(e) => updateItem(item.id, { name: e.target.value })}
                placeholder="Örn. AWS Certified"
              />
            </Field>
            <Field label="Kurum" htmlFor={`cert-issuer-${item.id}`}>
              <Input
                id={`cert-issuer-${item.id}`}
                value={item.issuer}
                onChange={(e) => updateItem(item.id, { issuer: e.target.value })}
                placeholder="Örn. Amazon"
              />
            </Field>
            <Field label="Yıl" htmlFor={`cert-year-${item.id}`}>
              <Input
                id={`cert-year-${item.id}`}
                value={item.year}
                onChange={(e) => updateItem(item.id, { year: e.target.value })}
                placeholder="Örn. 2023"
              />
            </Field>
          </div>
        </div>
      ))}

      <Button variant="secondary" onClick={addItem} className="self-start">
        <Plus className="h-4 w-4" />
        Sertifika Ekle
      </Button>
    </div>
  )
}
