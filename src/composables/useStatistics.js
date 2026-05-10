import { computed } from 'vue'
import { useLocalStorage } from './useLocalStorage'

const defaultStats = {
  totalGames: 0,
  totalCorrect: 0,
  totalWrong: 0,
  bestStreak: 0,
  correctByPokemon: {},
  history: [],
}

const stats = useLocalStorage('pkq_stats', defaultStats)

export function useStatistics() {
  const accuracy = computed(() => {
    const total = stats.value.totalCorrect + stats.value.totalWrong
    if (total === 0) return '0.0'
    return ((stats.value.totalCorrect / total) * 100).toFixed(1)
  })

  const favoritePokemon = computed(() => {
    const entries = Object.entries(stats.value.correctByPokemon)
    if (entries.length === 0) return null
    return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0]
  })

  function recordCorrect(pokemonId, currentStreak) {
    stats.value.totalCorrect++
    const key = String(pokemonId)
    stats.value.correctByPokemon[key] = (stats.value.correctByPokemon[key] || 0) + 1
    if (currentStreak > stats.value.bestStreak) {
      stats.value.bestStreak = currentStreak
    }
  }

  function recordWrong() {
    stats.value.totalWrong++
  }

  function recordGame(score, level) {
    stats.value.totalGames++
    stats.value.history.push({ date: new Date().toISOString(), score, level })
    if (stats.value.history.length > 20) {
      stats.value.history = stats.value.history.slice(-20)
    }
  }

  function resetStats() {
    stats.value = { ...defaultStats, correctByPokemon: {}, history: [] }
  }

  return { stats, accuracy, favoritePokemon, recordCorrect, recordWrong, recordGame, resetStats }
}
