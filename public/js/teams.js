const socket = io();


const soundLogoContainer = document.getElementById("header-right");
const music = document.getElementById("music");
const musicMeter = document.getElementById("volume-meter");
let musicVolume = sessionStorage.getItem('volume');
document.body.addEventListener('click', event => {
    let soundLogo = document.getElementById("header-music-logo");
    if (event.srcElement.id == "volume-meter"){
        if(soundLogo.alt === "muted"){
            musicVolume = event.srcElement.value;
            sessionStorage.setItem('volume', musicVolume);
        } else {
            music.volume = event.srcElement.value;
            musicVolume = event.srcElement.value;
            sessionStorage.setItem('volume', musicVolume);
        }
        
    }
})




  
function musicOnOff(){
    let soundLogo = document.getElementById("header-music-logo");
    if(soundLogo.alt === "muted"){
        music.volume = musicVolume;
        music.play();
        soundLogoContainer.innerHTML=`
            <ul class="menu-horizontal">
                <li>
                    <img id="header-music-logo" src="/img/sound.png" style="margin-bottom: 20px; margin-left: 100px; margin-top: 35px; height: 36px; width: 42px; cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0,pointer;" onclick="musicOnOff()" alt="sound">
                    <ul id="menu-vertical" class="menu-vertical">
                        <li><a><input type="range" min="0" max="1" value="${musicVolume}" step="0.001" id="volume-meter"></a></li>
                    </ul>
                </li>
            </ul>
        `
    } else {
        music.volume = 0;
        soundLogoContainer.innerHTML=`
            <ul class="menu-horizontal">
                <li>
                    <img id="header-music-logo" src="/img/muted.png" style="margin-bottom: 20px; margin-left: 100px; margin-top: 35px; height: 36px; width: 42px; cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0,pointer;" onclick="musicOnOff()" alt="muted">
                    <ul id="menu-vertical" class="menu-vertical">
                        <li><a><input type="range" min="0" max="1" value="${musicVolume}" step="0.001" id="volume-meter"></a></li>
                    </ul>
                </li>
            </ul>
        `
    }
}



let inputBar = document.getElementById("search-bar-info");
let pokemonList=document.getElementById("pokemonList");
let pokemonDisplay=document.getElementById("pokemonDisplay");
let pokeTeam1=document.getElementById("pokeTeam1");
let pokeTeam2=document.getElementById("pokeTeam2");
let pokeTeam3=document.getElementById("pokeTeam3");
let pokeTeam4=document.getElementById("pokeTeam4");
let pokeTeam5=document.getElementById("pokeTeam5");
let pokeTeam6=document.getElementById("pokeTeam6");
let builderTick=document.getElementById("teamBuilderTick");
let builderCross=document.getElementById("teamBuilderCross");
let selectsMoves=document.getElementsByClassName("selectPokemonMoves");
let moveTeamBuilder1=document.getElementById("moveTeamBuilder1");
let moveTeamBuilder2=document.getElementById("moveTeamBuilder2");
let moveTeamBuilder3=document.getElementById("moveTeamBuilder3");
let moveTeamBuilder4=document.getElementById("moveTeamBuilder4");
let stats=document.getElementById("statsTeamBuilder");
let moves=[];
let idPokemonSelected;


let pokemonJSON = null

function searchPokemons(){
    socket.emit("showPokemon");
}

socket.on("arrayPokemons",(filterPokemonId,filterPokemonName,filterPokemonType,filterPokemonImg) =>{
    let t="";
    let type
    for(let i=0;i<filterPokemonId.length;i++){
        if(filterPokemonType[i].includes(" ")){
            type= filterPokemonType[i].split(" ");
        }
        else{
            type=[filterPokemonType[i], null];
        }
        if(filterPokemonName[i].includes(inputBar.value)){
            if(filterPokemonType[i].includes(" ")){
                t=t+`
                <li onclick="selectPokemon(this)" id="${filterPokemonId[i]}" class="pokemon-list-team-li">
                    <img class="pokemon-list-team-li-img" src="${filterPokemonImg[i]}">
                    <p class="pokemon-list-team-li-p" value="${filterPokemonName[i]}">${filterPokemonName[i].toUpperCase()}</p>
                    <p class="${type[0]} pokemon-list-team-li-p" style=" border: solid black 3px">${type[0]}</p>
                    <p class="${type[1]} pokemon-list-team-li-p" style=" border: solid black 3px">${type[1]}</p>
                </li>
                `
            }
            else{
                t=t+`
                <li onclick="selectPokemon(this)" id="${filterPokemonId[i]}" class="pokemon-list-team-li">
                <img class="pokemon-list-team-li-img" src="${filterPokemonImg[i]}">
                <p class="pokemon-list-team-li-p" value="${filterPokemonName[i]}">${filterPokemonName[i].toUpperCase()}</p>
                <p class="${type[0]} pokemon-list-team-li-p" style=" border: solid black 3px">${type[0]}</p>
                </li>
                `
            }
        }
    }
    pokemonList.innerHTML = t;
})



async function selectPokemon(html){
    data={
        idPokemon:html.id
    };
    socket.emit('idPokemonSelected',html.id)
    document.getElementById('images-x-tick').innerHTML=`
        <img class="teams-right-container-mini-top-right-img" onclick="removePokemonTickButton()" id="teamBuilderCross" src="/img/x.png">
        <img class="teams-right-container-mini-top-right-img" onclick="addPokemonTickButton()" id="teamBuilderTick" src="/img/tick.png">
    `
    document.getElementById('selectPokemons').innerHTML=`
        <select class="selectPokemonMoves" id="moveTeamBuilder1" name="moveTeamBuilder1"> </select>
        <select class="selectPokemonMoves" id="moveTeamBuilder2" name="moveTeamBuilder2"> </select>
        <select class="selectPokemonMoves" id="moveTeamBuilder3" name="moveTeamBuilder3"> </select>
        <select class="selectPokemonMoves" id="moveTeamBuilder4" name="moveTeamBuilder4"> </select>
    `
}

async function addPokemon(id,moves){
    data={id:id,moves:moves};
    if(id!=""){
    try {
        const response = await fetch("/addPokemonToTeam", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if(result.result==true){
            console.log("Se ha añadido el pokemon exitosamente");
            socket.emit("showPokemonTeam")
        }
    } catch (error) {
        console.error("Error:", error);
    };
    }
}

//llama al back para que elimine el equipo y los movimientos que ya se hayan guardado
async function blankTeam(){

    try {
        const response = await fetch("/blankTeam", {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
        }
        });
        let selecteNt=`
        <div class="teams-right-container-mini-bottom-pokemon">
                    <img src="/img/POKEBALL.png" height="40px">
                </div>
                <div class="teams-right-container-mini-bottom-text">
                    <p></p>
                </div>`
        pokemonDisplay.innerHTML=``;
        pokeTeam1.innerHTML=selecteNt;
        pokeTeam2.innerHTML=selecteNt;
        pokeTeam3.innerHTML=selecteNt;
        pokeTeam4.innerHTML=selecteNt;
        pokeTeam5.innerHTML=selecteNt;
        pokeTeam6.innerHTML=selecteNt;
        document.getElementById('images-x-tick').innerHTML = ""
        document.getElementById('selectPokemons').innerHTML = ""
    } catch (error) {
        console.error("Error:", error);
    };

}

function addPokemonTickButton(){
    let moves=[document.getElementById('moveTeamBuilder1').value,document.getElementById('moveTeamBuilder2').value,document.getElementById('moveTeamBuilder3').value,document.getElementById('moveTeamBuilder4').value];
    addPokemon(idPokemonSelected,moves);
    document.getElementById('images-x-tick').innerHTML =""
    document.getElementById('selectPokemons').innerHTML = ""
}

function removePokemonTickButton(){
    socket.emit('showPokemonTeam');
    document.getElementById('images-x-tick').innerHTML = ""
    document.getElementById('selectPokemons').innerHTML = ""
}


socket.on('pokemonSelectedInfo', (data) =>{ 
    idPokemonSelected=data.id;
    let z=""
    if(data.avatar!=""){
        z=`
        <img class="teams-right-container-mini-top-img" src="${data.avatar}">
        <p style="color:black">${data.name.toUpperCase()}</p>
        `;
        pokemonDisplay.innerHTML = z;
    } 
    else{
        z=``;        
        pokemonDisplay.innerHTML = z;
    }
    let team=[pokeTeam1,pokeTeam2,pokeTeam3,pokeTeam4,pokeTeam5,pokeTeam6]
    for(let i=0;i<team.length;i++){
        z=""
        z=z+`
            <div class="teams-right-container-mini-bottom-pokemon">
                <img src="${data.team[i].sprite}" height="40px">
            </div>
            <div class="teams-right-container-mini-bottom-text">
                <p>${data.team[i].name}</p>
            </div>
        `
        team[i].innerHTML = z;
    }

    moves=data.moves;
    z=""
    for(let i=0;i<data.moves.length;i++){
        z=z+`
        <option value="${moves[i]}">${moves[i].toUpperCase()}</option>
        `
    }
    for(let i=0;i<selectsMoves.length;i++){
        selectsMoves[i].innerHTML=z;
    }
    z=`<ul>`
    for(let i=0;i<data.stats.length;i++){
        z+=`<div class="statsPokemonChoose">
            <p style="text-transform: uppercase; font-weight: 500;">${data.stats[i].stat.name} </p>
            <p>${data.stats[i].base_stat+84}</p>
        </div>`
    }
    stats.innerHTML=z+`</ul>`
})

async function uploadTeam(){
    let data={us:sessionStorage.getItem('user')};
    try {
        const response = await fetch("/hasTeamPokemon", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result= await response.json();
        socket.emit('uploadTeam', {id:result.idUser, teamCreated:result.team,teamId:result.teamId});
    } catch (error) {
        console.error("Error:", error);
    };
}