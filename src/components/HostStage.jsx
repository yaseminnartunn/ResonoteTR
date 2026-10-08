const EMOTION_TR = {
  curious: 'meraklı',
  insightful: 'derinlik',
  skeptical: 'şüphe',
  enthusiastic: 'coşku',
  humorous: 'mizah',
}

export function HostStage({ currentTurn, isPlaying }) {
  const active = isPlaying ? currentTurn?.speaker : null
  return (
    <div className="grid grid-cols-2 gap-3">
      <HostCard
        name="Deniz"
        role="Moderatör"
        speaker="hostA"
        live={active === 'hostA'}
        emotion={active === 'hostA' ? currentTurn?.emotion : null}
        accent="mint"
      />
      <HostCard
        name="Barış"
        role="Analist"
        speaker="hostB"
        live={active === 'hostB'}
        emotion={active === 'hostB' ? currentTurn?.emotion : null}
        accent="gold"
      />
    </div>
  )
}

function HostCard({ name, role, live, emotion, accent }) {
  const ring = accent === 'gold' ? 'border-gold/40' : 'border-mint/40'
  const bg = accent === 'gold' ? 'from-gold/20' : 'from-mint/20'
  return (
    <div
      className={`rounded-2xl border bg-raised/80 p-4 ${live ? `${ring} avatar-live` : 'border-line'}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${bg} to-transparent text-sm font-semibold tracking-wide ${live ? 'scale-105' : ''} transition`}
        >
          {name.slice(0, 1)}
        </div>
        <div>
          <p className="text-sm font-medium text-paper">{name}</p>
          <p className="text-xs text-paper/50">{role}</p>
        </div>
      </div>
      <div className="mt-3 h-8">
        {live ? <Waveform accent={accent} /> : <p className="text-xs text-paper/35">Beklemede</p>}
      </div>
      {emotion ? (
        <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-paper/45">
          {EMOTION_TR[emotion] || emotion}
        </p>
      ) : null}
    </div>
  )
}

export function Waveform({ accent = 'gold' }) {
  const color = accent === 'mint' ? 'bg-mint' : 'bg-gold'
  return (
    <div className="flex h-8 items-end gap-[3px]">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className={`wave-bar w-[3px] rounded-full ${color}`}
          style={{
            height: `${10 + ((i * 17) % 22)}px`,
            animationDelay: `${i * 0.07}s`,
          }}
        />
      ))}
    </div>
  )
}
