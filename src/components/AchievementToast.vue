<template>
  <div class="toast-stack">
    <TransitionGroup name="toast">
      <div
        v-for="a in queue"
        :key="a.id"
        class="toast"
        @click="dismiss"
        @animationend="autoDismiss(a.id)"
      >
        <span class="toast-icon">{{ a.icon }}</span>
        <div class="toast-body">
          <span class="toast-label">¡Logro desbloqueado!</span>
          <span class="toast-title">{{ a.title }}</span>
          <span class="toast-desc">{{ a.desc }}</span>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useAchievements } from '@/composables/useAchievements'

const { queue, dismiss } = useAchievements()
const timers = new Map()

function autoDismiss() { /* no-op, handled by setTimeout below */ }

watch(queue, (q) => {
  q.forEach(a => {
    if (!timers.has(a.id)) {
      timers.set(a.id, setTimeout(() => {
        dismiss()
        timers.delete(a.id)
      }, 4000))
    }
  })
}, { deep: true })

onMounted(() => {})
</script>

<style scoped>
.toast-stack {
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 500;
  pointer-events: none;
  max-width: 320px;
}

.toast {
  pointer-events: auto;
  background: linear-gradient(135deg, #1e293b, #334155);
  color: white;
  border-radius: 14px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08) inset;
  cursor: pointer;
  border-left: 4px solid #ffd700;
  min-width: 240px;
  animation: shimmerGold 2s ease-in-out infinite;
}

@keyframes shimmerGold {
  0%, 100% { box-shadow: 0 10px 30px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08) inset, 0 0 0 0 rgba(255,215,0,0); }
  50%      { box-shadow: 0 10px 30px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08) inset, 0 0 0 8px rgba(255,215,0,0.08); }
}

.toast-icon {
  font-size: 28px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.toast-body { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.toast-label { font-size: 10px; color: #ffd700; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
.toast-title { font-size: 16px; font-weight: 800; }
.toast-desc  { font-size: 12px; opacity: 0.8; }

.toast-enter-active, .toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-enter-from { opacity: 0; transform: translateX(120%) scale(0.9); }
.toast-leave-to   { opacity: 0; transform: translateX(120%) scale(0.9); }
</style>
