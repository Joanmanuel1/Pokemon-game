import { useLocalStorage } from './useLocalStorage'

const soundEnabled = useLocalStorage('pkq_sound', true)
let audioCtx = null

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

function playTone(frequency, duration, type = 'sine', gainVal = 0.3) {
  if (!soundEnabled.value) return
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = type
  osc.frequency.value = frequency
  gain.gain.setValueAtTime(gainVal, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

export function useSound() {
  function playCorrect() {
    playTone(523, 0.15)  // C5
    setTimeout(() => playTone(659, 0.2), 120)  // E5
    setTimeout(() => playTone(784, 0.3), 240)  // G5
  }

  function playWrong() {
    playTone(311, 0.15, 'sawtooth')  // Eb4
    setTimeout(() => playTone(233, 0.3, 'sawtooth'), 150)  // Bb3
  }

  function playPokemonCry(cryUrl) {
    if (!soundEnabled.value || !cryUrl) return
    const audio = new Audio(cryUrl)
    audio.volume = 0.5
    audio.play().catch(() => {})
  }

  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
  }

  return { soundEnabled, playCorrect, playWrong, playPokemonCry, toggleSound }
}
