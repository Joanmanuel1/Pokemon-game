<template>
  <div class="stats-list">
    <div class="stat-row" v-for="stat in stats" :key="stat.name">
      <span class="stat-name">{{ statLabel(stat.name) }}</span>
      <div class="stat-bar-bg">
        <div
          class="stat-bar-fill"
          :style="{ width: (stat.value / 255 * 100) + '%', background: statColor(stat.value) }"
        ></div>
      </div>
      <span class="stat-val">{{ stat.value }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({ stats: { type: Array, required: true } })

const labels = {
  hp: 'PS', attack: 'Ataque', defense: 'Defensa',
  'special-attack': 'Atq. Esp.', 'special-defense': 'Def. Esp.', speed: 'Velocidad',
}

function statLabel(name) { return labels[name] || name }

function statColor(val) {
  if (val >= 90) return '#4caf50'
  if (val >= 50) return '#ffc107'
  return '#f44336'
}
</script>

<style scoped>
.stats-list { display: flex; flex-direction: column; gap: 8px; width: 100%; }

.stat-row {
  display: grid;
  grid-template-columns: 80px 1fr 36px;
  align-items: center;
  gap: 8px;
}

.stat-name { font-size: 12px; font-weight: 600; color: var(--text-secondary); text-align: right; }
.stat-val  { font-size: 13px; font-weight: 700; color: var(--text-primary); text-align: right; }

.stat-bar-bg {
  height: 8px;
  background: var(--bg-primary);
  border-radius: 4px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}
</style>
