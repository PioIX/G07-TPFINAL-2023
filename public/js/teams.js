const socket = io();
let inputBar = document.getElementById("search-bar-info");
let pokemonList=document.getElementById("pokemonList");
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
    console.log(html.id);
    try {
        const response = await fetch("/addPokemonToTeam", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();

    } catch (error) {
        console.error("Error:", error);
    };
    console.log(html.id);
}

async function blankTeam(){
    try {
        const response = await fetch("/blankTeam", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        const result=await response.json()
        
    } catch (error) {
        console.error("Error:", error);
    };
}

