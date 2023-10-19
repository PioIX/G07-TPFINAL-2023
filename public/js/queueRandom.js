const socket = io();
const gameContainer = document.getElementById("game-container");
const turn = document.getElementById("turn");

const nickP1 = document.getElementById("nick-p1");
const pokemonP1Avatar = document.getElementById("pokemon-p1-avatar");
const pokemonP11 = document.getElementById("pokemon-p1-1");
const pokemonP12 = document.getElementById("pokemon-p1-2");
const pokemonP13 = document.getElementById("pokemon-p1-3");
const pokemonP14 = document.getElementById("pokemon-p1-4");
const pokemonP15 = document.getElementById("pokemon-p1-5");
const pokemonP16 = document.getElementById("pokemon-p1-6");
const pokemonP1IngameName = document.getElementById("pokemon-p1-ingame-name");
const pokemonP1IngameImg =  document.getElementById("pokemon-p1-ingame-img");
const pokemonP11Bottom = document.getElementById("pokemon-p1-1-bottom");
const pokemonP12Bottom = document.getElementById("pokemon-p1-2-bottom");
const pokemonP13Bottom = document.getElementById("pokemon-p1-3-bottom");
const pokemonP14Bottom = document.getElementById("pokemon-p1-4-bottom");
const pokemonP15Bottom = document.getElementById("pokemon-p1-5-bottom");
const pokemonP16Bottom = document.getElementById("pokemon-p1-6-bottom");

const move1Container = document.getElementById("game-attacks-1");
const move1P = document.getElementById("move-1-p");
const move1Type = document.getElementById("move-1-type");
const move1PP = document.getElementById("move-1-pp");
const move2Container = document.getElementById("game-attacks-2");
const move2P = document.getElementById("move-2-p");
const move2Type = document.getElementById("move-2-type");
const move2PP = document.getElementById("move-2-pp");
const move3Container = document.getElementById("game-attacks-3");
const move3P = document.getElementById("move-3-p");
const move3Style = document.getElementById("move-3-type");
const move3PP = document.getElementById("move-3-pp");
const move4Container = document.getElementById("game-attacks-4");
const move4P = document.getElementById("move-4-p");
const move4Style = document.getElementById("move-4-type");
const move4PP = document.getElementById("move-4-pp");


const nickP2 = document.getElementById("nick-p2");
const pokemonP2Avatar = document.getElementById("pokemon-p2-avatar");
const pokemonP21 = document.getElementById("pokemon-p2-1");
const pokemonP22 = document.getElementById("pokemon-p2-2");
const pokemonP23 = document.getElementById("pokemon-p2-3");
const pokemonP24 = document.getElementById("pokemon-p2-4");
const pokemonP25 = document.getElementById("pokemon-p2-5");
const pokemonP26 = document.getElementById("pokemon-p2-6");
const pokemonP2IngameName = document.getElementById("pokemon-p2-ingame-name");
const pokemonP2IngameImg =  document.getElementById("pokemon-p2-ingame-img");

let room;
let team;


sessionStorage.setItem('game', "roomsOnlineRandom");

randomPick();

socket.emit('relog', sessionStorage.getItem("user"));

socket.emit("room", {user: sessionStorage.getItem("user"), room: "random"});


async function randomPick(){
    try {
        const response = await fetch("/generateTeamRandom", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: null,
        });
        const result = await response.json();
        team = result
    } catch (error) {
        console.error("Error:", error);
    };   
}

socket.on('start', () => {
    console.log(team)
    socket.emit('fillTeams', {team: team ,user: sessionStorage.getItem("user"), game: sessionStorage.getItem("game")})
    gameContainer.style.display = "flex";       
})

socket.on('draw-pokemons', (data) => {

    nickP1.innerHTML = `${sessionStorage.getItem("user")}`;
    nickP2.innerHTML = `${data.user}`;
    
    changePokemonP1(0);

    pokemonP11.src = `${team[0].spriteFront}`

    pokemonP11Bottom.src = `${team[0].spriteFront}`
    pokemonP12Bottom.src = `${team[1].spriteFront}`
    pokemonP13Bottom.src = `${team[2].spriteFront}`
    pokemonP14Bottom.src = `${team[3].spriteFront}`
    pokemonP15Bottom.src = `${team[4].spriteFront}`
    pokemonP16Bottom.src = `${team[5].spriteFront}`

    
    pokemonP2IngameName.innerHTML = `${data.team[0].name}`
    pokemonP2IngameImg.src = `${data.team[0].spriteFront}`


    
})




function changePokemonP1(pokemonIndex){
    pokemonP1IngameName.innerHTML = `${team[pokemonIndex].name}`
    pokemonP1IngameImg.src = `${team[pokemonIndex].spriteBack}`
    
    move1Container.className  = `${team[pokemonIndex].moves[0].type} game-attacks`
    move1P.innerHTML = `${team[pokemonIndex].moves[0].name}`
    move1Type.innerHTML = `${team[pokemonIndex].moves[0].type}`
    move1PP.innerHTML = `${team[pokemonIndex].moves[0].pp}/${team[0].moves[0].pp}`

    move2Container.className  = `${team[pokemonIndex].moves[1].type} game-attacks`
    move2P.innerHTML = `${team[pokemonIndex].moves[1].name}`
    move2Type.innerHTML = `${team[pokemonIndex].moves[1].type}`
    move2PP.innerHTML = `${team[pokemonIndex].moves[1].pp}/${team[0].moves[1].pp}`

    move3Container.className  = `${team[pokemonIndex].moves[2].type} game-attacks`
    move3P.innerHTML = `${team[pokemonIndex].moves[2].name}`
    move3Style.innerHTML = `${team[pokemonIndex].moves[2].type}`
    move3PP.innerHTML = `${team[pokemonIndex].moves[2].pp}/${team[0].moves[2].pp}`

    move4Container.className  = `${team[pokemonIndex].moves[3].type} game-attacks`
    move4P.innerHTML = `${team[pokemonIndex].moves[3].name}`
    move4Style.innerHTML = `${team[pokemonIndex].moves[3].type}`
    move4PP.innerHTML = `${team[pokemonIndex].moves[3].pp}/${team[0].moves[3].pp}`
}











