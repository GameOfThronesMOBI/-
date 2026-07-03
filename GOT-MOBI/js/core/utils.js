// ============================================================
// УТИЛИТЫ (js/core/utils.js)
// ============================================================

import { users, gameLog } from './state.js';
import { saveData } from './storage.js';
import { QUALITIES } from './config.js';

// ============================================================
// ХЕШ-ФУНКЦИЯ (для паролей)
// ============================================================
export function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) - h) + str.charCodeAt(i);
        h = h & h;
    }
    return h.toString(36);
}

// ============================================================
// ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ
// ============================================================
export function showPage(page) {
    ['login', 'register', 'game'].forEach(id => {
        const el = document.getElementById('page-' + id);
        if (el) el.classList.add('hide');
    });
    const el = document.getElementById('page-' + page);
    if (el) el.classList.remove('hide');
}

// ============================================================
// СООБЩЕНИЕ ИГРОКУ
// ============================================================
export function setMessage(msg) {
    const el = document.getElementById('game-message');
    if (!el) return;
    el.textContent = msg || '';
    clearTimeout(el._timer);
    if (msg && msg.length > 0) {
        el._timer = setTimeout(() => {
            el.textContent = '';
        }, 8000);
    }
}

// ============================================================
// ТЕКУЩЕЕ ВРЕМЯ
// ============================================================
export function getTimeOfDay() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const timeStr = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
    let period = '', emoji = '';
    if (h >= 6 && h < 12) { period = 'Утро'; emoji = '☀️'; }
    else if (h >= 12 && h < 18) { period = 'День'; emoji = '🌤️'; }
    else if (h >= 18 && h < 24) { period = 'Вечер'; emoji = '🌆'; }
    else { period = 'Ночь'; emoji = '🌙'; }
    return { timeStr, period, emoji };
}

// ============================================================
// ФОРМАТИРОВАНИЕ ВАЛЮТЫ
// ============================================================
export function formatCurrency(amount) {
    if (amount < 0) return '0 МП';
    if (amount === 0) return '0 МП';
    
    const gold = Math.floor(amount / (210 * 56));
    let remaining = amount % (210 * 56);
    
    const silver = Math.floor(remaining / 56);
    const copper = remaining % 56;
    
    let parts = [];
    if (gold > 0) parts.push(gold + ' ЗОЛ');
    if (silver > 0) parts.push(silver + ' СО');
    if (copper > 0 || parts.length === 0) parts.push(copper + ' МП');
    
    return parts.join(' ');
}

// ============================================================
// КОНВЕРТАЦИЯ ВАЛЮТЫ (мелкое → крупное)
// ============================================================
export function convertCurrency(g) {
    while (g.copper >= 56) {
        g.silver += Math.floor(g.copper / 56);
        g.copper = g.copper % 56;
    }
    while (g.silver >= 210) {
        g.gold += Math.floor(g.silver / 210);
        g.silver = g.silver % 210;
    }
    return g;
}

// ============================================================
// ТРАТА ДЕНЕГ (цена в МЕДИ)
// ============================================================
export function spendMoney(g, amount) {
    if (amount <= 0) return true;
    let total = g.copper + g.silver * 56 + g.gold * 210 * 56;
    if (total < amount) return false;
    total -= amount;
    g.gold = Math.floor(total / (210 * 56));
    total %= (210 * 56);
    g.silver = Math.floor(total / 56);
    g.copper = total % 56;
    return true;
}

// ============================================================
// ДОБАВЛЕНИЕ В ЛОГ
// ============================================================
export function addLog(msg) {
    const now = new Date();
    const time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    gameLog.push('[' + time + '] ' + msg);
    if (gameLog.length > 100) gameLog = gameLog.slice(-100);
    saveData();
}

// ============================================================
// ОСТАВШЕЕСЯ ВРЕМЯ АРЕНДЫ
// ============================================================
export function getTimeLeft(timestamp, daysPaid) {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const hourMs = 60 * 60 * 1000;
    const expireTime = timestamp + (daysPaid * dayMs);
    const timeLeft = expireTime - now;
    
    if (timeLeft <= 0) {
        return { expired: true, text: '⚠️ ПРОСРОЧЕНО!' };
    }
    
    const days = Math.floor(timeLeft / dayMs);
    const hours = Math.floor((timeLeft % dayMs) / hourMs);
    
    return {
        expired: false,
        days: days,
        hours: hours,
        text: days + ' дн. ' + hours + ' ч.'
    };
}

// ============================================================
// ПРОВЕРКА: СТЕКАЕМЫЙ ПРЕДМЕТ?
// ============================================================
export function isStackable(item) {
    if (!item) return false;
    if (item.type === 'resource') return true;
    if (item.type === 'food' && item.effect) return true;
    const stackableNames = ['Хлеб', 'Мясо', 'Рыба', 'Вода', 'Эль', 'Вино', 'Кожа', 'Руда', 'Уголь', 'Сталь', 'Дерево', 'Шкура'];
    if (item.name) {
        for (let name of stackableNames) {
            if (item.name.includes(name)) return true;
        }
    }
    return false;
}

// ============================================================
// ПРОВЕРКА: РАСХОДУЕМЫЙ ПРЕДМЕТ?
// ============================================================
export function isConsumable(item) {
    if (!item) return false;
    if (item.type === 'food') return true;
    if (item.effect) return true;
    if (item.name && (item.name.includes('Хлеб') || item.name.includes('Мясо') || item.name.includes('Рыба') || item.name.includes('Вода') || item.name.includes('Эль') || item.name.includes('Вино'))) return true;
    return false;
}

// ============================================================
// ДОБАВЛЕНИЕ В ИНВЕНТАРЬ
// ============================================================
export function addToInventory(g, item) {
    if (!g || !g.inventory) return false;
    
    if (!isStackable(item)) {
        g.inventory.push(item);
        return true;
    }
    
    const key = item.name + '|' + (item.quality || 'Обычное') + '|' + (item.resourceType || '');
    for (let i = 0; i < g.inventory.length; i++) {
        const existing = g.inventory[i];
        if (!isStackable(existing)) continue;
        
        const existingKey = existing.name + '|' + (existing.quality || 'Обычное') + '|' + (existing.resourceType || '');
        if (existingKey === key) {
            existing.count = (existing.count || 1) + (item.count || 1);
            return true;
        }
    }
    
    if (!item.count) item.count = 1;
    g.inventory.push(item);
    return true;
}

// ============================================================
// НОРМАЛИЗАЦИЯ СТЕКОВ В ИНВЕНТАРЕ
// ============================================================
export function normalizeInventory(g) {
    if (!g || !g.inventory) return;
    
    const items = {};
    for (let i = 0; i < g.inventory.length; i++) {
        const item = g.inventory[i];
        if (!isStackable(item)) continue;
        
        const key = item.name + '|' + (item.quality || 'Обычное') + '|' + (item.resourceType || '');
        if (!items[key]) {
            items[key] = { item: item, indices: [] };
        }
        items[key].indices.push(i);
    }
    
    for (const key in items) {
        const data = items[key];
        if (data.indices.length <= 1) continue;
        
        let totalCount = 0;
        data.indices.forEach(idx => {
            totalCount += g.inventory[idx].count || 1;
        });
        
        data.indices.sort((a, b) => b - a).forEach(idx => {
            g.inventory.splice(idx, 1);
        });
        
        const baseItem = data.item;
        baseItem.count = totalCount;
        g.inventory.push(baseItem);
    }
}

// ============================================================
// ПАРСИНГ ВВОДА ВАЛЮТЫ
// ============================================================
export function parseCurrencyInput(input) {
    input = input.trim().toUpperCase();
    if (!input) return null;
    
    if (/^\d+$/.test(input)) {
        return parseInt(input);
    }
    
    let total = 0;
    let parts = input.split(' ');
    
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const num = parseInt(part);
        if (isNaN(num)) continue;
        
        const next = i + 1 < parts.length ? parts[i + 1] : '';
        if (next === 'ЗОЛ' || next === 'ЗОЛОТО' || next === 'GOLD' || next === 'G') {
            total += num * 210 * 56;
            i++;
        } else if (next === 'СО' || next === 'СЕРЕБРО' || next === 'SILVER' || next === 'S') {
            total += num * 56;
            i++;
        } else if (next === 'МП' || next === 'МЕДЬ' || next === 'COPPER' || next === 'C') {
            total += num;
            i++;
        } else {
            total += num;
        }
    }
    
    return total;
}

// ============================================================
// РАСЧЁТ ЦЕНЫ РЕСУРСА
// ============================================================
export function getResourcePrice(resourceType, quality) {
    const basePrices = { 'leather':5, 'iron':8, 'wood':3, 'steel':20, 'coal':4, 'valyrian_ore':50000, 'valyrian_steel':100000 };
    const base = basePrices[resourceType] || 5;
    const q = QUALITIES[quality] || QUALITIES['Обычное'];
    return Math.round(base * q.multiplier);
}
