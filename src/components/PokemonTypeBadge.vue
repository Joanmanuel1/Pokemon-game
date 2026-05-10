<template>
  <span class="type-badge" :style="{ background: color }">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'
import { typeColors, typeLabels } from '@/helpers/pokemonTypes'

const props = defineProps({ type: { type: String, required: true } })
const color = computed(() => typeColors[props.type] || '#A8A878')
const label = computed(() => typeLabels[props.type] || props.type)
</script>

<style scoped>
.type-badge {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 12px;
  color: white;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.25));
}
</style>
