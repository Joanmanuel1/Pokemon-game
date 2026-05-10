import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const stored = localStorage.getItem(key)
  const initial = stored !== null ? JSON.parse(stored) : defaultValue
  const value = ref(initial)

  watch(value, (v) => {
    localStorage.setItem(key, JSON.stringify(v))
  }, { deep: true })

  return value
}
