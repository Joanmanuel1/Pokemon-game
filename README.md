# Pokémon Quiz Game

A premium-quality Pokémon guessing game built with **Vue 3** and the **Composition API**. Test your Pokémon knowledge across four difficulty modes, race against the clock, unlock Pokémon in your own Pokédex, and complete daily missions — all powered by the live [PokéAPI](https://pokeapi.co/) with zero backend.

---

## Features

### Gameplay
| Feature | Description |
|---|---|
| **4 Difficulty modes** | Easy (Gen 1), Medium (Gen 1–4), Hard (all gens), Legendary (legendaries only) |
| **Timer mode** | 15-second countdown with bonus points for fast answers |
| **Score & progression** | Points, streak counter, level system (every 10 correct = +1 level) |
| **Combo system** | Consecutive correct answers of the same type activate a multiplier (×1.5 → ×2 → ×3) |
| **Evolution challenge** | After a correct answer, optional mini-challenge: guess the evolution for +3 bonus points |
| **Hint system** | Reveal the first letter of the name; costs 1 streak point |
| **High score** | Persisted across sessions via localStorage |

### Progression & Retention
| Feature | Description |
|---|---|
| **Progressive Pokédex** | All 905 Pokémon start as black silhouettes; guess them correctly to unlock their sprite and data |
| **Daily missions** | 3 random missions per day (guess N Pokémon, hit a streak, catch a legendary, etc.) with coin rewards |
| **Login streak** | Daily login bonus coins; consecutive days multiply the reward (up to 100 🪙/day) |
| **30+ achievements** | Unlockable badges for streaks, speed, Pokédex milestones, type chains, evolutions, and more |
| **Coins economy** | Earn coins from missions and login streaks (shop / power-ups coming in Sprint 4) |

### Presentation
| Feature | Description |
|---|---|
| **Animated background** | Gradient + floating Pokéball SVG pattern, theme-aware |
| **Type combo bar** | Animated banner shows the active type chain and multiplier |
| **Pokémon reveal** | Silhouette → golden flash burst → bounce animation on reveal |
| **Confetti** | Canvas particle burst on correct answers |
| **Sound effects** | Web Audio API synthesis for correct/wrong + Pokémon cries from PokéAPI |
| **Haptics** | Vibration patterns on mobile (tap, success, error, level-up) |
| **Dark / Light mode** | Persisted theme toggle |
| **Fully responsive** | Mobile-first, no-scroll layout (`100dvh`) |

---

## Tech Stack

- **[Vue 3](https://vuejs.org/)** — `<script setup>` + Composition API throughout
- **[Axios](https://axios-http.com/)** — HTTP client for PokéAPI
- **[PokéAPI](https://pokeapi.co/)** — Pokémon data, sprites, cries, and evolution chains
- **Web Audio API** — synthesized sound effects, no audio asset files
- **Canvas API** — confetti particle system
- **localStorage** — persistence for scores, Pokédex, missions, cache, and preferences
- No Pinia, no Vue Router, no UI library — zero unnecessary dependencies

---

## Project Structure

```
src/
├── api/
│   └── pokemonApi.js              # Axios instance pointing to PokéAPI
├── composables/
│   ├── useAchievements.js         # 30+ achievements with toast queue
│   ├── useConfetti.js             # Confetti trigger ref
│   ├── useDailyMissions.js        # Daily missions pool, login streak, coins
│   ├── useGameState.js            # Core game loop (score, streak, combo, evolution events)
│   ├── useHaptics.js              # Vibration patterns via navigator.vibrate
│   ├── useLocalStorage.js         # Typed reactive localStorage wrapper
│   ├── usePokedex.js              # 905-entry capture tracker per gen
│   ├── usePokemonCache.js         # Two-layer API cache (memory + localStorage v2)
│   ├── useSound.js                # Web Audio synthesis + Pokémon cries
│   ├── useStatistics.js           # Game stats read/write
│   ├── useTheme.js                # Dark/light mode toggle
│   └── useTimer.js                # Countdown timer logic
├── components/
│   ├── AchievementToast.vue       # Achievement notification stack (top-right)
│   ├── ComboBar.vue               # Type combo multiplier banner
│   ├── ConfettiCanvas.vue         # Canvas particle system
│   ├── DailyMissions.vue          # Daily missions bottom-sheet modal
│   ├── EvolutionChallenge.vue     # Evolution bonus mini-game modal
│   ├── GameOverScreen.vue         # Game over with failed Pokémon reveal
│   ├── GameTimer.vue              # SVG countdown ring
│   ├── LevelProgress.vue          # Level pill with animated progress bar
│   ├── PokemonOptions.vue         # Answer buttons with correct/wrong feedback
│   ├── PokemonPicture.vue         # Silhouette → flash burst → bounce reveal
│   ├── PokemonPokedex.vue         # Slide-out Pokédex panel (stats, abilities)
│   ├── PokemonStats.vue           # Base stat bar chart
│   ├── PokemonTypeBadge.vue       # Colored type pill
│   ├── SkeletonLoader.vue         # Pulsing loading placeholder
│   ├── StatsDashboard.vue         # Full-screen stats modal
│   └── ThemeToggle.vue            # Sun/moon toggle button
├── css/
│   ├── animations.css             # Keyframe animations (fade, shake, bounce, slide)
│   ├── styles.css                 # Global styles, no-scroll layout, Pokéball pattern
│   └── themes.css                 # Light/dark CSS variable definitions
├── helpers/
│   ├── getPokemonOptions.js       # Difficulty-aware pool + 4-option fetch
│   ├── legendaryIds.js            # Static list of legendary Pokémon IDs (Gen 1–8)
│   └── pokemonTypes.js            # Type → color and Spanish label maps (18 types)
├── pages/
│   ├── PokedexPage.vue            # Full 905-Pokémon grid with gen/type/status filters
│   ├── PokemonPage.vue            # Main game screen
│   └── StartPage.vue              # Difficulty/mode selection + Pokédex + Missions entry
├── App.vue                        # Root — 3-state navigation (start / game / pokedex)
└── main.js                        # Entry point, global CSS imports
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

### API caching (v2)

`usePokemonCache.js` implements a two-layer cache with versioning:
1. **In-memory `Map`** — fastest; survives the browser session.
2. **localStorage** — survives page reloads; key prefix `pkq_poke_{id}`.

Entries include a `_v` version field. On load, entries with an older version are discarded and re-fetched — this automatically migrates stale cache without user intervention.

Each Pokémon object includes `id`, `name`, `types`, `abilities`, `stats`, `sprite` (official-artwork PNG), `cryUrl`, and `nextEvolutionId`. Evolution data is fetched in background from the PokéAPI species + evolution-chain endpoints and cached separately under `pkq_evol_{id}`.

### Combo system

`useGameState` tracks `comboType` (first type of the last correct Pokémon) and `comboCount` (consecutive correct of the same type). The multiplier scales: 1× → 1.5× (×2 chain) → 2× (×4) → 3× (×6+). Points are rounded after multiplier is applied. `ComboBar.vue` shows the active chain with the type's color gradient.

### Daily missions

`useDailyMissions.js` reads/writes a single `pkq_daily` localStorage key containing the current date, 3 randomly selected missions from a pool of 12, login streak, last login date, and coin balance. On app load, if the stored date differs from today, new missions are generated and the login streak is updated. Mission progress is driven by event calls (`updateMission(eventType)`) from `useGameState` — no polling or timers needed.

### Evolution challenge

After a correct answer, `PokemonPage` waits 1.2 seconds then checks `pokemon.nextEvolutionId`. If present, it fetches the evolution Pokémon and 3 random decoys, shuffles them, and shows `EvolutionChallenge.vue`. The whole fetch happens in background — it never blocks the next question.

### Sprite strategy

Sprites use **official-artwork PNG** (covers all 905 Pokémon) as primary source, with `dream_world` SVG and the base sprite as fallbacks. This ensures no blank images for Gen 2+ Pokémon where dream_world returns null.

### Difficulty pools

| Mode | ID range | Pool size |
|---|---|---|
| Easy | 1–151 | 151 |
| Medium | 1–500 | 500 |
| Hard | 1–905 | 905 |
| Legendary | static list | ~70 |

---

## localStorage Keys

| Key | Contents |
|---|---|
| `pkq_highScore` | All-time high score |
| `pkq_bestStreak` | All-time best streak |
| `pkq_captured` | Array of captured Pokémon IDs |
| `pkq_daily` | Date, missions, streak, coins |
| `pkq_poke_{id}` | Cached Pokémon data (v2) |
| `pkq_evol_{id}` | Cached next evolution ID |
| `pkq_achievements` | Unlocked achievement IDs |
| `pkq_stats` | Game statistics |
| `pkq_types_seen` | Types guessed (for all-types achievement) |
| `pkq_legendaries_guessed` | Legendary counter |
| `pkq_speed_count` | Sub-3s answers counter |
| `pkq_theme` | `"light"` or `"dark"` |

---

## License

MIT
