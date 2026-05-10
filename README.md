# Pokémon Quiz Game

A premium-quality Pokémon guessing game built with **Vue 3** and the **Composition API**. Test your Pokémon knowledge across four difficulty modes, race against the clock, and track your stats — all powered by the live [PokéAPI](https://pokeapi.co/).

---

## Features

| Feature | Description |
|---|---|
| **4 Difficulty modes** | Easy (Gen 1), Medium (Gen 1–4), Hard (all gens), Legendary (legendaries only) |
| **Timer mode** | 15-second countdown with bonus points for fast answers |
| **Score & progression** | Points, streak counter, level system (every 10 correct = +1 level) |
| **High score** | Persisted across sessions via localStorage |
| **Type badges** | Pokémon types revealed with color-coded badges after each answer |
| **Pokédex panel** | Slide-out panel with ID, types, abilities, and base stat bars |
| **Statistics dashboard** | Accuracy %, best streak, game history chart, favorite Pokémon |
| **Sound effects** | Web Audio API synthesis for correct/wrong + Pokémon cries from PokéAPI |
| **Confetti** | Canvas particle burst on correct answers |
| **Dark / Light mode** | Persisted theme toggle |
| **API cache** | Two-layer cache (in-memory + localStorage) — each Pokémon fetched at most once per session |
| **Fully responsive** | Mobile-first layout, works at any screen size |

---

## Tech Stack

- **[Vue 3](https://vuejs.org/)** — `<script setup>` + Composition API throughout
- **[Axios](https://axios-http.com/)** — HTTP client for PokéAPI
- **[PokéAPI](https://pokeapi.co/)** — Pokémon data, sprites, and cries
- **Web Audio API** — synthesized sound effects, no audio asset files
- **localStorage** — persistence for scores, stats, cache, and preferences
- **Jest + Vue Test Utils** — unit test suite
- No Pinia, no Vue Router, no UI library — zero unnecessary dependencies

---

## Project Structure

```
src/
├── api/
│   └── pokemonApi.js          # Axios instance pointing to PokéAPI
├── composables/
│   ├── useConfetti.js         # Confetti trigger ref
│   ├── useGameState.js        # Core game loop (score, streak, level, state)
│   ├── useLocalStorage.js     # Typed reactive localStorage wrapper
│   ├── usePokemonCache.js     # Two-layer API cache
│   ├── useSound.js            # Web Audio synthesis + Pokémon cries
│   ├── useStatistics.js       # Game stats read/write
│   ├── useTheme.js            # Dark/light mode toggle
│   └── useTimer.js            # Countdown timer logic
├── components/
│   ├── ConfettiCanvas.vue     # Canvas particle system
│   ├── GameTimer.vue          # SVG countdown ring
│   ├── PokemonOptions.vue     # Answer buttons with correct/wrong feedback
│   ├── PokemonPicture.vue     # Silhouette → reveal animation
│   ├── PokemonPokedex.vue     # Slide-out Pokédex panel
│   ├── PokemonStats.vue       # Base stat bar chart
│   ├── PokemonTypeBadge.vue   # Colored type pill
│   ├── SkeletonLoader.vue     # Pulsing loading placeholder
│   ├── StatsDashboard.vue     # Full-screen stats modal
│   └── ThemeToggle.vue        # Sun/moon toggle button
├── css/
│   ├── animations.css         # Keyframe animations (fade, shake, bounce, slide)
│   ├── styles.css             # Global styles + CSS custom properties
│   └── themes.css             # Light/dark CSS variable definitions
├── helpers/
│   ├── getPokemonOptions.js   # Difficulty-aware pool + 4-option fetch
│   ├── legendaryIds.js        # Static list of legendary Pokémon IDs
│   └── pokemonTypes.js        # Type → color and label maps
├── pages/
│   ├── PokemonPage.vue        # Main game screen
│   └── StartPage.vue          # Difficulty/mode selection screen
├── App.vue                    # Root — StartPage ↔ PokemonPage switch
└── main.js                    # Entry point, global CSS imports
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 16
- npm ≥ 8

### Install & run

```bash
npm install
npm run serve
```

Open [http://localhost:8080](http://localhost:8080).

### Build for production

```bash
npm run build
```

Output is in `dist/`.

### Run tests

```bash
npm run test:unit
```

---

## Architecture Notes

### State management without Pinia

All global state lives in composables with module-level `ref`s. Because Vue's reactivity system makes module-level refs singletons when imported, any component that calls `useGameState()` shares the same reactive state. This avoids adding Pinia for a project of this scope while keeping the migration path open.

### API caching

`usePokemonCache.js` implements a two-layer cache:
1. **In-memory `Map`** — fastest; survives the browser session.
2. **localStorage** — survives page reloads; uses the key prefix `pkq_poke_{id}`.

Each Pokémon object stored includes `id`, `name`, `types`, `abilities`, `stats`, `sprite`, and `cryUrl` — so the Pokédex panel and type badges require zero extra network calls.

### Sound without assets

`useSound.js` uses the **Web Audio API** to synthesize a major-third jingle (correct) and a descending tritone buzz (wrong) directly from oscillators. The `AudioContext` is created lazily on first user interaction to satisfy browser autoplay policies. Pokémon cries are streamed from the PokeAPI cries CDN.

### Difficulty pools

| Mode | ID range | Pool size |
|---|---|---|
| Easy | 1–151 | 151 |
| Medium | 1–500 | 500 |
| Hard | 1–905 | 905 |
| Legendary | static list | ~70 |

---

## License

MIT
