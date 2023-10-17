const socket = io();
let roomName;

socket.emit('relog', sessionStorage.getItem("user"));



sessionStorage.setItem('game', "roomsOnlineTeams");


socket.emit("room", {user: sessionStorage.getItem("user"), room: "teams"});

socket.on('start', () => {
    setTimeout(()=>{
        location.href="/game";
    },3000);
})

socket.on('nameRoom', (data) => {
    roomName = data;
})

window.addEventListener('beforeunload', () => {
    socket.emit('leave-room', roomName);
});
























// async function fillTeam(){
//     let numero = [];
//     let team = [];
//     let numeroRandom;
//     for (let i = 1; i<=151 ; i++){
//         numero.push(i)
//     }
//     for (let i = 1; i<=6; i++){
//         numeroRandom = Math.floor(Math.random() * (151  - 1) + 1);
//         if(numero.includes(numeroRandom)){
//             numero = numero.filter(function(a) { return a !== numeroRandom });
//             const dataPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${numeroRandom}/`);
//             const dataPokemonJson = await dataPokemon.json();
//             team.push(dataPokemonJson);
//             console.log(dataPokemonJson)
//         }
//     }
//     teamFiltered(team);    
// }


// async function movePick(data){
//     let moves = {};
//     let numero = [];
//     for (let i = 1; i<=data.moves.length; i++){
//         numero.push(i)
//     }
//     for (let i = 1; i<=4;i++){
//         let numberRandomMoves = Math.floor(Math.random() * (data.moves.length - 0) + 0);
//         if(numero.includes(numberRandomMoves)){
//             numero = numero.filter(function(a) { return a !== numberRandomMoves });
//             const dataPokemon = await fetch(`${data.moves[numberRandomMoves].move.url}`);
//             const dataPokemonJson = await dataPokemon.json();
//             moves["move"+i]= {
//                 name: data.moves[numberRandomMoves].move.name,
//                 accuracy: dataPokemonJson.accuracy,
//                 damage_class: dataPokemonJson.damage_class,
//                 effect_chance: dataPokemonJson.effect_chance,
//                 power: dataPokemonJson.power,
//                 pp: dataPokemonJson.pp,
//                 priority: dataPokemonJson.priority,
//                 type: dataPokemonJson.type.name,
//                 meta: dataPokemonJson.meta,

//             }
//         }
//     }
//     return moves
// }


// async function teamFiltered(data){
//     let team = [];
//     let type1;
//     let type2;
//     for (let i = 0; i<data.length; i++){
//         try {
//             type1 = data[i].types[0].type.name;
//             type2 = data[i].types[1].type.name;
//         } catch(error){
//             type1 = data[i].types[0].type.name;
//             type2 = null;
//         }
//         team.push({
//             id: data[i].id,
//             name: data[i].name,
//             moves: await movePick(data[i]),
//             spriteFront: data[i].sprites.front_default,
//             spriteBack: data[i].sprites.back_default,
//             type1: type1,
//             type2: type2,
//             weight: data[i].weight / 10,
//             height: data[i].height / 10,
//         })
//     }
//     return team;
// }
