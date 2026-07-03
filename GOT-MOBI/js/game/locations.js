// ============================================================
// ЛОГИКА ПЕРЕМЕЩЕНИЯ (game/locations.js)
// ============================================================

// ============================================================
// 1. ПОЛУЧЕНИЕ ВСЕХ ПЕРЕХОДОВ (из всех регионов)
// ============================================================
function getAllConnections() {
    // Временно — заглушка, позже будет импортировать из регионов
    const connections = {
        // ---- СЕВЕР ----
        winterfell: {
            wolfwood: { travelTime: 15 },
            dreadfort: { travelTime: 30 }
        },
        wolfwood: {
            winterfell: { travelTime: 15 },
            deepwood_motte: { travelTime: 20 }
        },
        deepwood_motte: {
            wolfwood: { travelTime: 20 },
            border_north: { travelTime: 25 }
        },
        border_north: {
            deepwood_motte: { travelTime: 25 },
            road: { travelTime: 40, region: 'crownlands' }
        },

        // ---- КОРОЛЕВСКИЕ ЗЕМЛИ ----
        road: {
            border_north: { travelTime: 40, region: 'north' },
            kings_landing: { travelTime: 5 }
        },
        kings_landing: {
            road: { travelTime: 5 },
            red_keep: { travelTime: 1 },
            tavern: { travelTime: 1 },
            market: { travelTime: 1 },
            gates: { travelTime: 1 }
        },
        red_keep: {
            kings_landing: { travelTime: 1 }
        },
        tavern: {
            kings_landing: { travelTime: 1 },
            market: { travelTime: 1 }
        },
        market: {
            kings_landing: { travelTime: 1 },
            tavern: { travelTime: 1 }
        },
        gates: {
            kings_landing: { travelTime: 1 },
            road: { travelTime: 5 }
        }
    };

    return connections;
}

// ============================================================
// 2. ПОЛУЧИТЬ ТОЛЬКО СОСЕДНИЕ ЛОКАЦИИ
// ============================================================
function getAvailableExits(locationId) {
    const allConnections = getAllConnections();
    const neighbors = allConnections[locationId] || {};
    const exits = [];

    for (let targetId in neighbors) {
        const data = neighbors[targetId];
        exits.push({
            id: targetId,
            name: targetId,
            travelTime: data.travelTime || 10,
            region: data.region || null,
            isBorder: !!data.region
        });
    }

    return exits;
}

// ============================================================
// 3. РАСЧЁТ ВРЕМЕНИ ПУТИ С УЧЁТОМ СКОРОСТИ
// ============================================================
function calculateTravelTimeWithSpeed(baseTime) {
    const user = users[currentUser];
    if (!user) return baseTime;
    const g = user.game;

    let speedBonus = 0;

    // Ботинки
    if (g.equipment && g.equipment.boots && g.equipment.boots.speedPercent) {
        speedBonus += g.equipment.boots.speedPercent;
    }

    // Лошадь
    if (g.equipment && g.equipment.horse) {
        const horse = HORSE_TYPES[g.equipment.horse.horseType];
        if (horse) {
            speedBonus += horse.speedBonus || 0;
        }
    }

    const speedMultiplier = Math.max(0.3, 1 - (speedBonus / 100));
    const finalTime = Math.max(1, Math.round(baseTime * speedMultiplier));

    return finalTime;
}

// ============================================================
// 4. ПОКАЗАТЬ КАРТУ (только соседние локации)
// ============================================================
function showMap() {
    const user = users[currentUser];
    if (!user) return;

    const current = user.game.location.place;
    const exits = getAvailableExits(current);

    if (exits.length === 0) {
        setMessage('❌ Отсюда никуда не уйти.');
        return;
    }

    let msg = '🗺️ ВЫ МОЖЕТЕ ПЕРЕЙТИ В:\n\n';
    msg += `📍 Текущее место: ${current}\n\n`;

    exits.forEach((exit, i) => {
        let line = `${i+1}. ${exit.name} (${exit.travelTime} мин)`;
        if (exit.isBorder) {
            line += ` ⚠️ ПЕРЕХОД В РЕГИОН ${exit.region.toUpperCase()}`;
        }
        msg += line + '\n';
    });

    msg += '\n0. Отмена';

    const choice = prompt(msg);
    if (!choice || choice === '0') {
        setMessage('❌ Отменено.');
        return;
    }

    const index = parseInt(choice) - 1;
    if (isNaN(index) || index < 0 || index >= exits.length) {
        setMessage('❌ Неверный выбор.');
        return;
    }

    const selected = exits[index];
    travelToLocation(selected.id);
}

// ============================================================
// 5. ПЕРЕМЕЩЕНИЕ В СОСЕДНЮЮ ЛОКАЦИЮ
// ============================================================
function travelToLocation(targetId) {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

    const current = g.location.place;
    const exits = getAvailableExits(current);
    const targetExit = exits.find(e => e.id === targetId);

    if (!targetExit) {
        setMessage('❌ Сюда нельзя попасть отсюда.');
        return;
    }

    // Если это переход в другой регион — предупреждаем
    if (targetExit.isBorder) {
        setMessage(`⚠️ Вы покидаете регион! Путь в ${targetExit.name} займёт ${targetExit.travelTime} мин.`);
        addLog('🚶 ' + currentUser + ' переходит в регион ' + targetExit.region);
    }

    // Расчёт времени с учётом скорости
    const totalTime = calculateTravelTimeWithSpeed(targetExit.travelTime);
    setMessage(`🚶 Вы идёте в ${targetExit.name}... (${totalTime} мин)`);
    addLog('🚶 ' + currentUser + ' отправился в ' + targetExit.name);

    // Запускаем таймер
    isBusy = true;
    document.getElementById('busy-status').classList.remove('hide');
    document.getElementById('busy-status').textContent = `🚶 Путешествие... (${totalTime} мин)`;
    updateActions();

    if (busyTimer) clearTimeout(busyTimer);
    busyTimer = setTimeout(function() {
        // Перемещаем игрока
        g.location.place = targetId;
        g.location.location = targetId;

        if (targetExit.region) {
            g.location.region = targetExit.region;
            setMessage(`✅ Вы прибыли в ${targetExit.name} (регион: ${targetExit.region})`);
        } else {
            setMessage(`✅ Вы прибыли в ${targetExit.name}.`);
        }

        // Расход усталости
        const fatigueCost = Math.floor(totalTime / 2);
        g.fatigue = Math.max(0, g.fatigue - fatigueCost);

        // Случайная встреча в пути
        if (Math.random() * 100 < 15 && totalTime > 3) {
            setMessage('⚠️ В пути на вас напали!');
            const mob = getRandomMobByLevel(g.level);
            if (mob) {
                startBattle(mob);
            }
        }

        isBusy = false;
        document.getElementById('busy-status').classList.add('hide');
        busyTimer = null;
        updateMenu();
        updateStory();
        updateActions();
        saveData();
    }, totalTime * 60 * 1000);
}

// ============================================================
// 6. ВОЙТИ В ГОРОД / ВЫЙТИ ИЗ ГОРОДА
// ============================================================
function enterCity() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

    g.location.place = 'kings_landing';
    g.location.location = 'Королевская Гавань';
    g.outside = false;
    setMessage('🚪 Вы вошли в город через Ворота.');
    updateMenu();
    updateStory();
    updateActions();
    saveData();
}

function leaveCity() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

    g.location.place = 'road';
    g.location.location = 'Дорога';
    g.outside = true;
    setMessage('🛤️ Вы вышли на Дорогу.');
    updateMenu();
    updateStory();
    updateActions();
    saveData();
}

// ============================================================
// 7. ПОИСК
// ============================================================
function doSearch() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

    const place = g.location.place;
    const locationLevel = LOCATION_LEVELS[place] || 1;
    const region = g.location.region || 'crownlands';
    const luck = Math.min(25, g.luck || 0);
    const luckBonus = Math.floor(luck / 10);

    // ---- КВАРТАЛ БЕДНОТЫ ----
    if (place === 'poor_quarter') {
        if (Math.random() * 100 < 20) {
            findDrunkard();
            return;
        }
        const treasureChance = Math.min(4.5, 2 + luckBonus);
        if (Math.random() * 100 < treasureChance) {
            findTreasure();
            return;
        }
        const monsterChance = Math.min(47.5, 45 + luckBonus);
        if (Math.random() * 100 < monsterChance) {
            const mob = getRandomMobByRegionAndLevel(region, locationLevel);
            if (mob) {
                setMessage('⚔️ Вы встретили ' + mob.name + ' (уровень ' + mob.level + ')');
                addLog('⚔️ ' + currentUser + ' встретил ' + mob.name + ' (ур. ' + mob.level + ')');
                startBattle(mob);
                return;
            }
        }
        setMessage('🔍 В Квартале бедноты тихо... Пока.');
        return;
    }

    // ---- ОБЫЧНЫЙ ПОИСК ----
    const treasureChance = Math.min(4.5, 2 + luckBonus);
    if (Math.random() * 100 < treasureChance) {
        findTreasure();
        return;
    }

    const monsterChance = Math.min(47.5, 45 + luckBonus);
    if (Math.random() * 100 < monsterChance) {
        const mob = getRandomMobByRegionAndLevel(region, locationLevel);
        if (mob) {
            setMessage('⚔️ Вы встретили ' + mob.name + ' (уровень ' + mob.level + ')');
            addLog('⚔️ ' + currentUser + ' встретил ' + mob.name + ' (ур. ' + mob.level + ')');
            startBattle(mob);
            return;
        }
    }

    const messages = [
        '🔍 Вы никого не нашли. Тишина...',
        '🔍 Здесь пусто. Только ветер шумит.',
        '🔍 Похоже, сегодня никого нет.',
        '🔍 Вы обыскали местность, но ничего не нашли.'
    ];
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
}

// ============================================================
// 8. НАЙТИ СОКРОВИЩЕ
// ============================================================
function findTreasure() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

    const luck = Math.min(25, g.luck || 0);
    const bonusLuck = Math.min(5, Math.floor(luck / 5));
    const typeRoll = Math.random() * 100;

    // ---- ЗОЛОТО ----
    if (typeRoll < 40) {
        const goldAmount = 2 + Math.floor(Math.random() * 8) + bonusLuck;
        g.copper += goldAmount;
        convertCurrency(g);
        setMessage('🪙 Вы нашли клад! +' + goldAmount + ' золота!');
        addLog('🪙 ' + currentUser + ' нашёл клад: ' + goldAmount + ' золота');
        updateMenu();
        saveData();
        return;
    }

    // ---- ОРУЖИЕ ----
    if (typeRoll < 60) {
        const weaponTypes = ['sword', 'spear', 'axe', 'mace', 'dagger', 'bow', 'crossbow'];
        const type = weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
        const available = ALL_ITEMS.weapons[type].filter(w => w.level <= g.level + 2);
        if (available.length > 0) {
            const baseItem = available[Math.floor(Math.random() * available.length)];
            const quality = rollTreasureQuality(g.level, luck);
            const q = QUALITIES[quality];
            const item = {
                name: baseItem.name,
                type: type,
                level: baseItem.level,
                quality: quality,
                baseDamage: baseItem.baseDamage || 0,
                finalDamage: baseItem.baseDamage ? Math.round(baseItem.baseDamage * q.multiplier) : 0,
                defense: baseItem.defense || 0,
                finalDefense: baseItem.defense ? Math.round(baseItem.defense * q.multiplier) : 0
            };
            addToInventory(g, item);
            setMessage('⚔️ Вы нашли клад: ' + item.name + ' (' + quality + ')!');
            addLog('⚔️ ' + currentUser + ' нашёл клад: ' + item.name + ' (' + quality + ')');
            updateMenu();
            saveData();
            return;
        }
    }

    // ---- БРОНЯ ----
    if (typeRoll < 80) {
        const armorClasses = ['leather', 'plate'];
        const armorClass = armorClasses[Math.floor(Math.random() * armorClasses.length)];
        const types = ['helmet', 'chestplate', 'shoulders', 'leggings', 'boots', 'gloves', 'belt', 'cloak'];
        const type = types[Math.floor(Math.random() * types.length)];
        const available = ALL_ITEMS[armorClass][type].filter(a => a.level <= g.level + 2);
        if (available.length > 0) {
            const baseItem = available[Math.floor(Math.random() * available.length)];
            const quality = rollTreasureQuality(g.level, luck);
            const q = QUALITIES[quality];
            const item = {
                name: baseItem.name,
                type: type,
                level: baseItem.level,
                quality: quality,
                armorClass: armorClass,
                baseDefense: baseItem.baseDefense || 0,
                finalDefense: baseItem.baseDefense ? Math.round(baseItem.baseDefense * q.multiplier) : 0
            };
            if (baseItem.speed) item.speedBonus = baseItem.speed;
            addToInventory(g, item);
            setMessage('🛡️ Вы нашли клад: ' + item.name + ' (' + quality + ')!');
            addLog('🛡️ ' + currentUser + ' нашёл клад: ' + item.name + ' (' + quality + ')');
            updateMenu();
            saveData();
            return;
        }
    }

    // ---- РЕСУРСЫ ----
    if (typeRoll < 90) {
        const resources = [
            { name: 'Руда железная', type: 'iron' },
            { name: 'Уголь', type: 'coal' },
            { name: 'Сталь', type: 'steel' },
            { name: 'Кожа', type: 'leather' },
            { name: 'Дерево', type: 'wood' }
        ];
        const res = resources[Math.floor(Math.random() * resources.length)];
        const count = 3 + Math.floor(Math.random() * 3);
        const quality = rollTreasureQuality(g.level, luck);
        for (let i = 0; i < count; i++) {
            addToInventory(g, {
                name: res.name,
                quality: quality,
                type: 'resource',
                resourceType: res.type,
                count: 1
            });
        }
        setMessage('📦 Вы нашли клад: ' + res.name + ' ×' + count + ' (' + quality + ')!');
        addLog('📦 ' + currentUser + ' нашёл клад: ' + res.name + ' ×' + count);
        updateMenu();
        saveData();
        return;
    }

    // ---- ДРАГОЦЕННОСТИ ----
    if (typeRoll < 95) {
        const gemAmount = 50 + Math.floor(Math.random() * 50);
        g.copper += gemAmount;
        convertCurrency(g);
        setMessage('💎 Вы нашли драгоценный камень! +' + gemAmount + ' золота!');
        addLog('💎 ' + currentUser + ' нашёл драгоценный камень: ' + gemAmount + ' золота');
        updateMenu();
        saveData();
        return;
    }

    // ---- РЕДКИЙ КЛАД ----
    const weaponTypes = ['sword', 'spear', 'axe', 'mace', 'dagger', 'bow', 'crossbow', 'shield'];
    const type = weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
    const available = ALL_ITEMS.weapons[type].filter(w => w.level <= g.level + 2);
    if (available.length > 0) {
        const baseItem = available[Math.floor(Math.random() * available.length)];
        const qualities = ['Хорошее', 'Качественное'];
        const quality = qualities[Math.floor(Math.random() * qualities.length)];
        const q = QUALITIES[quality];
        const item = {
            name: baseItem.name,
            type: type,
            level: baseItem.level,
            quality: quality,
            baseDamage: baseItem.baseDamage || 0,
            finalDamage: baseItem.baseDamage ? Math.round(baseItem.baseDamage * q.multiplier) : 0,
            defense: baseItem.defense || 0,
            finalDefense: baseItem.defense ? Math.round(baseItem.defense * q.multiplier) : 0
        };
        addToInventory(g, item);
        setMessage('✨ Вы нашли редкий клад: ' + item.name + ' (' + quality + ')!');
        addLog('✨ ' + currentUser + ' нашёл редкий клад: ' + item.name + ' (' + quality + ')');
        updateMenu();
        saveData();
    }
}

// ============================================================
// 9. КАЧЕСТВО НАХОДКИ
// ============================================================
function rollTreasureQuality(level, luck) {
    const roll = Math.random() * 100 + Math.floor(luck / 5);
    if (level >= 80 && roll > 95) return 'Мифическое';
    if (level >= 60 && roll > 90) return 'Легендарное';
    if (level >= 40 && roll > 80) return 'Мастерское';
    if (level >= 20 && roll > 65) return 'Качественное';
    if (level >= 10 && roll > 45) return 'Хорошее';
    if (roll > 25) return 'Обычное';
    return 'Плохое';
}
