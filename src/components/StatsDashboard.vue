<template>
  <Transition name="modal">
    <div class="modal-overlay" v-if="show" @click.self="$emit('close')">
      <div class="modal-panel">
        <button class="close-btn" @click="$emit('close')">✕</button>
        <h2 class="modal-title">Mis Estadísticas</h2>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-card-val">{{ stats.totalGames }}</span>
            <span class="stat-card-label">Partidas</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-val">{{ accuracy }}%</span>
            <span class="stat-card-label">Precisión</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-val">{{ highScore }}</span>
            <span class="stat-card-label">Récord</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-val">{{ stats.bestStreak }}</span>
            <span class="stat-card-label">Racha max.</span>
          </div>
        </div>

        <div class="section" v-if="recentHistory.length > 0">
          <h4 class="section-title">Últimas partidas</h4>
          <div class="bar-chart">
            <div
              class="bar-item"
              v-for="(game, i) in recentHistory"
              :key="i"
              :title="`Puntos: ${game.score}`"
            >
              <div
                class="bar-fill"
                :style="{ height: (game.score / maxScore * 100) + '%' }"
              ></div>
              <span class="bar-label">{{ game.score }}</span>
            </div>
          </div>
        </div>

        <div class="section empty" v-else>
          <p>Juega tu primera partida para ver estadísticas.</p>
        </div>

        <button class="btn-reset" @click="confirmReset">
          Reiniciar estadísticas
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useStatistics } from '@/composables/useStatistics'
import { useLocalStorage } from '@/composables/useLocalStorage'

defineProps({ show: { type: Boolean, default: false } })
defineEmits(['close'])

const { stats, accuracy, resetStats } = useStatistics()
const highScore = useLocalStorage('pkq_highScore', 0)

const recentHistory = computed(() => stats.value.history.slice(-10))
const maxScore = computed(() => Math.max(...recentHistory.value.map(g => g.score), 1))

function confirmReset() {
  if (confirm('¿Reiniciar todas las estadísticas?')) {
    resetStats()
    highScore.value = 0
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 300;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.modal-panel {
  background: var(--bg-card);
  width: min(480px, 100vw);
  max-height: 90vh;
  border-radius: 24px 24px 0 0;
  padding: 28px 24px 32px;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--text-primary);
}

.modal-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-primary);
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-card {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-card-val   { font-size: 28px; font-weight: 800; color: var(--text-primary); }
.stat-card-label { font-size: 12px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; }

.section-title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 100px;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  gap: 4px;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #4caf50, #8bc34a);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: height 0.4s ease;
}

.bar-label { font-size: 10px; color: var(--text-secondary); }

.empty { text-align: center; color: var(--text-secondary); }

.btn-reset {
  background: none;
  border: 1px solid #f44336;
  color: #f44336;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
  align-self: center;
  transition: all 0.2s;
}

.btn-reset:hover { background: #f44336; color: white; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.25s; }
.modal-enter-active .modal-panel, .modal-leave-active .modal-panel { transition: transform 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-panel, .modal-leave-to .modal-panel { transform: translateY(100%); }
</style>
