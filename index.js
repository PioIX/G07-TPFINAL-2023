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
let pokemonTeamMoves=[];
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
    let id=await MySQL.realizarQuery(`select idUsers from zUsers where user='${req.session.user}'`);
    console.log("id", id[0].idUsers);
    let team=await MySQL.realizarQuery(`select idTeam from zPokemonTeam where idUsersTeam=${id[0].idUsers}`);
    console.log("team", team[0].idTeam);
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
    console.log("profiel info: ", profileInfo[0].idUsers);
    console.log("stats random ",statsRandom);
    console.log("stats roster ", statsRoster);

    console.log("objeto: ", {idUser:profileInfo[0].idUsers, sprite:profileInfo[0].avatar,name:profileInfo[0].name,surname:profileInfo[0].surname,user:profileInfo[0].user, wins:statsRandom[0].wins, defeats: statsRandom[0].defeats, games:statsRandom[0].games, elo:statsRandom[0].elo, eloR:statsRoster[0].elo,winsR:statsRoster[0].wins,defeatsR:statsRoster[0].defeats,gamesR:statsRoster[0].games})

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
// Importar AuthService
const authService = require("./authService");

app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    try {
    await authService.registerUser(auth, { email, password });
    res.render("register", {
        message: "Registro exitoso. Puedes iniciar sesión ahora.",
    });
    } catch (error) {
    console.error("Error en el registro:", error);
    res.render("register", {
        message: "Error en el registro: " + error.message,
    });
    }
});


app.post("/createUser", async (req,res)=>{
    let response = await MySQL.realizarQuery(`SELECT * FROM zUsers WHERE user = "${req.body.user}";`);
    if (response.length === 0){
        req.session.user = req.body.user;
        req.session.avatar = "/sprite1.png";
        await MySQL.realizarQuery(`INSERT INTO zUsers (name, surname, user, password, mail, avatar) VALUES ("${req.body.name}", "${req.body.surname}", "${req.body.user}","${req.body.password}", "${req.body.mail}", "sprite1.png" );`);
        res.send({status: true})
    } else {
        res.send({status: false})
    }
})


app.post("/login", async (req, res) => {
    console.log("===========================")
    const {email, password } = req.body;
    try {
    const userCredential = await authService.loginUser(auth, {
        email,
        password,
    });
    console.log(req.body.email);
    let id=await MySQL.realizarQuery(`select * from zUsers where mail='${req.body.email}'`);
    if(id.length!=0){
        req.session.user=id[0].user;
    }
    let info = await MySQL.realizarQuery(`Select * From zUsers WHERE user = "${req.session.user}"`);
    let rankingInfo = await MySQL.realizarQuery(`Select elo, zUsers.* From zStatsRoster inner join zUsers on zUsers.idUsers=zStatsRoster.idUsersRoster ORDER BY elo DESC LIMIT 5;`);
    let rankingInfoRandom = await MySQL.realizarQuery(`Select elo, zUsers.* From zStatsRandom inner join zUsers on zUsers.idUsers=zStatsRandom.idUsersRandom ORDER BY elo DESC LIMIT 5;`);
    
    // console.log("Objecto de hub: ", {sprite:info[0].avatar,p: "este es el usuario", user: info[0].user, spritenumber: info[0].avatar.slice(6,info[0].avatar.length).slice(0,info[0].avatar.length-4),rankers:rankingInfo,rankersRandom:rankingInfoRandom})
    let team=await MySQL.realizarQuery(`select idTeam from zPokemonTeam where idUsersTeam=${id[0].idUsers}`);
    
    if(team.length!=0){
        console.log("team", team[0].idTeam);
        let pokemonTeamHubDisplay=await MySQL.realizarQuery(`select name from zPokemons WHERE idTeamPokemons=${team[0].idTeam}`);
        let pokemonTeamDisplay=[];
        for(let i=0;i<pokemonTeamHubDisplay.length;i++){
        let sprite=pokemonJSON[pokemonTeamHubDisplay[i].name].sprites.front_default;
        pokemonTeamDisplay.push(sprite);
        }
        if(pokemonTeamHubDisplay.length==0){
            let p1="/public/img/POKOBALL.png";
            let p2="/public/img/POKOBALL.png";
            let p3="/public/img/POKOBALL.png";
            let p4="/public/img/POKOBALL.png";
            let p5="/public/img/POKOBALL.png";
            let p6="/public/img/POKOBALL.png";
        }
        else{
            let p1=pokemonTeamDisplay[0];
            let p2=pokemonTeamDisplay[1];
            let p3=pokemonTeamDisplay[2];
            let p4=pokemonTeamDisplay[3];
            let p5=pokemonTeamDisplay[4];
            let p6=pokemonTeamDisplay[5];
        }
        console.log(pokemonTeamDisplay[0]);
    }
    else{
        let p1="/public/img/POKOBALL.png";
        let p2="/public/img/POKOBALL.png";
        let p3="/public/img/POKOBALL.png";
        let p4="/public/img/POKOBALL.png";
        let p5="/public/img/POKOBALL.png";
        let p6="/public/img/POKOBALL.png";
    
    }
    console.log("===========================")
    res.render("hub",{sprite:info[0].avatar, p: "este es el usuario",user: info[0].user, spritenumber: info[0].avatar.slice(6,info[0].avatar.length).slice(0,info[0].avatar.length-4),rankers:rankingInfo,rankersRandom:rankingInfoRandom, p1:p1,p2:p2,p3:p3,p4:p4,p5:p5,p6:p6});

    } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.render("login", {
        message: "Error en el inicio de sesión: " + error.message,
    });
    }
});


// MySQL.realizarQuery(`insert into zUsers(name, surname, user, password, mail, avatar) VALUES ('name', 'moya','elmoya','123456','lumoyano@pioix.edu.ar','sprite1.png')`)


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

        gen3=[]
        for(let i=1;i<Object.keys(movesJSON).length+1;i++){
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
                // console.log("entro en el if del back")
                let arrayMoves=[];
                console.log("gen3", gen3.length);
                for(let ii = 0; ii < pokemonJSON[i].moves.length;ii++){
                    // console.log(pokemonJSON[1].moves[i].move.name);
                    for(let k=0; k<gen3.length;k++){
                        if(pokemonJSON[i].moves[ii].move.name==gen3[k]){
                            arrayMoves.push(pokemonJSON[i].moves[ii].move.name);
                        }
                    }
                }
            let stats=pokemonJSON[i].stats
                // console.log(team);
                io.emit("pokemonSelectedInfo",{name:pokemonJSON[i].name,avatar:pokemonJSON[i].sprites.front_default,team:team,moves:arrayMoves.sort(), id: dataId, stats:stats});
            }
        }
    });

    socket.on('showPokemonTeam',()=>{
        let team=[];
        // console.log("show pokemon team")
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
            // console.log(team);
            io.emit("pokemonSelectedInfo",{name:"",avatar:"",team:team,moves:"", id: "",stats:""});
    });

    socket.on('uploadTeam', async (data)=>{
        if(pokemonTeam.length==6){
            console.log("entro en uploadTeam: ",data);
            let moveMoveMove=[];
            let movePokemon=[]
            for(let i=0; i<pokemonTeamMoves.length;i++){
                movePokemon=[];
                for(let ii=0; ii<pokemonTeamMoves[i].length;ii++){
                    console.log("length del pokemonTeamMoves[",i,"]=",pokemonTeamMoves[i].length)
                    console.log("pokemonTeamMoves[",i,"][",ii,"]: ",pokemonTeamMoves[i][ii]);
                    movePokemon.push(getPokemonMove(pokemonTeamMoves[i][ii]));
                }
                moveMoveMove.push(movePokemon);
            }
            console.log(moveMoveMove);
            if(data.team==true){
                await MySQL.realizarQuery(`DELETE FROM zPokemons WHERE idTeamPokemons=${data.teamId}`);
            }
            for(let i=0;i<pokemonTeam.length;i++){
                console.log(`insert into zPokemons(idTeamPokemons,name,ability1,ability2,ability3,ability4) values(${data.teamId},${pokemonTeam[i]},${moveMoveMove[i][0]},${moveMoveMove[i][1]},${moveMoveMove[i][2]},${moveMoveMove[i][3]});`);

                await MySQL.realizarQuery(`insert into zPokemons(idTeamPokemons,name,ability1,ability2,ability3,ability4) values(${data.teamId},${pokemonTeam[i]},${moveMoveMove[i][0]},${moveMoveMove[i][1]},${moveMoveMove[i][2]},${moveMoveMove[i][3]});`)
            }
        }
        else{
            console.log("No se pudo subir el equipo")
        }
    });
});

// async function mostrar(){
//     console.log(pokemonJSON[0].moves[0]);
// }
// mostrar();
// --------------------------------------------------------- //

function getPokemonMove(name){
    for(let i=1; i<Object.keys(movesJSON).length+1;i++){
        if(movesJSON[i].name==name){
            console.log(movesJSON[i].id, movesJSON[i].name);
            return movesJSON[i].id
        }
    }
}

// app.post('/login', async (req,res) =>{
//     let response = await MySQL.realizarQuery(`SELECT * FROM zUsers WHERE user = "${req.body.username}" AND password = "${req.body.password}"; `);
//     if (response.length > 0){
//         req.session.user = req.body.username;
//         req.session.idUsers=response[0].idUsers;
//         res.send({status: true})
//     } else {
//         res.send({status: false})
//     }
// });

app.post("/getUserWithMail", async (req,res)=>{
    // console.log("getUserWithMail mail: ", req.body.mail);
    let userName=await MySQL.realizarQuery(`select user from zUsers where mail='${req.body.mail}'`);
    if(userName.length!=0){
        if(userName.length>1){
            // console.log("getUserWithMail user: ",userName[0].user);
            res.send({user:userName[0].user});
        }
        else{
            // console.log("getUserWithMail user: ",userName);
            res.send({user:userName});
        }
    }
});

// gen3=[];
    // console.log("funciona el addpkemon: ", req.body.id)
    // for(let i=1;i<Object.keys(movesJSON).length+1;i++){
    //     if(movesJSON[i].generation.name.split("-")[1]=="i" || movesJSON[i].generation.name.split("-")[1]=="ii" || movesJSON[i].generation.name.split("-")[1]=="iii"){
    //         gen3.push(movesJSON[i].name);
    //         console.log(movesJSON[i].generation.name.split("-")[1]);
    //     }
    //     else{
    //         console.log(movesJSON[i].generation.name.split("-")[1]);
    //     }
    // }
    // console.log(gen3,gen3.length,"!=",Object.keys(movesJSON).length);

let gen3=[];
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
            console.log("You already have the maximum pokemon(6): ", pokemonTeam);
            res.send({result:false})
        }
});

app.post('/hasTeamPokemon', async(req,res)=>{
    console.log("req.body.user ",req.body.us);
    let id=await MySQL.realizarQuery(`select idUsers from zUsers where user='${req.body.us}'`);
    console.log("id", id[0].idUsers);
    let team=await MySQL.realizarQuery(`select idUsersTeam from zPokemonTeam where idUsersTeam=${id[0].idUsers}`);
    console.log("team", team[0].idUsersTeam);
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

app.post('/register', async (req, res) => {
    let response = await MySQL.realizarQuery(`SELECT * FROM zUsers WHERE user = "${req.body.username}";`);
    if (response.length === 0){
        req.session.user = req.body.username;
        req.session.avatar = "/sprite1.png";
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
    pokemonTeamMoves=[];
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
let movesJSON = null;
if(movesJSON == null){
    fs.readFile('\public\\movesJSON.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        movesJSON = JSON.parse(data)
    });    
}