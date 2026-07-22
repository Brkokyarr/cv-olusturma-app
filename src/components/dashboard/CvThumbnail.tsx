import { useEffect, useRef, useState } from 'react'
import type { CvData } from '../../types/cv'
import { CvPreview } from '../cv-builder/CvPreview'

const THUMBNAIL_DESIGN_WIDTH = 700

interface CvThumbnailProps {
  cvId: string
  data: CvData
}

export function CvThumbnail({ cvId, data }: CvThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width) setScale(width / THUMBNAIL_DESIGN_WIDTH)
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // Kartın gerçek CV'nin (dolayısıyla PDF çıktısının) boyunu yansıtması için
  // içeriğin A4 oranına zorlanmamış doğal yüksekliğini de ölçüyoruz —
  // aksi halde kısa bir CV, kartın altında büyük ve yanıltıcı bir boşluk
  // bırakırdı.
  useEffect(() => {
    const content = contentRef.current
    if (!content) return
    const observer = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect.height
      if (height) setContentHeight(height)
    })
    observer.observe(content)
    return () => observer.disconnect()
  }, [data])

  const previewHeight = contentHeight * scale

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-lg border border-border-subtle bg-background"
      style={{ height: previewHeight > 0 ? previewHeight : undefined }}
    >
      {scale > 0 && (
        <div
          className="pointer-events-none absolute left-0 top-0 origin-top-left"
          // Kart genişliği grid/breakpoint'e göre değişiyor; ölçek bu yüzden
          // çalışma zamanında hesaplanıyor — Tailwind'in statik sınıflarıyla
          // ifade edilemeyen tek dinamik değer burası.
          style={{ width: THUMBNAIL_DESIGN_WIDTH, transform: `scale(${scale})` }}
        >
          <div ref={contentRef}>
            <CvPreview data={data} id={`cv-thumb-${cvId}`} scrollable={false} fixedAspect={false} />
          </div>
        </div>
      )}
    </div>
  )
}
