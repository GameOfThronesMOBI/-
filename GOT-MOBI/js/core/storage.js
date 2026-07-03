// ============================================================
// СТОРЭДЖ (STORAGE) — ФУНКЦИИ СОХРАНЕНИЯ
// ============================================================

function loadHousingMarket() {
    try {
        const raw = localStorage.getItem('got_housing_market');
        if (raw) {
            const parsed = JSON.parse(raw);
            for (let key in housingMarket) {
                if (parsed[key]) {
                    housingMarket[key].occupied = parsed[key].occupied || 0;
                }
            }
        }
    } catch(e) {}
}

function saveHousingMarket() {
    localStorage.setItem('got_housing_market', JSON.stringify(housingMarket));
}

function loadHorseMarket() {
    try {
        const raw = localStorage.getItem('got_horse_market');
        if (raw) {
            const parsed = JSON.parse(raw);
            for (let key in horseMarket) {
                if (parsed[key]) {
                    horseMarket[key].sold = parsed[key].sold || 0;
                    horseMarket[key].resetTime = parsed[key].resetTime || null;
                }
            }
        }
    } catch(e) {}
}

function saveHorseMarket() {
    localStorage.setItem('got_horse_market', JSON.stringify(horseMarket));
}

function checkHorseReset() {
    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    let reset = false;
    for (let key in horseMarket) {
        if (!horseMarket[key].resetTime || (now - horseMarket[key].resetTime) > weekMs) {
            horseMarket[key].sold = 0;
            horseMarket[key].resetTime = now;
            reset = true;
        }
    }
    if (reset) saveHorseMarket();
}

function initMarketStalls() {
    for (let i = 1; i <= MARKET_STALLS_TOTAL; i++) {
        if (!marketStalls[i]) {
            marketStalls[i] = {
                owner: null,
                rentPaid: null,
                rentDays: 0,
                inventory: [],
                prices: {}
            };
        }
    }
}

function loadMarketStalls() {
    try {
        const raw = localStorage.getItem('got_market_stalls');
        if (raw) {
            marketStalls = JSON.parse(raw);
        } else {
            initMarketStalls();
        }
    } catch(e) {
        initMarketStalls();
    }
}

function saveMarketStalls() {
    localStorage.setItem('got_market_stalls', JSON.stringify(marketStalls));
}

function loadData() {
    try { const raw = localStorage.getItem('got_users'); if (raw) users = JSON.parse(raw); } catch(e) { users = {}; }
    try { const rawMarket = localStorage.getItem('got_market'); if (rawMarket) marketListings = JSON.parse(rawMarket); } catch(e) { marketListings = []; }
    try { const rawTrader = localStorage.getItem('got_trader'); if (rawTrader) traderInventory = JSON.parse(rawTrader); } catch(e) { traderInventory = {}; }
    try { const rawLog = localStorage.getItem('got_log'); if (rawLog) gameLog = JSON.parse(rawLog); } catch(e) { gameLog = []; }
    try { const rawConfiscated = localStorage.getItem('got_confiscated'); if (rawConfiscated) confiscatedItems = JSON.parse(rawConfiscated); } catch(e) { confiscatedItems = []; }
    try { const rawDice = localStorage.getItem('got_dice_games'); if (rawDice) { const parsed = JSON.parse(rawDice); diceGames = parsed; } } catch(e) { diceGames = {}; }
    
    loadHousingMarket();
    loadHorseMarket();
    loadMarketStalls();
    
    if (Object.keys(traderInventory).length === 0) {
        initTraderStock();
    }
}

function saveData() { 
    localStorage.setItem('got_users', JSON.stringify(users));
    localStorage.setItem('got_market', JSON.stringify(marketListings));
    localStorage.setItem('got_trader', JSON.stringify(traderInventory));
    localStorage.setItem('got_confiscated', JSON.stringify(confiscatedItems));
    localStorage.setItem('got_dice_games', JSON.stringify(diceGames));
    if (gameLog.length > 100) gameLog = gameLog.slice(-100);
    localStorage.setItem('got_log', JSON.stringify(gameLog));
    saveHousingMarket();
    saveHorseMarket();
    saveMarketStalls();
}

function addTraderStock(place, itemKey, amount) {
    if (!traderInventory) traderInventory = {};
    if (!traderInventory[place]) traderInventory[place] = {};
    traderInventory[place][itemKey] = (traderInventory[place][itemKey] || 0) + amount;
    saveData();
}

function removeTraderStock(place, itemKey, amount) {
    if (!traderInventory) traderInventory = {};
    if (!traderInventory[place]) traderInventory[place] = {};
    const current = traderInventory[place][itemKey] || 0;
    traderInventory[place][itemKey] = Math.max(0, current - amount);
    saveData();
}

function getTraderStock(place, itemKey) {
    if (!traderInventory) traderInventory = {};
    if (!traderInventory[place]) traderInventory[place] = {};
    return traderInventory[place][itemKey] || 0;
}
