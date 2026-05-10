<template>
  <Transition name="combo">
    <div
      v-if="comboCount >= 2"
      class="combo-bar"
      :style="{ background: bgGradient }"
    >
      <span class="combo-type-icon">{{ typeIcon }}</span>
      <span class="combo-text">
        Cadena {{ typeLabel }} ×{{ comboCount }}
      </span>
      <span class="combo-mult">×{{ multiplierText }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { typeColors, typeLabels } from '@/helpers/pokemonTypes'

const props = defineProps({
  comboType:       { type: String, default: null },
  comboCount:      { type: Number, default: 0 },
  comboMultiplier: { type: Number, default: 1 },
})

const typeIcons = {
  fire: '🔥', water: '💧', grass: '🌿', electric: '⚡',
  ice: '❄️', fighting: '🥊', poison: '☠️', ground: '🌍',
  flying: '🕊️', psychic: '🔮', bug: '🐛', rock: '🪨',
  ghost: '👻', dragon: '🐉', dark: '🌑', steel: '⚙️',
  fairy: '🧚', normal: '⭕',
}

const color = computed(() => typeColors[props.comboType] || '#888')
const bgGradient = computed(() => `linear-gradient(90deg, ${color.value}dd, ${color.value}99)`)
const typeLabel = computed(() => typeLabels[props.comboType] || props.comboType || '')
const typeIcon  = computed(() => typeIcons[props.comboType] || '🔗')
const multiplierText = computed(() => props.comboMultiplier === 1 ? '1' : props.comboMultiplier.toFixed(1).replace('.0', ''))
</script>

<style scoped>
.combo-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 16px;
  color: white;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  flex-shrink: 0;
}

.combo-type-icon { font-size: 16px; }
.combo-mult {
  background: rgba(255,255,255,0.25);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 900;
}

.combo-enter-active, .combo-leave-active { transition: all 0.3s ease; }
.combo-enter-from { opacity: 0; transform: translateY(-8px); }
.combo-leave-to   { opacity: 0; transform: translateY(-8px); }
</style>
