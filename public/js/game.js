const socket = io();

socket.emit('relog', sessionStorage.getItem("user"))
console.log("fillteams")

socket.emit('fillTeams',  {team: sessionStorage.getItem('team'), user: sessionStorage.getItem("user"), game: sessionStorage.getItem("game")});

socket.on('draw-pokemons', (data) => {
    console.log(data)
})
