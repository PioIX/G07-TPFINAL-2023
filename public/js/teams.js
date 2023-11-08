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
let selectsMoves=document.getElementsByClassName("selectPokemonMoves")
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
}
pokemonList.addEventListener("click",()=>{
    console.log(data);
    let dataid=data.idPokemon
    socket.emit('idPokemonSelected')
});

async function addPokemon(id){
    data={id:id};
    try {
        const response = await fetch("/addPokemonToTeam", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if(result.validar==true){
            console.log("Se ha añadido el pokemon exitosamente");
            socket.emit(showPokemonTeam(id))
        }
    } catch (error) {
        console.error("Error:", error);
    };
}

async function blankTeam(){
    try {
        const response = await fetch("/blankTeam", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          }
        });
        const result=await response.json()
        pokemonDisplay=document.getElementById("pokemonDisplay").innerHTML="";
        pokeTeam1=document.getElementById("pokeTeam1").innerHTML="";
        pokeTeam2=document.getElementById("pokeTeam2").innerHTML="";
        pokeTeam3=document.getElementById("pokeTeam3").innerHTML="";
        pokeTeam4=document.getElementById("pokeTeam4").innerHTML="";
        pokeTeam5=document.getElementById("pokeTeam5").innerHTML="";
        pokeTeam6=document.getElementById("pokeTeam6").innerHTML="";
        location.reload()
    } catch (error) {
        console.error("Error:", error);
    };


}

builderTick.addEventListener("click", ()=>{
    console.log(idPokemonSelected);
    addPokemon(idPokemonSelected);
});

socket.on('pokemonSelectedInfo', (data) =>{ 
    console.log("Entro al pokemonSelectedInfo");
    idPokemonSelected=data.id;
    
    let z=""
    z=z+`
            <img class="teams-right-container-mini-top-img" src="${data.avatar}">
            <p>${data.name}</p>
        `
    pokemonDisplay.innerHTML = z;

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
        z=z+`
        <option>${moves[i]}</option>
        `
    }
    for(let i=0;i<selectsMoves.length;i++){
        selectsMoves[i].innerHTML=z;
    }
})

