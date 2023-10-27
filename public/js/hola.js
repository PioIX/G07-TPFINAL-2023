const hola = document.getElementById("hola");
const foto = document.getElementById("pokemon-p2-ingame-img");
const foto2 = document.getElementById("pokemon-p1-ingame-img");
const bar2 = document.getElementById("hola2")
const audio = document.getElementById("audio")

function chau(){
    hola.style.width = "70%"
    hola.style.transition = "all 3s linear 0s";
}

function moverPokemon2Ataque(){
    
    foto.style = `
        position: absolute;
        left: 463px;
        bottom: 357px;
        transition: 0.6s ease;
    `
    setTimeout(()=>{
        audio.play();
    },650)
    setTimeout(()=>{
        audio.play();
        foto.style = `
        position: absolute;
        left: 788px; 
        bottom: 595px;
        transition: 0.6s ease;
    `
    }, 700)

    setTimeout(()=>{
        foto2.style = `
            left: 222px;
            transition: 0.1s;
        `
    }, 1400)

    setTimeout(()=>{
        foto2.style = `
            left: 233px;
            transition: 0.1s;
        `
    }, 1500)

    setTimeout(()=>{
        foto2.style = `
            left: 222px;
            transition: 0.1s;
        `
    }, 1600)

    setTimeout(()=>{
        foto2.style = `
            left: 233px;
            transition: 0.1s;
        `
    }, 1700)

    setTimeout(()=>{
        foto2.style = `
            left: 222px;
            transition: 0.1s;
        `
    }, 1800)

    setTimeout(()=>{
        foto2.style = `
            left: 233px;
            transition: 0.1s;
        `
    }, 1900)

    setTimeout(()=>{
        foto2.style = `
            left: 222px;
            transition: 0.1s;
        `
    }, 2000)

    setTimeout(()=>{
        foto2.style = `
            left: 233px;
            transition: 0.1s;
        `
    }, 2100)

    setTimeout(()=>{
        foto2.style = `
            left: 222px;
            transition: 0.1s;
        `
    }, 2200)

    setTimeout(()=>{
        foto2.style = `
            left: 233px;
            transition: 0.1s;
        `
    }, 2300)

    setTimeout(()=>{
        foto2.style = `
            left: 222px;
            transition: 0.1s;
        `
    }, 2400)

    setTimeout(()=>{
        foto2.style = `
            left: 233px;
            transition: 0.1s;
        `
    }, 2500)

    setTimeout(()=>{
        foto2.style = `
            left: 228px;
            transition: 0.1s;
        `
    }, 2600)

    setTimeout(()=>{
        bar2.style.width = "10%"
        bar2.style.transition = "all 5s linear 0s";
    }, 2700)

}