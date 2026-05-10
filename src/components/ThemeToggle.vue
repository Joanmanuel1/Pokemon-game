<template>
  <button class="theme-toggle" @click="toggleTheme" :title="theme === 'light' ? 'Modo oscuro' : 'Modo claro'">
    <span v-if="theme === 'light'">🌙</span>
    <span v-else>☀️</span>
  </button>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'
const { theme, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.theme-toggle:hover {
  transform: scale(1.1);
}
</style>
