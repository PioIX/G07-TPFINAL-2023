const socket = io();
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
}
// pokemonList.addEventListener("click",()=>{
//     console.log(data);
//     let dataid=data.idPokemon
//     socket.emit('idPokemonSelected')
// });

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
    console.log(" blank team")
    try {
        const response = await fetch("/blankTeam", {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
        }
        });
        let selecteNt=`
        <img src='/img/POKEBALL.png'>
        <p>Vacío</p>`
        pokemonDisplay.innerHTML=``;
        pokeTeam1.innerHTML=selecteNt;
        pokeTeam2.innerHTML=selecteNt;
        pokeTeam3.innerHTML=selecteNt;
        pokeTeam4.innerHTML=selecteNt;
        pokeTeam5.innerHTML=selecteNt;
        pokeTeam6.innerHTML=selecteNt;
    } catch (error) {
        console.error("Error:", error);
    };
//{ name: 'Vacío', sprite: '/img/POKEBALL.png', id: null }

}

builderTick.addEventListener("click", ()=>{
    let moves=[moveTeamBuilder1.value,moveTeamBuilder2.value,moveTeamBuilder3.value,moveTeamBuilder4.value];
    console.log(idPokemonSelected, moves);
    addPokemon(idPokemonSelected,moves);
});

builderCross.addEventListener("click", ()=>{
    socket.emit('showPokemonTeam');
});

socket.on('pokemonSelectedInfo', (data) =>{ 
    console.log("Entro al pokemonSelectedInfo", data);
    idPokemonSelected=data.id;
    let z=""
    if(data.avatar!=""){
        console.log("data.avatar no es ''")
        z=`
        <img class="teams-right-container-mini-top-img" src="${data.avatar}">
        <p>${data.name}</p>
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
        <img src=${data.team[i].sprite}>
        <p>${data.team[i].name}</p>
        `
        team[i].innerHTML = z;
    }

    moves=data.moves;
    z=""
    for(let i=0;i<data.moves.length;i++){
        z=z+`s
        <option value="${moves[i]}">${moves[i]}</option>
        `
    }
    for(let i=0;i<selectsMoves.length;i++){
        selectsMoves[i].innerHTML=z;
    }
    z=`<ul>`
    for(let i=0;i<data.stats.length;i++){
        z+=`<li>
        <p>${data.stats[i].stat.name} </p>
        <p>${data.stats[i].base_stat}</p>
        </li>`
    }
    stats.innerHTML=z+`</ul>`
})

async function uploadTeam(){
    console.log("entro al uploadTeam");
    let data={us:sessionStorage.getItem('user')};
    try {
        const response = await fetch("/hasTeamPokemon", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error("Error:", error);
    };
}