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
                id: socket.id,
            }
            fetchRegister(data)
        } else {
            alert("Las contraseñas no son iguales");
        }
    }
}


async function fetchRegister(data){
    try {
        const response = await fetch("/registerInitial", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if(result.status == true){
            alert('Tenes que verificar el mail.');
            document.getElementById("registerForm").submit();
        } else {
            document.getElementById('registerContainerTimer').innerHTML = `
                ${document.getElementById('registerContainerTimer').innerHTML}
                <p style="margin-top: 10px;overflow-wrap: anywhere;text-align: center;">${result.msg}</p>
            `;
        };
    } catch (error) {
        console.error("Error:", error);
    };
}

function sessionStorageSave(){
    sessionStorage.setItem("id", socket.id);
    sessionStorage.setItem("user", userInput.value);
}
