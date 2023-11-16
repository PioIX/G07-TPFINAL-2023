const socket = io();
const nameInput = document.getElementById("register-name");
const surnameInput = document.getElementById("register-surname");
const userInput = document.getElementById("register-user");
const mailInput = document.getElementById("register-mail");
const passwordInput = document.getElementById("register-pass");
const passwordConfirmInput = document.getElementById("register-pass-confirm");
const emailInput=document.getElementById("emailFormRegister");


function register(){
    if (nameInput.value === "" || surnameInput.value === "" || userInput.value === "" || mailInput.value === "" || passwordInput.value === "" || passwordConfirmInput === ""){
        alert("Complete todos los campos");
    } else {
        if (passwordInput.value === passwordConfirmInput.value){
            sessionStorageSave()
            let data = {
                name: nameInput.value,
                surname: surnameInput.value,
                username: userInput.value,
                mail: mailInput.value,
                password: passwordInput.value,
                id: socket.id
            }
            fetchRegister(data)
        } else {
            alert("Las contraseñas no son iguales");
        }
    }
}


async function fetchRegister(data){
    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if(result.status == true){
            socket.emit('login-register', userInput.value);
            location.href="/hub";
        } else {
            alert("El usuario ya existe");
        };
    } catch (error) {
        console.error("Error:", error);
    };
}


function sessionStorageSaveR(){
    sessionStorage.setItem("id", socket.id);
    sessionStorage.setItem("user", userInput.value);
}

socket.on("sessionStorageR",()=>{
    sessionStorageSaveR()
});


socket.on("getDataRegister", async()=>{
    data={
        name:document.getElementById("nombre").value,
        surname:document.getElementById("apellido").value,
        user:document.getElementById("usuario").value,
        password:document.getElementById("password").value,
        mail:document.getElementById("mail").value
    }
    try {
        const response = await fetch("/createUser", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error("Error:", error);
    };
});


loginForm.addEventListener("submit", async ()=>{
    let data={
        mail:emailInput.value
    }
    try {
        const response = await fetch("/getUserWithMail", {
        method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        sessionStorageSave(result.user);
        socket.emit('login-register', result.user);
        console.log("Se submiteo el formulario, el addEventListener anda: ", sessionStorage);
    } catch (error) {
        console.error("Error:", error);
    };
    console.log(userInput.value);
}); 

function sessionStorageSave(user){
    sessionStorage.setItem("id", socket.id);
    sessionStorage.setItem("user", user);
}