const express = require('express');
const exphbs  = require('express-handlebars'); 
const bodyParser = require('body-parser'); 
const fs = require('fs');
let userOnline = {};
let roomsOnlineRandom = {};
let roomsOnlineTeams = {};
let roomCounter = 0;
let filterPokemonId = [];
let filterPokemonName = [];
let filterPokemonType = [];
let filterPokemonImg = [];
let pokemonTeam=[];
const MySQL = require('./modulos/mysql'); 
const session = require('express-session');
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

app.get('/teams',(req,res)=>{
    res.render('teams',null)
})

app.get('/play',(req,res)=>{
    res.render('play',null)
})

app.get('/hub', async (req, res) => {
    let info = await MySQL.realizarQuery(`Select * From zUsers WHERE user = "${req.session.user}"`);
    let rankingInfo = await MySQL.realizarQuery(`Select elo, zUsers.* From zStatsRoster inner join zUsers on zUsers.idUsers=zStatsRoster.idUsersRoster ORDER BY elo DESC LIMIT 5;`);
    let rankingInfoRandom = await MySQL.realizarQuery(`Select elo, zUsers.* From zStatsRandom inner join zUsers on zUsers.idUsers=zStatsRandom.idUsersRandom ORDER BY elo DESC LIMIT 5;`);
    res.render('hub', {sprite:info[0].avatar, user: info[0].user, spritenumber: info[0].avatar.slice(6,info[0].avatar.length).slice(0,info[0].avatar.length-4),rankers:rankingInfo,rankersRandom:rankingInfoRandom});
});

app.get('/ranking', async (req, res) => {
    let rankingInfo = await MySQL.realizarQuery(`Select elo, zUsers.* From zStatsRoster inner join zUsers on zUsers.idUsers=zStatsRoster.idUsersRoster ORDER BY elo DESC;`);
    let rankingInfoRandom = await MySQL.realizarQuery(`Select elo, zUsers.* From zStatsRandom inner join zUsers on zUsers.idUsers=zStatsRandom.idUsersRandom ORDER BY elo DESC;`);
    res.render('ranking', {rankers:rankingInfo,rankersRandom:rankingInfoRandom});
})

app.get('/profile', async (req, res) => {
    let profileInfo = await MySQL.realizarQuery(`Select * From zUsers WHERE user = "${req.session.user}"`);
    let statsRandom = await MySQL.realizarQuery(`Select * From zStatsRandom WHERE idUsersRandom = "${req.session.idUsers}"`);
    let statsRoster = await MySQL.realizarQuery(`Select * From zStatsRoster WHERE idUsersRoster = "${req.session.idUsers}"`);
    res.render('profile', {idUser:profileInfo[0].idUsers, sprite:profileInfo[0].avatar,name:profileInfo[0].name,surname:profileInfo[0].surname,user:profileInfo[0].user, wins:statsRandom[0].wins, defeats: statsRandom[0].defeats, games:statsRandom[0].games, elo:statsRandom[0].elo, eloR:statsRoster[0].elo,winsR:statsRoster[0].wins,defeatsR:statsRoster[0].defeats,gamesR:statsRoster[0].games});
})

app.post('/change', async (req,res) => {
    await MySQL.realizarQuery(`Update zUsers SET name="${req.body.name}", surname="${req.body.surname}", user="${req.body.userName}" WHERE user="${req.session.user}" `)
    console.log("body en el change get, ", req.body.name, " ", req.body.surname, " ", req.body.userName);
    console.log("entro en el change del back")
    res.send({validation:true})
}) 

app.get('/profile2', (req,res) =>{
    res.render('profile',null)
})

app.get('/queueTeams', (req, res) => {
    res.render('queueTeams', null);
});

app.get('/queueRandom', (req, res) => {
    res.render('queueRandom', null);
});

app.get('/selectTeam', (req, res) => {
    res.render('selectTeam', null);
});

app.get('/viewTeam', (req, res) => {
    res.render('viewTeam', null);
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
            } else {
                let roomName = Object.keys(roomsOnlineTeams)[checkRoomTeamsEmpty()];
                socket.join(roomName)
                roomsOnlineTeams[roomName].push(data.user);
                io.to(roomName).emit('start', roomName);
            }
        }
    })
    socket.on('fillTeams', async (data)=>{
        let name;
        let room;
        let number;
        if (data.game == "roomsOnlineRandom"){
            room = roomsOnlineRandom[checkRoom(data.user, data.game)];
            number = room.indexOf(data.user);
            if (number == 0){
                name = Object.values(room)[0][1];
            } else {
                name = Object.values(room)[0][0];
            }
            io.to(name.id).emit('draw-pokemons', data.team)
        } else {
            room = roomsOnlineRandom[checkRoom(data.user, data.game)];
            number = room.indexOf(data.user);
            if (number == 0){
                name = Object.values(room)[0][1];
            } else {
                name = Object.values(room)[0][0];
            }
            io.to(name.id).emit('draw-pokemons', data.team)
        }
    });
    socket.on("showPokemon",()=>{
        filterPokemonId = []
        filterPokemonName = []
        filterPokemonType = []
        filterPokemonImg = []
        for(let i = 0; i < 386;){
            i++
            filterPokemonId.push(pokemonJSON[i].id);
            filterPokemonName.push(pokemonJSON[i].name);
            filterPokemonImg.push(pokemonJSON[i].sprites.front_default);
            if(pokemonJSON[i].types[1]!=null){
                filterPokemonType.push(pokemonJSON[i].types[0].type.name+ " "+pokemonJSON[i].types[1].type.name);
            }
            else{
                filterPokemonType.push(pokemonJSON[i].types[0].type.name);
            }
            
        }
        if (filterPokemonId != ""){
            socket.emit("arrayPokemons",filterPokemonId,filterPokemonName,filterPokemonType,filterPokemonImg);
        }
    })
    socket.on('idPokemonSelected',(dataId)=>{
        let team=[];
        let nul;
        for(let i=0; i<6;i++){
            if(pokemonTeam[i]!=null){
                let k={
                    name:pokemonJSON[pokemonTeam[i]].name,
                    sprite:pokemonJSON[pokemonTeam[i]].sprites.front_default,
                    id:pokemonTeam[i]
                }  
                team.push(k);
            }
            else{
                let k={
                    name:"Vacío",
                    sprite:"/img/POKEBALL.png",
                    id:null
                }  
                team.push(k);
            }
            }

        for(let i = 0; i < 386;i++){
            if (dataId == i){
                console.log("entro en el if del back")
                let arrayMoves=[];
                for(let i = 0; i < pokemonJSON[1].moves.length;i++){
                    // console.log(pokemonJSON[1].moves[i].move.name);
                    arrayMoves.push(pokemonJSON[1].moves[i].move.name)
                }               
                io.emit("pokemonSelectedInfo",{name:pokemonJSON[i].name,avatar:pokemonJSON[i].sprites.front_default,team:team,moves:arrayMoves});
                //pokemonJSON[1].moves[1].move.name
                //pokemonJSON[1].moves[1].move.url
            }
        }
    });

});


// --------------------------------------------------------- //

app.post('/login', async (req,res) =>{
    let response = await MySQL.realizarQuery(`SELECT * FROM zUsers WHERE user = "${req.body.username}" AND password = "${req.body.password}"; `);
    if (response.length > 0){
        req.session.user = req.body.username;
        req.session.idUsers=response[0].idUsers;
        res.send({status: true})
    } else {
        res.send({status: false})
    }
});

app.post("/addPokemonToTeam", async (req,res) =>{
    console.log("funciona el addpkemon: ", req.body.idPokemon)
        if(pokemonTeam.length<6){
            pokemonTeam.push(req.body.idPokemon);
            console.log(pokemonTeam);
            res.send({result:true})
        }
        else{
            console.log("You already have the maximum pokemon(6): ", pokemonTeam);
            res.send({result:false})
        }
});


app.post('/register', async (req, res) => {
    let response = await MySQL.realizarQuery(`SELECT * FROM zUsers WHERE user = "${req.body.username}";`);
    if (response.length === 0){
        req.session.user = req.body.username;
        req.session.avatar = req.body.avatar;
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

app.get('/logout', function(req,res){
    req.session.destroy();
    res.render('login', null); 
});

app.put("/blankTeam", function(req,res){
    pokemonTeam=[];
    console.log("blankTeam ",pokemonTeam);
    res.send(null)
});

let pokemonJSON = null;


if(pokemonJSON == null){
    fs.readFile('\public\\pokemonJSON.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        pokemonJSON = JSON.parse(data)
        
    });      
}

