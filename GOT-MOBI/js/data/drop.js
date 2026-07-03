// ============================================================
// ДАННЫЕ О ДРОПЕ (drop.js)
// ============================================================

// ============================================================
// 1. БАЗОВЫЕ ШАНСЫ
// ============================================================
export const DROP_CHANCES = {
    // Шанс, что моб вообще что-то уронит (в процентах)
    baseDropChance: 60,

    // Шанс выпадения разных типов предметов (в процентах)
    itemTypeChances: {
        gold: 40,      // 40% что уронит золото
        item: 35,      // 35% что уронит предмет
        resource: 15,  // 15% что уронит ресурс
        rare: 10       // 10% что уронит редкий предмет
    },

    // Множитель редкости в зависимости от уровня моба
    rarityMultiplier: function(level) {
        if (level >= 80) return 3.0;
        if (level >= 60) return 2.0;
        if (level >= 40) return 1.5;
        if (level >= 20) return 1.2;
        return 1.0;
    }
};

// ============================================================
// 2. ЧТО ПАДАЕТ С КАЖДОГО ТИПА МОБА
// ============================================================
export const MOB_DROPS = {
    // ---- ЖИВОТНЫЕ ----
    animal: {
        // Шкуры (всегда)
        skin: {
            chance: 100,
            minCount: 1,
            maxCount: 5,
            qualityByLevel: function(level) {
                if (level >= 50) return ['Рваное', 'Плохое', 'Обычное', 'Хорошее', 'Качественное', 'Мастерское'];
                if (level >= 30) return ['Рваное', 'Плохое', 'Обычное', 'Хорошее', 'Качественное'];
                if (level >= 15) return ['Рваное', 'Плохое', 'Обычное', 'Хорошее'];
                if (level >= 5) return ['Рваное', 'Плохое', 'Обычное'];
                return ['Рваное', 'Плохое'];
            }
        },
        // Мясо (всегда)
        meat: {
            chance: 100,
            minCount: 1,
            maxCount: 4
        },
        // Редкий дроп с животных
        rare: {
            chance: 5,
            items: [
                { name: 'Волчий клык', quality: 'Хорошее', price: 50 },
                { name: 'Медвежья лапа', quality: 'Качественное', price: 80 },
                { name: 'Олений рог', quality: 'Обычное', price: 30 },
                { name: 'Лисья кисточка', quality: 'Хорошее', price: 40 }
            ]
        }
    },

    // ---- ЛЮДИ (БАНДИТЫ, РАЗБОЙНИКИ, НАЁМНИКИ) ----
    human: {
        // Золото (всегда)
        gold: {
            chance: 100,
            minAmount: function(level) { return level * 2; },
            maxAmount: function(level) { return level * 5; }
        },
        // Оружие
        weapon: {
            chance: 30,
            types: ['sword', 'dagger', 'axe', 'mace'],
            qualityByLevel: function(level) {
                if (level >= 40) return ['Обычное', 'Хорошее', 'Качественное', 'Мастерское'];
                if (level >= 20) return ['Плохое', 'Обычное', 'Хорошее', 'Качественное'];
                return ['Плохое', 'Обычное', 'Хорошее'];
            }
        },
        // Броня
        armor: {
            chance: 20,
            types: ['leather', 'plate'],
            slots: ['helmet', 'chestplate', 'boots', 'gloves'],
            qualityByLevel: function(level) {
                if (level >= 40) return ['Обычное', 'Хорошее', 'Качественное'];
                if (level >= 20) return ['Плохое', 'Обычное', 'Хорошее'];
                return ['Плохое', 'Обычное'];
            }
        },
        // Ресурсы
        resource: {
            chance: 15,
            items: [
                { name: 'Старый меч', resourceType: 'iron', count: 1 },
                { name: 'Кожаный лоскут', resourceType: 'leather', count: 2 },
                { name: 'Древесина', resourceType: 'wood', count: 3 }
            ]
        },
        // Редкий дроп
        rare: {
            chance: 5,
            items: [
                { name: 'Письмо с секретами', quality: 'Мастерское', price: 200 },
                { name: 'Ключ от темницы', quality: 'Хорошее', price: 100 },
                { name: 'Старая карта', quality: 'Качественное', price: 150 }
            ]
        }
    },

    // ---- СТРАЖА ----
    guard: {
        gold: {
            chance: 100,
            minAmount: function(level) { return level * 3; },
            maxAmount: function(level) { return level * 6; }
        },
        weapon: {
            chance: 40,
            types: ['sword', 'spear', 'shield'],
            qualityByLevel: function(level) {
                if (level >= 30) return ['Обычное', 'Хорошее', 'Качественное'];
                return ['Плохое', 'Обычное', 'Хорошее'];
            }
        },
        armor: {
            chance: 30,
            types: ['plate'],
            slots: ['helmet', 'chestplate', 'boots'],
            qualityByLevel: function(level) {
                if (level >= 30) return ['Обычное', 'Хорошее', 'Качественное'];
                return ['Плохое', 'Обычное', 'Хорошее'];
            }
        },
        rare: {
            chance: 3,
            items: [
                { name: 'Значок стражи', quality: 'Хорошее', price: 80 },
                { name: 'Свиток с приказом', quality: 'Качественное', price: 120 }
            ]
        }
    },

    // ---- ДИКАРИ ----
    wildling: {
        gold: {
            chance: 80,
            minAmount: function(level) { return level * 1; },
            maxAmount: function(level) { return level * 3; }
        },
        weapon: {
            chance: 25,
            types: ['axe', 'spear', 'dagger'],
            qualityByLevel: function(level) {
                if (level >= 30) return ['Плохое', 'Обычное', 'Хорошее'];
                return ['Рваное', 'Плохое', 'Обычное'];
            }
        },
        resource: {
            chance: 20,
            items: [
                { name: 'Шкура', resourceType: 'leather', count: 2 },
                { name: 'Древесина', resourceType: 'wood', count: 3 },
                { name: 'Кость', resourceType: 'bone', count: 2 }
            ]
        },
        rare: {
            chance: 3,
            items: [
                { name: 'Руна дикарей', quality: 'Мастерское', price: 180 },
                { name: 'Древний амулет', quality: 'Хорошее', price: 90 }
            ]
        }
    },

    // ---- БОССЫ ----
    boss: {
        gold: {
            chance: 100,
            minAmount: function(level) { return level * 10; },
            maxAmount: function(level) { return level * 20; }
        },
        weapon: {
            chance: 60,
            types: ['sword', 'axe', 'mace', 'spear'],
            qualityByLevel: function(level) {
                if (level >= 50) return ['Хорошее', 'Качественное', 'Мастерское', 'Легендарное'];
                if (level >= 30) return ['Обычное', 'Хорошее', 'Качественное', 'Мастерское'];
                return ['Плохое', 'Обычное', 'Хорошее', 'Качественное'];
            }
        },
        armor: {
            chance: 50,
            types: ['leather', 'plate'],
            slots: ['helmet', 'chestplate', 'shoulders', 'leggings', 'boots', 'gloves'],
            qualityByLevel: function(level) {
                if (level >= 50) return ['Хорошее', 'Качественное', 'Мастерское', 'Легендарное'];
                if (level >= 30) return ['Обычное', 'Хорошее', 'Качественное', 'Мастерское'];
                return ['Плохое', 'Обычное', 'Хорошее', 'Качественное'];
            }
        },
        rare: {
            chance: 20,
            items: [
                { name: 'Корона бандитов', quality: 'Мастерское', price: 500 },
                { name: 'Древний артефакт', quality: 'Легендарное', price: 1000 },
                { name: 'Ключ от сокровищницы', quality: 'Качественное', price: 300 }
            ]
        }
    }
};

// ============================================================
// 3. РЕГИОНАЛЬНЫЕ РЕСУРСЫ
// ============================================================
export const REGION_RESOURCES = {
    north: [
        { name: 'Шкура', resourceType: 'leather', basePrice: 6 },
        { name: 'Древесина', resourceType: 'wood', basePrice: 4 },
        { name: 'Железная руда', resourceType: 'iron', basePrice: 8 }
    ],
    westlands: [
        { name: 'Золотая руда', resourceType: 'gold_ore', basePrice: 15 },
        { name: 'Железная руда', resourceType: 'iron', basePrice: 8 },
        { name: 'Уголь', resourceType: 'coal', basePrice: 3 }
    ],
    crownlands: [
        { name: 'Кожа', resourceType: 'leather', basePrice: 5 },
        { name: 'Уголь', resourceType: 'coal', basePrice: 3 },
        { name: 'Древесина', resourceType: 'wood', basePrice: 4 }
    ],
    reach: [
        { name: 'Древесина', resourceType: 'wood', basePrice: 4 },
        { name: 'Вино', resourceType: 'wine', basePrice: 10 },
        { name: 'Золото', resourceType: 'gold_ore', basePrice: 12 }
    ],
    riverlands: [
        { name: 'Рыба', resourceType: 'fish', basePrice: 5 },
        { name: 'Глина', resourceType: 'clay', basePrice: 3 },
        { name: 'Древесина', resourceType: 'wood', basePrice: 4 }
    ],
    stormlands: [
        { name: 'Железо', resourceType: 'iron', basePrice: 7 },
        { name: 'Древесина', resourceType: 'wood', basePrice: 4 },
        { name: 'Камень', resourceType: 'stone', basePrice: 5 }
    ],
    dorne: [
        { name: 'Песчаный камень', resourceType: 'stone', basePrice: 6 },
        { name: 'Экзотические фрукты', resourceType: 'fruit', basePrice: 8 },
        { name: 'Золото', resourceType: 'gold_ore', basePrice: 14 }
    ],
    vale: [
        { name: 'Мрамор', resourceType: 'stone', basePrice: 10 },
        { name: 'Шерсть', resourceType: 'wool', basePrice: 5 },
        { name: 'Железо', resourceType: 'iron', basePrice: 8 }
    ],
    iron_islands: [
        { name: 'Железо', resourceType: 'iron', basePrice: 8 },
        { name: 'Рыба', resourceType: 'fish', basePrice: 6 },
        { name: 'Древесина', resourceType: 'wood', basePrice: 5 }
    ]
};

// ============================================================
// 4. ОБЩИЕ РЕСУРСЫ (если регион не определён)
// ============================================================
export const COMMON_RESOURCES = [
    { name: 'Дерево', resourceType: 'wood', basePrice: 3 },
    { name: 'Руда железная', resourceType: 'iron', basePrice: 5 },
    { name: 'Кожа', resourceType: 'leather', basePrice: 4 },
    { name: 'Уголь', resourceType: 'coal', basePrice: 2 },
    { name: 'Сталь', resourceType: 'steel', basePrice: 20 }
];

// ============================================================
// 5. РЕДКИЙ ДРОП (ОБЩИЙ)
// ============================================================
export const RARE_ITEMS = [
    { id: 'ancient_amulet', name: 'Древний амулет', type: 'accessory', quality: 'Мастерское', bonus: { reputation: 5 }, price: 200 },
    { id: 'gold_ingot', name: 'Золотой слиток', type: 'resource', resourceType: 'gold_ore', count: 5, quality: 'Качественное', price: 250 },
    { id: 'gem', name: 'Драгоценный камень', type: 'resource', resourceType: 'gem', count: 1, quality: 'Легендарное', price: 500 },
    { id: 'royal_seal', name: 'Королевская печать', type: 'accessory', quality: 'Легендарное', bonus: { reputation: 20 }, price: 600 },
    { id: 'old_scroll', name: 'Старый свиток', type: 'scroll', quality: 'Мастерское', effect: 'intelligence+2', price: 300 }
];
