const socket = io();
let inputBar = document.getElementById("search-bar-info");
let pokemonList=document.getElementById("pokemonList");
let pokemonJSON = null

function searchPokemons(){
    socket.emit("showPokemon");
}

socket.on("arrayPokemons",(filterPokemonId,filterPokemonName,filterPokemonType,filterPokemonImg) =>{
    let t="";
    for(let i=0;i<filterPokemonId.length;i++){
        if(filterPokemonName[i].includes(inputBar.value)){
            t=t+`
            <li onclick="selectPokemon()"(${filterPokemonId[i]})"class="pokemon-list-team-li">
                <img class="pokemon-list-team-li-img" src="${filterPokemonImg[i]}">
                <p>${filterPokemonName[i].toUpperCase()}</p>
                <p>${filterPokemonType[i].toUpperCase()}</p>
            </li>
            `
        }
    }
    pokemonList.innerHTML = t;
})

