import { useCallback, useMemo, useState } from 'react'
import { Quote } from 'lucide-react'
import { ControlBar } from './components/ControlBar'
import { DocumentViewer } from './components/DocumentViewer'
import { HostStage } from './components/HostStage'
import { Transcript } from './components/Transcript'
import { usePodcastPlayer } from './hooks/usePodcastPlayer'
import { chunkDocument } from './lib/chunkDocument'
import { generatePodcastScript } from './lib/gemini'
import { getMockStudio } from './lib/mockStudio'
import { synthesizeLocalScript } from './lib/localScript'
import { TONE_AKADEMIK, TONE_LABELS } from './lib/promptTemplates'

const KEY_STORAGE = 'resonotetr.geminiKey'

function loadKey() {
  try {
    return localStorage.getItem(KEY_STORAGE) || ''
  } catch {
    return ''
  }
}

export default function App() {
  const mock = useMemo(() => getMockStudio(TONE_AKADEMIK), [])
  const [tone, setTone] = useState(TONE_AKADEMIK)
  const [apiKey, setApiKey] = useState(loadKey)
  const [title, setTitle] = useState(mock.title)
  const [chunks, setChunks] = useState(mock.chunks)
  const [turns, setTurns] = useState(mock.turns)
  const [pasteOpen, setPasteOpen] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [sourceKind, setSourceKind] = useState('sample')
  const [generating, setGenerating] = useState(false)
  const [status, setStatus] = useState('Örnek kaynak yüklü. Anahtarsız da hemen dinleyebilirsiniz.')
  const [activeChunkId, setActiveChunkId] = useState(null)

  const onTurnChange = useCallback((index, turn) => {
    setActiveChunkId(turn?.grounding?.sourceChunkId || null)
  }, [])

  const player = usePodcastPlayer({ turns, onTurnChange })
  const current = player.currentTurn

  const persistKey = (value) => {
    setApiKey(value)
    try {
      localStorage.setItem(KEY_STORAGE, value)
    } catch {
      /* ignore */
    }
  }

  const applyDocument = (docTitle, nextChunks) => {
    player.stop()
    setTitle(docTitle)
    setChunks(nextChunks)
    setTurns([])
    setActiveChunkId(null)
    setSourceKind('upload')
    setStatus(`${nextChunks.length} parça hazır. Deep Dive üretin veya örnek senaryoyu açın.`)
  }

  const handleFile = async (file) => {
    try {
      setStatus('Belge okunuyor…')
      const { ingestFile } = await import('./lib/extractPdf')
      const doc = await ingestFile(file)
      const next = chunkDocument(doc.fullText, doc.pages)
      applyDocument(doc.title, next)
    } catch (err) {
      setStatus(`Belge okunamadı: ${err.message}`)
    }
  }

  const handlePaste = () => {
    const next = chunkDocument(pasteText)
    if (!next.length) {
      setStatus('Yapıştırılan metin boş.')
      return
    }
    applyDocument('Yapıştırılan metin', next)
    setPasteOpen(false)
  }

  const handleGenerate = async () => {
    setGenerating(true)
    player.stop()
    setStatus('Senaryo yazılıyor…')
    try {
      const result = await generatePodcastScript({
        apiKey: apiKey.trim() || import.meta.env.VITE_GEMINI_API_KEY,
        tone,
        title,
        chunks,
        preferHandcraftedMock: sourceKind === 'sample',
      })
      setTurns(result.turns)
      if (result.usedFallback) {
        const why =
          result.fallbackReason === 'api-key-missing'
            ? 'API anahtarı yok; kaynağa bağlı yerel senaryo üretildi.'
            : `Model yanıtı alınamadı (${result.fallbackReason}). Yerel senaryo devrede.`
        setStatus(why)
      } else {
        setStatus(`${result.turns.length} tur hazır · ${TONE_LABELS[tone]}`)
      }
    } catch (err) {
      setStatus(err.message)
    }
    setGenerating(false)
  }

  const handleTone = (next) => {
    setTone(next)
    if (apiKey) {
      setStatus(`Ton: ${TONE_LABELS[next]} — yeniden üretmek için Deep Dive’a basın.`)
      return
    }
    if (sourceKind === 'sample') {
      const fallback = getMockStudio(next)
      setTurns(fallback.turns)
      setStatus(`Ton: ${TONE_LABELS[next]} (örnek senaryo)`)
      return
    }
    if (chunks.length) {
      setTurns(synthesizeLocalScript(chunks, next))
      setStatus(`Ton: ${TONE_LABELS[next]} (yerel senaryo)`)
    }
  }

  const loadSample = () => {
    const sample = getMockStudio(tone)
    player.stop()
    setTitle(sample.title)
    setChunks(sample.chunks)
    setTurns(sample.turns)
    setSourceKind('sample')
    setActiveChunkId(null)
    setStatus('Örnek Akdeniz tarımı kaynağı ve diyalog yüklendi.')
  }

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-ink text-paper">
      <header className="flex items-center justify-between border-b border-line px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 font-display text-gold">
            R
          </div>
          <div>
            <p className="text-sm font-medium tracking-tight">ResonoteTR</p>
            <p className="text-[11px] text-paper/40">Kaynaklı Deep Dive stüdyosu · Deniz & Barış</p>
          </div>
        </div>
        <button type="button" onClick={loadSample} className="text-xs text-paper/50 hover:text-gold">
          Örnek stüdyoyu yükle
        </button>
      </header>

      <ControlBar
        tone={tone}
        onTone={handleTone}
        onGenerate={handleGenerate}
        generating={generating}
        player={player}
        hasTurns={turns.length > 0}
        apiKey={apiKey}
        onApiKey={persistKey}
        onFile={handleFile}
        onPasteToggle={() => setPasteOpen((v) => !v)}
      />

      {pasteOpen ? (
        <div className="border-b border-line bg-panel px-5 py-3">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={5}
            placeholder="Metni veya markdown’ı buraya yapıştırın…"
            className="w-full resize-none rounded-xl border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-gold/50"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handlePaste}
              className="rounded-full bg-gold px-4 py-1.5 text-xs font-medium text-ink"
            >
              Parçalara böl
            </button>
          </div>
        </div>
      ) : null}

      <p className="border-b border-line px-5 py-2 text-xs text-paper/45">{status}</p>
      {player.unsupported ? (
        <p className="bg-gold/10 px-5 py-2 text-xs text-gold">
          Bu tarayıcı Web Speech API sunmuyor. Chrome veya Edge deneyin.
        </p>
      ) : null}

      <main className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,6fr)_minmax(320px,4fr)]">
        <DocumentViewer chunks={chunks} activeChunkId={activeChunkId} title={title} />

        <aside className="flex min-h-0 flex-col bg-ink">
          <div className="border-b border-line p-4">
            <HostStage currentTurn={current} isPlaying={player.isPlaying} />
            {current?.grounding ? (
              <div className="mt-3 flex gap-2 rounded-xl border border-gold/25 bg-gold/8 px-3 py-2 text-xs text-paper/80">
                <Quote size={14} className="mt-0.5 shrink-0 text-gold" />
                <p>
                  Kaynak: Sayfa {current.grounding.pageNumber} — “{current.grounding.excerpt}”
                </p>
              </div>
            ) : (
              <p className="mt-3 text-xs text-paper/35">Oynatma başlayınca canlı kaynak alıntısı burada belirir.</p>
            )}
          </div>
          <div className="flex min-h-0 flex-1 flex-col p-4">
            <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-paper/40">Transkript</p>
            {turns.length ? (
              <Transcript turns={turns} currentIndex={player.currentIndex} onSeek={player.seekTo} />
            ) : (
              <p className="text-sm text-paper/40">Henüz senaryo yok. Deep Dive üretin.</p>
            )}
          </div>
        </aside>
      </main>
    </div>
  )
}
