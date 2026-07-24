import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { CvPreview } from '../cv-builder/CvPreview'
import { Button } from '../ui/Button'
import { TEMPLATE_OPTIONS } from '../../lib/theme'
import { SAMPLE_CV_DATA } from '../../lib/sampleCvData'
import type { TemplateId } from '../../types/cv'

interface TemplateGridProps {
  onSelectTemplate: (templateId: TemplateId) => void
  adSlot?: ReactNode
}

export function TemplateGrid({ onSelectTemplate, adSlot }: TemplateGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {TEMPLATE_OPTIONS.map((option, index) => (
        <Fragment key={option.id}>
          <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4">
            <CvPreview
              id={`cv-preview-dashboard-${option.id}`}
              data={{
                ...SAMPLE_CV_DATA,
                theme: { template: option.id, accentColor: 'antrasit', paperColor: 'beyaz' },
              }}
            />
            <div>
              <h3 className="text-sm font-semibold text-text-primary">{option.label}</h3>
              <p className="mt-0.5 text-xs text-text-secondary">{option.description}</p>
            </div>
            <Button variant="primary" onClick={() => onSelectTemplate(option.id)}>
              Bu Şablonla Oluştur
            </Button>
          </div>
          {index === 2 && adSlot && <div className="col-span-full">{adSlot}</div>}
        </Fragment>
      ))}
    </div>
  )
}
