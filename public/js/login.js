const socket = io();
const userInput = document.getElementById("login-user");
const passInput = document.getElementById("login-pass");

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
            alert("La contraseña/usuario no son correctos");
        };
    } catch (error) {
        console.error("Error:", error);
    };
}

function sessionStorageSaveL(){
    sessionStorage.clear();
    sessionStorage.setItem("id", socket.id);
    sessionStorage.setItem("user", userInput.value);
}

socket.on("sessionStorageL",()=>{
    sessionStorageSaveL()
});
