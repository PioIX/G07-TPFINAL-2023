const socket = io();

socket.emit('relog', sessionStorage.getItem("user"));

socket.emit('fillTeams',  {team: localStorage.getItem("team"), user: sessionStorage.getItem("user"), game: sessionStorage.getItem("game")});