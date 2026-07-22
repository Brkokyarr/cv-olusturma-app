import * as pdfjsLib from 'pdfjs-dist'
import { reconstructReadingOrder } from './ocrLayout'

export async function ocrPdfFile(
  file: File,
  onStatus?: (status: string) => void,
): Promise<string> {
  const { createWorker } = await import('tesseract.js')

  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({
    data: buffer,
    standardFontDataUrl: '/pdfjs/standard_fonts/',
  }).promise

  onStatus?.('Görsel tanıma (OCR) motoru hazırlanıyor...')
  console.log('[ocr] worker oluşturuluyor...')
  const worker = await createWorker('tur')
  console.log('[ocr] worker hazır, sayfa sayısı:', pdf.numPages)

  try {
    let text = ''
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      onStatus?.(`Sayfa ${pageNumber}/${pdf.numPages} taranıyor...`)

      const page = await pdf.getPage(pageNumber)
      const viewport = page.getViewport({ scale: 2 })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      const context = canvas.getContext('2d')
      console.log(`[ocr] sayfa ${pageNumber} canvas boyutu:`, canvas.width, 'x', canvas.height, 'context:', !!context)
      if (!context) continue

      await page.render({ canvasContext: context, viewport }).promise
      console.log(`[ocr] sayfa ${pageNumber} render tamam, recognize başlıyor...`)
      const t0 = performance.now()
      const { data } = await worker.recognize(canvas, {}, { blocks: true })

      // Tesseract çoğu zaman tüm sayfayı TEK blok olarak döner (çok sütunlu
      // şablonlarda bile), yani blok bazlı sıralama yetmiyor — kelime (word)
      // seviyesine inip gerçek bir sütun boşluğu (gutter) arıyoruz.
      const words = (data.blocks ?? []).flatMap((block) =>
        block.paragraphs.flatMap((paragraph) => paragraph.lines.flatMap((line) => line.words)),
      )
      const pageText = reconstructReadingOrder(words, canvas.width)

      console.log(
        `[ocr] sayfa ${pageNumber} recognize bitti (${Math.round(performance.now() - t0)}ms), kelime sayısı:`,
        words.length,
        JSON.stringify(pageText.slice(0, 400)),
      )
      text += `${pageText}\n`
    }
    return text
  } catch (error) {
    console.error('[ocr] HATA:', error)
    throw error
  } finally {
    await worker.terminate()
  }
}
