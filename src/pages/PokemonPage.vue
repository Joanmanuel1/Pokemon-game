<template>
  <h1 v-if="!pokemon">Espere por favor...</h1>
  <div v-else="pokemon">
    <div class="container">
     <img src="@/assets/titulo.png" alt="">
      <h1><span class="h1">¿Quien es este pokémon? </span> </h1>
      <PokemonPicture :pokemonId="pokemon.id" :showPokemon="showPokemon" />
      <PokemonOptions :pokemons="pokemonArr" @selection="checkAnswer" />

      <div v-if="showAnswer">
        <h2 class="fade-in mensaje"> <span class="h2">{{ message }} </span></h2>
      </div>
      <div v-if="perdio">
        <button @click="newGame()" class="boton-new-game">Nuevo juego</button>
      </div>
      <div v-else>
        <button @click="nuevoPokemon()" class="boton-new-game">
          Otro Pokemon
        </button>
      </div>
        <h3><span class="h3"> Puntos: {{ puntos }} </span></h3>
    </div>
  </div>
</template>


<script>
import PokemonOptions from "../components/PokemonOptions.vue";
import PokemonPicture from "../components/PokemonPicture.vue";
import getPokemonOptions from "../helpers/getPokemonOptions";

export default {
  components: { PokemonOptions, PokemonPicture },
  data() {
    return {
      pokemonArr: [],
      pokemon: null,
      showPokemon: false,
      showAnswer: false,
      message: "",
      perdio: false,
      puntos: 0,
    };
  },
  methods: {
    async mixPokemonArray() {
      this.pokemonArr = await getPokemonOptions();
      const rndInt = Math.floor(Math.random() * 4);
      this.pokemon = this.pokemonArr[rndInt];
    },

    checkAnswer(selectedId) {
      this.showPokemon = true;
      this.showAnswer = true;

      if (selectedId == this.pokemon.id) {
        this.message = `Correcto, es ${this.pokemon.name}`;
        this.puntos++;
        this.nue();
      } else {
        this.message = `Oops, era ${this.pokemon.name}`;
        this.perdio = true;
        this.nue();
      }
    },
    newGame() {
      this.mixPokemonArray();
      this.pokemonArr = [];
      this.showPokemon = false;
      this.showAnswer = false;
      this.pokemon = null;
      this.perdio = false;
      this.puntos = 0;
    },
    nuevoPokemon() {
      this.mixPokemonArray();
      this.pokemonArr = [];
      this.showPokemon = false;
      this.showAnswer = false;
      this.pokemon = null;
      this.perdio = false;
    },

    nue() {
      this.pokemonArr = [];
    },
  },
  mounted() {
    this.mixPokemonArray();
  },
};
</script>

