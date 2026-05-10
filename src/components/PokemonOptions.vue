<template>
  <div class="options-container">
    <button
      v-for="pokemon in pokemons"
      :key="pokemon.id"
      class="option-btn"
      :class="btnClass(pokemon.id)"
      :disabled="answered"
      @click="$emit('selection', pokemon.id)"
    >
      {{ capitalize(pokemon.name) }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  pokemons:   { type: Array,  required: true },
  answered:   { type: Boolean, default: false },
  correctId:  { type: Number,  default: null },
  selectedId: { type: Number,  default: null },
})

defineEmits(['selection'])

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function btnClass(id) {
  if (!props.answered) return ''
  if (id === props.correctId) return 'answer-correct'
  if (id === props.selectedId) return 'answer-wrong shake'
  return 'answer-dim'
}
</script>

<style scoped>
.options-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.option-btn {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1.5px solid var(--border-color);
  border-radius: 24px;
  padding: 12px 20px;
  width: 270px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-transform: capitalize;
  transition: all 0.15s ease;
}

.option-btn:hover:not(:disabled) {
  transform: scale(1.03);
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
  border-color: #4caf50;
}

.option-btn:disabled { cursor: default; }

.answer-correct {
  background: #4caf50 !important;
  color: white !important;
  border-color: #2e7d32 !important;
  box-shadow: 0 0 0 4px rgba(76,175,80,0.3);
}

.answer-wrong {
  background: #f44336 !important;
  color: white !important;
  border-color: #c62828 !important;
}

.answer-dim { opacity: 0.45; }
</style>
