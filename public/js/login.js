const socket = io();
const userInput = document.getElementById("email");
const passInput = document.getElementById("login-pass");
const loginForm =document.getElementById("formLogin");

function login(){
    if (userInput.value === "" || passInput .value === ""){
        alert("Complete todos los campos");
    } else {
        sessionStorageSave()
        let data = {
            username: userInput.value,
            password: passInput.value,
            socket: socket.id
        }
        fetchUsers(data);
    }   
}


async function fetchUsers(data){
    try {
        const response = await fetch("/login", {
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
            alert(result.msg);
        };
    } catch (error) {
        console.error("Error:", error);
    };
}


// async function fetchLogin(){
//     try {
//         const response = await fetch("/login", {
//         method: "POST",
//             headers: {
//             "Content-Type": "application/json",
//             },
//             body: JSON.stringify(data),
//         });
//         const result = await response.json();
//         if(result.status == true){
//             socket.emit('login-register', userInput.value);
//             sessionStorageSave();
//             loginForm.submit;
//         } else {
//             alert("La contraseña/usuario no son correctos");
//         };
//     } catch (error) {
//         console.error("Error:", error);
//     };
// }

loginForm.addEventListener("submit", async ()=>{
    let data={
        mail:userInput.value
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

// socket.on("userLoginUse",(user)=>{
//     sessionStorageSave(user);
//     socket.emit('login-register', user);
//     console.log("Se submiteo el formulario, el addEventListener anda: ", sessionStorage);
// });

function sessionStorageSave(user){
    sessionStorage.setItem("id", socket.id);
    sessionStorage.setItem("user", user);
}