const socket = io();


const btn = document.getElementById("btn")
const msg = document.getElementById("inputito").value
const divito = document.getElementById("divito")

btn.addEventListener("click",()=>{
    socket.emit('msg',document.getElementById("inputito").value)
    console.log("hola")
    console.log(document.getElementById("inputito").value)
})//primero va el nombre dsp la funcion q primero le pones name dsp le pasas el valor que quere pasar

socket.on('msg', msg =>{
    divito.innerHTML=`
        ${divito.innerHTML}
        <p>${msg}</p>
    `
})

socket.on('emitid', data =>{
    console.log("llego el emit el idsocket")
})

////tema refresh

/*
socket.emit('relog', sessionStorage.getItem("user"));

front 

socket.emit('msg', "Jose");
*/