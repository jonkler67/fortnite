const jonclicker_button = document.getElementById("jonclicker-button");
const particleBox = document.getElementById("jonclicker-particle-area");

function createParticle(parentElement = document.body) {
    const particle = document.createElement("div");
    let randNumX = Math.floor(Math.random() * (50 - 0 + 1)) + 25
    let randNumY = Math.floor(Math.random() * (50 - 0 + 1)) + 25
    let randNumendX = Math.floor(Math.random() * (50 - 0 + 1)) + 25
    let randNumendY = Math.floor(Math.random() * (50 - 0 + 1)) + 25
    particle.style = `--particle-posX : ${randNumX}%; --particle-posY : ${randNumY}%;--particle-pos-endX : ${randNumX}%; --particle-pos-endY : ${randNumY}%;`
    particle.classList.add("particle");
    particle.innerHTML = `<div style="background-image: url('https://static.wikia.nocookie.net/why-so-serious/images/3/35/Jonkler.png'); background-position: center; background-size: 100%;">
    <span style="display: block; visibility: hidden;" >hi </span>
    </div> `;
    if (parentElement) {
        parentElement.append(particle);
    }
    return particle;
}

jonclicker_button.addEventListener("click", function () {
    const particle = createParticle(particleBox);
    particle.addEventListener("animationend", function () {
        particle.remove();
    });
});