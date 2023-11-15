const socket = io();

socket.emit('relog', sessionStorage.getItem("user"));

// socket.emit('fillTeams',  {team: hola, user: sessionStorage.getItem("user"), game: sessionStorage.getItem("game")});

// socket.on('draw-pokemons', (data) => {
    
// })