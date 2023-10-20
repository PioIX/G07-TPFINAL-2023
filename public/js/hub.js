// MUSIC
const socket = io();
const soundLogoContainer = document.getElementById("header-right");
const music = document.getElementById("music");
//const musicMeter = document.getElementById("volume-meter");
let musicVolume = 0.5;
let numberAvatarDefault = parseInt(document.getElementById("avatar").alt);
sessionStorage.setItem('avatar', numberAvatarDefault)
//musicMeter.addEventListener("change",function(ev){
//    music.volume = ev.currentTarget.value;
//    musicVolume = ev.currentTarget.value;
//},true);
  
function musicOnOff(){
    let soundLogo = document.getElementById("header-music-logo");
    if(soundLogo.alt === "muted"){
        music.volume = musicVolume;
        music.play();
        soundLogoContainer.innerHTML=`
            <img id="header-music-logo" src="/img/sound.png" onclick="musicOnOff()" alt="not-muted">
        `
    } else {
        music.volume = 0;
        soundLogoContainer.innerHTML=`
            <img id="header-music-logo" src="/img/muted.png" onclick="musicOnOff()" alt="muted">
        `
    }
}

// AVATARS

const avatarContainer = document.getElementById("avatar-container");
const nameContainer = document.getElementById("hub-title");

function changeAvatar(data){
    let numberAvatar = parseInt(document.getElementById("avatar").alt);; 
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
                        <p>${sessionStorage.getItem("user")}</p>
                    `
                }
            } else {
                if (numberAvatar == numberAvatarDefault){
                    nameContainer.innerHTML=`
                        <p>${sessionStorage.getItem("user")}</p>
                    `
                } else {
                    nameContainer.innerHTML=`
                        <p>${sessionStorage.getItem("user")}</p>
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
                        <p>${sessionStorage.getItem("user")}</p>
                    `
                }
            } else {
                if (numberAvatar == numberAvatarDefault){
                    nameContainer.innerHTML=`
                        <p>${sessionStorage.getItem("user")}</p>
                    `
                } else {
                    nameContainer.innerHTML=`
                        <p>${sessionStorage.getItem("user")}</p>
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
        <p>${sessionStorage.getItem("user")}</p>
    `
    sessionStorage.setItem('avatar', numberAvatarDefault)
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
        <p>${sessionStorage.getItem("user")}</p>
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
