import mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { reconstructPageText, type TextRun } from './pdfTextLayout'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

export async function extractTextFromPdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({
    data: buffer,
    standardFontDataUrl: '/pdfjs/standard_fonts/',
  }).promise

  const pageTexts: string[] = []
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()

    const runs: TextRun[] = []
    for (const item of content.items) {
      if (!('str' in item) || !item.str) continue
      runs.push({ str: item.str, x: item.transform[4], y: item.transform[5], width: item.width })
    }

    pageTexts.push(reconstructPageText(runs))
  }

  return pageTexts.join('\n\n')
}

export async function extractTextFromDocx(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer: buffer })
  return result.value
}
