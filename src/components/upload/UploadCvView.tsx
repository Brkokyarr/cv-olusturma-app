import { clsx } from 'clsx'
import { AlertCircle, FileText, Loader2, UploadCloud } from 'lucide-react'
import { useRef, useState } from 'react'
import { parseCvFile } from '../../lib/parseCvFile'
import type { CvData } from '../../types/cv'
import { AdSlot } from '../ads/AdSlot'
import { Button } from '../ui/Button'

interface UploadCvViewProps {
  onCancel: () => void
  onParsed: (data: CvData) => void
}

const ACCEPTED_TYPES = '.pdf,.docx'

export function UploadCvView({ onCancel, onParsed }: UploadCvViewProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [status, setStatus] = useState('Okunuyor...')
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError(null)
    setFileName(file.name)
    setStatus('Okunuyor...')
    setIsParsing(true)
    try {
      const data = await parseCvFile(file, setStatus)
      onParsed(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'CV analiz edilemedi.')
    } finally {
      setIsParsing(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Eski CV'ni Yükle</h1>
          <p className="text-sm text-text-secondary">
            PDF veya Word (.docx) yükleyin; bilgiler otomatik olarak forma doldurulsun.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          Panele dön
        </button>
      </div>

      <AdSlot placement="upload-top" />

      <div
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          const file = event.dataTransfer.files[0]
          if (file) handleFile(file)
        }}
        className={clsx(
          'flex flex-col items-center justify-center gap-3 rounded-card border-2 border-dashed p-12 text-center transition-colors',
          isDragging ? 'border-primary bg-primary-muted' : 'border-border bg-surface',
        )}
      >
        {isParsing ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-text-primary">{fileName}</p>
            <p className="text-xs text-text-secondary">{status}</p>
          </>
        ) : (
          <>
            <UploadCloud className="h-8 w-8 text-text-muted" />
            <p className="text-sm font-medium text-text-primary">
              Dosyayı buraya sürükleyin ya da seçin
            </p>
            <p className="text-xs text-text-muted">PDF, DOCX · en fazla 10 MB</p>
            <Button variant="secondary" onClick={() => inputRef.current?.click()}>
              <FileText className="h-4 w-4" />
              Dosya Seç
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_TYPES}
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) handleFile(file)
                event.target.value = ''
              }}
            />
          </>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-card border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <p className="text-xs text-text-muted">
        Dosyanız tamamen tarayıcınızda okunur, içeriği hiçbir yere gönderilmez. Metin katmanı
        olmayan (görsel/taranmış) PDF'lerde tarayıcı içi görsel tanıma (OCR) devreye girer — ilk
        kullanımda küçük bir dil dosyası indirilir. Bilgiler basit kalıp eşleştirmeyle
        dolduruluyor, %100 isabetli olmayabilir; lütfen bir sonraki adımda tüm alanları gözden
        geçirin.
      </p>

      <AdSlot placement="upload-bottom" />
    </div>
  )
}
