import { buildSystemPrompt, buildUserPrompt } from './promptTemplates'
import { chunksToPromptBlock } from './chunkDocument'
import { synthesizeLocalScript } from './localScript'
import { getMockStudio } from './mockStudio'

const DEFAULT_MODEL = 'gemini-2.0-flash'

function extractJson(text) {
  if (!text) throw new Error('Boş model yanıtı')
  const trimmed = text.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = fenced ? fenced[1] : trimmed
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('JSON bulunamadı')
  return JSON.parse(raw.slice(start, end + 1))
}

function normalizeTurns(payload, chunks) {
  const list = Array.isArray(payload) ? payload : payload.turns
  if (!Array.isArray(list) || !list.length) {
    throw new Error('Diyalog turları boş')
  }
  const chunkMap = new Map(chunks.map((c) => [c.chunkId, c]))

  return list.map((turn, i) => {
    const speaker = turn.speaker === 'hostB' ? 'hostB' : 'hostA'
    let sourceChunkId = turn.grounding?.sourceChunkId || chunks[0]?.chunkId
    let chunk = chunkMap.get(sourceChunkId)
    if (!chunk) {
      chunk = chunks[Math.min(i, chunks.length - 1)]
      sourceChunkId = chunk.chunkId
    }
    const excerpt = (turn.grounding?.excerpt || chunk.text).slice(0, 220)
    return {
      id: String(turn.id || `t_${i + 1}`),
      speaker,
      speakerName: speaker === 'hostB' ? 'Barış' : 'Deniz',
      text: String(turn.text || '').trim(),
      emotion: turn.emotion || 'insightful',
      interjectionType: turn.interjectionType,
      pauseAfterMs: Number(turn.pauseAfterMs) || 240,
      grounding: {
        sourceChunkId,
        pageNumber: Number(turn.grounding?.pageNumber) || chunk.page,
        excerpt,
      },
    }
  }).filter((t) => t.text)
}

export async function generatePodcastScript({ apiKey, tone, title, chunks, model = DEFAULT_MODEL, preferHandcraftedMock = false }) {
  if (!chunks?.length) {
    throw new Error('Önce bir belge yükleyin veya örnek kaynağı kullanın.')
  }

  if (!apiKey) {
    if (preferHandcraftedMock) {
      const mock = getMockStudio(tone)
      return {
        title: title || mock.title,
        turns: mock.turns,
        usedFallback: true,
        fallbackReason: 'api-key-missing',
      }
    }
    return {
      title: title || 'Yerel Deep Dive',
      turns: synthesizeLocalScript(chunks, tone),
      usedFallback: true,
      fallbackReason: 'api-key-missing',
    }
  }

  const systemPrompt = buildSystemPrompt(tone)
  const userPrompt = buildUserPrompt({
    title,
    chunksBlock: chunksToPromptBlock(chunks),
    tone,
  })

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.85,
          responseMimeType: 'application/json',
        },
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Gemini ${res.status}: ${errText.slice(0, 240)}`)
    }

    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
    const parsed = extractJson(text)
    const turns = normalizeTurns(parsed, chunks)
    return {
      title: parsed.title || title || 'Deep Dive',
      turns,
      usedFallback: false,
    }
  } catch (error) {
    return {
      title: title || 'Yerel Deep Dive',
      turns: synthesizeLocalScript(chunks, tone),
      usedFallback: true,
      fallbackReason: error.message,
    }
  }
}
