import { fetchPokemon } from '@/composables/usePokemonCache'
import { legendaryIds } from './legendaryIds'

const POOLS = {
  easy:      { min: 1, max: 151 },
  medium:    { min: 1, max: 500 },
  hard:      { min: 1, max: 905 },
  legendary: null,
}

export const getPokemons = (difficulty = 'easy') => {
  if (difficulty === 'legendary') return [...legendaryIds]
  const { min, max } = POOLS[difficulty] || POOLS.easy
  return Array.from({ length: max - min + 1 }, (_, i) => i + min)
}

const getPokemonOptions = async (difficulty = 'easy') => {
  const pool = getPokemons(difficulty)
  const shuffled = pool.sort(() => Math.random() - 0.5)
  const selectedIds = shuffled.slice(0, 4)
  const pokemons = await Promise.all(selectedIds.map(id => fetchPokemon(id)))
  return pokemons
}

export default getPokemonOptions
