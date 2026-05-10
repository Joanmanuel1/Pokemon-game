<template>
  <div class="pokedex-page">
    <!-- Header -->
    <header class="dex-header">
      <button class="back-btn" @click="$emit('back')">← Volver</button>
      <div class="dex-title">
        <span class="pokeball-icon">⬤</span>
        Mi Pokédex
      </div>
      <div class="capture-count">
        <span class="count-num">{{ totalCaptured }}</span>
        <span class="count-sep">/</span>
        <span class="count-total">{{ TOTAL }}</span>
      </div>
    </header>

    <!-- Progress bar total -->
    <div class="global-progress">
      <div class="global-bar" :style="{ width: (totalCaptured / TOTAL * 100) + '%' }"></div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <div class="filter-row">
        <!-- Gen filter -->
        <div class="filter-group">
          <button
            class="filter-btn"
            :class="{ active: genFilter === null }"
            @click="genFilter = null"
          >Todas</button>
          <button
            v-for="g in GEN_RANGES"
            :key="g.gen"
            class="filter-btn"
            :class="{ active: genFilter === g.gen }"
            @click="genFilter = g.gen"
          >Gen {{ g.gen }}</button>
        </div>
      </div>
      <div class="filter-row">
        <!-- Status filter -->
        <button
          v-for="s in statusOptions"
          :key="s.value"
          class="filter-btn"
          :class="{ active: statusFilter === s.value }"
          @click="statusFilter = s.value"
        >{{ s.label }}</button>

        <!-- Search -->
        <input
          v-model="search"
          class="search-input"
          placeholder="Buscar..."
          type="text"
        />
      </div>
    </div>

    <!-- Gen summary bars -->
    <div class="gen-summary" v-if="genFilter === null">
      <div class="gen-bar-row" v-for="g in GEN_RANGES" :key="g.gen">
        <span class="gen-label">Gen {{ g.gen }}</span>
        <div class="gen-bar-bg">
          <div
            class="gen-bar-fill"
            :style="{ width: (capturedInGen(g.gen) / totalInGen(g.gen) * 100) + '%' }"
          ></div>
        </div>
        <span class="gen-count">{{ capturedInGen(g.gen) }}/{{ totalInGen(g.gen) }}</span>
      </div>
    </div>

    <!-- Pokemon grid -->
    <div class="dex-grid" ref="gridEl">
      <div
        v-for="id in filteredIds"
        :key="id"
        class="dex-card"
        :class="{ captured: hasCaptured(id), unknown: !hasCaptured(id) }"
        @click="hasCaptured(id) && openDetail(id)"
      >
        <template v-if="hasCaptured(id) && cachedPokemon[id]">
          <img
            :src="cachedPokemon[id].sprite"
            :alt="cachedPokemon[id].name"
            class="dex-sprite"
            loading="lazy"
          />
          <span class="dex-id">#{{ String(id).padStart(3, '0') }}</span>
          <span class="dex-name">{{ capitalize(cachedPokemon[id].name) }}</span>
          <div class="dex-types">
            <span
              v-for="t in cachedPokemon[id].types"
              :key="t"
              class="mini-type"
              :style="{ background: typeColors[t] }"
            >{{ t }}</span>
          </div>
        </template>
        <template v-else-if="hasCaptured(id)">
          <!-- Captured but not in cache yet — show ID -->
          <div class="dex-silhouette">?</div>
          <span class="dex-id">#{{ String(id).padStart(3, '0') }}</span>
        </template>
        <template v-else>
          <div class="dex-silhouette">
            <div class="mystery-ball"></div>
          </div>
          <span class="dex-id">#???</span>
          <span class="dex-name unknown-name">?????</span>
        </template>
      </div>

      <div v-if="filteredIds.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>No se encontraron Pokémon</p>
        <p v-if="statusFilter === 'captured'" class="empty-hint">¡Juega para capturar Pokémon!</p>
      </div>
    </div>

    <!-- Detail modal -->
    <Transition name="detail">
      <div v-if="selectedPokemon" class="detail-overlay" @click.self="selectedPokemon = null">
        <div class="detail-card">
          <button class="detail-close" @click="selectedPokemon = null">✕</button>
          <img :src="selectedPokemon.sprite" :alt="selectedPokemon.name" class="detail-sprite" />
          <div class="detail-id">#{{ String(selectedPokemon.id).padStart(4, '0') }}</div>
          <div class="detail-name">{{ capitalize(selectedPokemon.name) }}</div>
          <div class="detail-types">
            <span
              v-for="t in selectedPokemon.types"
              :key="t"
              class="type-badge-large"
              :style="{ background: typeColors[t] }"
            >{{ typeLabels[t] || t }}</span>
          </div>
          <div class="detail-stats">
            <div class="stat-row" v-for="s in selectedPokemon.stats" :key="s.name">
              <span class="stat-name">{{ statLabel(s.name) }}</span>
              <div class="stat-bar-bg">
                <div
                  class="stat-bar-fill"
                  :style="{ width: (s.value / 255 * 100) + '%', background: statColor(s.value) }"
                ></div>
              </div>
              <span class="stat-val">{{ s.value }}</span>
            </div>
          </div>
          <div class="detail-abilities">
            <span class="abilities-label">Habilidades:</span>
            <span class="ability-chip" v-for="a in selectedPokemon.abilities" :key="a">
              {{ capitalize(a.replace('-', ' ')) }}
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePokedex } from '@/composables/usePokedex'
import { typeColors, typeLabels } from '@/helpers/pokemonTypes'

defineEmits(['back'])

const { captured, capturedSet, totalCaptured, TOTAL, GEN_RANGES, hasCaptured, capturedInGen, totalInGen } = usePokedex()

const genFilter    = ref(null)
const statusFilter = ref('all')
const search       = ref('')
const selectedPokemon = ref(null)

const statusOptions = [
  { value: 'all',      label: 'Todos' },
  { value: 'captured', label: '✅ Capturados' },
  { value: 'missing',  label: '❓ Sin capturar' },
]

// All IDs 1-905
const allIds = Array.from({ length: TOTAL }, (_, i) => i + 1)

const filteredIds = computed(() => {
  let ids = allIds

  if (genFilter.value !== null) {
    const range = GEN_RANGES.find(r => r.gen === genFilter.value)
    if (range) ids = ids.filter(id => id >= range.min && id <= range.max)
  }

  if (statusFilter.value === 'captured') ids = ids.filter(id => hasCaptured(id))
  if (statusFilter.value === 'missing')  ids = ids.filter(id => !hasCaptured(id))

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    ids = ids.filter(id => {
      const p = cachedPokemon.value[id]
      return p && p.name.includes(q)
    })
  }

  return ids
})

// Read cached pokemon from localStorage
const cachedPokemon = computed(() => {
  const map = {}
  captured.value.forEach(id => {
    const raw = localStorage.getItem(`pkq_poke_${id}`)
    if (raw) {
      try { map[id] = JSON.parse(raw) } catch (_) {}
    }
  })
  return map
})

function openDetail(id) {
  selectedPokemon.value = cachedPokemon.value[id] || null
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
}

const statLabels = { hp: 'PS', attack: 'Ataque', defense: 'Defensa', 'special-attack': 'Atq.Esp', 'special-defense': 'Def.Esp', speed: 'Vel.' }
function statLabel(n) { return statLabels[n] || n }
function statColor(v) { return v >= 90 ? '#4caf50' : v >= 50 ? '#ffc107' : '#f44336' }
</script>

<style scoped>
.pokedex-page {
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  overflow: hidden;
}

/* Header */
.dex-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(12px);
  flex-shrink: 0;
  gap: 8px;
}

.back-btn {
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  white-space: nowrap;
}
.back-btn:hover { background: var(--bg-primary); }

.dex-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.pokeball-icon {
  color: #ef4444;
  font-size: 20px;
  animation: pulse 2s infinite;
}

.capture-count {
  display: flex;
  align-items: baseline;
  gap: 2px;
  background: var(--bg-primary);
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  white-space: nowrap;
}
.count-num   { font-size: 18px; font-weight: 900; color: #4caf50; }
.count-sep   { font-size: 14px; color: var(--text-secondary); }
.count-total { font-size: 13px; font-weight: 700; color: var(--text-secondary); }

/* Global progress */
.global-progress {
  height: 4px;
  background: var(--bg-card);
  flex-shrink: 0;
}
.global-bar {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.5s ease;
}

/* Filters */
.filters {
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.filter-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-btn {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.15s;
}
.filter-btn.active {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}
.filter-btn:hover:not(.active) { border-color: #ef4444; color: var(--text-primary); }

.search-input {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 4px 14px;
  font-size: 13px;
  color: var(--text-primary);
  outline: none;
  flex: 1;
  min-width: 80px;
  max-width: 200px;
}
.search-input:focus { border-color: #4caf50; }

/* Gen summary */
.gen-summary {
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}
.gen-bar-row { display: flex; align-items: center; gap: 8px; }
.gen-label   { font-size: 11px; font-weight: 700; color: var(--text-secondary); width: 36px; }
.gen-bar-bg  { flex: 1; height: 6px; background: var(--bg-primary); border-radius: 3px; overflow: hidden; }
.gen-bar-fill { height: 100%; background: linear-gradient(90deg, #ef4444, #f97316); border-radius: 3px; transition: width 0.4s; }
.gen-count   { font-size: 11px; font-weight: 700; color: var(--text-secondary); width: 44px; text-align: right; }

/* Grid */
.dex-grid {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 8px;
  align-content: start;
}

.dex-card {
  background: var(--bg-card);
  border: 1.5px solid var(--border-color);
  border-radius: 12px;
  padding: 8px 4px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;
  transition: all 0.2s;
  min-height: 110px;
  position: relative;
}

.dex-card.captured {
  cursor: pointer;
  border-color: rgba(76, 175, 80, 0.35);
}
.dex-card.captured:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  border-color: #4caf50;
}

.dex-card.unknown {
  opacity: 0.6;
  background: var(--bg-primary);
}

.dex-sprite {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.dex-silhouette {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mystery-ball {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ccc 50%, #999 50%);
  border: 2px solid #999;
}

.dex-id   { font-size: 9px; color: var(--text-secondary); font-weight: 700; }
.dex-name { font-size: 10px; font-weight: 700; color: var(--text-primary); text-transform: capitalize; line-height: 1.2; }
.unknown-name { color: var(--text-secondary); }

.dex-types {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  justify-content: center;
}
.mini-type {
  font-size: 8px;
  font-weight: 700;
  color: white;
  padding: 1px 5px;
  border-radius: 6px;
  text-transform: capitalize;
}

/* Empty state */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}
.empty-icon { font-size: 48px; margin-bottom: 12px; }
.empty-hint { font-size: 13px; margin-top: 8px; opacity: 0.7; }

/* Detail modal */
.detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(6px);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.detail-card {
  background: var(--bg-card-solid);
  border-radius: 20px;
  padding: 24px 20px;
  max-width: 320px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
}

.detail-close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: var(--text-secondary);
}

.detail-sprite {
  width: 120px;
  height: 120px;
  object-fit: contain;
  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.2));
}

.detail-id   { font-size: 12px; color: var(--text-secondary); font-weight: 700; margin-top: 4px; }
.detail-name { font-size: 22px; font-weight: 800; color: var(--text-primary); text-transform: capitalize; margin: 4px 0; }

.detail-types { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 14px; }
.type-badge-large {
  padding: 4px 14px;
  border-radius: 12px;
  color: white;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
}

.detail-stats { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; text-align: left; }
.stat-row { display: grid; grid-template-columns: 60px 1fr 30px; align-items: center; gap: 6px; }
.stat-name { font-size: 11px; font-weight: 700; color: var(--text-secondary); text-align: right; }
.stat-bar-bg { height: 7px; background: var(--bg-primary); border-radius: 4px; overflow: hidden; }
.stat-bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
.stat-val { font-size: 12px; font-weight: 800; color: var(--text-primary); text-align: right; }

.detail-abilities { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; align-items: center; }
.abilities-label { font-size: 11px; font-weight: 700; color: var(--text-secondary); width: 100%; text-align: center; margin-bottom: 2px; }
.ability-chip {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 3px 10px;
  font-size: 12px;
  color: var(--text-primary);
  text-transform: capitalize;
}

.detail-enter-active, .detail-leave-active { transition: opacity 0.25s; }
.detail-enter-active .detail-card, .detail-leave-active .detail-card { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.detail-enter-from { opacity: 0; }
.detail-leave-to { opacity: 0; }
.detail-enter-from .detail-card { transform: scale(0.8); }
.detail-leave-to .detail-card { transform: scale(0.9); }

@media (max-width: 400px) {
  .dex-grid { grid-template-columns: repeat(auto-fill, minmax(76px, 1fr)); gap: 6px; }
  .dex-sprite { width: 50px; height: 50px; }
}
</style>
