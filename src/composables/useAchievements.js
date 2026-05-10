import { ref } from 'vue'
import { useLocalStorage } from './useLocalStorage'

export const ACHIEVEMENTS = {
  // Wins
  first_win:      { id: 'first_win',      icon: '🎯', title: 'Primera victoria',       desc: 'Adivina tu primer Pokémon' },
  // Streaks
  streak_5:       { id: 'streak_5',       icon: '🔥', title: 'En racha',               desc: 'Consigue una racha de 5' },
  streak_10:      { id: 'streak_10',      icon: '⚡', title: 'Imparable',              desc: 'Consigue una racha de 10' },
  streak_25:      { id: 'streak_25',      icon: '👑', title: 'Maestro Pokémon',        desc: 'Consigue una racha de 25' },
  // Speed
  speed_demon:    { id: 'speed_demon',    icon: '💨', title: 'Veloz',                  desc: 'Acierta en menos de 3 segundos' },
  speed_demon_5:  { id: 'speed_demon_5',  icon: '💨', title: 'Demonio de velocidad',   desc: '5 respuestas en menos de 3s' },
  // Score
  score_50:       { id: 'score_50',       icon: '⭐', title: 'Puntuador',              desc: 'Alcanza 50 puntos en una partida' },
  score_100:      { id: 'score_100',      icon: '🌠', title: 'Centenario',             desc: 'Alcanza 100 puntos en una partida' },
  // No hints
  no_hint_streak: { id: 'no_hint_streak', icon: '🧠', title: 'Sin ayuda',              desc: 'Racha de 10 sin usar pistas' },
  // Level
  level_5:        { id: 'level_5',        icon: '🌟', title: 'Entrenador',             desc: 'Alcanza el nivel 5' },
  level_10:       { id: 'level_10',       icon: '💎', title: 'Veterano',               desc: 'Alcanza el nivel 10' },
  // Legendary
  legendary_win:  { id: 'legendary_win',  icon: '✨', title: 'Cazador legendario',     desc: 'Adivina un Pokémon legendario' },
  ten_legendaries:{ id: 'ten_legendaries',icon: '✨', title: 'Leyenda viva',           desc: 'Adivina 10 Pokémon legendarios' },
  // Pokédex
  pokedex_10:     { id: 'pokedex_10',     icon: '📖', title: 'Coleccionista',          desc: 'Captura 10 Pokémon en la Pokédex' },
  pokedex_50:     { id: 'pokedex_50',     icon: '📚', title: 'Explorador',             desc: 'Captura 50 Pokémon en la Pokédex' },
  pokedex_100:    { id: 'pokedex_100',    icon: '🏅', title: 'Maestro Pokédex',        desc: 'Captura 100 Pokémon en la Pokédex' },
  // Types
  all_types:      { id: 'all_types',      icon: '🌈', title: 'Arcoíris',               desc: 'Adivina un Pokémon de cada tipo' },
  // Evolutions
  first_evolution:{ id: 'first_evolution',icon: '🦋', title: 'Primera evolución',      desc: 'Adivina la evolución de un Pokémon' },
  evolution_master:{id: 'evolution_master',icon:'👑', title: 'Maestro Evolucionador',   desc: 'Adivina 50 evoluciones' },
  // Combo
  type_chain_3:   { id: 'type_chain_3',   icon: '🔗', title: 'Cadena de tipo',         desc: 'Consigue una cadena de tipo ×3' },
  type_chain_6:   { id: 'type_chain_6',   icon: '⛓️', title: 'Gran cadena',            desc: 'Consigue una cadena de tipo ×6' },
  // Daily
  first_mission:  { id: 'first_mission',  icon: '📅', title: 'Primera misión',         desc: 'Completa tu primera misión diaria' },
  login_7:        { id: 'login_7',        icon: '🗓️', title: 'Dedicado',               desc: '7 días consecutivos' },
  login_30:       { id: 'login_30',       icon: '🏆', title: 'Adicto Pokémon',         desc: '30 días consecutivos' },
  // Shop
  first_purchase: { id: 'first_purchase', icon: '🛒', title: 'Primera compra',         desc: 'Compra algo en la tienda' },
  shield_save:    { id: 'shield_save',    icon: '🛡️', title: 'Escudo de acero',        desc: 'El escudo te salva de un game over' },
  // Games
  games_10:       { id: 'games_10',       icon: '🎮', title: 'Aficionado',             desc: 'Juega 10 partidas' },
  games_50:       { id: 'games_50',       icon: '🎯', title: 'Veterano de partidas',   desc: 'Juega 50 partidas' },
  // Accuracy
  accuracy_90:    { id: 'accuracy_90',    icon: '🎯', title: 'Precisión de élite',     desc: '90% de precisión con al menos 20 respuestas' },
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
