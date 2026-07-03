// ============================================================
// БОЕВАЯ СИСТЕМА (game/combat.js)
// ============================================================

import { DROP_CHANCES, MOB_DROPS, REGION_RESOURCES, COMMON_RESOURCES, RARE_ITEMS } from '../data/drop.js';

// ============================================================
// 1. СОХРАНЕНИЕ СОСТОЯНИЯ БОЯ
// ============================================================
function saveBattleState() {
    if (battleState) {
        battleState.lastActionTime = Date.now();
        localStorage.setItem('got_battle', JSON.stringify(battleState));
    } else {
        localStorage.removeItem('got_battle');
    }
}

// ============================================================
// 2. НАЧАЛО БОЯ
// ============================================================
function startBattle(mob) {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

    const maxHp = getMaxHp(g);
    g.maxHp = maxHp;
    if (g.hp === undefined || g.hp > maxHp) g.hp = maxHp;

    const weaponType = g.equipment.rightHand ? (g.equipment.rightHand.type || 'sword') : 'sword';
    const skillLevel = g.skills[weaponType]?.level || 1;

    let horseAlive = false;
    let horseHp = 0;
    let horseMaxHp = 0;
    let horseDefensePercent = 0;
    let mounted = false;

    if (g.equipment && g.equipment.horse) {
        const horse = HORSE_TYPES[g.equipment.horse.horseType];
        if (horse) {
            horseAlive = true;
            horseHp = horse.hp;
            horseMaxHp = horse.hp;
            horseDefensePercent = horse.defensePercent || 0;
            mounted = true;
        }
    }

    battleState = {
        mob: mob,
        playerHp: g.hp,
        mobHp: mob.hp,
        maxPlayerHp: maxHp,
        turn: 'player',
        inProgress: true,
        defending: false,
        log: [],
        fleeAttempts: 0,
        weaponSkill: skillLevel,
        playerAgility: g.stats.agility || 1,
        playerDefense: g.stats.defense || 1,
        mobAgility: mob.agility || 1,
        mobLevel: mob.level || 1,
        lastActionTime: Date.now(),
        horseAlive: horseAlive,
        horseHp: horseHp,
        horseMaxHp: horseMaxHp,
        horseDefensePercent: horseDefensePercent,
        mounted: mounted,
        horseDismounted: false,
        isDrunkardFight: false,
        mobType: mob.type || 'animal',
        mobName: mob.name || 'Моб',
        mobRegion: mob.region || 'crownlands'
    };

    isBusy = true;
    document.getElementById('busy-status').classList.remove('hide');
    document.getElementById('busy-status').textContent = '⚔️ Бой с ' + mob.name + '!';
    updateActions();
    renderBattle();
    saveBattleState();
}

// ============================================================
// 3. ДЕЙСТВИЯ В БОЮ
// ============================================================
function battleAction(action) {
    if (!battleState || !battleState.inProgress) {
        setMessage('❌ Бой не активен.');
        return;
    }
    if (battleState.turn !== 'player') {
        setMessage('⏳ Сейчас ход противника. Подождите.');
        return;
    }

    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    const { mob, playerHp, mobHp, horseHp, horseAlive, mounted } = battleState;
    let newMobHp = mobHp;
    let newPlayerHp = playerHp;
    let newHorseHp = horseHp;
    let nextTurn = 'mob';
    let battleOver = false;

    // ---- ПОБЕГ ----
    if (action === 'battle_flee') {
        const fleeChance = 25 + Math.floor((g.stats.agility || 1) / 5);
        if (Math.random() * 100 < fleeChance) {
            battleState.log.push('🏃 Вы сбежали!');
            battleOver = true;
            endBattle(false, 'Побег');
            return;
        } else {
            battleState.log.push('🏃 Побег не удался! (' + fleeChance + '%)');
            battleState.turn = 'mob';
            renderBattle();
            saveBattleState();
            setTimeout(() => {
                if (battleState && battleState.inProgress) mobTurn();
            }, 4000);
            return;
        }
    }

    // ---- АТАКА ----
    if (action === 'battle_attack') {
        const totalStats = getTotalStats(g, battleState);
        const mobStats = { agility: mob.agility || 1, defense: mob.defense || 0 };
        const hitChance = getHitChance(totalStats, mobStats);

        if (Math.random() * 100 > hitChance) {
            battleState.log.push('💨 Вы промахнулись! (шанс: ' + hitChance + '%)');
            battleState.turn = 'mob';
            renderBattle();
            saveBattleState();
            setTimeout(() => {
                if (battleState && battleState.inProgress) mobTurn();
            }, 4000);
            return;
        }

        let damage = Math.max(1, totalStats.damage + Math.floor(Math.random() * 4) - mob.defense);
        
        // Критический удар
        if (Math.random() * 100 < totalStats.crit) {
            damage *= 2;
            battleState.log.push('💥 КРИТИЧЕСКИЙ УДАР!');
        }

        // Двойной удар
        if (Math.random() * 100 < totalStats.doubleHit) {
            const secondDamage = Math.max(1, Math.floor(damage * 0.6));
            newMobHp = Math.max(0, mobHp - damage - secondDamage);
            battleState.log.push('⚡ ДВОЙНОЙ УДАР! (+' + secondDamage + ' урона)');
        } else {
            newMobHp = Math.max(0, mobHp - damage);
        }

        battleState.log.push('⚔️ Вы нанесли ' + damage + ' урона.');

        // Пробитие
        if (Math.random() * 100 < totalStats.pierce) {
            const pierceDamage = Math.floor(damage * 0.3);
            newMobHp = Math.max(0, newMobHp - pierceDamage);
            battleState.log.push('🛡️ ПРОБИТИЕ! +' + pierceDamage + ' урона');
        }

        // Прокачка мастерства
        const weaponType = totalStats.weaponType;
        if (weaponType !== 'нет' && g.skills[weaponType]) {
            const xpGain = Math.round(1 * getXpMultiplier(g));
            g.skills[weaponType].xp = (g.skills[weaponType].xp || 0) + xpGain;
            const needed = g.skills[weaponType].level * 20 + 10;
            while (g.skills[weaponType].xp >= needed) {
                g.skills[weaponType].xp -= needed;
                g.skills[weaponType].level = Math.min(999, g.skills[weaponType].level + 1);
                setMessage('⚔️ Мастерство «' +
                    ({sword:'Мечи', spear:'Копья', axe:'Топоры', mace:'Булавы', bow:'Луки', crossbow:'Арбалеты', dagger:'Кинжалы', shield:'Щиты'}[weaponType] || weaponType) +
                    '» повышено до ' + g.skills[weaponType].level + '!');
            }
        }
    }

    // ---- ЗАЩИТА ----
    if (action === 'battle_defend') {
        battleState.defending = true;
        battleState.log.push('🛡️ Вы защищаетесь.');
    }

    // ---- УКЛОНЕНИЕ ----
    if (action === 'battle_dodge') {
        const totalStats = getTotalStats(g, battleState);
        const dodgeChance = calcChance(totalStats.agility);

        if (Math.random() * 100 < dodgeChance) {
            battleState.log.push('💨 Вы увернулись!');
            // Контратака
            if (Math.random() * 100 < totalStats.counter) {
                const counterDamage = Math.max(1, Math.round(totalStats.damage * 0.5));
                newMobHp = Math.max(0, mobHp - counterDamage);
                battleState.log.push('⚡ КОНТРАТАКА! Урон: ' + counterDamage);
                if (newMobHp <= 0) {
                    battleState.mobHp = newMobHp;
                    battleOver = true;
                    endBattle(true, 'Победа');
                    return;
                }
            }
            nextTurn = 'player';
        } else {
            battleState.log.push('💨 Уклонение не удалось!');
        }
    }

    // ---- ВЕРХОМ/ПЕШКОМ ----
    if (action === 'battle_mount') {
        if (battleState.horseAlive && battleState.horseHp > 0 && !battleState.mounted) {
            battleState.mounted = true;
            battleState.log.push('🐴 Вы сели на лошадь!');
            setMessage('🐴 Вы снова верхом!');
            renderBattle();
            saveBattleState();
            return;
        } else {
            setMessage('❌ Нельзя сесть на лошадь.');
            return;
        }
    }

    if (action === 'battle_dismount') {
        if (battleState.mounted) {
            battleState.mounted = false;
            battleState.log.push('🐴 Вы слезли с лошади.');
            setMessage('🐴 Вы слезли с лошади.');
            renderBattle();
            saveBattleState();
            return;
        } else {
            setMessage('❌ Вы уже пешком.');
            return;
        }
    }

    // ---- ПРОВЕРКА ПОБЕДЫ ----
    if (!battleOver && action !== 'battle_flee') {
        battleState.mobHp = newMobHp;
        battleState.playerHp = newPlayerHp;
        battleState.horseHp = newHorseHp;

        if (newMobHp <= 0) {
            battleOver = true;
            endBattle(true, 'Победа');
            return;
        }

        if (nextTurn === 'mob') {
            battleState.turn = 'mob';
            renderBattle();
            saveBattleState();
            setTimeout(() => {
                if (battleState && battleState.inProgress) mobTurn();
            }, 4000);
            return;
        }
    }

    if (!battleOver) {
        battleState.turn = nextTurn;
        battleState.mobHp = newMobHp;
        battleState.playerHp = newPlayerHp;
        battleState.horseHp = newHorseHp;
        renderBattle();
        saveBattleState();
    }
}

// ============================================================
// 4. ХОД МОБА
// ============================================================
function mobTurn() {
    if (!battleState || !battleState.inProgress) {
        battleState = null;
        localStorage.removeItem('got_battle');
        return;
    }

    const user = users[currentUser];
    if (!user) {
        battleState = null;
        localStorage.removeItem('got_battle');
        return;
    }

    const g = user.game;
    const { mob, playerHp, horseAlive, horseHp, horseMaxHp, mounted } = battleState;
    const totalStats = getTotalStats(g, battleState);
    const dodgeChance = calcChance(totalStats.agility);

    // Уворот игрока
    if (Math.random() * 100 < dodgeChance) {
        battleState.log.push('💨 Вы увернулись от атаки!');
        // Контратака
        if (Math.random() * 100 < totalStats.counter) {
            const counterDamage = Math.max(1, Math.round(totalStats.damage * 0.5));
            battleState.mobHp = Math.max(0, battleState.mobHp - counterDamage);
            battleState.log.push('⚡ КОНТРАТАКА! Урон: ' + counterDamage);
            if (battleState.mobHp <= 0) {
                battleState.inProgress = false;
                endBattle(true, 'Победа');
                return;
            }
        }
        battleState.turn = 'player';
        renderBattle();
        saveBattleState();
        return;
    }

    // Расчёт урона моба
    let damage = mob.damage + Math.floor(Math.random() * 3);
    
    // Защита
    if (battleState.defending) {
        const defenseBonus = totalStats.defense * 1.5;
        const reduction = calcDamageReduction(defenseBonus);
        damage = Math.round(damage * (1 - reduction / 100));
        battleState.log.push('🛡️ Вы заблокировали удар!');
        battleState.defending = false;
    } else {
        const reduction = calcDamageReduction(totalStats.defense);
        damage = Math.round(damage * (1 - reduction / 100));
    }

    // Урон по лошади
    let newHorseHp = battleState.horseHp;
    if (battleState.mounted && battleState.horseAlive && battleState.horseHp > 0) {
        const horseDamage = Math.floor(damage * 0.3);
        newHorseHp = Math.max(0, battleState.horseHp - horseDamage);
        damage = Math.floor(damage * 0.7);
        battleState.log.push('🐴 Лошадь получила ' + horseDamage + ' урона (HP: ' + newHorseHp + '/' + battleState.horseMaxHp + ')');
        if (newHorseHp <= 0) {
            battleState.horseAlive = false;
            battleState.mounted = false;
            battleState.horseDefensePercent = 0;
            battleState.log.push('💀 Ваша лошадь пала в бою!');
            setMessage('💀 Ваша лошадь пала в бою!');
        }
        battleState.horseHp = newHorseHp;
    }

    damage = Math.max(1, damage);
    const newPlayerHp = Math.max(0, playerHp - damage);
    battleState.log.push('🐺 ' + mob.name + ' нанёс ' + damage + ' урона');
    battleState.playerHp = newPlayerHp;

    if (newPlayerHp <= 0) {
        battleState.inProgress = false;
        endBattle(false, 'Смерть');
        return;
    }

    battleState.turn = 'player';
    renderBattle();
    saveBattleState();
}

// ============================================================
// 5. ГЕНЕРАЦИЯ ДРОПА
// ============================================================
function generateDrop(mob) {
    const user = users[currentUser];
    if (!user) return null;
    const g = user.game;

    // 1. Проверяем, уронит ли моб вообще что-то
    if (Math.random() * 100 > DROP_CHANCES.baseDropChance) {
        return null;
    }

    const levelBonus = DROP_CHANCES.rarityMultiplier(mob.level);
    const drops = [];
    const mobType = mob.type || 'animal';
    const dropData = MOB_DROPS[mobType];

    if (!dropData) return null;

    // 2. Золото
    if (dropData.gold) {
        const min = dropData.gold.minAmount ? dropData.gold.minAmount(mob.level) : mob.level * 2;
        const max = dropData.gold.maxAmount ? dropData.gold.maxAmount(mob.level) : mob.level * 5;
        const amount = Math.floor((min + Math.random() * (max - min)) * levelBonus);
        drops.push({ type: 'gold', amount: Math.max(1, amount) });
    }

    // 3. Оружие
    if (dropData.weapon && Math.random() * 100 < dropData.weapon.chance) {
        const item = generateWeaponDrop(mob, dropData.weapon);
        if (item) drops.push({ type: 'item', item: item });
    }

    // 4. Броня
    if (dropData.armor && Math.random() * 100 < dropData.armor.chance) {
        const item = generateArmorDrop(mob, dropData.armor);
        if (item) drops.push({ type: 'item', item: item });
    }

    // 5. Ресурсы
    if (dropData.resource && Math.random() * 100 < dropData.resource.chance) {
        const resource = generateResourceDrop(mob);
        if (resource) drops.push({ type: 'resource', item: resource });
    }

    // 6. Редкий дроп
    if (dropData.rare && Math.random() * 100 < dropData.rare.chance) {
        const rare = dropData.rare.items[Math.floor(Math.random() * dropData.rare.items.length)];
        if (rare) drops.push({ type: 'rare', item: rare });
    }

    return drops.length > 0 ? drops : null;
}

// ---- ГЕНЕРАЦИЯ ОРУЖИЯ ----
function generateWeaponDrop(mob, weaponData) {
    const type = weaponData.types[Math.floor(Math.random() * weaponData.types.length)];
    const available = ALL_ITEMS.weapons[type].filter(w => w.level <= mob.level + 2);
    if (available.length === 0) return null;

    const baseItem = available[Math.floor(Math.random() * available.length)];
    const qualities = weaponData.qualityByLevel ? weaponData.qualityByLevel(mob.level) : ['Обычное', 'Хорошее'];
    const quality = qualities[Math.floor(Math.random() * qualities.length)];
    const q = QUALITIES[quality] || QUALITIES['Обычное'];

    return {
        name: baseItem.name,
        type: type,
        level: baseItem.level,
        quality: quality,
        baseDamage: baseItem.baseDamage || 0,
        finalDamage: baseItem.baseDamage ? Math.round(baseItem.baseDamage * q.multiplier) : 0,
        defense: baseItem.defense || 0,
        finalDefense: baseItem.defense ? Math.round(baseItem.defense * q.multiplier) : 0
    };
}

// ---- ГЕНЕРАЦИЯ БРОНИ ----
function generateArmorDrop(mob, armorData) {
    const armorClass = armorData.types[Math.floor(Math.random() * armorData.types.length)];
    const slot = armorData.slots[Math.floor(Math.random() * armorData.slots.length)];
    const available = ALL_ITEMS[armorClass][slot].filter(a => a.level <= mob.level + 2);
    if (available.length === 0) return null;

    const baseItem = available[Math.floor(Math.random() * available.length)];
    const qualities = armorData.qualityByLevel ? armorData.qualityByLevel(mob.level) : ['Обычное', 'Хорошее'];
    const quality = qualities[Math.floor(Math.random() * qualities.length)];
    const q = QUALITIES[quality] || QUALITIES['Обычное'];

    const item = {
        name: baseItem.name,
        type: slot,
        level: baseItem.level,
        quality: quality,
        armorClass: armorClass,
        baseDefense: baseItem.baseDefense || 0,
        finalDefense: baseItem.baseDefense ? Math.round(baseItem.baseDefense * q.multiplier) : 0
    };
    if (baseItem.speedPercent) item.speedPercent = baseItem.speedPercent;
    return item;
}

// ---- ГЕНЕРАЦИЯ РЕСУРСА ----
function generateResourceDrop(mob) {
    const region = mob.region || 'crownlands';
    const regionResources = REGION_RESOURCES[region] || COMMON_RESOURCES;
    const res = regionResources[Math.floor(Math.random() * regionResources.length)];
    const count = 1 + Math.floor(Math.random() * 3) + Math.floor(mob.level / 20);

    return {
        name: res.name,
        quality: 'Обычное',
        type: 'resource',
        resourceType: res.resourceType,
        count: count
    };
}

// ============================================================
// 6. ОКОНЧАНИЕ БОЯ
// ============================================================
function endBattle(won, reason) {
    if (!battleState) return;
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;
    const { mob, isDrunkardFight, mobType, mobName, mobLevel, mobRegion } = battleState;

    // Восстанавливаем HP
    g.hp = battleState.playerHp;
    if (g.hp > g.maxHp) g.hp = g.maxHp;

    // Восстанавливаем лошадь
    if (g.equipment && g.equipment.horse) {
        const horse = g.equipment.horse;
        if (battleState.horseAlive && battleState.horseHp > 0) {
            horse.hp = horse.maxHp || 100;
            if (battleState.horseHp < horse.maxHp) {
                setMessage('🐴 Ваша лошадь восстановила силы после боя.');
            }
        } else if (battleState.horseHp <= 0) {
            g.equipment.horse = null;
            setMessage('💀 Ваша лошадь погибла в бою.');
            addLog('💀 ' + currentUser + ' потерял лошадь в бою');
        }
    }

    // ---- ДРАКА С ПЬЯНЧУГОЙ ----
    if (isDrunkardFight) {
        if (won) {
            const copperReward = 3 + Math.floor(Math.random() * 6);
            g.copper += copperReward;
            convertCurrency(g);
            setMessage('🍺 Вы побили пьянчугу! +' + copperReward + ' МП.');
            addLog('🍺 ' + currentUser + ' побил пьянчугу (+' + copperReward + ' МП)');
            if (Math.random() * 100 < 10) {
                enterJail();
            }
        } else {
            if (reason === 'Смерть') {
                setMessage('💀 Вас побил пьянчуга... Вы возродились в таверне.');
                g.hp = g.maxHp;
                g.location.place = 'Таверна';
                g.location.location = 'Королевская Гавань';
                g.food = 100;
                g.thirst = 100;
                g.fatigue = 100;
                g.outside = false;
                addLog('💀 ' + currentUser + ' убит пьянчугой в Квартале бедноты');
            } else {
                setMessage('❌ Вы сбежали от пьянчуги.');
            }
        }
        battleState.inProgress = false;
        battleState = null;
        isBusy = false;
        document.getElementById('busy-status').classList.add('hide');
        localStorage.removeItem('got_battle');
        updateMenu();
        updateActions();
        saveData();
        return;
    }

    // ---- ПОБЕДА ----
    if (won) {
        let xpMultiplier = getXpMultiplier(g);
        if (g.blessing && g.blessing.active && g.blessing.expires > Date.now()) {
            xpMultiplier *= 1.1;
        }
        const xpGain = Math.round((mob.xp + Math.floor(Math.random() * 5)) * xpMultiplier);
        g.xp += xpGain;

        // Проверка уровня
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
        }

        // Выносливость
        g.stamina.xp = (g.stamina.xp || 0) + Math.round(1 * getXpMultiplier(g));
        const staminaNeeded = g.stamina.level * 8 + 3;
        while (g.stamina.xp >= staminaNeeded) {
            g.stamina.xp -= staminaNeeded;
            g.stamina.level = Math.min(333, g.stamina.level + 1);
            g.maxHp = getMaxHp(g);
            g.hp = Math.min(g.hp + 5, g.maxHp);
            setMessage('💪 Выносливость повышена до ' + g.stamina.level + ' уровня! (+5 HP)');
        }

        // ---- ДРОП С ЖИВОТНЫХ (шкуры и мясо) ----
        if (mobType === 'animal') {
            const skinQuality = rollSkinQuality(mob.level);
            const hunterBonus = Math.floor((g.professions['Охотник'] || 1) / 10);
            const skinCount = getSkinCount(mob.level) + hunterBonus;
            const meatCount = getMeatCount(mob.level);

            for (let i = 0; i < skinCount; i++) {
                addToInventory(g, {
                    name: 'Шкура',
                    quality: skinQuality,
                    type: 'resource',
                    resourceType: 'leather',
                    count: 1
                });
            }

            for (let i = 0; i < meatCount; i++) {
                addToInventory(g, {
                    name: '🥩 Мясо',
                    quality: 'Обычное',
                    type: 'food',
                    effect: { type: 'food', value: 30 },
                    count: 1
                });
            }

            setMessage('🧵 Добыто: Шкура ×' + skinCount + ' (' + skinQuality + ')\n🍖 Добыто: Мясо ×' + meatCount);

            g.professionXp['Охотник'] = (g.professionXp['Охотник'] || 0) + Math.round(3 * getXpMultiplier(g));
            while (g.professionXp['Охотник'] >= g.professions['Охотник'] * 10) {
                g.professionXp['Охотник'] -= g.professions['Охотник'] * 10;
                g.professions['Охотник']++;
                setMessage('👷 Охотник повышен до ' + g.professions['Охотник'] + ' уровня!');
            }
        }

        // ---- ДРОП С ЛЮДЕЙ ----
        if (mobType === 'human' || mobType === 'guard' || mobType === 'wildling') {
            const coins = (mob.level * 3) + Math.floor(Math.random() * (mob.level * 3));
            g.copper += coins;
            convertCurrency(g);
            setMessage('💰 Вы нашли ' + coins + ' МП у ' + mob.name + ' (ур. ' + mob.level + ')');
        }

        // ---- ОСНОВНОЙ ДРОП (из drop.js) ----
        const drops = generateDrop(mob);
        if (drops) {
            drops.forEach(drop => {
                if (drop.type === 'gold') {
                    g.copper += drop.amount;
                    convertCurrency(g);
                    setMessage('💰 Вы нашли ' + drop.amount + ' монет.');
                } else if (drop.type === 'item' && drop.item) {
                    addToInventory(g, drop.item);
                    setMessage('⚔️ Вы нашли ' + drop.item.name + ' (' + drop.item.quality + ')');
                } else if (drop.type === 'resource' && drop.item) {
                    addToInventory(g, drop.item);
                    setMessage('📦 Вы нашли ' + drop.item.name + ' ×' + (drop.item.count || 1));
                } else if (drop.type === 'rare' && drop.item) {
                    addToInventory(g, drop.item);
                    setMessage('💎 Вы нашли РЕДКИЙ предмет: ' + drop.item.name + '!');
                }
            });
            addLog('🎁 ' + currentUser + ' получил дроп с ' + mobName);
        }

        addLog('⚔️ ' + currentUser + ' победил ' + mob.name + ' (ур. ' + mob.level + ')');

    // ---- СМЕРТЬ ----
    } else {
        if (reason === 'Смерть') {
            setMessage('💀 Вас убил ' + mob.name + '. Вы возродились в таверне.');
            g.hp = g.maxHp;
            g.location.place = 'Таверна';
            g.location.location = 'Королевская Гавань';
            g.food = 100;
            g.thirst = 100;
            g.fatigue = 100;
            g.outside = false;
            addLog('💀 ' + currentUser + ' убит ' + mob.name + ' (ур. ' + mob.level + ')');
        } else {
            setMessage('❌ Бой закончился: ' + reason);
        }
    }

    // ---- ОЧИСТКА ----
    battleState.inProgress = false;
    battleState = null;
    isBusy = false;
    document.getElementById('busy-status').classList.add('hide');
    localStorage.removeItem('got_battle');
    updateMenu();
    updateActions();
    saveData();
}

// ============================================================
// 7. ОТОБРАЖЕНИЕ БОЯ
// ============================================================
function renderBattle() {
    if (!battleState || !battleState.inProgress) return;
    const { mob, playerHp, mobHp, maxPlayerHp, turn, log, mobLevel, horseAlive, horseHp, horseMaxHp, mounted, mobName } = battleState;

    const mobHpPercent = Math.max(0, (mobHp / mob.hp) * 100);
    const playerHpPercent = Math.max(0, (playerHp / maxPlayerHp) * 100);

    let msg = '⚔️ БОЙ С ' + mobName.toUpperCase() + ' (уровень ' + mobLevel + ')\n\n';
    msg += '🐺 ' + mobName + ' (ур. ' + mobLevel + ')\n';
    msg += 'HP: ' + Math.max(0, mobHp) + '/' + mob.hp + '\n';
    msg += '█'.repeat(Math.floor(mobHpPercent / 5)) + '░'.repeat(20 - Math.floor(mobHpPercent / 5)) + '\n\n';
    msg += '❤️ Вы\n';
    msg += 'HP: ' + Math.max(0, playerHp) + '/' + maxPlayerHp + '\n';
    msg += '█'.repeat(Math.floor(playerHpPercent / 5)) + '░'.repeat(20 - Math.floor(playerHpPercent / 5)) + '\n\n';
    
    if (horseAlive && horseHp > 0) {
        msg += '🐴 Лошадь (HP: ' + Math.max(0, horseHp) + '/' + horseMaxHp + ')\n';
        msg += '█'.repeat(Math.floor((horseHp / horseMaxHp) * 20)) + '░'.repeat(20 - Math.floor((horseHp / horseMaxHp) * 20)) + '\n';
        msg += '📌 ' + (mounted ? '🐴 Верхом' : '🚶 Пешком') + '\n';
    }
    msg += '\n🔄 Ход: ' + (turn === 'player' ? 'ВАШ' : mobName.toUpperCase());
    if (turn === 'mob') msg += ' (⏳ 4 сек)';

    if (log.length > 0) {
        msg += '\n\n📋 Лог боя:\n';
        log.slice(-5).forEach(entry => {
            msg += '• ' + entry + '\n';
        });
    }

    setMessage(msg);
    updateActions();
    updateMenu();
    saveBattleState();
}

// ============================================================
// 8. ПОИСК И ДРАКА С ПЬЯНЧУГОЙ
// ============================================================
function findDrunkard() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

    const drunkards = [
        { name: 'Пьяный рыбак', hp: 15, damage: 2, defense: 0, xp: 2, level: 1, emoji: '🎣', agility: 2, type: 'human' },
        { name: 'Пьяный грузчик', hp: 20, damage: 3, defense: 1, xp: 3, level: 2, emoji: '📦', agility: 2, type: 'human' },
        { name: 'Пьяный матрос', hp: 25, damage: 4, defense: 1, xp: 4, level: 3, emoji: '⛵', agility: 3, type: 'human' },
        { name: 'Пьяный стражник', hp: 30, damage: 5, defense: 2, xp: 5, level: 4, emoji: '🛡️', agility: 3, type: 'human' }
    ];

    const drunkard = drunkards[Math.floor(Math.random() * drunkards.length)];
    setMessage('🍺 Вы нашли ' + drunkard.name + '! Он явно пьян и ищет драки.');
    addLog('🍺 ' + currentUser + ' встретил ' + drunkard.name + ' в Квартале бедноты');
    startDrunkardFight(drunkard);
}

function startDrunkardFight(drunkard) {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

    const maxHp = getMaxHp(g);
    g.maxHp = maxHp;
    if (g.hp === undefined || g.hp > maxHp) g.hp = maxHp;

    battleState = {
        mob: drunkard,
        playerHp: g.hp,
        mobHp: drunkard.hp,
        maxPlayerHp: maxHp,
        turn: 'player',
        inProgress: true,
        defending: false,
        log: [],
        fleeAttempts: 0,
        weaponSkill: 1,
        playerAgility: g.stats.agility || 1,
        playerDefense: g.stats.defense || 1,
        mobAgility: 1,
        mobLevel: drunkard.level || 1,
        lastActionTime: Date.now(),
        isDrunkardFight: true,
        horseAlive: false,
        horseHp: 0,
        horseMaxHp: 0,
        horseDefensePercent: 0,
        mounted: false,
        horseDismounted: false,
        mobType: 'human',
        mobName: drunkard.name,
        mobRegion: 'crownlands'
    };

    isBusy = true;
    document.getElementById('busy-status').classList.remove('hide');
    document.getElementById('busy-status').textContent = '🍺 Драка с ' + drunkard.name + '!';
    updateActions();
    renderBattle();
    saveBattleState();
}

// ============================================================
// 9. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ДРОПА (животные)
// ============================================================
function rollSkinQuality(level) {
    const r = Math.random() * 100;
    if (level >= 50 && r < 5) return 'Мастерское';
    if (level >= 40 && r < 10) return 'Качественное';
    if (level >= 30 && r < 15) return 'Хорошее';
    if (level >= 20 && r < 25) return 'Хорошее';
    if (level >= 10 && r < 40) return 'Обычное';
    if (r < 60) return 'Плохое';
    return 'Рваное';
}

function getSkinCount(level) {
    if (level >= 50) return 5 + Math.floor(Math.random() * 4);
    if (level >= 40) return 4 + Math.floor(Math.random() * 3);
    if (level >= 30) return 3 + Math.floor(Math.random() * 3);
    if (level >= 20) return 2 + Math.floor(Math.random() * 3);
    if (level >= 10) return 2 + Math.floor(Math.random() * 2);
    if (level >= 5) return 1 + Math.floor(Math.random() * 2);
    return 1;
}

function getMeatCount(level) {
    if (level >= 50) return 4 + Math.floor(Math.random() * 3);
    if (level >= 30) return 3 + Math.floor(Math.random() * 3);
    if (level >= 15) return 2 + Math.floor(Math.random() * 3);
    if (level >= 5) return 1 + Math.floor(Math.random() * 2);
    return 1;
}
