let opacity = 0;
let corruptionWall = document.createElement("div")
corruptionWall.style = `
height: 100%; 
width: 100%; 
background-image: url("https://media.tenor.com/GY5ihAZWNWEAAAAM/ojos.gif");
opacity: 0%;
position: absolute;
z-index: 100;
pointer-events: none;
`
corruptionWall.id = "evil"
let bodymaker = document.createElement('span')
bodymaker.innerText = "hi"
bodymaker.style = "display: block; style:hidden; height: 100vh"
document.getElementsByTagName("body")[0].prepend(corruptionWall)

function evilLoop() {
    if (opacity < 100) {
        setTimeout(() => {
            let randNum = Math.floor(Math.random() * (2 - 0 + 1)) + 0
            if (randNum < 2) {
                opacity += 0.00075
            } else {
                opacity -= 0.00025
            }
            console.log(opacity)
            document.getElementById("evil").style = `
                height: 100%; 
                width: 100%; 
                background-image: url("https://media.tenor.com/GY5ihAZWNWEAAAAM/ojos.gif");
                opacity: ${opacity}%;
                position: absolute;
                z-index: 100;
                pointer-events: none;
            `
            evilLoop()
        }, 500)
    }
}
evilLoop()
