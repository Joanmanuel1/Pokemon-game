<template>
  <Transition name="pokedex">
    <div class="pokedex-overlay" v-if="show" @click.self="$emit('close')">
      <div class="pokedex-panel">
        <button class="close-btn" @click="$emit('close')">✕</button>

        <div class="poke-header">
          <img :src="pokemon.sprite" :alt="pokemon.name" class="poke-sprite" />
          <div class="poke-meta">
            <span class="poke-id">#{{ String(pokemon.id).padStart(4, '0') }}</span>
            <h3 class="poke-name">{{ capitalize(pokemon.name) }}</h3>
            <div class="type-row">
              <PokemonTypeBadge v-for="t in pokemon.types" :key="t" :type="t" />
            </div>
          </div>
        </div>

        <div class="section">
          <h4 class="section-title">Habilidades</h4>
          <div class="abilities-row">
            <span class="ability-chip" v-for="a in pokemon.abilities" :key="a">
              {{ capitalize(a.replace('-', ' ')) }}
            </span>
          </div>
        </div>

        <div class="section">
          <h4 class="section-title">Estadísticas base</h4>
          <PokemonStats :stats="pokemon.stats" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import PokemonTypeBadge from './PokemonTypeBadge.vue'
import PokemonStats from './PokemonStats.vue'

defineProps({
  show:    { type: Boolean, default: false },
  pokemon: { type: Object, required: true },
})
defineEmits(['close'])

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
</script>

<style scoped>
.pokedex-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 200;
  display: flex;
  justify-content: flex-end;
}

.pokedex-panel {
  width: min(360px, 100vw);
  height: 100%;
  background: var(--bg-card);
  padding: 24px 20px;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--text-primary);
  line-height: 1;
}

.poke-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.poke-sprite {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.poke-meta { display: flex; flex-direction: column; gap: 6px; }
.poke-id   { font-size: 12px; color: var(--text-secondary); font-weight: 600; }
.poke-name { font-size: 22px; font-weight: 800; color: var(--text-primary); text-transform: capitalize; }
.type-row  { display: flex; gap: 6px; flex-wrap: wrap; }

.section-title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.abilities-row { display: flex; gap: 8px; flex-wrap: wrap; }

.ability-chip {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 4px 12px;
  font-size: 13px;
  color: var(--text-primary);
  text-transform: capitalize;
}

.pokedex-enter-active, .pokedex-leave-active { transition: opacity 0.25s, transform 0.25s; }
.pokedex-enter-from .pokedex-panel, .pokedex-leave-to .pokedex-panel { transform: translateX(100%); }
.pokedex-enter-from, .pokedex-leave-to { opacity: 0; }
</style>
