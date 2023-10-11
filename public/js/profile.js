const socket = io();
const statsContainer = document.getElementById("profile-stats");
const statsContainerTitle = document.getElementById("profile-stats-title");
const infoContainer = document.getElementById("profile-info");
const infoContainerTitle = document.getElementById("profile-info-title");
const profileTitleContainer = document.getElementById("profile-title-mini");
const inputName = document.getElementById("profile-name");
const inputSurname = document.getElementById("profile-surname");
const inputUsername = document.getElementById("profile-user");
const inputNameValue = document.getElementById("profile-name").value;
const inputSurnameValue = document.getElementById("profile-surname").value;
const inputUsernameValue = document.getElementById("profile-user").value;

socket.emit('relog', sessionStorage.getItem("user"));

function changeInputs(){
    if (inputName.value == inputNameValue && inputSurname.value == inputSurnameValue && inputUsername.value == inputUsernameValue){
        profileTitleContainer.innerHTML = `
            <p>FICHA ENTRENADOR</p> 
        `
    } else {
        if (document.getElementById("tick") == null){
            profileTitleContainer.innerHTML = `
                ${profileTitleContainer.innerHTML}
                <img id="tick" src="/img/x.png" onclick="notChange()"><img id="x" src="/img/tick.png" onclick="">
            `
        }
    }
}

function notChange(){  
    inputName.value = inputNameValue;
    inputSurname.value = inputSurnameValue;
    inputUsername.value = inputUsernameValue;
    profileTitleContainer.innerHTML = `
        <p>FICHA ENTRENADOR</p> 
    `
}

function changeScreen(){
    if (infoContainer.style.display === "none"){
        infoContainer.style.display = "flex";
        infoContainerTitle.style.display = "flex";
        statsContainer.style.display = "none";
        statsContainerTitle.style.display = "none";
    } else{
        statsContainer.style.display = "flex";
        statsContainerTitle.style.display = "flex";
        infoContainer.style.display = "none";
        infoContainerTitle.style.display = "none";
    }
}

