<template>
  <div class="timer-wrap" v-if="isRunning || timeLeft > 0">
    <svg :width="size" :height="size" class="timer-svg">
      <circle
        :cx="size/2" :cy="size/2" :r="radius"
        fill="none" stroke="var(--bg-card)" :stroke-width="stroke"
      />
      <circle
        :cx="size/2" :cy="size/2" :r="radius"
        fill="none" :stroke="ringColor" :stroke-width="stroke"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        transform="rotate(-90, 32, 32)"
        style="transition: stroke-dashoffset 0.9s linear, stroke 0.5s;"
      />
    </svg>
    <span class="timer-text" :style="{ color: ringColor }">{{ timeLeft }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  timeLeft: { type: Number, default: 15 },
  total:    { type: Number, default: 15 },
  isRunning:{ type: Boolean, default: false },
})

const size = 64
const stroke = 6
const radius = (size - stroke) / 2
const circumference = 2 * Math.PI * radius

const dashOffset = computed(() =>
  circumference * (1 - props.timeLeft / props.total)
)

const ringColor = computed(() => {
  const pct = props.timeLeft / props.total
  if (pct > 0.5) return '#4caf50'
  if (pct > 0.25) return '#ffc107'
  return '#f44336'
})
</script>

<style scoped>
.timer-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.timer-svg { display: block; }

.timer-text {
  position: absolute;
  font-size: 18px;
  font-weight: 700;
}
</style>
