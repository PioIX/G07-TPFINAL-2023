const socket = io();


function searchPokemons(){
    let p=2;
    socket.emit("showPokemon");
}