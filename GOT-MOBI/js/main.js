// ============================================================
// ПРИВЯЗКА СОБЫТИЙ
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById('btn-login').addEventListener('click', handleLogin);
    document.getElementById('btn-to-register').addEventListener('click', function() { showPage('register'); });
    
    document.getElementById('btn-register').addEventListener('click', handleRegister);
    document.getElementById('btn-to-login').addEventListener('click', function() { showPage('login'); });
    
    document.getElementById('btn-logout').addEventListener('click', handleLogout);
    document.getElementById('btn-character').addEventListener('click', openCharacter);
    document.getElementById('btn-inventory').addEventListener('click', openInventory);
    document.getElementById('btn-map').addEventListener('click', openMap);
    document.getElementById('btn-log').addEventListener('click', openLog);
    document.getElementById('btn-menu').addEventListener('click', openMainMenu);
    document.getElementById('btn-online-list').addEventListener('click', showOnlineList);
    
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) this.classList.add('hide');
        });
    });
    
    document.getElementById('close-character').addEventListener('click', function() { document.getElementById('modal-character').classList.add('hide'); });
    document.getElementById('close-inventory').addEventListener('click', function() { document.getElementById('modal-inventory').classList.add('hide'); });
    document.getElementById('close-map').addEventListener('click', closeMap);
    document.getElementById('close-houses-btn').addEventListener('click', closeHouses);
    document.getElementById('close-online').addEventListener('click', closeOnline);
    document.getElementById('close-menu-btn').addEventListener('click', closeMenu);
    document.getElementById('close-trade').addEventListener('click', function() { document.getElementById('modal-trade').classList.add('hide'); });
    document.getElementById('close-guild').addEventListener('click', function() { document.getElementById('modal-guild').classList.add('hide'); });
    document.getElementById('close-log').addEventListener('click', closeLog);
    
});

// ============================================================
// ЯДРО ИГРЫ
// ============================================================

// --- РЕГИСТРАЦИЯ ---
function handleRegister() {
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
    
    currentUser = name;
    localStorage.setItem('got_user', name);
    setTimeout(function() { enterGame(name); }, 1200);
}

// --- ВХОД ---
function handleLogin() {
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
    currentUser = name;
    addLog('👤 ' + name + ' вошёл в игру');
    enterGame(name);
}

// --- ВХОД В ИГРУ ---
function fixOldAccount(user) {
    if (!user) return user;
    if (!user.game) {
        user.game = {
            gold: 100, silver: 0, copper: 0,
            food: 100, thirst: 100, fatigue: 100,
            hp: 60, maxHp: 60,
            level: 1, xp: 0, nextLevelXp: 100,
            attributePoints: 0,
            stats: { damage: 1, defense: 1, intelligence: 1, agility: 1 },
            equipment: { rightHand: null, leftHand: null, helmet: null, chestplate: null, shoulders: null, leggings: null, boots: null, gloves: null, belt: null, cloak: null, horse: null },
            skills: {},
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
            lastActive: Date.now(),
            online: true,
            lastResourceUpdate: Date.now(),
            luck: 0,
            lastHeal: null,
            lastPrayer: null,
            blessing: { active: false, expires: 0 },
            jail: null,
            activeBonuses: { crit: 5, pierce: 5, doubleHit: 5, counter: 5, points: 0 },
            marketStall: { owned: false, stallId: null, rentPaid: null, rentDays: 0, debt: 0 },
            housing: { type: null, purchased: null, rentPaid: null, rentDays: 0, debt: 0, storage: [], storageHold: [] },
            booksBoughtToday: 0,
            lastBookReset: Date.now(),
            quests: { completed: [], lastReset: 0, active: null, progress: {} },
            brothelBuffs: [],
            brothelRoom: false
        };
        return user;
    }
    
    const g = user.game;
    if (g.lastResourceUpdate === undefined) g.lastResourceUpdate = Date.now();
    if (g.stamina === undefined) g.stamina = { level: 1, xp: 0 };
    if (g.professions === undefined) {
        g.professions = { 'Шахтёр': 1, 'Лесоруб': 1, 'Охотник': 1, 'Кузнец': 1 };
        g.professionXp = { 'Шахтёр': 0, 'Лесоруб': 0, 'Охотник': 0, 'Кузнец': 0 };
    }
    if (g.activeProfession === undefined) g.activeProfession = 'Охотник';
    if (g.lastProfessionChange === undefined) g.lastProfessionChange = 0;
    if (g.skills === undefined) {
        g.skills = {};
        ['sword', 'spear', 'mace', 'axe', 'bow', 'crossbow', 'shield', 'dagger'].forEach(s => {
            g.skills[s] = { level: 1, xp: 0 };
        });
    }
    if (g.equipment === undefined) {
        g.equipment = { rightHand: null, leftHand: null, helmet: null, chestplate: null, shoulders: null, leggings: null, boots: null, gloves: null, belt: null, cloak: null, horse: null };
    }
    if (g.hp === undefined) g.hp = 60;
    if (g.maxHp === undefined) g.maxHp = 60;
    if (g.outside === undefined) g.outside = false;
    if (g.stats === undefined) g.stats = { damage: 1, defense: 1, intelligence: 1, agility: 1 };
    if (g.attributePoints === undefined) g.attributePoints = 0;
    if (g.lastReset === undefined) g.lastReset = null;
    if (g.luck === undefined) g.luck = 0;
    if (g.lastHeal === undefined) g.lastHeal = null;
    if (g.lastPrayer === undefined) g.lastPrayer = null;
    if (g.blessing === undefined) g.blessing = { active: false, expires: 0 };
    if (g.jail === undefined) g.jail = null;
    if (g.activeBonuses === undefined) {
        g.activeBonuses = { crit: 5, pierce: 5, doubleHit: 5, counter: 5, points: 0 };
    }
    if (g.marketStall === undefined) {
        g.marketStall = { owned: false, stallId: null, rentPaid: null, rentDays: 0, debt: 0 };
    }
    if (g.housing === undefined) {
        g.housing = { type: null, purchased: null, rentPaid: null, rentDays: 0, debt: 0, storage: [], storageHold: [] };
    }
    if (g.housing.storage === undefined) g.housing.storage = [];
    if (g.housing.storageHold === undefined) g.housing.storageHold = [];
    if (g.online === undefined) g.online = true;
    if (g.lastActive === undefined) g.lastActive = Date.now();
    if (g.booksBoughtToday === undefined) g.booksBoughtToday = 0;
    if (g.lastBookReset === undefined) g.lastBookReset = Date.now();
    if (g.quests === undefined) {
        g.quests = { completed: [], lastReset: 0, active: null, progress: {} };
    }
    if (g.brothelBuffs === undefined) g.brothelBuffs = [];
    if (g.brothelRoom === undefined) g.brothelRoom = false;
    
    return user;
}

function enterGame(name) {
    const user = users[name];
    if (!user) return;
    
    fixOldAccount(user);
    
    checkRent();
    checkStallRent();
    getActiveDiceGames();
    
    showPage('game');
    user.game.online = true;
    
    const now = Date.now();
    const g = user.game;
    const lastActive = g.lastActive || now;
    const diffMinutes = lastActive ? (now - lastActive) / 60000 : 0;
    
    if (diffMinutes > 1) {
        const foodLoss = Math.floor(diffMinutes / 15);
        const thirstLoss = Math.floor(diffMinutes / 10);
        g.food = Math.max(0, g.food - foodLoss);
        g.thirst = Math.max(0, g.thirst - thirstLoss);
        if (foodLoss > 0 || thirstLoss > 0) {
            setMessage('⏰ За время отсутствия: еда -' + foodLoss + ', жажда -' + thirstLoss);
        }
    }
    
    g.lastActive = now;
    g.lastResourceUpdate = now;
    g.maxHp = getMaxHp(g);
    if (g.hp === undefined || g.hp > g.maxHp) g.hp = g.maxHp;
    
    const savedBattle = localStorage.getItem('got_battle');
    if (savedBattle) {
        try {
            battleState = JSON.parse(savedBattle);
            if (battleState && battleState.inProgress) {
                if (battleState.turn === 'mob') {
                    const timeSince = Date.now() - (battleState.lastActionTime || now);
                    if (timeSince > 10000) { mobTurn(); saveBattleState(); }
                }
                setMessage('⚔️ Бой продолжается!');
                updateMenu(); updateStory(); updateActions(); renderBattle();
                return;
            }
        } catch(e) {
            localStorage.removeItem('got_battle');
            battleState = null;
        }
    }
    
    normalizeInventory(g);
    
    updateMenu();
    updateStory();
    updateActions();
    setMessage('');
    
    isBusy = false;
    if (busyTimer) { clearTimeout(busyTimer); busyTimer = null; }
    document.getElementById('busy-status').classList.add('hide');
    
    updateOnline();
    saveData();
    startResourceSystem();
    startAutoSave();
}

// --- ТАЙМЕРЫ ---
function startAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(() => {
        if (currentUser && users[currentUser]) saveData();
    }, 30000);
}

function startResourceSystem() {
    if (resourceInterval) clearInterval(resourceInterval);
    resourceInterval = setInterval(() => {
        const user = users[currentUser];
        if (!user || !user.game.online) return;
        const g = user.game;
        const now = Date.now();
        const diff = (now - g.lastResourceUpdate) / 60000;
        if (diff < 1) return;
        
        const foodLoss = Math.floor(diff / 15);
        const thirstLoss = Math.floor(diff / 10);
        if (foodLoss > 0) g.food = Math.max(0, g.food - foodLoss);
        if (thirstLoss > 0) g.thirst = Math.max(0, g.thirst - thirstLoss);
        
        if (!isBusy) {
            const fatigueLoss = Math.floor(diff / 30);
            if (fatigueLoss > 0) g.fatigue = Math.max(0, g.fatigue - fatigueLoss);
        }
        
        if (g.food <= 0) {
            const hpLoss = Math.floor(diff * 2);
            if (hpLoss > 0) {
                g.hp = Math.max(0, g.hp - hpLoss);
                setMessage('⚠️ Вы умираете от голода! HP -' + hpLoss);
                if (g.hp <= 0) handleDeath('голода');
            }
        }
        if (g.thirst <= 0) {
            const hpLoss = Math.floor(diff * 3);
            if (hpLoss > 0) {
                g.hp = Math.max(0, g.hp - hpLoss);
                setMessage('⚠️ Вы умираете от жажды! HP -' + hpLoss);
                if (g.hp <= 0) handleDeath('жажды');
            }
        }
        
        g.lastResourceUpdate = now;
        updateMenu();
        saveData();
    }, 30000);
}

function handleDeath(cause) {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    g.hp = g.maxHp;
    g.location.place = 'Таверна';
    g.location.location = 'Королевская Гавань';
    g.food = 100;
    g.thirst = 100;
    g.fatigue = 100;
    g.outside = false;
    setMessage('💀 Вы умерли от ' + cause + '. Вы возродились в таверне.');
    addLog('💀 ' + currentUser + ' умер от ' + cause);
    updateMenu();
    updateStory();
    updateActions();
    saveData();
}

function startBusy(actionName, minutes, callback) {
    if (isBusy) return;
    isBusy = true;
    document.getElementById('busy-status').classList.remove('hide');
    document.getElementById('busy-status').textContent = '⏳ ' + actionName + '... (' + minutes + ' мин)';
    updateActions();
    if (busyTimer) clearTimeout(busyTimer);
    busyTimer = setTimeout(function() {
        isBusy = false;
        document.getElementById('busy-status').classList.add('hide');
        busyTimer = null;
        if (callback) callback();
        updateActions();
    }, minutes * 60 * 1000);
}

// --- ВЫХОД ---
function handleLogout() {
    if (isBusy) { setMessage('⏳ Вы заняты. Завершите текущее действие.'); return; }
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
    if (busyTimer) { clearTimeout(busyTimer); busyTimer = null; }
    isBusy = false;
    document.getElementById('busy-status').classList.add('hide');
    if (resourceInterval) { clearInterval(resourceInterval); resourceInterval = null; }
    if (autoSaveInterval) { clearInterval(autoSaveInterval); autoSaveInterval = null; }
}

// ============================================================
// ИНТЕРФЕЙС
// ============================================================
function updateMenu() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    const time = getTimeOfDay();
    g.maxHp = getMaxHp(g);
    if (g.hp > g.maxHp) g.hp = g.maxHp;
    if (g.hp === undefined || g.hp <= 0) g.hp = g.maxHp;
    
    document.getElementById('menu-time').textContent = time.timeStr;
    document.getElementById('menu-period').textContent = time.emoji + ' ' + time.period;
    document.getElementById('menu-location').textContent = g.location.place + (g.outside ? ' 🌲' : ' 🏰');
    const locationLevel = LOCATION_LEVELS[g.location.place] || 1;
    document.getElementById('menu-location-level').textContent = ' (ур. ' + locationLevel + ')';
    document.getElementById('menu-hp').textContent = Math.round(g.hp);
    document.getElementById('menu-hp-max').textContent = Math.round(g.maxHp);
    document.getElementById('menu-level').textContent = g.level;
    document.getElementById('menu-gold').textContent = g.gold;
    document.getElementById('menu-silver').textContent = g.silver;
    document.getElementById('menu-copper').textContent = g.copper;
    document.getElementById('menu-food').textContent = Math.round(g.food);
    document.getElementById('menu-thirst').textContent = Math.round(g.thirst);
    document.getElementById('menu-fatigue').textContent = Math.round(g.fatigue);
}

function updateStory() {
    const user = users[currentUser];
    if (!user) return;
    const place = user.game.location.place;
    document.getElementById('story-title').textContent = '📍 ' + place + ' (ур.' + (LOCATION_LEVELS[place] || 1) + ')';
    
    const texts = {
        'Таверна': 'Добро пожаловать в таверну. Здесь можно поесть, поработать и поговорить с трактирщиком.',
        'Рынок': '🏪 Центральный рынок Королевской Гавани.',
        'Кузница': 'Вы в кузнице. Здесь можно купить ресурсы и скрафтить предметы.',
        'Оружейная лавка': 'Вы в оружейной лавке.',
        'Кожевник': 'Вы у кожевника.',
        'Бронник': 'Вы у бронника.',
        'Плотник': 'Вы у плотника.',
        'Конюшня': '🐴 Королевская конюшня.',
        'Гильдия торговцев': 'Вы в гильдии торговцев.',
        'Магистрат': '📜 Магистрат — центр управления городом.',
        'Ворота': 'Вы у городских ворот.',
        'Королевский квартал': '👑 Элитный район.',
        'Торговый квартал': '🏙️ Центр торговли.',
        'Квартал бедноты': '🏚️ Окраина города.',
        'Дом': '🏠 Ваш дом.',
        'Великая септа': '⛪ Великая Септа Бейлора.',
        'Порт': '⛵ Порт Королевской Гавани.',
        'Тюрьма': '⛓️ Вы в тюрьме.',
        'Дорога': '🛤️ Дорога у ворот Королевской Гавани.',
        'Библиотека мейстеров': '📚 Библиотека мейстеров.',
        'Гильдия наёмников': '🗡️ Гильдия наёмников.',
        'Бордель': '💃 Бордель Королевской Гавани.'
    };
    
    document.getElementById('story-text').textContent = texts[place] || 'Вы находитесь в ' + place + '.';
}

function updateActions() {
    const user = users[currentUser];
    if (!user) return;
    const place = user.game.location.place;
    const container = document.getElementById('actions-container');
    container.innerHTML = '';
    const inBattle = battleState && battleState.inProgress;
    let actions = [];
    
    if (inBattle) {
        actions = [
            { id: 'battle_attack', label: '⚔️ Атака' },
            { id: 'battle_defend', label: '🛡️ Защита' },
            { id: 'battle_dodge', label: '💨 Уклонение' },
            { id: 'battle_flee', label: '🏃 Побег' }
        ];
    } else {
        actions = [
            { id: 'inventory', label: '🎒 Инвентарь' },
            { id: 'character', label: '👤 Персонаж' },
            { id: 'menu', label: '📋 Меню' },
            { id: 'map', label: '🗺️ Карта' }
        ];
        
        if (place === 'Ворота' && !user.game.outside) {
            actions.unshift({ id: 'leave_city', label: '🚪 Выйти на Дорогу' });
        }
        if (place === 'Дорога') {
            actions.unshift({ id: 'enter_city', label: '🚶 Войти в Королевскую Гавань' });
            actions.unshift({ id: 'search', label: '🔍 Поиск' });
        }
        if (place === 'Таверна') {
            actions = [
                { id: 'eat', label: '🍞 Попросить еды (+25)' },
                { id: 'trade', label: '🛒 Торговля в таверне' },
                { id: 'wash', label: '🧹 Помыть посуду (1 мин → 1 МП)' },
                { id: 'sweep', label: '🧹 Подмести пол (5 мин → 5 МП)' },
                { id: 'rest', label: '🛏️ Отдохнуть (10 МП → +30 уст., +15 HP)' },
                { id: 'talk', label: '🗣️ Поговорить с трактирщиком' },
                ...actions
            ];
        }
        if (place === 'Гильдия торговцев') actions = [{ id: 'guild', label: '🏛️ Аукцион' }, ...actions];
        if (place === 'Оружейная лавка') actions = [{ id: 'shop', label: '🗡️ Оружейная лавка' }, ...actions];
        if (place === 'Кожевник') actions = [{ id: 'shop', label: '🪡 Кожевник' }, ...actions];
        if (place === 'Бронник') actions = [{ id: 'shop', label: '🛡️ Бронник' }, ...actions];
        if (place === 'Плотник') actions = [{ id: 'shop', label: '🪵 Плотник' }, ...actions];
        if (place === 'Кузница') actions = [{ id: 'shop', label: '⚒️ Кузница' }, { id: 'craft', label: '🔨 Крафт' }, ...actions];
        if (place === 'Конюшня') actions.unshift({ id: 'open_stable', label: '🐴 Конюшня' });
        if (place === 'Магистрат') actions.unshift({ id: 'open_magistrate', label: '📜 Недвижимость' });
        if (place === 'Великая септа') actions.unshift({ id: 'open_temple', label: '⛪ Септа' });
        if (place === 'Порт') actions.unshift({ id: 'open_port', label: '⛵ Порт' });
        if (place === 'Рынок') actions.unshift({ id: 'open_market', label: '🏪 Рынок' });
        if (place === 'Библиотека мейстеров') actions.unshift({ id: 'open_library', label: '📚 Библиотека' });
        if (place === 'Гильдия наёмников') actions.unshift({ id: 'open_guildhall', label: '🗡️ Гильдия наёмников' });
        if (place === 'Бордель') actions.unshift({ id: 'open_brothel', label: '💃 Бордель' });
        
        actions.push({ id: 'refresh', label: '🔄 Обновить' });
    }
    
    actions.forEach(a => {
        const btn = document.createElement('button');
        btn.className = 'btn-game';
        btn.textContent = a.label;
        if (isBusy && !['character', 'inventory', 'refresh', 'map', 'menu', 'enter_city', 'leave_city'].includes(a.id) && !a.id.startsWith('battle_')) {
            btn.disabled = true;
        }
        btn.onclick = function() { gameAction(a.id); };
        container.appendChild(btn);
    });
}

// --- ГЛАВНЫЙ ОБРАБОТЧИК ---
function gameAction(action) {
    setMessage('');
    if (isBusy && !['character', 'inventory', 'refresh', 'map', 'menu', 'enter_city', 'leave_city'].includes(action) && !action.startsWith('battle_')) {
        setMessage('⏳ Вы заняты. Завершите текущее действие.');
        return;
    }
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    
    switch(action) {
        case 'menu': openMainMenu(); break;
        case 'guild': openGuild(); break;
        case 'shop': openShop(g.location.place); break;
        case 'craft': openCraftMenu(); break;
        case 'open_stable': openStable(); break;
        case 'open_temple': openTemple(); break;
        case 'open_port': openPort(); break;
        case 'open_market': openMarket(); break;
        case 'open_magistrate': openMagistrate(); break;
        case 'enter_city':
            g.location.place = 'Ворота';
            g.location.location = 'Королевская Гавань';
            g.outside = false;
            setMessage('🚪 Вы вошли в город через Ворота.');
            updateMenu(); updateStory(); updateActions(); saveData();
            break;
        case 'leave_city':
            g.location.place = 'Дорога';
            g.location.location = 'Дорога';
            g.outside = true;
            setMessage('🛤️ Вы вышли на Дорогу.');
            updateMenu(); updateStory(); updateActions(); saveData();
            break;
        case 'eat':
            if (g.food >= 100) { setMessage('🍖 Вы сыты.'); return; }
            g.food = Math.min(g.food + 25, 100);
            setMessage('🍞 Вы поели. Еда +25.');
            updateMenu(); saveData();
            break;
        case 'trade': openTavernTrade(); break;
        case 'wash':
            startBusy('Моете посуду', 1, function() {
                g.copper += 1;
                convertCurrency(g);
                setMessage('🧹 Вы помыли посуду. +1 МП.');
                updateMenu(); saveData();
            });
            break;
        case 'sweep':
            startBusy('Подметаете пол', 5, function() {
                g.copper += 5;
                convertCurrency(g);
                setMessage('🧹 Вы подмели пол. +5 МП.');
                updateMenu(); saveData();
            });
            break;
        case 'rest':
            if (!spendMoney(g, 10)) { setMessage('❌ Недостаточно денег (10 МП).'); return; }
            g.fatigue = Math.min(100, g.fatigue + 30);
            g.hp = Math.min(g.maxHp, g.hp + 15);
            setMessage('🛏️ Вы отдохнули. Усталость +30, HP +15.');
            updateMenu(); saveData();
            break;
        case 'talk':
            const msgs = [
                '🍺 Трактирщик: «Добро пожаловать, путник!»',
                '🍺 Трактирщик: «Хочешь заработать? Помой посуду.»',
                '🍺 Трактирщик: «Будь осторожен за воротами.»'
            ];
            setMessage(msgs[Math.floor(Math.random() * msgs.length)]);
            break;
        case 'search':
            if (searchCooldown) { setMessage('⏳ Подождите 5 секунд.'); return; }
            searchCooldown = true;
            setTimeout(() => { searchCooldown = false; }, 5000);
            doSearch();
            break;
        case 'map': openMap(); break;
        case 'inventory': openInventory(); break;
        case 'character': openCharacter(); break;
        case 'refresh': location.reload(); break;
        case 'battle_attack': case 'battle_defend': case 'battle_dodge': case 'battle_flee':
            battleAction(action);
            break;
        case 'open_library': openLibrary(); break;
        case 'open_guildhall': openGuildHall(); break;
        case 'open_brothel': openBrothel(); break;
    }
}

// --- МЕНЮ ---
function openMainMenu() {
    const modal = document.getElementById('modal-menu');
    const content = document.getElementById('modal-menu-content');
    let html = '<div class="modal-section">';
    html += '<button class="btn" style="margin:4px 0;" onclick="openHouses(); closeMenu();">🏘️ Дома</button>';
    html += '<button class="btn btn-secondary" style="margin-top:10px;" onclick="closeMenu()">Закрыть</button>';
    html += '</div>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeMenu() { document.getElementById('modal-menu').classList.add('hide'); }

// --- КАРТА ---
function openMap() {
    const user = users[currentUser];
    if (!user) return;
    const modal = document.getElementById('modal-map');
    const content = document.getElementById('modal-map-content');
    const cityBuildings = ['Таверна', 'Рынок', 'Кузница', 'Оружейная лавка', 'Кожевник', 'Бронник', 'Плотник', 'Конюшня', 'Гильдия торговцев', 'Магистрат', 'Ворота', 'Королевский квартал', 'Торговый квартал', 'Квартал бедноты', 'Дом', 'Великая септа', 'Порт', 'Тюрьма', 'Дорога', 'Библиотека мейстеров', 'Гильдия наёмников', 'Бордель'];
    let html = '<div class="modal-section"><h4>📍 ' + user.game.location.place + ' (ур. ' + (LOCATION_LEVELS[user.game.location.place] || 1) + ')</h4></div>';
    html += '<div class="modal-section">';
    BUILDINGS.forEach(b => {
        const bIsCity = cityBuildings.includes(b.id);
        if (user.game.outside && bIsCity) return;
        if (!user.game.outside && !bIsCity) return;
        const isCurrent = b.id === user.game.location.place;
        html += '<div class="row">';
        html += '<span class="label">' + b.label + (isCurrent ? ' ⭐' : '') + '</span>';
        if (!isCurrent) {
            html += '<span class="value"><button class="btn btn-small" onclick="goToBuilding(\'' + b.id + '\')">🚶 Идти</button></span>';
        } else {
            html += '<span class="value" style="color:#6a5a48;">Вы здесь</span>';
        }
        html += '</div>';
    });
    html += '</div><button class="btn" onclick="closeMap()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeMap() { document.getElementById('modal-map').classList.add('hide'); }

function goToBuilding(building) {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    if (isBusy) { setMessage('⏳ Вы заняты.'); return; }
    if (building === g.location.place) { setMessage('📍 Вы уже здесь.'); return; }
    
    const cityBuildings = ['Таверна', 'Рынок', 'Кузница', 'Оружейная лавка', 'Кожевник', 'Бронник', 'Плотник', 'Конюшня', 'Гильдия торговцев', 'Магистрат', 'Ворота', 'Королевский квартал', 'Торговый квартал', 'Квартал бедноты', 'Дом', 'Великая септа', 'Порт', 'Тюрьма'];
    const targetIsCity = cityBuildings.includes(building);
    if (targetIsCity && g.outside) g.outside = false;
    else if (!targetIsCity && !g.outside) g.outside = true;
    g.location.place = building;
    if (targetIsCity) g.location.location = 'Королевская Гавань';
    else g.location.location = building;
    setMessage('✅ Вы прибыли в ' + building + '.');
    addLog('🚶 ' + currentUser + ' перешёл в ' + building);
    closeMap();
    updateMenu();
    updateStory();
    updateActions();
    saveData();
}

// --- ЛОГ ---
function openLog() {
    const modal = document.getElementById('modal-log');
    const content = document.getElementById('modal-log-content');
    let html = '<div class="modal-section"><h4>📜 ПОСЛЕДНИЕ СОБЫТИЯ</h4>';
    if (gameLog.length === 0) {
        html += '<p style="color:#6a5a48;">Пусто</p>';
    } else {
        gameLog.slice(-20).reverse().forEach(entry => {
            html += '<p style="color:#b8a890;font-size:12px;padding:2px 0;">' + entry + '</p>';
        });
    }
    html += '</div><button class="btn" onclick="closeLog()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeLog() { document.getElementById('modal-log').classList.add('hide'); }

// --- ОНЛАЙН ---
function updateOnline() {
    const online = { global: 0, region: 0, location: 0 };
    if (!currentUser || !users[currentUser]) return;
    const cur = users[currentUser];
    for (const name in users) {
        if (users[name].game.online) {
            online.global++;
            if (cur && users[name].game.location.region === cur.game.location.region) online.region++;
            if (cur && users[name].game.location.location === cur.game.location.location) online.location++;
        }
    }
    document.getElementById('online-global').textContent = online.global;
    document.getElementById('online-region').textContent = online.region;
    document.getElementById('online-location').textContent = online.location;
    setTimeout(updateOnline, 10000);
}

function showOnlineList() {
    const modal = document.getElementById('modal-online');
    const content = document.getElementById('modal-online-content');
    let html = '<div class="modal-section"><h4>👥 ИГРОКИ ОНЛАЙН</h4>';
    let count = 0;
    for (const name in users) {
        if (users[name].game.online) {
            count++;
            html += '<div class="row"><span class="label">' + name + '</span><span class="value">ур. ' + users[name].game.level + ' | ' + users[name].game.location.place + '</span></div>';
        }
    }
    if (count === 0) html += '<p style="color:#6a5a48;">Нет игроков онлайн</p>';
    html += '</div>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeOnline() { document.getElementById('modal-online').classList.add('hide'); }

// --- ДОМА ---
function openHouses() {
    const modal = document.getElementById('modal-houses');
    const content = document.getElementById('modal-houses-content');
    let html = '<div class="modal-section"><h4>🏘️ ВЫБЕРИТЕ РЕГИОН</h4>';
    const regions = Object.keys(HOUSES_DATA);
    regions.forEach(region => {
        const data = HOUSES_DATA[region];
        html += '<button class="btn" style="margin:4px 0;padding:10px;" onclick="showRegionHouses(\'' + region + '\')">' + region + ' (' + data.totalAcres.toLocaleString() + ' акров)</button>';
    });
    html += '<button class="btn btn-secondary" onclick="closeHouses()">Закрыть</button>';
    html += '</div>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function showRegionHouses(region) {
    const data = HOUSES_DATA[region];
    if (!data) return;
    const modal = document.getElementById('modal-houses');
    const content = document.getElementById('modal-houses-content');
    let html = '<div class="modal-section"><h4>🏘️ ' + region.toUpperCase() + '</h4>';
    html += '<p style="color:#6a5a48;margin-bottom:10px;">Столица: ' + data.capital + ' | Всего акров: ' + data.totalAcres.toLocaleString() + '</p>';
    data.houses.forEach(house => {
        html += '<button class="btn" style="margin:4px 0;padding:10px;text-align:left;" onclick="showHouseInfo(\'' + region + '\',\'' + house.id + '\')">';
        html += house.sigil + ' ' + house.name + ' (' + house.status + ') — ' + house.acres.toLocaleString() + ' акров';
        html += '</button>';
    });
    html += '<button class="btn btn-secondary" onclick="openHouses()" style="margin-top:10px;">⬅️ Назад</button>';
    html += '</div>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function showHouseInfo(region, houseId) {
    const data = HOUSES_DATA[region];
    if (!data) return;
    const house = data.houses.find(h => h.id === houseId);
    if (!house) return;
    const modal = document.getElementById('modal-houses');
    const content = document.getElementById('modal-houses-content');
    let html = '<div class="modal-section"><h4>🏘️ ДОМ ' + house.name.toUpperCase() + '</h4>';
    html += '<div class="row"><span class="label">🦁 Герб</span><span class="value">' + house.sigil + '</span></div>';
    html += '<div class="row"><span class="label">🏰 Цитадель</span><span class="value">' + house.castle + '</span></div>';
    html += '<div class="row"><span class="label">👑 Сюзерен</span><span class="value">' + house.liege + '</span></div>';
    html += '<div class="row"><span class="label">📜 Статус</span><span class="value">' + house.status + '</span></div>';
    html += '<div class="row"><span class="label">🌾 Владения</span><span class="value">' + house.acres.toLocaleString() + ' акров</span></div>';
    html += '<button class="btn btn-secondary" onclick="showRegionHouses(\'' + region + '\')" style="margin-top:10px;">⬅️ Назад</button>';
    html += '</div>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeHouses() { document.getElementById('modal-houses').classList.add('hide'); }

// ============================================================
// ЗАГЛУШКИ
// ============================================================
function getMaxHp(g) { return 60 + (g.level - 1) * 10; }
function checkRent() {}
function checkStallRent() {}
function getActiveDiceGames() { return []; }
function openCharacter() { setMessage('👤 Персонаж — заглушка'); }
function openInventory() { setMessage('🎒 Инвентарь — заглушка'); }
function doSearch() { setMessage('🔍 Поиск — заглушка'); }
function openShop(shopType) { setMessage('🏪 Магазин «' + shopType + '» — заглушка'); }
function openCraftMenu() { setMessage('🔨 Крафт — заглушка'); }
function openStable() { setMessage('🐴 Конюшня — заглушка'); }
function openTemple() { setMessage('⛪ Септа — заглушка'); }
function openPort() { setMessage('⛵ Порт — заглушка'); }
function openMarket() { setMessage('🏪 Рынок — заглушка'); }
function openLibrary() { setMessage('📚 Библиотека — заглушка'); }
function openGuildHall() { setMessage('🗡️ Гильдия наёмников — заглушка'); }
function openBrothel() { setMessage('💃 Бордель — заглушка'); }
function openGuild() { setMessage('🏛️ Аукцион — заглушка'); }
function openTavernTrade() { setMessage('🛒 Торговля в таверне — заглушка'); }
function openMagistrate() { setMessage('📜 Магистрат — заглушка'); }
function battleAction(action) { setMessage('⚔️ Бой — заглушка'); }
function mobTurn() {}

// ============================================================
// ЗАПУСК
// ============================================================
loadData();
const savedUser = localStorage.getItem('got_user');
if (savedUser && users[savedUser]) {
    currentUser = savedUser;
    enterGame(savedUser);
} else {
    showPage('login');
}
