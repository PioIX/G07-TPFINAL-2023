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

