// ============================================================
// СОХРАНЕНИЕ (js/core/storage.js)
// ============================================================

import { 
    users, marketListings, traderInventory, 
    gameLog, marketStalls, confiscatedItems, diceGames,
    housingMarket, horseMarket 
} from './state.js';

// ============================================================
// ЗАГРУЗКА ДАННЫХ
// ============================================================
export function loadData() {
    try {
        const raw = localStorage.getItem('got_users');
        if (raw) Object.assign(users, JSON.parse(raw));
    } catch(e) { console.warn('Ошибка загрузки users:', e); }

    try {
        const raw = localStorage.getItem('got_market');
        if (raw) Object.assign(marketListings, JSON.parse(raw));
    } catch(e) { console.warn('Ошибка загрузки market:', e); }

    try {
        const raw = localStorage.getItem('got_trader');
        if (raw) Object.assign(traderInventory, JSON.parse(raw));
    } catch(e) { console.warn('Ошибка загрузки trader:', e); }

    try {
        const raw = localStorage.getItem('got_log');
        if (raw) Object.assign(gameLog, JSON.parse(raw));
    } catch(e) { console.warn('Ошибка загрузки log:', e); }

    try {
        const raw = localStorage.getItem('got_confiscated');
        if (raw) Object.assign(confiscatedItems, JSON.parse(raw));
    } catch(e) { console.warn('Ошибка загрузки confiscated:', e); }

    try {
        const raw = localStorage.getItem('got_dice_games');
        if (raw) Object.assign(diceGames, JSON.parse(raw));
    } catch(e) { console.warn('Ошибка загрузки dice:', e); }

    try {
        const raw = localStorage.getItem('got_market_stalls');
        if (raw) Object.assign(marketStalls, JSON.parse(raw));
    } catch(e) { console.warn('Ошибка загрузки stalls:', e); }

    loadHousingMarket();
    loadHorseMarket();
}

// ============================================================
// СОХРАНЕНИЕ ДАННЫХ
// ============================================================
export function saveData() {
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

// ============================================================
// РЫНОК ЖИЛЬЯ
// ============================================================
export function loadHousingMarket() {
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

export function saveHousingMarket() {
    localStorage.setItem('got_housing_market', JSON.stringify(housingMarket));
}

// ============================================================
// РЫНОК ЛОШАДЕЙ
// ============================================================
export function loadHorseMarket() {
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

export function saveHorseMarket() {
    localStorage.setItem('got_horse_market', JSON.stringify(horseMarket));
}

// ============================================================
// ТОРГОВЫЕ ЛАВКИ
// ============================================================
export function saveMarketStalls() {
    localStorage.setItem('got_market_stalls', JSON.stringify(marketStalls));
}

// ============================================================
// ТОРГОВЕЦ (ИНИЦИАЛИЗАЦИЯ)
// ============================================================
export function initTraderStock() {
    const shops = ['Оружейная лавка', 'Кожевник', 'Бронник', 'Плотник', 'Кузница'];
    
    shops.forEach(shop => {
        if (!traderInventory[shop]) traderInventory[shop] = {};
        
        if (shop === 'Оружейная лавка') {
            ['sword','spear','axe','mace','dagger','shield'].forEach(type => {
                traderInventory[shop][type + '|Обычное'] = 1;
            });
        }
        
        if (shop === 'Кузница') {
            traderInventory[shop]['Руда железная|Обычное'] = 15;
            traderInventory[shop]['Уголь|Обычное'] = 10;
            traderInventory[shop]['Сталь|Обычное'] = 3;
        }
    });
    saveData();
}

// ============================================================
// ДОБАВЛЕНИЕ/УДАЛЕНИЕ ТОВАРОВ У ТОРГОВЦА
// ============================================================
export function addTraderStock(place, itemKey, amount) {
    if (!traderInventory) traderInventory = {};
    if (!traderInventory[place]) traderInventory[place] = {};
    traderInventory[place][itemKey] = (traderInventory[place][itemKey] || 0) + amount;
    saveData();
}

export function removeTraderStock(place, itemKey, amount) {
    if (!traderInventory) traderInventory = {};
    if (!traderInventory[place]) traderInventory[place] = {};
    const current = traderInventory[place][itemKey] || 0;
    traderInventory[place][itemKey] = Math.max(0, current - amount);
    saveData();
}

export function getTraderStock(place, itemKey) {
    if (!traderInventory) traderInventory = {};
    if (!traderInventory[place]) traderInventory[place] = {};
    return traderInventory[place][itemKey] || 0;
}
