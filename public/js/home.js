// MUSIC

const soundLogoContainer = document.getElementById("header-right");
const music = document.getElementById("music");
//const musicMeter = document.getElementById("volume-meter");
let musicVolume = 0.5;
let numberAvatarDefault = parseInt(document.getElementById("avatar").alt);

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
    let numberAvatar = parseInt(document.getElementById("avatar").alt);
    console.log(numberAvatar)
    console.log(numberAvatarDefault)
    if (numberAvatar !== numberAvatarDefault){
        console.log("HOla")
        nameContainer.innerHTML=`
            ${nameContainer.innerHTML}
            <img id="tick" src="/img/x.png" height="35px" style="margin-left:10px;" onclick="notChange()"><img id="x" src="/img/tick.png" height="35px" style="margin-left:10px;" onclick="">
        `
    }
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
        }
    }
}


const colorType = {
    normal: "#D6D6D6",
    fire: "#F08030",
    water: "#6890F0",
    grass: "#78C850",
    electric: "#F8D030",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dark: "#705848",
    dragon: "#7038F8",
    steel: "#B8B8D0",
    fairy: "#F0B6BC",
}
