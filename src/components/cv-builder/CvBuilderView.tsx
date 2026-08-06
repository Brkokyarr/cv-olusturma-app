import { ArrowLeft, ArrowRight, Check, Download, Loader2 } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { exportElementToPdf, isIosDevice, PDF_EXPORT_WIDTH_PX } from '../../lib/exportPdf'
import { SAMPLE_CV_DATA } from '../../lib/sampleCvData'
import { EMPTY_CV_DATA, type CvData } from '../../types/cv'
import { AdSlot } from '../ads/AdSlot'
import { Button } from '../ui/Button'
import { CvPreview } from './CvPreview'
import { StepIndicator } from './StepIndicator'
import { CertificatesStep } from './steps/CertificatesStep'
import { EducationStep } from './steps/EducationStep'
import { ExperienceStep } from './steps/ExperienceStep'
import { LanguagesStep } from './steps/LanguagesStep'
import { PersonalInfoStep } from './steps/PersonalInfoStep'
import { ReferencesStep } from './steps/ReferencesStep'
import { SectionOrderStep } from './steps/SectionOrderStep'
import { SkillsStep } from './steps/SkillsStep'
import { SummaryStep } from './steps/SummaryStep'
import { TemplateStep } from './steps/TemplateStep'

function isCvDataEmpty(data: CvData): boolean {
  return (
    !data.personalInfo.fullName.trim() &&
    !data.summary.trim() &&
    data.experience.length === 0 &&
    data.education.length === 0 &&
    data.skills.length === 0 &&
    data.languages.length === 0 &&
    data.certificates.length === 0 &&
    data.references.length === 0
  )
}

const STEP_LABELS = [
  'Şablon',
  'Kişisel Bilgiler',
  'Özet',
  'Deneyim',
  'Eğitim',
  'Yetenekler',
  'Diller',
  'Sertifikalar',
  'Referanslar',
  'Sıralama',
]

interface CvBuilderViewProps {
  initialData?: CvData
  heading?: string
  onCancel: () => void
  onComplete: (data: CvData) => void
}

export function CvBuilderView({
  initialData,
  heading = 'Yeni CV Oluştur',
  onCancel,
  onComplete,
}: CvBuilderViewProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [cvData, setCvData] = useState<CvData>(initialData ?? EMPTY_CV_DATA)
  const [isExporting, setIsExporting] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const exportRef = useRef<HTMLDivElement>(null)
  const initialDataRef = useRef(cvData)

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(cvData) !== JSON.stringify(initialDataRef.current),
    [cvData],
  )

  function handleCancel() {
    if (hasUnsavedChanges && !window.confirm('Kaydedilmemiş değişiklikleriniz kaybolacak. Çıkmak istediğinize emin misiniz?')) {
      return
    }
    onCancel()
  }

  const isLastStep = currentStep === STEP_LABELS.length - 1
  const isEditing = Boolean(initialData)
  const canExport = cvData.personalInfo.fullName.trim().length > 0
  const showingSamplePreview = isCvDataEmpty(cvData)
  const previewData = showingSamplePreview ? { ...SAMPLE_CV_DATA, theme: cvData.theme } : cvData

  async function handleExportPdf() {
    if (!exportRef.current || isExporting) return
    // iOS'ta PDF'i yeni sekmede açacağız — pop-up engelleyicinin devreye
    // girmemesi için pencereyi tıklama anında, senkron olarak açmamız
    // gerekiyor (bkz. src/lib/exportPdf.ts).
    const preOpenedWindow = isIosDevice() ? window.open('', '_blank') : null
    setIsExporting(true)
    try {
      await exportElementToPdf(exportRef.current, cvData.personalInfo.fullName || 'cv', preOpenedWindow)
    } finally {
      setIsExporting(false)
    }
  }

  function goNext() {
    if (isLastStep) {
      onComplete(cvData)
      return
    }
    setCurrentStep((step) => Math.min(step + 1, STEP_LABELS.length - 1))
  }

  function goBack() {
    if (currentStep === 0) {
      handleCancel()
      return
    }
    setCurrentStep((step) => Math.max(step - 1, 0))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">{heading}</h1>
          <p className="text-sm text-text-secondary">
            Formu doldurdukça sağdaki önizleme canlı olarak güncellenir.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCancel}
          className="text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          Panele dön
        </button>
      </div>

      <StepIndicator
        steps={STEP_LABELS}
        currentStep={currentStep}
        onStepSelect={setCurrentStep}
      />

      <AdSlot placement="builder-top" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-card border border-border bg-surface p-6">
          <h2 className="mb-5 text-base font-semibold text-text-primary">
            {STEP_LABELS[currentStep]}
          </h2>

          {currentStep === 0 && (
            <TemplateStep
              theme={cvData.theme}
              onChange={(theme) => setCvData((prev) => ({ ...prev, theme }))}
            />
          )}
          {currentStep === 1 && (
            <PersonalInfoStep
              data={cvData.personalInfo}
              onChange={(patch) =>
                setCvData((prev) => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, ...patch },
                }))
              }
            />
          )}
          {currentStep === 2 && (
            <SummaryStep
              summary={cvData.summary}
              onChange={(summary) => setCvData((prev) => ({ ...prev, summary }))}
            />
          )}
          {currentStep === 3 && (
            <ExperienceStep
              items={cvData.experience}
              onChange={(experience) => setCvData((prev) => ({ ...prev, experience }))}
            />
          )}
          {currentStep === 4 && (
            <EducationStep
              items={cvData.education}
              onChange={(education) => setCvData((prev) => ({ ...prev, education }))}
            />
          )}
          {currentStep === 5 && (
            <SkillsStep
              skills={cvData.skills}
              onChange={(skills) => setCvData((prev) => ({ ...prev, skills }))}
            />
          )}
          {currentStep === 6 && (
            <LanguagesStep
              items={cvData.languages}
              onChange={(languages) => setCvData((prev) => ({ ...prev, languages }))}
            />
          )}
          {currentStep === 7 && (
            <CertificatesStep
              items={cvData.certificates}
              onChange={(certificates) => setCvData((prev) => ({ ...prev, certificates }))}
            />
          )}
          {currentStep === 8 && (
            <ReferencesStep
              items={cvData.references}
              onChange={(references) => setCvData((prev) => ({ ...prev, references }))}
            />
          )}
          {currentStep === 9 && (
            <SectionOrderStep
              data={cvData}
              order={cvData.sectionOrder}
              onChange={(sectionOrder) => setCvData((prev) => ({ ...prev, sectionOrder }))}
            />
          )}

          <div className="mt-8 flex items-center justify-between border-t border-border-subtle pt-5">
            <Button variant="ghost" onClick={goBack}>
              <ArrowLeft className="h-4 w-4" />
              {currentStep === 0 ? 'Vazgeç' : 'Geri'}
            </Button>
            <Button variant="primary" onClick={goNext}>
              {isLastStep ? (
                <>
                  <Check className="h-4 w-4" />
                  {isEditing ? 'Değişiklikleri Kaydet' : "CV'yi Tamamla"}
                </>
              ) : (
                <>
                  İleri
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:sticky lg:top-6 lg:self-start">
          {isLastStep && (
            <Button
              variant="secondary"
              onClick={handleExportPdf}
              disabled={!canExport || isExporting}
              title={canExport ? undefined : 'PDF indirmek için önce ad soyad girin'}
              className="w-full"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isExporting ? 'PDF hazırlanıyor...' : 'PDF İndir'}
            </Button>
          )}
          {showingSamplePreview && (
            <p className="text-center text-xs text-text-muted">
              Örnek önizleme — bilgilerinizi girdikçe kendi CV'niz görünecek
            </p>
          )}
          <CvPreview ref={previewRef} data={previewData} />
          <AdSlot placement="builder-sidebar" />
        </div>
      </div>

      <div
        className="fixed left-[-9999px] top-0"
        style={{ width: PDF_EXPORT_WIDTH_PX }}
        aria-hidden="true"
      >
        <CvPreview ref={exportRef} data={cvData} id="cv-preview-export" fixedAspect={false} fillA4 />
      </div>
    </div>
  )
}
