export interface PersonalInfo {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  photoDataUrl: string
}

export interface ExperienceItem {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

export interface EducationItem {
  id: string
  school: string
  field: string
  startDate: string
  endDate: string
}

export interface LanguageItem {
  id: string
  name: string
  level: string
}

export interface CertificateItem {
  id: string
  name: string
  issuer: string
  year: string
}

export interface ReferenceItem {
  id: string
  name: string
  relation: string
  contact: string
}

export interface CustomFieldItem {
  id: string
  label: string
  value: string
}

export type SectionKey =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'certificates'
  | 'references'
  | 'customFields'

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'summary',
  'experience',
  'education',
  'skills',
  'languages',
  'certificates',
  'references',
  'customFields',
]

export type TemplateId =
  | 'modern'
  | 'klasik'
  | 'minimalist'
  | 'yaratici'
  | 'zaman-cizelgesi'
  | 'bold'
  | 'kompakt'
  | 'sik'
  | 'zarif'
  | 'kart'
  | 'afis'

export type AccentColorId =
  | 'antrasit'
  | 'gri'
  | 'bej'
  | 'ten'
  | 'bordo'
  | 'lacivert'
  | 'petrol'
  | 'hardal'
  | 'toz-pembe'
  | 'zeytin'

export interface AccentPalette {
  id: AccentColorId
  label: string
  swatchClass: string
  textClass: string
  bgClass: string
  softBgClass: string
  borderClass: string
}

export type PaperColorId = 'beyaz' | AccentColorId

export interface CvTheme {
  template: TemplateId
  accentColor: AccentColorId
  paperColor: PaperColorId
}

export interface CvData {
  theme: CvTheme
  personalInfo: PersonalInfo
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: string[]
  languages: LanguageItem[]
  certificates: CertificateItem[]
  references: ReferenceItem[]
  customFields: CustomFieldItem[]
  sectionOrder: SectionKey[]
}

export interface StoredCv {
  id: string
  name: string
  data: CvData
  createdAt: string
  updatedAt: string
}

export const EMPTY_CV_DATA: CvData = {
  theme: {
    template: 'modern',
    accentColor: 'antrasit',
    paperColor: 'beyaz',
  },
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    photoDataUrl: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certificates: [],
  references: [],
  customFields: [],
  sectionOrder: [...DEFAULT_SECTION_ORDER],
}
