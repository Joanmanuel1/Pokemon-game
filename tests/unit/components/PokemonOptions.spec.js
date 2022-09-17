import { shallowMount } from "@vue/test-utils";
import PokemonOptions from "@/components/PokemonOptions";
import { pokemons } from "../mocks/pokemons.mock";

describe("PokemonOptions Components", () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(PokemonOptions, {
            props: {
                pokemons,
            },
        });
    });

    test("debe de hacer match con el snapshot", () => {
        expect(wrapper.html()).toMatchSnapshot();
    });

    test("debe de hmostrar 4 opciones", () => {
        const liTags = wrapper.findAll('li')
        expect(liTags.length).toBe(4)

        expect(liTags[0].text()).toBe('bulbasaur')
        expect(liTags[1].text()).toBe('ivysaur')
        expect(liTags[2].text()).toBe('venusaur')
        expect(liTags[3].text()).toBe('charmander')

    });


    test('debe de emitir "selection" ', () => {
        const [li1, li2, li3, li4] = wrapper.findAll('li')
        li1.trigger('click')
        li2.trigger('click')
        li3.trigger('click')
        li4.trigger('click')
        expect(wrapper.emitted('selectionPokemon').length).toBe(1)
        expect(wrapper.emitted('selectionPokemon')[0]).toEqual(1)
        expect(wrapper.emitted('selectionPokemon')[1]).toEqual(2)
        expect(wrapper.emitted('selectionPokemon')[2]).toEqual(3)
        expect(wrapper.emitted('selectionPokemon')[3]).toEqual(4)
    });



});
