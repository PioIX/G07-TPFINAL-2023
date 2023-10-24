const socket = io();
let pokemonJSON = null

function searchPokemons(){
    socket.emit("showPokemon");
}

