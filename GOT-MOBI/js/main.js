// ============================================================
// ГЛАВНЫЙ ФАЙЛ (main.js)
// ============================================================

import { users, currentUser } from './core/state.js';
import { loadData, saveData } from './core/storage.js';
import { showPage, setMessage, hash, addLog } from './core/utils.js';
import { NATIONALITIES } from './core/config.js';

// ============================================================
// ДЕЛАЕМ ФУНКЦИИ ГЛОБАЛЬНЫМИ ДЛЯ onclick
// ============================================================
window.showPage = showPage;
window.setMessage = setMessage;
window.hash = hash;
window.addLog = addLog;

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
            fatigue: 100,
            inventory: [],
            location: 'Таверна'
        }
    };
    
    addLog('👤 ' + name + ' создал персонажа');
    saveData();
    
    formEl.classList.add('hide');
    okEl.innerHTML = '✅ Поздравляем, <strong>' + name + '</strong>!<br>Вы — ' + nationality;
    okEl.classList.remove('hide');
    
    localStorage.setItem('got_user', name);
    setTimeout(() => enterGame(name), 1200);
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
}
window.handleLogin = handleLogin;

// ============================================================
// ВХОД В ИГРУ
// ============================================================
function enterGame(name) {
    const user = users[name];
    if (!user) return;
    currentUser = name;
    showPage('game');
    updateUI();
    setMessage('Добро пожаловать, ' + name + '!');
    saveData();
}

// ============================================================
// ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
// ============================================================
function updateUI() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    
    document.getElementById('menu-location').textContent = g.location || 'Таверна';
    document.getElementById('menu-hp').textContent = g.hp;
    document.getElementById('menu-hp-max').textContent = g.maxHp;
    document.getElementById('menu-level').textContent = g.level;
    document.getElementById('menu-gold').textContent = g.gold;
    document.getElementById('menu-food').textContent = g.food;
    document.getElementById('menu-thirst').textContent = g.thirst;
    document.getElementById('menu-fatigue').textContent = g.fatigue;
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
    saveData();
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
    saveData();
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
// ЗАГЛУШКИ ДЛЯ КНОПОК МЕНЮ
// ============================================================
function openCharacter() {
    setMessage('👤 Персонаж (информация)');
}
window.openCharacter = openCharacter;

function openInventory() {
    setMessage('🎒 Инвентарь (пока пустой)');
}
window.openInventory = openInventory;

function openMap() {
    setMessage('🗺️ Карта (в разработке)');
}
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
loadData();
const savedUser = localStorage.getItem('got_user');
if (savedUser && users[savedUser]) {
    currentUser = savedUser;
    enterGame(savedUser);
} else {
    showPage('login');
}

console.log('✅ Игра запущена! Пользователей в базе:', Object.keys(users).length);
