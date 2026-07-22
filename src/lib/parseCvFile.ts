import type { CvData } from '../types/cv'
import { parseCvTextHeuristically } from './cvTextParser'
import { extractTextFromDocx, extractTextFromPdf } from './fileParsing'
import { ocrPdfFile } from './ocr'
import { extractLikelyPhotoFromPdf } from './pdfImageExtraction'

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
const MIN_USABLE_TEXT_LENGTH = 30
const DOCX_MEDIA_TYPE =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export async function parseCvFile(
  file: File,
  onStatus?: (status: string) => void,
): Promise<CvData> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('Dosya çok büyük. Lütfen 10 MB altında bir dosya yükleyin.')
  }

  let text: string
  let photoDataUrl = ''

  if (file.type === 'application/pdf') {
    onStatus?.('PDF okunuyor...')
    text = await extractTextFromPdf(file)
    console.log('[parseCvFile] normal extraction length:', text.trim().length, JSON.stringify(text))

    if (text.trim().length < MIN_USABLE_TEXT_LENGTH) {
      console.log('[parseCvFile] metin yetersiz, OCR deneniyor...')
      text = await ocrPdfFile(file, onStatus)
      console.log('[parseCvFile] OCR sonucu length:', text.trim().length, JSON.stringify(text.slice(0, 500)))
      if (!text.trim()) {
        throw new Error(
          'PDF içinden metin okunamadı — görsel tanıma (OCR) da başarısız oldu. Farklı bir dosya deneyin.',
        )
      }
    }

    onStatus?.('Fotoğraf aranıyor...')
    photoDataUrl = (await extractLikelyPhotoFromPdf(file)) ?? ''
    console.log('[parseCvFile] fotoğraf bulundu mu:', Boolean(photoDataUrl))
  } else if (file.type === DOCX_MEDIA_TYPE) {
    onStatus?.('Word belgesi okunuyor...')
    text = await extractTextFromDocx(file)
    if (!text.trim()) {
      throw new Error('Word belgesinden metin okunamadı.')
    }
  } else {
    throw new Error('Desteklenmeyen dosya türü. PDF veya Word (.docx) yükleyin.')
  }

  onStatus?.('Bilgiler forma dolduruluyor...')
  const result = parseCvTextHeuristically(text)
  if (photoDataUrl) {
    result.personalInfo.photoDataUrl = photoDataUrl
  }
  console.log('[parseCvFile] ayrıştırılan sonuç:', JSON.stringify({ ...result, personalInfo: { ...result.personalInfo, photoDataUrl: result.personalInfo.photoDataUrl ? '(veri var)' : '' } }, null, 2))
  return result
}
