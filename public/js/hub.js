// MUSIC
const socket = io();
const soundLogoContainer = document.getElementById("header-right");
const music = document.getElementById("music");
const musicMeter = document.getElementById("volume-meter");
let musicVolume = sessionStorage.getItem('volume');
let numberAvatarDefault = parseInt(document.getElementById("avatar").alt);
sessionStorage.setItem('avatar', numberAvatarDefault)
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


// 

let interval = setInterval('rotate()',5000);

function rotate(){
    console.log(document.getElementById('rankerTeam').style.display)
    if (document.getElementById('rankerTeam').style.display == "block"){
        document.getElementById('rankerTeam').style.display = "none";
        document.getElementById('rankerRandom').style.display = "block";
    } else{
        document.getElementById('rankerTeam').style.display = "block";
        document.getElementById('rankerRandom').style.display = "none";
    }
}

// AVATARS

const avatarContainer = document.getElementById("avatar-container");
const nameContainer = document.getElementById("hub-title");
const titleP=document.getElementById("hub-title-user");

function changeAvatar(data){
    let numberAvatar = parseInt(document.getElementById("avatar").alt);
    if (data === "left"){
        if (numberAvatar>1){
            avatarContainer.innerHTML=`
                    <div class="hub-avatar-left">
                        <img id="left-arrow" src="/img/flecha-izq.png" onclick="changeAvatar('left')">
                    </div>
                    <div class="hub-avatar-mid">
                        <img id="avatar" src="/img/sprite${numberAvatar-1}.png" alt="${numberAvatar-1}">
                    </div>
                    <div class="hub-avatar-right">
                        <img id="right-arrow" src="/img/flecha-der.png" onclick="changeAvatar('right')">
                    </div>
            `
            numberAvatar = numberAvatar-1;
            if (document.getElementById("tick") === null){
                if (numberAvatar != numberAvatarDefault){
                    nameContainer.innerHTML=`
                        ${nameContainer.innerHTML}
                        <img id="tick" src="/img/x.png" height="35px" style="margin-left:10px;" onclick="notChangeAvatarBack(${numberAvatar})"><img id="x" src="/img/tick.png" height="35px" style="margin-left:10px;" onclick="changeAvatarBack(${numberAvatar})">
                    `
                } else if (numberAvatar == numberAvatarDefault){
                    nameContainer.innerHTML=`
                        ${titleP.getAttribute('value')}
                    `
                }
            } else {
                if (numberAvatar == numberAvatarDefault){
                    nameContainer.innerHTML=`
                        ${titleP.getAttribute('value')}
                    `
                } else {
                    nameContainer.innerHTML=`
                        ${titleP.getAttribute('value')}
                        <img id="tick" src="/img/x.png" height="35px" style="margin-left:10px;" onclick="notChangeAvatarBack(${numberAvatar})"><img id="x" src="/img/tick.png" height="35px" style="margin-left:10px;" onclick="changeAvatarBack(${numberAvatar})">
                    `
                }
            }
        }
    } else {
        if (numberAvatar<7){
            avatarContainer.innerHTML=`
                    <div class="hub-avatar-left">
                        <img id="left-arrow" src="/img/flecha-izq.png" onclick="changeAvatar('left')">
                    </div>
                    <div class="hub-avatar-mid">
                        <img id="avatar" src="/img/sprite${numberAvatar+1}.png" alt="${numberAvatar+1}">
                    </div>
                    <div class="hub-avatar-right">
                        <img id="right-arrow" src="/img/flecha-der.png" onclick="changeAvatar('right')">
                    </div>
            `
            numberAvatar = numberAvatar+1;
            if (document.getElementById("tick") === null){
                if (numberAvatar != numberAvatarDefault){
                    nameContainer.innerHTML=`
                        ${nameContainer.innerHTML}
                        <img id="tick" src="/img/x.png" height="35px" style="margin-left:10px;" onclick="notChangeAvatarBack(${numberAvatar})"><img id="x" src="/img/tick.png" height="35px" style="margin-left:10px;" onclick="changeAvatarBack(${numberAvatar})">
                    `
                } else if (numberAvatar == numberAvatarDefault){
                    nameContainer.innerHTML=`
                        ${titleP.getAttribute('value')}
                    `
                }
            } else {
                if (numberAvatar == numberAvatarDefault){
                    nameContainer.innerHTML=`
                        ${titleP.getAttribute('value')}
                    `
                } else {
                    nameContainer.innerHTML=`
                        ${titleP.getAttribute('value')}
                        <img id="tick" src="/img/x.png" height="35px" style="margin-left:10px;" onclick="notChangeAvatarBack(${numberAvatar})"><img id="x" src="/img/tick.png" height="35px" style="margin-left:10px;" onclick="changeAvatarBack(${numberAvatar})">
                    `
                }
            }
        }
    }
}

//-----------

async function changeAvatarBack(data){
    numberAvatarDefault = parseInt(data);
    nameContainer.innerHTML=`
        ${titleP.getAttribute('value')}
    `

    sessionStorage.setItem('avatar',numberAvatarDefault)
    try {
        await fetch("/changeAvatar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({sprite:data}),
        });
    } catch (error) {
        console.error("Error:", error);
    };
}

function notChangeAvatarBack(){
    avatarContainer.innerHTML=`
        <div class="hub-avatar-left">
            <img id="left-arrow" src="/img/flecha-izq.png" onclick="changeAvatar('left')">
        </div>
        <div class="hub-avatar-mid">
            <img id="avatar" src="/img/sprite${numberAvatarDefault}.png" alt="${numberAvatarDefault}">
        </div>
        <div class="hub-avatar-right">
            <img id="right-arrow" src="/img/flecha-der.png" onclick="changeAvatar('right')">
        </div>
    `
    nameContainer.innerHTML=`
        ${titleP.getAttribute('value')}
    `
}

//-----------

socket.emit('relog', sessionStorage.getItem("user"));

function searchGameRandom(data){
    if(data == "random"){
        location.href="/queueRandom";
    } else {
        location.href="/queueTeams";
    }
}

//no se si sacarlo puede romper.
socket.on('start', (data) => {
    location.href="/game";
})

function sessionStorageSave(){
    let html=document.getElementById("hub-title-user");
    sessionStorage.setItem("id", socket.id);
    sessionStorage.setItem("user", html.getAttribute('value'));
    console.log("Se activo el Storage save user: ", sessionStorage);
}

