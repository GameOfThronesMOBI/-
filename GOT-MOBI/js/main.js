// ============================================================
// ЗАПУСК ИГРЫ (js/main.js)
// ============================================================

// ============================================================
// ИМПОРТЫ
// ============================================================
import { users, currentUser, gameLog } from './core/state.js';
import { loadData, saveData, initTraderStock } from './core/storage.js';
import { showPage, setMessage, hash, addLog, formatCurrency, spendMoney, convertCurrency, getTimeOfDay } from './core/utils.js';
import { NATIONALITIES } from './core/config.js';

// ============================================================
// ДЕЛАЕМ ФУНКЦИИ ГЛОБАЛЬНЫМИ (ДЛЯ onclick В HTML)
// ============================================================
window.showPage = showPage;
window.setMessage = setMessage;
window.hash = hash;
window.addLog = addLog;
window.formatCurrency = formatCurrency;
window.spendMoney = spendMoney;
window.convertCurrency = convertCurrency;

// ============================================================
// РЕГИСТРАЦИЯ
// ============================================================
window.handleRegister = function() {
    const name = document.getElementById('reg-name').value.trim();
    const password = document.getElementById('reg-password').value;
    const nationality = document.getElementById('reg-nationality').value;
    const secret = document.getElementById('reg-secret').value.trim();
    const errEl = document.getElementById('register-error');
    const okEl = document.getElementById('register-success');
    const formEl = document.getElementById('register-form');
    
    errEl.classList.add('hide');
    okEl.classList.add('hide');
    formEl.classList.remove('hide');
    
    if (!name || !password || !nationality || !secret) {
        errEl.textContent = '❌ Заполните все поля';
        errEl.classList.remove('hide');
        return;
    }
    if (name.length < 2) {
        errEl.textContent = '❌ Имя слишком короткое';
        errEl.classList.remove('hide');
        return;
    }
    if (password.length < 4) {
        errEl.textContent = '❌ Пароль слишком короткий';
        errEl.classList.remove('hide');
        return;
    }
    if (!NATIONALITIES[nationality]) {
        errEl.textContent = '❌ Выберите национальность';
        errEl.classList.remove('hide');
        return;
    }
    if (users[name]) {
        errEl.textContent = '❌ Это имя уже занято';
        errEl.classList.remove('hide');
        return;
    }
    
    const now = Date.now();
    const skills = {};
    ['sword', 'spear', 'mace', 'axe', 'bow', 'crossbow', 'shield', 'dagger'].forEach(s => {
        skills[s] = { level: 1, xp: 0 };
    });
    
    users[name] = {
        password: hash(password),
        nationality: nationality,
        secret: hash(secret),
        created: now,
        game: {
            gold: 100, silver: 0, copper: 0,
            food: 100, thirst: 100, fatigue: 100,
            hp: 60, maxHp: 60,
            level: 1, xp: 0, nextLevelXp: 100,
            attributePoints: 0,
            stats: { damage: 1, defense: 1, intelligence: 1, agility: 1 },
            equipment: { rightHand: null, leftHand: null, helmet: null, chestplate: null, shoulders: null, leggings: null, boots: null, gloves: null, belt: null, cloak: null, horse: null },
            skills: skills,
            stamina: { level: 1, xp: 0 },
            professions: { 'Шахтёр': 1, 'Лесоруб': 1, 'Охотник': 1, 'Кузнец': 1 },
            professionXp: { 'Шахтёр': 0, 'Лесоруб': 0, 'Охотник': 0, 'Кузнец': 0 },
            activeProfession: 'Охотник',
            lastProfessionChange: 0,
            inventory: [],
            location: { region: 'Королевские земли', location: 'Королевская Гавань', place: 'Таверна' },
            outside: false,
            death: null,
            lastReset: null,
            lastActive: now,
            online: true,
            lastResourceUpdate: now,
            luck: 0,
            lastHeal: null,
            lastPrayer: null,
            blessing: { active: false, expires: 0 },
            jail: null,
            activeBonuses: { crit: 5, pierce: 5, doubleHit: 5, counter: 5, points: 0 },
            marketStall: { owned: false, stallId: null, rentPaid: null, rentDays: 0, debt: 0 },
            housing: { type: null, purchased: null, rentPaid: null, rentDays: 0, debt: 0, storage: [], storageHold: [] },
            booksBoughtToday: 0,
            lastBookReset: now,
            quests: { completed: [], lastReset: 0, active: null, progress: {} },
            brothelBuffs: [],
            brothelRoom: false
        }
    };
    
    addLog('👤 ' + name + ' создал персонажа (' + nationality + ')');
    saveData();
    
    formEl.classList.add('hide');
    okEl.innerHTML = '✅ Поздравляем, <strong>' + name + '</strong>!<br>Вы — ' + nationality;
    okEl.classList.remove('hide');
    
    localStorage.setItem('got_user', name);
    setTimeout(function() {
        enterGame(name);
    }, 1200);
};

// ============================================================
// ВХОД
// ============================================================
window.handleLogin = function() {
    const name = document.getElementById('login-name').value.trim();
    const password = document.getElementById('login-password').value;
    const errEl = document.getElementById('login-error');
    errEl.classList.add('hide');
    
    if (!name || !password) {
        errEl.textContent = '❌ Заполните все поля';
        errEl.classList.remove('hide');
        return;
    }
    
    const user = users[name];
    if (!user || user.password !== hash(password)) {
        errEl.textContent = '❌ Неверное имя или пароль';
        errEl.classList.remove('hide');
        return;
    }
    
    localStorage.setItem('got_user', name);
    addLog('👤 ' + name + ' вошёл в игру');
    enterGame(name);
};

// ============================================================
// ВХОД В ИГРУ
// ============================================================
function enterGame(name) {
    const user = users[name];
    if (!user) return;
    
    showPage('game');
    user.game.online = true;
    user.game.lastActive = Date.now();
    
    updateMenu();
    updateStory();
    updateActions();
    
    setMessage('Добро пожаловать, ' + name + '!');
    saveData();
}

// ============================================================
// ОБНОВЛЕНИЕ МЕНЮ
// ============================================================
window.updateMenu = function() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    const time = getTimeOfDay();
    
    document.getElementById('menu-time').textContent = time.timeStr;
    document.getElementById('menu-period').textContent = time.emoji + ' ' + time.period;
    document.getElementById('menu-location').textContent = g.location.place || 'Таверна';
    document.getElementById('menu-hp').textContent = Math.round(g.hp);
    document.getElementById('menu-hp-max').textContent = Math.round(g.maxHp);
    document.getElementById('menu-level').textContent = g.level;
    document.getElementById('menu-gold').textContent = g.gold;
    document.getElementById('menu-silver').textContent = g.silver;
    document.getElementById('menu-copper').textContent = g.copper;
    document.getElementById('menu-food').textContent = Math.round(g.food);
    document.getElementById('menu-thirst').textContent = Math.round(g.thirst);
    document.getElementById('menu-fatigue').textContent = Math.round(g.fatigue);
};

// ============================================================
// ОБНОВЛЕНИЕ ИСТОРИИ
// ============================================================
window.updateStory = function() {
    const user = users[currentUser];
    if (!user) return;
    const place = user.game.location.place || 'Таверна';
    document.getElementById('story-title').textContent = '📍 ' + place;
    document.getElementById('story-text').textContent = 'Добро пожаловать в ' + place + '.';
};

// ============================================================
// ОБНОВЛЕНИЕ ДЕЙСТВИЙ
// ============================================================
window.updateActions = function() {
    const container = document.getElementById('actions-container');
    container.innerHTML = '';
    
    const actions = [
        { id: 'eat', label: '🍞 Поесть (+25 еды)' },
        { id: 'rest', label: '🛏️ Отдохнуть (10 МП)' },
        { id: 'talk', label: '🗣️ Поговорить' },
        { id: 'inventory', label: '🎒 Инвентарь' },
        { id: 'character', label: '👤 Персонаж' },
        { id: 'logout', label: '🚪 Выйти' }
    ];
    
    actions.forEach(a => {
        const btn = document.createElement('button');
        btn.className = 'btn-game';
        btn.textContent = a.label;
        btn.onclick = function() {
            if (a.id === 'eat') {
                const user = users[currentUser];
                if (user && user.game.food < 100) {
                    user.game.food = Math.min(100, user.game.food + 25);
                    setMessage('🍞 Вы поели. Еда +25.');
                    updateMenu();
                    saveData();
                } else {
                    setMessage('🍖 Вы сыты.');
                }
            } else if (a.id === 'rest') {
                const user = users[currentUser];
                if (user && spendMoney(user.game, 10)) {
                    user.game.fatigue = Math.min(100, user.game.fatigue + 30);
                    user.game.hp = Math.min(user.game.maxHp, user.game.hp + 15);
                    setMessage('🛏️ Вы отдохнули. Усталость +30, HP +15.');
                    updateMenu();
                    saveData();
                } else {
                    setMessage('❌ Недостаточно денег (10 МП).');
                }
            } else if (a.id === 'talk') {
                const msgs = [
                    '🍺 Трактирщик: «Добро пожаловать, путник!»',
                    '🍺 Трактирщик: «Хочешь заработать? Помой посуду.»',
                    '🍺 Трактирщик: «Будь осторожен за воротами.»'
                ];
                setMessage(msgs[Math.floor(Math.random() * msgs.length)]);
            } else if (a.id === 'inventory') {
                setMessage('🎒 Инвентарь (пока пустой)');
            } else if (a.id === 'character') {
                setMessage('👤 Персонаж (информация)');
            } else if (a.id === 'logout') {
                handleLogout();
            }
        };
        container.appendChild(btn);
    });
};

// ============================================================
// ВЫХОД
// ============================================================
window.handleLogout = function() {
    if (currentUser && users[currentUser]) {
        users[currentUser].game.online = false;
        users[currentUser].game.lastActive = Date.now();
        addLog('👤 ' + currentUser + ' вышел из игры');
        saveData();
    }
    localStorage.removeItem('got_user');
    currentUser = null;
    showPage('login');
    document.getElementById('login-name').value = '';
    document.getElementById('login-password').value = '';
};

// ============================================================
// ЗАПУСК
// ============================================================
loadData();
initTraderStock();

const savedUser = localStorage.getItem('got_user');
if (savedUser && users[savedUser]) {
    currentUser = savedUser;
    enterGame(savedUser);
} else {
    showPage('login');
}
