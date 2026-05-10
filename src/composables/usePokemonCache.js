import pokemonApi from '@/api/pokemonApi'

const memCache = new Map()

export async function fetchPokemon(id) {
  if (memCache.has(id)) return memCache.get(id)

  const stored = localStorage.getItem(`pkq_poke_${id}`)
  if (stored) {
    const data = JSON.parse(stored)
    memCache.set(id, data)
    return data
  }

  const resp = await pokemonApi.get(`/${id}`)
  const d = resp.data
  const data = {
    id: d.id,
    name: d.name,
    types: d.types.map(t => t.type.name),
    abilities: d.abilities.map(a => a.ability.name),
    stats: d.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
    sprite: d.sprites.other['dream_world']?.front_default
      || d.sprites.other['official-artwork']?.front_default
      || d.sprites.front_default,
    cryUrl: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${d.id}.ogg`,
  }

  memCache.set(id, data)
  try { localStorage.setItem(`pkq_poke_${id}`, JSON.stringify(data)) } catch (_) {}
  return data
}
