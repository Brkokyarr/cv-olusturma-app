import { Loader2, Trash2, Upload, User } from 'lucide-react'
import { useRef, useState } from 'react'
import { readImageAsResizedDataUrl } from '../../../lib/image'
import type { CustomFieldItem, PersonalInfo } from '../../../types/cv'
import { Field } from '../../ui/Field'
import { Input } from '../../ui/Input'
import { CustomFieldsStep } from './CustomFieldsStep'

interface PersonalInfoStepProps {
  data: PersonalInfo
  onChange: (patch: Partial<PersonalInfo>) => void
  customFields: CustomFieldItem[]
  onCustomFieldsChange: (items: CustomFieldItem[]) => void
}

export function PersonalInfoStep({
  data,
  onChange,
  customFields,
  onCustomFieldsChange,
}: PersonalInfoStepProps) {
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handlePhotoSelect(file: File) {
    setPhotoError(null)
    setIsUploadingPhoto(true)
    try {
      const photoDataUrl = await readImageAsResizedDataUrl(file)
      onChange({ photoDataUrl })
    } catch {
      setPhotoError('Fotoğraf yüklenemedi. Lütfen başka bir görsel deneyin.')
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-1 text-sm font-semibold text-text-primary">Ek Bilgiler</h3>
        <CustomFieldsStep items={customFields} onChange={onCustomFieldsChange} />
      </div>

      <div className="flex items-center gap-4 border-t border-border-subtle pt-6">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background">
          {isUploadingPhoto ? (
            <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
          ) : data.photoDataUrl ? (
            <img
              src={data.photoDataUrl}
              alt="Profil fotoğrafı"
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-8 w-8 text-text-muted" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-surface-hover px-3 py-2 text-xs font-medium text-text-primary hover:bg-primary-muted hover:text-primary"
            >
              <Upload className="h-3.5 w-3.5" />
              {data.photoDataUrl ? 'Fotoğrafı Değiştir' : 'Fotoğraf Yükle'}
            </button>
            {data.photoDataUrl && (
              <button
                type="button"
                onClick={() => onChange({ photoDataUrl: '' })}
                aria-label="Fotoğrafı kaldır"
                className="inline-flex items-center justify-center rounded-lg bg-surface-hover p-2 text-text-secondary hover:bg-danger/15 hover:text-danger"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <p className="text-xs text-text-muted">PNG veya JPEG, opsiyonel.</p>
          {photoError && <p className="text-xs text-danger">{photoError}</p>}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) handlePhotoSelect(file)
            event.target.value = ''
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Ad Soyad" htmlFor="fullName">
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            placeholder="Örn. Burak Ökyar"
          />
        </Field>
        <Field label="Unvan" htmlFor="title">
          <Input
            id="title"
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Örn. Yazılım Geliştirici"
          />
        </Field>
        <Field label="E-posta" htmlFor="email">
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="ornek@eposta.com"
          />
        </Field>
        <Field label="Telefon" htmlFor="phone">
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="05xx xxx xx xx"
          />
        </Field>
        <Field label="Konum" htmlFor="location">
          <Input
            id="location"
            value={data.location}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="Örn. İstanbul, Türkiye"
          />
        </Field>
      </div>
    </div>
  )
}
