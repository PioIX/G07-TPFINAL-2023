const socket = io();

const soundLogoContainer = document.getElementById("header-right");
const music = document.getElementById("music");
const musicMeter = document.getElementById("volume-meter");
let musicVolume = sessionStorage.getItem('volume');
document.body.addEventListener('click', event => {
    let soundLogo = document.getElementById("header-music-logo");
    if (event.srcElement.id == "volume-meter"){
        if(soundLogo.alt === "muted"){
            musicVolume = event.srcElement.value;
            sessionStorage.setItem('volume', musicVolume);
        } else {
            music.volume = event.srcElement.value;
            musicVolume = event.srcElement.value;
            sessionStorage.setItem('volume', musicVolume);
        }
        
    }
})




  
function musicOnOff(){
    let soundLogo = document.getElementById("header-music-logo");
    if(soundLogo.alt === "muted"){
        music.volume = musicVolume;
        music.play();
        soundLogoContainer.innerHTML=`
            <ul class="menu-horizontal">
                <li>
                    <img id="header-music-logo" src="/img/sound.png" style="margin-bottom: 20px; margin-left: 100px; margin-top: 35px; height: 36px; width: 42px; cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0,pointer;" onclick="musicOnOff()" alt="sound">
                    <ul id="menu-vertical" class="menu-vertical">
                        <li><a><input type="range" min="0" max="1" value="${musicVolume}" step="0.001" id="volume-meter"></a></li>
                    </ul>
                </li>
            </ul>
        `
    } else {
        music.volume = 0;
        soundLogoContainer.innerHTML=`
            <ul class="menu-horizontal">
                <li>
                    <img id="header-music-logo" src="/img/muted.png" style="margin-bottom: 20px; margin-left: 100px; margin-top: 35px; height: 36px; width: 42px; cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0,pointer;" onclick="musicOnOff()" alt="muted">
                    <ul id="menu-vertical" class="menu-vertical">
                        <li><a><input type="range" min="0" max="1" value="${musicVolume}" step="0.001" id="volume-meter"></a></li>
                    </ul>
                </li>
            </ul>
        `
    }
}


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
                <img id="tick" src="/img/x.png" onclick="notChange()"><img id="x" src="/img/tick.png" onclick="change()">
            `
        }
    }
}


function change(){
    let data = {
        name: inputName.value,
        surname: inputSurname.value,
        userName: inputUsername.value,
    }
    fetchChange(data);
    profileTitleContainer.innerHTML = `
    <p>FICHA ENTRENADOR</p> 
    `
}

async function fetchChange(data){
    try {
        const response = await fetch("/change", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if(result.validation == true){
            location.href="/profile";
        } else {
            alert("Ya existe el usuario");
            location.href="/profile";
        };
    } catch (error) {
        console.error("Error:", error);
    };
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

