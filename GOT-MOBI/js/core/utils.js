// ============================================================
// УТИЛИТЫ
// ============================================================

function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) - h) + str.charCodeAt(i);
        h = h & h;
    }
    return h.toString(36);
}

function setMessage(msg) {
    const el = document.getElementById('game-message');
    if (el) el.textContent = msg || '';
}
