<template>
  <div class="start-page">
    <div class="start-content">
      <div class="logo-wrap float">
        <img src="@/assets/titulo.png" alt="Pokemon Game" class="start-logo" />
      </div>

      <div class="badges-row">
        <div class="badge-pill" v-if="highScore > 0">
          <span>🏆</span>
          <span>Récord: <strong>{{ highScore }}</strong></span>
        </div>
        <div class="badge-pill coins-pill">
          <span>🪙</span>
          <span><strong>{{ coins }}</strong></span>
        </div>
        <div class="badge-pill pokedex-pill" @click="$emit('pokedex')">
          <span>📖</span>
          <span>Pokédex <strong>{{ totalCaptured }}/905</strong></span>
        </div>
        <div class="badge-pill missions-pill" @click="showMissions = true">
          <span>📅</span>
          <span>Misiones</span>
          <span v-if="hasPendingRewards" class="missions-badge">!</span>
        </div>
      </div>

      <h2 class="select-title">Elige tu desafío</h2>

      <div class="difficulty-grid">
        <button
          v-for="d in difficulties"
          :key="d.id"
          class="diff-card"
          :class="[`diff-${d.id}`, { selected: selectedDiff === d.id }]"
          @click="selectedDiff = d.id"
        >
          <span class="diff-icon">{{ d.icon }}</span>
          <span class="diff-name">{{ d.name }}</span>
          <span class="diff-desc">{{ d.desc }}</span>
        </button>
      </div>

      <label class="toggle-label">
        <input type="checkbox" v-model="timerEnabled" />
        <span class="toggle-slider"></span>
        <span class="toggle-text">⏱ Modo contrarreloj</span>
      </label>

      <button class="btn-start" @click="start">
        ¡Jugar!
      </button>

      <div class="theme-row">
        <ThemeToggle />
      </div>
    </div>

    <DailyMissions :show="showMissions" @close="showMissions = false" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { useStatistics } from '@/composables/useStatistics'
import { usePokedex } from '@/composables/usePokedex'
import { useDailyMissions } from '@/composables/useDailyMissions'
import ThemeToggle from '@/components/ThemeToggle.vue'
import DailyMissions from '@/components/DailyMissions.vue'

const emit = defineEmits(['start', 'pokedex'])

const highScore = useLocalStorage('pkq_highScore', 0)
const { stats } = useStatistics()
const totalGames = computed(() => stats.value.totalGames)
const { totalCaptured } = usePokedex()
const { coins, hasPendingRewards } = useDailyMissions()
const showMissions = ref(false)

const selectedDiff = ref('easy')
const timerEnabled = ref(false)

const difficulties = [
  { id: 'easy',      icon: '🌱', name: 'Fácil',      desc: 'Gen 1' },
  { id: 'medium',    icon: '⚡', name: 'Medio',      desc: 'Gen 1-4' },
  { id: 'hard',      icon: '🔥', name: 'Difícil',    desc: 'Todas' },
  { id: 'legendary', icon: '✨', name: 'Legendario', desc: 'Solo legendarios' },
]

function start() {
  emit('start', { difficulty: selectedDiff.value, timerMode: timerEnabled.value })
}
</script>

<style scoped>
.start-page {
  height: 100vh;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow: hidden;
}

.start-content {
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(10px, 1.8vh, 18px);
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: 28px;
  padding: clamp(18px, 3vh, 28px) 24px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  max-height: 100%;
  overflow-y: auto;
}

.logo-wrap { display: flex; justify-content: center; }

.start-logo {
  max-width: 220px;
  width: 80%;
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.25));
}

.badges-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.badge-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 13px;
  color: var(--text-primary);
}

.pokedex-pill {
  cursor: pointer;
  border-color: #ef4444;
  transition: all 0.2s;
}
.pokedex-pill:hover {
  background: rgba(239, 68, 68, 0.08);
  transform: scale(1.05);
}

.coins-pill { border-color: #f59e0b; }

.missions-pill {
  cursor: pointer;
  border-color: #8b5cf6;
  transition: all 0.2s;
  position: relative;
}
.missions-pill:hover {
  background: rgba(139, 92, 246, 0.08);
  transform: scale(1.05);
}

.missions-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 900;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-title {
  color: var(--text-primary);
  font-size: clamp(15px, 2.4vw, 18px);
  font-weight: 700;
  margin: 0;
}

.difficulty-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
}

.diff-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 8px;
  border-radius: 14px;
  border: 2px solid transparent;
  background: var(--bg-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-primary);
  position: relative;
  overflow: hidden;
}

.diff-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
}

.diff-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
.diff-card.selected { border-color: #4caf50; box-shadow: 0 0 0 3px rgba(76,175,80,0.25); }

.diff-easy::before      { background: #78C850; }
.diff-medium::before    { background: #F8D030; }
.diff-hard::before      { background: #F08030; }
.diff-legendary::before { background: linear-gradient(90deg, #7038F8, #F85888); }

.diff-icon { font-size: 24px; }
.diff-name { font-weight: 700; font-size: 14px; }
.diff-desc { font-size: 11px; opacity: 0.65; }

.toggle-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 14px;
}

.toggle-label input { display: none; }

.toggle-slider {
  width: 42px;
  height: 22px;
  background: var(--border-color);
  border-radius: 11px;
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;
}

.toggle-slider::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.toggle-label input:checked + .toggle-slider { background: #4caf50; }
.toggle-label input:checked + .toggle-slider::after { transform: translateX(20px); }

.btn-start {
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 13px 48px;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
  box-shadow: 0 6px 20px rgba(76,175,80,0.45);
  position: relative;
  overflow: hidden;
}

.btn-start::after {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shine 3s ease-in-out infinite;
}

@keyframes shine {
  0%, 100% { left: -100%; }
  50%      { left: 100%; }
}

.btn-start:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(76,175,80,0.6);
}

.btn-start:active { transform: translateY(0); }

.theme-row { margin-top: -4px; }

@media (max-height: 700px) {
  .start-content { gap: 8px; padding: 14px 18px; }
  .start-logo { max-width: 160px; }
  .diff-icon { font-size: 20px; }
  .btn-start { padding: 11px 36px; font-size: 16px; }
}
</style>
