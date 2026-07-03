
// ============================================================
// ПЕРСОНАЖ (game/character.js) — ПОЛНАЯ ВЕРСИЯ
// ============================================================

// ============================================================
// 1. ОТКРЫТЬ ПЕРСОНАЖА
// ============================================================
function openCharacter() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    const modal = document.getElementById('modal-character');
    const content = document.getElementById('modal-content');

    const totalStats = getTotalStats(g);
    const equipped = getEquippedStats(g);
    const mastery = getWeaponMasteryBonus(g);

    let html = '';

    // ---- ОСНОВНАЯ ИНФОРМАЦИЯ ----
    html += '<div class="modal-section"><h4>📋 ОСНОВНОЕ</h4>';
    html += '<div class="row"><span class="label">Имя</span><span class="value">' + currentUser + '</span></div>';
    html += '<div class="row"><span class="label">Национальность</span><span class="value">' + user.nationality + '</span></div>';
    html += '<div class="row"><span class="label">Дом</span><span class="value">' + (g.lordOf ? HOUSES[g.lordOf]?.name || 'Нет' : 'Нет') + '</span></div>';
    html += '<div class="row"><span class="label">Уровень</span><span class="value">' + g.level + ' (' + g.xp + '/' + g.nextLevelXp + ')</span></div>';
    html += '<div class="row"><span class="label">Очки атрибутов</span><span class="value">' + g.attributePoints + '</span></div>';
    html += '<div class="row"><span class="label">HP</span><span class="value">' + Math.round(g.hp) + '/' + g.maxHp + '</span></div>';

    if (g.blessing && g.blessing.active && g.blessing.expires > Date.now()) {
        const timeLeft = Math.ceil((g.blessing.expires - Date.now()) / 60000);
        html += '<div class="row"><span class="label">🙏 Благословение</span><span class="value" style="color:#ffd700;">✅ +10% опыта (' + timeLeft + ' мин)</span></div>';
    }

    if (g.equipment && g.equipment.horse) {
        const horse = HORSE_TYPES[g.equipment.horse.horseType];
        if (horse) {
            html += '<div class="row"><span class="label">🐴 Лошадь</span><span class="value">' + horse.emoji + ' ' + horse.name + ' (HP: ' + g.equipment.horse.hp + '/' + g.equipment.horse.maxHp + ')</span></div>';
        }
    }
    html += '</div>';

    // ---- ПРОГРЕСС ----
    html += renderLevelProgress(g);

    // ---- АТРИБУТЫ ----
    html += '<div class="modal-section"><h4>⚔️ АТРИБУТЫ (распределено: ' + getDistributedPoints(g) + '/100)</h4>';
    const statLabels = {
        damage: '⚔️ Урон',
        defense: '🛡️ Защита',
        intelligence: '🧠 Интеллект',
        agility: '💨 Ловкость'
    };
    ['damage', 'defense', 'intelligence', 'agility'].forEach(s => {
        const base = g.stats[s] || 1;
        let bonus = 0;
        let bonusText = '';
        if (s === 'damage') {
            bonus = equipped.bonusDamage + mastery.damageBonus;
            bonusText = ' (оружие: +' + equipped.bonusDamage + ' | мастерство: +' + mastery.damageBonus + ')';
        }
        if (s === 'defense') {
            bonus = equipped.bonusDefense + mastery.defenseBonus;
            bonusText = ' (броня: +' + equipped.bonusDefense + ' | мастерство: +' + mastery.defenseBonus + ')';
        }
        if (s === 'agility') {
            bonus = equipped.bonusAgility + mastery.agilityBonus;
            bonusText = ' (экипировка: +' + equipped.bonusAgility + ' | мастерство: +' + mastery.agilityBonus + ')';
        }
        const total = base + bonus;
        html += '<div class="row"><span class="label">' + statLabels[s] + '</span>';
        html += '<span class="value">' + base;
        if (bonus > 0) html += ' <span style="color:#7ac98a;">+</span><span style="color:#7ac98a;">' + bonus + '</span>';
        html += ' = <strong>' + total + '</strong>';
        if (g.attributePoints > 0 && s !== 'intelligence') {
            html += ' <button class="btn btn-small" onclick="addAttribute(\'' + s + '\')">+1</button>';
        }
        html += '<br><span style="font-size:10px;color:#6a5a48;">' + bonusText + '</span>';
        html += '</span></div>';
    });
    html += '</div>';

    // ---- БОНУСЫ ОТ АТРИБУТОВ ----
    html += renderAttributeDetails(g);

    // ---- СКОРОСТЬ ----
    html += '<div class="modal-section"><h4>🏃 СКОРОСТЬ</h4>';
    html += '<div class="row"><span class="label">👢 Ботинки</span><span class="value">+' + totalStats.speedDetails.boots + '%</span></div>';
    html += '<div class="row"><span class="label">🐴 Лошадь</span><span class="value">+' + totalStats.speedDetails.horse + '%</span></div>';
    html += '<div class="row"><span class="label">🗡️ Мастерство</span><span class="value">+' + (totalStats.speedDetails.mastery || 0) + '%</span></div>';
    html += '<div class="row" style="border-top:1px solid #3d3026;padding-top:6px;"><span class="label" style="color:#c9b694;">✅ ИТОГО</span><span class="value" style="color:#7ac98a;font-size:16px;">+' + totalStats.speedPercent + '%</span></div>';
    html += '</div>';

    // ---- ЛОВКОСТЬ ----
    const hitChance = calcChance(totalStats.agility);
    const dodgeChance = calcChance(totalStats.agility);
    html += '<div class="modal-section"><h4>💨 ЛОВКОСТЬ</h4>';
    html += '<div class="row"><span class="label">🎯 Попадание</span><span class="value">' + hitChance + '%</span></div>';
    html += '<div class="row"><span class="label">💨 Уворот</span><span class="value">' + dodgeChance + '%</span></div>';
    html += '</div>';

    // ---- ЗАЩИТА ----
    const reduction = calcDamageReduction(totalStats.defense);
    html += '<div class="modal-section"><h4>🛡️ ЗАЩИТА</h4>';
    html += '<div class="row"><span class="label">🛡️ Защита</span><span class="value">' + totalStats.defense + ' (' + reduction + '% поглощения)</span></div>';
    html += '</div>';

    // ---- ВЫНОСЛИВОСТЬ ----
    html += '<div class="modal-section"><h4>💪 ВЫНОСЛИВОСТЬ</h4>';
    const st = g.stamina || { level: 1, xp: 0 };
    const staminaNeeded = st.level * 8 + 3;
    const staminaProgress = Math.min(100, Math.round((st.xp / staminaNeeded) * 100));
    html += '<div class="row"><span class="label">Уровень</span><span class="value">' + st.level + '</span></div>';
    html += '<div class="row"><span class="label">📊 Прогресс</span><span class="value">' + staminaProgress + '% (' + st.xp + '/' + staminaNeeded + ')</span></div>';
    html += '<div class="row"><span class="label">❤️ Бонус HP</span><span class="value" style="color:#7ac98a;">+' + (st.level * 2) + '</span></div>';
    html += '</div>';

    // ---- МАСТЕРСТВО ОРУЖИЯ ----
    html += '<div class="modal-section"><h4>🗡️ МАСТЕРСТВО ОРУЖИЯ</h4>';
    html += '<div class="row"><span class="label">Оружие</span><span class="value">' + (g.equipment.rightHand ? g.equipment.rightHand.name : 'нет') + '</span></div>';
    html += '<div class="row"><span class="label">Уровень</span><span class="value">' + mastery.skillLevel + '</span></div>';
    const skill = g.skills[mastery.weaponType];
    if (skill) {
        const currentXp = skill.xp || 0;
        const neededXp = skill.level * 20 + 10;
        const progress = Math.min(100, Math.round((currentXp / neededXp) * 100));
        html += '<div class="row"><span class="label">📊 Прогресс</span><span class="value">' + progress + '% (' + currentXp + '/' + neededXp + ')</span></div>';
    } else {
        html += '<div class="row"><span class="label">📊 Прогресс</span><span class="value">0% (0/0)</span></div>';
    }
    html += '<div class="row"><span class="label">⚔️ Урон</span><span class="value" style="color:#7ac98a;">+' + mastery.damageBonus + '</span></div>';
    html += '<div class="row"><span class="label">🛡️ Защита</span><span class="value" style="color:#7ac98a;">+' + mastery.defenseBonus + '</span></div>';
    html += '<div class="row"><span class="label">💨 Ловкость</span><span class="value" style="color:#7ac98a;">+' + mastery.agilityBonus + '</span></div>';
    html += '</div>';

    // ---- АКТИВНЫЕ БОНУСЫ (ОЧКИ МАСТЕРСТВА) ----
    html += `
        <div class="modal-section">
            <h4>🔧 АКТИВНЫЕ БОНУСЫ</h4>
            <p style="color:#6a5a48;font-size:11px;">Очков мастерства: ${g.activeBonuses.points}</p>
            <div class="row">
                <span class="label">💥 Крит</span>
                <span class="value">${getActiveBonus(g, 'crit')}% 
                    <button class="btn btn-small" onclick="useMasteryPoint('crit')" ${g.activeBonuses.points > 0 ? '' : 'disabled'}>+</button>
                </span>
            </div>
            <div class="row">
                <span class="label">🛡️ Пробитие</span>
                <span class="value">${getActiveBonus(g, 'pierce')}% 
                    <button class="btn btn-small" onclick="useMasteryPoint('pierce')" ${g.activeBonuses.points > 0 ? '' : 'disabled'}>+</button>
                </span>
            </div>
            <div class="row">
                <span class="label">⚡ Двойной удар</span>
                <span class="value">${getActiveBonus(g, 'doubleHit')}% 
                    <button class="btn btn-small" onclick="useMasteryPoint('doubleHit')" ${g.activeBonuses.points > 0 ? '' : 'disabled'}>+</button>
                </span>
            </div>
            <div class="row">
                <span class="label">💫 Контратака</span>
                <span class="value">${getActiveBonus(g, 'counter')}% 
                    <button class="btn btn-small" onclick="useMasteryPoint('counter')" ${g.activeBonuses.points > 0 ? '' : 'disabled'}>+</button>
                </span>
            </div>
        </div>
    `;

    // ---- ПРОФЕССИИ ----
    html += '<div class="modal-section"><h4>👷 ПРОФЕССИИ</h4>';
    html += '<div class="row"><span class="label">Активная</span><span class="value">' + (g.activeProfession || 'Охотник') + ' <button class="btn btn-small" onclick="changeProfession()">Сменить (24ч)</button></span></div>';
    ['Шахтёр', 'Лесоруб', 'Охотник', 'Кузнец'].forEach(p => {
        const level = g.professions[p] || 1;
        const xp = g.professionXp[p] || 0;
        const nx = level * 10;
        const isActive = g.activeProfession === p;
        html += '<div class="row"><span class="label">' + p + (isActive ? ' ✅' : '') + '</span><span class="value">ур. ' + level + ' (' + xp + '/' + nx + ')</span></div>';
    });
    html += '</div>';

    // ---- ЭКИПИРОВКА ----
    html += '<div class="modal-section"><h4>🛡️ ЭКИПИРОВКА</h4>';
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
        html += '<div class="row"><span class="label">' + s.label + '</span><span class="value">' + (item ? (item.quality ? item.quality + ' ' : '') + item.name + ' <button class="btn btn-small" style="background:#3d2a1a;" onclick="unequipItem(\'' + s.key + '\')">Снять</button>' : 'пусто') + '</span></div>';
    });
    html += '</div>';

    // ---- СБРОС АТРИБУТОВ ----
    html += '<div class="row" style="margin-top:10px;"><span class="label">🔄 Сброс атрибутов</span>';
    const now = Date.now();
    const canReset = !g.lastReset || (now - g.lastReset) >= 3 * 24 * 60 * 60 * 1000;
    if (canReset) {
        html += '<span class="value"><button class="btn btn-small" onclick="resetAttributes()">Сбросить (бесплатно)</button></span>';
    } else {
        const timeLeft = Math.ceil((3 * 24 * 60 * 60 * 1000 - (now - g.lastReset)) / (60 * 60 * 1000));
        html += '<span class="value" style="color:#6a5a48;">Доступно через ' + timeLeft + ' ч.</span>';
    }
    html += '</div>';

    html += '<button class="btn" onclick="closeCharacter()">Закрыть</button>';
    content.innerHTML = html;
    modal.classList.remove('hide');
}

// ============================================================
// 2. ДОБАВИТЬ АТРИБУТ
// ============================================================
function addAttribute(statId) {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    
    if (g.attributePoints <= 0) {
        setMessage('❌ Нет свободных очков атрибутов.');
        return;
    }
    
    if (g.stats[statId] >= 100) {
        setMessage('❌ Максимум 100 очков в ' + statId);
        return;
    }
    
    g.attributePoints--;
    g.stats[statId] = (g.stats[statId] || 1) + 1;
    g.maxHp = getMaxHp(g);
    g.hp = Math.min(g.hp + 5, g.maxHp);
    
    setMessage('✅ +1 к ' + statId + ' (теперь: ' + g.stats[statId] + ')');
    addLog('📈 ' + currentUser + ' повысил ' + statId + ' до ' + g.stats[statId]);
    saveData();
    openCharacter();
    updateMenu();
}

// ============================================================
// 3. ДОБАВИТЬ ОПЫТ
// ============================================================
function addExperience(amount) {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    
    const xpMultiplier = getXpMultiplier(g);
    const xpGain = Math.round(amount * xpMultiplier);
    
    g.xp += xpGain;
    
    while (g.xp >= g.nextLevelXp) {
        g.xp -= g.nextLevelXp;
        g.level++;
        g.nextLevelXp = Math.floor(100 + g.level * 10 + Math.pow(g.level, 1.5));
        
        if (g.level <= 100) {
            g.attributePoints++;
            setMessage('🎉 Вы достигли ' + g.level + ' уровня! +1 очко атрибутов.');
        } else {
            setMessage('🎉 Вы достигли ' + g.level + ' уровня!');
        }
        
        g.maxHp = getMaxHp(g);
        g.hp = Math.min(g.hp + 10, g.maxHp);
        addLog('📈 ' + currentUser + ' достиг ' + g.level + ' уровня');
    }
    
    saveData();
    updateMenu();
}

// ============================================================
// 4. ИНФОРМАЦИЯ О ПРОГРЕССЕ
// ============================================================
function getLevelInfo(g) {
    const nextLevelXp = g.nextLevelXp || 100;
    const currentXp = g.xp || 0;
    const progress = Math.min(100, Math.round((currentXp / nextLevelXp) * 100));
    
    return {
        level: g.level,
        xp: currentXp,
        nextLevelXp: nextLevelXp,
        progress: progress,
        attributePoints: g.attributePoints || 0,
        maxLevel: 100
    };
}

function renderLevelProgress(g) {
    const info = getLevelInfo(g);
    const bars = Math.floor(info.progress / 5);
    const empty = 20 - bars;
    
    return `
        <div class="modal-section">
            <h4>📈 ПРОГРЕСС</h4>
            <div class="row">
                <span class="label">Уровень</span>
                <span class="value">${info.level} / ${info.maxLevel}</span>
            </div>
            <div class="row">
                <span class="label">Очки атрибутов</span>
                <span class="value" style="color:#ffd700;">${info.attributePoints}</span>
            </div>
            <div class="row">
                <span class="label">Опыт</span>
                <span class="value">${info.xp} / ${info.nextLevelXp}</span>
            </div>
            <div style="background:#1a1410;border-radius:10px;padding:2px;margin-top:6px;">
                <div style="background:#3d2e20;border-radius:10px;height:14px;width:${info.progress}%;transition:0.3s;"></div>
            </div>
            <div style="text-align:center;color:#6a5a48;font-size:11px;margin-top:4px;">${info.progress}% до следующего уровня</div>
        </div>
    `;
}

// ============================================================
// 5. БОНУСЫ ОТ АТРИБУТОВ
// ============================================================
function getAttributeBonuses(g) {
    const stats = g.stats || { damage: 1, defense: 1, intelligence: 1, agility: 1 };
    const equipped = getEquippedStats(g);
    const mastery = getWeaponMasteryBonus(g);

    return {
        damage: {
            base: stats.damage || 1,
            bonus: equipped.bonusDamage + mastery.damageBonus,
            total: (stats.damage || 1) + equipped.bonusDamage + mastery.damageBonus,
            description: 'Влияет на базовый урон в бою. Каждое очко = +1 урон.'
        },
        defense: {
            base: stats.defense || 1,
            bonus: equipped.bonusDefense + mastery.defenseBonus,
            total: (stats.defense || 1) + equipped.bonusDefense + mastery.defenseBonus,
            description: 'Снижает получаемый урон. Каждые 10 очков = -10% урона.'
        },
        intelligence: {
            base: stats.intelligence || 1,
            bonus: 0,
            total: stats.intelligence || 1,
            description: 'Увеличивает получаемый опыт. Каждое очко = +1% к опыту.'
        },
        agility: {
            base: stats.agility || 1,
            bonus: equipped.bonusAgility + mastery.agilityBonus,
            total: (stats.agility || 1) + equipped.bonusAgility + mastery.agilityBonus,
            description: 'Влияет на шанс попадания и уворота. Каждые 10 очков = +5% к шансам.'
        }
    };
}

function renderAttributeDetails(g) {
    const bonuses = getAttributeBonuses(g);
    let html = '<div class="modal-section"><h4>📊 БОНУСЫ ОТ АТРИБУТОВ</h4>';

    const names = {
        damage: '⚔️ Урон',
        defense: '🛡️ Защита',
        intelligence: '🧠 Интеллект',
        agility: '💨 Ловкость'
    };

    for (let key in bonuses) {
        const data = bonuses[key];
        html += `
            <div class="row">
                <span class="label">${names[key] || key}</span>
                <span class="value">
                    ${data.base} 
                    ${data.bonus > 0 ? '<span style="color:#7ac98a;">+ ' + data.bonus + '</span>' : ''}
                    = <strong>${data.total}</strong>
                    <br><span style="font-size:10px;color:#6a5a48;">${data.description}</span>
                </span>
            </div>
        `;
    }

    const reduction = calcDamageReduction(bonuses.defense.total);
    const hitChance = calcChance(bonuses.agility.total);
    const dodgeChance = calcChance(bonuses.agility.total);
    const xpMult = getXpMultiplier(g);

    html += `
        <div style="margin-top:10px;padding:10px;background:#120e0b;border-radius:8px;">
            <div class="row">
                <span class="label">🛡️ Поглощение урона</span>
                <span class="value" style="color:#7ac98a;">${reduction}%</span>
            </div>
            <div class="row">
                <span class="label">🎯 Шанс попадания</span>
                <span class="value" style="color:#7ac98a;">${hitChance}%</span>
            </div>
            <div class="row">
                <span class="label">💨 Шанс уворота</span>
                <span class="value" style="color:#7ac98a;">${dodgeChance}%</span>
            </div>
            <div class="row">
                <span class="label">📈 Множитель опыта</span>
                <span class="value" style="color:#7ac98a;">${xpMult.toFixed(2)}x</span>
            </div>
        </div>
    `;

    html += '</div>';
    return html;
}

// ============================================================
// 6. ИСПОЛЬЗОВАТЬ ОЧКО МАСТЕРСТВА
// ============================================================
function useMasteryPoint(type) {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    
    if (g.activeBonuses.points <= 0) {
        setMessage('❌ Нет очков мастерства.');
        return;
    }
    
    const maxBonus = 65;
    const current = g.activeBonuses[type] || 0;
    if (current >= maxBonus) {
        setMessage('❌ Максимум для ' + type + ' достигнут (' + maxBonus + '%).');
        return;
    }
    
    g.activeBonuses[type] = Math.min(maxBonus, current + 1);
    g.activeBonuses.points--;
    
    setMessage('✅ +1% к ' + type + ' (теперь: ' + g.activeBonuses[type] + '%)');
    addLog('🔧 ' + currentUser + ' улучшил ' + type + ' до ' + g.activeBonuses[type] + '%');
    saveData();
    openCharacter();
}

// ============================================================
// 7. СБРОСИТЬ АТРИБУТЫ
// ============================================================
function resetAttributes() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    const now = Date.now();
    
    if (g.lastReset && (now - g.lastReset) < 3 * 24 * 60 * 60 * 1000) {
        setMessage('❌ Сброс доступен раз в 3 дня.');
        return;
    }
    
    g.attributePoints = Math.min(100, g.level);
    g.stats = { damage: 1, defense: 1, intelligence: 1, agility: 1 };
    g.lastReset = now;
    setMessage('✅ Атрибуты сброшены! Доступно очков: ' + g.attributePoints);
    updateMenu();
    saveData();
    openCharacter();
}

// ============================================================
// 8. СМЕНИТЬ ПРОФЕССИЮ
// ============================================================
function changeProfession() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    const now = Date.now();
    
    if (g.lastProfessionChange && (now - g.lastProfessionChange) < 86400000) {
        const hoursLeft = Math.ceil((86400000 - (now - g.lastProfessionChange)) / 3600000);
        setMessage('⏳ Смена профессии доступна через ' + hoursLeft + ' часов.');
        return;
    }
    
    const professions = ['Охотник', 'Шахтёр', 'Лесоруб', 'Кузнец'];
    const choice = prompt('Выберите профессию:\n' + professions.map(p => '• ' + p + (g.activeProfession === p ? ' ✅' : '')).join('\n'));
    
    if (choice && professions.includes(choice)) {
        const oldProfession = g.activeProfession || 'Охотник';
        g.activeProfession = choice;
        g.lastProfessionChange = now;
        setMessage('✅ Вы сменили профессию с ' + oldProfession + ' на ' + choice);
        addLog('👷 ' + currentUser + ' сменил профессию на ' + choice);
        updateMenu();
        saveData();
        openCharacter();
    } else {
        setMessage('❌ Отменено.');
    }
}

// ============================================================
// 9. ЗАКРЫТЬ ОКНО ПЕРСОНАЖА
// ============================================================
function closeCharacter() {
    document.getElementById('modal-character').classList.add('hide');
}

// ============================================================
// 10. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (из core.js, дублирую для ясности)
// ============================================================
function getDistributedPoints(g) {
    return (g.stats.damage || 1) + (g.stats.defense || 1) + (g.stats.agility || 1) + (g.stats.intelligence || 1) - 4;
}
