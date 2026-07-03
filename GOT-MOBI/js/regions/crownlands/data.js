// ============================================================
// КОРОЛЕВСКИЕ ЗЕМЛИ (Crownlands) - данные региона
// ============================================================

export const CROWNLANDS = {
    id: 'crownlands',
    name: 'Королевские земли',
    type: 'crownlands',
    capital: 'Королевская Гавань',
    description: 'Земли, находящиеся под прямым управлением Железного Трона. Здесь находится столица Семи Королевств — Королевская Гавань.',
    emoji: '👑',
    color: '#c9b694',
    
    // Соседние регионы (для перемещения)
    neighbors: ['riverlands', 'stormlands', 'reach'],
    
    // Основные локации региона
    locations: {
        'kings_landing': {
            id: 'kings_landing',
            name: 'Королевская Гавань',
            type: 'capital',
            description: 'Столица Семи Королевств. Город королей, интриг и торговли.',
            emoji: '🏰',
            travelTime: 1,
            buildings: ['tavern', 'market', 'forge', 'weapons_shop', 'leather_shop', 'armorer', 'carpenter', 'stable', 'guild', 'magistrate', 'gates', 'noble_quarter', 'trade_quarter', 'poor_quarter', 'home', 'great_sept', 'port', 'prison', 'library', 'mercenary_guild', 'brothel', 'red_keep_gate', 'red_keep']
        },
        'road': {
            id: 'road',
            name: 'Дорога',
            type: 'road',
            description: 'Дорога, ведущая из Королевской Гавани в другие земли.',
            emoji: '🛤️',
            travelTime: 5,
            buildings: []
        }
    }
};

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ДАННЫЕ ДЛЯ РЕГИОНА
// ============================================================

// Уровни опасности для разных зон
export const DANGER_LEVELS = {
    'kings_landing': 1,
    'road': 5
};

// Ресурсы, которые можно добыть в регионе
export const REGION_RESOURCES = {
    'kings_landing': ['wood', 'leather', 'food'],
    'road': ['wood', 'leather', 'iron', 'food']
};

// Мобы, которые водятся в регионе
export const REGION_MOBS = {
    'kings_landing': ['rat', 'vagabond', 'dog'],
    'road': ['wolf', 'bandit', 'brigand']
};
