import { Copy, Download, Loader2, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { formatRelativeDate } from '../../lib/date'
import { getTemplateLabel } from '../../lib/theme'
import type { StoredCv } from '../../types/cv'
import { Card } from '../ui/Card'
import { CvThumbnail } from './CvThumbnail'

interface CvCardProps {
  cv: StoredCv
  isDownloading?: boolean
  onEdit: () => void
  onDownload: () => void
  onDelete: () => void
  onRename: (name: string) => void
  onDuplicate: () => void
}

export function CvCard({ cv, isDownloading, onEdit, onDownload, onDelete, onRename, onDuplicate }: CvCardProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [draftName, setDraftName] = useState(cv.name)

  function startRenaming() {
    setDraftName(cv.name)
    setIsRenaming(true)
  }

  function commitRename() {
    setIsRenaming(false)
    const trimmed = draftName.trim()
    if (trimmed && trimmed !== cv.name) {
      onRename(trimmed)
    }
  }

  return (
    <Card className="group flex flex-col gap-4 transition-colors hover:border-primary/50">
      <button
        type="button"
        onClick={onEdit}
        aria-label={`${cv.name} CV'sini düzenle`}
        className="block"
      >
        <CvThumbnail cvId={cv.id} data={cv.data} />
      </button>

      <div>
        {isRenaming ? (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              commitRename()
            }}
          >
            <input
              autoFocus
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              onBlur={commitRename}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setDraftName(cv.name)
                  setIsRenaming(false)
                }
              }}
              aria-label="CV adını düzenle"
              className="w-full rounded border border-primary bg-surface px-1.5 py-0.5 text-sm font-semibold text-text-primary focus:outline-none"
            />
          </form>
        ) : (
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold text-text-primary">{cv.name}</h3>
            <button
              type="button"
              onClick={startRenaming}
              aria-label={`${cv.name} CV adını düzenle`}
              className="shrink-0 rounded p-0.5 text-text-muted opacity-60 transition-opacity hover:text-text-primary group-hover:opacity-100"
            >
              <Pencil className="h-3 w-3" />
            </button>
          </div>
        )}
        <p className="mt-1 text-xs text-text-secondary">
          {getTemplateLabel(cv.data.theme.template)} • {formatRelativeDate(cv.updatedAt)}
        </p>
      </div>

      <div className="flex items-center gap-2 border-t border-border-subtle pt-3">
        <button
          type="button"
          onClick={onEdit}
          aria-label={`${cv.name} CV'sini düzenle`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-surface-hover px-3 py-2 text-xs font-medium text-text-primary hover:bg-primary-muted hover:text-primary"
        >
          <Pencil className="h-3.5 w-3.5" />
          Düzenle
        </button>
        <button
          type="button"
          onClick={onDownload}
          disabled={isDownloading}
          aria-label={`${cv.name} CV'sini PDF olarak indir`}
          className="flex items-center justify-center rounded-lg bg-surface-hover p-2 text-text-secondary hover:bg-primary-muted hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDownloading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          aria-label={`${cv.name} CV'sini çoğalt`}
          className="flex items-center justify-center rounded-lg bg-surface-hover p-2 text-text-secondary hover:bg-primary-muted hover:text-primary"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`${cv.name} CV'sini sil`}
          className="flex items-center justify-center rounded-lg bg-surface-hover p-2 text-text-secondary hover:bg-danger/15 hover:text-danger"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </Card>
  )
}
