<template>
  <Transition name="evol">
    <div v-if="show" class="evol-overlay" @click.self="$emit('skip')">
      <div class="evol-card">
        <div class="evol-header">
          <span class="evol-badge">🦋 EVOLUCIÓN</span>
          <span class="evol-bonus">+3 pts</span>
        </div>

        <p class="evol-question">
          ¿Cuál es la evolución de <strong>{{ capitalize(pokemonName) }}</strong>?
        </p>

        <div class="evol-options">
          <button
            v-for="opt in options"
            :key="opt.id"
            class="evol-btn"
            :class="answered ? btnClass(opt.id) : ''"
            :disabled="answered"
            @click="select(opt.id)"
          >
            <img :src="opt.sprite" :alt="opt.name" class="evol-sprite" />
            <span>{{ capitalize(opt.name) }}</span>
          </button>
        </div>

        <Transition name="fade">
          <p v-if="resultMsg" class="evol-result" :class="resultOk ? 'result-ok' : 'result-fail'">
            {{ resultMsg }}
          </p>
        </Transition>

        <button v-if="!answered" class="evol-skip" @click="$emit('skip')">
          Saltar →
        </button>
        <button v-else class="evol-continue boton-new-game" @click="$emit('done', resultOk)">
          Continuar →
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  show:        { type: Boolean, default: false },
  pokemonName: { type: String,  default: '' },
  options:     { type: Array,   default: () => [] }, // [{ id, name, sprite }]
  correctId:   { type: Number,  default: null },
})

const emit = defineEmits(['skip', 'done'])

const answered  = ref(false)
const resultMsg = ref('')
const resultOk  = ref(false)
const selectedId = ref(null)

function select(id) {
  answered.value  = true
  selectedId.value = id
  resultOk.value  = id === props.correctId
  resultMsg.value = resultOk.value
    ? `¡Correcto! Es ${capitalize(props.options.find(o => o.id === props.correctId)?.name || '')} (+3 pts)`
    : `Era ${capitalize(props.options.find(o => o.id === props.correctId)?.name || '')}`
}

function btnClass(id) {
  if (id === props.correctId)  return 'evol-correct'
  if (id === selectedId.value) return 'evol-wrong'
  return 'evol-dim'
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
}
</script>

<style scoped>
.evol-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(6px);
  z-index: 350;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.evol-card {
  background: var(--bg-card-solid);
  border-radius: 20px;
  padding: 22px 20px;
  max-width: 360px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  border: 2px solid rgba(168, 85, 247, 0.4);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.evol-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.evol-badge {
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.evol-bonus {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 800;
}

.evol-question {
  font-size: 16px;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
}

.evol-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.evol-btn {
  background: var(--bg-primary);
  border: 1.5px solid var(--border-color);
  border-radius: 12px;
  padding: 10px 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  transition: all 0.15s;
  text-transform: capitalize;
}
.evol-btn:hover:not(:disabled) { transform: scale(1.04); border-color: #7c3aed; }
.evol-btn:disabled { cursor: default; }

.evol-sprite { width: 56px; height: 56px; object-fit: contain; }

.evol-correct { background: #4caf50 !important; color: white !important; border-color: #2e7d32 !important; }
.evol-wrong   { background: #f44336 !important; color: white !important; border-color: #c62828 !important; }
.evol-dim     { opacity: 0.4; }

.evol-result {
  font-size: 15px;
  font-weight: 700;
  padding: 8px 12px;
  border-radius: 10px;
  margin: 0;
}
.result-ok   { background: rgba(76,175,80,0.15);  color: #4caf50; }
.result-fail { background: rgba(244,67,54,0.12);  color: #f44336; }

.evol-skip {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
}
.evol-skip:hover { color: var(--text-primary); }

.evol-enter-active, .evol-leave-active { transition: opacity 0.3s; }
.evol-enter-active .evol-card, .evol-leave-active .evol-card { transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.evol-enter-from { opacity: 0; }
.evol-leave-to   { opacity: 0; }
.evol-enter-from .evol-card { transform: scale(0.75); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
