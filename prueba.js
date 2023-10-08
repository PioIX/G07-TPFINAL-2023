const colorType = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    grass: "#78C850",
    electric: "#F8D030",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dark: "#705848",
    dragon: "#7038F8",
    steel: "#B8B8D0",
    fairy: "#F0B6BC",
}

let second = 1;

let timer  = setInterval(() =>{
    second ++;
    console.log(second)
    if (second % 10 == 0){
        showPokemonEvolutions();
    }
},1000);

showPokemonEvolutions();

async function findPokemonEvolutions(){
    let randomNumber = Math.floor(Math.random() * (386 - 1) + 1);
    let urls = [];
    const dataPokemon = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${randomNumber}/`);
    const dataPokemonJson = await dataPokemon.json();
    if (dataPokemonJson.chain.evolves_to.length != 0){
        if (dataPokemonJson.chain.evolves_to[0].evolves_to.length != 0){
            urls.push(dataPokemonJson.chain.species.name, dataPokemonJson.chain.evolves_to[0].species.name, dataPokemonJson.chain.evolves_to[0].evolves_to[0].species.name)
        }else{
            urls.push(dataPokemonJson.chain.species.name, dataPokemonJson.chain.evolves_to[0].species.name)
        }
    } else {
        urls.push(dataPokemonJson.chain.species.name)
    }
    console.log(urls)
    return urls;
}    


async function getPokemonData(data){
    const dataPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${data}/`);
    const dataPokemonJson = await dataPokemon.json();
    return dataPokemonJson;
}


async function showPokemonEvolutions(){
    let info = [];
    let chainEvolution = await findPokemonEvolutions();
    for (let i=0; i<chainEvolution.length; i++){
        info.push(await getPokemonData(chainEvolution[i]))
    }
    drawEvolutions(info);
}


// async function fillTeam(){
//     let team = [];
//     let data;
//     for (let i = 0; i<6; i++){ 
//         data = await findPokemonEvolutions();
//         team.push(data[data.length-1]);
//     }
//     return team;
// }

function drawEvolutions(data){
    console.log(data)
    let container = document.getElementById("container-cards");
    container.innerHTML = "";
    for (let i = 0; i<data.length; i++){
        type1 = `<p class="${data[i].types[0].type.name} type">${data[i].types[0].type.name}</p>`;
        if (data[i].types.length>1){
            type2 = data[i].types[1].type.name ? `<p class="${data[i].types[1].type.name} type">${data[i].types[1].type.name}</p>` : "";
            container.innerHTML=`
                ${container.innerHTML}
                <div class="pokemon-card">
                    <div class="pokemon-image">
                        <img style="background: radial-gradient(${colorType[data[i].types[1].type.name] ? colorType[data[i].types[1].type.name] : "black"} 33%, ${colorType[data[i].types[0].type.name]} 33%); background-size: 5px 5px;" src="${data[i].sprites.front_default}"s>
                    </div>
                    <div class="pokemon-info">
                        <div class="container-name">
                            <h2 class="pokemon-name">${data[i].species.name}</h2>
                        </div>
                        <div class="container-types">
                            ${type1}
                            ${type2}
                        </div>
                        <div class="container-stats">
                            <p class="stat">${data[i].height}m</p>
                            <p class="stat">${data[i].weight}kg</p>
                        </div>
                    </div>
                </div>               
                
            `;
        } else {
            container.innerHTML=`
            ${container.innerHTML}
            <div class="pokemon-card">
                    <div class="pokemon-image">
                        <img style="background: radial-gradient(#000000 33%, ${colorType[data[i].types[0].type.name]} 33%); background-size: 5px 5px;" src="${data[i].sprites.front_default}" alt="${data[i].name}">
                    </div>
                    <div class="pokemon-info">
                        <div class="container-name">
                            <h2 class="pokemon-name">${data[i].species.name}</h2>
                        </div>
                        <div class="container-types">
                            ${type1}
                        </div>
                        <div class="container-stats">
                            <p class="stat">${data[i].height}m</p>
                            <p class="stat">${data[i].weight}kg</p>
                        </div>
                    </div>
                </div>
           
            `; 
        }
    }
}
