
const { listeners } = require('process');


const pokemonInfoTemplate = document.querySelector(["info-pokemon-template"])
const pokemonInfoContainer = document.querySelector(["pokemonInfoContainer"])
const searchPokemon = document.querySelector(["search-bar-info"])

let pokemons = []

searchPokemon.addEventListener("input",(e) =>{
    const value = e.target.value
    pokemons.forEach(pokemon =>{
        const isVisible = pokemon.name.includes(value)
        pokemon.element.classList.toggle("team-hide-pokemon", !isVisible) 
    })
})

fetch("https://pokeapi.co/api/v2/pokemon/")
.then(res => res.json())
.then(data =>{
    pokemons = data.map(pokemon => {
        const info = pokemonInfoTemplate.content.cloneNode(true).children[0]
        const pokemonName = info.querySelector("[info-headerName]")
        const pokemonType = info.querySelector("[info-pokemonType]")
        const pokemonAbility = info.querySelector("[info-pokemonAbility]")
        pokemonName.textContent = pokemon[1].name
        pokemonType.textContent = pokemon[1].type
        pokemonAbility.textContent = pokemon[1].ability
        pokemonInfoContainer.append(info)
        return {name:pokemonJSON.name,type:pokemonJSON.type,ability:pokemonJSON.ability}
    });
})


