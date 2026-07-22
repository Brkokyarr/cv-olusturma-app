import type { AccentColorId, AccentPalette, TemplateId } from '../types/cv'

export const ACCENT_COLORS: AccentPalette[] = [
  {
    id: 'antrasit',
    label: 'Antrasit',
    swatchClass: 'bg-cv-accent-antrasit',
    textClass: 'text-cv-accent-antrasit',
    bgClass: 'bg-cv-accent-antrasit',
    softBgClass: 'bg-cv-accent-antrasit/10',
    borderClass: 'border-cv-accent-antrasit',
  },
  {
    id: 'gri',
    label: 'Gri',
    swatchClass: 'bg-cv-accent-gri',
    textClass: 'text-cv-accent-gri',
    bgClass: 'bg-cv-accent-gri',
    softBgClass: 'bg-cv-accent-gri/10',
    borderClass: 'border-cv-accent-gri',
  },
  {
    id: 'bej',
    label: 'Bej',
    swatchClass: 'bg-cv-accent-bej',
    textClass: 'text-cv-accent-bej',
    bgClass: 'bg-cv-accent-bej',
    softBgClass: 'bg-cv-accent-bej/10',
    borderClass: 'border-cv-accent-bej',
  },
  {
    id: 'ten',
    label: 'Ten Rengi',
    swatchClass: 'bg-cv-accent-ten',
    textClass: 'text-cv-accent-ten',
    bgClass: 'bg-cv-accent-ten',
    softBgClass: 'bg-cv-accent-ten/10',
    borderClass: 'border-cv-accent-ten',
  },
  {
    id: 'bordo',
    label: 'Bordo',
    swatchClass: 'bg-cv-accent-bordo',
    textClass: 'text-cv-accent-bordo',
    bgClass: 'bg-cv-accent-bordo',
    softBgClass: 'bg-cv-accent-bordo/10',
    borderClass: 'border-cv-accent-bordo',
  },
  {
    id: 'lacivert',
    label: 'Lacivert',
    swatchClass: 'bg-cv-accent-lacivert',
    textClass: 'text-cv-accent-lacivert',
    bgClass: 'bg-cv-accent-lacivert',
    softBgClass: 'bg-cv-accent-lacivert/10',
    borderClass: 'border-cv-accent-lacivert',
  },
  {
    id: 'petrol',
    label: 'Petrol',
    swatchClass: 'bg-cv-accent-petrol',
    textClass: 'text-cv-accent-petrol',
    bgClass: 'bg-cv-accent-petrol',
    softBgClass: 'bg-cv-accent-petrol/10',
    borderClass: 'border-cv-accent-petrol',
  },
  {
    id: 'hardal',
    label: 'Hardal',
    swatchClass: 'bg-cv-accent-hardal',
    textClass: 'text-cv-accent-hardal',
    bgClass: 'bg-cv-accent-hardal',
    softBgClass: 'bg-cv-accent-hardal/10',
    borderClass: 'border-cv-accent-hardal',
  },
  {
    id: 'toz-pembe',
    label: 'Toz Pembe',
    swatchClass: 'bg-cv-accent-toz-pembe',
    textClass: 'text-cv-accent-toz-pembe',
    bgClass: 'bg-cv-accent-toz-pembe',
    softBgClass: 'bg-cv-accent-toz-pembe/10',
    borderClass: 'border-cv-accent-toz-pembe',
  },
  {
    id: 'zeytin',
    label: 'Zeytin',
    swatchClass: 'bg-cv-accent-zeytin',
    textClass: 'text-cv-accent-zeytin',
    bgClass: 'bg-cv-accent-zeytin',
    softBgClass: 'bg-cv-accent-zeytin/10',
    borderClass: 'border-cv-accent-zeytin',
  },
]

export function getAccentPalette(id: AccentColorId): AccentPalette {
  return ACCENT_COLORS.find((color) => color.id === id) ?? ACCENT_COLORS[0]
}

export interface TemplateOption {
  id: TemplateId
  label: string
  description: string
}

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: 'kart',
    label: 'Kart',
    description: 'Her bölüm kendi kartında — modern, panel tarzı bir görünüm.',
  },
  {
    id: 'zarif',
    label: 'Zarif',
    description: 'İnce serif tipografi, editoryal bir düzen — şık ve sade.',
  },
  {
    id: 'sik',
    label: 'Şık',
    description: 'Yuvarlak profil rozeti, noktalı dil seviyeleri — modern bir görünüm.',
  },
  {
    id: 'kompakt',
    label: 'Kompakt',
    description: 'Sağda nötr bilgi paneli, solda ana içerik — kurumsal ve düzenli.',
  },
  {
    id: 'bold',
    label: 'Bold',
    description: 'Renkli üst banner, rozet ikonlar — göz alıcı bir görünüm.',
  },
  {
    id: 'zaman-cizelgesi',
    label: 'Zaman Çizelgesi',
    description: 'Deneyim ve eğitim, bağlantılı zaman çizelgesiyle.',
  },
  { id: 'yaratici', label: 'Yaratıcı', description: 'Renkli kenar sütunlu, öne çıkan tasarım.' },
  { id: 'minimalist', label: 'Minimalist', description: 'Bol boşluk, ince çizgiler, sade tipografi.' },
  { id: 'klasik', label: 'Klasik', description: 'Ortalanmış başlık, resmi ve seri görünüm.' },
  { id: 'modern', label: 'Modern', description: 'Sade, tek sütun ve düzenli başlıklar.' },
]

export function getTemplateLabel(id: TemplateId): string {
  return TEMPLATE_OPTIONS.find((template) => template.id === id)?.label ?? 'Modern'
}
