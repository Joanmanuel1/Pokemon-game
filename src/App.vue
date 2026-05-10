<template>
  <Transition name="page" mode="out-in">
    <StartPage  v-if="screen === 'start'"   key="start"   @start="startGame" @pokedex="screen = 'pokedex'" />
    <PokemonPage v-else-if="screen === 'game'" key="game" :difficulty="difficulty" :timerMode="timerMode" @exit="screen = 'start'" />
    <PokedexPage v-else                        key="dex"  @back="screen = 'start'" />
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import StartPage   from './pages/StartPage.vue'
import PokemonPage from './pages/PokemonPage.vue'
import PokedexPage from './pages/PokedexPage.vue'

const screen     = ref('start')
const difficulty = ref('easy')
const timerMode  = ref(false)

function startGame({ difficulty: d, timerMode: t }) {
  difficulty.value = d
  timerMode.value = t
  screen.value = 'game'
}
</script>

<style>
.page-enter-active, .page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from { opacity: 0; transform: scale(0.97); }
.page-leave-to   { opacity: 0; transform: scale(1.03); }
</style>
