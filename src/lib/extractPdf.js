import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

export async function extractPdf(file) {
  const data = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data }).promise
  const pages = []

  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
    pages.push(text)
  }

  return {
    title: file.name,
    pages,
    fullText: pages.join('\n\n'),
  }
}

export async function ingestFile(file) {
  const name = file.name.toLowerCase()
  if (name.endsWith('.pdf')) {
    return extractPdf(file)
  }
  const text = await file.text()
  return {
    title: file.name,
    pages: [text],
    fullText: text,
  }
}
