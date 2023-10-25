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
        t=t+`
        <li>
            <p id="pokemon${filterPokemonId[i]}">${filterPokemonName[i]}</p>
            <p>${filterPokemonType[i]}</p>
        </li>
        `
    }
    pokemonList.innerHTML = t;
})

