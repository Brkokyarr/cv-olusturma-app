export interface TextRun {
  str: string
  x: number
  y: number
  width: number
}

interface ThresholdFallbacks {
  insufficientData: number
  noClearCluster: number
}

/**
 * Bir sayfadaki boşluk değerlerini (kelime aralığı ya da satır aralığı) iki
 * kümeye ayıran doğal eşiği bulur: küçük değerler (harf-içi/satır-içi) ve
 * büyük değerler (kelime/paragraf sınırı). Sabit bir oran yerine sayfaya özgü
 * bir eşik kullanmak, farklı font/DPI'lı PDF'lerde de doğru sonuç verir.
 */
function estimateAdaptiveThreshold(values: number[], fallbacks: ThresholdFallbacks): number {
  const positive = values.filter((v) => v > 0)
  if (positive.length < 4) return fallbacks.insufficientData

  const sorted = [...positive].sort((a, b) => a - b)
  let bestJumpIndex = -1
  let bestJumpRatio = 1.4

  for (let i = 1; i < sorted.length; i += 1) {
    const ratio = sorted[i] / Math.max(sorted[i - 1], 0.01)
    if (ratio > bestJumpRatio) {
      bestJumpRatio = ratio
      bestJumpIndex = i
    }
  }

  if (bestJumpIndex === -1) return fallbacks.noClearCluster
  return (sorted[bestJumpIndex - 1] + sorted[bestJumpIndex]) / 2
}

/**
 * Bir sayfanın konumlandırılmış metin parçalarını (pdfjs'in content.items'ı)
 * gerçek satır/paragraf yapısını koruyan tek bir metne dönüştürür.
 *
 * content.items'ı körlemesine boşlukla birleştirmek hem satır sonlarını yok
 * eder hem de harf-harf konumlanan PDF'lerde ("S a t ı ş" gibi) kelimeleri
 * bozar. Bunun yerine ardışık parçalar arasındaki gerçek X/Y mesafelerinden
 * sayfaya özgü uyarlanabilir eşikler çıkarıp gerçek kelime boşluklarını ve
 * paragraf/madde aralarını yeniden kuruyoruz.
 */
export function reconstructPageText(runs: TextRun[]): string {
  const wordGaps: number[] = []
  const lineGaps: number[] = []
  for (let i = 1; i < runs.length; i += 1) {
    const prev = runs[i - 1]
    const curr = runs[i]
    if (Math.abs(curr.y - prev.y) <= 2) {
      wordGaps.push(curr.x - (prev.x + prev.width))
    } else {
      lineGaps.push(Math.abs(curr.y - prev.y))
    }
  }

  const wordSpaceThreshold = estimateAdaptiveThreshold(wordGaps, {
    insufficientData: 0.5,
    noClearCluster: 0.5,
  })
  // Paragraf ayrımı için: net bir "büyük boşluk" kümesi görülmüyorsa hiç
  // ayırma yapmayalım (Infinity) — yanlışlıkla gereksiz blok bölmekten iyidir.
  const paragraphGapThreshold = estimateAdaptiveThreshold(lineGaps, {
    insufficientData: Number.POSITIVE_INFINITY,
    noClearCluster: Number.POSITIVE_INFINITY,
  })

  let pageText = ''
  let lastY: number | null = null
  let lastRight: number | null = null

  for (const run of runs) {
    const yGap = lastY !== null ? Math.abs(run.y - lastY) : 0

    if (lastY !== null && yGap > paragraphGapThreshold) {
      pageText += '\n\n'
    } else if (lastY !== null && yGap > 2) {
      pageText += '\n'
    } else if (lastRight !== null && run.x - lastRight > wordSpaceThreshold) {
      pageText += ' '
    }

    pageText += run.str
    lastY = run.y
    lastRight = run.x + run.width
  }

  return pageText
}
