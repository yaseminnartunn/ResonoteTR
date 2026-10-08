import { useCallback, useEffect, useRef, useState } from 'react'

const HOST_VOICE = {
  hostA: { pitch: 1.12, rate: 1.06 },
  hostB: { pitch: 0.86, rate: 0.92 },
}

function wait(ms, signalRef) {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms)
    signalRef.current = () => {
      clearTimeout(timer)
      resolve()
    }
  })
}

function pickVoice(voices, speaker) {
  const tr = voices.filter((v) => /tr[-_]?TR|Turkish/i.test(`${v.lang} ${v.name}`))
  const pool = tr.length ? tr : voices
  if (!pool.length) return null
  if (speaker === 'hostB') {
    return (
      pool.find((v) => /male|erkek|baritone|emre|tolga/i.test(v.name)) ||
      pool[pool.length - 1]
    )
  }
  return (
    pool.find((v) => /female|kadın|filiz|yelda|zehra/i.test(v.name)) || pool[0]
  )
}

export function usePodcastPlayer({ turns = [], onTurnChange } = {}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [voicesReady, setVoicesReady] = useState(false)
  const [unsupported, setUnsupported] = useState(false)

  const indexRef = useRef(-1)
  const playingRef = useRef(false)
  const pausedRef = useRef(false)
  const turnsRef = useRef(turns)
  const voicesRef = useRef([])
  const cancelWaitRef = useRef(() => {})
  const onTurnChangeRef = useRef(onTurnChange)

  turnsRef.current = turns
  onTurnChangeRef.current = onTurnChange

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setUnsupported(true)
      return undefined
    }
    const synth = window.speechSynthesis
    const load = () => {
      voicesRef.current = synth.getVoices()
      setVoicesReady(true)
    }
    load()
    synth.addEventListener('voiceschanged', load)
    return () => synth.removeEventListener('voiceschanged', load)
  }, [])

  const speakTurn = useCallback((turn) => {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('SpeechSynthesis yok'))
        return
      }
      const utter = new SpeechSynthesisUtterance(turn.text)
      utter.lang = 'tr-TR'
      const profile = HOST_VOICE[turn.speaker] || HOST_VOICE.hostA
      utter.pitch = profile.pitch
      utter.rate = profile.rate
      const voice = pickVoice(voicesRef.current, turn.speaker)
      if (voice) utter.voice = voice
      utter.onend = () => resolve()
      utter.onerror = (e) => {
        if (e.error === 'canceled' || e.error === 'interrupted') resolve()
        else reject(e.error)
      }
      window.speechSynthesis.speak(utter)
    })
  }, [])

  const runQueue = useCallback(async (fromIndex) => {
    playingRef.current = true
    pausedRef.current = false
    setIsPlaying(true)
    setIsPaused(false)

    const list = turnsRef.current
    for (let i = fromIndex; i < list.length; i += 1) {
      if (!playingRef.current) return
      if (pausedRef.current) return
      indexRef.current = i
      setCurrentIndex(i)
      onTurnChangeRef.current?.(i, list[i])
      try {
        await speakTurn(list[i])
      } catch {
        /* tarayıcı iptali */
      }
      if (!playingRef.current || pausedRef.current) return
      const pause = Number(list[i].pauseAfterMs) || 200
      await wait(pause, cancelWaitRef)
      if (!playingRef.current || pausedRef.current) return
    }

    playingRef.current = false
    setIsPlaying(false)
    setIsPaused(false)
    indexRef.current = -1
    setCurrentIndex(-1)
    onTurnChangeRef.current?.(-1, null)
  }, [speakTurn])

  const stopSynth = useCallback(() => {
    cancelWaitRef.current?.()
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [])

  const play = useCallback(() => {
    if (!turnsRef.current.length) return
    stopSynth()
    const start = indexRef.current >= 0 ? indexRef.current : 0
    runQueue(start)
  }, [runQueue, stopSynth])

  const pause = useCallback(() => {
    pausedRef.current = true
    playingRef.current = false
    setIsPaused(true)
    setIsPlaying(false)
    stopSynth()
  }, [stopSynth])

  const resume = useCallback(() => {
    if (!turnsRef.current.length) return
    const start = indexRef.current >= 0 ? indexRef.current : 0
    runQueue(start)
  }, [runQueue])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else if (isPaused) resume()
    else play()
  }, [isPaused, isPlaying, pause, play, resume])

  const skip = useCallback((dir = 1) => {
    if (!turnsRef.current.length) return
    const next = Math.min(
      Math.max((indexRef.current < 0 ? 0 : indexRef.current) + dir, 0),
      turnsRef.current.length - 1,
    )
    stopSynth()
    runQueue(next)
  }, [runQueue, stopSynth])

  const seekTo = useCallback((index) => {
    if (index < 0 || index >= turnsRef.current.length) return
    stopSynth()
    runQueue(index)
  }, [runQueue, stopSynth])

  const stop = useCallback(() => {
    playingRef.current = false
    pausedRef.current = false
    indexRef.current = -1
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentIndex(-1)
    stopSynth()
    onTurnChangeRef.current?.(-1, null)
  }, [stopSynth])

  useEffect(() => () => stopSynth(), [stopSynth])

  return {
    isPlaying,
    isPaused,
    currentIndex,
    currentTurn: currentIndex >= 0 ? turns[currentIndex] : null,
    voicesReady,
    unsupported,
    play,
    pause,
    resume,
    toggle,
    skip,
    seekTo,
    stop,
  }
}

export const useAudioPodcaster = usePodcastPlayer
