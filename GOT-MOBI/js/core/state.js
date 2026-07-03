// ============================================================
// СОСТОЯНИЕ ИГРЫ (js/core/state.js)
// ============================================================

// ============================================================
// ПОЛЬЗОВАТЕЛИ И ТЕКУЩИЙ ИГРОК
// ============================================================
export let users = {};
export let currentUser = null;

// ============================================================
// СОСТОЯНИЕ ИГРЫ
// ============================================================
export let isBusy = false;
export let busyTimer = null;
export let searchCooldown = false;
export let battleState = null;

// ============================================================
// РЫНОК И ТОРГОВЛЯ
// ============================================================
export let marketListings = [];
export let traderInventory = {};
export let marketStalls = {};

// ============================================================
// ИНТЕРВАЛЫ
// ============================================================
export let resourceInterval = null;
export let autoSaveInterval = null;

// ============================================================
// ЛОГ И КОНФИСКАТ
// ============================================================
export let gameLog = [];
export let confiscatedItems = [];

// ============================================================
// КОСТИ (PvP)
// ============================================================
export let diceGames = {};
export let diceGameIdCounter = 0;

// ============================================================
// РЫНОК ЖИЛЬЯ
// ============================================================
export const housingMarket = {
    'night': { total: 400, occupied: 0 },
    'room': { total: 300, occupied: 0 },
    'house': { total: 250, occupied: 0 },
    'townhouse': { total: 80, occupied: 0 },
    'mansion': { total: 10, occupied: 0 }
};

// ============================================================
// РЫНОК ЛОШАДЕЙ
// ============================================================
export const horseMarket = {
    'work': { total: 50, sold: 0, resetTime: null },
    'riding': { total: 30, sold: 0, resetTime: null },
    'war': { total: 20, sold: 0, resetTime: null },
    'racer': { total: 15, sold: 0, resetTime: null },
    'heavy': { total: 10, sold: 0, resetTime: null },
    'royal': { total: 5, sold: 0, resetTime: null },
    'fire': { total: 1, sold: 0, resetTime: null }
};
