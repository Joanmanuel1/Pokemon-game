import pokemonApi from '@/api/pokemonApi'

const CACHE_VERSION = 2
const memCache = new Map()

export async function fetchPokemon(id) {
  if (memCache.has(id)) return memCache.get(id)

  const stored = localStorage.getItem(`pkq_poke_${id}`)
  if (stored) {
    const data = JSON.parse(stored)
    // Invalidate old cache entries missing official-artwork sprite or version field
    if (data._v === CACHE_VERSION) {
      memCache.set(id, data)
      return data
    }
  }

  const resp = await pokemonApi.get(`/${id}`)
  const d = resp.data
  const data = {
    id: d.id,
    name: d.name,
    types: d.types.map(t => t.type.name),
    abilities: d.abilities.map(a => a.ability.name),
    stats: d.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
    sprite: d.sprites.other['official-artwork']?.front_default
      || d.sprites.other['dream_world']?.front_default
      || d.sprites.front_default,
    cryUrl: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${d.id}.ogg`,
    nextEvolutionId: null,
    _v: CACHE_VERSION,
  }

  memCache.set(id, data)
  try { localStorage.setItem(`pkq_poke_${id}`, JSON.stringify(data)) } catch (_) {}

  // Fetch evolution chain in background (non-blocking)
  fetchNextEvolution(id, data)

  return data
}

async function fetchNextEvolution(id, data) {
  const cacheKey = `pkq_evol_${id}`
  const stored = localStorage.getItem(cacheKey)
  if (stored !== null) {
    const nextId = JSON.parse(stored)
    data.nextEvolutionId = nextId
    memCache.set(id, { ...data })
    return
  }

  try {
    const speciesResp = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    if (!speciesResp.ok) throw new Error()
    const species = await speciesResp.json()
    const chainResp = await fetch(species.evolution_chain.url)
    if (!chainResp.ok) throw new Error()
    const chain = await chainResp.json()

    const nextId = findNextInChain(chain.chain, id)
    data.nextEvolutionId = nextId
    memCache.set(id, { ...data })
    try {
      localStorage.setItem(cacheKey, JSON.stringify(nextId))
      localStorage.setItem(`pkq_poke_${id}`, JSON.stringify(data))
    } catch (_) {}
  } catch (_) {
    localStorage.setItem(cacheKey, JSON.stringify(null))
  }
}

function findNextInChain(node, targetId) {
  const nodeId = parseInt(node.species.url.split('/').filter(Boolean).pop())
  if (nodeId === targetId) {
    if (node.evolves_to.length > 0) {
      return parseInt(node.evolves_to[0].species.url.split('/').filter(Boolean).pop())
    }
    return null
  }
  for (const child of node.evolves_to) {
    const found = findNextInChain(child, targetId)
    if (found !== undefined) return found
  }
  return undefined
}
