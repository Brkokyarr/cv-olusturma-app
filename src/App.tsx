import { Plus, UploadCloud } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { AdSlot } from './components/ads/AdSlot'
import { CvBuilderView } from './components/cv-builder/CvBuilderView'
import { CvPreview } from './components/cv-builder/CvPreview'
import { CvCard } from './components/dashboard/CvCard'
import { DashboardLayout } from './components/dashboard/DashboardLayout'
import { SettingsView } from './components/settings/SettingsView'
import { TemplateGrid } from './components/template-gallery/TemplateGrid'
import { Badge } from './components/ui/Badge'
import { Card } from './components/ui/Card'
import { UploadCvView } from './components/upload/UploadCvView'
import { exportElementToPdf, PDF_EXPORT_WIDTH_PX } from './lib/exportPdf'
import { createId } from './lib/id'
import { loadStoredCvs, saveStoredCvs } from './lib/storage'
import { EMPTY_CV_DATA, type CvData, type StoredCv, type TemplateId } from './types/cv'

type View = 'dashboard' | 'builder' | 'upload' | 'settings'

export function App() {
  const [view, setView] = useState<View>('dashboard')
  const [cvs, setCvs] = useState<StoredCv[]>(() => loadStoredCvs())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [importedCvData, setImportedCvData] = useState<CvData | null>(null)
  const [templatePresetId, setTemplatePresetId] = useState<TemplateId | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const exportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    saveStoredCvs(cvs)
  }, [cvs])

  const downloadingCv = cvs.find((cv) => cv.id === downloadingId) ?? null

  useEffect(() => {
    if (!downloadingCv || !exportRef.current) return
    let cancelled = false
    exportElementToPdf(exportRef.current, downloadingCv.name || 'cv').then(() => {
      if (!cancelled) {
        setDownloadingId(null)
      }
    })
    return () => {
      cancelled = true
    }
  }, [downloadingCv])

  const editingCv = cvs.find((cv) => cv.id === editingId) ?? null

  function handleCreateNew() {
    setEditingId(null)
    setImportedCvData(null)
    setTemplatePresetId(null)
    setView('builder')
  }

  function handleEdit(id: string) {
    setEditingId(id)
    setImportedCvData(null)
    setTemplatePresetId(null)
    setView('builder')
  }

  function handleUploadParsed(data: CvData) {
    setImportedCvData(data)
    setEditingId(null)
    setTemplatePresetId(null)
    setView('builder')
  }

  function handleSelectTemplate(templateId: TemplateId) {
    setTemplatePresetId(templateId)
    setEditingId(null)
    setImportedCvData(null)
    setView('builder')
  }

  function handleBuilderCancel() {
    setEditingId(null)
    setImportedCvData(null)
    setTemplatePresetId(null)
    setView('dashboard')
  }

  function handleComplete(data: CvData) {
    const now = new Date().toISOString()
    setCvs((prev) => {
      if (editingId) {
        return prev.map((cv) => (cv.id === editingId ? { ...cv, data, updatedAt: now } : cv))
      }
      const name = data.personalInfo.fullName.trim() || 'İsimsiz CV'
      return [{ id: createId(), name, data, createdAt: now, updatedAt: now }, ...prev]
    })
    setEditingId(null)
    setImportedCvData(null)
    setTemplatePresetId(null)
    setView('dashboard')
  }

  function handleRename(id: string, name: string) {
    setCvs((prev) => prev.map((cv) => (cv.id === id ? { ...cv, name } : cv)))
  }

  function handleDelete(id: string) {
    const target = cvs.find((cv) => cv.id === id)
    const label = target?.name || 'Bu CV'
    if (!window.confirm(`${label} silinsin mi? Bu işlem geri alınamaz.`)) return
    setCvs((prev) => prev.filter((cv) => cv.id !== id))
  }

  function handleImportCvs(importedCvs: StoredCv[]) {
    setCvs((prev) => [...importedCvs, ...prev])
  }

  function handleClearAllCvs() {
    if (!window.confirm('Tüm CV\'ler kalıcı olarak silinecek. Emin misiniz?')) return
    setCvs([])
  }

  if (view === 'upload') {
    return (
      <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
        <UploadCvView onCancel={() => setView('dashboard')} onParsed={handleUploadParsed} />
      </div>
    )
  }

  if (view === 'settings') {
    return (
      <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
        <SettingsView
          cvs={cvs}
          onCancel={() => setView('dashboard')}
          onImport={handleImportCvs}
          onClearAll={handleClearAllCvs}
        />
      </div>
    )
  }

  if (view === 'builder') {
    const builderInitialData =
      editingCv?.data ??
      importedCvData ??
      (templatePresetId
        ? { ...EMPTY_CV_DATA, theme: { ...EMPTY_CV_DATA.theme, template: templatePresetId } }
        : undefined)

    return (
      <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
        <CvBuilderView
          initialData={builderInitialData}
          heading={
            editingCv
              ? "CV'yi Düzenle"
              : importedCvData
                ? "Yüklenen CV'yi Gözden Geçir"
                : 'Yeni CV Oluştur'
          }
          onCancel={handleBuilderCancel}
          onComplete={handleComplete}
        />
      </div>
    )
  }

  return (
    <DashboardLayout
      onCreateNew={handleCreateNew}
      onUploadCv={() => setView('upload')}
      onNavigateSettings={() => setView('settings')}
    >
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-text-primary">Merhaba</h1>
        <p className="text-sm text-text-secondary">
          CV'lerini yönet, yeni bir tane oluştur ya da eskisini yükleyip düzenle.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="flex flex-col items-start gap-3 border-primary/30 bg-gradient-to-br from-surface to-surface-raised">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Plus className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Yeni CV Oluştur</h2>
            <p className="mt-1 text-xs text-text-secondary">
              Sıfırdan başla, adım adım kendi CV'ni oluştur.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreateNew}
            className="mt-auto w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-primary-hover"
          >
            Yeni CV Oluştur
          </button>
        </Card>

        <Card className="flex flex-col items-start gap-3 border-accent/30 bg-gradient-to-br from-surface to-surface-raised">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <UploadCloud className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-text-primary">Eski CV'ni Yükle</h2>
              <Badge tone="accent">Otomatik doldur</Badge>
            </div>
            <p className="mt-1 text-xs text-text-secondary">
              PDF veya Word yükle; bilgilerin otomatik olarak şablona yerleşsin.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setView('upload')}
            className="mt-auto w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-accent-hover"
          >
            Dosya Seç
          </button>
        </Card>
      </div>

      <div className="mb-8">
        <AdSlot placement="dashboard-top" />
      </div>

      {cvs.length > 0 && (
        <div id="cvlerim" className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">CV'lerim</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cvs.map((cv) => (
              <CvCard
                key={cv.id}
                cv={cv}
                isDownloading={downloadingId === cv.id}
                onEdit={() => handleEdit(cv.id)}
                onDownload={() => setDownloadingId(cv.id)}
                onDelete={() => handleDelete(cv.id)}
                onRename={(name) => handleRename(cv.id, name)}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold text-text-primary">Şablonlar</h2>
        <TemplateGrid
          onSelectTemplate={handleSelectTemplate}
          adSlot={<AdSlot placement="dashboard-mid" />}
        />
      </div>

      <div className="mt-8">
        <AdSlot placement="dashboard-bottom" />
      </div>

      {downloadingCv && (
        <div
          className="fixed left-[-9999px] top-0"
          style={{ width: PDF_EXPORT_WIDTH_PX }}
          aria-hidden="true"
        >
          <CvPreview ref={exportRef} data={downloadingCv.data} fixedAspect={false} fillA4 />
        </div>
      )}
    </DashboardLayout>
  )
}
