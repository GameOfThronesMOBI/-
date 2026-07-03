// ============================================================
// ИНВЕНТАРЬ (game/inventory.js)
// ============================================================

// ============================================================
// 1. ОТКРЫТЬ ИНВЕНТАРЬ
// ============================================================
function openInventory() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    const modal = document.getElementById('modal-inventory');
    const content = document.getElementById('modal-inventory-content');

    const maxInventory = getMaxInventory(g);
    let totalItems = 0;
    g.inventory.forEach(item => {
        if (isStackable(item) && item.count) {
            totalItems += item.count;
        } else {
            totalItems += 1;
        }
    });

    let html = '';

    // ---- ВЕРХНЯЯ ЧАСТЬ ----
    html += '<div class="modal-section">';
    html += '<h4>🎒 ИНВЕНТАРЬ (' + totalItems + '/' + maxInventory + ')</h4>';
    if (g.equipment && g.equipment.horse) {
        const horse = HORSE_TYPES[g.equipment.horse.horseType];
        if (horse) {
            html += '<p style="color:#6a5a48;font-size:11px;">🐴 Лошадь даёт +' + horse.inventorySlots + ' дополнительных слотов.</p>';
        }
    }
    html += '<button class="btn btn-small" onclick="mergeStacks()" style="margin-top:4px;">🔗 Объединить все стеки</button>';
    html += '</div>';

    // ---- ПРЕДМЕТЫ ----
    if (g.inventory.length === 0) {
        html += '<p style="color:#6a5a48;text-align:center;padding:20px 0;">🎒 Пусто</p>';
    } else {
        g.inventory.forEach((item, i) => {
            const quality = item.quality || 'Обычное';
            const q = QUALITIES[quality] || QUALITIES['Обычное'];
            let stats = '';
            let isEquippable = false;
            const levelReq = item.level || 1;
            const canEquip = g.level >= levelReq;
            let countDisplay = '';
            let isStack = false;

            if (isStackable(item) && item.count) {
                countDisplay = ' ×' + item.count;
                isStack = true;
            }

            if (item.finalDamage) stats = '⚔️ Урон: ' + item.finalDamage;
            else if (item.finalDefense) stats = '🛡️ Защита: ' + item.finalDefense;
            else if (item.speedPercent) stats += ' | 🏃 +' + item.speedPercent + '%';
            else if (item.type === 'resource') stats = '📦 ' + (item.resourceType || 'ресурс');

            const equippableTypes = ['sword', 'spear', 'axe', 'mace', 'bow', 'crossbow', 'dagger', 'shield',
                'helmet', 'chestplate', 'shoulders', 'leggings', 'boots', 'gloves', 'belt', 'cloak', 'horse'];
            if (equippableTypes.includes(item.type)) isEquippable = true;
            const isConsumableItem = isConsumable(item);
            const isBook = item.isBook;

            html += '<div class="row" style="padding:4px 0; border-bottom:1px solid #1a1410; flex-wrap:wrap;">';
            html += '<span class="label" style="color:' + q.color + ';">' + q.emoji + ' ' + item.name + ' (' + quality + ')' + countDisplay + '</span>';
            html += '<span class="value" style="font-size:12px;">' + stats;

            // ---- СТЕКИ ----
            if (isStack) {
                if (item.count > 1) {
                    html += ' <button class="btn btn-small" onclick="splitStack(' + i + ')">🔪 Разделить</button>';
                }
                let hasOther = false;
                for (let j = 0; j < g.inventory.length; j++) {
                    if (i === j) continue;
                    const other = g.inventory[j];
                    if (isStackable(other) && other.count &&
                        other.name === item.name &&
                        other.quality === item.quality) {
                        hasOther = true;
                        break;
                    }
                }
                if (hasOther) {
                    html += ' <button class="btn btn-small" onclick="mergeSpecificStack(' + i + ')">🔗 Объединить</button>';
                }
                if (isConsumableItem) {
                    html += ' <button class="btn btn-small" onclick="useOneFromStack(' + i + ')">🍽️ Использовать 1</button>';
                }
            }

            // ---- КНИГИ ----
            if (isBook) {
                html += ' <button class="btn btn-small" onclick="readBook(' + i + ')">📖 Читать</button>';
            }

            // ---- ЭКИПИРОВКА ----
            if (isEquippable) {
                if (canEquip) {
                    html += ' <button class="btn btn-small" onclick="equipItem(' + i + ')">Надеть</button>';
                } else {
                    html += ' <button class="btn btn-small" style="opacity:0.4;cursor:not-allowed;" disabled>🔒 ур. ' + levelReq + '</button>';
                }
            }

            // ---- ИСПОЛЬЗОВАНИЕ ----
            if (!isStack && isConsumableItem) {
                html += ' <button class="btn btn-small" onclick="useItem(' + i + ')">🍽️ Использовать</button>';
            }

            html += '</span></div>';
        });
    }

    // ---- НАДЕТО ----
    html += '<div class="modal-section"><h4>🛡️ НАДЕТО</h4>';
    const slots = [
        { key: 'rightHand', label: 'Правая рука' },
        { key: 'leftHand', label: 'Левая рука' },
        { key: 'helmet', label: 'Голова' },
        { key: 'chestplate', label: 'Грудь' },
        { key: 'shoulders', label: 'Плечи' },
        { key: 'leggings', label: 'Ноги' },
        { key: 'boots', label: 'Стопы' },
        { key: 'gloves', label: 'Руки' },
        { key: 'belt', label: 'Пояс' },
        { key: 'cloak', label: 'Спина' },
        { key: 'horse', label: '🐴 Лошадь' }
    ];
    slots.forEach(s => {
        const item = g.equipment[s.key];
        html += '<div class="row" style="padding:2px 0;">';
        html += '<span class="label">' + s.label + '</span>';
        html += '<span class="value">' + (item ? (item.quality ? item.quality + ' ' : '') + item.name + ' <button class="btn btn-small" style="background:#3d2a1a;" onclick="unequipItem(\'' + s.key + '\')">Снять</button>' : 'пусто') + '</span>';
        html += '</div>';
    });
    html += '</div>';

    html += '<button class="btn" onclick="closeInventory()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

// ============================================================
// 2. ЗАКРЫТЬ ИНВЕНТАРЬ
// ============================================================
function closeInventory() {
    document.getElementById('modal-inventory').classList.add('hide');
}

// ============================================================
// 3. НАДЕТЬ ПРЕДМЕТ
// ============================================================
function equipItem(index) {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

    if (index >= g.inventory.length) {
        setMessage('❌ Предмет не найден.');
        return;
    }

    const item = g.inventory[index];

    // Проверка уровня
    if (item.level && g.level < item.level) {
        setMessage('❌ Требуется уровень ' + item.level + ' для надевания.');
        return;
    }

    // Слоты для предметов
    const slotMap = {
        'sword': 'rightHand', 'spear': 'rightHand', 'axe': 'rightHand',
        'mace': 'rightHand', 'bow': 'rightHand', 'crossbow': 'rightHand',
        'dagger': 'rightHand', 'shield': 'leftHand',
        'helmet': 'helmet', 'chestplate': 'chestplate',
        'shoulders': 'shoulders', 'leggings': 'leggings',
        'boots': 'boots', 'gloves': 'gloves',
        'belt': 'belt', 'cloak': 'cloak',
        'horse': 'horse'
    };

    const slot = slotMap[item.type];
    if (!slot) {
        setMessage('❌ Этот предмет нельзя надеть.');
        return;
    }

    // Если в слоте уже есть предмет — снимаем в инвентарь
    if (g.equipment[slot]) {
        addToInventory(g, g.equipment[slot]);
    }

    g.equipment[slot] = item;
    g.inventory.splice(index, 1);

    setMessage('✅ Вы надели ' + item.name);
    addLog('⚔️ ' + currentUser + ' надел ' + item.name);
    updateMenu();
    saveData();
    openInventory();
}

// ============================================================
// 4. СНЯТЬ ПРЕДМЕТ
// ============================================================
function unequipItem(slot) {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

    if (!g.equipment[slot]) {
        setMessage('❌ Слот пуст.');
        return;
    }

    const item = g.equipment[slot];
    addToInventory(g, item);
    g.equipment[slot] = null;

    setMessage('✅ Вы сняли ' + item.name);
    g.equipment[slot] = null;
    updateMenu();
    saveData();
    openInventory();
}

// ============================================================
// 5. ИСПОЛЬЗОВАТЬ ПРЕДМЕТ
// ============================================================
function useItem(index) {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

    if (index >= g.inventory.length) {
        setMessage('❌ Предмет не найден.');
        return;
    }

    const item = g.inventory[index];

    // ---- ЕДА, ЗЕЛЬЯ ----
    if (item.effect) {
        if (item.effect.food) g.food = Math.min(100, g.food + item.effect.food);
        if (item.effect.thirst) g.thirst = Math.min(100, g.thirst + item.effect.thirst);
        if (item.effect.hp) g.hp = Math.min(g.maxHp, g.hp + item.effect.hp);
        if (item.effect.fatigue) g.fatigue = Math.min(100, g.fatigue + item.effect.fatigue);

        if (item.count && item.count > 1) {
            item.count--;
            if (item.count === 0) g.inventory.splice(index, 1);
        } else {
            g.inventory.splice(index, 1);
        }
        setMessage('✅ Использовано: ' + item.name);
        updateMenu();
        saveData();
        openInventory();
        return;
    }

    // ---- ХЛЕБ ----
    if (item.name.includes('Хлеб') || item.name.includes('Мясо') || item.name.includes('Рыба')) {
        g.food = Math.min(100, g.food + 20);
        if (item.count && item.count > 1) {
            item.count--;
            if (item.count === 0) g.inventory.splice(index, 1);
        } else {
            g.inventory.splice(index, 1);
        }
        setMessage('🍞 Вы съели ' + item.name + '. Еда +20.');
        updateMenu();
        saveData();
        openInventory();
        return;
    }

    // ---- ВОДА ----
    if (item.name.includes('Вода')) {
        g.thirst = Math.min(100, g.thirst + 15);
        if (item.count && item.count > 1) {
            item.count--;
            if (item.count === 0) g.inventory.splice(index, 1);
        } else {
            g.inventory.splice(index, 1);
        }
        setMessage('💧 Вы выпили воду. Жажда +15.');
        updateMenu();
        saveData();
        openInventory();
        return;
    }

    // ---- ЭЛЬ ----
    if (item.name.includes('Эль')) {
        g.hp = Math.min(g.maxHp, g.hp + 5);
        g.thirst = Math.min(100, g.thirst + 10);
        if (item.count && item.count > 1) {
            item.count--;
            if (item.count === 0) g.inventory.splice(index, 1);
        } else {
            g.inventory.splice(index, 1);
        }
        setMessage('🍺 Вы выпили эль. HP +5, жажда +10.');
        updateMenu();
        saveData();
        openInventory();
        return;
    }

    // ---- ВИНО ----
    if (item.name.includes('Вино')) {
        g.hp = Math.min(g.maxHp, g.hp + 8);
        g.thirst = Math.min(100, g.thirst + 15);
        if (item.count && item.count > 1) {
            item.count--;
            if (item.count === 0) g.inventory.splice(index, 1);
        } else {
            g.inventory.splice(index, 1);
        }
        setMessage('🍷 Вы выпили вино. HP +8, жажда +15.');
        updateMenu();
        saveData();
        openInventory();
        return;
    }

    setMessage('❌ Этот предмет нельзя использовать.');
}

// ============================================================
// 6. РАЗДЕЛИТЬ СТЕК
// ============================================================
function splitStack(index) {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

    if (index >= g.inventory.length) {
        setMessage('❌ Предмет не найден.');
        return;
    }

    const item = g.inventory[index];
    if (!isStackable(item) || !item.count || item.count <= 1) {
        setMessage('❌ Этот предмет нельзя разделить.');
        return;
    }

    const count = prompt('Сколько отделить? (до ' + (item.count - 1) + ')');
    const num = parseInt(count);
    if (isNaN(num) || num < 1 || num >= item.count) {
        setMessage('❌ Отменено.');
        return;
    }

    const newItem = JSON.parse(JSON.stringify(item));
    newItem.count = num;
    item.count -= num;

    g.inventory.push(newItem);
    setMessage('✅ Разделено: ' + num + ' шт.');
    updateMenu();
    saveData();
    openInventory();
}

// ============================================================
// 7. ОБЪЕДИНИТЬ СТЕКИ
// ============================================================
function mergeStacks() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

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

    let merged = false;
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
        merged = true;
    }

    if (merged) {
        setMessage('✅ Стеки объединены.');
    } else {
        setMessage('ℹ️ Нет стеков для объединения.');
    }
    updateMenu();
    saveData();
    openInventory();
}

// ============================================================
// 8. ОБЪЕДИНИТЬ КОНКРЕТНЫЙ СТЕК
// ============================================================
function mergeSpecificStack(index) {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

    if (index >= g.inventory.length) {
        setMessage('❌ Предмет не найден.');
        return;
    }

    const item = g.inventory[index];
    if (!isStackable(item)) {
        setMessage('❌ Этот предмет нельзя стакать.');
        return;
    }

    const key = item.name + '|' + (item.quality || 'Обычное') + '|' + (item.resourceType || '');
    let totalCount = item.count || 1;
    const indices = [index];

    for (let i = 0; i < g.inventory.length; i++) {
        if (i === index) continue;
        const other = g.inventory[i];
        if (!isStackable(other)) continue;
        const otherKey = other.name + '|' + (other.quality || 'Обычное') + '|' + (other.resourceType || '');
        if (otherKey === key) {
            totalCount += other.count || 1;
            indices.push(i);
        }
    }

    if (indices.length <= 1) {
        setMessage('ℹ️ Нет других стеков для объединения.');
        return;
    }

    indices.sort((a, b) => b - a).forEach(idx => {
        g.inventory.splice(idx, 1);
    });

    const newItem = JSON.parse(JSON.stringify(item));
    newItem.count = totalCount;
    g.inventory.push(newItem);

    setMessage('✅ Объединено: ' + totalCount + ' шт.');
    updateMenu();
    saveData();
    openInventory();
}

// ============================================================
// 9. ИСПОЛЬЗОВАТЬ 1 ИЗ СТЕКА
// ============================================================
function useOneFromStack(index) {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

    if (index >= g.inventory.length) {
        setMessage('❌ Предмет не найден.');
        return;
    }

    const item = g.inventory[index];
    if (!isConsumable(item)) {
        setMessage('❌ Этот предмет нельзя использовать.');
        return;
    }

    if (isStackable(item) && item.count) {
        if (item.count <= 1) {
            useItem(index);
            return;
        }

        const newItem = JSON.parse(JSON.stringify(item));
        newItem.count = 1;
        item.count--;

        // Применяем эффект
        if (item.effect) {
            if (item.effect.food) g.food = Math.min(100, g.food + item.effect.food);
            if (item.effect.thirst) g.thirst = Math.min(100, g.thirst + item.effect.thirst);
            if (item.effect.hp) g.hp = Math.min(g.maxHp, g.hp + item.effect.hp);
            if (item.effect.fatigue) g.fatigue = Math.min(100, g.fatigue + item.effect.fatigue);
        } else if (item.name.includes('Хлеб') || item.name.includes('Мясо') || item.name.includes('Рыба')) {
            g.food = Math.min(100, g.food + 20);
        } else if (item.name.includes('Вода')) {
            g.thirst = Math.min(100, g.thirst + 15);
        } else if (item.name.includes('Эль')) {
            g.hp = Math.min(g.maxHp, g.hp + 5);
            g.thirst = Math.min(100, g.thirst + 10);
        } else if (item.name.includes('Вино')) {
            g.hp = Math.min(g.maxHp, g.hp + 8);
            g.thirst = Math.min(100, g.thirst + 15);
        }

        setMessage('✅ Использовано: ' + item.name);
        updateMenu();
        saveData();
        openInventory();
    }
}
