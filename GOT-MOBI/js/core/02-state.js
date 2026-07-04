// ============================================================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ ИГРЫ
// ============================================================

// Пользователи и текущий игрок
let users = {};
let currentUser = null;

// Состояние занятости
let isBusy = false;
let busyTimer = null;

// Поиск (кулдаун)
let searchCooldown = false;

// Бой
let battleState = null;

// Рынок и торговля
let marketListings = [];
let traderInventory = {};
const MARKET_STALLS_TOTAL = 50;
let marketStalls = {};

// Интервалы
let resourceInterval = null;
let autoSaveInterval = null;

// Лог событий
let gameLog = [];

// Рынок жилья
let housingMarket = {
    'night': { total: 400, occupied: 0 },
    'room': { total: 300, occupied: 0 },
    'house': { total: 250, occupied: 0 },
    'townhouse': { total: 80, occupied: 0 },
    'mansion': { total: 10, occupied: 0 }
};

// Рынок лошадей
let horseMarket = {
    'work': { total: 50, sold: 0, resetTime: null },
    'riding': { total: 30, sold: 0, resetTime: null },
    'war': { total: 20, sold: 0, resetTime: null },
    'racer': { total: 15, sold: 0, resetTime: null },
    'heavy': { total: 10, sold: 0, resetTime: null },
    'royal': { total: 5, sold: 0, resetTime: null },
    'fire': { total: 1, sold: 0, resetTime: null }
};

// Конфискат
let confiscatedItems = [];

// Кости (PvP)
let diceGames = {};
let diceGameIdCounter = 0;

// Кулдауны храма
const TEMPLE_COOLDOWNS = { heal: 2 * 60 * 60 * 1000 };
