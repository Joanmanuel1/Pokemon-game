<template>
  <Transition name="page" mode="out-in">
    <StartPage v-if="!isPlaying" key="start" @start="startGame" />
    <PokemonPage v-else key="game" :difficulty="difficulty" :timerMode="timerMode" @exit="exitGame" />
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import StartPage from './pages/StartPage.vue'
import PokemonPage from './pages/PokemonPage.vue'

const isPlaying = ref(false)
const difficulty = ref('easy')
const timerMode = ref(false)

function startGame({ difficulty: d, timerMode: t }) {
  difficulty.value = d
  timerMode.value = t
  isPlaying.value = true
}

function exitGame() {
  isPlaying.value = false
}
</script>

<style>
.page-enter-active, .page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.page-enter-from { opacity: 0; transform: scale(0.97); }
.page-leave-to   { opacity: 0; transform: scale(1.03); }
</style>
