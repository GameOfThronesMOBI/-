// ============================================================
// МИНИМАЛЬНЫЙ main.js (без импортов, для теста)
// ============================================================

// --- ПРОСТЫЕ ФУНКЦИИ ---
window.handleLogin = function() {
    alert('Кнопка ВОЙТИ сработала!');
    console.log('handleLogin вызвана');
};

window.handleRegister = function() {
    alert('Кнопка РЕГИСТРАЦИЯ сработала!');
    console.log('handleRegister вызвана');
};

window.showPage = function(page) {
    alert('Переключение на ' + page);
    console.log('showPage вызвана');
};

window.handleLogout = function() {
    alert('Выход');
};

window.eat = function() { alert('Еда!'); };
window.rest = function() { alert('Отдых!'); };
window.talk = function() { alert('Разговор!'); };
window.openCharacter = function() { alert('Персонаж!'); };
window.openInventory = function() { alert('Инвентарь!'); };
window.openMap = function() { alert('Карта!'); };

console.log('✅ main.js загружен!');
