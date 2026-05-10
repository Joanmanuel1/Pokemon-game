import { computed } from 'vue'
import { useLocalStorage } from './useLocalStorage'

const MISSION_POOL = [
  { id: 'guess_5',       desc: 'Adivina 5 Pokémon hoy',         target: 5,  reward: 30,  event: 'correct' },
  { id: 'guess_10',      desc: 'Adivina 10 Pokémon hoy',        target: 10, reward: 50,  event: 'correct' },
  { id: 'guess_20',      desc: 'Adivina 20 Pokémon hoy',        target: 20, reward: 100, event: 'correct' },
  { id: 'streak_5',      desc: 'Consigue una racha de 5',        target: 5,  reward: 60,  event: 'streak' },
  { id: 'streak_10',     desc: 'Consigue una racha de 10',       target: 10, reward: 120, event: 'streak' },
  { id: 'no_hints_5',    desc: 'Adivina 5 Pokémon sin pistas',   target: 5,  reward: 80,  event: 'no_hint' },
  { id: 'speed_3',       desc: 'Acierta 3 en menos de 3s',       target: 3,  reward: 75,  event: 'speed' },
  { id: 'legendary',     desc: 'Adivina un Pokémon legendario',  target: 1,  reward: 100, event: 'legendary' },
  { id: 'type_chain_3',  desc: 'Consigue una cadena de tipo ×3', target: 3,  reward: 75,  event: 'combo' },
  { id: 'new_capture_5', desc: 'Captura 5 Pokémon nuevos',       target: 5,  reward: 60,  event: 'new_capture' },
  { id: 'evolution_1',   desc: 'Adivina una evolución',          target: 1,  reward: 50,  event: 'evolution' },
  { id: 'play_2',        desc: 'Juega 2 partidas completas',     target: 2,  reward: 40,  event: 'game_end' },
]

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function yesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

function pickMissions() {
  const shuffled = [...MISSION_POOL].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3).map(m => ({
    ...m,
    progress: 0,
    done: false,
    claimed: false,
  }))
}

const defaultDaily = {
  date: '',
  missions: [],
  loginStreak: 0,
  lastLogin: '',
  coins: 0,
}

const daily = useLocalStorage('pkq_daily', defaultDaily)

// Init on module load
function initDaily() {
  const today = todayStr()
  if (daily.value.date !== today) {
    const wasYesterday = daily.value.lastLogin === yesterday()
    const newStreak = wasYesterday ? (daily.value.loginStreak || 0) + 1 : 1
    const loginBonus = Math.min(newStreak * 10, 100)
    daily.value = {
      date: today,
      missions: pickMissions(),
      loginStreak: newStreak,
      lastLogin: today,
      coins: (daily.value.coins || 0) + loginBonus,
    }
  } else if (daily.value.lastLogin !== today) {
    daily.value = { ...daily.value, lastLogin: today }
  }
}

initDaily()

export function useDailyMissions() {
  const coins = computed(() => daily.value.coins || 0)
  const loginStreak = computed(() => daily.value.loginStreak || 0)
  const missions = computed(() => daily.value.missions || [])
  const hasPendingRewards = computed(() =>
    missions.value.some(m => m.done && !m.claimed)
  )

  function updateMission(eventType, value = 1) {
    const updated = [...(daily.value.missions || [])]
    let changed = false
    updated.forEach((m, i) => {
      if (m.claimed || m.done) return
      if (m.event === eventType) {
        updated[i] = { ...m, progress: Math.min(m.progress + value, m.target) }
        if (updated[i].progress >= updated[i].target) {
          updated[i] = { ...updated[i], done: true }
        }
        changed = true
      }
    })
    if (changed) daily.value = { ...daily.value, missions: updated }
  }

  function claimReward(missionId) {
    const updated = daily.value.missions.map(m => {
      if (m.id === missionId && m.done && !m.claimed) {
        return { ...m, claimed: true }
      }
      return m
    })
    const mission = daily.value.missions.find(m => m.id === missionId)
    const reward = mission?.reward || 0
    daily.value = {
      ...daily.value,
      missions: updated,
      coins: (daily.value.coins || 0) + reward,
    }
  }

  function spendCoins(amount) {
    if ((daily.value.coins || 0) < amount) return false
    daily.value = { ...daily.value, coins: daily.value.coins - amount }
    return true
  }

  function addCoins(amount) {
    daily.value = { ...daily.value, coins: (daily.value.coins || 0) + amount }
  }

  return {
    daily, coins, loginStreak, missions, hasPendingRewards,
    updateMission, claimReward, spendCoins, addCoins,
  }
}
