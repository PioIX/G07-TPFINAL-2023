let userOnline = {};
let roomsOnline = {};
let roomCounter = 0;

const express = require('express');
const exphbs  = require('express-handlebars'); 
const bodyParser = require('body-parser'); 
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

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.get('/',(req,res)=>{
    res.render('hola',null)
})

io.on('connection', (socket) => {
    socket.on('msg', (msg) => {
      io.emit('msg',msg)
    });
    socket.on('disconnect',()=>{
        io.emit('msg',"alguien se desconecto")
    })
    io.emit('msg',"alguien se conecto")
});
//hacer una pagina q yo pueda pone un msg en el input y que cuando se conecta alguien muestre en todas las pantallas un msg y cuando se desconecte alguien muestre en consola un msg
//io.emit se lo manda a todo el mudno

//io.to(socket.id).emit("emitid","maleta")//envias a uno solo el "hola" es el nombre del evento///en el to podes poner id(room) o  

//socket.join("room0") //creas una room conm el nombre "room0"



/*

TEMA REFRESH

let users = {"Jose": "ajidjasoufviahsdcvosdanivoasdsdadscvfavas"}



// back
socket.on('relog', async (data) => {
    userOnline[data] = socket;
})

// back nameUserSendMsg lo recibe del front y con  eso obtiene el id de room
socket.on('msg', nameUserSendMsg => {
    io.to(users[nameUserSendMsg]).emit('msg');
})

*/

/*
puede estar dentro de un fetch
if (userOnline[jose] != null){
    console.log("esta conectado")
}else{
    console.log("no esta conectado ")
}
*/


/*
para unir o sacar de la room
desde el front mandas un emit
socket.emit('room')
socket.on('room', () => {
    socket.join("room0");
    socket.leave("room0");
})
*/

//desde el front no se puede emitir a alguien especifico socket.to

//bradcast envia a todos menos a el mismo