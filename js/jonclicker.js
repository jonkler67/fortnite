const jonclicker_button = document.getElementById("jonclicker-button");
const particleBox = document.getElementById("jonclicker-particle-area");
const perfectFrameTime = 1000 / 60;
const smoothingFactor = 0.1; // smaller = smoother, larger = snappier


let click = false;
let deltaTime = 0;
let lastTimestamp = performance.now();
let lastCurrency;
let avgJps = new Decimal(0);
let save_timer = 0;
let save_timer_duration = 3


let player_data = {
    currency: new Decimal(0),
    buildings: [
        {
            name: "Anti-Serious Converters",
            descritpion: "Converts Anti-Serious Energey (ASE) into Jonkcoins.",
            amount: new Decimal(0)
        }
    ],
    upgrades: {
        Click: [
            {
                name: "Why So Serious?",
                image_src: "https://static.wikia.nocookie.net/why-so-serious/images/3/35/Jonkler.png",
                descritpion: "Decrese the seriousness of your clicks in order to increase Jonkcoin production base by clicking by 1",
                upgradeFormula: (base) => {
                    return base + 1
                },
                is_unlocked: () => {
                    return true
                },
                is_active: false
            }
        ],
        Anti_Serious_Converter: [
            {
                name: "Improved Capacitors",
                image_src: "https://www.faranux.com/wp-content/uploads/2017/07/pack-of-25-pieces-4700uf-25v-electrolytic-capacitor.webp",
                descritpion: "Anti-Serious Converters can collect more energy thanks to new Capacitors resulting in 2x efficiency!",
                upgradeFormula: (base) => {
                    return base * 2
                },
                is_unlocked: () => {
                    player_data.currency.greaterThan(new Decimal(1000))
                },
                is_active: false
            }
        ]
    }
}


function init() {
    loadGame()
    requestAnimationFrame(update);
}

/*
Game Save is as follows:
{
    "currency": Decimal,
    "buildings": [],
    "upgrades": [],
    -------------------------------------------------------------------------- WIP
    "presiges": Decimal,
    "prestige points": Decimal,
    "prestige upgrades": [],
}
*/
function loadGame() {
    console.log("%cLoading Data", "font-size: 100px;");

    let data = localStorage.getItem("jonclicker-data");
    if (data) {
        player_data = JSON.parse(data);

        // Convert currency back to Decimal
        player_data.currency = new Decimal(player_data.currency);

        // Convert building amounts
        player_data.buildings.forEach(b => {
            b.amount = new Decimal(b.amount);
        });

        lastCurrency = player_data.currency;
        console.log("%cData Loaded", "font-size: 100px;");
    } else {
        console.log("%cNo save found, starting new game", "font-size: 50px;");
        lastCurrency = new Decimal(0);
    }
}

function saveGame() {
    console.log("%cStarting Save", "font-size: 100px;")
    localStorage.setItem("jonclicker-data", JSON.stringify(player_data))
    console.log("%cData Saved", "font-size: 100px;")
}


function update(timestamp) {
    requestAnimationFrame(update);

    let deltaTime = (timestamp - lastTimestamp) / 1000; // in seconds
    lastTimestamp = timestamp;

    save_timer += deltaTime

    if (save_timer >= save_timer_duration) {
        saveGame()
        save_timer = 0
    }

    if (deltaTime > 0) {
        updateCurrency(deltaTime, timestamp / 1000);
    }
}

function updateCurrency(deltaTime) {

    if (click) {
        player_data.currency = player_data.currency.plus(1)
        click = false
    }

    const dt = new Decimal(deltaTime);
    const diff = player_data.currency.minus(lastCurrency);
    lastCurrency = player_data.currency;

    if (dt.eq(0)) return;

    const instantJps = diff.div(dt);

    // EMA formula
    avgJps = avgJps.mul(new Decimal(1 - smoothingFactor))
        .add(instantJps.mul(new Decimal(smoothingFactor)));

    if (avgJps.greaterThan(0.01)) {
        document.getElementById("jps").innerText = avgJps.toFixed(2);
    } else {
        document.getElementById("jps").innerText = "0.00";
    }

    document.getElementById("jonkcoins").innerText = player_data.currency.toFixed(2)
}

function createParticle(parentElement = document.body) {
    const particle = document.createElement("div");
    let randNumX = Math.floor(Math.random() * (50 - 0 + 1)) + 25
    let randNumY = Math.floor(Math.random() * (50 - 0 + 1)) + 25
    let randNumendX = Math.floor(Math.random() * (50 - 0 + 1)) + 25
    let randNumendY = Math.floor(Math.random() * (50 - 0 + 1)) + 25
    particle.style = `--particle-posX : ${randNumX}%; --particle-posY : ${randNumY}%;--particle-pos-endX : ${randNumendX}%; --particle-pos-endY : ${randNumendY}%;`
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

    click = true
});

init()