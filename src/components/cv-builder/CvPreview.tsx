import { clsx } from 'clsx'
import { forwardRef } from 'react'
import { getAccentPalette, getPaperBgClass } from '../../lib/theme'
import type { CvData, TemplateId } from '../../types/cv'
import { AfisTemplate } from './templates/AfisTemplate'
import { BoldTemplate } from './templates/BoldTemplate'
import { KartTemplate } from './templates/KartTemplate'
import { KlasikTemplate } from './templates/KlasikTemplate'
import { KompaktTemplate } from './templates/KompaktTemplate'
import { MinimalistTemplate } from './templates/MinimalistTemplate'
import { ModernTemplate } from './templates/ModernTemplate'
import { SikTemplate } from './templates/SikTemplate'
import { TimelineTemplate } from './templates/TimelineTemplate'
import { YaraticiTemplate } from './templates/YaraticiTemplate'
import { ZarifTemplate } from './templates/ZarifTemplate'

interface CvPreviewProps {
  data: CvData
  id?: string
  scrollable?: boolean
  fixedAspect?: boolean
}

export const CV_PREVIEW_ELEMENT_ID = 'cv-preview-paper'

const TEMPLATE_COMPONENTS: Record<TemplateId, typeof ModernTemplate> = {
  modern: ModernTemplate,
  klasik: KlasikTemplate,
  minimalist: MinimalistTemplate,
  yaratici: YaraticiTemplate,
  'zaman-cizelgesi': TimelineTemplate,
  bold: BoldTemplate,
  kompakt: KompaktTemplate,
  sik: SikTemplate,
  zarif: ZarifTemplate,
  kart: KartTemplate,
  afis: AfisTemplate,
}

export const CvPreview = forwardRef<HTMLDivElement, CvPreviewProps>(function CvPreview(
  { data, id = CV_PREVIEW_ELEMENT_ID, scrollable = true, fixedAspect = true },
  ref,
) {
  const accent = getAccentPalette(data.theme.accentColor)
  const Template = TEMPLATE_COMPONENTS[data.theme.template]
  const paperBgClass = getPaperBgClass(data.theme.paperColor)

  return (
    <div
      ref={ref}
      id={id}
      className={clsx(
        'w-full rounded-card p-8 text-ink shadow-lg',
        paperBgClass,
        fixedAspect
          ? clsx('aspect-[210/297]', scrollable ? 'overflow-y-auto' : 'overflow-hidden')
          // PDF dışa aktarımında A4 oranını CSS aspect-ratio ile zorlamak
          // yerine içeriğin doğal yüksekliğine bırakıyoruz — html2canvas
          // aspect-ratio'yu güvenilir yorumlamıyor, bu da boş sayfalara yol
          // açabiliyor (bkz. src/lib/exportPdf.ts).
          : 'h-auto overflow-visible',
      )}
    >
      <Template data={data} accent={accent} />
    </div>
  )
})
