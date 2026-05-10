<template>
  <Transition name="gameover">
    <div v-if="show" class="gameover-overlay">
      <div class="gameover-card">
        <div class="trophy-icon">{{ isNewRecord ? '🏆' : '💔' }}</div>
        <h2 class="gameover-title">{{ isNewRecord ? '¡Nuevo récord!' : 'Game Over' }}</h2>

        <div class="result-grid">
          <div class="result-cell">
            <span class="result-val">{{ score }}</span>
            <span class="result-label">Puntos</span>
          </div>
          <div class="result-cell">
            <span class="result-val">{{ bestStreak }}</span>
            <span class="result-label">Mejor racha</span>
          </div>
          <div class="result-cell">
            <span class="result-val">{{ level }}</span>
            <span class="result-label">Nivel</span>
          </div>
          <div class="result-cell">
            <span class="result-val">{{ highScore }}</span>
            <span class="result-label">Récord</span>
          </div>
        </div>

        <div class="actions">
          <button class="btn-primary" @click="$emit('restart')">
            Jugar de nuevo
          </button>
          <button class="btn-ghost" @click="$emit('exit')">
            Cambiar dificultad
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show:       { type: Boolean, default: false },
  score:      { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },
  level:      { type: Number, default: 1 },
  highScore:  { type: Number, default: 0 },
  isNewRecord:{ type: Boolean, default: false },
})

defineEmits(['restart', 'exit'])
</script>

<style scoped>
.gameover-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(6px);
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.gameover-card {
  background: var(--bg-card-solid);
  color: var(--text-primary);
  border-radius: 24px;
  padding: 32px 28px;
  max-width: 380px;
  width: 100%;
  text-align: center;
  box-shadow: 0 25px 50px rgba(0,0,0,0.4);
  border: 1px solid var(--border-color);
}

.trophy-icon {
  font-size: 56px;
  margin-bottom: 8px;
  animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

.gameover-title {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 20px 0;
}

.result-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 24px;
}

.result-cell {
  background: var(--bg-primary);
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.result-val {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-primary);
}

.result-label {
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-primary {
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  color: white;
  border: none;
  border-radius: 14px;
  padding: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(76,175,80,0.4);
  transition: transform 0.15s;
}
.btn-primary:hover { transform: translateY(-2px); }

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.btn-ghost:hover { background: var(--bg-primary); }

.gameover-enter-active, .gameover-leave-active { transition: opacity 0.3s; }
.gameover-enter-active .gameover-card, .gameover-leave-active .gameover-card {
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.gameover-enter-from { opacity: 0; }
.gameover-leave-to   { opacity: 0; }
.gameover-enter-from .gameover-card { transform: scale(0.7); }
.gameover-leave-to   .gameover-card { transform: scale(0.9); }
</style>
