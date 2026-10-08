import { useEffect, useRef } from 'react'

export function DocumentViewer({ chunks, activeChunkId, title }) {
  const scrollerRef = useRef(null)

  useEffect(() => {
    if (!activeChunkId) return
    const node = document.getElementById(activeChunkId)
    if (!node) return
    node.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [activeChunkId])

  return (
    <section className="flex h-full min-h-0 flex-col border-r border-line bg-panel">
      <header className="flex items-end justify-between gap-4 border-b border-line px-6 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold/80">Kaynak görüntüleyici</p>
          <h2 className="mt-1 font-display text-xl text-paper">{title}</h2>
        </div>
        <span className="text-xs text-paper/40">{chunks.length} parça</span>
      </header>
      <div ref={scrollerRef} className="scroll-thin min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {chunks.map((chunk) => {
          const active = chunk.chunkId === activeChunkId
          return (
            <div
              id={chunk.chunkId}
              key={chunk.chunkId}
              className={`mb-3 rounded-xl p-2 transition-all duration-500 ${
                active ? 'chunk-glow bg-gold/8' : 'bg-transparent hover:bg-white/2'
              }`}
            >
              <div className="mb-2 flex items-center gap-2 text-[11px] text-paper/40">
                <span className="rounded-full border border-line px-2 py-0.5">{chunk.chunkId}</span>
                <span>Sayfa {chunk.page}</span>
              </div>
              <p className="text-[15px] leading-7 text-paper/82">{chunk.text}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
