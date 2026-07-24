import {
  Award,
  Briefcase,
  GraduationCap,
  Languages as LanguagesIcon,
  Tag,
  User,
  Users,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DEFAULT_SECTION_ORDER, type SectionKey } from '../types/cv'

export const SECTION_LABELS: Record<SectionKey, string> = {
  summary: 'Hakkımda',
  experience: 'İş Deneyimi',
  education: 'Eğitim',
  skills: 'Yetenekler',
  languages: 'Diller',
  certificates: 'Sertifikalar',
  references: 'Referanslar',
  customFields: 'Ek Bilgiler',
}

export const SECTION_ICONS: Record<SectionKey, LucideIcon> = {
  summary: User,
  experience: Briefcase,
  education: GraduationCap,
  skills: Wrench,
  languages: LanguagesIcon,
  certificates: Award,
  references: Users,
  customFields: Tag,
}

function isSectionKey(value: unknown): value is SectionKey {
  return typeof value === 'string' && (DEFAULT_SECTION_ORDER as string[]).includes(value)
}

export function normalizeSectionOrder(order: unknown): SectionKey[] {
  const seen = new Set<SectionKey>()
  const valid: SectionKey[] = []
  if (Array.isArray(order)) {
    for (const key of order) {
      if (isSectionKey(key) && !seen.has(key)) {
        seen.add(key)
        valid.push(key)
      }
    }
  }
  const missing = DEFAULT_SECTION_ORDER.filter((key) => !seen.has(key))
  return [...valid, ...missing]
}
