
const soundLogoContainer = document.getElementById("header-right");
const music = document.getElementById("music");
const musicMeter = document.getElementById("volume-meter");
let musicVolume = sessionStorage.getItem('volume');
console.log(musicVolume)
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
        console.log(musicVolume)
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

const eloRoster = document.getElementById("ranking-container-mini");
const eloRandom = document.getElementById("ranking-container-random");
const rosterContainerTitle = document.getElementById("ranking-title");
const randomContainerTitle = document.getElementById("ranking-title-random");

function changeScreen(){
    if (eloRandom.style.display === "none"){
        eloRandom.style.display = "flex";
        eloRoster.style.display = "none";
    } else{
        eloRoster.style.display = "flex";
        eloRandom.style.display = "none";

    }
}

