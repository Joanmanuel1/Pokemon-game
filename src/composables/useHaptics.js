export function useHaptics() {
  const hasVibrate = typeof navigator !== 'undefined' && 'vibrate' in navigator

  function vibrate(pattern) {
    if (hasVibrate) navigator.vibrate(pattern)
  }

  return {
    tap:     () => vibrate(8),
    success: () => vibrate([20, 40, 20]),
    error:   () => vibrate([60, 30, 60]),
    levelUp: () => vibrate([30, 50, 30, 50, 30]),
  }
}
