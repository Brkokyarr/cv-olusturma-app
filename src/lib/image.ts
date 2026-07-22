const MAX_DIMENSION = 480
const JPEG_QUALITY = 0.85

export function resizeToDataUrl(
  source: CanvasImageSource,
  naturalWidth: number,
  naturalHeight: number,
): string {
  const scale = Math.min(1, MAX_DIMENSION / Math.max(naturalWidth, naturalHeight))
  const width = Math.round(naturalWidth * scale)
  const height = Math.round(naturalHeight * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Görsel işlenemedi.')
  }
  context.drawImage(source, 0, 0, width, height)

  return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
}

export async function readImageAsResizedDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  return resizeToDataUrl(bitmap, bitmap.width, bitmap.height)
}
