const searchField = document.querySelector('#search_field');
const filters = document.querySelectorAll('.filter');
const genFilters = document.querySelectorAll('.gen_filter');
const displayGen = document.getElementById('current_gen');
const displayFilter = document.getElementById('current_filter');
const resetButton = document.querySelector('#reset_button');


let pokemonData = [];

const generations = [
    { limit: 151, offset: 0 },
    { limit: 100, offset: 151 },
    { limit: 135, offset: 251 },
    { limit: 107, offset: 386 },
    { limit: 156, offset: 493 },
    { limit: 72, offset: 649 },
    { limit: 88, offset: 721 },
    { limit: 96, offset: 809 },
    { limit: 3, offset: 905 },
];

const fetchData = (generation) => {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${generation.limit}&offset=${generation.offset}`)
        .then(response => response.json())
        .then(json => {
            const fetches = json.results.map(item => {
                return fetch(item.url).then(res => res.json())
            })
            Promise.all(fetches).then(res => {
                pokemonData = res;
                dataList(pokemonData);
            });
        })
}

fetchData({ limit: 908, offset: 0 });


const dataList = (data) => {
    document.querySelector('.data').innerHTML = data.map((item, i) => {
        const name = item.name
        const imageUrl = item.sprites.front_default
        const id = item.id
        const types = item.types.map(type => `<img src="./pokemon_icons/${type.type.name}.png" alt="${type.type.name}">`).join('')

        return `<div class="pokemon_wrapper"> <div class="pokemon"> <p class="poke_name">${name}</p> <p>ID: <span></span> ${id}</p><div class="type_img"> <p>type:</p> ${types} </div> <div class="image_border"><div class="image_container"> <img src="${imageUrl}"> </div> </div> </div> </div>`
    }).join('')
}


genFilters.forEach((genFilter, i) => {
    genFilter.addEventListener('click', () => {
        fetchData(generations[i]);
        displayGen.textContent = genFilter.textContent;

        displayFilter.textContent = ('All');
    });
});

filters.forEach(filter => {
    filter.addEventListener('click', () => {
        const type = filter.dataset.type;

        const filteredData = pokemonData.filter(pokemon => {
            return pokemon.types.some(pokemonType => pokemonType.type.name === type);
        });

        dataList(filteredData);

        displayFilter.textContent = filter.textContent;
    });
});

const searchPokemon = () => {
    const searchValue = searchField.value.toLowerCase();
    const filterList = pokemonData.filter(pokemon => {
        return pokemon.name.toLowerCase().includes(searchValue);
    });
    dataList(filterList);
}

const reset = () => {
    window.location.reload()
}


searchField.addEventListener('input', searchPokemon);

resetButton.addEventListener('click', reset)





