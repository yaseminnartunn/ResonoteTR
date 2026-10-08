import { useEffect, useRef } from 'react'

const INTERJECTION = {
  interruption: 'kesme',
  agreement: 'onay',
  pivot: 'dönüş',
}

export function Transcript({ turns, currentIndex, onSeek }) {
  const activeRef = useRef(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [currentIndex])

  return (
    <div className="scroll-thin min-h-0 flex-1 overflow-y-auto pr-1">
      {turns.map((turn, i) => {
        const active = i === currentIndex
        const isA = turn.speaker === 'hostA'
        return (
          <button
            type="button"
            key={turn.id}
            ref={active ? activeRef : null}
            onClick={() => onSeek(i)}
            className={`mb-2 w-full rounded-xl border px-3 py-2.5 text-left transition ${
              active
                ? 'border-gold/50 bg-gold/10'
                : 'border-transparent bg-white/2 hover:border-line'
            }`}
          >
            <div className="mb-1 flex items-center gap-2 text-[11px]">
              <span className={isA ? 'text-mint' : 'text-gold'}>{turn.speakerName}</span>
              {turn.interjectionType ? (
                <span className="text-paper/35">{INTERJECTION[turn.interjectionType]}</span>
              ) : null}
            </div>
            <p className={`text-sm leading-6 ${active ? 'text-paper' : 'text-paper/70'}`}>{turn.text}</p>
          </button>
        )
      })}
    </div>
  )
}
