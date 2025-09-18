// Client side currency - for demo, starts at 100
let clientCurrency;
getCurrency()

function getCurrency() {
    console.log("jonkgotten")
    clientCurrency = parseInt(localStorage.getItem("jonkbucks"))
    if (clientCurrency == null || clientCurrency < 0 || clientCurrency == Infinity || isNaN(clientCurrency)) {
        console.log("jonkbad " + clientCurrency)
        clientCurrency = 100;
    }
    document.getElementById('currency-display').textContent = clientCurrency;
}

function updateCurrency(amount) {
    clientCurrency += amount;
    if (clientCurrency < 0) clientCurrency = 0;
    localStorage.setItem("jonkbucks", clientCurrency)
    console.log("jonkbucks updated")
    document.getElementById('currency-display').textContent = clientCurrency;
}

// Playtime/odds skew
var playtime = 35; // minutes, to be overwritten by server as needed
function getFavorableChance() {
    // If playtime > 30, only 30% chance of a favorable outcome (for player)
    return playtime > 30 ? 0.3 : 0.5;
}

let isOver18 = null;

function setAgeAndContinue(over18) {
    isOver18 = over18;
    document.getElementById('age-gate').style.display = 'none';
    if (over18) {
        document.getElementById('game-zone').style.display = '';
        getCurrency(); // reset on entry for demo
    } else {
        document.getElementById('underage-message').style.display = '';
    }
}

function showGame(game) {
    const div = document.getElementById('game-content');
    let inner;
    if (game === 'holdem') {
        inner = `
                <div class="game-bg">
                    <h3>Texas Hold 'Em (Single Hand Demo)</h3>
                    <div>
                        <span>Bet: </span>
                        <input id="holdem-bet" type="number" min="1" max="${clientCurrency}" value="10" style="width:70px;">
                    </div>
                    <p>Player Hand: <span id="holdem-player"></span></p>
                    <p>Dealer Hand: <span id="holdem-dealer"></span></p>
                    <p>Community Cards: <span id="holdem-community"></span></p>
                    <button class="btn btn-success" onclick="dealHoldem()">Deal</button>
                    <p id="holdem-result"></p>
                </div>
            `;
    } else if (game === 'mines') {
        inner = `
                <div class="game-bg">
                    <h3>Mines (Click to Reveal, Avoid the Mine)</h3>
                    <div>
                        <span>Bet: </span>
                        <input id="mines-bet" type="number" min="1" max="${clientCurrency}" value="10" style="width:70px;">
                        <button class="btn btn-success btn-sm" onclick="setupMines()">Start</button>
                    </div>
                    <div id="mines-board" style="display: flex; gap: 8px; margin-top:10px;"></div>
                    <button class="btn btn-secondary mt-2" onclick="setupMines()" style="display:none;" id="mines-restart">Restart</button>
                    <p id="mines-message"></p>
                </div>
            `;
    } else if (game === 'blackjack') {
        inner = `
                <div class="game-bg">
                    <h3>Blackjack</h3>
                    <div>
                        <span>Bet: </span>
                        <input id="bj-bet" type="number" min="1" max="${clientCurrency}" value="10" style="width:70px;">
                        <button class="btn btn-success btn-sm" onclick="bjDeal()">Deal</button>
                    </div>
                    <div>Player: <span id="bj-player"></span> (<span id="bj-player-sum"></span>)</div>
                    <div>Dealer: <span id="bj-dealer"></span> (<span id="bj-dealer-sum"></span>)</div>
                    <button class="btn btn-success" onclick="bjHit()">Hit</button>
                    <button class="btn btn-primary" onclick="bjStand()">Stand</button>
                    <button class="btn btn-secondary" onclick="bjDeal()">Restart</button>
                    <p id="bj-message"></p>
                </div>
            `;
    } else if (game === 'roulette') {
        // NEW ROULETTE UI AND LOGIC
        inner = `
                <div class="game-bg">
                    <h3>Roulette</h3>
                    <div>
                        <span>Bet Amount: </span>
                        <input id="roulette-bet-amt" type="number" min="1" max="${clientCurrency}" value="10" style="width:70px;">
                        <button class="btn btn-success btn-sm" onclick="spinRoulette()">Spin</button>
                    </div>
                    <div class="roulette-table">
                        <div class="roulette-grid" id="roulette-grid"></div>
                        <div class="roulette-groups">
                            <button class="btn btn-secondary roulette-group-btn" data-bet="red" onclick="addRouletteBet('red')">Red</button>
                            <button class="btn btn-dark roulette-group-btn" data-bet="black" onclick="addRouletteBet('black')">Black</button>
                            <button class="btn btn-info roulette-group-btn" data-bet="even" onclick="addRouletteBet('even')">Even</button>
                            <button class="btn btn-info roulette-group-btn" data-bet="odd" onclick="addRouletteBet('odd')">Odd</button>
                            <button class="btn btn-warning roulette-group-btn" data-bet="1-18" onclick="addRouletteBet('1-18')">1-18</button>
                            <button class="btn btn-warning roulette-group-btn" data-bet="19-36" onclick="addRouletteBet('19-36')">19-36</button>
                        </div>
                    </div>
                    <div id="roulette-bets" class="roulette-bet-summary"></div>
                    <div id="roulette-result"></div>
                </div>
            `;
    } else if (game === 'slots') {
        inner = `
                <div class="game-bg">
                    <h3>Slots</h3>
                    <div>
                        <span>Bet: </span>
                        <input id="slots-bet" type="number" min="1" max="${clientCurrency}" value="10" style="width:70px;">
                        <button class="btn btn-success btn-sm" onclick="spinSlots()">Spin</button>
                    </div>
                    <div id="slots-result" style="font-size:2em">- - -</div>
                    <p id="slots-message"></p>
                </div>
            `;
    }
    div.innerHTML = inner;
    // --- Initialize roulette grid if shown
    if (game === 'roulette') setupRouletteGrid();
}

// --- ROULETTE LOGIC ---
// Helper: which numbers are red
function isRouletteRed(n) {
    return [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(n);
}
let rouletteBets = {}; // {betSpot: amount}
function setupRouletteGrid() {
    const grid = document.getElementById('roulette-grid');
    if (!grid) return;
    grid.innerHTML = "";
    // 0 (green)
    let btn0 = document.createElement('button');
    btn0.className = 'roulette-btn green';
    btn0.textContent = "0";
    btn0.onclick = addRouletteBet(0);
    grid.appendChild(btn0);
    // 1-36
    for (let i = 1; i <= 36; ++i) {
        let btn = document.createElement('button');
        btn.className = 'roulette-btn ' + (isRouletteRed(i) ? 'red' : 'black');
        btn.textContent = i;
        btn.onclick = () => addRouletteBet(i);
        grid.appendChild(btn);
    }
    rouletteBets = {};
    updateRouletteBetsDisplay();
    document.getElementById('roulette-result').textContent = '';
}

function addRouletteBet(bet) {
    let amt = parseInt(document.getElementById('roulette-bet-amt').value, 10);
    if (isNaN(amt) || amt < 1 || amt > clientCurrency) return;
    bet = String(bet);
    if (!rouletteBets[bet]) rouletteBets[bet] = 0;
    rouletteBets[bet] += amt;
    updateRouletteBetsDisplay();
}
function updateRouletteBetsDisplay() {
    let s = Object.keys(rouletteBets).length === 0
        ? "<i>No bets yet</i>"
        : Object.entries(rouletteBets).map(([k, v]) =>
            `<span style="margin-right:10px;">${k} <span class="roulette-chip">${v}</span></span>`
        ).join('');
    document.getElementById('roulette-bets').innerHTML = s;
}

function spinRoulette() {
    if (Object.keys(rouletteBets).length === 0) {
        document.getElementById('roulette-result').textContent = "Place at least one bet!";
        return;
    }
    // Total bet
    let totalBet = Object.values(rouletteBets).reduce((a, b) => a + b, 0);
    if (totalBet > clientCurrency) {
        document.getElementById('roulette-result').textContent = "Not enough currency!";
        return;
    }
    updateCurrency(-totalBet);

    // Spin result (with house edge skew)
    let playerWin = Math.random() < getFavorableChance();
    // If playerWin: pick a number that will pay out at least one bet
    // If not: pick a number that does NOT pay out any bet
    let possibleWins = [];
    let possibleLosses = [];
    for (let n = 0; n <= 36; ++n) {
        let wins = false;
        for (const k in rouletteBets) {
            if (rouletteBetPays(k, n)) { wins = true; break; }
        }
        if (wins) possibleWins.push(n);
        else possibleLosses.push(n);
    }
    let result;
    if (playerWin && possibleWins.length > 0) {
        result = possibleWins[Math.floor(Math.random() * possibleWins.length)];
    } else {
        result = possibleLosses.length > 0
            ? possibleLosses[Math.floor(Math.random() * possibleLosses.length)]
            : Math.floor(Math.random() * 37);
    }

    // Calculate winnings
    let winnings = 0, details = [];
    for (const [bet, amt] of Object.entries(rouletteBets)) {
        let payout = 0;
        if (rouletteBetPays(bet, result)) {
            if (!isNaN(parseInt(bet))) payout = amt * 35; // Number bet
            else if (bet === "red" || bet === "black" || bet === "even" || bet === "odd" || bet === "1-18" || bet === "19-36")
                payout = amt * 2; // Group bets
            winnings += payout;
            details.push(`Bet ${bet}: WIN ${payout}`);
        } else {
            details.push(`Bet ${bet}: Lose ${amt}`);
        }
    }
    if (winnings > 0) updateCurrency(winnings);
    document.getElementById('roulette-result').innerHTML =
        `Ball landed on <b>${result}</b>.<br>` + details.join('<br>');
    rouletteBets = {};
    updateRouletteBetsDisplay();
}
function rouletteBetPays(bet, result) {
    bet = String(bet);
    if (!isNaN(parseInt(bet))) return parseInt(bet) === result;
    if (bet === "red") return isRouletteRed(result);
    if (bet === "black") return !isRouletteRed(result) && result !== 0;
    if (bet === "even") return result !== 0 && result % 2 === 0;
    if (bet === "odd") return result % 2 === 1;
    if (bet === "1-18") return result >= 1 && result <= 18;
    if (bet === "19-36") return result >= 19 && result <= 36;
    return false;
}
// Texas Hold 'Em (skew: player gets a strong hand at favorable odds)
function dealHoldem() {
    let bet = parseInt(document.getElementById('holdem-bet').value, 10);
    if (isNaN(bet) || bet < 1 || bet > clientCurrency) {
        document.getElementById('holdem-result').textContent = "Invalid bet!";
        return;
    }
    updateCurrency(-bet);

    function randCard() {
        const vals = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const suits = ['♠', '♥', '♦', '♣'];
        return vals[Math.floor(Math.random() * vals.length)] + suits[Math.floor(Math.random() * suits.length)];
    }
    let favorable = Math.random() < getFavorableChance();
    let player, dealer, outcome;
    if (favorable) {
        player = ['A♠', 'A♥'];
        dealer = [randCard(), randCard()];
        outcome = "You win!";
        updateCurrency(bet * 2);
    } else {
        player = [randCard(), randCard()];
        dealer = ['A♠', 'A♥'];
        outcome = "Dealer wins!";
    }
    let community = [randCard(), randCard(), randCard(), randCard(), randCard()];
    document.getElementById('holdem-player').textContent = player.join(', ');
    document.getElementById('holdem-dealer').textContent = dealer.join(', ');
    document.getElementById('holdem-community').textContent = community.join(', ');
    document.getElementById('holdem-result').textContent = outcome;
}

// Mines (skew: favorable means mine is at a predictable safe location)
let minesMineIndex = null, minesRevealed = [], minesBet = 0, minesActive = false;
function setupMines() {
    let betInput = document.getElementById('mines-bet');
    if (!betInput) return; // not started yet
    let bet = parseInt(betInput.value, 10);
    if (isNaN(bet) || bet < 1 || bet > clientCurrency) {
        document.getElementById('mines-message').textContent = "Invalid bet!";
        return;
    }
    updateCurrency(-bet);
    minesBet = bet;
    minesActive = true;

    const board = document.getElementById('mines-board');
    board.innerHTML = '';
    let favorable = Math.random() < getFavorableChance();
    if (favorable) {
        minesMineIndex = 5; // Always put mine at last spot
    } else {
        minesMineIndex = Math.floor(Math.random() * 6);
    }
    minesRevealed = Array(6).fill(false);
    document.getElementById('mines-message').textContent = '';
    document.getElementById('mines-restart').style.display = 'none';
    for (let i = 0; i < 6; i++) {
        let btn = document.createElement('button');
        btn.className = 'btn btn-secondary';
        btn.textContent = '?';
        btn.onclick = function () {
            if (!minesActive || minesRevealed[i]) return;
            minesRevealed[i] = true;
            if (i === minesMineIndex) {
                btn.textContent = '💣';
                btn.className = 'btn btn-danger';
                document.getElementById('mines-message').textContent = 'Boom! You hit the mine. Lost your bet.';
                minesActive = false;
                document.getElementById('mines-restart').style.display = '';
            } else {
                btn.textContent = '✅';
                btn.className = 'btn btn-success';
                if (minesRevealed.filter(Boolean).length === 5) {
                    document.getElementById('mines-message').textContent = 'You win! Dodged the mine and double your bet!';
                    updateCurrency(minesBet * 2);
                    minesActive = false;
                    document.getElementById('mines-restart').style.display = '';
                }
            }
        };
        board.appendChild(btn);
    }
}

// Blackjack (skew: favorable odds = dealer busts more often)
let bjDeck, bjPlayer, bjDealer, bjPlayerSum, bjDealerSum, bjPlayerDone, bjBet = 0;
function bjDeal() {
    let betInput = document.getElementById('bj-bet');
    if (betInput) {
        let bet = parseInt(betInput.value, 10);
        if (isNaN(bet) || bet < 1 || bet > clientCurrency) {
            document.getElementById('bj-message').textContent = "Invalid bet!";
            return;
        }
        bjBet = bet;
        updateCurrency(-bet);
    }
    bjDeck = [];
    const vals = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits = ['♠', '♥', '♦', '♣'];
    for (let v of vals) for (let s of suits) bjDeck.push({ v, s });
    bjDeck = bjDeck.sort(() => Math.random() - 0.5);
    bjPlayer = [bjDeck.pop(), bjDeck.pop()];
    bjDealer = [bjDeck.pop(), bjDeck.pop()];
    bjPlayerDone = false;
    updateBJ();
    document.getElementById('bj-message').textContent = '';
}
function bjValue(hand) {
    let v = 0, aces = 0;
    for (let c of hand) {
        if (c.v === 'A') { v += 11; aces++; }
        else if (['K', 'Q', 'J'].includes(c.v)) v += 10;
        else v += +c.v;
    }
    while (v > 21 && aces > 0) { v -= 10; aces--; }
    return v;
}
function updateBJ() {
    document.getElementById('bj-player').textContent = bjPlayer.map(c => c.v + c.s).join(', ');
    document.getElementById('bj-player-sum').textContent = bjValue(bjPlayer);
    document.getElementById('bj-dealer').textContent = bjPlayerDone
        ? bjDealer.map(c => c.v + c.s).join(', ')
        : bjDealer[0].v + bjDealer[0].s + ', ?';
    document.getElementById('bj-dealer-sum').textContent = bjPlayerDone
        ? bjValue(bjDealer)
        : '?';
}
function bjHit() {
    if (bjPlayerDone || bjBet === 0) return;
    bjPlayer.push(bjDeck.pop());
    updateBJ();
    let val = bjValue(bjPlayer);
    if (val > 21) {
        document.getElementById('bj-message').textContent = 'Bust! You lose your bet.';
        bjPlayerDone = true;
        updateBJ();
    }
}
function bjStand() {
    if (bjPlayerDone || bjBet === 0) return;
    bjPlayerDone = true;
    let favorable = Math.random() < getFavorableChance();
    if (favorable) {
        // Dealer will bust by drawing until over 21
        while (bjValue(bjDealer) <= 21) {
            bjDealer.push({ v: 'K', s: '♠' }); // high chance to bust
        }
    } else {
        while (bjValue(bjDealer) < 17) bjDealer.push(bjDeck.pop());
    }
    let playerVal = bjValue(bjPlayer), dealerVal = bjValue(bjDealer);
    let msg = '';
    if (dealerVal > 21) {
        msg = 'Dealer busts, you win! Double your bet!';
        updateCurrency(bjBet * 2);
    }
    else if (playerVal > dealerVal) {
        msg = 'You win! Double your bet!';
        updateCurrency(bjBet * 2);
    }
    else if (playerVal < dealerVal) {
        msg = 'Dealer wins! Lost your bet.';
    }
    else {
        msg = 'Push! Bet returned.';
        updateCurrency(bjBet);
    }
    document.getElementById('bj-message').textContent = msg;
    updateBJ();
}

// Slots (skew: favorable = jackpot much more likely)
function spinSlots() {
    let bet = parseInt(document.getElementById('slots-bet').value, 10);
    if (isNaN(bet) || bet < 1 || bet > clientCurrency) {
        document.getElementById('slots-message').textContent = "Invalid bet!";
        return;
    }
    updateCurrency(-bet);
    const icons = ['🍒', '🍋', '7️⃣', '🍉', '⭐', '🔔'];
    let favorable = Math.random() < getFavorableChance();
    let vals;
    let payout = 0;
    if (favorable) {
        let i = Math.floor(Math.random() * icons.length);
        vals = [icons[i], icons[i], icons[i]];
        payout = bet * 20;
    } else {
        // Avoid jackpot
        let i1 = Math.floor(Math.random() * icons.length);
        let i2 = (i1 + 1 + Math.floor(Math.random() * (icons.length - 1))) % icons.length;
        let i3 = (i1 + 2 + Math.floor(Math.random() * (icons.length - 2))) % icons.length;
        vals = [icons[i1], icons[i2], icons[i3]];
        if (vals[0] === vals[1] || vals[1] === vals[2] || vals[0] === vals[2]) payout = bet * 2;
    }
    document.getElementById('slots-result').textContent = vals.join(' ');
    let msg = '';
    if (vals[0] === vals[1] && vals[1] === vals[2]) {
        msg = 'Jackpot! You win ' + payout + '!';
        updateCurrency(payout);
    }
    else if (payout > 0) {
        msg = 'Two of a kind! You win ' + payout + '!';
        updateCurrency(payout);
    }
    else msg = 'Try again! Lost your bet.';
    document.getElementById('slots-message').textContent = msg;
}
