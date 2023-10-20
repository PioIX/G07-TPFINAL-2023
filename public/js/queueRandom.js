const socket = io();
const gameContainer = document.getElementById("game-container");
const turn = document.getElementById("turn");

const effectiveness = {
    normal: { normal: 1, fire: 1, water: 1, grass: 1, electric: 1, ice: 1, fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 0.5, ghost: 0, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },
    fire: { normal: 1, fire: 0.5, water: 2, grass: 0.5, electric: 1, ice: 2, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2, rock: 0.5, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1 },
    water: { normal: 1, fire: 0.5, water: 0.5, grass: 2, electric: 2, ice: 0.5, fighting: 1, poison: 1, ground: 2, flying: 1, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 1, fairy: 1 },
    grass: { normal: 1, fire: 2, water: 0.5, grass: 0.5, electric: 0.5, ice: 2, fighting: 1, poison: 2, ground: 2, flying: 0.5, psychic: 1, bug: 2, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 1, fairy: 1 },
    electric: { normal: 1, fire: 1, water: 1, grass: 1, electric: 0.5, ice: 1, fighting: 1, poison: 1, ground: 0, flying: 2, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 1, fairy: 1 },
    ice: { normal: 1, fire: 0.5, water: 0.5, grass: 2, electric: 1, ice: 0.5, fighting: 1, poison: 1, ground: 2, flying: 2, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 2 },
    fighting: { normal: 2, fire: 1, water: 1, grass: 1, electric: 1, ice: 2, fighting: 1, poison: 0.5, ground: 1, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dragon: 1, dark: 2, steel: 2, fairy: 0.5 },
    poison: { normal: 1, fire: 1, water: 1, grass: 0.5, electric: 1, ice: 1, fighting: 1, poison: 0.5, ground: 2, flying: 1, psychic: 1, bug: 0.5, rock: 1, ghost: 0.5, dragon: 1, dark: 1, steel: 0, fairy: 2 },
    ground: { normal: 1, fire: 2, water: 1, grass: 0.5, electric: 2, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 0, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1 },
    flying: { normal: 1, fire: 1, water: 1, grass: 2, electric: 0.5, ice: 1, fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2, rock: 0.5, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },
    psychic: { normal: 1, fire: 1, water: 1, grass: 1, electric: 1, ice: 1, fighting: 2, poison: 2, ground: 1, flying: 1, psychic: 0.5, bug: 1, rock: 1, ghost: 1, dragon: 1, dark: 0, steel: 0.5, fairy: 1 },
    bug: { normal: 1, fire: 0.5, water: 1, grass: 2, electric: 1, ice: 1, fighting: 0.5, poison: 1, ground: 0.5, flying: 0.5, psychic: 2, bug: 1, rock: 2, ghost: 0.5, dragon: 1, dark: 2, steel: 0.5, fairy: 0.5 },
    rock: { normal: 1, fire: 2, water: 1, grass: 1, electric: 1, ice: 2, fighting: 0.5, poison: 1, ground: 0.5, flying: 2, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1 },
    ghost: { normal: 0, fire: 1, water: 1, grass: 1, electric: 1, ice: 1, fighting: 0, poison: 0.5, ground: 1, flying: 1, psychic: 2, bug: 1, rock: 1, ghost: 2, dragon: 1, dark: 2, steel: 1, fairy: 1 },
    dragon: { normal: 1, fire: 1, water: 1, grass: 1, electric: 1, ice: 2, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 0 },
    dark: { normal: 1, fire: 1, water: 1, grass: 1, electric: 1, ice: 1, fighting: 0.5, poison: 1, ground: 1, flying: 1, psychic: 2, bug: 2, rock: 1, ghost: 0.5, dragon: 1, dark: 0.5, steel: 1, fairy: 2 },
    steel: { normal: 1, fire: 0.5, water: 0.5, grass: 1, electric: 0.5, ice: 2, fighting: 2, poison: 0, ground: 2, flying: 1, psychic: 1, bug: 0.5, rock: 0.5, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 2 },
    fairy: { normal: 1, fire: 0.5, water: 1, grass: 1, electric: 1, ice: 1, fighting: 2, poison: 0.5, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 2, steel: 0.5, fairy: 1 }
};

const nameTypesSpanish = {
    normal: "normal",
    fire: "fuego",
    water: "agua",
    grass: "planta",
    electric: "electrico",
    ice: "hielo",
    fighting: "lucha",
    poison: "veneno",
    ground: "tierra",
    flying: "volador",
    psychic: "psiquico",
    bug: "bicho",
    rock: "roca", 
    ghost: "fantasma",
    dragon: "dragon",
    dark: "siniestro",
    steel: "acero",
    fairy: "hada",
};


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
const pokemonP1IngameLifeBar = document.getElementById("pokemon-p1-ingame-bar-progress");
const pokemonP1IngameLifeBarP = document.getElementById("pokemon-p1-ingame-bar-p");
const pokemonP11Bottom = document.getElementById("pokemon-p1-1-bottom");
const pokemonP12Bottom = document.getElementById("pokemon-p1-2-bottom");
const pokemonP13Bottom = document.getElementById("pokemon-p1-3-bottom");
const pokemonP14Bottom = document.getElementById("pokemon-p1-4-bottom");
const pokemonP15Bottom = document.getElementById("pokemon-p1-5-bottom");
const pokemonP16Bottom = document.getElementById("pokemon-p1-6-bottom");


const pokeballPosition = {
    0: pokemonP11,
    1: pokemonP12,
    2: pokemonP13,
    3: pokemonP14,
    4: pokemonP15,
    5: pokemonP16,
}

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
const pokemonP2IngameLifeBar = document.getElementById("pokemon-p2-ingame-bar-progress");
const pokemonP2IngameLifeBarP = document.getElementById("pokemon-p2-ingame-bar-p");

let room;
let team1;
let team2;
let pokemonIngameP1;
let pokemonIngameP2;

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
    socket.emit('fillTeams', {team: team ,user: sessionStorage.getItem("user"), game: sessionStorage.getItem("game")})
    gameContainer.style.display = "flex";       
})

socket.on('draw-pokemons', (data) => {

    team2 = data.team
    pokemonIngameP1 = team[0];
    pokemonIngameP2 = data.team[0];
    
    nickP1.innerHTML = `${sessionStorage.getItem("user")}`;
    nickP2.innerHTML = `${data.user}`;
    
    changePokemonP1(0);

    pokemonP11Bottom.src = `${team[0].spriteFront}`
    pokemonP12Bottom.src = `${team[1].spriteFront}`
    pokemonP13Bottom.src = `${team[2].spriteFront}`
    pokemonP14Bottom.src = `${team[3].spriteFront}`
    pokemonP15Bottom.src = `${team[4].spriteFront}`
    pokemonP16Bottom.src = `${team[5].spriteFront}`

    
    pokemonP2IngameName.innerHTML = `${data.team[0].name}`
    pokemonP2IngameImg.src = `${data.team[0].spriteFront}`
    pokemonP2IngameLifeBar.max = data.team[0].hp
    pokemonP2IngameLifeBar.value = data.team[0].currentHP
    pokemonP2IngameLifeBarP.innerHTML = `${Math.floor((100*data.team[0].currentHP) / data.team[0].hp)}%`
    
})




function changePokemonP1(pokemonIndex){

    pokemonIngameP1 = team[pokemonIndex];

    pokeballPosition[pokemonIndex].src = `${team[pokemonIndex].spriteFront}`
    
    pokemonP1IngameName.innerHTML = `${team[pokemonIndex].name}`
    pokemonP1IngameImg.src = `${team[pokemonIndex].spriteBack}`
    pokemonP1IngameLifeBar.max = team[pokemonIndex].hp
    pokemonP1IngameLifeBar.value = team[pokemonIndex].currentHP
    pokemonP1IngameLifeBarP.innerHTML = `${Math.floor((100*team[pokemonIndex].currentHP) / team[pokemonIndex].hp)}%`
    
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

    socket.emit('change-pokemon', {index: pokemonIndex, user: sessionStorage.getItem("user"), game: sessionStorage.getItem("game")});
}

socket.on('change-pokemon', (data)=>{
    pokemonP2IngameName.innerHTML = `${team2[data].name}`
    pokemonP2IngameImg.src = `${team2[data].spriteFront}`
    pokemonP2IngameLifeBar.max = team2[data].hp
    pokemonP2IngameLifeBar.value = team2[data].currentHP
    pokemonP2IngameLifeBarP.innerHTML = `${Math.floor((100*team2[data].currentHP) / team2[data].hp)}%`
})

function attack(moveIndex){
    null
}

function accuracy(){
    null
}





