<template>
  <div class="game-page">
    <ConfettiCanvas ref="confettiRef" />
    <AchievementToast />

    <!-- Top bar -->
    <header class="top-bar">
      <div class="top-left">
        <button class="icon-btn" @click="exitGame" title="Salir">←</button>
        <button class="icon-btn" @click="showStats = true" title="Estadísticas">📊</button>
      </div>

      <div class="score-row">
        <span class="score-pill">
          <span class="score-icon">⭐</span>
          <span class="score-val" :class="{ pop: scorePulse }">{{ score }}</span>
        </span>
        <span class="streak-pill" v-if="streak > 1">
          🔥 <span class="pop">x{{ streak }}</span>
        </span>
        <LevelProgress :level="level" :progress="levelProgress" />
      </div>

      <div class="top-right">
        <button class="icon-btn" @click="onSoundToggle" :title="soundEnabled ? 'Silenciar' : 'Activar sonido'">
          {{ soundEnabled ? '🔊' : '🔇' }}
        </button>
        <ThemeToggle />
      </div>
    </header>

    <!-- Floating bonus +N points -->
    <Transition name="bonus">
      <div v-if="showBonus" class="bonus-pop">+{{ lastBonus + 1 }}</div>
    </Transition>

    <!-- Loading -->
    <SkeletonLoader v-if="isLoading" />

    <!-- Game content -->
    <div v-else-if="pokemon" class="container">

      <GameTimer
        v-if="timerMode"
        :timeLeft="timeLeft"
        :total="15"
        :isRunning="timerRunning"
      />

      <h1 class="question">
        <span class="h1">¿Quién es este Pokémon?</span>
      </h1>

      <PokemonPicture :pokemon="pokemon" :showPokemon="showPokemon" />

      <div class="reveal-row" v-if="showPokemon">
        <PokemonTypeBadge v-for="t in pokemon.types" :key="t" :type="t" />
      </div>

      <!-- Hint display -->
      <div v-if="hintLetter && !showAnswer" class="hint-display">
        Empieza con <strong>{{ hintLetter }}</strong>
      </div>

      <PokemonOptions
        :pokemons="pokemonArr"
        :answered="showAnswer"
        :correctId="pokemon.id"
        :selectedId="lastSelectedId"
        @selection="handleSelection"
      />

      <!-- Answer message -->
      <Transition name="slide-up">
        <div v-if="showAnswer" class="answer-msg" :class="isCorrect ? 'msg-correct' : 'msg-wrong'">
          <span class="h2">{{ message }}</span>
        </div>
      </Transition>

      <!-- Action buttons row -->
      <div class="action-row">
        <button
          v-if="!showAnswer && !hintUsed"
          class="btn-hint"
          @click="onHint"
          title="Pierdes 1 punto de racha"
        >
          💡 Pista
        </button>
        <button
          v-if="showPokemon"
          class="btn-pokedex"
          @click="showPokedex = true"
        >
          📖 Pokédex
        </button>
        <button
          v-if="showAnswer && !perdio"
          @click="doNextPokemon"
          class="boton-new-game"
        >
          Siguiente →
        </button>
      </div>
    </div>

    <PokemonPokedex
      v-if="pokemon"
      :show="showPokedex"
      :pokemon="pokemon"
      @close="showPokedex = false"
    />

    <StatsDashboard :show="showStats" @close="showStats = false" />

    <GameOverScreen
      :show="perdio"
      :score="score"
      :bestStreak="bestStreak"
      :level="level"
      :highScore="highScore"
      :isNewRecord="isNewRecord"
      @restart="doNewGame"
      @exit="exitGame"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useGameState } from '@/composables/useGameState'
import { useSound } from '@/composables/useSound'
import { useTimer } from '@/composables/useTimer'
import { useStatistics } from '@/composables/useStatistics'
import { useHaptics } from '@/composables/useHaptics'

import PokemonPicture from '@/components/PokemonPicture.vue'
import PokemonOptions from '@/components/PokemonOptions.vue'
import PokemonTypeBadge from '@/components/PokemonTypeBadge.vue'
import PokemonPokedex from '@/components/PokemonPokedex.vue'
import StatsDashboard from '@/components/StatsDashboard.vue'
import GameOverScreen from '@/components/GameOverScreen.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import ConfettiCanvas from '@/components/ConfettiCanvas.vue'
import GameTimer from '@/components/GameTimer.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import LevelProgress from '@/components/LevelProgress.vue'
import AchievementToast from '@/components/AchievementToast.vue'

const props = defineProps({
  difficulty: { type: String, default: 'easy' },
  timerMode:  { type: Boolean, default: false },
})
const emit = defineEmits(['exit'])

const {
  score, streak, highScore, bestStreak, level, levelProgress,
  pokemonArr, pokemon, showPokemon, showAnswer,
  message, isCorrect, perdio, isLoading,
  showPokedex, showStats, lastSelectedId,
  hintUsed, hintLetter, lastBonus,
  loadPokemon, checkAnswer, newGame, nextPokemon,
  setDifficulty, setTimerMode, useHint,
} = useGameState()

const { soundEnabled, playCorrect, playWrong, playPokemonCry, toggleSound } = useSound()
const { recordCorrect, recordWrong, recordGame } = useStatistics()
const { timeLeft, isRunning: timerRunning, start: startTimer, stop: stopTimer } = useTimer(15)
const haptics = useHaptics()

const confettiRef = ref(null)
const scorePulse = ref(false)
const showBonus = ref(false)
const isNewRecord = ref(false)

function handleSelection(selectedId) {
  stopTimer()
  const opts = props.timerMode ? { timeLeft: timeLeft.value } : {}
  const prevHigh = highScore.value
  checkAnswer(selectedId, opts)

  if (isCorrect.value) {
    playCorrect()
    haptics.success()
    confettiRef.value?.trigger()
    recordCorrect(pokemon.value.id, streak.value)
    scorePulse.value = true
    setTimeout(() => { scorePulse.value = false }, 350)

    if (props.timerMode && lastBonus.value > 0) {
      showBonus.value = true
      setTimeout(() => { showBonus.value = false }, 1100)
    }

    if (pokemon.value.cryUrl) setTimeout(() => playPokemonCry(pokemon.value.cryUrl), 600)
  } else {
    playWrong()
    haptics.error()
    recordWrong()
    isNewRecord.value = score.value > 0 && score.value === highScore.value && score.value > prevHigh
  }
}

function onHint() {
  haptics.tap()
  useHint()
}

function onSoundToggle() {
  haptics.tap()
  toggleSound()
}

function doNewGame() {
  recordGame(score.value, level.value)
  isNewRecord.value = false
  newGame(props.difficulty)
  if (props.timerMode) startTimer(handleTimeout)
}

function doNextPokemon() {
  haptics.tap()
  nextPokemon()
  if (props.timerMode) startTimer(handleTimeout)
}

function handleTimeout() {
  if (!showAnswer.value) {
    checkAnswer(-1)
    playWrong()
    haptics.error()
    recordWrong()
  }
}

function exitGame() {
  recordGame(score.value, level.value)
  emit('exit')
}

onMounted(() => {
  setDifficulty(props.difficulty)
  setTimerMode(props.timerMode)
  loadPokemon().then(() => {
    if (props.timerMode) startTimer(handleTimeout)
  })
})

watch(() => props.difficulty, (d) => setDifficulty(d))
watch(() => props.timerMode,  (t) => setTimerMode(t))
</script>

<style scoped>
.game-page {
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(12px);
  flex-shrink: 0;
  gap: 8px;
  z-index: 10;
}

.top-left, .top-right {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.score-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  flex: 1;
  min-width: 0;
}

.score-pill, .streak-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 800;
  color: var(--text-primary);
  white-space: nowrap;
}

.streak-pill {
  background: linear-gradient(135deg, #f97316, #ef4444);
  color: white;
  border: none;
}

.score-val {
  display: inline-block;
  min-width: 14px;
  text-align: center;
}

.icon-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s, background 0.2s;
  color: var(--text-primary);
}
.icon-btn:hover { transform: scale(1.12); background: var(--bg-primary); }

.question { margin: 0; }

.reveal-row {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeIn 0.4s ease both;
}

.hint-display {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #78350f;
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  animation: slideUp 0.3s ease both;
}

[data-theme="dark"] .hint-display {
  background: linear-gradient(135deg, #78350f, #92400e);
  color: #fef3c7;
}

.answer-msg .h2 { display: inline-block; }
.msg-correct .h2 { border-left: 3px solid #4caf50; padding-left: 14px; }
.msg-wrong   .h2 { border-left: 3px solid #f44336; padding-left: 14px; }

.action-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-hint, .btn-pokedex {
  background: var(--bg-card);
  border: 1.5px solid var(--border-color);
  border-radius: 20px;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  color: var(--text-primary);
  backdrop-filter: blur(8px);
  transition: all 0.2s;
}
.btn-hint:hover   { border-color: #f59e0b; transform: scale(1.05); }
.btn-pokedex:hover{ border-color: #4caf50; transform: scale(1.05); }

.bonus-pop {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 56px;
  font-weight: 900;
  color: #fbbf24;
  text-shadow: 0 0 20px rgba(251,191,36,0.6), 0 4px 8px rgba(0,0,0,0.4);
  pointer-events: none;
  z-index: 50;
}

.bonus-enter-active, .bonus-leave-active { transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.bonus-enter-from { opacity: 0; transform: translate(-50%, 20px) scale(0.6); }
.bonus-leave-to   { opacity: 0; transform: translate(-50%, -120px) scale(1.4); }

.slide-up-enter-active { animation: slideUp 0.35s ease both; }
.slide-up-leave-active { animation: slideUp 0.25s ease reverse both; }

@media (max-width: 480px) {
  .score-row { gap: 4px; }
  .score-pill, .streak-pill { font-size: 12px; padding: 3px 8px; }
  .icon-btn { width: 32px; height: 32px; font-size: 16px; }
}
</style>
