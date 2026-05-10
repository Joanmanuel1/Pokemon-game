import { ref } from 'vue'

export const confettiRef = ref(null)

export function useConfetti() {
  function triggerConfetti() {
    confettiRef.value?.trigger()
  }
  return { confettiRef, triggerConfetti }
}
