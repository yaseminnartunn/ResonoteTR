const MIN_CHUNK = 180
const MAX_CHUNK = 720

function normalizeText(raw) {
  return raw.replace(/\r\n/g, '\n').replace(/\u00a0/g, ' ').trim()
}

function splitParagraphs(text) {
  return text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

function mergeSmall(paragraphs) {
  const out = []
  for (const p of paragraphs) {
    const last = out[out.length - 1]
    if (last && last.length < MIN_CHUNK && last.length + p.length < MAX_CHUNK) {
      out[out.length - 1] = `${last} ${p}`
    } else if (p.length > MAX_CHUNK) {
      const sentences = p.match(/[^.!?…]+[.!?…]?/g) || [p]
      let buf = ''
      for (const s of sentences) {
        if ((buf + s).length > MAX_CHUNK && buf) {
          out.push(buf.trim())
          buf = s
        } else {
          buf += s
        }
      }
      if (buf.trim()) out.push(buf.trim())
    } else {
      out.push(p)
    }
  }
  return out
}

export function chunkDocument(rawText, pages = null) {
  const text = normalizeText(rawText)
  if (!text) return []

  if (Array.isArray(pages) && pages.length) {
    const chunks = []
    let n = 1
    pages.forEach((pageText, idx) => {
      const parts = mergeSmall(splitParagraphs(pageText || ''))
      parts.forEach((part) => {
        chunks.push({
          chunkId: `chk_${n}`,
          page: idx + 1,
          text: part,
        })
        n += 1
      })
    })
    return chunks
  }

  return mergeSmall(splitParagraphs(text)).map((part, i) => ({
    chunkId: `chk_${i + 1}`,
    page: 1,
    text: part,
  }))
}

export function chunksToPromptBlock(chunks) {
  return chunks
    .map(
      (c) =>
        `[${c.chunkId} | sayfa ${c.page}]\n${c.text}`,
    )
    .join('\n\n')
}
