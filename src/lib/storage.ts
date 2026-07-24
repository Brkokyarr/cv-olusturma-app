import { normalizeSectionOrder } from './cvSections'
import { EMPTY_CV_DATA, type StoredCv } from '../types/cv'

const CVS_KEY = 'cv-app:cvs'

export function loadStoredCvs(): StoredCv[] {
  try {
    const raw = localStorage.getItem(CVS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Şablon/fotoğraf/isim/sıralama özelliklerinden önce kaydedilmiş CV'lerde bu alanlar olmayabilir.
    return parsed.map((cv: StoredCv) => ({
      ...cv,
      name: cv.name?.trim() || cv.data.personalInfo.fullName || 'İsimsiz CV',
      data: {
        ...cv.data,
        theme: { ...EMPTY_CV_DATA.theme, ...cv.data.theme },
        personalInfo: {
          ...cv.data.personalInfo,
          photoDataUrl: cv.data.personalInfo.photoDataUrl ?? '',
        },
        customFields: cv.data.customFields ?? [],
        sectionOrder: normalizeSectionOrder(cv.data.sectionOrder),
      },
    }))
  } catch {
    return []
  }
}

export function saveStoredCvs(cvs: StoredCv[]): void {
  try {
    localStorage.setItem(CVS_KEY, JSON.stringify(cvs))
  } catch {
    // localStorage kullanılamıyorsa (gizli sekme, kota dolu) sessizce yok say
  }
}

