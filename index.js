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

app.get('/', (req, res) => {
    res.render('login', null);
});

app.get('/register', (req, res) => {
    res.render('register', null);
});

app.get('/game', (req, res) => {
    res.render('game', null);
});

app.get('/hub', (req, res) => {
    res.render('hub', null);
});

app.get('/ranking', (req, res) => {
    res.render('ranking', null);
})

app.get('/ranking', (req, res) => {
    res.render('ranking', null);
})

app.get('/profile', (req, res) => {
    res.render('profile', null);
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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await authService.loginUser(auth, {
      email,
      password,
    });
    res.render("hub");
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.render("login", {
      message: "Error en el inicio de sesión: " + error.message,
    });
  }
});
