interface OcrWord {
  text: string
  bbox: { x0: number; x1: number; y0: number; y1: number }
}

const BUCKET_COUNT = 60
const LINE_GROUP_THRESHOLD_PX = 14

/**
 * Sayfada, kelimelerin hiçbirinin kesişmediği belirgin bir dikey boşluk
 * (sütun arası "gutter") var mı diye bakar. Varsa o boşluğun orta noktasını
 * döner — bu, iki sütunlu şablonları tek sütunlu olanlardan ayırt etmek için
 * kullanılır (tek sütunda satırlar genelde sayfanın ortasına taşar, bu yüzden
 * körlemesine %50 bölmek yanlış olur).
 */
function detectColumnSplitX(words: OcrWord[], pageWidth: number): number | null {
  const bucketWidth = pageWidth / BUCKET_COUNT
  const covered = new Array(BUCKET_COUNT).fill(false)

  for (const word of words) {
    const startBucket = Math.max(0, Math.floor(word.bbox.x0 / bucketWidth))
    const endBucket = Math.min(BUCKET_COUNT - 1, Math.floor(word.bbox.x1 / bucketWidth))
    for (let i = startBucket; i <= endBucket; i += 1) covered[i] = true
  }

  const searchStart = Math.floor(BUCKET_COUNT * 0.25)
  const searchEnd = Math.floor(BUCKET_COUNT * 0.75)
  let bestStart = -1
  let bestLength = 0
  let runStart = -1

  for (let i = searchStart; i <= searchEnd; i += 1) {
    if (!covered[i]) {
      if (runStart === -1) runStart = i
      const length = i - runStart + 1
      if (length > bestLength) {
        bestLength = length
        bestStart = runStart
      }
    } else {
      runStart = -1
    }
  }

  const minGutterBuckets = Math.ceil(BUCKET_COUNT * 0.03)
  if (bestStart >= 0 && bestLength >= minGutterBuckets) {
    return (bestStart + bestLength / 2) * bucketWidth
  }
  return null
}

function wordsToText(words: OcrWord[]): string {
  const sorted = [...words].sort((a, b) => a.bbox.y0 - b.bbox.y0 || a.bbox.x0 - b.bbox.x0)

  const lines: OcrWord[][] = []
  let currentLine: OcrWord[] = []
  let currentY: number | null = null

  for (const word of sorted) {
    if (currentY === null || Math.abs(word.bbox.y0 - currentY) < LINE_GROUP_THRESHOLD_PX) {
      currentLine.push(word)
      currentY = currentY === null ? word.bbox.y0 : (currentY + word.bbox.y0) / 2
    } else {
      lines.push(currentLine)
      currentLine = [word]
      currentY = word.bbox.y0
    }
  }
  if (currentLine.length) lines.push(currentLine)

  return lines
    .map((line) =>
      [...line]
        .sort((a, b) => a.bbox.x0 - b.bbox.x0)
        .map((word) => word.text)
        .join(' '),
    )
    .join('\n')
}

export function reconstructReadingOrder(words: OcrWord[], pageWidth: number): string {
  if (words.length === 0) return ''

  const splitX = detectColumnSplitX(words, pageWidth)
  if (splitX === null) {
    return wordsToText(words)
  }

  const leftColumn = words.filter((word) => word.bbox.x0 < splitX)
  const rightColumn = words.filter((word) => word.bbox.x0 >= splitX)
  return [wordsToText(leftColumn), wordsToText(rightColumn)].filter(Boolean).join('\n\n')
}
