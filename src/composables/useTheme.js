import { watchEffect } from 'vue'
import { useLocalStorage } from './useLocalStorage'

const theme = useLocalStorage('pkq_theme', 'light')

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
})

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  return { theme, toggleTheme }
}
