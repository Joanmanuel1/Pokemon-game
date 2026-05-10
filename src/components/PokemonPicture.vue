<template>
  <div class="pokemon-stage">
    <!-- Glow halo -->
    <div class="halo" :class="{ 'halo-on': showPokemon }"></div>

    <!-- Flash burst on reveal -->
    <Transition name="flash">
      <div v-if="flashing" class="flash"></div>
    </Transition>

    <!-- Pokemon image -->
    <Transition name="poke" mode="out-in">
      <img
        :key="pokemon?.id || 'blank'"
        v-if="pokemon"
        :src="pokemon.sprite || fallbackSrc"
        class="pokemon-img"
        :class="{ silhouette: !showPokemon, revealed: showPokemon }"
        alt="pokemon"
        draggable="false"
        @load="onLoad"
      />
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  pokemon:     { type: Object, default: null },
  showPokemon: { type: Boolean, default: false },
})

const flashing = ref(false)

const fallbackSrc = computed(() =>
  props.pokemon
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${props.pokemon.id}.svg`
    : ''
)

watch(() => props.showPokemon, (v) => {
  if (v) {
    flashing.value = true
    setTimeout(() => { flashing.value = false }, 500)
  }
})

function onLoad() { /* loaded */ }
</script>

<style scoped>
.pokemon-stage {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  max-width: 220px;
  max-height: 38vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.halo {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 65%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.halo-on {
  opacity: 1;
  animation: pulseHalo 2s ease-in-out infinite;
}

@keyframes pulseHalo {
  0%, 100% { transform: scale(1);   opacity: 0.7; }
  50%      { transform: scale(1.08); opacity: 1; }
}

.pokemon-img {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
  filter: drop-shadow(0 6px 12px rgba(0,0,0,0.25));
  transition: filter 0.5s ease, transform 0.5s ease;
}

.silhouette {
  filter: brightness(0) drop-shadow(0 6px 12px rgba(0,0,0,0.4));
}

.revealed {
  animation: bounceReveal 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

@keyframes bounceReveal {
  0%   { transform: scale(0.85) rotate(-3deg); filter: brightness(2.5) drop-shadow(0 0 20px white); }
  40%  { transform: scale(1.1)  rotate(2deg);  filter: brightness(1.2) drop-shadow(0 6px 20px rgba(255,215,0,0.8)); }
  100% { transform: scale(1)    rotate(0);     filter: brightness(1)   drop-shadow(0 6px 12px rgba(0,0,0,0.25)); }
}

.flash {
  position: absolute;
  inset: -20%;
  background: radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,215,0,0.5) 30%, rgba(255,215,0,0) 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
}

.flash-enter-active { animation: flashBurst 0.5s ease-out forwards; }

@keyframes flashBurst {
  0%   { opacity: 0; transform: scale(0.4); }
  30%  { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0; transform: scale(1.6); }
}

.poke-enter-active, .poke-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.poke-enter-from { opacity: 0; transform: scale(0.85); }
.poke-leave-to   { opacity: 0; transform: scale(1.1);  }
</style>
