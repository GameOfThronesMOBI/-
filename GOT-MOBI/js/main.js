// ============================================================
// main.js — РАБОТАЕТ С core/
// ============================================================

import { users, currentUser } from './core/state.js';
import { loadUsers, saveUsers } from './core/storage.js';
import { showPage, setMessage, hash } from './core/utils.js';
import { NATIONALITIES } from './core/config.js';

// ============================================================
// ДЕЛАЕМ ВСЕ ФУНКЦИИ ГЛОБАЛЬНЫМИ ДЛЯ onclick
// ============================================================
window.showPage = showPage;
window.setMessage = setMessage;
window.hash = hash;

// ============================================================
// РЕГИСТРАЦИЯ
// ============================================================
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
}
window.handleRegister = handleRegister;

// ============================================================
// ВХОД
// ============================================================
function handleLogin() {
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
}
window.handleLogin = handleLogin;

// ============================================================
// ВХОД В ИГРУ
// ============================================================
function enterGame() {
    const user = users[currentUser];
    if (!user) return;

    showPage('game');
    updateUI();
    setMessage('Добро пожаловать, ' + currentUser + '!');
}

// ============================================================
// ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
// ============================================================
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

// ============================================================
// ДЕЙСТВИЯ
// ============================================================
function eat() {
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
}
window.eat = eat;

function rest() {
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
}
window.rest = rest;

function talk() {
    const msgs = [
        '🍺 Трактирщик: "Добро пожаловать, путник!"',
        '🍺 Трактирщик: "Хочешь заработать? Помой посуду."',
        '🍺 Трактирщик: "Будь осторожен за воротами."'
    ];
    setMessage(msgs[Math.floor(Math.random() * msgs.length)]);
}
window.talk = talk;

// ============================================================
// ЗАГЛУШКИ
// ============================================================
function openCharacter() { setMessage('👤 Персонаж (информация)'); }
window.openCharacter = openCharacter;

function openInventory() { setMessage('🎒 Инвентарь (пока пустой)'); }
window.openInventory = openInventory;

function openMap() { setMessage('🗺️ Карта (в разработке)'); }
window.openMap = openMap;

// ============================================================
// ВЫХОД
// ============================================================
function handleLogout() {
    localStorage.removeItem('got_user');
    currentUser = null;
    showPage('login');
    document.getElementById('login-name').value = '';
    document.getElementById('login-password').value = '';
    setMessage('');
}
window.handleLogout = handleLogout;

// ============================================================
// ЗАПУСК
// ============================================================
loadUsers();
const savedUser = localStorage.getItem('got_user');
if (savedUser && users[savedUser]) {
    currentUser = savedUser;
    enterGame();
} else {
    showPage('login');
}

console.log('✅ Игра загружена! Пользователей:', Object.keys(users).length);
