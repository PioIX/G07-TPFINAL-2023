let numero = [];
let numeroRandom;
let team = [];

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

for (let i = 1; i<=500; i++){
    numero.push(i)
}

async function fillTeam(){
    let team = [];
    for (let i = 1; i<=5; i++){
        numeroRandom = Math.floor(Math.random() * (500 - 1) + 1);
        if(numero.includes(numeroRandom)){
            numero = numero.filter(function(a) { return a !== numeroRandom });
            const dataPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${numeroRandom}/`);
            const dataPokemonJson = await dataPokemon.json();
            team.push(dataPokemonJson)
        }
    }
    return team;
}



fillTeam().then(data => data.map((pokemon) => `${pokemon.name}`)).then(data => console.log(data))

fillTeam().then(data => drawEvolutions(data))

function drawEvolutions(data){
    console.log(data)
    let container = document.getElementById("container-cards");
    let color1;
    let color2;
    for (let i = 0; i<data.length; i++){
        try {
            color1 = data[i].types[0].type.name;
            color2 = data[i].types[1].type.name;
        } catch(error){
            color1 = data[i].types[0].type.name;
            color2 = "";
        }
        let id = data[i].id.toString();
        if (id.length===1){
            id="00"+id;
        } else if (id.length===2){
            id="0"+id;
        }
        let types = data[i].types.map((type) => `<p class="${type.type.name} type">${type.type.name}</p>`);
        types = types.join('');
        container.innerHTML=`
            ${container.innerHTML}
            <div class="pokemon-card">
                <div class="pokemon-image">
                    <img style="background: radial-gradient(${colorType[color2] ? colorType[color2] : "black"} 33%, ${colorType[color1]} 33%); background-size: 5px 5px;" src="${data[i].sprites.front_default}" alt="${data[i].species.name}">
                </div>
                <div class="pokemon-info">
                    <div class="container-name">
                        <p class="pokemon-id">#${id}</p>
                        <h2 class="pokemon-name">${data[i].species.name}</h2>
                    </div>
                    <div class="container-types">
                        ${types}
                    </div>
                    <div class="container-stats">
                        <p class="stat">${data[i].height / 10}m</p>
                        <p class="stat">${data[i].weight / 10}kg</p>
                    </div>
                </div>
            </div>
        `;

    }
}