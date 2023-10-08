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

async function fillTeam(){
    let numero = [];
    let team = [];
    let numeroRandom;
    for (let i = 1; i<=151; i++){
        numero.push(i)
    }
    for (let i = 1; i<=6; i++){
        numeroRandom = Math.floor(Math.random() * (151 - 1) + 1);
        if(numero.includes(numeroRandom)){
            numero = numero.filter(function(a) { return a !== numeroRandom });
            const dataPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${numeroRandom}/`);
            const dataPokemonJson = await dataPokemon.json();
            team.push(dataPokemonJson)
        }
    }
    teamFiltered(team);
}

fillTeam();

async function movePick(data){
    let moves = {};
    let numero = [];
    for (let i = 1; i<=data.moves.length; i++){
        numero.push(i)
    }
    for (let i = 1; i<=4;i++){
        let numberRandomMoves = Math.floor(Math.random() * (data.moves.length - 0) + 0);
        if(numero.includes(numberRandomMoves)){
            numero = numero.filter(function(a) { return a !== numberRandomMoves });
            const dataPokemon = await fetch(`${data.moves[numberRandomMoves].move.url}`);
            const dataPokemonJson = await dataPokemon.json();
            moves["move"+i]= {
                name: data.moves[numberRandomMoves].move.name,
                accuracy: dataPokemonJson.accuracy,
                damage_class: dataPokemonJson.damage_class,
                effect_chance: dataPokemonJson.effect_chance,
                power: dataPokemonJson.power,
                pp: dataPokemonJson.pp,
                priority: dataPokemonJson.priority,
                type: dataPokemonJson.type.name,
                meta: dataPokemonJson.meta,

            }
        }
    }
    return moves
}


async function teamFiltered(data){
    let team = [];
    let type1;
    let type2;
    for (let i = 0; i<data.length; i++){
        try {
            type1 = data[i].types[0].type.name;
            type2 = data[i].types[1].type.name;
        } catch(error){
            type1 = data[i].types[0].type.name;
            type2 = null;
        }
        team.push({
            id: data[i].id,
            name: data[i].name,
            moves: await movePick(data[i]),
            spriteFront: data[i].sprites.front_default,
            spriteBack: data[i].sprites.back_default,
            type1: type1,
            type2: type2,
            weight: data[i].weight / 10,
            height: data[i].height / 10,
        })
    }
    drawEvolutions(team);
    return team
}


function drawEvolutions(data){
    let container = document.getElementById("container-cards");
    let id;
    let type1;
    let type2;
    for (let i = 0; i<data.length; i++){
        id = data[i].id.toString();
        if (id.length === 1){
            id="00"+id;
        } else if (id.length === 2){
            id="0"+id;
        }
        type1 = `<p class="${data[i].type1} type">${data[i].type1}</p>`;
        type2 = data[i].type2 ? `<p class="${data[i].type2} type">${data[i].type2}</p>` : "";
        container.innerHTML=`
            ${container.innerHTML}
            <div class="pokemon-card">
                <div class="pokemon-image">
                    <img style="background: radial-gradient(${colorType[data[i].type2] ? colorType[data[i].type2] : "black"} 33%, ${colorType[data[i].type1]} 33%); background-size: 5px 5px;" src="${data[i].spriteFront}" alt="${data[i].name}">
                </div>
                <div class="pokemon-info">
                    <div class="container-name">
                        <p class="pokemon-id">#${id}</p>
                        <h2 class="pokemon-name">${data[i].name}</h2>
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

    }
}