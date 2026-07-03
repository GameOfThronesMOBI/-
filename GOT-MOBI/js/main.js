// ============================================================
// ЗАПУСК ИГРЫ (main.js)
// ============================================================

// Загружаем все сохранённые данные
loadData();

// Проверяем, есть ли сохранённый игрок
const savedUser = localStorage.getItem('got_user');

if (savedUser && users[savedUser]) {
    // Если есть — заходим в игру
    currentUser = savedUser;
    enterGame(savedUser);
} else {
    // Если нет — показываем страницу входа
    showPage('login');
}
