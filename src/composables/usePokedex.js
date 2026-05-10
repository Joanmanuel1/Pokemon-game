import { computed } from 'vue'
import { useLocalStorage } from './useLocalStorage'

const captured = useLocalStorage('pkq_captured', [])
const capturedSet = computed(() => new Set(captured.value))
const totalCaptured = computed(() => captured.value.length)

const GEN_RANGES = [
  { gen: 1, min: 1,   max: 151  },
  { gen: 2, min: 152, max: 251  },
  { gen: 3, min: 252, max: 386  },
  { gen: 4, min: 387, max: 493  },
  { gen: 5, min: 494, max: 649  },
  { gen: 6, min: 650, max: 721  },
  { gen: 7, min: 722, max: 809  },
  { gen: 8, min: 810, max: 905  },
]
const TOTAL = 905

export function usePokedex() {
  function capture(id) {
    if (!capturedSet.value.has(id)) {
      captured.value = [...captured.value, id]
    }
  }

  function hasCaptured(id) {
    return capturedSet.value.has(id)
  }

  function genOf(id) {
    return GEN_RANGES.find(r => id >= r.min && id <= r.max)?.gen ?? 1
  }

  function capturedInGen(gen) {
    const range = GEN_RANGES.find(r => r.gen === gen)
    if (!range) return 0
    return captured.value.filter(id => id >= range.min && id <= range.max).length
  }

  function totalInGen(gen) {
    const range = GEN_RANGES.find(r => r.gen === gen)
    return range ? range.max - range.min + 1 : 0
  }

  return {
    captured,
    capturedSet,
    totalCaptured,
    TOTAL,
    GEN_RANGES,
    capture,
    hasCaptured,
    genOf,
    capturedInGen,
    totalInGen,
  }
}
