import { ref, computed, watch } from 'vue'
import { useLocalStorage } from './useLocalStorage'
import { useAchievements } from './useAchievements'
import { usePokedex } from './usePokedex'
import { useDailyMissions } from './useDailyMissions'
import getPokemonOptions from '@/helpers/getPokemonOptions'
import { legendaryIds } from '@/helpers/legendaryIds'

const score = ref(0)
const streak = ref(0)
const highScore = useLocalStorage('pkq_highScore', 0)
const bestStreak = useLocalStorage('pkq_bestStreak', 0)
const level = computed(() => Math.floor(score.value / 10) + 1)
const levelProgress = computed(() => (score.value % 10) / 10)

// Combo system
const comboType = ref(null)
const comboCount = ref(0)
const comboMultiplier = computed(() => {
  if (comboCount.value < 2) return 1
  if (comboCount.value < 4) return 1.5
  if (comboCount.value < 6) return 2
  return 3
})

const pokemonArr = ref([])
const pokemon = ref(null)
const showPokemon = ref(false)
const showAnswer = ref(false)
const message = ref('')
const isCorrect = ref(null)
const perdio = ref(false)
const isLoading = ref(false)
const difficulty = ref('easy')
const timerMode = ref(false)
const showPokedex = ref(false)
const showStats = ref(false)
const lastSelectedId = ref(null)

const hintUsed = ref(false)
const hintsUsedThisRun = ref(0)
const hintLetter = ref('')
const lastBonus = ref(0)
const lastAnswerTime = ref(0)
let questionStartTime = 0

const { unlock } = useAchievements()
const { capture, capturedSet, totalCaptured } = usePokedex()
const { updateMission } = useDailyMissions()

// track types seen for all_types achievement
const typesSeen = useLocalStorage('pkq_types_seen', [])
const legendariesGuessed = useLocalStorage('pkq_legendaries_guessed', 0)
const speedDemonCount = useLocalStorage('pkq_speed_count', 0)
const evolutionsGuessed = useLocalStorage('pkq_evolutions_guessed', 0)

watch(level, (n, o) => {
  if (n > o) {
    if (n >= 5)  unlock('level_5')
    if (n >= 10) unlock('level_10')
  }
})

async function loadPokemon() {
  isLoading.value = true
  showPokedex.value = false
  pokemonArr.value = []
  pokemon.value = null
  showPokemon.value = false
  showAnswer.value = false
  message.value = ''
  isCorrect.value = null
  hintUsed.value = false
  hintLetter.value = ''
  lastBonus.value = 0
  lastSelectedId.value = null

  const options = await getPokemonOptions(difficulty.value)
  pokemonArr.value = options
  pokemon.value = options[Math.floor(Math.random() * options.length)]
  isLoading.value = false
  questionStartTime = performance.now()
}

function checkAnswer(selectedId, opts = {}) {
  const { timeLeft = null, total = 15 } = opts
  showPokemon.value = true
  showAnswer.value = true
  lastSelectedId.value = Number(selectedId)
  lastAnswerTime.value = (performance.now() - questionStartTime) / 1000

  if (Number(selectedId) === Number(pokemon.value.id)) {
    // Combo logic
    const pType = pokemon.value.types?.[0]
    if (pType === comboType.value) {
      comboCount.value++
    } else {
      comboType.value = pType
      comboCount.value = 1
    }
    if (comboCount.value >= 3) unlock('type_chain_3')
    if (comboCount.value >= 6) unlock('type_chain_6')
    if (comboCount.value >= 3) updateMission('combo', 1)

    let pts = 1
    if (timeLeft != null) {
      const bonus = Math.ceil(timeLeft / 3)
      pts += bonus
      lastBonus.value = bonus
    }
    pts = Math.round(pts * comboMultiplier.value)
    score.value += pts
    streak.value++
    message.value = `¡Correcto! Es ${capitalize(pokemon.value.name)}`
    isCorrect.value = true

    if (score.value > highScore.value) highScore.value = score.value
    if (streak.value > bestStreak.value) bestStreak.value = streak.value

    // Missions: correct answer
    updateMission('correct', 1)
    updateMission('streak', streak.value)
    if (!hintUsed.value) updateMission('no_hint', 1)
    if (lastAnswerTime.value < 3) updateMission('speed', 1)

    // Capture in Pokédex
    const wasNew = !capturedSet.value.has(pokemon.value.id)
    capture(pokemon.value.id)
    const newTotal = totalCaptured.value
    if (wasNew) updateMission('new_capture', 1)
    if (newTotal >= 10)  unlock('pokedex_10')
    if (newTotal >= 50)  unlock('pokedex_50')
    if (newTotal >= 100) unlock('pokedex_100')

    // Type tracking for all_types
    if (pType && !typesSeen.value.includes(pType)) {
      typesSeen.value = [...typesSeen.value, pType]
      if (typesSeen.value.length >= 18) unlock('all_types')
    }

    // Legendary counter
    if (legendaryIds.includes(pokemon.value.id)) {
      legendariesGuessed.value++
      unlock('legendary_win')
      updateMission('legendary', 1)
      if (legendariesGuessed.value >= 10) unlock('ten_legendaries')
    }

    // Speed
    if (lastAnswerTime.value < 3) {
      speedDemonCount.value++
      unlock('speed_demon')
      if (speedDemonCount.value >= 5) unlock('speed_demon_5')
    }

    // Score milestones
    if (score.value >= 50)  unlock('score_50')
    if (score.value >= 100) unlock('score_100')

    unlock('first_win')
    if (streak.value >= 5)  unlock('streak_5')
    if (streak.value >= 10) unlock('streak_10')
    if (streak.value >= 25) unlock('streak_25')
    if (streak.value >= 10 && hintsUsedThisRun.value === 0) unlock('no_hint_streak')
  } else {
    message.value = `Era ${capitalize(pokemon.value.name)}`
    isCorrect.value = false
    streak.value = 0
    perdio.value = true
  }
}

function useHint() {
  if (hintUsed.value || !pokemon.value) return
  hintUsed.value = true
  hintsUsedThisRun.value++
  hintLetter.value = pokemon.value.name.charAt(0).toUpperCase()
  if (streak.value > 0) streak.value = Math.max(0, streak.value - 1)
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function newGame(diff) {
  if (diff) difficulty.value = diff
  if (score.value > 0) updateMission('game_end', 1)
  score.value = 0
  streak.value = 0
  perdio.value = false
  hintsUsedThisRun.value = 0
  comboType.value = null
  comboCount.value = 0
  loadPokemon()
}

function nextPokemon() {
  perdio.value = false
  loadPokemon()
}

function setDifficulty(d) { difficulty.value = d }
function setTimerMode(t)   { timerMode.value = t }

export function useGameState() {
  return {
    score, streak, highScore, bestStreak, level, levelProgress,
    pokemonArr, pokemon, showPokemon, showAnswer,
    message, isCorrect, perdio, isLoading,
    difficulty, timerMode, showPokedex, showStats, lastSelectedId,
    hintUsed, hintLetter, lastBonus, lastAnswerTime, hintsUsedThisRun,
    comboType, comboCount, comboMultiplier,
    evolutionsGuessed,
    loadPokemon, checkAnswer, newGame, nextPokemon,
    setDifficulty, setTimerMode, useHint,
  }
}
