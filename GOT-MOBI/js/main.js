// ============================================================
// ГЛАВНАЯ ЛОГИКА
// ============================================================

// --- ПОДКЛЮЧАЕМ core ---
// (Всё уже лежит в глобальной области, потому что мы подключили все файлы в index.html)

// --- РЕГИСТРАЦИЯ ---
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
        errEl.textContent = '❌ Заполните все поля!';
        errEl.classList.remove('hide');
        return;
    }
    if (name.length < 2) {
        errEl.textContent = '❌ Имя минимум 2 символа!';
        errEl.classList.remove('hide');
        return;
    }
    if (password.length < 4) {
        errEl.textContent = '❌ Пароль минимум 4 символа!';
        errEl.classList.remove('hide');
        return;
    }
    if (users[name]) {
        errEl.textContent = '❌ Это имя уже занято!';
        errEl.classList.remove('hide');
        return;
    }

    users[name] = {
        password: hash(password),
        nationality: nationality,
        secret: hash(secret),
        game: {
            gold: 100,
            hp: 60,
            maxHp: 60,
            level: 1,
            food: 100,
            thirst: 100,
            fatigue: 100
        }
    };

    saveUsers();
    formEl.classList.add('hide');
    okEl.innerHTML = '✅ Поздравляем, <strong>' + name + '</strong>!<br>Вы — ' + nationality;
    okEl.classList.remove('hide');

    localStorage.setItem('got_user', name);
    setTimeout(() => {
        currentUser = name;
        enterGame();
    }, 1500);
};

// --- ВХОД ---
window.handleLogin = function() {
    const name = document.getElementById('login-name').value.trim();
    const password = document.getElementById('login-password').value;
    const errEl = document.getElementById('login-error');
    errEl.classList.add('hide');

    if (!name || !password) {
        errEl.textContent = '❌ Заполните все поля!';
        errEl.classList.remove('hide');
        return;
    }

    const user = users[name];
    if (!user) {
        errEl.textContent = '❌ Персонаж не найден!';
        errEl.classList.remove('hide');
        return;
    }
    if (user.password !== hash(password)) {
        errEl.textContent = '❌ Неверный пароль!';
        errEl.classList.remove('hide');
        return;
    }

    localStorage.setItem('got_user', name);
    currentUser = name;
    enterGame();
};

// --- ВХОД В ИГРУ ---
function enterGame() {
    const user = users[currentUser];
    if (!user) return;

    window.showPage('game');
    updateUI();
    setMessage('Добро пожаловать, ' + currentUser + '!');
}

// --- ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ---
function updateUI() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

    document.getElementById('menu-hp').textContent = g.hp;
    document.getElementById('menu-hp-max').textContent = g.maxHp;
    document.getElementById('menu-level').textContent = g.level;
    document.getElementById('menu-gold').textContent = g.gold;
    document.getElementById('menu-food').textContent = g.food;
    document.getElementById('menu-thirst').textContent = g.thirst;
    document.getElementById('menu-fatigue').textContent = g.fatigue;
    document.getElementById('menu-location').textContent = 'Таверна';
}

// --- ДЕЙСТВИЯ ---
window.eat = function() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    if (g.food >= 100) {
        setMessage('🍖 Вы сыты!');
        return;
    }
    g.food = Math.min(100, g.food + 25);
    setMessage('🍞 Вы поели! Еда +25.');
    updateUI();
    saveUsers();
};

window.rest = function() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    if (g.gold < 10) {
        setMessage('❌ Нужно 10 золота для отдыха!');
        return;
    }
    g.gold -= 10;
    g.fatigue = Math.min(100, g.fatigue + 30);
    g.hp = Math.min(g.maxHp, g.hp + 15);
    setMessage('🛏️ Вы отдохнули! Усталость +30, HP +15.');
    updateUI();
    saveUsers();
};

window.talk = function() {
    const msgs = [
        '🍺 Трактирщик: "Добро пожаловать, путник!"',
        '🍺 Трактирщик: "Хочешь заработать? Помой посуду."',
        '🍺 Трактирщик: "Будь осторожен за воротами."'
    ];
    setMessage(msgs[Math.floor(Math.random() * msgs.length)]);
};

// --- ЗАГЛУШКИ ---
window.openCharacter = function() { setMessage('👤 Персонаж (информация)'); };
window.openInventory = function() { setMessage('🎒 Инвентарь (пока пустой)'); };
window.openMap = function() { setMessage('🗺️ Карта (в разработке)'); };

// --- ВЫХОД ---
window.handleLogout = function() {
    localStorage.removeItem('got_user');
    currentUser = null;
    window.showPage('login');
    document.getElementById('login-name').value = '';
    document.getElementById('login-password').value = '';
    setMessage('');
};

// --- ЗАПУСК ---
loadUsers();
const savedUser = localStorage.getItem('got_user');
if (savedUser && users[savedUser]) {
    currentUser = savedUser;
    enterGame();
} else {
    window.showPage('login');
}

console.log('✅ Игра загружена! Пользователей:', Object.keys(users).length);
