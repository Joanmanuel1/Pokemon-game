<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-panel">
        <button class="close-btn" @click="$emit('close')">✕</button>

        <div class="panel-header">
          <div class="login-streak">
            <span class="streak-fire">🔥</span>
            <div>
              <div class="streak-num">{{ loginStreak }} días</div>
              <div class="streak-label">racha de login</div>
            </div>
          </div>
          <div class="coins-display">
            <span>🪙</span>
            <span class="coins-num">{{ coins }}</span>
          </div>
        </div>

        <h3 class="panel-title">Misiones de hoy</h3>

        <div class="missions-list">
          <div
            v-for="m in missions"
            :key="m.id"
            class="mission-card"
            :class="{ done: m.done, claimed: m.claimed }"
          >
            <div class="mission-top">
              <span class="mission-desc">{{ m.desc }}</span>
              <span class="mission-reward">+{{ m.reward }} 🪙</span>
            </div>
            <div class="mission-progress-row">
              <div class="mission-bar-bg">
                <div
                  class="mission-bar-fill"
                  :style="{ width: (m.progress / m.target * 100) + '%' }"
                ></div>
              </div>
              <span class="mission-count">{{ m.progress }}/{{ m.target }}</span>
            </div>
            <button
              v-if="m.done && !m.claimed"
              class="claim-btn"
              @click="claimReward(m.id)"
            >
              Reclamar +{{ m.reward }} 🪙
            </button>
            <span v-else-if="m.claimed" class="claimed-tag">✅ Reclamado</span>
          </div>
        </div>

        <p class="reset-note">Las misiones se renuevan a medianoche</p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useDailyMissions } from '@/composables/useDailyMissions'

defineProps({ show: { type: Boolean, default: false } })
defineEmits(['close'])

const { coins, loginStreak, missions, claimReward } = useDailyMissions()
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 300;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.modal-panel {
  background: var(--bg-card-solid);
  width: min(500px, 100vw);
  max-height: 85vh;
  border-radius: 24px 24px 0 0;
  padding: 24px 20px 32px;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: var(--text-secondary);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.login-streak {
  display: flex;
  align-items: center;
  gap: 10px;
}
.streak-fire { font-size: 28px; }
.streak-num  { font-size: 20px; font-weight: 900; color: var(--text-primary); }
.streak-label { font-size: 11px; color: var(--text-secondary); font-weight: 600; }

.coins-display {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 6px 14px;
  font-size: 14px;
}
.coins-num { font-weight: 900; font-size: 18px; color: var(--text-primary); }

.panel-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
}

.missions-list { display: flex; flex-direction: column; gap: 10px; }

.mission-card {
  background: var(--bg-primary);
  border: 1.5px solid var(--border-color);
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.2s;
}
.mission-card.done:not(.claimed) { border-color: #fbbf24; }
.mission-card.claimed { opacity: 0.6; }

.mission-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.mission-desc   { font-size: 14px; font-weight: 600; color: var(--text-primary); flex: 1; }
.mission-reward { font-size: 13px; font-weight: 700; color: #f59e0b; white-space: nowrap; }

.mission-progress-row { display: flex; align-items: center; gap: 8px; }
.mission-bar-bg { flex: 1; height: 8px; background: var(--bg-card); border-radius: 4px; overflow: hidden; }
.mission-bar-fill { height: 100%; background: linear-gradient(90deg, #4caf50, #8bc34a); border-radius: 4px; transition: width 0.4s ease; }
.mission-count { font-size: 12px; font-weight: 700; color: var(--text-secondary); white-space: nowrap; }

.claim-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  align-self: flex-start;
  transition: transform 0.15s;
}
.claim-btn:hover { transform: scale(1.04); }

.claimed-tag { font-size: 13px; color: #4caf50; font-weight: 700; }

.reset-note { font-size: 12px; color: var(--text-secondary); text-align: center; margin: 0; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.25s; }
.modal-enter-active .modal-panel, .modal-leave-active .modal-panel { transition: transform 0.3s ease; }
.modal-enter-from { opacity: 0; }
.modal-leave-to   { opacity: 0; }
.modal-enter-from .modal-panel, .modal-leave-to .modal-panel { transform: translateY(100%); }
</style>
