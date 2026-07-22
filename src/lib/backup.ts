import { createId } from './id'
import { normalizeSectionOrder } from './cvSections'
import type { StoredCv } from '../types/cv'

export function exportCvsAsJson(cvs: StoredCv[]): void {
  const payload = {
    exportedAt: new Date().toISOString(),
    cvs,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `cv-yedek-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

function isValidStoredCv(value: unknown): value is StoredCv {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<StoredCv>
  return Boolean(candidate.data && typeof candidate.data === 'object' && candidate.data.personalInfo)
}

export async function parseImportedCvsFile(file: File): Promise<StoredCv[]> {
  const text = await file.text()
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Dosya geçerli bir JSON değil.')
  }

  const list = Array.isArray(parsed)
    ? parsed
    : (parsed as { cvs?: unknown })?.cvs

  if (!Array.isArray(list)) {
    throw new Error('Dosya formatı tanınmadı — bu uygulamadan dışa aktarılmış bir yedek dosyası seçin.')
  }

  const validEntries = list.filter(isValidStoredCv)
  if (validEntries.length === 0) {
    throw new Error('Dosyada geçerli bir CV bulunamadı.')
  }

  // Mevcut CV'lerle çakışmaması için içe aktarılan her kayda yeni bir id veriyoruz.
  return validEntries.map((cv) => ({
    ...cv,
    id: createId(),
    name: cv.name?.trim() || cv.data.personalInfo.fullName || 'İsimsiz CV',
    data: {
      ...cv.data,
      sectionOrder: normalizeSectionOrder(cv.data.sectionOrder),
    },
  }))
}
