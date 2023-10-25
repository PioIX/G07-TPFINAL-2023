const socket = io();
let inputBar = document.getElementById("search-bar-info");
let pokemonList=document.getElementById("pokemonList");
let pokemonJSON = null

function searchPokemons(){
    socket.emit("showPokemon");
}

socket.on("arrayPokemons",(filterPokemonId,filterPokemonName,filterPokemonType) =>{
    let t="";
    for(let i=0;i<filterPokemonId.length;i++){
        if(filterPokemonName[i].includes(inputBar.value)){
            t=t+`
            <li class="pokemon-list-team-li">
                <button id="pokemon${filterPokemonId[i]}">${filterPokemonName[i]}</button>
                <p>${filterPokemonType[i]}</p>
            </li>
            `
        }
    }
    pokemonList.innerHTML = t;
})

