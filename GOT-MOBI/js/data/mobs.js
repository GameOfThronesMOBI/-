// ============================================================
// ВСЕ МОБЫ (ТОЛЬКО БАНДИТЫ, РАЗБОЙНИКИ, НАЁМНИКИ, СТРАЖА)
// ============================================================

const MOBS = {

    // ============================================================
    // КОРОЛЕВСКИЕ ЗЕМЛИ (уровни 1-30)
    // ============================================================
    crownlands: [
        // Животные
        { id: 'rat', name: 'Крыса', hp: 8, damage: 2, defense: 0, xp: 3, level: 1, type: 'animal', agility: 2, region: 'crownlands' },
        { id: 'stray_dog', name: 'Бродячая собака', hp: 15, damage: 4, defense: 1, xp: 6, level: 3, type: 'animal', agility: 3, region: 'crownlands' },
        { id: 'wild_boar', name: 'Дикий кабан', hp: 22, damage: 6, defense: 2, xp: 10, level: 5, type: 'animal', agility: 3, region: 'crownlands' },
        { id: 'wolf', name: 'Волк', hp: 28, damage: 8, defense: 2, xp: 14, level: 7, type: 'animal', agility: 4, region: 'crownlands' },
        { id: 'bear', name: 'Медведь', hp: 35, damage: 10, defense: 4, xp: 18, level: 9, type: 'animal', agility: 3, region: 'crownlands' },
        { id: 'direwolf', name: 'Лютоволк', hp: 42, damage: 12, defense: 5, xp: 22, level: 11, type: 'animal', agility: 5, region: 'crownlands' },
        { id: 'lynx', name: 'Рысь', hp: 48, damage: 14, defense: 5, xp: 26, level: 13, type: 'animal', agility: 6, region: 'crownlands' },
        { id: 'mountain_boar', name: 'Горный кабан', hp: 55, damage: 16, defense: 6, xp: 30, level: 15, type: 'animal', agility: 3, region: 'crownlands' },
        { id: 'brown_bear', name: 'Бурый медведь', hp: 62, damage: 18, defense: 7, xp: 34, level: 17, type: 'animal', agility: 3, region: 'crownlands' },
        { id: 'great_bear', name: 'Великий медведь', hp: 70, damage: 20, defense: 8, xp: 38, level: 19, type: 'animal', agility: 3, region: 'crownlands' },
        { id: 'direwolf_alpha', name: 'Вожак лютоволков', hp: 75, damage: 22, defense: 9, xp: 42, level: 21, type: 'animal', agility: 6, region: 'crownlands' },
        { id: 'wolf_alpha', name: 'Вожак волков', hp: 82, damage: 24, defense: 10, xp: 46, level: 23, type: 'animal', agility: 6, region: 'crownlands' },
        { id: 'shadowcat', name: 'Теневая кошка', hp: 88, damage: 26, defense: 11, xp: 50, level: 25, type: 'animal', agility: 7, region: 'crownlands' },
        { id: 'giant_boar', name: 'Гигантский кабан', hp: 95, damage: 28, defense: 12, xp: 55, level: 27, type: 'animal', agility: 3, region: 'crownlands' },
        { id: 'great_direwolf', name: 'Великий лютоволк', hp: 100, damage: 30, defense: 13, xp: 60, level: 29, type: 'animal', agility: 7, region: 'crownlands' },

        // Люди (только бандиты, разбойники, наёмники, стража)
        { id: 'beggar', name: 'Нищий', hp: 10, damage: 3, defense: 0, xp: 4, level: 2, type: 'human', agility: 2, region: 'crownlands' },
        { id: 'thief', name: 'Вор', hp: 18, damage: 5, defense: 1, xp: 8, level: 4, type: 'human', agility: 4, region: 'crownlands' },
        { id: 'bandit', name: 'Бандит', hp: 25, damage: 7, defense: 2, xp: 12, level: 6, type: 'human', agility: 3, region: 'crownlands' },
        { id: 'footpad', name: 'Грабитель', hp: 30, damage: 9, defense: 3, xp: 16, level: 8, type: 'human', agility: 4, region: 'crownlands' },
        { id: 'brigand', name: 'Разбойник', hp: 38, damage: 11, defense: 4, xp: 20, level: 10, type: 'human', agility: 4, region: 'crownlands' },
        { id: 'highwayman', name: 'Разбойник с большой дороги', hp: 45, damage: 13, defense: 5, xp: 24, level: 12, type: 'human', agility: 4, region: 'crownlands' },
        { id: 'thug', name: 'Головорез', hp: 50, damage: 15, defense: 6, xp: 28, level: 14, type: 'human', agility: 4, region: 'crownlands' },
        { id: 'mercenary', name: 'Наёмник', hp: 58, damage: 17, defense: 7, xp: 32, level: 16, type: 'human', agility: 5, region: 'crownlands' },
        { id: 'veteran_mercenary', name: 'Опытный наёмник', hp: 65, damage: 19, defense: 8, xp: 36, level: 18, type: 'human', agility: 5, region: 'crownlands' },
        { id: 'elite_brigand', name: 'Элитный разбойник', hp: 72, damage: 21, defense: 9, xp: 40, level: 20, type: 'human', agility: 5, region: 'crownlands' },
        { id: 'knight', name: 'Рыцарь', hp: 78, damage: 23, defense: 10, xp: 44, level: 22, type: 'human', agility: 5, region: 'crownlands' },
        { id: 'veteran_knight', name: 'Ветеран-рыцарь', hp: 85, damage: 25, defense: 11, xp: 48, level: 24, type: 'human', agility: 5, region: 'crownlands' },
        { id: 'kingsguard', name: 'Королевский гвардеец', hp: 90, damage: 27, defense: 12, xp: 52, level: 26, type: 'human', agility: 6, region: 'crownlands' },
        { id: 'champion', name: 'Чемпион королевства', hp: 98, damage: 29, defense: 13, xp: 58, level: 28, type: 'human', agility: 6, region: 'crownlands' },
        { id: 'lord_commander', name: 'Лорд-командующий', hp: 105, damage: 32, defense: 15, xp: 65, level: 30, type: 'human', agility: 6, region: 'crownlands' }
    ],

    // ============================================================
    // СЕВЕР (уровни 31-100)
    // ============================================================
    north: [
        // Животные
        { id: 'ice_wolf', name: 'Ледяной волк', hp: 110, damage: 33, defense: 14, xp: 70, level: 31, type: 'animal', agility: 5, region: 'north' },
        { id: 'snow_fox', name: 'Снежная лиса', hp: 115, damage: 34, defense: 12, xp: 72, level: 34, type: 'animal', agility: 7, region: 'north' },
        { id: 'winter_wolf', name: 'Зимний волк', hp: 120, damage: 36, defense: 15, xp: 76, level: 37, type: 'animal', agility: 5, region: 'north' },
        { id: 'snow_bear', name: 'Снежный медведь', hp: 130, damage: 38, defense: 16, xp: 80, level: 40, type: 'animal', agility: 3, region: 'north' },
        { id: 'north_direwolf', name: 'Северный лютоволк', hp: 140, damage: 40, defense: 18, xp: 85, level: 44, type: 'animal', agility: 6, region: 'north' },
        { id: 'frost_boar', name: 'Морозный кабан', hp: 145, damage: 42, defense: 18, xp: 88, level: 48, type: 'animal', agility: 3, region: 'north' },
        { id: 'white_wolf', name: 'Белый волк', hp: 155, damage: 44, defense: 20, xp: 92, level: 52, type: 'animal', agility: 6, region: 'north' },
        { id: 'polar_bear', name: 'Полярный медведь', hp: 165, damage: 46, defense: 22, xp: 98, level: 56, type: 'animal', agility: 3, region: 'north' },
        { id: 'north_wolf_alpha', name: 'Вожак северных волков', hp: 175, damage: 50, defense: 24, xp: 105, level: 60, type: 'animal', agility: 6, region: 'north' },
        { id: 'ice_boar', name: 'Ледяной кабан', hp: 190, damage: 54, defense: 26, xp: 112, level: 65, type: 'animal', agility: 3, region: 'north' },
        { id: 'north_direwolf_alpha', name: 'Вожак северных лютоволков', hp: 200, damage: 56, defense: 28, xp: 118, level: 70, type: 'animal', agility: 7, region: 'north' },
        { id: 'giant_bear', name: 'Гигантский медведь', hp: 210, damage: 60, defense: 30, xp: 125, level: 75, type: 'animal', agility: 3, region: 'north' },
        { id: 'snow_wolf_alpha', name: 'Вожак снежных волков', hp: 225, damage: 64, defense: 32, xp: 132, level: 80, type: 'animal', agility: 7, region: 'north' },
        { id: 'north_giant_boar', name: 'Северный гигантский кабан', hp: 240, damage: 68, defense: 34, xp: 140, level: 85, type: 'animal', agility: 3, region: 'north' },
        { id: 'north_legend_wolf', name: 'Легендарный волк Севера', hp: 260, damage: 72, defense: 36, xp: 150, level: 90, type: 'animal', agility: 7, region: 'north' },
        { id: 'north_legend_bear', name: 'Легендарный медведь Севера', hp: 280, damage: 76, defense: 40, xp: 158, level: 95, type: 'animal', agility: 3, region: 'north' },
        { id: 'north_alpha_wolf', name: 'Верховный вожак волков Севера', hp: 300, damage: 80, defense: 42, xp: 165, level: 99, type: 'animal', agility: 8, region: 'north' },

        // Люди (только бандиты, разбойники, наёмники, дикари)
        { id: 'north_bandit', name: 'Северный бандит', hp: 115, damage: 34, defense: 14, xp: 72, level: 33, type: 'human', agility: 4, region: 'north' },
        { id: 'north_raider', name: 'Северный рейдер', hp: 125, damage: 37, defense: 16, xp: 78, level: 38, type: 'human', agility: 5, region: 'north' },
        { id: 'north_mercenary', name: 'Северный наёмник', hp: 135, damage: 39, defense: 17, xp: 82, level: 42, type: 'human', agility: 5, region: 'north' },
        { id: 'north_veteran_bandit', name: 'Опытный северный бандит', hp: 150, damage: 43, defense: 20, xp: 90, level: 46, type: 'human', agility: 5, region: 'north' },
        { id: 'north_elite_raider', name: 'Элитный северный рейдер', hp: 160, damage: 46, defense: 22, xp: 96, level: 50, type: 'human', agility: 5, region: 'north' },
        { id: 'wildling_raider', name: 'Дикарь-рейдер', hp: 170, damage: 48, defense: 20, xp: 100, level: 55, type: 'human', agility: 5, region: 'north' },
        { id: 'wildling_warrior', name: 'Дикарь-воин', hp: 185, damage: 52, defense: 24, xp: 110, level: 60, type: 'human', agility: 5, region: 'north' },
        { id: 'wildling_chief', name: 'Вождь дикарей', hp: 200, damage: 56, defense: 26, xp: 118, level: 65, type: 'human', agility: 6, region: 'north' },
        { id: 'north_brigand_leader', name: 'Атаман северных разбойников', hp: 215, damage: 60, defense: 28, xp: 125, level: 70, type: 'human', agility: 6, region: 'north' },
        { id: 'north_mercenary_leader', name: 'Главарь северных наёмников', hp: 230, damage: 64, defense: 30, xp: 132, level: 75, type: 'human', agility: 6, region: 'north' },
        { id: 'wildling_warlord', name: 'Полководец дикарей', hp: 250, damage: 68, defense: 32, xp: 140, level: 80, type: 'human', agility: 7, region: 'north' },
        { id: 'north_bandit_lord', name: 'Король северных бандитов', hp: 270, damage: 72, defense: 34, xp: 148, level: 85, type: 'human', agility: 7, region: 'north' },
        { id: 'north_legend_raider', name: 'Легендарный северный рейдер', hp: 290, damage: 76, defense: 36, xp: 155, level: 90, type: 'human', agility: 7, region: 'north' },
        { id: 'north_elite_wildling', name: 'Элитный дикарь Севера', hp: 310, damage: 80, defense: 40, xp: 162, level: 95, type: 'human', agility: 8, region: 'north' }
    ],

    // ============================================================
    // ЗАПАДНЫЕ ЗЕМЛИ (уровни 31-100)
    // ============================================================
    westlands: [
        // Животные
        { id: 'golden_fox', name: 'Золотая лиса', hp: 110, damage: 32, defense: 12, xp: 70, level: 32, type: 'animal', agility: 7, region: 'westlands' },
        { id: 'mountain_goat', name: 'Горный козёл', hp: 115, damage: 33, defense: 14, xp: 72, level: 35, type: 'animal', agility: 5, region: 'westlands' },
        { id: 'golden_wolf', name: 'Золотой волк', hp: 125, damage: 36, defense: 15, xp: 78, level: 39, type: 'animal', agility: 6, region: 'westlands' },
        { id: 'mountain_bear', name: 'Горный медведь', hp: 135, damage: 40, defense: 18, xp: 84, level: 43, type: 'animal', agility: 3, region: 'westlands' },
        { id: 'golden_boar', name: 'Золотой кабан', hp: 145, damage: 42, defense: 18, xp: 88, level: 47, type: 'animal', agility: 3, region: 'westlands' },
        { id: 'west_direwolf', name: 'Западный лютоволк', hp: 155, damage: 44, defense: 20, xp: 94, level: 51, type: 'animal', agility: 6, region: 'westlands' },
        { id: 'golden_eagle', name: 'Золотой орёл', hp: 150, damage: 46, defense: 16, xp: 92, level: 54, type: 'animal', agility: 8, region: 'westlands' },
        { id: 'west_bear', name: 'Западный медведь', hp: 170, damage: 50, defense: 24, xp: 105, level: 59, type: 'animal', agility: 3, region: 'westlands' },
        { id: 'west_wolf_alpha', name: 'Вожак западных волков', hp: 185, damage: 54, defense: 26, xp: 112, level: 64, type: 'animal', agility: 6, region: 'westlands' },
        { id: 'west_giant_boar', name: 'Западный гигантский кабан', hp: 200, damage: 58, defense: 28, xp: 120, level: 69, type: 'animal', agility: 3, region: 'westlands' },
        { id: 'west_direwolf_alpha', name: 'Вожак западных лютоволков', hp: 215, damage: 62, defense: 30, xp: 128, level: 74, type: 'animal', agility: 7, region: 'westlands' },
        { id: 'west_legend_bear', name: 'Легендарный медведь Запада', hp: 240, damage: 68, defense: 34, xp: 140, level: 80, type: 'animal', agility: 3, region: 'westlands' },
        { id: 'west_legend_wolf', name: 'Легендарный волк Запада', hp: 260, damage: 72, defense: 36, xp: 150, level: 86, type: 'animal', agility: 7, region: 'westlands' },
        { id: 'west_alpha_wolf', name: 'Верховный вожак волков Запада', hp: 285, damage: 76, defense: 40, xp: 158, level: 92, type: 'animal', agility: 8, region: 'westlands' },
        { id: 'west_immortal_bear', name: 'Неувядаемый медведь Запада', hp: 310, damage: 82, defense: 44, xp: 168, level: 98, type: 'animal', agility: 3, region: 'westlands' },

        // Люди (только бандиты, разбойники, наёмники, стража)
        { id: 'west_bandit', name: 'Западный бандит', hp: 118, damage: 35, defense: 15, xp: 74, level: 34, type: 'human', agility: 4, region: 'westlands' },
        { id: 'west_raider', name: 'Западный рейдер', hp: 128, damage: 37, defense: 16, xp: 78, level: 38, type: 'human', agility: 5, region: 'westlands' },
        { id: 'west_mercenary', name: 'Западный наёмник', hp: 140, damage: 40, defense: 18, xp: 86, level: 42, type: 'human', agility: 5, region: 'westlands' },
        { id: 'west_veteran_bandit', name: 'Опытный западный бандит', hp: 155, damage: 44, defense: 20, xp: 92, level: 46, type: 'human', agility: 5, region: 'westlands' },
        { id: 'west_elite_raider', name: 'Элитный западный рейдер', hp: 165, damage: 48, defense: 22, xp: 98, level: 50, type: 'human', agility: 5, region: 'westlands' },
        { id: 'west_guard', name: 'Западный стражник', hp: 170, damage: 46, defense: 24, xp: 100, level: 55, type: 'human', agility: 4, region: 'westlands' },
        { id: 'west_elite_guard', name: 'Элитный западный стражник', hp: 185, damage: 50, defense: 26, xp: 108, level: 60, type: 'human', agility: 5, region: 'westlands' },
        { id: 'west_brigand_leader', name: 'Атаман западных разбойников', hp: 200, damage: 54, defense: 28, xp: 115, level: 65, type: 'human', agility: 6, region: 'westlands' },
        { id: 'west_mercenary_leader', name: 'Главарь западных наёмников', hp: 215, damage: 58, defense: 30, xp: 122, level: 70, type: 'human', agility: 6, region: 'westlands' },
        { id: 'west_bandit_lord', name: 'Король западных бандитов', hp: 235, damage: 62, defense: 32, xp: 130, level: 75, type: 'human', agility: 6, region: 'westlands' },
        { id: 'west_legend_raider', name: 'Легендарный западный рейдер', hp: 255, damage: 66, defense: 34, xp: 138, level: 80, type: 'human', agility: 7, region: 'westlands' },
        { id: 'west_elite_mercenary', name: 'Элитный западный наёмник', hp: 275, damage: 70, defense: 36, xp: 145, level: 85, type: 'human', agility: 7, region: 'westlands' },
        { id: 'west_legend_brigand', name: 'Легендарный западный разбойник', hp: 295, damage: 74, defense: 38, xp: 152, level: 90, type: 'human', agility: 7, region: 'westlands' },
        { id: 'west_elite_bandit', name: 'Элитный западный бандит', hp: 315, damage: 78, defense: 40, xp: 160, level: 95, type: 'human', agility: 8, region: 'westlands' }
    ],

    // ============================================================
    // ПРОСТОР (уровни 31-100)
    // ============================================================
    reach: [
        // Животные
        { id: 'reach_boar', name: 'Кабан Простора', hp: 110, damage: 32, defense: 14, xp: 70, level: 33, type: 'animal', agility: 3, region: 'reach' },
        { id: 'forest_wolf', name: 'Лесной волк', hp: 125, damage: 36, defense: 15, xp: 76, level: 39, type: 'animal', agility: 5, region: 'reach' },
        { id: 'golden_stag', name: 'Золотой олень', hp: 120, damage: 34, defense: 14, xp: 74, level: 41, type: 'animal', agility: 6, region: 'reach' },
        { id: 'reach_bear', name: 'Медведь Простора', hp: 145, damage: 42, defense: 18, xp: 88, level: 47, type: 'animal', agility: 3, region: 'reach' },
        { id: 'green_wolf', name: 'Зелёный волк', hp: 160, damage: 46, defense: 20, xp: 95, level: 53, type: 'animal', agility: 6, region: 'reach' },
        { id: 'reach_direwolf', name: 'Лютоволк Простора', hp: 170, damage: 48, defense: 22, xp: 100, level: 57, type: 'animal', agility: 6, region: 'reach' },
        { id: 'sun_bear', name: 'Солнечный медведь', hp: 185, damage: 52, defense: 24, xp: 110, level: 63, type: 'animal', agility: 3, region: 'reach' },
        { id: 'wild_horse', name: 'Дикий скакун', hp: 175, damage: 50, defense: 20, xp: 105, level: 67, type: 'animal', agility: 8, region: 'reach' },
        { id: 'golden_boar', name: 'Золотой кабан', hp: 210, damage: 58, defense: 28, xp: 125, level: 73, type: 'animal', agility: 3, region: 'reach' },
        { id: 'reach_wolf_alpha', name: 'Вожак волков Простора', hp: 225, damage: 62, defense: 30, xp: 132, level: 79, type: 'animal', agility: 6, region: 'reach' },
        { id: 'reach_giant_boar', name: 'Гигантский кабан Простора', hp: 245, damage: 68, defense: 34, xp: 142, level: 85, type: 'animal', agility: 3, region: 'reach' },
        { id: 'reach_legend_bear', name: 'Легендарный медведь Простора', hp: 270, damage: 74, defense: 38, xp: 155, level: 91, type: 'animal', agility: 3, region: 'reach' },
        { id: 'reach_legend_wolf', name: 'Легендарный волк Простора', hp: 290, damage: 78, defense: 40, xp: 162, level: 95, type: 'animal', agility: 7, region: 'reach' },
        { id: 'reach_alpha_wolf', name: 'Верховный вожак волков Простора', hp: 310, damage: 82, defense: 44, xp: 170, level: 99, type: 'animal', agility: 8, region: 'reach' },

        // Люди (только бандиты, разбойники, наёмники, стража)
        { id: 'reach_bandit', name: 'Разбойник Простора', hp: 120, damage: 34, defense: 15, xp: 74, level: 35, type: 'human', agility: 4, region: 'reach' },
        { id: 'reach_raider', name: 'Рейдер Простора', hp: 130, damage: 38, defense: 16, xp: 80, level: 40, type: 'human', agility: 5, region: 'reach' },
        { id: 'reach_mercenary', name: 'Наёмник Простора', hp: 142, damage: 40, defense: 18, xp: 86, level: 44, type: 'human', agility: 5, region: 'reach' },
        { id: 'reach_veteran_bandit', name: 'Опытный разбойник Простора', hp: 155, damage: 44, defense: 20, xp: 92, level: 48, type: 'human', agility: 5, region: 'reach' },
        { id: 'reach_elite_raider', name: 'Элитный рейдер Простора', hp: 165, damage: 48, defense: 22, xp: 98, level: 52, type: 'human', agility: 5, region: 'reach' },
        { id: 'reach_guard', name: 'Стражник Простора', hp: 170, damage: 46, defense: 24, xp: 100, level: 56, type: 'human', agility: 4, region: 'reach' },
        { id: 'reach_elite_guard', name: 'Элитный стражник Простора', hp: 185, damage: 50, defense: 26, xp: 108, level: 60, type: 'human', agility: 5, region: 'reach' },
        { id: 'reach_brigand_leader', name: 'Атаман разбойников Простора', hp: 200, damage: 54, defense: 28, xp: 115, level: 64, type: 'human', agility: 6, region: 'reach' },
        { id: 'reach_mercenary_leader', name: 'Главарь наёмников Простора', hp: 215, damage: 58, defense: 30, xp: 122, level: 68, type: 'human', agility: 6, region: 'reach' },
        { id: 'reach_bandit_lord', name: 'Король разбойников Простора', hp: 235, damage: 62, defense: 32, xp: 130, level: 73, type: 'human', agility: 6, region: 'reach' },
        { id: 'reach_legend_raider', name: 'Легендарный рейдер Простора', hp: 255, damage: 66, defense: 34, xp: 138, level: 78, type: 'human', agility: 7, region: 'reach' },
        { id: 'reach_elite_mercenary', name: 'Элитный наёмник Простора', hp: 275, damage: 70, defense: 36, xp: 145, level: 83, type: 'human', agility: 7, region: 'reach' },
        { id: 'reach_legend_brigand', name: 'Легендарный разбойник Простора', hp: 295, damage: 74, defense: 38, xp: 152, level: 88, type: 'human', agility: 7, region: 'reach' },
        { id: 'reach_elite_bandit', name: 'Элитный разбойник Простора', hp: 315, damage: 78, defense: 40, xp: 160, level: 93, type: 'human', agility: 8, region: 'reach' }
    ],

    // ============================================================
    // РЕЧНЫЕ ЗЕМЛИ (уровни 31-100)
    // ============================================================
    riverlands: [
        // Животные
        { id: 'river_fox', name: 'Речная лиса', hp: 108, damage: 32, defense: 12, xp: 68, level: 31, type: 'animal', agility: 7, region: 'riverlands' },
        { id: 'river_wolf', name: 'Речной волк', hp: 120, damage: 35, defense: 14, xp: 76, level: 36, type: 'animal', agility: 5, region: 'riverlands' },
        { id: 'swamp_boar', name: 'Болотный кабан', hp: 130, damage: 38, defense: 16, xp: 80, level: 41, type: 'animal', agility: 3, region: 'riverlands' },
        { id: 'river_bear', name: 'Речной медведь', hp: 145, damage: 42, defense: 18, xp: 88, level: 46, type: 'animal', agility: 3, region: 'riverlands' },
        { id: 'river_direwolf', name: 'Речной лютоволк', hp: 155, damage: 44, defense: 20, xp: 94, level: 51, type: 'animal', agility: 6, region: 'riverlands' },
        { id: 'marsh_wolf', name: 'Болотный волк', hp: 160, damage: 46, defense: 20, xp: 96, level: 55, type: 'animal', agility: 5, region: 'riverlands' },
        { id: 'river_boar', name: 'Речной кабан', hp: 175, damage: 50, defense: 22, xp: 105, level: 60, type: 'animal', agility: 3, region: 'riverlands' },
        { id: 'river_wolf_alpha', name: 'Вожак речных волков', hp: 190, damage: 54, defense: 26, xp: 115, level: 65, type: 'animal', agility: 6, region: 'riverlands' },
        { id: 'river_giant_boar', name: 'Речной гигантский кабан', hp: 205, damage: 58, defense: 28, xp: 122, level: 70, type: 'animal', agility: 3, region: 'riverlands' },
        { id: 'river_direwolf_alpha', name: 'Вожак речных лютоволков', hp: 225, damage: 64, defense: 32, xp: 135, level: 76, type: 'animal', agility: 7, region: 'riverlands' },
        { id: 'river_legend_bear', name: 'Легендарный медведь Речных земель', hp: 250, damage: 70, defense: 36, xp: 148, level: 82, type: 'animal', agility: 3, region: 'riverlands' },
        { id: 'river_legend_wolf', name: 'Легендарный волк Речных земель', hp: 270, damage: 74, defense: 38, xp: 155, level: 88, type: 'animal', agility: 7, region: 'riverlands' },
        { id: 'river_alpha_wolf', name: 'Верховный вожак волков Речных земель', hp: 295, damage: 80, defense: 42, xp: 165, level: 94, type: 'animal', agility: 8, region: 'riverlands' },
        { id: 'river_immortal_bear', name: 'Неувядаемый медведь Речных земель', hp: 320, damage: 86, defense: 46, xp: 175, level: 99, type: 'animal', agility: 3, region: 'riverlands' },

        // Люди (только бандиты, разбойники, наёмники, стража)
        { id: 'river_bandit', name: 'Речной бандит', hp: 115, damage: 34, defense: 14, xp: 72, level: 33, type: 'human', agility: 4, region: 'riverlands' },
        { id: 'river_raider', name: 'Речной рейдер', hp: 125, damage: 36, defense: 16, xp: 78, level: 38, type: 'human', agility: 5, region: 'riverlands' },
        { id: 'river_mercenary', name: 'Речной наёмник', hp: 138, damage: 39, defense: 18, xp: 84, level: 42, type: 'human', agility: 5, region: 'riverlands' },
        { id: 'river_veteran_bandit', name: 'Опытный речной бандит', hp: 152, damage: 44, defense: 20, xp: 92, level: 47, type: 'human', agility: 5, region: 'riverlands' },
        { id: 'river_elite_raider', name: 'Элитный речной рейдер', hp: 162, damage: 48, defense: 22, xp: 98, level: 52, type: 'human', agility: 5, region: 'riverlands' },
        { id: 'river_guard', name: 'Речной стражник', hp: 168, damage: 46, defense: 24, xp: 100, level: 56, type: 'human', agility: 4, region: 'riverlands' },
        { id: 'river_elite_guard', name: 'Элитный речной стражник', hp: 183, damage: 50, defense: 26, xp: 108, level: 60, type: 'human', agility: 5, region: 'riverlands' },
        { id: 'river_brigand_leader', name: 'Атаман речных разбойников', hp: 198, damage: 54, defense: 28, xp: 115, level: 64, type: 'human', agility: 6, region: 'riverlands' },
        { id: 'river_mercenary_leader', name: 'Главарь речных наёмников', hp: 213, damage: 58, defense: 30, xp: 122, level: 68, type: 'human', agility: 6, region: 'riverlands' },
        { id: 'river_bandit_lord', name: 'Король речных бандитов', hp: 233, damage: 62, defense: 32, xp: 130, level: 73, type: 'human', agility: 6, region: 'riverlands' },
        { id: 'river_legend_raider', name: 'Легендарный речной рейдер', hp: 253, damage: 66, defense: 34, xp: 138, level: 78, type: 'human', agility: 7, region: 'riverlands' },
        { id: 'river_elite_mercenary', name: 'Элитный речной наёмник', hp: 273, damage: 70, defense: 36, xp: 145, level: 83, type: 'human', agility: 7, region: 'riverlands' },
        { id: 'river_legend_brigand', name: 'Легендарный речной разбойник', hp: 293, damage: 74, defense: 38, xp: 152, level: 88, type: 'human', agility: 7, region: 'riverlands' },
        { id: 'river_elite_bandit', name: 'Элитный речной бандит', hp: 313, damage: 78, defense: 40, xp: 160, level: 93, type: 'human', agility: 8, region: 'riverlands' }
    ],

    // ============================================================
    // ШТОРМОВЫЕ ЗЕМЛИ (уровни 31-100)
    // ============================================================
    stormlands: [
        // Животные
        { id: 'storm_wolf', name: 'Штормовой волк', hp: 120, damage: 35, defense: 14, xp: 76, level: 36, type: 'animal', agility: 5, region: 'stormlands' },
        { id: 'storm_boar', name: 'Штормовой кабан', hp: 130, damage: 38, defense: 16, xp: 80, level: 41, type: 'animal', agility: 3, region: 'stormlands' },
        { id: 'storm_bear', name: 'Штормовой медведь', hp: 145, damage: 42, defense: 18, xp: 88, level: 46, type: 'animal', agility: 3, region: 'stormlands' },
        { id: 'storm_direwolf', name: 'Штормовой лютоволк', hp: 155, damage: 44, defense: 20, xp: 94, level: 51, type: 'animal', agility: 6, region: 'stormlands' },
        { id: 'storm_wolf_alpha', name: 'Вожак штормовых волков', hp: 175, damage: 50, defense: 24, xp: 105, level: 60, type: 'animal', agility: 6, region: 'stormlands' },
        { id: 'storm_giant_boar', name: 'Штормовой гигантский кабан', hp: 200, damage: 58, defense: 28, xp: 120, level: 69, type: 'animal', agility: 3, region: 'stormlands' },
        { id: 'storm_direwolf_alpha', name: 'Вожак штормовых лютоволков', hp: 215, damage: 62, defense: 30, xp: 128, level: 74, type: 'animal', agility: 7, region: 'stormlands' },
        { id: 'storm_legend_bear', name: 'Легендарный медведь Штормовых земель', hp: 240, damage: 68, defense: 34, xp: 140, level: 80, type: 'animal', agility: 3, region: 'stormlands' },
        { id: 'storm_legend_wolf', name: 'Легендарный волк Штормовых земель', hp: 260, damage: 72, defense: 36, xp: 150, level: 86, type: 'animal', agility: 7, region: 'stormlands' },
        { id: 'storm_alpha_wolf', name: 'Верховный вожак волков Штормовых земель', hp: 285, damage: 76, defense: 40, xp: 158, level: 92, type: 'animal', agility: 8, region: 'stormlands' },

        // Люди
        { id: 'storm_bandit', name: 'Штормовой бандит', hp: 118, damage: 35, defense: 15, xp: 74, level: 34, type: 'human', agility: 4, region: 'stormlands' },
        { id: 'storm_raider', name: 'Штормовой рейдер', hp: 128, damage: 37, defense: 16, xp: 78, level: 38, type: 'human', agility: 5, region: 'stormlands' },
        { id: 'storm_mercenary', name: 'Штормовой наёмник', hp: 140, damage: 40, defense: 18, xp: 86, level: 42, type: 'human', agility: 5, region: 'stormlands' },
        { id: 'storm_veteran_bandit', name: 'Опытный штормовой бандит', hp: 155, damage: 44, defense: 20, xp: 92, level: 46, type: 'human', agility: 5, region: 'stormlands' },
        { id: 'storm_elite_raider', name: 'Элитный штормовой рейдер', hp: 165, damage: 48, defense: 22, xp: 98, level: 50, type: 'human', agility: 5, region: 'stormlands' },
        { id: 'storm_brigand_leader', name: 'Атаман штормовых разбойников', hp: 200, damage: 54, defense: 28, xp: 115, level: 64, type: 'human', agility: 6, region: 'stormlands' },
        { id: 'storm_mercenary_leader', name: 'Главарь штормовых наёмников', hp: 215, damage: 58, defense: 30, xp: 122, level: 68, type: 'human', agility: 6, region: 'stormlands' },
        { id: 'storm_bandit_lord', name: 'Король штормовых бандитов', hp: 235, damage: 62, defense: 32, xp: 130, level: 73, type: 'human', agility: 6, region: 'stormlands' },
        { id: 'storm_legend_raider', name: 'Легендарный штормовой рейдер', hp: 255, damage: 66, defense: 34, xp: 138, level: 78, type: 'human', agility: 7, region: 'stormlands' },
        { id: 'storm_elite_mercenary', name: 'Элитный штормовой наёмник', hp: 275, damage: 70, defense: 36, xp: 145, level: 83, type: 'human', agility: 7, region: 'stormlands' },
        { id: 'storm_legend_brigand', name: 'Легендарный штормовой разбойник', hp: 295, damage: 74, defense: 38, xp: 152, level: 88, type: 'human', agility: 7, region: 'stormlands' },
        { id: 'storm_elite_bandit', name: 'Элитный штормовой бандит', hp: 315, damage: 78, defense: 40, xp: 160, level: 93, type: 'human', agility: 8, region: 'stormlands' }
    ],

    // ============================================================
    // ДОРН (уровни 31-100)
    // ============================================================
    dorne: [
        // Животные
        { id: 'desert_fox', name: 'Пустынная лиса', hp: 105, damage: 30, defense: 10, xp: 65, level: 31, type: 'animal', agility: 7, region: 'dorne' },
        { id: 'sand_wolf', name: 'Песчаный волк', hp: 118, damage: 35, defense: 14, xp: 74, level: 36, type: 'animal', agility: 6, region: 'dorne' },
        { id: 'dornish_boar', name: 'Дорнский кабан', hp: 128, damage: 38, defense: 16, xp: 80, level: 41, type: 'animal', agility: 3, region: 'dorne' },
        { id: 'dornish_bear', name: 'Дорнский медведь', hp: 142, damage: 40, defense: 18, xp: 86, level: 46, type: 'animal', agility: 3, region: 'dorne' },
        { id: 'dornish_direwolf', name: 'Дорнский лютоволк', hp: 152, damage: 44, defense: 20, xp: 92, level: 51, type: 'animal', agility: 6, region: 'dorne' },
        { id: 'sand_wolf_alpha', name: 'Вожак песчаных волков', hp: 172, damage: 50, defense: 24, xp: 105, level: 60, type: 'animal', agility: 6, region: 'dorne' },
        { id: 'dornish_giant_boar', name: 'Дорнский гигантский кабан', hp: 198, damage: 58, defense: 28, xp: 120, level: 69, type: 'animal', agility: 3, region: 'dorne' },
        { id: 'dornish_direwolf_alpha', name: 'Вожак дорнских лютоволков', hp: 215, damage: 62, defense: 30, xp: 128, level: 74, type: 'animal', agility: 7, region: 'dorne' },
        { id: 'dornish_legend_bear', name: 'Легендарный медведь Дорна', hp: 240, damage: 68, defense: 34, xp: 140, level: 80, type: 'animal', agility: 3, region: 'dorne' },
        { id: 'dornish_legend_wolf', name: 'Легендарный волк Дорна', hp: 260, damage: 72, defense: 36, xp: 150, level: 86, type: 'animal', agility: 7, region: 'dorne' },
        { id: 'dornish_alpha_wolf', name: 'Верховный вожак волков Дорна', hp: 285, damage: 76, defense: 40, xp: 158, level: 92, type: 'animal', agility: 8, region: 'dorne' },

        // Люди
        { id: 'dornish_bandit', name: 'Дорнский бандит', hp: 115, damage: 34, defense: 14, xp: 72, level: 33, type: 'human', agility: 4, region: 'dorne' },
        { id: 'dornish_raider', name: 'Дорнский рейдер', hp: 125, damage: 36, defense: 16, xp: 78, level: 38, type: 'human', agility: 5, region: 'dorne' },
        { id: 'dornish_mercenary', name: 'Дорнский наёмник', hp: 138, damage: 39, defense: 18, xp: 84, level: 42, type: 'human', agility: 5, region: 'dorne' },
        { id: 'dornish_veteran_bandit', name: 'Опытный дорнский бандит', hp: 152, damage: 44, defense: 20, xp: 92, level: 47, type: 'human', agility: 5, region: 'dorne' },
        { id: 'dornish_elite_raider', name: 'Элитный дорнский рейдер', hp: 162, damage: 48, defense: 22, xp: 98, level: 52, type: 'human', agility: 5, region: 'dorne' },
        { id: 'dornish_brigand_leader', name: 'Атаман дорнских разбойников', hp: 198, damage: 54, defense: 28, xp: 115, level: 64, type: 'human', agility: 6, region: 'dorne' },
        { id: 'dornish_mercenary_leader', name: 'Главарь дорнских наёмников', hp: 213, damage: 58, defense: 30, xp: 122, level: 68, type: 'human', agility: 6, region: 'dorne' },
        { id: 'dornish_bandit_lord', name: 'Король дорнских бандитов', hp: 233, damage: 62, defense: 32, xp: 130, level: 73, type: 'human', agility: 6, region: 'dorne' },
        { id: 'dornish_legend_raider', name: 'Легендарный дорнский рейдер', hp: 253, damage: 66, defense: 34, xp: 138, level: 78, type: 'human', agility: 7, region: 'dorne' },
        { id: 'dornish_elite_mercenary', name: 'Элитный дорнский наёмник', hp: 273, damage: 70, defense: 36, xp: 145, level: 83, type: 'human', agility: 7, region: 'dorne' },
        { id: 'dornish_legend_brigand', name: 'Легендарный дорнский разбойник', hp: 293, damage: 74, defense: 38, xp: 152, level: 88, type: 'human', agility: 7, region: 'dorne' },
        { id: 'dornish_elite_bandit', name: 'Элитный дорнский бандит', hp: 313, damage: 78, defense: 40, xp: 160, level: 93, type: 'human', agility: 8, region: 'dorne' }
    ],

    // ============================================================
    // ДОЛИНА (уровни 31-100)
    // ============================================================
    vale: [
        // Животные
        { id: 'mountain_wolf', name: 'Горный волк', hp: 120, damage: 35, defense: 14, xp: 76, level: 36, type: 'animal', agility: 5, region: 'vale' },
        { id: 'vale_boar', name: 'Кабан Долины', hp: 130, damage: 38, defense: 16, xp: 80, level: 41, type: 'animal', agility: 3, region: 'vale' },
        { id: 'vale_bear', name: 'Медведь Долины', hp: 145, damage: 42, defense: 18, xp: 88, level: 46, type: 'animal', agility: 3, region: 'vale' },
        { id: 'vale_direwolf', name: 'Лютоволк Долины', hp: 155, damage: 44, defense: 20, xp: 94, level: 51, type: 'animal', agility: 6, region: 'vale' },
        { id: 'mountain_wolf_alpha', name: 'Вожак горных волков', hp: 175, damage: 50, defense: 24, xp: 105, level: 60, type: 'animal', agility: 6, region: 'vale' },
        { id: 'vale_giant_boar', name: 'Гигантский кабан Долины', hp: 200, damage: 58, defense: 28, xp: 120, level: 69, type: 'animal', agility: 3, region: 'vale' },
        { id: 'vale_direwolf_alpha', name: 'Вожак лютоволков Долины', hp: 215, damage: 62, defense: 30, xp: 128, level: 74, type: 'animal', agility: 7, region: 'vale' },
        { id: 'vale_legend_bear', name: 'Легендарный медведь Долины', hp: 240, damage: 68, defense: 34, xp: 140, level: 80, type: 'animal', agility: 3, region: 'vale' },
        { id: 'vale_legend_wolf', name: 'Легендарный волк Долины', hp: 260, damage: 72, defense: 36, xp: 150, level: 86, type: 'animal', agility: 7, region: 'vale' },
        { id: 'vale_alpha_wolf', name: 'Верховный вожак волков Долины', hp: 285, damage: 76, defense: 40, xp: 158, level: 92, type: 'animal', agility: 8, region: 'vale' },

        // Люди
        { id: 'vale_bandit', name: 'Бандит Долины', hp: 118, damage: 35, defense: 15, xp: 74, level: 34, type: 'human', agility: 4, region: 'vale' },
        { id: 'vale_raider', name: 'Рейдер Долины', hp: 128, damage: 37, defense: 16, xp: 78, level: 38, type: 'human', agility: 5, region: 'vale' },
        { id: 'vale_mercenary', name: 'Наёмник Долины', hp: 140, damage: 40, defense: 18, xp: 86, level: 42, type: 'human', agility: 5, region: 'vale' },
        { id: 'vale_veteran_bandit', name: 'Опытный бандит Долины', hp: 155, damage: 44, defense: 20, xp: 92, level: 46, type: 'human', agility: 5, region: 'vale' },
        { id: 'vale_elite_raider', name: 'Элитный рейдер Долины', hp: 165, damage: 48, defense: 22, xp: 98, level: 50, type: 'human', agility: 5, region: 'vale' },
        { id: 'vale_brigand_leader', name: 'Атаман разбойников Долины', hp: 200, damage: 54, defense: 28, xp: 115, level: 64, type: 'human', agility: 6, region: 'vale' },
        { id: 'vale_mercenary_leader', name: 'Главарь наёмников Долины', hp: 215, damage: 58, defense: 30, xp: 122, level: 68, type: 'human', agility: 6, region: 'vale' },
        { id: 'vale_bandit_lord', name: 'Король бандитов Долины', hp: 235, damage: 62, defense: 32, xp: 130, level: 73, type: 'human', agility: 6, region: 'vale' },
        { id: 'vale_legend_raider', name: 'Легендарный рейдер Долины', hp: 255, damage: 66, defense: 34, xp: 138, level: 78, type: 'human', agility: 7, region: 'vale' },
        { id: 'vale_elite_mercenary', name: 'Элитный наёмник Долины', hp: 275, damage: 70, defense: 36, xp: 145, level: 83, type: 'human', agility: 7, region: 'vale' },
        { id: 'vale_legend_brigand', name: 'Легендарный разбойник Долины', hp: 295, damage: 74, defense: 38, xp: 152, level: 88, type: 'human', agility: 7, region: 'vale' },
        { id: 'vale_elite_bandit', name: 'Элитный бандит Долины', hp: 315, damage: 78, defense: 40, xp: 160, level: 93, type: 'human', agility: 8, region: 'vale' }
    ],

    // ============================================================
    // ЖЕЛЕЗНЫЕ ОСТРОВА (уровни 31-100)
    // ============================================================
    iron_islands: [
        // Животные
        { id: 'sea_wolf', name: 'Морской волк', hp: 120, damage: 35, defense: 14, xp: 76, level: 36, type: 'animal', agility: 5, region: 'iron_islands' },
        { id: 'iron_boar', name: 'Железный кабан', hp: 130, damage: 38, defense: 16, xp: 80, level: 41, type: 'animal', agility: 3, region: 'iron_islands' },
        { id: 'iron_bear', name: 'Железный медведь', hp: 145, damage: 42, defense: 18, xp: 88, level: 46, type: 'animal', agility: 3, region: 'iron_islands' },
        { id: 'sea_wolf_alpha', name: 'Вожак морских волков', hp: 175, damage: 50, defense: 24, xp: 105, level: 60, type: 'animal', agility: 6, region: 'iron_islands' },
        { id: 'iron_giant_boar', name: 'Железный гигантский кабан', hp: 200, damage: 58, defense: 28, xp: 120, level: 69, type: 'animal', agility: 3, region: 'iron_islands' },
        { id: 'iron_legend_bear', name: 'Легендарный медведь Железных островов', hp: 240, damage: 68, defense: 34, xp: 140, level: 80, type: 'animal', agility: 3, region: 'iron_islands' },
        { id: 'iron_legend_wolf', name: 'Легендарный волк Железных островов', hp: 260, damage: 72, defense: 36, xp: 150, level: 86, type: 'animal', agility: 7, region: 'iron_islands' },
        { id: 'iron_alpha_wolf', name: 'Верховный вожак волков Железных островов', hp: 285, damage: 76, defense: 40, xp: 158, level: 92, type: 'animal', agility: 8, region: 'iron_islands' },

        // Люди (железнорождённые — пираты, рейдеры, наёмники)
        { id: 'iron_raider', name: 'Железный рейдер', hp: 125, damage: 36, defense: 16, xp: 78, level: 38, type: 'human', agility: 5, region: 'iron_islands' },
        { id: 'iron_mercenary', name: 'Железный наёмник', hp: 140, damage: 40, defense: 18, xp: 86, level: 42, type: 'human', agility: 5, region: 'iron_islands' },
        { id: 'iron_veteran_raider', name: 'Опытный железный рейдер', hp: 155, damage: 44, defense: 20, xp: 92, level: 46, type: 'human', agility: 5, region: 'iron_islands' },
        { id: 'iron_elite_raider', name: 'Элитный железный рейдер', hp: 165, damage: 48, defense: 22, xp: 98, level: 50, type: 'human', agility: 5, region: 'iron_islands' },
        { id: 'iron_captain', name: 'Железный капитан', hp: 185, damage: 52, defense: 24, xp: 108, level: 55, type: 'human', agility: 6, region: 'iron_islands' },
        { id: 'iron_raider_leader', name: 'Главарь железных рейдеров', hp: 200, damage: 56, defense: 26, xp: 118, level: 62, type: 'human', agility: 6, region: 'iron_islands' },
        { id: 'iron_mercenary_leader', name: 'Главарь железных наёмников', hp: 215, damage: 60, defense: 28, xp: 125, level: 68, type: 'human', agility: 6, region: 'iron_islands' },
        { id: 'iron_bandit_lord', name: 'Король железных бандитов', hp: 235, damage: 64, defense: 30, xp: 132, level: 74, type: 'human', agility: 6, region: 'iron_islands' },
        { id: 'iron_legend_raider', name: 'Легендарный железный рейдер', hp: 255, damage: 68, defense: 32, xp: 140, level: 80, type: 'human', agility: 7, region: 'iron_islands' },
        { id: 'iron_elite_mercenary', name: 'Элитный железный наёмник', hp: 275, damage: 72, defense: 34, xp: 148, level: 86, type: 'human', agility: 7, region: 'iron_islands' },
        { id: 'iron_legend_brigand', name: 'Легендарный железный разбойник', hp: 295, damage: 76, defense: 36, xp: 155, level: 92, type: 'human', agility: 7, region: 'iron_islands' },
        { id: 'iron_elite_raider', name: 'Элитный железный рейдер', hp: 315, damage: 80, defense: 38, xp: 162, level: 97, type: 'human', agility: 8, region: 'iron_islands' }
    ],

    // ============================================================
    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    // ============================================================

    function getMobById(id) {
        const allMobs = [];
        for (let key in this) {
            if (Array.isArray(this[key]) && key !== 'getMobById' && key !== 'getMobsByRegion' && key !== 'getMobsByLevelRange') {
                allMobs.push(...this[key]);
            }
        }
        return allMobs.find(m => m.id === id) || null;
    },

    function getMobsByRegion(region) {
        const regionMap = {
            'crownlands': 'crownlands',
            'north': 'north',
            'westlands': 'westlands',
            'reach': 'reach',
            'riverlands': 'riverlands',
            'stormlands': 'stormlands',
            'dorne': 'dorne',
            'vale': 'vale',
            'iron_islands': 'iron_islands'
        };
        const key = regionMap[region];
        if (key && this[key]) {
            return this[key];
        }
        return [];
    },

    function getMobsByLevelRange(minLevel, maxLevel) {
        const allMobs = [];
        for (let key in this) {
            if (Array.isArray(this[key]) && key !== 'getMobById' && key !== 'getMobsByRegion' && key !== 'getMobsByLevelRange') {
                allMobs.push(...this[key]);
            }
        }
        return allMobs.filter(m => m.level >= minLevel && m.level <= maxLevel);
    }
};

// ============================================================
// ГЛОБАЛЬНЫЕ ФУНКЦИИ
// ============================================================

function getMobById(id) {
    return MOBS.getMobById(id);
}

function getMobsByRegion(region) {
    return MOBS.getMobsByRegion(region);
}

function getMobsByLevelRange(minLevel, maxLevel) {
    return MOBS.getMobsByLevelRange(minLevel, maxLevel);
}

function getRandomMobByLevel(maxLevel) {
    const allMobs = [];
    for (let key in MOBS) {
        if (Array.isArray(MOBS[key]) && key !== 'getMobById' && key !== 'getMobsByRegion' && key !== 'getMobsByLevelRange') {
            allMobs.push(...MOBS[key]);
        }
    }
    const filtered = allMobs.filter(m => m.level <= maxLevel);
    if (filtered.length === 0) return allMobs[0];
    return filtered[Math.floor(Math.random() * filtered.length)];
}

function getRandomMobByRegionAndLevel(region, maxLevel) {
    const regionMobs = getMobsByRegion(region);
    if (regionMobs.length === 0) return getRandomMobByLevel(maxLevel);
    const filtered = regionMobs.filter(m => m.level <= maxLevel);
    if (filtered.length === 0) return regionMobs[0];
    return filtered[Math.floor(Math.random() * filtered.length)];
}
