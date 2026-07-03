// ============================================================
// КОНСТАНТЫ (js/core/config.js)
// ============================================================

export const QUALITIES = {
    'Рваное': { color: '#666', short: 'рван.', multiplier: 0.4, emoji: '🟫' },
    'Плохое': { color: '#999', short: 'плох.', multiplier: 0.6, emoji: '⚪' },
    'Обычное': { color: '#ccc', short: 'обыч.', multiplier: 1.0, emoji: '⬜' },
    'Хорошее': { color: '#8bc34a', short: 'хор.', multiplier: 1.3, emoji: '🟩' },
    'Качественное': { color: '#2196f3', short: 'кач.', multiplier: 1.7, emoji: '🟦' },
    'Мастерское': { color: '#9c27b0', short: 'маст.', multiplier: 2.2, emoji: '🟪' },
    'Легендарное': { color: '#ff9800', short: 'легенд.', multiplier: 2.8, emoji: '🟧' },
    'Мифическое': { color: '#ffd700', short: 'миф.', multiplier: 3.5, emoji: '🌟' }
};

export const NATIONALITIES = {
    'Северные земли': { strength:10, cunning:0, defense:5, diplomacy:0 },
    'Речные земли': { strength:0, cunning:10, defense:0, diplomacy:5 },
    'Долина': { strength:0, cunning:0, defense:10, diplomacy:5 },
    'Западные земли': { strength:0, cunning:5, defense:0, diplomacy:10 },
    'Простор': { strength:0, cunning:0, defense:0, diplomacy:10 },
    'Штормовые земли': { strength:10, cunning:5, defense:0, diplomacy:0 },
    'Дорн': { strength:0, cunning:10, defense:5, diplomacy:0 }
};

export const BUILDINGS = [
    { id:'Таверна', label:'🍺 Таверна' },
    { id:'Рынок', label:'🏪 Рынок' },
    { id:'Кузница', label:'⚒️ Кузница' },
    { id:'Оружейная лавка', label:'🗡️ Оружейная лавка' },
    { id:'Кожевник', label:'🪡 Кожевник' },
    { id:'Бронник', label:'🛡️ Бронник' },
    { id:'Плотник', label:'🪵 Плотник' },
    { id:'Конюшня', label:'🐴 Конюшня' },
    { id:'Гильдия торговцев', label:'🏛️ Гильдия торговцев' },
    { id:'Магистрат', label:'📜 Магистрат' },
    { id:'Ворота', label:'🚪 Ворота' },
    { id:'Королевский квартал', label:'👑 Королевский квартал' },
    { id:'Торговый квартал', label:'🏙️ Торговый квартал' },
    { id:'Квартал бедноты', label:'🏚️ Квартал бедноты' },
    { id:'Дом', label:'🏠 Дом' },
    { id:'Великая септа', label:'⛪ Великая септа' },
    { id:'Порт', label:'⛵ Порт' },
    { id:'Тюрьма', label:'⛓️ Тюрьма' },
    { id:'Библиотека мейстеров', label:'📚 Библиотека мейстеров' },
    { id:'Гильдия наёмников', label:'🗡️ Гильдия наёмников' },
    { id:'Бордель', label:'💃 Бордель' }
];

export const LOCATION_LEVELS = {
    'Таверна':1,'Рынок':1,'Кузница':1,'Оружейная лавка':1,'Кожевник':1,'Бронник':1,
    'Плотник':1,'Конюшня':1,'Гильдия торговцев':1,'Магистрат':1,
    'Ворота':1,
    'Королевский квартал':1,'Торговый квартал':1,'Квартал бедноты':1,'Дом':1,
    'Великая септа':1,'Порт':1,'Тюрьма':1,
    'Дорога':5,
    'Библиотека мейстеров':1,
    'Гильдия наёмников':1,
    'Бордель':1
};

export const HOUSING_TYPES = {
    'night': { name: 'Ночлежка', district: 'Квартал бедноты', price: 30, rent: 3, storageSlots: 10, restHp: 10, restFatigue: 10, bonusInt: 0, bonusLuck: -1, bonusDef: 0, emoji: '🏚️', description: 'Общая комната. Дешево, но шумно.' },
    'room': { name: 'Комната', district: 'Торговый квартал', price: 120, rent: 8, storageSlots: 20, restHp: 20, restFatigue: 20, bonusInt: 1, bonusLuck: 0, bonusDef: 0, emoji: '🏠', description: 'Скромная комната с кроватью, столом и шкафом.' },
    'house': { name: 'Дом', district: 'Торговый квартал', price: 400, rent: 20, storageSlots: 40, restHp: 35, restFatigue: 35, bonusInt: 2, bonusLuck: 0, bonusDef: 1, emoji: '🏡', description: 'Собственный дом с садом, подвалом и чердаком.' },
    'townhouse': { name: 'Таунхаус', district: 'Королевский квартал', price: 800, rent: 35, storageSlots: 60, restHp: 50, restFatigue: 50, bonusInt: 3, bonusLuck: 1, bonusDef: 2, emoji: '🏘️', description: 'Двухэтажный дом в престижном районе.' },
    'mansion': { name: 'Особняк', district: 'Королевский квартал', price: 2000, rent: 80, storageSlots: 100, restHp: 70, restFatigue: 70, bonusInt: 5, bonusLuck: 2, bonusDef: 3, emoji: '🏛️', description: 'Роскошный особняк. Огромные залы и подвалы.' }
};

export const HORSE_TYPES = {
    'work': { name: 'Рабочая лошадь', price: 50, speedBonus: 10, defensePercent: 0, hp: 80, inventorySlots: 5, emoji: '🐴', description: 'Надёжная, но медленная. +5 слотов инвентаря.' },
    'riding': { name: 'Верховая лошадь', price: 150, speedBonus: 25, defensePercent: 2, hp: 100, inventorySlots: 10, emoji: '🏇', description: 'Отличный баланс скорости и выносливости. +10 слотов инвентаря.' },
    'war': { name: 'Боевой конь', price: 400, speedBonus: 20, defensePercent: 5, hp: 150, inventorySlots: 8, emoji: '⚔️', description: 'Смелый и сильный. +8 слотов инвентаря.' },
    'racer': { name: 'Скакун', price: 600, speedBonus: 50, defensePercent: 0, hp: 70, inventorySlots: 3, emoji: '🏃', description: 'Очень быстрый, но хрупкий. +3 слота инвентаря.' },
    'heavy': { name: 'Тяжелый скакун', price: 800, speedBonus: 15, defensePercent: 8, hp: 200, inventorySlots: 15, emoji: '🛡️', description: 'Мощный и выносливый. +15 слотов инвентаря.' },
    'royal': { name: 'Королевский скакун', price: 1500, speedBonus: 40, defensePercent: 6, hp: 180, inventorySlots: 12, emoji: '👑', description: 'Элитный скакун для знати. +12 слотов инвентаря.' },
    'fire': { name: 'Огненный жеребец', price: 3000, speedBonus: 60, defensePercent: 10, hp: 250, inventorySlots: 10, emoji: '🔥', description: 'Легендарный жеребец. Всего 1 в неделю! +10 слотов инвентаря.' }
};

export const PORT_CITIES = {
    'Королевская Гавань': { region: 'Королевские земли', price: 0, emoji: '🏰', description: 'Столица Семи Королевств.' },
    'Винтерфелл': { region: 'Север', price: 100, emoji: '❄️', description: 'Цитадель Севера.' },
    'Кастерли Рок': { region: 'Западные земли', price: 80, emoji: '🦁', description: 'Богатейший город Вестероса.' },
    'Хайгарден': { region: 'Простор', price: 70, emoji: '🌹', description: 'Цветущий город на юге.' },
    'Штормовой Предел': { region: 'Штормовые земли', price: 60, emoji: '🦌', description: 'Крепость Баратеонов.' },
    'Солнечное Копьё': { region: 'Дорн', price: 90, emoji: '☀️', description: 'Столица Дорна.' },
    'Орлиное Гнездо': { region: 'Долина', price: 110, emoji: '🦅', description: 'Неприступная крепость в горах.' },
    'Риверран': { region: 'Речные земли', price: 50, emoji: '🐟', description: 'Сердце Речных земель.' },
    'Пайк': { region: 'Железные острова', price: 120, emoji: '🐙', description: 'Оплот железнорождённых.' }
};

export const MARKET_STALLS_TOTAL = 50;
export const TEMPLE_COOLDOWNS = { heal: 2 * 60 * 60 * 1000 };
