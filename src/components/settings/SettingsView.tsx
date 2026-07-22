import { AlertCircle, Download, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { exportCvsAsJson, parseImportedCvsFile } from '../../lib/backup'
import type { StoredCv } from '../../types/cv'
import { AdSlot } from '../ads/AdSlot'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface SettingsViewProps {
  cvs: StoredCv[]
  onCancel: () => void
  onImport: (importedCvs: StoredCv[]) => void
  onClearAll: () => void
}

export function SettingsView({ cvs, onCancel, onImport, onClearAll }: SettingsViewProps) {
  const [importError, setImportError] = useState<string | null>(null)
  const [importMessage, setImportMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleImportFile(file: File) {
    setImportError(null)
    setImportMessage(null)
    try {
      const importedCvs = await parseImportedCvsFile(file)
      onImport(importedCvs)
      setImportMessage(`${importedCvs.length} CV başarıyla içe aktarıldı.`)
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Dosya içe aktarılamadı.')
    }
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Ayarlar</h1>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          Panele dön
        </button>
      </div>

      <Card className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Verilerini Yedekle</h2>
          <p className="mt-1 text-xs text-text-secondary">
            CV'lerin bu tarayıcıda saklanıyor. Başka bir cihaza veya tarayıcıya geçerken
            kaybolmaması için JSON olarak indirip saklayabilirsin.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => exportCvsAsJson(cvs)}
          disabled={cvs.length === 0}
          className="self-start"
        >
          <Download className="h-4 w-4" />
          JSON Olarak İndir ({cvs.length} CV)
        </Button>
      </Card>

      <Card className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Yedekten Geri Yükle</h2>
          <p className="mt-1 text-xs text-text-secondary">
            Daha önce indirdiğin bir JSON yedek dosyasını seç; içindeki CV'ler mevcut listene
            eklenir (üzerine yazılmaz).
          </p>
        </div>
        <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="self-start">
          <Upload className="h-4 w-4" />
          Dosya Seç
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) handleImportFile(file)
            event.target.value = ''
          }}
        />
        {importError && (
          <div className="flex items-start gap-2 rounded-card border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{importError}</span>
          </div>
        )}
        {importMessage && <p className="text-xs text-success">{importMessage}</p>}
      </Card>

      <Card className="flex flex-col gap-3 border-danger/30">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Tehlikeli Alan</h2>
          <p className="mt-1 text-xs text-text-secondary">
            Bu tarayıcıda kayıtlı tüm CV'leri kalıcı olarak siler. Önce yedek almanı öneririz.
          </p>
        </div>
        <Button
          variant="danger-ghost"
          onClick={onClearAll}
          disabled={cvs.length === 0}
          className="self-start border border-danger/30"
        >
          <Trash2 className="h-4 w-4" />
          Tüm Verileri Sil
        </Button>
      </Card>

      <AdSlot placement="settings" />
    </div>
  )
}
