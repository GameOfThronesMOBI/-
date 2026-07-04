// ============================================================
// СОХРАНЕНИЕ
// ============================================================

function loadUsers() {
    try {
        const saved = localStorage.getItem('got_users');
        if (saved) users = JSON.parse(saved);
    } catch(e) { users = {}; }
}

function saveUsers() {
    localStorage.setItem('got_users', JSON.stringify(users));
}
