import * as pdfjsLib from 'pdfjs-dist'
import { resizeToDataUrl } from './image'

const MIN_PHOTO_DIMENSION = 60

// pdfjs'in ImageKind sabitleri (paket bunları runtime'da named export olarak
// vermiyor, sabit değerleri kendimiz tanımlıyoruz).
const IMAGE_KIND_RGB_24BPP = 2
const IMAGE_KIND_RGBA_32BPP = 3

interface PdfImageObject {
  width?: number
  height?: number
  kind?: number
  data?: Uint8ClampedArray | Uint8Array
  bitmap?: ImageBitmap
}

interface PageWithObjects {
  objs: { has(name: string): boolean; get(name: string, callback?: (value: unknown) => void): unknown }
  getOperatorList(): Promise<{ fnArray: number[]; argsArray: unknown[][] }>
}

function getPageObject(page: PageWithObjects, name: string): Promise<PdfImageObject | null> {
  return new Promise((resolve) => {
    if (page.objs.has(name)) {
      resolve(page.objs.get(name) as PdfImageObject)
      return
    }
    page.objs.get(name, (value) => resolve(value as PdfImageObject))
  })
}

function rawImageToCanvas(imgObj: PdfImageObject): HTMLCanvasElement | null {
  const { width, height, kind, data } = imgObj
  if (!width || !height || !data) return null

  const rgba = new Uint8ClampedArray(width * height * 4)
  if (kind === IMAGE_KIND_RGBA_32BPP) {
    rgba.set(data)
  } else if (kind === IMAGE_KIND_RGB_24BPP) {
    for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
      rgba[j] = data[i]
      rgba[j + 1] = data[i + 1]
      rgba[j + 2] = data[i + 2]
      rgba[j + 3] = 255
    }
  } else {
    return null
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) return null
  context.putImageData(new ImageData(rgba, width, height), 0, 0)
  return canvas
}

function bitmapToCanvas(bitmap: ImageBitmap): HTMLCanvasElement | null {
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const context = canvas.getContext('2d')
  if (!context) return null
  context.drawImage(bitmap, 0, 0)
  return canvas
}

/**
 * PDF'in ilk sayfasındaki gömülü görselleri tarar ve en büyük alanlı
 * olanını (küçük ikon/logo grafiklerinden ayırt etmek için) "profil
 * fotoğrafı" adayı olarak döner. Bulunamazsa null döner — bu bir hata
 * değildir, birçok CV'de gömülü fotoğraf olmayabilir.
 */
export async function extractLikelyPhotoFromPdf(file: File): Promise<string | null> {
  try {
    const buffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({
      data: buffer,
      standardFontDataUrl: '/pdfjs/standard_fonts/',
    }).promise

    const page = (await pdf.getPage(1)) as unknown as PageWithObjects
    const operatorList = await page.getOperatorList()

    const imageNames = new Set<string>()
    for (let i = 0; i < operatorList.fnArray.length; i += 1) {
      if (operatorList.fnArray[i] === pdfjsLib.OPS.paintImageXObject) {
        const name = operatorList.argsArray[i]?.[0]
        if (typeof name === 'string') imageNames.add(name)
      }
    }

    let best: HTMLCanvasElement | null = null

    for (const name of imageNames) {
      const imgObj = await getPageObject(page, name)
      if (!imgObj) continue

      const canvas = imgObj.bitmap ? bitmapToCanvas(imgObj.bitmap) : rawImageToCanvas(imgObj)
      if (!canvas) continue
      if (canvas.width < MIN_PHOTO_DIMENSION || canvas.height < MIN_PHOTO_DIMENSION) continue

      if (!best || canvas.width * canvas.height > best.width * best.height) {
        best = canvas
      }
    }

    if (!best) return null
    return resizeToDataUrl(best, best.width, best.height)
  } catch {
    // Görsel çıkarma başarısız olursa sessizce vazgeçiyoruz — fotoğrafsız
    // devam etmek, tüm yüklemeyi başarısız saymaktan iyidir.
    return null
  }
}
