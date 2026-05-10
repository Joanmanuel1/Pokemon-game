import { ref } from 'vue'
import { useLocalStorage } from './useLocalStorage'

export const ACHIEVEMENTS = {
  first_win:      { id: 'first_win',      icon: '🎯', title: 'Primera victoria',  desc: 'Adivina tu primer Pokémon' },
  streak_5:       { id: 'streak_5',       icon: '🔥', title: 'En racha',           desc: 'Consigue una racha de 5' },
  streak_10:      { id: 'streak_10',      icon: '⚡', title: 'Imparable',          desc: 'Consigue una racha de 10' },
  streak_25:      { id: 'streak_25',      icon: '👑', title: 'Maestro Pokémon',    desc: 'Consigue una racha de 25' },
  legendary_win:  { id: 'legendary_win',  icon: '✨', title: 'Cazador legendario', desc: 'Adivina un legendario' },
  level_5:        { id: 'level_5',        icon: '🌟', title: 'Entrenador',         desc: 'Alcanza el nivel 5' },
  level_10:       { id: 'level_10',       icon: '💎', title: 'Veterano',           desc: 'Alcanza el nivel 10' },
  no_hint_streak: { id: 'no_hint_streak', icon: '🧠', title: 'Sin ayuda',          desc: 'Racha de 10 sin usar pistas' },
  speed_demon:    { id: 'speed_demon',    icon: '💨', title: 'Demonio de velocidad', desc: 'Acierta en menos de 3 segundos' },
}

const unlocked = useLocalStorage('pkq_achievements', [])
const queue = ref([])

export function useAchievements() {
  function unlock(id) {
    if (unlocked.value.includes(id)) return false
    const a = ACHIEVEMENTS[id]
    if (!a) return false
    unlocked.value = [...unlocked.value, id]
    queue.value = [...queue.value, a]
    return true
  }

  function dismiss() {
    queue.value = queue.value.slice(1)
  }

  function hasUnlocked(id) {
    return unlocked.value.includes(id)
  }

  return { unlocked, queue, unlock, dismiss, hasUnlocked, ACHIEVEMENTS }
}
