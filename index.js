const express = require('express');
const exphbs  = require('express-handlebars'); 
const bodyParser = require('body-parser'); 
const fs = require('fs');
const MySQL = require('./modulos/mysql'); 
const session = require('express-session');
const { type } = require('os');
const { extname } = require('path');
const { setUncaughtExceptionCaptureCallback } = require('process');
const { randomBytes } = require('crypto');
const app = express();
app.use(session({secret: '123456', resave: true, saveUninitialized: true}));
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.engine('handlebars', exphbs({defaultLayout: 'main'})); 
app.set('view engine', 'handlebars'); 


const server = app.listen(3000, function() {
    console.log('Servidor NodeJS corriendo en http://localhost:' + 3000 + '/');
});

const io = require('socket.io')(server);

const sessionMiddleware = session({
    secret: 'sararasthastka',
    resave: true,
    saveUninitialized: false,
});

app.use(sessionMiddleware);



let userOnline = {};
let roomsOnlineRandom = {};
let roomsOnlineTeams = {};
let roomCounter = 0;
let pokemonJSON;
let movesJSON;


if(pokemonJSON == undefined){
    fs.readFile('\public\\pokemonJSON.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        pokemonJSON = JSON.parse(data);
    });      
}

if(movesJSON == undefined){
    fs.readFile('\public\\movesJSON.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        movesJSON = JSON.parse(data);
    });      
}

function lstRooms() {
    console.log(io.sockets.adapter.rooms)
}

function obtainKey(data, value){
    let values = Object.values(data);
    let keys = Object.keys(data)
    for (let i = 0; i<=values.length; i++){
        if (values[i] == value){
            return keys[i];
        }
    }
}

function checkRoom(user, room){
    if (room == "roomsOnlineRandom"){
        let values = Object.values(roomsOnlineRandom)
        for (let i = 0; i < values.length; i++) {
            if (values[i].includes(user)){
                return i;
            }
        }
        return null;
    } else {
        let values = Object.values(roomsOnlineTeams)
        for (let i = 0; i < values.length; i++) {
            if (values[i].includes(user)){
                return i;
            }
        }
        return null;
    }
}

function checkRoomRandomEmpty(){
    let values = Object.values(roomsOnlineRandom)
    for (let i = 0; i < values.length; i++) {
        if (values[i].length == 1){
            return i;
        }
    }
    return null;
}

function checkRoomTeamsEmpty(){
    let values = Object.values(roomsOnlineTeams)
    for (let i = 0; i < values.length; i++) {
        if (values[i].length == 1){
            return i;
        }
    }
    return null;
}

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.get('/test',  (req, res) => {
    res.render('test', null);
});

app.get('/', async (req, res) => {
    res.render('login', null);
});

app.get('/register', (req, res) => {
    res.render('register', null);
});

app.get('/game', (req, res) => {
    res.render('game', null);
});

app.get('/game2', (req, res) => {
    res.render('game2', null);
});

app.get('/hub', async (req, res) => {
    let info = await MySQL.realizarQuery(`Select * From zUsers WHERE user = "${req.session.user}"`);
    res.render('hub', {sprite:info[0].avatar, user: info[0].user, spritenumber: info[0].avatar.slice(6,info[0].avatar.length).slice(0,info[0].avatar.length-4)});
});

app.get('/ranking', (req, res) => {
    res.render('ranking', null);
})

app.get('/profile', async (req, res) => {
    let profileInfo = await MySQL.realizarQuery(`Select * From zUsers WHERE user = "${req.session.user}"`);
    res.render('profile', {idUser:profileInfo[0].idUsers});
})

app.get('/queueTeams', (req, res) => {
    res.render('queueTeams', null);
});

app.get('/queueRandom', (req, res) => {
    res.render('queueRandom', null);
});

// --------------------------------------------------------- //

io.on('connection', (socket) =>{
    socket.on("disconnect", async () => {
        delete userOnline[obtainKey(userOnline, socket)]
    });

    socket.on('login-register', (data) => {
        userOnline[data] = socket;
    });

    socket.on('relog', async (data) => {
        userOnline[data] = socket;
    });

    socket.on('room', async (data)=>{
        if (data.room == "random"){
            if (checkRoomRandomEmpty() == null ){
                let roomName = "room" + roomCounter;
                roomCounter ++;
                socket.join(roomName);
                roomsOnlineRandom[roomName] = [data.user];
                io.to(roomName).emit('nameRoom', roomName);
            } else {
                let roomName = Object.keys(roomsOnlineRandom)[checkRoomRandomEmpty()];
                socket.join(roomName)
                roomsOnlineRandom[roomName].push(data.user);
                io.to(roomName).emit('start', roomName);
            }
        } else {
            if (checkRoomTeamsEmpty() == null ){
                let roomName = "room" + roomCounter;
                roomCounter ++;
                socket.join(roomName);
                roomsOnlineTeams[roomName] = [data.user];
                io.to(roomName).emit('nameRoom', roomName);
            } else {
                let roomName = Object.keys(roomsOnlineTeams)[checkRoomTeamsEmpty()];
                socket.join(roomName)
                roomsOnlineTeams[roomName].push(data.user);
                io.to(roomName).emit('start', roomName);
            }
        }
    });

    socket.on('fillTeams', (data)=>{
        let name;
        let room;
        let number;
        room = roomsOnlineRandom["room"+checkRoom(data.user, data.game)];
        number = room.indexOf(data.user);
        if (number == 0){
            name = Object.values(room)[1];
        } else {
            name = Object.values(room)[0];
        }
        io.to(userOnline[name].id).emit('draw-pokemons', {avatar: data.avatar,team: data.team, user: data.user})
    });

    socket.on('leave-room', async (data)=>{
        if (data.condition == true){
            if (checkRoom(data.user, data.game) != null){
                if (data.game == "roomsOnlineRandom"){
                    let name; 
                    let room;
                    let number;
                    room = roomsOnlineRandom["room"+checkRoom(data.user, data.game)];
                    number = room.indexOf(data.user);
                    if (number == 0){
                        name = Object.values(room)[1];
                    } else {
                        name = Object.values(room)[0];
                    }
                    let id2 = await MySQL.realizarQuery(`Select idUsers From zUsers WHERE user = "${name}"`)
                    let ranking = await MySQL.realizarQuery(`Select elo FROM zStatsRandom WHERE idUsersRandom = ${id2[0].idUsers} `)
                    await MySQL.realizarQuery(`UPDATE zStatsRandom SET elo = ${ranking[0].elo+10} WHERE idUsersRandom = ${id2[0].idUsers};`)
                    io.to(userOnline[name].id).emit('win', {ranking: ranking[0].elo, ranking2: ranking[0].elo+10})
                } else {
                    let name; 
                    let room;
                    let number;
                    room = roomsOnlineTeams["room"+checkRoom(data.user, data.game)];
                    number = room.indexOf(data.user);
                    if (number == 0){
                        name = Object.values(room)[1];
                    } else {
                        name = Object.values(room)[0];
                    }
                    let id2 = await MySQL.realizarQuery(`Select idUsers From zUsers WHERE user = "${name}"`)
                    let ranking = await MySQL.realizarQuery(`Select elo FROM zStatsRandom WHERE idUsersRandom = ${id2[0].idUsers} `)
                    await MySQL.realizarQuery(`UPDATE zStatsRandom SET elo = ${ranking[0].elo+10} WHERE idUsersRandom = ${id2[0].idUsers};`)
                    io.to(userOnline[name].id).emit('win', {ranking: ranking[0].elo, ranking2: ranking[0].elo-10})
                }
            }
            socket.leave(data.room);
        } else {
            let nameRoom = data.room;
            socket.leave(data.room);
            if (data.game == "roomsOnlineRandom"){
                roomsOnlineRandom[nameRoom] = [];
            } else{
                roomsOnlineTeams[nameRoom] = [];
            }
        }
    });

    socket.on('change-pokemon', (data)=>{
        let name;
        let room;
        let number;
        room = roomsOnlineRandom["room"+checkRoom(data.user, data.game)];
        number = room.indexOf(data.user);
        if (number == 0){
            name = Object.values(room)[1];
        } else {
            name = Object.values(room)[0];
        }
        io.to(userOnline[name].id).emit('change-pokemon', data.index)
    })
    
    socket.on('chat-message', (data)=>{
        io.to(data.room).emit('chat-message', {msg: data.msg, user: data.user})
    })
    
    socket.on('turn', (data)=>{
        let name;
        let room;
        let number;
        room = roomsOnlineRandom["room"+checkRoom(data.user, data.game)];
        number = room.indexOf(data.user);
        if (number == 0){
            name = Object.values(room)[1];
        } else {
            name = Object.values(room)[0];
        }
        io.to(userOnline[name].id).emit('move2', {index: data.indexMove,move: data.move})
        if(data.turn.length == 0){
            io.to(data.room).emit('fillCheck')
        } else {
            io.to(data.room).emit('battle', name);
        }
    })

    socket.on('cancel-turn', (data)=>{
        let name;
        let room;
        let number;
        room = roomsOnlineRandom["room"+checkRoom(data.user, data.game)];
        number = room.indexOf(data.user);
        if (number == 0){
            name = Object.values(room)[1];
        } else {
            name = Object.values(room)[0];
        }
        io.to(userOnline[name].id).emit('cancel-turn', null)
    })

    socket.on('attack-receive', (data) =>{
        let name; 
        let room;
        let number;
        room = roomsOnlineRandom["room"+checkRoom(data.user, data.game)];
        number = room.indexOf(data.user);
        if (number == 0){
            name = Object.values(room)[1];
        } else {
            name = Object.values(room)[0];
        }
        if (Object.keys(data)[0] == "pokemonP1"){
            io.to(userOnline[name].id).emit('attack-receive', {pokemonP1: data.pokemonP1})
        } else {
            io.to(userOnline[name].id).emit('attack-receive', {pokemonP2: data.pokemonP2})
        }
    })

    socket.on('change', (data) =>{
        let name; 
        let room;
        let number;
        room = roomsOnlineRandom["room"+checkRoom(data.user, data.game)];
        number = room.indexOf(data.user);
        if (number == 0){
            name = Object.values(room)[1];
        } else {
            name = Object.values(room)[0];
        }
        if (Object.keys(data)[0] == "pokemonP1"){
            io.to(userOnline[name].id).emit('change', {pokemonP1: data.pokemonP1, index: data.index})
        } else {
            io.to(userOnline[name].id).emit('change', {pokemonP2: data.pokemonP2, index: data.index})
        }
    })

    socket.on('forfeitRandom', async (data) =>{
        let name; 
        let room;
        let number;
        room = roomsOnlineRandom["room"+checkRoom(data.user, data.game)];
        number = room.indexOf(data.user);
        if (number == 0){
            name = Object.values(room)[1];
        } else {
            name = Object.values(room)[0];
        }
        let id = await MySQL.realizarQuery(`Select idUsers From zUsers WHERE user = "${data.user}"`)
        let ranking = await MySQL.realizarQuery(`Select elo FROM zStatsRandom WHERE idUsersRandom = ${id[0].idUsers} `)
        await MySQL.realizarQuery(`UPDATE zStatsRandom SET elo = ${ranking[0].elo-10} WHERE idUsersRandom = ${id[0].idUsers};`)


        let id2 = await MySQL.realizarQuery(`Select idUsers From zUsers WHERE user = "${name}"`)
        let ranking2 = await MySQL.realizarQuery(`Select elo FROM zStatsRandom WHERE idUsersRandom = ${id2[0].idUsers} `)
        await MySQL.realizarQuery(`UPDATE zStatsRandom SET elo = ${ranking2[0].elo+10} WHERE idUsersRandom = ${id2[0].idUsers};`)

        io.to(socket.id).emit('forfeitLost', {ranking: ranking[0].elo, ranking2: ranking[0].elo-10});
        io.to(userOnline[name].id).emit('forfeitWin', {ranking: ranking2[0].elo, ranking2: ranking2[0].elo+10});
    })

    socket.on('msg-game', (data)=>{
        let msg = data.msg.split(".")
        io.to(data.room).emit('msg-game', {msg: msg})
    })

    socket.on('turnNumber', (data)=>{
        io.to(data.room).emit('turnNumber', data.number)
    })
});

// --------------------------------------------------------- //

app.post('/login', async (req,res) =>{
    let response = await MySQL.realizarQuery(`SELECT * FROM zUsers WHERE user = "${req.body.username}" AND password = "${req.body.password}"; `);
    if (response.length > 0){
        if (userOnline[req.body.username] == null){
            req.session.user = req.body.username;
            res.send({status: true})
        } else {
            res.send({status: false, msg: "El usuario ya se encuentra logueado"})    
        }
    } else {
        res.send({status: false, msg: "La contraseña/usuario no son correctos"})
    }
})



app.post('/register', async (req, res) => {
    let response = await MySQL.realizarQuery(`SELECT * FROM zUsers WHERE user = "${req.body.username}";`);
    if (response.length === 0){
        req.session.user = req.body.username;
        await MySQL.realizarQuery(`INSERT INTO zUsers (name, surname, user, password, mail, avatar) VALUES ("${req.body.name}", "${req.body.surname}", "${req.body.username}","${req.body.password}", "${req.body.mail}", "sprite1.png" );`);
        let id = await MySQL.realizarQuery(`SELECT idUsers FROM zUsers WHERE user = "${req.body.username}"`)
        await MySQL.realizarQuery(`INSERT INTO zStatsRandom (elo, games, wins, defeats, idUsersRandom) VALUES (1000, 0, 0, 0, ${id[0].idUsers});`);
        await MySQL.realizarQuery(`INSERT INTO zStatsRoster (elo, games, wins, defeats, idUsersRoster) VALUES (1000, 0, 0, 0, ${id[0].idUsers});`);
        res.send({status: true})
    } else {
        res.send({status: false})
    }
});


app.post('/changeAvatar', async(req, res) => {
    await MySQL.realizarQuery(`UPDATE zUsers SET avatar = "sprite${req.body.sprite}.png" WHERE user = "${req.session.user}"`);
    res.send(null);
});

app.post('/generateTeamRandom', async(req, res) =>{
    let team = [];
    let numbers = [];
    let moves = [];
    let numbersPokemon = [];
    for (let i = 1; i<=386; i++){
        numbers.push(i)
    }
    for (let i = 1; i<=6; i++){
        moves = [];
        randomNumber = Math.floor(Math.random() * (386 - 1) + 1);
        if(numbers.includes(randomNumber)){
            numbers = numbers.filter(function(a) { return a !== randomNumber});
            let pokemon = pokemonJSON[randomNumber];
            if (pokemon.name == "smeargle" || pokemon.name == "ditto" || pokemon.name == "wobbuffet" || pokemon.name == "unown"){
                i = i-1;
                continue;
            }
            let type1;
            let type2;
            if (pokemon.types.length == 2){
                type1 = pokemon.types[0].type.name;
                type2 = pokemon.types[1].type.name; 
            } else {
                type1 = pokemon.types[0].type.name;
                type2 = null;
            }
            for (let e = 0; e<=pokemon.moves.length-1; e++){
                numbersPokemon.push(e)
            }
            for (let e = 1; e <= 4; e++) {
                randomNumberMove = Math.floor(Math.random() * ((pokemon.moves.length-1) - 0) + 0);
                if(numbersPokemon.includes(randomNumberMove)){
                    numbersPokemon = numbersPokemon.filter(function(a) { return a !== randomNumberMove});
                    move = pokemon.moves[randomNumberMove].move.url;
                    move = move.slice(31, move.length);
                    move = move.slice(0,move.length-1);
                    if (parseInt(move) > 354 || movesJSON[move].meta.category.name == "unique"){
                        e = e-1;
                        continue;
                    } else {
                        let description = movesJSON[move].effect_entries[0].short_effect
                        description = description.replace('$effect_chance%', movesJSON[move].effect_chance + '%')

                        moves.push({
                            accuracy: movesJSON[move].accuracy,
                            damageClass: movesJSON[move].damage_class.name,
                            effectChance: movesJSON[move].effect_chance,
                            effect: movesJSON[move].meta.ailment.name,
                            category: movesJSON[move].meta.category.name,
                            critRate: movesJSON[move].meta.crit_rate,
                            drain: movesJSON[move].meta.drain,
                            flinchChance: movesJSON[move].meta.flinch_chance,
                            healing: movesJSON[move].meta.healing,
                            maxHits: movesJSON[move].meta.max_hits,
                            maxTurns: movesJSON[move].meta.max_turns,
                            minHits: movesJSON[move].meta.min_hits,
                            minTurns: movesJSON[move].meta.min_turns,
                            statChance: movesJSON[move].meta.stat_chance,
                            name: movesJSON[move].name,
                            power: movesJSON[move].power,
                            pp: movesJSON[move].pp,
                            currentPP: movesJSON[move].pp,
                            priority: movesJSON[move].priority,
                            type: movesJSON[move].type.name,
                            description:  description,
                            revealed: false,
                            statChange: movesJSON[move].stat_changes,
                            target: movesJSON[move].target,
                            die: false
                        })
                    }
                }
                if (e == 4 && moves.length != 4){
                    e = e-1;
                }
            } 
            if (Object.keys(team).length == 6){
                continue
            }
            team.push({
                id: pokemon.id,
                name: pokemon.name,
                height: pokemon.height,
                weight: pokemon.weight,
                spriteBack: pokemon.sprites.back_default,
                spriteFront: pokemon.sprites.front_default,
                type1: type1,
                type2: type2,
                moves: moves,
                hp: pokemon.stats[0].base_stat + 84,
                currentHP: pokemon.stats[0].base_stat + 84,
                attack: pokemon.stats[1].base_stat + 84,
                currentAttack: pokemon.stats[1].base_stat + 84,
                defense: pokemon.stats[2].base_stat + 84,
                currentDefense: pokemon.stats[2].base_stat + 84,
                specialAttack: pokemon.stats[3].base_stat + 84,
                currentSpecialAttack: pokemon.stats[3].base_stat + 84,
                specialDefense: pokemon.stats[4].base_stat + 84,
                currentSpecialDefense: pokemon.stats[4].base_stat + 84,
                speed: pokemon.stats[5].base_stat + 84,
                currentSpeed: pokemon.stats[5].base_stat + 84,
                stateEffects: null,
                stateEffectTurn: null,
                flinch: null,
            });
        }
    }
    res.send(team);
});

app.post('/generateTeam', async (req, res) =>{
    let id = await MySQL.realizarQuery(`Select idUsers From zUsers WHERE user = ${req.body.user}`);
    let teamId = await MySQL.realizarQuery(`Select idTeam From zPokemonTeam WHERE idUsersTeam = ${id[0].idUsers}`);
    let roster = await MySQL.realizarQuery(`Select * From zPokemons WHERE idTeamPokemons = ${teamId[0].idTeam}`);
})