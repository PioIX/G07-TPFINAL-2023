const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const fs = require('fs');
let filterPokemonId = [];
let filterPokemonName = [];
let filterPokemonType = [];
let filterPokemonImg = [];
let pokemonTeam=[];
let pokemonTeamMoves=[];
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


if(pokemonJSON == null){
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



app.get('/teams',(req,res)=>{
    res.render('teams',null)
})


app.get('/play',(req,res)=>{
    res.render('play',null)
})


app.get('/game2', (req, res) => {
    res.render('game2', null);
});


app.get('/hub', async (req, res) => {
    let info = await MySQL.realizarQuery(`Select * From zUsers WHERE user = "${req.session.user}"`);
    let rankingInfo = await MySQL.realizarQuery(`Select elo, zUsers.* From zStatsRoster inner join zUsers on zUsers.idUsers=zStatsRoster.idUsersRoster ORDER BY elo DESC LIMIT 5;`);
    let rankingInfoRandom = await MySQL.realizarQuery(`Select elo, zUsers.* From zStatsRandom inner join zUsers on zUsers.idUsers=zStatsRandom.idUsersRandom ORDER BY elo DESC LIMIT 5;`);
    let id=await MySQL.realizarQuery(`select idUsers from zUsers where user='${req.session.user}'`);
    let team=await MySQL.realizarQuery(`select idTeam from zPokemonTeam where idUsersTeam=${id[0].idUsers}`);
    let pokemonTeamHubDisplay=await MySQL.realizarQuery(`select name from zPokemons WHERE idTeamPokemons=${team[0].idTeam}`);
    let pokemonTeamDisplay=[];
    for(let i=0;i<pokemonTeamHubDisplay;i++){
        let sprite=pokemonJSON[pokemonTeamHubDisplay[i].name].sprites.front_default;
        pokemonTeamDisplay.push(sprite);
    }
    console.log(pokemonTeamHubDisplay);
    console.log(pokemonTeamDisplay);
    // console.log("Objecto de hub: ", {sprite:info[0].avatar, user: info[0].user, spritenumber: info[0].avatar.slice(6,info[0].avatar.length).slice(0,info[0].avatar.length-4),rankers:rankingInfo,rankersRandom:rankingInfoRandom})
    res.render('hub', {sprite:info[0].avatar, user: info[0].user, spritenumber: info[0].avatar.slice(6,info[0].avatar.length).slice(0,info[0].avatar.length-4),rankers:rankingInfo,rankersRandom:rankingInfoRandom, pokemonTeam:pokemonTeamDisplay});
});


app.get('/ranking', async (req, res) => {
    let rankingInfo = await MySQL.realizarQuery(`Select elo, zUsers.* From zStatsRoster inner join zUsers on zUsers.idUsers=zStatsRoster.idUsersRoster ORDER BY elo DESC;`);
    let rankingInfoRandom = await MySQL.realizarQuery(`Select elo, zUsers.* From zStatsRandom inner join zUsers on zUsers.idUsers=zStatsRandom.idUsersRandom ORDER BY elo DESC;`);
    res.render('ranking', {rankers:rankingInfo,rankersRandom:rankingInfoRandom});
})


app.get('/profile', async (req, res) => {
    let profileInfo = await MySQL.realizarQuery(`Select * From zUsers WHERE user = "${req.session.user}"`);
    let statsRandom = await MySQL.realizarQuery(`Select * From zStatsRandom WHERE idUsersRandom = "${profileInfo[0].idUsers}"`);
    let statsRoster = await MySQL.realizarQuery(`Select * From zStatsRoster WHERE idUsersRoster = "${profileInfo[0].idUsers}"`);
    if(statsRandom.length==0){
        await MySQL.realizarQuery(`insert into zStatsRandom(elo,games,wins,defeats,idUsersRandom) values(1000,0,0,0,${profileInfo[0].idUsers})`)
    }
    if(statsRoster.length==0){
        await MySQL.realizarQuery(`insert into zStatsRoster(elo,games,wins,defeats,idUsersRoster) values(1000,0,0,0,${profileInfo[0].idUsers})`)
    }
    res.render('profile', {idUser:profileInfo[0].idUsers, sprite:profileInfo[0].avatar,name:profileInfo[0].name,surname:profileInfo[0].surname,user:profileInfo[0].user, wins:statsRandom[0].wins, defeats: statsRandom[0].defeats, games:statsRandom[0].games, elo:statsRandom[0].elo, eloR:statsRoster[0].elo,winsR:statsRoster[0].wins,defeatsR:statsRoster[0].defeats,gamesR:statsRoster[0].games});
})


//---------------firebase---------------


const { initializeApp } = require("firebase/app");
const {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    GoogleAuthProvider,
} = require("firebase/auth");


const firebaseConfig = {
    apiKey: "AIzaSyCGH89dCYWFVoeMvEZUP1txfFwtNTN9VhQ",
    authDomain: "g07-proyecto-final.firebaseapp.com",
    projectId: "g07-proyecto-final",
    storageBucket: "g07-proyecto-final.appspot.com",
    messagingSenderId: "117962688040",
    appId: "1:117962688040:web:8244acffc2feddfea1571d"
    };


    const appFirebase = initializeApp(firebaseConfig);
    const auth = getAuth(appFirebase);
const authService = require("./authService");

app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    try {
        await authService.registerUser(auth, { email, password });
        res.render('login', null)
    } catch (error) {
        console.error(error)
    }
});

app.post("/login", async (req, res) => {
    const {email, password } = req.body;
    try {
        const userCredential = await authService.loginUser(auth, {
        email,
        password,
        });
        let id=await MySQL.realizarQuery(`select * from zUsers where mail='${req.body.email}'`);
        if(id.length!=0){
            req.session.user=id[0].user;
        }   
        let info = await MySQL.realizarQuery(`Select * From zUsers WHERE user = "${req.session.user}"`);
        let rankingInfo = await MySQL.realizarQuery(`Select elo, zUsers.* From zStatsRoster inner join zUsers on zUsers.idUsers=zStatsRoster.idUsersRoster ORDER BY elo DESC LIMIT 5;`);
        let rankingInfoRandom = await MySQL.realizarQuery(`Select elo, zUsers.* From zStatsRandom inner join zUsers on zUsers.idUsers=zStatsRandom.idUsersRandom ORDER BY elo DESC LIMIT 5;`);
        res.render("hub",{sprite:info[0].avatar, p: "este es el usuario",user: info[0].user, spritenumber: info[0].avatar.slice(6,info[0].avatar.length).slice(0,info[0].avatar.length-4),rankers:rankingInfo,rankersRandom:rankingInfoRandom});
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.render("login", {message: "Error en el inicio de sesión: " + error.message,});
    }
});


app.post('/change', async (req,res) => {
    let response = await MySQL.realizarQuery(`SELECT * FROM zUsers WHERE user = "${req.body.userName}";`);
    if (response.length === 0){
        await MySQL.realizarQuery(`Update zUsers SET name="${req.body.name}", surname="${req.body.surname}", user="${req.body.userName}" WHERE user="${req.session.user}" `)
        res.send({validation:true})
    } else{
        res.send({validation:false})
    }
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
                    let id = await MySQL.realizarQuery(`Select idUsers From zUsers WHERE user = "${data.user}"`)
                    let ranking = await MySQL.realizarQuery(`Select elo, games, wins, defeats FROM zStatsRandom WHERE idUsersRandom = ${id[0].idUsers} `)
                    await MySQL.realizarQuery(`UPDATE zStatsRandom SET elo = ${ranking[0].elo-10}, defeats = ${ranking[0].defeats+1}, games = ${ranking[0].games+1} WHERE idUsersRandom = ${id[0].idUsers};`)

                    let id2 = await MySQL.realizarQuery(`Select idUsers From zUsers WHERE user = "${name}"`)
                    let ranking2 = await MySQL.realizarQuery(`Select elo, games, wins, defeats FROM zStatsRandom WHERE idUsersRandom = ${id2[0].idUsers} `)
                    await MySQL.realizarQuery(`UPDATE zStatsRandom SET elo = ${ranking2[0].elo+10}, wins = ${ranking2[0].wins+1}, games = ${ranking2[0].games+1} WHERE idUsersRandom = ${id2[0].idUsers};`)
                    io.to(userOnline[name].id).emit('win', {ranking: ranking2[0].elo, ranking2: ranking2[0].elo+10})
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

                    // Recorda cambiar todos Igual que antes
                    let id2 = await MySQL.realizarQuery(`Select idUsers From zUsers WHERE user = "${name}"`)
                    let ranking = await MySQL.realizarQuery(`Select elo FROM zStatsRoster WHERE idUsersRandom = ${id2[0].idUsers} `)
                    await MySQL.realizarQuery(`UPDATE zStatsRoster SET elo = ${ranking[0].elo+10} WHERE idUsersRandom = ${id2[0].idUsers};`)
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

    socket.on("showPokemon",()=>{
        filterPokemonId = []
        filterPokemonName = []
        filterPokemonType = []
        filterPokemonImg = []
        for(let i = 0; i < 386;){
            i++
            if (pokemonJSON[i].name == "smeargle" || pokemonJSON[i].name == "wobbuffet" || pokemonJSON[i].name == "unown"){

            }else{
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
        }
        if (filterPokemonId != ""){
            socket.emit("arrayPokemons",filterPokemonId,filterPokemonName,filterPokemonType,filterPokemonImg);
        }
    })
    socket.on('idPokemonSelected',(dataId)=>{
        let team=[];

        gen3=[]
        for(let i=1;i<Object.keys(movesJSON).length+1;i++){
            // if (movesJSON[move].meta.category.name == "unique" ||  movesJSON[move].meta.category.name == "field-effect" || movesJSON[move].meta.category.name == "whole-field-effect" || (movesJSON[move].meta.category.name = "damage" && movesJSON[move].power == null)){
            //     continue;
            // }
            gen3.push(movesJSON[i].name);
        }
        // console.log(gen3,"gen3");

        for(let i=0; i<6;i++){
            if(pokemonTeam[i]!=null){
                let k={
                    name:pokemonJSON[pokemonTeam[i]].name,
                    sprite:pokemonJSON[pokemonTeam[i]].sprites.front_default,
                    id:pokemonTeam[i],
                    stats:pokemonJSON[pokemonTeam[i]].stats
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
                let arrayMoves=[];
                for(let ii = 0; ii < pokemonJSON[i].moves.length;ii++){
                    // console.log(pokemonJSON[1].moves[i].move.name);
                    for(let k=0; k<gen3.length;k++){
                        if(pokemonJSON[i].moves[ii].move.name==gen3[k]){
                            arrayMoves.push(pokemonJSON[i].moves[ii].move.name);
                        }
                    }
                }
            let stats=pokemonJSON[i].stats
                io.emit("pokemonSelectedInfo",{name:pokemonJSON[i].name,avatar:pokemonJSON[i].sprites.front_default,team:team,moves:arrayMoves.sort(), id: dataId, stats:stats});
            }
        }
    });

    socket.on('showPokemonTeam',()=>{
        let team=[];

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
            io.emit("pokemonSelectedInfo",{name:"",avatar:"",team:team,moves:"", id: "",stats:""});
    });

    socket.on('uploadTeam', async (data)=>{
        if(pokemonTeam.length==6){
            let moveMoveMove=[];
            let movePokemon=[]
            for(let i=0; i<pokemonTeamMoves.length;i++){
                movePokemon=[];
                for(let ii=0; ii<pokemonTeamMoves[i].length;ii++){
                    movePokemon.push(getPokemonMove(pokemonTeamMoves[i][ii]));
                }
                moveMoveMove.push(movePokemon);
            }
            if(data.team==true){
                await MySQL.realizarQuery(`DELETE FROM zPokemons WHERE idTeamPokemons=${data.teamId}`);
            }
            for(let i=0;i<pokemonTeam.length;i++){
                await MySQL.realizarQuery(`insert into zPokemons(idTeamPokemons,name,ability1,ability2,ability3,ability4) values(${data.teamId},${pokemonTeam[i]},${moveMoveMove[i][0]},${moveMoveMove[i][1]},${moveMoveMove[i][2]},${moveMoveMove[i][3]});`)
            }
        }
        else{
            console.log("No se pudo subir el equipo")
        }
    });
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
        let ranking = await MySQL.realizarQuery(`Select elo, games, wins, defeats FROM zStatsRandom WHERE idUsersRandom = ${id[0].idUsers} `)
        await MySQL.realizarQuery(`UPDATE zStatsRandom SET elo = ${ranking[0].elo-10}, defeats = ${ranking[0].defeats+1}, games = ${ranking[0].games+1} WHERE idUsersRandom = ${id[0].idUsers};`)

        let id2 = await MySQL.realizarQuery(`Select idUsers From zUsers WHERE user = "${name}"`)
        let ranking2 = await MySQL.realizarQuery(`Select elo, games, wins, defeats FROM zStatsRandom WHERE idUsersRandom = ${id2[0].idUsers} `)
        await MySQL.realizarQuery(`UPDATE zStatsRandom SET elo = ${ranking2[0].elo+10}, wins = ${ranking2[0].wins+1}, games = ${ranking2[0].games+1} WHERE idUsersRandom = ${id2[0].idUsers};`)

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

    socket.on('change-status', ()=>{
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
        io.to(userOnline[name].id).emit('change-status');
    })
});

// async function mostrar(){
//     console.log(pokemonJSON[0].moves[0]);
// }
// mostrar();
// --------------------------------------------------------- //

function getPokemonMove(name){
    for(let i=1; i<Object.keys(movesJSON).length+1;i++){
        if(movesJSON[i].name==name){
            return movesJSON[i].id
        }
    }};

// --------------------------------------------------------- //


 



app.post("/getUserWithMail", async (req,res)=>{
    let userName=await MySQL.realizarQuery(`select user from zUsers where mail='${req.body.mail}'`);
    if(userName.length!=0){
        if(userName.length>1){
            res.send({user:userName[0].user});
        }
        else{
            res.send({user:userName[0].user});
        }
    }
});



let gen3 = [];
app.post("/addPokemonToTeam", async (req,res) =>{
    
    if(gen3==[]){
        for(let i=1;i<Object.keys(movesJSON).length+1;i++){
            gen3.push(movesJSON[i].name);
        }
    }
    
        if(pokemonTeam.length<6){
            pokemonTeamMoves.push(req.body.moves)
            pokemonTeam.push(req.body.id);
            console.log(pokemonTeam, pokemonTeamMoves);

            res.send({result:true})
        }
        else{
            res.send({result:false})
        }
});

app.post('/registerInitial', async (req, res) => {
    let response2 = await MySQL.realizarQuery(`SELECT * FROM zUsers WHERE mail = "${req.body.mail}";`);
    let response = await MySQL.realizarQuery(`SELECT * FROM zUsers WHERE user = "${req.body.username}";`);
    if (response2.length === 0){
        if (response.length === 0){
            req.session.user = req.body.username;
            await MySQL.realizarQuery(`INSERT INTO zUsers (name, surname, user, password, mail, avatar) VALUES ("${req.body.name}", "${req.body.surname}", "${req.body.username}","${req.body.password}", "${req.body.mail}", "sprite1.png" );`);
            let id = await MySQL.realizarQuery(`SELECT idUsers FROM zUsers WHERE user = "${req.body.username}"`)
            await MySQL.realizarQuery(`INSERT INTO zStatsRandom (elo, games, wins, defeats, idUsersRandom) VALUES (1000, 0, 0, 0, ${id[0].idUsers});`);
            await MySQL.realizarQuery(`INSERT INTO zStatsRoster (elo, games, wins, defeats, idUsersRoster) VALUES (1000, 0, 0, 0, ${id[0].idUsers});`);
            res.send({status: true})
        } else {
            res.send({status: false, msg: 'El usuario ya existe'})
        }
    } else {
        res.send({status: false, msg: 'Ya existe una cuenta con este mail'})
    }
    
});

app.post('/hasTeamPokemon', async(req,res)=>{
    let id=await MySQL.realizarQuery(`select idUsers from zUsers where user='${req.body.us}'`);
    let team=await MySQL.realizarQuery(`select idUsersTeam from zPokemonTeam where idUsersTeam=${id[0].idUsers}`);
    if(team.length==0){
        console.log("El usuario no tiene un equipo creado");
        await MySQL.realizarQuery(`insert into zPokemonTeam(idUsersTeam) values(${id[0].idUsers});`)
        let teamId=await MySQL.realizarQuery(`select idTeam from zPokemonTeam where idUsersTeam=${id[0].idUsers}`);
        res.send({team: false, idUser:id[0],teamId:teamId[0].idTeam});
    }
    else{
        console.log("El usuario si tiene un equipo creado");
        let teamId=await MySQL.realizarQuery(`select idTeam from zPokemonTeam where idUsersTeam=${id[0].idUsers}`);
        res.send({team: true, idUser:id[0].idUsers,teamId:teamId[0].idTeam});
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
    pokemonTeamMoves=[];
    res.send(null)
});

app.post('/loadTeamsHubPokemons', async function(req,res){
    let id = await MySQL.realizarQuery(` Select idUsers From zUsers Where user = '${req.body.user}' `)
    let team = await MySQL.realizarQuery(` Select idTeam From zPokemonTeam Where idUsersTeam = ${id[0].idUsers}`)
    let pokemons = await MySQL.realizarQuery(`Select name From zPokemons Where idTeamPokemons = ${team[0].idTeam}`)
    let arrayPokemons = [];
    for (let i = 0; i<=pokemons.length-1; i++){
        arrayPokemons.push(pokemonJSON[pokemons[i].name].sprites.front_default)
    }
    res.send(arrayPokemons)
})


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
                    if (parseInt(move) > 354 || movesJSON[move].meta.category.name == "unique" || movesJSON[move].meta.category.name == "field-effect" || movesJSON[move].meta.category.name == "whole-field-effect" || (movesJSON[move].meta.category.name = "damage" && movesJSON[move].power == null)){
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
                toxicTurns: 1,
                toxic: false,
                flinch: null,
                die: false
            });
        }
    }
    res.send(team);
});

app.post('/generateTeam', async (req, res) =>{
    let id = await MySQL.realizarQuery(` Select idUsers From zUsers Where user = '${req.body.user}' `)
    let team = await MySQL.realizarQuery(` Select idTeam From zPokemonTeam Where idUsersTeam = ${id[0].idUsers}`)
    let pokemons = await MySQL.realizarQuery(`Select name From zPokemons Where idTeamPokemons = ${team[0].idTeam}`)
    let arrayPokemons = [];
    for (let i = 0; i<=pokemons.length-1; i++){
        arrayPokemons.push(pokemonJSON[pokemons[i].name].sprites.front_default)
    }
    res.send(arrayPokemons)
})


