import { ref } from 'vue'

export function useTimer(seconds = 15) {
  const timeLeft = ref(seconds)
  const isRunning = ref(false)
  const total = seconds
  let interval = null
  let onExpireCallback = null

  function start(onExpire) {
    onExpireCallback = onExpire
    timeLeft.value = total
    isRunning.value = true
    clearInterval(interval)
    interval = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 0) {
        stop()
        if (onExpireCallback) onExpireCallback()
      }
    }, 1000)
  }

  function stop() {
    clearInterval(interval)
    isRunning.value = false
  }

  function reset() {
    stop()
    timeLeft.value = total
  }

  return { timeLeft, isRunning, total, start, stop, reset }
}
