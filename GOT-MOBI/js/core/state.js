// ============================================================
// СТЕЙТ (STATE) — ВСЕ ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ============================================================

let users = {};
let currentUser = null;
let isBusy = false;
let busyTimer = null;
let searchCooldown = false;
let battleState = null;
let marketListings = [];
let traderInventory = {};
let resourceInterval = null;
let autoSaveInterval = null;
let gameLog = [];
let housingMarket = {
    'night': { total: 400, occupied: 0 },
    'room': { total: 300, occupied: 0 },
    'house': { total: 250, occupied: 0 },
    'townhouse': { total: 80, occupied: 0 },
    'mansion': { total: 10, occupied: 0 }
};
let horseMarket = {
    'work': { total: 50, sold: 0, resetTime: null },
    'riding': { total: 30, sold: 0, resetTime: null },
    'war': { total: 20, sold: 0, resetTime: null },
    'racer': { total: 15, sold: 0, resetTime: null },
    'heavy': { total: 10, sold: 0, resetTime: null },
    'royal': { total: 5, sold: 0, resetTime: null },
    'fire': { total: 1, sold: 0, resetTime: null }
};
let confiscatedItems = [];
let diceGames = {};
let diceGameIdCounter = 0;
let marketStalls = {};
