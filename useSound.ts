import { useCallback, useRef } from 'react'
import { useUIStore } from '@/store/ui.store'

// We use the Web Audio API to generate tones — no external files needed
type SoundType = 'click' | 'success' | 'error' | 'notification' | 'coin' | 'block' | 'celebrate'

function createAudioContext(): AudioContext {
  return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.3
) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.type = type
  osc.frequency.setValueAtTime(frequency, ctx.currentTime)
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

const soundDefs: Record<SoundType, (ctx: AudioContext) => void> = {
  click: (ctx) => playTone(ctx, 800, 0.08, 'sine', 0.15),

  success: (ctx) => {
    playTone(ctx, 523, 0.1, 'sine', 0.3)
    setTimeout(() => playTone(ctx, 659, 0.1, 'sine', 0.3), 100)
    setTimeout(() => playTone(ctx, 784, 0.2, 'sine', 0.3), 200)
  },

  error: (ctx) => {
    playTone(ctx, 300, 0.15, 'sawtooth', 0.3)
    setTimeout(() => playTone(ctx, 250, 0.25, 'sawtooth', 0.3), 150)
  },

  notification: (ctx) => {
    playTone(ctx, 880, 0.08, 'sine', 0.25)
    setTimeout(() => playTone(ctx, 1100, 0.15, 'sine', 0.25), 100)
  },

  coin: (ctx) => {
    playTone(ctx, 1200, 0.05, 'sine', 0.4)
    setTimeout(() => playTone(ctx, 1600, 0.1, 'sine', 0.35), 60)
    setTimeout(() => playTone(ctx, 2000, 0.15, 'sine', 0.3), 120)
  },

  block: (ctx) => {
    playTone(ctx, 200, 0.3, 'square', 0.4)
    setTimeout(() => playTone(ctx, 150, 0.4, 'square', 0.4), 200)
  },

  celebrate: (ctx) => {
    const notes = [523, 659, 784, 1047, 784, 1047]
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(ctx, freq, 0.15, 'sine', 0.3), i * 80)
    })
  },
}

export function useSound() {
  const { isMuted } = useUIStore()
  const ctxRef = useRef<AudioContext | null>(null)

  const play = useCallback(
    (type: SoundType) => {
      if (isMuted) return
      try {
        if (!ctxRef.current) {
          ctxRef.current = createAudioContext()
        }
        const ctx = ctxRef.current
        if (ctx.state === 'suspended') ctx.resume()
        soundDefs[type](ctx)
      } catch {
        // Audio not supported — fail silently
      }
    },
    [isMuted]
  )

  return { play }
}
