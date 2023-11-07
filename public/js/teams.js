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
let moves=[];


let pokemonJSON = null

function searchPokemons(){
    socket.emit("showPokemon");
}

socket.on("arrayPokemons",(filterPokemonId,filterPokemonName,filterPokemonType,filterPokemonImg) =>{
    let t="";
    for(let i=0;i<filterPokemonId.length;i++){
        if(filterPokemonName[i].includes(inputBar.value)){
            t=t+`
            <li onclick="selectPokemon(this)" id="${filterPokemonId[i]}" class="pokemon-list-team-li">
                <img class="pokemon-list-team-li-img" src="${filterPokemonImg[i]}">
                <p class="pokemon-list-team-li-p" value="${filterPokemonName[i]}">${filterPokemonName[i].toUpperCase()}</p>
                <p class="pokemon-list-team-li-p" >${filterPokemonType[i].toUpperCase()}</p>
            </li>
            `
        }
    }
    pokemonList.innerHTML = t;
})



async function selectPokemon(html){
    data={
        idPokemon:html.id
    }
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
        }
    } catch (error) {
        console.error("Error:", error);
    };
    console.log(html.id);
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

pokemonList.addEventListener("click",()=>{
    dataid=data.idPokemon
    socket.emit('idPokemonSelected',dataid)
})


socket.on('pokemonSelectedInfo', (data) =>{
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
    for(let i=0;i<moves.length;i++){
        z=""
        z=`
        class="selectPokemonMoves"
        `
    }

})

function tick(data){
    console.log(data)
    let data2 = {
        idPokemon:data.idPokemon
    }
}
