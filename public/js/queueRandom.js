const socket = io();
const gameContainer = document.getElementById("game-container");
const turn = document.getElementById("turn");
const eloLost = document.getElementById("elo-win");
const eloWin = document.getElementById("elo-lost");
const chosePokemon = document.getElementById("chose-pokemon");
const message = document.getElementById("msg-input");

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



const changePokemon1 = document.getElementById('pokemonP11Change');
const changePokemon2 = document.getElementById('pokemonP12Change');
const changePokemon3 = document.getElementById('pokemonP13Change');
const changePokemon4 = document.getElementById('pokemonP14Change');
const changePokemon5 = document.getElementById('pokemonP15Change');
const changePokemon6 = document.getElementById('pokemonP16Change');


const nickP1 = document.getElementById("nick-p1");
const pokemonP1Avatar = document.getElementById("pokemon-p1-avatar");
const pokemonP11 = document.getElementById("pokemon-p1-1");
const pokemonP12 = document.getElementById("pokemon-p1-2");
const pokemonP13 = document.getElementById("pokemon-p1-3");
const pokemonP14 = document.getElementById("pokemon-p1-4");
const pokemonP15 = document.getElementById("pokemon-p1-5");
const pokemonP16 = document.getElementById("pokemon-p1-6");
const pokemonP1IngameInfo = document.getElementById("pokemonIngame1");
const pokemonP1IngameName = document.getElementById("pokemon-p1-ingame-name");
const pokemonP1IngameImg =  document.getElementById("pokemon-p1-ingame-img");
const pokemonP1IngameLifeBar = document.getElementById("pokemon-p1-ingame-bar-progress");
let pokemonP1IngameLifeBarPercent = 100;
const pokemonP1IngameLifeBarP = document.getElementById("pokemon-p1-ingame-bar-p");
const pokemonP11Bottom = document.getElementById("pokemon-p1-1-bottom");
const pokemonP11BottomInfo = document.getElementById("pokemonBottom1");
const pokemonP11LifeBar = document.getElementById("pokemon-p1-1-progress");
const pokemonP12Bottom = document.getElementById("pokemon-p1-2-bottom");
const pokemonP12BottomInfo = document.getElementById("pokemonBottom2");
const pokemonP12LifeBar = document.getElementById("pokemon-p1-2-progress");
const pokemonP13Bottom = document.getElementById("pokemon-p1-3-bottom");
const pokemonP13BottomInfo = document.getElementById("pokemonBottom3");
const pokemonP13LifeBar = document.getElementById("pokemon-p1-3-progress");
const pokemonP14Bottom = document.getElementById("pokemon-p1-4-bottom");
const pokemonP14BottomInfo = document.getElementById("pokemonBottom4");
const pokemonP14LifeBar = document.getElementById("pokemon-p1-4-progress");
const pokemonP15Bottom = document.getElementById("pokemon-p1-5-bottom");
const pokemonP15BottomInfo = document.getElementById("pokemonBottom5");
const pokemonP15LifeBar = document.getElementById("pokemon-p1-5-progress");
const pokemonP16Bottom = document.getElementById("pokemon-p1-6-bottom");
const pokemonP16BottomInfo = document.getElementById("pokemonBottom6");
const pokemonP16LifeBar = document.getElementById("pokemon-p1-6-progress");


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
const move1Info = document.getElementById("move1Info");
const move2Container = document.getElementById("game-attacks-2");
const move2P = document.getElementById("move-2-p");
const move2Type = document.getElementById("move-2-type");
const move2PP = document.getElementById("move-2-pp");
const move2Info = document.getElementById("move2Info");
const move3Container = document.getElementById("game-attacks-3");
const move3P = document.getElementById("move-3-p");
const move3Type = document.getElementById("move-3-type");
const move3PP = document.getElementById("move-3-pp");
const move3Info = document.getElementById("move3Info");
const move4Container = document.getElementById("game-attacks-4");
const move4P = document.getElementById("move-4-p");
const move4Type = document.getElementById("move-4-type");
const move4PP = document.getElementById("move-4-pp");
const move4Info = document.getElementById("move4Info");


const nickP2 = document.getElementById("nick-p2");
const pokemonP2Avatar = document.getElementById("pokemon-p2-avatar");
const pokemonP21 = document.getElementById("pokemon-p2-1");
const pokemonP21Info = document.getElementById("pokemonP21");
const pokemonP22 = document.getElementById("pokemon-p2-2");
const pokemonP22Info = document.getElementById("pokemonP22");
const pokemonP23 = document.getElementById("pokemon-p2-3");
const pokemonP23Info = document.getElementById("pokemonP23");
const pokemonP24 = document.getElementById("pokemon-p2-4");
const pokemonP24Info = document.getElementById("pokemonP24");
const pokemonP25 = document.getElementById("pokemon-p2-5");
const pokemonP25Info = document.getElementById("pokemonP25");
const pokemonP26 = document.getElementById("pokemon-p2-6");
const pokemonP26Info = document.getElementById("pokemonP26");
const pokemonP2IngameInfo = document.getElementById("pokemonIngame2");
const pokemonP2IngameName = document.getElementById("pokemon-p2-ingame-name");
const pokemonP2IngameImg =  document.getElementById("pokemon-p2-ingame-img");
const pokemonP2IngameLifeBar = document.getElementById("pokemon-p2-ingame-bar-progress");
const pokemonP2IngameLifeBarP = document.getElementById("pokemon-p2-ingame-bar-p");

const pokeballPosition2 = {
    0: pokemonP21,
    1: pokemonP22,
    2: pokemonP23,
    3: pokemonP24,
    4: pokemonP25,
    5: pokemonP26,
}

let room;
let team2;
let pokemonIngameP1;
let pokemonIngameP2;
let skipTurn = false;
let roomName;
let turnNumber = 1;
let turnArray = [];





randomPick();

socket.emit('relog', sessionStorage.getItem("user"));


socket.emit("room", {user: sessionStorage.getItem("user"), room: "random"});

socket.on('nameRoom', data =>{
    roomName = data;
})

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
        team = result;
    } catch (error) {
        console.error("Error:", error);
    };   
}

socket.on('start', (data) => {
    roomName = data
    socket.emit('fillTeams', {team: team ,user: sessionStorage.getItem("user"), game: "roomsOnlineRandom", avatar: parseInt(sessionStorage.getItem("avatar"))})
    setTimeout(()=>{
        gameContainer.style.display = "flex";       
    },2000);
})

message.addEventListener ('keypress',function(e){
    // key(e);
    if (e.which === 13){
        socket.emit('chat-message', {msg: message.value, user: sessionStorage.getItem("user"), room: roomName})
    }
})

  
//function key(e) {
//    if (e.which === 13){
//        socket.emit('chat-message', {msg: message.value, user: sessionStorage.getItem("user"), room: roomName})
//    }
//}
  
socket.on('chat-message', (data)=>{
    document.getElementById('game-chat-container-mid').innerHTML=`
        ${document.getElementById('game-chat-container-mid').innerHTML}
        <div class="game-container-msg">
                ${data.user}: ${data.msg}
        </div>
    `;
})

socket.on('draw-pokemons', (data) => {

    team2 = data.team;
    pokemonIngameP1 = team[0];
    pokemonIngameP2 = data.team[0];
    
    pokemonP1Avatar.src = `/img/sprite${sessionStorage.getItem("avatar")}.png`
    pokemonP2Avatar.src = `/img/sprite${data.avatar}.png`
    nickP1.innerHTML = `${sessionStorage.getItem("user")}`;
    nickP2.innerHTML = `${data.user}`;
    
    changePokemonP1(0);

    changePokemonBottom();

    pokemonTopInfo();

    pokemonP11Bottom.src = `${team[0].spriteFront}`
    pokemonP12Bottom.src = `${team[1].spriteFront}`
    pokemonP13Bottom.src = `${team[2].spriteFront}`
    pokemonP14Bottom.src = `${team[3].spriteFront}`
    pokemonP15Bottom.src = `${team[4].spriteFront}`
    pokemonP16Bottom.src = `${team[5].spriteFront}`

    changePokemonP2(data.team[0]);
})

function pokemonTopInfo(){

    if (team2[0].type2 != null){
        pokemonP21Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team2[0].name.toUpperCase()}</p>
                <p class="${team2[0].type1} type-description" style="margin-right: 20px;">${team2[0].type1.toUpperCase()}</p>
                <p class="${team2[0].type2} type-description" >${team2[0].type2.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team2[0].currentHP) / team2[0].hp)}%</p>
                <p style="font-size: 15px;">VEL: ${team2[0].currentSpeed-(Math.floor(Math.random() * (50 - 20) + 50))} a ${team2[0].currentSpeed+(Math.floor(Math.random() * (50 - 20) + 50))}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team2[0].moves[0].revealed ? `${team2[0].moves[0].name.toUpperCase()} (${team2[0].moves[0].currentPP}/${team2[0].moves[0].pp})` : "?"}</li>
                    <li>${team2[0].moves[1].revealed ? `${team2[0].moves[1].name.toUpperCase()} (${team2[0].moves[1].currentPP}/${team2[0].moves[1].pp})` : "?"}</li>
                    <li>${team2[0].moves[2].revealed ? `${team2[0].moves[2].name.toUpperCase()} (${team2[0].moves[2].currentPP}/${team2[0].moves[2].pp})` : "?"}</li>
                    <li>${team2[0].moves[3].revealed ? `${team2[0].moves[3].name.toUpperCase()} (${team2[0].moves[3].currentPP}/${team2[0].moves[3].pp})` : "?"}</li>
                </ul>
            </div>
        `;
    } else {
        pokemonP21Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team2[0].name.toUpperCase()}</p>
                <p class="${team2[0].type1} type-description" style="margin-right: 20px;">${team2[0].type1.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team2[0].currentHP) / team2[0].hp)}%</p>
                <p style="font-size: 15px;">VEL: ${team2[0].currentSpeed-(Math.floor(Math.random() * (50 - 20) + 50))} a ${team2[0].currentSpeed+(Math.floor(Math.random() * (50 - 20) + 50))}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team2[0].moves[0].revealed ? `${team2[0].moves[0].name.toUpperCase()} (${team2[0].moves[0].currentPP}/${team2[0].moves[0].pp})` : "?"}</li>
                    <li>${team2[0].moves[1].revealed ? `${team2[0].moves[1].name.toUpperCase()} (${team2[0].moves[1].currentPP}/${team2[0].moves[1].pp})` : "?"}</li>
                    <li>${team2[0].moves[2].revealed ? `${team2[0].moves[2].name.toUpperCase()} (${team2[0].moves[2].currentPP}/${team2[0].moves[2].pp})` : "?"}</li>
                    <li>${team2[0].moves[3].revealed ? `${team2[0].moves[3].name.toUpperCase()} (${team2[0].moves[3].currentPP}/${team2[0].moves[3].pp})` : "?"}</li>
                </ul>
            </div>
        `;
    }

    if (team2[1].type2 != null){
        pokemonP22Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team2[1].name.toUpperCase()}</p>
                <p class="${team2[1].type1} type-description" style="margin-right: 20px;">${team2[1].type1.toUpperCase()}</p>
                <p class="${team2[1].type2} type-description" >${team2[1].type2.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team2[1].currentHP) / team2[1].hp)}%</p>
                <p style="font-size: 15px;">VEL: ${team2[1].currentSpeed-(Math.floor(Math.random() * (50 - 20) + 50))} a ${team2[1].currentSpeed+(Math.floor(Math.random() * (50 - 20) + 50))}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team2[1].moves[0].revealed ? `${team2[1].moves[0].name.toUpperCase()} (${team2[1].moves[0].currentPP}/${team2[1].moves[0].pp})` : "?"}</li>
                    <li>${team2[1].moves[1].revealed ? `${team2[1].moves[1].name.toUpperCase()} (${team2[1].moves[1].currentPP}/${team2[1].moves[1].pp})` : "?"}</li>
                    <li>${team2[1].moves[2].revealed ? `${team2[1].moves[2].name.toUpperCase()} (${team2[1].moves[2].currentPP}/${team2[1].moves[2].pp})` : "?"}</li>
                    <li>${team2[1].moves[3].revealed ? `${team2[1].moves[3].name.toUpperCase()} (${team2[1].moves[3].currentPP}/${team2[1].moves[3].pp})` : "?"}</li>
                </ul>
            </div>
        `;
    } else {
        pokemonP22Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team2[1].name.toUpperCase()}</p>
                <p class="${team2[1].type1} type-description" style="margin-right: 20px;">${team2[1].type1.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team2[1].currentHP) / team2[1].hp)}%</p>
                <p style="font-size: 15px;">VEL: ${team2[1].currentSpeed-(Math.floor(Math.random() * (50 - 20) + 50))} a ${team2[1].currentSpeed+(Math.floor(Math.random() * (50 - 20) + 50))}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team2[1].moves[0].revealed ? `${team2[1].moves[0].name.toUpperCase()} (${team2[1].moves[0].currentPP}/${team2[1].moves[0].pp})` : "?"}</li>
                    <li>${team2[1].moves[1].revealed ? `${team2[1].moves[1].name.toUpperCase()} (${team2[1].moves[1].currentPP}/${team2[1].moves[1].pp})` : "?"}</li>
                    <li>${team2[1].moves[2].revealed ? `${team2[1].moves[2].name.toUpperCase()} (${team2[1].moves[2].currentPP}/${team2[1].moves[2].pp})` : "?"}</li>
                    <li>${team2[1].moves[3].revealed ? `${team2[1].moves[3].name.toUpperCase()} (${team2[1].moves[3].currentPP}/${team2[1].moves[3].pp})` : "?"}</li>
                </ul>
            </div>
        `;
    }

    if (team2[2].type2 != null){
        pokemonP23Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team2[2].name.toUpperCase()}</p>
                <p class="${team2[2].type1} type-description" style="margin-right: 20px;">${team2[2].type1.toUpperCase()}</p>
                <p class="${team2[2].type2} type-description" >${team2[2].type2.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team2[2].currentHP) / team2[2].hp)}%</p>
                <p style="font-size: 15px;">VEL: ${team2[2].currentSpeed-(Math.floor(Math.random() * (50 - 20) + 50))} a ${team2[2].currentSpeed+(Math.floor(Math.random() * (50 - 20) + 50))}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team2[2].moves[0].revealed ? `${team2[2].moves[0].name.toUpperCase()} (${team2[2].moves[0].currentPP}/${team2[2].moves[0].pp})` : "?"}</li>
                    <li>${team2[2].moves[1].revealed ? `${team2[2].moves[1].name.toUpperCase()} (${team2[2].moves[1].currentPP}/${team2[2].moves[1].pp})` : "?"}</li>
                    <li>${team2[2].moves[2].revealed ? `${team2[2].moves[2].name.toUpperCase()} (${team2[2].moves[2].currentPP}/${team2[2].moves[2].pp})` : "?"}</li>
                    <li>${team2[2].moves[3].revealed ? `${team2[2].moves[3].name.toUpperCase()} (${team2[2].moves[3].currentPP}/${team2[2].moves[3].pp})` : "?"}</li>
                </ul>
            </div>
        `;
    } else {
        pokemonP23Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team2[2].name.toUpperCase()}</p>
                <p class="${team2[2].type1} type-description" style="margin-right: 20px;">${team2[2].type1.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team2[2].currentHP) / team2[2].hp)}%</p>
                <p style="font-size: 15px;">VEL: ${team2[2].currentSpeed-30} a ${team2[2].currentSpeed+30}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team2[2].moves[0].revealed ? `${team2[2].moves[0].name.toUpperCase()} (${team2[2].moves[0].currentPP}/${team2[2].moves[0].pp})` : "?"}</li>
                    <li>${team2[2].moves[1].revealed ? `${team2[2].moves[1].name.toUpperCase()} (${team2[2].moves[1].currentPP}/${team2[2].moves[1].pp})` : "?"}</li>
                    <li>${team2[2].moves[2].revealed ? `${team2[2].moves[2].name.toUpperCase()} (${team2[2].moves[2].currentPP}/${team2[2].moves[2].pp})` : "?"}</li>
                    <li>${team2[2].moves[3].revealed ? `${team2[2].moves[3].name.toUpperCase()} (${team2[2].moves[3].currentPP}/${team2[2].moves[3].pp})` : "?"}</li>
                </ul>
            </div>
        `;
    }

    if (team2[3].type2 != null){
        pokemonP24Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team2[3].name.toUpperCase()}</p>
                <p class="${team2[3].type1} type-description" style="margin-right: 20px;">${team2[3].type1.toUpperCase()}</p>
                <p class="${team2[3].type2} type-description" >${team2[3].type2.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team2[3].currentHP) / team2[3].hp)}%</p>
                <p style="font-size: 15px;">VEL: ${team2[3].currentSpeed-(Math.floor(Math.random() * (50 - 20) + 50))} a ${team2[3].currentSpeed+(Math.floor(Math.random() * (50 - 20) + 50))}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team2[3].moves[0].revealed ? `${team2[3].moves[0].name.toUpperCase()} (${team2[3].moves[0].currentPP}/${team2[3].moves[0].pp})` : "?"}</li>
                    <li>${team2[3].moves[1].revealed ? `${team2[3].moves[1].name.toUpperCase()} (${team2[3].moves[1].currentPP}/${team2[3].moves[1].pp})` : "?"}</li>
                    <li>${team2[3].moves[2].revealed ? `${team2[3].moves[2].name.toUpperCase()} (${team2[3].moves[2].currentPP}/${team2[3].moves[2].pp})` : "?"}</li>
                    <li>${team2[3].moves[3].revealed ? `${team2[3].moves[3].name.toUpperCase()} (${team2[3].moves[3].currentPP}/${team2[3].moves[3].pp})` : "?"}</li>
                </ul>
            </div>
        `;
    } else {
        pokemonP24Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team2[3].name.toUpperCase()}</p>
                <p class="${team2[3].type1} type-description" style="margin-right: 20px;">${team2[3].type1.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team2[3].currentHP) / team2[3].hp)}%</p>
                <p style="font-size: 15px;">VEL: ${team2[3].currentSpeed-30} a ${team2[3].currentSpeed+30}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team2[3].moves[0].revealed ? `${team2[3].moves[0].name.toUpperCase()} (${team2[3].moves[0].currentPP}/${team2[3].moves[0].pp})` : "?"}</li>
                    <li>${team2[3].moves[1].revealed ? `${team2[3].moves[1].name.toUpperCase()} (${team2[3].moves[1].currentPP}/${team2[3].moves[1].pp})` : "?"}</li>
                    <li>${team2[3].moves[2].revealed ? `${team2[3].moves[2].name.toUpperCase()} (${team2[3].moves[2].currentPP}/${team2[3].moves[2].pp})` : "?"}</li>
                    <li>${team2[3].moves[3].revealed ? `${team2[3].moves[3].name.toUpperCase()} (${team2[3].moves[3].currentPP}/${team2[3].moves[3].pp})` : "?"}</li>
                </ul>
            </div>
        `;
    }

    if (team2[4].type2 != null){
        pokemonP25Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team2[4].name.toUpperCase()}</p>
                <p class="${team2[4].type1} type-description" style="margin-right: 20px;">${team2[4].type1.toUpperCase()}</p>
                <p class="${team2[4].type2} type-description" >${team2[4].type2.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team2[4].currentHP) / team2[4].hp)}%</p>
                <p style="font-size: 15px;">VEL: ${team2[4].currentSpeed-(Math.floor(Math.random() * (50 - 20) + 50))} a ${team2[4].currentSpeed+(Math.floor(Math.random() * (50 - 20) + 50))}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team2[4].moves[0].revealed ? `${team2[4].moves[0].name.toUpperCase()} (${team2[4].moves[0].currentPP}/${team2[4].moves[0].pp})` : "?"}</li>
                    <li>${team2[4].moves[1].revealed ? `${team2[4].moves[1].name.toUpperCase()} (${team2[4].moves[1].currentPP}/${team2[4].moves[1].pp})` : "?"}</li>
                    <li>${team2[4].moves[2].revealed ? `${team2[4].moves[2].name.toUpperCase()} (${team2[4].moves[2].currentPP}/${team2[4].moves[2].pp})` : "?"}</li>
                    <li>${team2[4].moves[3].revealed ? `${team2[4].moves[3].name.toUpperCase()} (${team2[4].moves[3].currentPP}/${team2[4].moves[3].pp})` : "?"}</li>
                </ul>
            </div>
        `;
    } else {
        pokemonP25Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team2[4].name.toUpperCase()}</p>
                <p class="${team2[4].type1} type-description" style="margin-right: 20px;">${team2[4].type1.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team2[4].currentHP) / team2[4].hp)}%</p>
                <p style="font-size: 15px;">VEL: ${team2[4].currentSpeed-30} a ${team2[4].currentSpeed+30}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team2[4].moves[0].revealed ? `${team2[4].moves[0].name.toUpperCase()} (${team2[4].moves[0].currentPP}/${team2[4].moves[0].pp})` : "?"}</li>
                    <li>${team2[4].moves[1].revealed ? `${team2[4].moves[1].name.toUpperCase()} (${team2[4].moves[1].currentPP}/${team2[4].moves[1].pp})` : "?"}</li>
                    <li>${team2[4].moves[2].revealed ? `${team2[4].moves[2].name.toUpperCase()} (${team2[4].moves[2].currentPP}/${team2[4].moves[2].pp})` : "?"}</li>
                    <li>${team2[4].moves[3].revealed ? `${team2[4].moves[3].name.toUpperCase()} (${team2[4].moves[3].currentPP}/${team2[4].moves[3].pp})` : "?"}</li>
                </ul>
            </div>
        `;
    }

    if (team2[5].type2 != null){
        pokemonP26Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team2[5].name.toUpperCase()}</p>
                <p class="${team2[5].type1} type-description" style="margin-right: 20px;">${team2[5].type1.toUpperCase()}</p>
                <p class="${team2[5].type2} type-description" >${team2[5].type2.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team2[5].currentHP) / team2[5].hp)}%</p>
                <p style="font-size: 15px;">VEL: ${team2[5].currentSpeed-(Math.floor(Math.random() * (50 - 20) + 50))} a ${team2[5].currentSpeed+(Math.floor(Math.random() * (50 - 20) + 50))}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team2[5].moves[0].revealed ? `${team2[5].moves[0].name.toUpperCase()} (${team2[5].moves[0].currentPP}/${team2[5].moves[0].pp})` : "?"}</li>
                    <li>${team2[5].moves[1].revealed ? `${team2[5].moves[1].name.toUpperCase()} (${team2[5].moves[1].currentPP}/${team2[5].moves[1].pp})` : "?"}</li>
                    <li>${team2[5].moves[2].revealed ? `${team2[5].moves[2].name.toUpperCase()} (${team2[5].moves[2].currentPP}/${team2[5].moves[2].pp})` : "?"}</li>
                    <li>${team2[5].moves[3].revealed ? `${team2[5].moves[3].name.toUpperCase()} (${team2[5].moves[3].currentPP}/${team2[5].moves[3].pp})` : "?"}</li>
                </ul>
            </div>
        `;
    } else {
        pokemonP26Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team2[5].name.toUpperCase()}</p>
                <p class="${team2[5].type1} type-description" style="margin-right: 20px;">${team2[5].type1.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team2[5].currentHP) / team2[5].hp)}%</p>
                <p style="font-size: 15px;">VEL: ${team2[5].currentSpeed-30} a ${team2[5].currentSpeed+30}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team2[5].moves[0].revealed ? `${team2[5].moves[0].name.toUpperCase()} (${team2[5].moves[0].currentPP}/${team2[5].moves[0].pp})` : "?"}</li>
                    <li>${team2[5].moves[1].revealed ? `${team2[5].moves[1].name.toUpperCase()} (${team2[5].moves[1].currentPP}/${team2[5].moves[1].pp})` : "?"}</li>
                    <li>${team2[5].moves[2].revealed ? `${team2[5].moves[2].name.toUpperCase()} (${team2[5].moves[2].currentPP}/${team2[5].moves[2].pp})` : "?"}</li>
                    <li>${team2[5].moves[3].revealed ? `${team2[5].moves[3].name.toUpperCase()} (${team2[5].moves[3].currentPP}/${team2[5].moves[3].pp})` : "?"}</li>
                </ul>
            </div>
        `;
    }
}

function changePokemonP1(pokemonIndex){

    pokemonIngameP1 = team[pokemonIndex];
    
    if (pokemonIngameP1.type2 != null){
        pokemonP1IngameInfo.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${pokemonIngameP1.name.toUpperCase()}</p>
                <p class="${pokemonIngameP1.type1} type-description" style="margin-right: 20px;">${pokemonIngameP1.type1.toUpperCase()}</p>
                <p class="${pokemonIngameP1.type2} type-description">${pokemonIngameP1.type2.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*pokemonIngameP1.currentHP) / pokemonIngameP1.hp)}% (${pokemonIngameP1.currentHP}/${pokemonIngameP1.hp})</p>
                <p style="font-size: 12px;">ATQ: ${pokemonIngameP1.currentAttack} / DEF: ${pokemonIngameP1.currentDefense} / ATQSP: ${pokemonIngameP1.currentSpecialAttack} / DEFSP: ${pokemonIngameP1.currentSpecialDefense} / VEL: ${pokemonIngameP1.currentSpeed}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${pokemonIngameP1.moves[0].name.toUpperCase()} (${pokemonIngameP1.moves[0].currentPP}/${pokemonIngameP1.moves[0].pp})</li>
                    <li>${pokemonIngameP1.moves[1].name.toUpperCase()} (${pokemonIngameP1.moves[1].currentPP}/${pokemonIngameP1.moves[1].pp})</li>
                    <li>${pokemonIngameP1.moves[2].name.toUpperCase()} (${pokemonIngameP1.moves[2].currentPP}/${pokemonIngameP1.moves[2].pp})</li>
                    <li>${pokemonIngameP1.moves[3].name.toUpperCase()} (${pokemonIngameP1.moves[3].currentPP}/${pokemonIngameP1.moves[3].pp})</li>
                </ul>
            </div>
        `
    } else {
        pokemonP1IngameInfo.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${pokemonIngameP1.name.toUpperCase()}</p>
                <p class="${pokemonIngameP1.type1} type-description" style="margin-right: 20px;">${pokemonIngameP1.type1.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*pokemonIngameP1.currentHP) / pokemonIngameP1.hp)}% (${pokemonIngameP1.currentHP}/${pokemonIngameP1.hp})</p>
                <p style="font-size: 12px;">ATQ: ${pokemonIngameP1.currentAttack} / DEF: ${pokemonIngameP1.currentDefense} / ATQSP: ${pokemonIngameP1.currentSpecialAttack} / DEFSP: ${pokemonIngameP1.currentSpecialDefense} / VEL: ${pokemonIngameP1.currentSpeed}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${pokemonIngameP1.moves[0].name.toUpperCase()} (${pokemonIngameP1.moves[0].currentPP}/${pokemonIngameP1.moves[0].pp})</li>
                    <li>${pokemonIngameP1.moves[1].name.toUpperCase()} (${pokemonIngameP1.moves[1].currentPP}/${pokemonIngameP1.moves[1].pp})</li>
                    <li>${pokemonIngameP1.moves[2].name.toUpperCase()} (${pokemonIngameP1.moves[2].currentPP}/${pokemonIngameP1.moves[2].pp})</li>
                    <li>${pokemonIngameP1.moves[3].name.toUpperCase()} (${pokemonIngameP1.moves[3].currentPP}/${pokemonIngameP1.moves[3].pp})</li>
                </ul>
            </div>
        `
    }


    pokeballPosition[   pokemonIndex].src = `${pokemonIngameP1.spriteFront}`
    pokeballPosition[pokemonIndex].style.height = '100%';

    pokemonP1IngameName.innerHTML = `${pokemonIngameP1.name}`
    pokemonP1IngameImg.src = `${pokemonIngameP1.spriteBack}`
    pokemonP1IngameLifeBar.style.width = `${Math.floor((100*pokemonIngameP1.currentHP) / pokemonIngameP1.hp)}%`
    pokemonP1IngameLifeBarP.innerHTML = `${Math.floor((100*pokemonIngameP1.currentHP) / pokemonIngameP1.hp)}%`
    
    move1Container.className  = `${pokemonIngameP1.moves[0].type} game-attacks`
    move1P.innerHTML = `${pokemonIngameP1.moves[0].name}`
    move1Type.innerHTML = `${pokemonIngameP1.moves[0].type}`
    move1PP.innerHTML = `${pokemonIngameP1.moves[0].pp}/${pokemonIngameP1.moves[0].pp}`
    if (pokemonIngameP1.moves[0].accuracy == null){
        pokemonIngameP1.moves[0].accuracy = 100;
    }
    if (pokemonIngameP1.moves[0].power == null){
        pokemonIngameP1.moves[0].power = "-";
    }
    if (pokemonIngameP1.moves[0].damageClass == "status"){
        move1Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${pokemonIngameP1.moves[0].name.toUpperCase()}</p>
                <p class="${pokemonIngameP1.moves[0].type} type-description" style="margin-right: 20px;">${pokemonIngameP1.moves[0].type.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">POWER: ${pokemonIngameP1.moves[0].power}</p>
                <p style="font-size: 15px;">ACCURACY: ${pokemonIngameP1.moves[0].accuracy}%</p>
            </div>
            <div class="pop-up-moves">
                ${pokemonIngameP1.moves[0].description}
            </div>
        `
    } else {
        move1Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${pokemonIngameP1.moves[0].name.toUpperCase()}</p>
                <p class="${pokemonIngameP1.moves[0].type} type-description" style="margin-right: 20px;">${pokemonIngameP1.moves[0].type.toUpperCase()}</p>
                <p class="${pokemonIngameP1.moves[0].damageClass}">${pokemonIngameP1.moves[0].damageClass.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">POWER: ${pokemonIngameP1.moves[0].power}</p>
                <p style="font-size: 15px;">ACCURACY: ${pokemonIngameP1.moves[0].accuracy}%</p>
            </div>
            <div class="pop-up-moves">
                ${pokemonIngameP1.moves[0].description}
            </div>
        `
    }
    
    

    move2Container.className  = `${pokemonIngameP1.moves[1].type} game-attacks`
    move2P.innerHTML = `${pokemonIngameP1.moves[1].name}`
    move2Type.innerHTML = `${pokemonIngameP1.moves[1].type}`
    move2PP.innerHTML = `${pokemonIngameP1.moves[1].pp}/${pokemonIngameP1.moves[1].pp}`
    if (pokemonIngameP1.moves[1].accuracy == null){
        pokemonIngameP1.moves[1].accuracy = 100;
    }
    if (pokemonIngameP1.moves[1].power == null){
        pokemonIngameP1.moves[1].power = "-";
    }
    if (pokemonIngameP1.moves[1].damageClass == "status"){
        move2Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${pokemonIngameP1.moves[1].name.toUpperCase()}</p>
                <p class="${pokemonIngameP1.moves[1].type} type-description" style="margin-right: 20px;">${pokemonIngameP1.moves[1].type.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">POWER: ${pokemonIngameP1.moves[1].power}</p>
                <p style="font-size: 15px;">ACCURACY: ${pokemonIngameP1.moves[1].accuracy}%</p>
            </div>
            <div class="pop-up-moves">
                ${pokemonIngameP1.moves[1].description}
            </div>
        `
    } else {
        move2Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${pokemonIngameP1.moves[1].name.toUpperCase()}</p>
                <p class="${pokemonIngameP1.moves[1].type} type-description" style="margin-right: 20px;">${pokemonIngameP1.moves[1].type.toUpperCase()}</p>
                <p class="${pokemonIngameP1.moves[1].damageClass}">${pokemonIngameP1.moves[1].damageClass.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">POWER: ${pokemonIngameP1.moves[1].power}</p>
                <p style="font-size: 15px;">ACCURACY: ${pokemonIngameP1.moves[1].accuracy}%</p>
            </div>
            <div class="pop-up-moves">
                ${pokemonIngameP1.moves[1].description}
            </div>
        `
    }
    

    move3Container.className  = `${pokemonIngameP1.moves[2].type} game-attacks`
    move3P.innerHTML = `${pokemonIngameP1.moves[2].name}`
    move3Type.innerHTML = `${pokemonIngameP1.moves[2].type}`
    move3PP.innerHTML = `${pokemonIngameP1.moves[2].pp}/${pokemonIngameP1.moves[2].pp}`
    if (pokemonIngameP1.moves[2].accuracy == null){
        pokemonIngameP1.moves[2].accuracy = 100;
    }
    if (pokemonIngameP1.moves[2].power == null){
        pokemonIngameP1.moves[2].power = "-";
    }
    if (pokemonIngameP1.moves[2].damageClass == "status"){
        move3Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${pokemonIngameP1.moves[2].name.toUpperCase()}</p>
                <p class="${pokemonIngameP1.moves[2].type} type-description" style="margin-right: 20px;">${pokemonIngameP1.moves[2].type.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">POWER: ${pokemonIngameP1.moves[2].power}</p>
                <p style="font-size: 15px;">ACCURACY: ${pokemonIngameP1.moves[2].accuracy}%</p>
            </div>
            <div class="pop-up-moves">
                ${pokemonIngameP1.moves[2].description}
            </div>
        `
    } else {
        move3Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${pokemonIngameP1.moves[2].name.toUpperCase()}</p>
                <p class="${pokemonIngameP1.moves[2].type} type-description" style="margin-right: 20px;">${pokemonIngameP1.moves[2].type.toUpperCase()}</p>
                <p class="${pokemonIngameP1.moves[2].damageClass}">${pokemonIngameP1.moves[2].damageClass.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">POWER: ${pokemonIngameP1.moves[2].power}</p>
                <p style="font-size: 15px;">ACCURACY: ${pokemonIngameP1.moves[2].accuracy}%</p>
            </div>
            <div class="pop-up-moves">
                ${pokemonIngameP1.moves[2].description}
            </div>
        `
    }
    

    move4Container.className  = `${pokemonIngameP1.moves[3].type} game-attacks`
    move4P.innerHTML = `${pokemonIngameP1.moves[3].name}`
    move4Type.innerHTML = `${pokemonIngameP1.moves[3].type}`
    move4PP.innerHTML = `${pokemonIngameP1.moves[3].pp}/${pokemonIngameP1.moves[3].pp}`
    if (pokemonIngameP1.moves[3].accuracy == null){
        pokemonIngameP1.moves[3].accuracy = 100;
    }
    if (pokemonIngameP1.moves[3].power == null){
        pokemonIngameP1.moves[3].power = "-";
    }
    if (pokemonIngameP1.moves[3].damageClass == "status"){
        move4Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${pokemonIngameP1.moves[3].name.toUpperCase()}</p>
                <p class="${pokemonIngameP1.moves[3].type} type-description" style="margin-right: 20px;">${pokemonIngameP1.moves[3].type.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">POWER: ${pokemonIngameP1.moves[3].power}</p>
                <p style="font-size: 15px;">ACCURACY: ${pokemonIngameP1.moves[3].accuracy}%</p>
            </div>
            <div class="pop-up-moves">
                ${pokemonIngameP1.moves[3].description}
            </div>
        `
    } else {
        move4Info.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${pokemonIngameP1.moves[3].name.toUpperCase()}</p>
                <p class="${pokemonIngameP1.moves[3].type} type-description" style="margin-right: 20px;">${pokemonIngameP1.moves[3].type.toUpperCase()}</p>
                <p class="${pokemonIngameP1.moves[3].damageClass}">${pokemonIngameP1.moves[3].damageClass.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">POWER: ${pokemonIngameP1.moves[3].power}</p>
                <p style="font-size: 15px;">ACCURACY: ${pokemonIngameP1.moves[3].accuracy}%</p>
            </div>
            <div class="pop-up-moves">
                ${pokemonIngameP1.moves[3].description}
            </div>
        `

    }
    
    socket.emit('change-pokemon', {index: pokemonIndex, user: sessionStorage.getItem("user"), game: "roomsOnlineRandom"});
}



function changePokemonBottom(){

    pokemonP11LifeBar.value = team[0].currentHP;
    pokemonP11LifeBar.max = team[0].hp;
    pokemonP12LifeBar.value = team[1].currentHP
    pokemonP12LifeBar.max = team[1].hp;
    pokemonP13LifeBar.value = team[2].currentHP
    pokemonP13LifeBar.max = team[2].hp;
    pokemonP14LifeBar.value = team[3].currentHP
    pokemonP14LifeBar.max = team[3].hp;
    pokemonP15LifeBar.value = team[4].currentHP
    pokemonP15LifeBar.max = team[4].hp;
    pokemonP16LifeBar.value = team[5].currentHP
    pokemonP16LifeBar.max = team[5].hp;

    if (team[0].type2 == null){
        pokemonP11BottomInfo.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team[0].name.toUpperCase()}</p>
                <p class="${team[0].type1} type-description" style="margin-right: 20px;">${team[0].type1.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team[0].currentHP) / team[0].hp)}% (${team[0].currentHP}/ ${team[0].hp})</p>
                <p style="font-size: 12px;">ATQ: ${team[0].currentAttack} / DEF: ${team[0].currentDefense} / ATQSP: ${team[0].currentSpecialAttack} / DEFSP: ${team[0].currentSpecialDefense} / VEL: ${team[0].currentSpeed}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team[0].moves[0].name.toUpperCase()} (${team[0].moves[0].currentPP}/${team[0].moves[0].pp})</li>
                    <li>${team[0].moves[1].name.toUpperCase()} (${team[0].moves[1].currentPP}/${team[0].moves[1].pp})</li>
                    <li>${team[0].moves[2].name.toUpperCase()} (${team[0].moves[2].currentPP}/${team[0].moves[2].pp})</li>
                    <li>${team[0].moves[3].name.toUpperCase()} (${team[0].moves[3].currentPP}/${team[0].moves[3].pp})</li>
                </ul>
            </div>    
        `;
    } else {
        pokemonP11BottomInfo.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team[0].name.toUpperCase()}</p>
                <p class="${team[0].type1} type-description" style="margin-right: 20px;">${team[0].type1.toUpperCase()}</p>
                <p class="${team[0].type2} type-description" style="margin-right: 20px;">${team[0].type2.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team[0].currentHP) / team[0].hp)}% (${team[0].currentHP}/ ${team[0].hp})</p>
                <p style="font-size: 12px;">ATQ: ${team[0].currentAttack} / DEF: ${team[0].currentDefense} / ATQSP: ${team[0].currentSpecialAttack} / DEFSP: ${team[0].currentSpecialDefense} / VEL: ${team[0].currentSpeed}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team[0].moves[0].name.toUpperCase()} (${team[0].moves[0].currentPP}/${team[0].moves[0].pp})</li>
                    <li>${team[0].moves[1].name.toUpperCase()} (${team[0].moves[1].currentPP}/${team[0].moves[1].pp})</li>
                    <li>${team[0].moves[2].name.toUpperCase()} (${team[0].moves[2].currentPP}/${team[0].moves[2].pp})</li>
                    <li>${team[0].moves[3].name.toUpperCase()} (${team[0].moves[3].currentPP}/${team[0].moves[3].pp})</li>
                </ul>
            </div>    
        `;
    }

    if (team[1].type2 == null){
        pokemonP12BottomInfo.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team[1].name.toUpperCase()}</p>
                <p class="${team[1].type1} type-description" style="margin-right: 20px;">${team[1].type1.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team[1].currentHP) / team[1].hp)}% (${team[1].currentHP}/ ${team[1].hp})</p>
                <p style="font-size: 12px;">ATQ: ${team[1].currentAttack} / DEF: ${team[1].currentDefense} / ATQSP: ${team[1].currentSpecialAttack} / DEFSP: ${team[1].currentSpecialDefense} / VEL: ${team[1].currentSpeed}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team[1].moves[0].name.toUpperCase()} (${team[1].moves[0].currentPP}/${team[1].moves[0].pp})</li>
                    <li>${team[1].moves[1].name.toUpperCase()} (${team[1].moves[1].currentPP}/${team[1].moves[1].pp})</li>
                    <li>${team[1].moves[2].name.toUpperCase()} (${team[1].moves[2].currentPP}/${team[1].moves[2].pp})</li>
                    <li>${team[1].moves[3].name.toUpperCase()} (${team[1].moves[3].currentPP}/${team[1].moves[3].pp})</li>
                </ul>
            </div>    
        `;
    } else {
        pokemonP12BottomInfo.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team[1].name.toUpperCase()}</p>
                <p class="${team[1].type1} type-description" style="margin-right: 20px;">${team[1].type1.toUpperCase()}</p>
                <p class="${team[1].type2} type-description" style="margin-right: 20px;">${team[1].type2.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team[1].currentHP) / team[1].hp)}% (${team[1].currentHP}/ ${team[1].hp})</p>
                <p style="font-size: 12px;">ATQ: ${team[1].currentAttack} / DEF: ${team[1].currentDefense} / ATQSP: ${team[1].currentSpecialAttack} / DEFSP: ${team[1].currentSpecialDefense} / VEL: ${team[1].currentSpeed}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team[1].moves[0].name.toUpperCase()} (${team[1].moves[0].currentPP}/${team[1].moves[0].pp})</li>
                    <li>${team[1].moves[1].name.toUpperCase()} (${team[1].moves[1].currentPP}/${team[1].moves[1].pp})</li>
                    <li>${team[1].moves[2].name.toUpperCase()} (${team[1].moves[2].currentPP}/${team[1].moves[2].pp})</li>
                    <li>${team[1].moves[3].name.toUpperCase()} (${team[1].moves[3].currentPP}/${team[1].moves[3].pp})</li>
                </ul>
            </div>    
        `;
    }

    if (team[2].type2 == null){
        pokemonP13BottomInfo.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team[2].name.toUpperCase()}</p>
                <p class="${team[2].type1} type-description" style="margin-right: 20px;">${team[2].type1.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team[2].currentHP) / team[2].hp)}% (${team[2].currentHP}/ ${team[2].hp})</p>
                <p style="font-size: 12px;">ATQ: ${team[2].currentAttack} / DEF: ${team[2].currentDefense} / ATQSP: ${team[2].currentSpecialAttack} / DEFSP: ${team[2].currentSpecialDefense} / VEL: ${team[2].currentSpeed}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team[2].moves[0].name.toUpperCase()} (${team[2].moves[0].currentPP}/${team[2].moves[0].pp})</li>
                    <li>${team[2].moves[1].name.toUpperCase()} (${team[2].moves[1].currentPP}/${team[2].moves[1].pp})</li>
                    <li>${team[2].moves[2].name.toUpperCase()} (${team[2].moves[2].currentPP}/${team[2].moves[2].pp})</li>
                    <li>${team[2].moves[3].name.toUpperCase()} (${team[2].moves[3].currentPP}/${team[2].moves[3].pp})</li>
                </ul>
            </div>    
        `;
    } else {
        pokemonP13BottomInfo.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team[2].name.toUpperCase()}</p>
                <p class="${team[2].type1} type-description" style="margin-right: 20px;">${team[2].type1.toUpperCase()}</p>
                <p class="${team[2].type2} type-description" style="margin-right: 20px;">${team[2].type2.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team[2].currentHP) / team[2].hp)}% (${team[2].currentHP}/ ${team[2].hp})</p>
                <p style="font-size: 12px;">ATQ: ${team[2].currentAttack} / DEF: ${team[2].currentDefense} / ATQSP: ${team[2].currentSpecialAttack} / DEFSP: ${team[2].currentSpecialDefense} / VEL: ${team[2].currentSpeed}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team[2].moves[0].name.toUpperCase()} (${team[2].moves[0].currentPP}/${team[2].moves[0].pp})</li>
                    <li>${team[2].moves[1].name.toUpperCase()} (${team[2].moves[1].currentPP}/${team[2].moves[1].pp})</li>
                    <li>${team[2].moves[2].name.toUpperCase()} (${team[2].moves[2].currentPP}/${team[2].moves[2].pp})</li>
                    <li>${team[2].moves[3].name.toUpperCase()} (${team[2].moves[3].currentPP}/${team[2].moves[3].pp})</li>
                </ul>
            </div>    
        `;
    }

    if (team[3].type2 == null){
        pokemonP14BottomInfo.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team[3].name.toUpperCase()}</p>
                <p class="${team[3].type1} type-description" style="margin-right: 20px;">${team[3].type1.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team[3].currentHP) / team[3].hp)}% (${team[3].currentHP}/ ${team[3].hp})</p>
                <p style="font-size: 12px;">ATQ: ${team[3].currentAttack} / DEF: ${team[3].currentDefense} / ATQSP: ${team[3].currentSpecialAttack} / DEFSP: ${team[3].currentSpecialDefense} / VEL: ${team[3].currentSpeed}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team[3].moves[0].name.toUpperCase()} (${team[3].moves[0].currentPP}/${team[3].moves[0].pp})</li>
                    <li>${team[3].moves[1].name.toUpperCase()} (${team[3].moves[1].currentPP}/${team[3].moves[1].pp})</li>
                    <li>${team[3].moves[2].name.toUpperCase()} (${team[3].moves[2].currentPP}/${team[3].moves[2].pp})</li>
                    <li>${team[3].moves[3].name.toUpperCase()} (${team[3].moves[3].currentPP}/${team[3].moves[3].pp})</li>
                </ul>
            </div>    
        `;
    } else {
        pokemonP14BottomInfo.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team[3].name.toUpperCase()}</p>
                <p class="${team[3].type1} type-description" style="margin-right: 20px;">${team[3].type1.toUpperCase()}</p>
                <p class="${team[3].type2} type-description" style="margin-right: 20px;">${team[3].type2.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team[3].currentHP) / team[3].hp)}% (${team[3].currentHP}/ ${team[3].hp})</p>
                <p style="font-size: 12px;">ATQ: ${team[3].currentAttack} / DEF: ${team[3].currentDefense} / ATQSP: ${team[3].currentSpecialAttack} / DEFSP: ${team[3].currentSpecialDefense} / VEL: ${team[3].currentSpeed}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team[3].moves[0].name.toUpperCase()} (${team[3].moves[0].currentPP}/${team[3].moves[0].pp})</li>
                    <li>${team[3].moves[1].name.toUpperCase()} (${team[3].moves[1].currentPP}/${team[3].moves[1].pp})</li>
                    <li>${team[3].moves[2].name.toUpperCase()} (${team[3].moves[2].currentPP}/${team[3].moves[2].pp})</li>
                    <li>${team[3].moves[3].name.toUpperCase()} (${team[3].moves[3].currentPP}/${team[3].moves[3].pp})</li>
                </ul>
            </div>    
        `;
    }

    if (team[4].type2 == null){
        pokemonP15BottomInfo.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team[4].name.toUpperCase()}</p>
                <p class="${team[4].type1} type-description" style="margin-right: 20px;">${team[4].type1.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team[4].currentHP) / team[4].hp)}% (${team[4].currentHP}/ ${team[4].hp})</p>
                <p style="font-size: 12px;">ATQ: ${team[4].currentAttack} / DEF: ${team[4].currentDefense} / ATQSP: ${team[4].currentSpecialAttack} / DEFSP: ${team[4].currentSpecialDefense} / VEL: ${team[4].currentSpeed}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team[4].moves[0].name.toUpperCase()} (${team[4].moves[0].currentPP}/${team[4].moves[0].pp})</li>
                    <li>${team[4].moves[1].name.toUpperCase()} (${team[4].moves[1].currentPP}/${team[4].moves[1].pp})</li>
                    <li>${team[4].moves[2].name.toUpperCase()} (${team[4].moves[2].currentPP}/${team[4].moves[2].pp})</li>
                    <li>${team[4].moves[3].name.toUpperCase()} (${team[4].moves[3].currentPP}/${team[4].moves[3].pp})</li>
                </ul>
            </div>    
        `;
    } else {
        pokemonP15BottomInfo.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team[4].name.toUpperCase()}</p>
                <p class="${team[4].type1} type-description" style="margin-right: 20px;">${team[4].type1.toUpperCase()}</p>
                <p class="${team[4].type2} type-description" style="margin-right: 20px;">${team[4].type2.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team[4].currentHP) / team[4].hp)}% (${team[4].currentHP}/ ${team[4].hp})</p>
                <p style="font-size: 12px;">ATQ: ${team[4].currentAttack} / DEF: ${team[4].currentDefense} / ATQSP: ${team[4].currentSpecialAttack} / DEFSP: ${team[4].currentSpecialDefense} / VEL: ${team[4].currentSpeed}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team[4].moves[0].name.toUpperCase()} (${team[4].moves[0].currentPP}/${team[4].moves[0].pp})</li>
                    <li>${team[4].moves[1].name.toUpperCase()} (${team[4].moves[1].currentPP}/${team[4].moves[1].pp})</li>
                    <li>${team[4].moves[2].name.toUpperCase()} (${team[4].moves[2].currentPP}/${team[4].moves[2].pp})</li>
                    <li>${team[4].moves[3].name.toUpperCase()} (${team[4].moves[3].currentPP}/${team[4].moves[3].pp})</li>
                </ul>
            </div>    
        `;
    }

    if (team[5].type2 == null){
        pokemonP16BottomInfo.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team[5].name.toUpperCase()}</p>
                <p class="${team[5].type1} type-description" style="margin-right: 20px;">${team[5].type1.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team[5].currentHP) / team[5].hp)}% (${team[5].currentHP}/ ${team[5].hp})</p>
                <p style="font-size: 12px;">ATQ: ${team[5].currentAttack} / DEF: ${team[5].currentDefense} / ATQSP: ${team[5].currentSpecialAttack} / DEFSP: ${team[5].currentSpecialDefense} / VEL: ${team[5].currentSpeed}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team[5].moves[0].name.toUpperCase()} (${team[5].moves[0].currentPP}/${team[5].moves[0].pp})</li>
                    <li>${team[5].moves[1].name.toUpperCase()} (${team[5].moves[1].currentPP}/${team[5].moves[1].pp})</li>
                    <li>${team[5].moves[2].name.toUpperCase()} (${team[5].moves[2].currentPP}/${team[5].moves[2].pp})</li>
                    <li>${team[5].moves[3].name.toUpperCase()} (${team[5].moves[3].currentPP}/${team[5].moves[3].pp})</li>
                </ul>
            </div>    
        `;
    } else {
        pokemonP16BottomInfo.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${team[5].name.toUpperCase()}</p>
                <p class="${team[5].type1} type-description" style="margin-right: 20px;">${team[5].type1.toUpperCase()}</p>
                <p class="${team[5].type2} type-description" style="margin-right: 20px;">${team[5].type2.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*team[5].currentHP) / team[5].hp)}% (${team[5].currentHP}/ ${team[5].hp})</p>
                <p style="font-size: 12px;">ATQ: ${team[5].currentAttack} / DEF: ${team[5].currentDefense} / ATQSP: ${team[5].currentSpecialAttack} / DEFSP: ${team[5].currentSpecialDefense} / VEL: ${team[5].currentSpeed}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${team[5].moves[0].name.toUpperCase()} (${team[5].moves[0].currentPP}/${team[5].moves[0].pp})</li>
                    <li>${team[5].moves[1].name.toUpperCase()} (${team[5].moves[1].currentPP}/${team[5].moves[1].pp})</li>
                    <li>${team[5].moves[2].name.toUpperCase()} (${team[5].moves[2].currentPP}/${team[5].moves[2].pp})</li>
                    <li>${team[5].moves[3].name.toUpperCase()} (${team[5].moves[3].currentPP}/${team[5].moves[3].pp})</li>
                </ul>
            </div>    
        `;
    }
}

function changePokemon2LifeBar(){
    if (pokemonIngameP2.currentHP <= 0){
        pokemonP2IngameLifeBar.style.width = `0%`
        pokemonP2IngameLifeBar.style.transition = 'all 3s linear 0s';
        setTimeout(() => {
            pokemonP2IngameLifeBarP.innerHTML = `0%`
        }, 3100)
    } else {
        pokemonP2IngameLifeBar.style.width = `${Math.floor((100*pokemonIngameP2.currentHP) / pokemonIngameP2.hp)}%`
        pokemonP2IngameLifeBar.style.transition = 'all 3s linear 0s';
        setTimeout(() => {
            pokemonP2IngameLifeBarP.innerHTML = `${Math.floor((100*pokemonIngameP2.currentHP) / pokemonIngameP2.hp)}%`
        }, 3100)
    }
}

function changePokemonP2(pokemon){
    pokemonIngameP2 = pokemon
    if (pokemon.type2 != null){
        pokemonP2IngameInfo.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${pokemon.name.toUpperCase()}</p>
                <p class="${pokemon.type1} type-description" style="margin-right: 20px;">${pokemon.type1.toUpperCase()}</p>
                <p class="${pokemon.type2} type-description" >${pokemon.type2.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*pokemon.currentHP) / pokemon.hp)}%</p>
                <p style="font-size: 15px;">VEL: ${pokemon.currentSpeed-(Math.floor(Math.random() * (50 - 20) + 50))} a ${pokemon.currentSpeed+(Math.floor(Math.random() * (50 - 20) + 50))}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${pokemon.moves[0].revealed ? `${pokemon.moves[0].name.toUpperCase()} (${pokemon.moves[0].currentPP}/${pokemon.moves[0].pp})` : "?"}</li>
                    <li>${pokemon.moves[1].revealed ? `${pokemon.moves[1].name.toUpperCase()} (${pokemon.moves[1].currentPP}/${pokemon.moves[1].pp})` : "?"}</li>
                    <li>${pokemon.moves[2].revealed ? `${pokemon.moves[2].name.toUpperCase()} (${pokemon.moves[2].currentPP}/${pokemon.moves[2].pp})` : "?"}</li>
                    <li>${pokemon.moves[3].revealed ? `${pokemon.moves[3].name.toUpperCase()} (${pokemon.moves[3].currentPP}/${pokemon.moves[3].pp})` : "?"}</li>
                </ul>
            </div>
        `;
    } else {
        pokemonP2IngameInfo.innerHTML = `
            <div class="main-info">
                <p style="margin-right: 20px;">${pokemon.name.toUpperCase()}</p>
                <p class="${pokemon.type1} type-description" style="margin-right: 20px;">${pokemon.type1.toUpperCase()}</p>
            </div>
            <div class="stats">
                <p style="font-size: 15px;">HP: ${Math.floor((100*pokemon.currentHP) / pokemon.hp)}%</p>
                <p style="font-size: 15px;">VEL: ${pokemon.currentSpeed-30} a ${pokemon.currentSpeed+30}</p>
            </div>
            <div class="pop-up-moves">
                <ul>
                    <li>${pokemon.moves[0].revealed ? `${pokemon.moves[0].name.toUpperCase()} (${pokemon.moves[0].currentPP}/${pokemon.moves[0].pp})` : "?"}</li>
                    <li>${pokemon.moves[1].revealed ? `${pokemon.moves[1].name.toUpperCase()} (${pokemon.moves[1].currentPP}/${pokemon.moves[1].pp})` : "?"}</li>
                    <li>${pokemon.moves[2].revealed ? `${pokemon.moves[2].name.toUpperCase()} (${pokemon.moves[2].currentPP}/${pokemon.moves[2].pp})` : "?"}</li>
                    <li>${pokemon.moves[3].revealed ? `${pokemon.moves[3].name.toUpperCase()} (${pokemon.moves[3].currentPP}/${pokemon.moves[3].pp})` : "?"}</li>
                </ul>
            </div>
        `;
    }

    pokemonP2IngameName.innerHTML = `${pokemon.name}`
    pokemonP2IngameImg.src = `${pokemon.spriteFront}`
    pokemonP2IngameLifeBar.style.width = `${Math.floor((100*pokemon.currentHP) / pokemon.hp)}%`
    pokemonP2IngameLifeBarP.innerHTML = `${Math.floor((100*pokemon.currentHP) / pokemon.hp)}%`
}

window.addEventListener('beforeunload', () => {
    socket.emit('leave-room', {room: roomName, game: "roomsOnlineRandom", user: sessionStorage.getItem('user')});
});

socket.on('change-pokemon', (data)=>{
    pokeballPosition2[data].src = `${team2[data].spriteFront}`
    pokeballPosition2[data].style.height = '100%'
    pokeballPosition2[data].onmouseenter = function() {pokemonTopInfoIn(data+1)};
    pokeballPosition2[data].onmouseleave = function() {pokemonTopInfoOut(data+1)};
    changePokemonP2(team2[data]);
    pokemonTopInfo();
});

socket.on('change', (data)=>{
    if (Object.keys(data)[0] == "pokemonP2"){
        pokemonIngameP1 = data.pokemonP2;
        changePokemonP1(data.index);
    } else {
        pokemonIngameP2 = data.pokemonP1;
        changePokemonP2(pokemonIngameP2);
    }
    setTimeout(()=>{
        document.getElementById("others-message").style.display="none";
        document.getElementById("game-wait").style.display="none";
        document.getElementById("game-attacks-changes").style.display="flex";
    },0)
})

socket.on('win', ()=>{
    document.getElementById('others-message').style.display = 'flex';
    document.getElementById('game-finished-win').style.display = 'flex';
    document.getElementById('game-attacks-changes').style.display = 'none';
})


function pokemonIngameIn(data){
    document.getElementById(`pokemonIngame${data}`).style.display = "block";
}

function pokemonIngameOut(data){
    document.getElementById(`pokemonIngame${data}`).style.display = "none";
}

function moveInfoOut(data){
    document.getElementById(`move${data}Info`).style.display = "none";
}

function moveInfoIn(data){
    document.getElementById(`move${data}Info`).style.display = "block";
}

function pokemonSwitchIn(data){
    document.getElementById(`pokemonBottom${data}`).style.display = "block";
}

function pokemonSwitchOut(data){
    document.getElementById(`pokemonBottom${data}`).style.display = "none";
}

function pokemonTopInfoIn(data){
    document.getElementById(`pokemonP2${data}`).style.display = "block";
}

function pokemonTopInfoOut(data){
    document.getElementById(`pokemonP2${data}`).style.display = "none";
}

function attackP1(data){
    console.log(team[data])
    if (typeof(data) == "object"){
        let moveCurrent = data;
        let B;
        let types = [pokemonIngameP1.type1, pokemonIngameP1.type1]
        if (types.indexOf(moveCurrent.type) == -1){
            B = 1;
        } else {
            B = 1.5;
        }
        let E;
        if (pokemonIngameP2.type2 == null){
            E = effectiveness[moveCurrent.type][pokemonIngameP2.type1]
        } else {
            E = effectiveness[moveCurrent.type][pokemonIngameP2.type1] * effectiveness[moveCurrent.type][pokemonIngameP2.type2]
        }
        let V = Math.floor(Math.random() * (100 - 85) + 85);
        let N = 50
        let A;
        let D;
        if (moveCurrent.damageClass == "physical"){
            A = parseFloat(pokemonIngameP1.currentAttack)
            D = parseFloat(pokemonIngameP2.currentDefense)
        } else {
            A = parseFloat(pokemonIngameP1.currentSpecialAttack)
            D = parseFloat(pokemonIngameP2.currentSpecialDefense)
        }
        let P = parseFloat(moveCurrent.power);
        let firstClause = (0.2 * N + 1) * A * P
        let secondClause = 25 * D
        let damage = Math.floor (0.01 * B * E * V * ((firstClause / secondClause)+2))
        pokemonIngameP2.currentHP = pokemonIngameP2.currentHP-damage;
        changePokemon2LifeBar();
        socket.emit('attack-receive', {pokemonP2: pokemonIngameP2, user: sessionStorage.getItem("user"), game: "roomsOnlineRandom"})
    } else {
        pokemonIngameP1 = team[data];
        changePokemonP1(data);
        socket.emit('change', {pokemonP1: pokemonIngameP1, index: data, user: sessionStorage.getItem("user"), game: "roomsOnlineRandom"})
    }
}

function attackP2(data){
    console.log(team2[data])
    if (typeof(data) == "object"){
        let moveCurrent = data;
        let B;
        let types = [pokemonIngameP2.type1, pokemonIngameP2.type1]
        if (types.indexOf(moveCurrent.type) == -1){
            B = 1;
        } else {
            B = 1.5;
        }
        let E;
        if (pokemonIngameP1.type2 == null){
            E = effectiveness[moveCurrent.type][pokemonIngameP1.type1]
        } else {
            E = effectiveness[moveCurrent.type][pokemonIngameP1.type1] * effectiveness[moveCurrent.type][pokemonIngameP1.type2]
        }
        let V = Math.floor(Math.random() * (100 - 85) + 85);
        let N = 50
        let A;
        let D;
        if (moveCurrent.damageClass == "physical"){
            A = parseFloat(pokemonIngameP2.currentAttack)
            D = parseFloat(pokemonIngameP1.currentDefense)
        } else {
            A = parseFloat(pokemonIngameP2.currentSpecialAttack)
            D = parseFloat(pokemonIngameP1.currentSpecialDefense)
        }
        let P = parseFloat(moveCurrent.power);
        let firstClause = (0.2 * N + 1) * A * P
        let secondClause = 25 * D
        let damage = Math.floor (0.01 * B * E * V * ((firstClause / secondClause)+2))
        pokemonIngameP1.currentHP = pokemonIngameP1.currentHP-damage;
        changePokemon1LifeBar();
        socket.emit('attack-receive', {pokemonP1: pokemonIngameP1, user: sessionStorage.getItem("user"), game: "roomsOnlineRandom"})
    } else {
        pokemonIngameP2 = team2[data];
        changePokemonP2(team2[data]);
        socket.emit('change', {pokemonP2: pokemonIngameP2, index: data, user: sessionStorage.getItem("user"), game: "roomsOnlineRandom"})
    }
}

function pokemonChange(){
    if (Object.keys(data)[0] == "pokemonP2"){

        pokemonIngameP1 = data.pokemonP2
        changePokemonP1(pokemonIngameP1);
    } else {
        pokemonIngameP2 = data.pokemonP1
        changePokemonP2(pokemonIngameP2);
    }
    setTimeout(()=>{
        document.getElementById("others-message").style.display="none";
        document.getElementById("game-wait").style.display="none";
        document.getElementById("game-attacks-changes").style.display="flex";
    },0)
}

function changePokemon1LifeBar(){
    pokemonP1IngameLifeBar.style.width = `${Math.floor((100*pokemonIngameP1.currentHP) / pokemonIngameP1.hp)}%`
    pokemonP1IngameLifeBar.style.transition = 'all 3s linear 0s';
    setTimeout(()=>{
        pokemonP1IngameLifeBarP.innerHTML = `${Math.floor((100*pokemonIngameP1.currentHP) / pokemonIngameP1.hp)}%`
    },3100)
}

function turnWait(data, type){
    document.getElementById("others-message").style.display="flex";
    document.getElementById("game-wait").style.display="flex";
    document.getElementById("game-attacks-changes").style.display="none";
    if (type == 'move') {
        socket.emit('turn', {turn: turnArray, room: roomName, move: pokemonIngameP1.moves[data], user: sessionStorage.getItem("user"), game: "roomsOnlineRandom"})
        move1 = pokemonIngameP1.moves[data];
    } else{
        socket.emit('turn', {turn: turnArray, room: roomName, move: data, user: sessionStorage.getItem("user"), game: "roomsOnlineRandom"})
        move1 = data;
    }
}

let move1;
let move2;

socket.on('fillCheck', (data)=>{
    turnArray.push(true)
})

socket.on('attack-receive', (data)=>{
    if (Object.keys(data)[0] == "pokemonP2"){
        pokemonIngameP1 = data.pokemonP2
        changePokemon1LifeBar();
    } else {
        pokemonIngameP2 = data.pokemonP1
        changePokemon2LifeBar();
    }
    setTimeout(()=>{
        document.getElementById("others-message").style.display="none";
        document.getElementById("game-wait").style.display="none";
        document.getElementById("game-attacks-changes").style.display="flex";
    },7000)
})



socket.on('move2', (data)=>{
    move2 = data;
})

function cancelTurn(){
    move1 = null;
    turnArray = [];
    document.getElementById("others-message").style.display="none";
    document.getElementById("game-wait").style.display="none";
    document.getElementById("game-attacks-changes").style.display="flex";
    socket.emit('cancel-turn', {user: sessionStorage.getItem("user"), game: "roomsOnlineRandom"});
}

socket.on('cancel-turn', () =>{
    move2 = null;
    turnArray = [];
})

socket.on('battle', (data)=>{
    if (sessionStorage.getItem("user") == data){
        if (pokemonIngameP2.currentSpeed == pokemonIngameP1.currentSpeed){
            let randomNumber = Math.floor(Math.random() * (100 - 0) + 0)
            if (randomNumber <=50){
                if(checkStatus(pokemonIngameP2)){
                    attackP2(move2)   
                }
                setTimeout(()=>{
                    if(checkStatus(pokemonIngameP1)){
                        attackP1(move1)   
                    }
                    setTimeout(()=>{
                        document.getElementById("others-message").style.display="none";
                        document.getElementById("game-wait").style.display="none";
                        document.getElementById("game-attacks-changes").style.display="flex";
                        turnArray = [];
                        move1 = null;
                        move2 = null;
                    },0)
                }, 0);
            } else{
                if(checkStatus(pokemonIngameP1)){
                    attackP1(move1)   
                }
                setTimeout(()=>{
                    if(checkStatus(pokemonIngameP2)){
                        attackP2(move2)   
                    }
                    setTimeout(()=>{
                        document.getElementById("others-message").style.display="none";
                        document.getElementById("game-wait").style.display="none";
                        document.getElementById("game-attacks-changes").style.display="flex";
                        turnArray = [];
                        move1 = null;
                        move2 = null;
                    },0)
                },0)
            }
        } else{
            if (pokemonIngameP2.currentSpeed > pokemonIngameP1.currentSpeed){
                if(checkStatus(pokemonIngameP2)){
                    attackP2(move2);  
                }
                setTimeout(()=>{
                    if(checkStatus(pokemonIngameP1)){
                        attackP1(move1)   
                    }
                    setTimeout(()=>{
                        document.getElementById("others-message").style.display="none";
                        document.getElementById("game-wait").style.display="none";
                        document.getElementById("game-attacks-changes").style.display="flex";
                        turnArray = [];
                        move1 = null;
                        move2 = null;
                    },0)
                },0)
            } else {
                if(checkStatus(pokemonIngameP1)){
                    attackP1(move1)   
                }
                setTimeout(()=>{
                    if(checkStatus(pokemonIngameP2)){
                        attackP2(move2)   
                    }
                    setTimeout(()=>{
                        document.getElementById("others-message").style.display="none";
                        document.getElementById("game-wait").style.display="none";
                        document.getElementById("game-attacks-changes").style.display="flex";
                        turnArray = [];
                        move1 = null;
                        move2 = null;
                    },0)
                }, 0)
            }
        }
    } else {
        turnArray = [];
        move1 = null;
        move2 = null;
    }
   
})

function checkStatus(pokemon){
    return true;
    // let randomNumber;
    // if(pokemon.stateEffects == "paralysis"){
    //     randomNumber = Math.floor(Math.random() * (100 - 0) + 0)
    //     if(randomNumber <= 25){
    //         return {status: true, msg: 'se ha paralizado. Está inmovil... No podrá atacar.'}
    //     }
    //     else{
    //         return {status: false};
    //     }
        
    // }
    // if(pokemon.stateEffects == "sleep" && pokemon.stateEffects == "freeze"){
    //     return {status: false};
    // }
    // if(pokemon.stateEffects == "confusion"){
    //     randomNumber = Math.floor(Math.random() * (100 - 0) + 0)
    //     if(randomNumber <= 30){
    //         return {status: true, msg:'está confundido. Se ha pegado a sí mismo.'}
    //     }
    // }
    // else{
    //     return(false)
    // }
}

// socket.on('attack')

// let mensajeAttack = `
//     ${pokemon} ha usado ${move}
// `

// let mensajeReceiveAttack = `
//     ${pokemon} ha recibido ${Math.floor((100*move.damage) / pokemonIngameP2.hp)}
// `

// let derrota = `
//     ${pokemon} ha sido derrotado...
// `

// let cambioPokemon = `
//     ${pokemon} vuelve con ${nombreUser}.
//     ${pokemon} sale al campo de batalla.
// `

// let paralizado = `
//     ${pokemon} ha sido paralizado
// `

// let envenenado = `
//     ${pokemon} ha sido envenenado
// `

// let dormido = `
//     ${pokemon} se ha echado a dormir. zZzZzZ
// `

// let congelado = `
//     ${pokemon} ha sido congelado. zZzZzZ
// `

// let quemado = `
//     ${pokemon} ha sido quemado.
// `

// let confundido = `
//     ${pokemon} ha sido confundido.
// `


function hideShowMovesPokemon(){
    if ( document.getElementById("game-attacks-changes").style.display == "none"){
        document.getElementById("game-attacks-changes").style.display = "flex";
    } else {
        document.getElementById("game-attacks-changes").style.display = "none";
    }
}