    const express = require('express');
const exphbs  = require('express-handlebars'); 
const bodyParser = require('body-parser'); 
const fs = require('fs');
const MySQL = require('./modulos/mysql'); 
const session = require('express-session');
const { type } = require('os');
const { extname } = require('path');
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
let pokemonJSON = null;
let movesJSON = null;

if(movesJSON == null){
    fs.readFile('\public\\pokemonJSON.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        pokemonJSON = JSON.parse(data)
    });      
}

if(movesJSON == null){
    fs.readFile('\public\\movesJSON.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        movesJSON = JSON.parse(data)
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
    if (room = "roomsOnlineRandom"){
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

app.get('/', async (req, res) => {
    res.render('login', null);
});

app.get('/register', (req, res) => {
    res.render('register', null);
});

app.get('/game', (req, res) => {
    res.render('game', null);
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
        console.log("ooo")
        userOnline[data] = socket;
    });

    socket.on('room', async (data)=>{
        socket.join(data.user)
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
                io.to(roomName).emit('start', null);
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
                io.to(roomName).emit('start', null);
            }
        }
    });

    socket.on('fillTeams', async (data)=>{
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
        io.to(userOnline[name].id).emit('draw-pokemons', "hola")
    });

    socket.on('leave-room', (data)=>{
        socket.leave(data);
    });
});

// --------------------------------------------------------- //

app.post('/login', async (req,res) =>{
    let response = await MySQL.realizarQuery(`SELECT * FROM zUsers WHERE user = "${req.body.username}" AND password = "${req.body.password}"; `);
    if (response.length > 0){
        req.session.user = req.body.username;
        res.send({status: true})
    } else {
        res.send({status: false})
    }
})



app.post('/register', async (req, res) => {
    let response = await MySQL.realizarQuery(`SELECT * FROM zUsers WHERE user = "${req.body.username}";`);
    if (response.length === 0){
        req.session.user = req.body.username;
        await MySQL.realizarQuery(`INSERT INTO zUsers (name, surname, user, password, mail, avatar) VALUES ("${req.body.name}", "${req.body.surname}", "${req.body.username}","${req.body.password}", "${req.body.mail}", "sprite1.png" );`);
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
        randomNumber = Math.floor(Math.random() * (386 - 1) + 1);
        if(numbers.includes(randomNumber)){
            numbers = numbers.filter(function(a) { return a !== randomNumber});
            let pokemon = pokemonJSON[randomNumber];
            let type1;
            let type2;
            if (pokemon.types.length == 2){
                type1 = pokemon.types[0].type.name;
                type2 = pokemon.types[1].type.name; 
            } else {
                type1 = pokemon.types[0].type.name;
                type2 = null;
            }
            for (let i = 0; i<=pokemon.moves.length-1; i++){
                numbersPokemon.push(i)
            }
            for (let i = 1; i <= 4; i++) {
                randomNumberMove = Math.floor(Math.random() * (pokemon.moves.length - 1) + 1);
                if(numbersPokemon.includes(randomNumberMove)){
                    numbersPokemon = numbersPokemon.filter(function(a) { return a !== randomNumberMove});
                    let move = pokemon.moves[randomNumberMove].move.url;
                    move = move.slice(31, move.length);
                    move = move.slice(0,move.length-1);
                    moves.push(movesJSON[move])
                }
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
                moves: moves
            });
        }
    }
    res.send(team);
})