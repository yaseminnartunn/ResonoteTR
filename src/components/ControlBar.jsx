import {
  FileUp,
  KeyRound,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Sparkles,
  Square,
} from 'lucide-react'
import { TONE_AKADEMIK, TONE_LABELS, TONE_SAMIMI } from '../lib/promptTemplates'

export function ControlBar({
  tone,
  onTone,
  onGenerate,
  generating,
  player,
  hasTurns,
  apiKey,
  onApiKey,
  onFile,
  onPasteToggle,
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-line px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-raised px-3 py-1.5 text-xs text-paper/80 hover:border-gold/40">
          <FileUp size={14} />
          PDF / metin
          <input
            type="file"
            accept=".pdf,.txt,.md,.markdown"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onFile(file)
              e.target.value = ''
            }}
          />
        </label>
        <button
          type="button"
          onClick={onPasteToggle}
          className="rounded-full border border-line px-3 py-1.5 text-xs text-paper/70 hover:border-mint/40"
        >
          Metin yapıştır
        </button>
        <div className="flex rounded-full border border-line p-0.5 text-xs">
          {[TONE_AKADEMIK, TONE_SAMIMI].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onTone(id)}
              className={`rounded-full px-3 py-1.5 ${
                tone === id ? 'bg-gold text-ink' : 'text-paper/60'
              }`}
            >
              {id === TONE_AKADEMIK ? 'Akademik' : 'Samimi'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 rounded-full border border-line bg-ink px-3 py-1.5">
          <KeyRound size={13} className="text-paper/40" />
          <input
            type="password"
            value={apiKey}
            onChange={(e) => onApiKey(e.target.value)}
            placeholder="Gemini API anahtarı (isteğe bağlı)"
            className="w-44 bg-transparent text-xs outline-none placeholder:text-paper/30"
          />
        </label>
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating}
          className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3.5 py-1.5 text-xs font-medium text-ink disabled:opacity-50"
        >
          <Sparkles size={14} />
          {generating ? 'Üretiliyor…' : 'Deep Dive üret'}
        </button>
        <div className="flex items-center gap-1">
          <IconBtn onClick={() => player.skip(-1)} disabled={!hasTurns} label="Önceki">
            <SkipBack size={14} />
          </IconBtn>
          <button
            type="button"
            onClick={player.toggle}
            disabled={!hasTurns}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold text-ink disabled:opacity-40"
            aria-label={player.isPlaying ? 'Duraklat' : 'Oynat'}
          >
            {player.isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <IconBtn onClick={() => player.skip(1)} disabled={!hasTurns} label="Sonraki">
            <SkipForward size={14} />
          </IconBtn>
          <IconBtn onClick={player.stop} disabled={!hasTurns} label="Durdur">
            <Square size={13} />
          </IconBtn>
        </div>
      </div>
      <p className="sr-only">{TONE_LABELS[tone]}</p>
    </div>
  )
}

function IconBtn({ children, onClick, disabled, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-paper/70 disabled:opacity-30"
    >
      {children}
    </button>
  )
}
