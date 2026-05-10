<template>
  <div class="lvl-wrap" :class="{ 'level-up': leveledUp }">
    <span class="lvl-num">Nv. {{ level }}</span>
    <div class="lvl-bar">
      <div class="lvl-fill" :style="{ width: (progress * 100) + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  level:    { type: Number, default: 1 },
  progress: { type: Number, default: 0 },
})

const leveledUp = ref(false)

watch(() => props.level, (n, o) => {
  if (n > o) {
    leveledUp.value = true
    setTimeout(() => { leveledUp.value = false }, 1200)
  }
})
</script>

<style scoped>
.lvl-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 4px 10px 4px 12px;
  backdrop-filter: blur(8px);
  transition: transform 0.3s;
}

.lvl-wrap.level-up { animation: pop 0.5s ease both; }

.lvl-num {
  font-size: 13px;
  font-weight: 800;
  color: var(--text-primary);
  white-space: nowrap;
}

.lvl-bar {
  width: 70px;
  height: 6px;
  background: var(--bg-primary);
  border-radius: 4px;
  overflow: hidden;
}

.lvl-fill {
  height: 100%;
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
  border-radius: 4px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
