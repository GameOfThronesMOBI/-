// ============================================================
// КОРОЛЕВСКАЯ ГАВАНЬ (regions/crownlands/kings_landing.js)
// ============================================================

export const KINGS_LANDING = {
    id: 'kings_landing',
    name: 'Королевская Гавань',
    type: 'capital',
    region: 'crownlands',
    isNeutral: true,
    description: 'Столица Семи Королевств. Железный трон ждёт своего хозяина.',
    travelTime: 1,

    // ============================================================
    // ВСЕ ЗДАНИЯ
    // ============================================================
    buildings: {
        // ---- ТАВЕРНА ----
        tavern: {
            id: 'tavern',
            name: 'Таверна',
            type: 'tavern',
            description: 'Тёплое место с выпивкой и едой.',
            actions: {
                eat: {
                    label: '🍞 Поесть (+25 еды)',
                    handler: (user) => {
                        if (user.game.food < 100) {
                            user.game.food = Math.min(100, user.game.food + 25);
                            setMessage('🍞 Вы поели. Еда +25.');
                            updateMenu();
                            saveData();
                        } else {
                            setMessage('🍖 Вы сыты.');
                        }
                    }
                },
                rest: {
                    label: '🛏️ Отдохнуть (10 МП)',
                    handler: (user) => {
                        if (spendMoney(user.game, 10)) {
                            user.game.fatigue = Math.min(100, user.game.fatigue + 30);
                            user.game.hp = Math.min(user.game.maxHp, user.game.hp + 15);
                            setMessage('🛏️ Вы отдохнули. Усталость +30, HP +15.');
                            updateMenu();
                            saveData();
                        } else {
                            setMessage('❌ Недостаточно денег (10 МП).');
                        }
                    }
                },
                talk: {
                    label: '🗣️ Поговорить с трактирщиком',
                    handler: () => {
                        const msgs = [
                            '🍺 Трактирщик: «Добро пожаловать, путник!»',
                            '🍺 Трактирщик: «Хочешь заработать? Помой посуду.»',
                            '🍺 Трактирщик: «Будь осторожен за воротами.»'
                        ];
                        setMessage(msgs[Math.floor(Math.random() * msgs.length)]);
                    }
                },
                wash: {
                    label: '🧹 Помыть посуду (1 мин → 1 МП)',
                    handler: (user) => {
                        startBusy('Моете посуду', 1, () => {
                            user.game.copper += 1;
                            convertCurrency(user.game);
                            setMessage('🧹 Вы помыли посуду. +1 МП.');
                            updateMenu();
                            saveData();
                        });
                    }
                },
                sweep: {
                    label: '🧹 Подмести пол (5 мин → 5 МП)',
                    handler: (user) => {
                        startBusy('Подметаете пол', 5, () => {
                            user.game.copper += 5;
                            convertCurrency(user.game);
                            setMessage('🧹 Вы подмели пол. +5 МП.');
                            updateMenu();
                            saveData();
                        });
                    }
                },
                trade: {
                    label: '🛒 Торговля в таверне',
                    handler: () => {
                        openTavernTrade();
                    }
                }
            }
        },

        // ---- РЫНОК ----
        market: {
            id: 'market',
            name: 'Рынок',
            type: 'market',
            description: 'Центр торговли.',
            actions: {
                open: {
                    label: '🏪 Открыть рынок',
                    handler: () => {
                        openMarket();
                    }
                }
            }
        },

        // ---- КУЗНИЦА ----
        forge: {
            id: 'forge',
            name: 'Кузница',
            type: 'forge',
            description: 'Здесь куют оружие и доспехи.',
            actions: {
                shop: {
                    label: '⚒️ Кузница',
                    handler: () => {
                        openShop('Кузница');
                    }
                },
                craft: {
                    label: '🔨 Крафт',
                    handler: () => {
                        openCraftMenu();
                    }
                }
            }
        },

        // ---- ОРУЖЕЙНАЯ ЛАВКА ----
        weapons_shop: {
            id: 'weapons_shop',
            name: 'Оружейная лавка',
            type: 'shop',
            description: 'Оружие на любой вкус.',
            actions: {
                shop: {
                    label: '🗡️ Оружейная лавка',
                    handler: () => {
                        openShop('Оружейная лавка');
                    }
                }
            }
        },

        // ---- КОЖЕВНИК ----
        leather_shop: {
            id: 'leather_shop',
            name: 'Кожевник',
            type: 'shop',
            description: 'Кожаные доспехи и одежда.',
            actions: {
                shop: {
                    label: '🪡 Кожевник',
                    handler: () => {
                        openShop('Кожевник');
                    }
                }
            }
        },

        // ---- БРОННИК ----
        armorer: {
            id: 'armorer',
            name: 'Бронник',
            type: 'shop',
            description: 'Латные доспехи и щиты.',
            actions: {
                shop: {
                    label: '🛡️ Бронник',
                    handler: () => {
                        openShop('Бронник');
                    }
                }
            }
        },

        // ---- ПЛОТНИК ----
        carpenter: {
            id: 'carpenter',
            name: 'Плотник',
            type: 'shop',
            description: 'Деревянные изделия, луки, стрелы.',
            actions: {
                shop: {
                    label: '🪵 Плотник',
                    handler: () => {
                        openShop('Плотник');
                    }
                }
            }
        },

        // ---- КОНЮШНЯ ----
        stable: {
            id: 'stable',
            name: 'Конюшня',
            type: 'stable',
            description: 'Здесь продают лошадей.',
            actions: {
                open: {
                    label: '🐴 Конюшня',
                    handler: () => {
                        openStable();
                    }
                }
            }
        },

        // ---- ГИЛЬДИЯ ТОРГОВЦЕВ ----
        guild: {
            id: 'guild',
            name: 'Гильдия торговцев',
            type: 'guild',
            description: 'Здесь торгуют на аукционе.',
            actions: {
                open: {
                    label: '🏛️ Аукцион',
                    handler: () => {
                        openGuild();
                    }
                }
            }
        },

        // ---- МАГИСТРАТ ----
        magistrate: {
            id: 'magistrate',
            name: 'Магистрат',
            type: 'magistrate',
            description: 'Управление городом, покупка жилья.',
            actions: {
                open: {
                    label: '📜 Магистрат',
                    handler: () => {
                        openMagistrate();
                    }
                }
            }
        },

        // ---- ВОРОТА ----
        gates: {
            id: 'gates',
            name: 'Ворота',
            type: 'gates',
            description: 'Выход из города.',
            actions: {
                leave: {
                    label: '🚪 Выйти на Дорогу',
                    handler: (user) => {
                        if (!user.game.outside) {
                            user.game.location.place = 'road';
                            user.game.location.location = 'Дорога';
                            user.game.outside = true;
                            setMessage('🛤️ Вы вышли на Дорогу.');
                            updateMenu();
                            updateStory();
                            updateActions();
                            saveData();
                        }
                    }
                }
            }
        },

        // ---- КОРОЛЕВСКИЙ КВАРТАЛ ----
        noble_quarter: {
            id: 'noble_quarter',
            name: 'Королевский квартал',
            type: 'district',
            description: 'Элитный район, где живут лорды.',
            actions: {
                buy_house: {
                    label: '🏠 Купить жильё',
                    handler: () => {
                        viewDistrict('Королевский квартал');
                    }
                }
            }
        },

        // ---- ТОРГОВЫЙ КВАРТАЛ ----
        trade_quarter: {
            id: 'trade_quarter',
            name: 'Торговый квартал',
            type: 'district',
            description: 'Район ремесленников и купцов.',
            actions: {
                buy_house: {
                    label: '🏠 Купить жильё',
                    handler: () => {
                        viewDistrict('Торговый квартал');
                    }
                }
            }
        },

        // ---- КВАРТАЛ БЕДНОТЫ ----
        poor_quarter: {
            id: 'poor_quarter',
            name: 'Квартал бедноты',
            type: 'district',
            description: 'Опасный район, где живут бедняки.',
            actions: {
                buy_house: {
                    label: '🏠 Купить жильё',
                    handler: () => {
                        viewDistrict('Квартал бедноты');
                    }
                },
                search: {
                    label: '🔍 Поиск',
                    handler: () => {
                        doSearch();
                    }
                }
            }
        },

        // ---- ДОМ ----
        home: {
            id: 'home',
            name: 'Дом',
            type: 'home',
            description: 'Ваше личное убежище.',
            actions: {
                rest: {
                    label: '🛏️ Отдохнуть (бесплатно)',
                    handler: () => {
                        restAtHome();
                    }
                },
                storage: {
                    label: '📦 Склад',
                    handler: () => {
                        openStorage();
                    }
                },
                leave: {
                    label: '🚪 Выйти из дома',
                    handler: (user) => {
                        if (user.game.housing && user.game.housing.type) {
                            const house = HOUSING_TYPES[user.game.housing.type];
                            user.game.location.place = house.district;
                            user.game.location.location = 'Королевская Гавань';
                            setMessage('🚪 Вы вышли из дома.');
                            updateMenu();
                            updateStory();
                            updateActions();
                            saveData();
                        } else {
                            setMessage('❌ У вас нет дома.');
                        }
                    }
                }
            }
        },

        // ---- ВЕЛИКАЯ СЕПТА ----
        great_sept: {
            id: 'great_sept',
            name: 'Великая септа',
            type: 'temple',
            description: 'Главный храм Семерых.',
            actions: {
                open: {
                    label: '⛪ Септа',
                    handler: () => {
                        openTemple();
                    }
                }
            }
        },

        // ---- ПОРТ ----
        port: {
            id: 'port',
            name: 'Порт',
            type: 'port',
            description: 'Главные ворота в мир.',
            actions: {
                open: {
                    label: '⛵ Порт',
                    handler: () => {
                        openPort();
                    }
                }
            }
        },

        // ---- ТЮРЬМА ----
        prison: {
            id: 'prison',
            name: 'Тюрьма',
            type: 'prison',
            description: 'Место для нарушителей закона.',
            actions: {
                pay: {
                    label: '💰 Заплатить штраф',
                    handler: () => {
                        payJailFine();
                    }
                },
                wait: {
                    label: '⏳ Ждать освобождения (5 мин)',
                    handler: () => {
                        waitJailTime();
                    }
                },
                escape: {
                    label: '🏃 Попытаться сбежать',
                    handler: () => {
                        attemptEscape();
                    }
                }
            }
        },

        // ---- БИБЛИОТЕКА МЕЙСТЕРОВ ----
        library: {
            id: 'library',
            name: 'Библиотека мейстеров',
            type: 'library',
            description: 'Древние знания и книги.',
            actions: {
                open: {
                    label: '📚 Библиотека',
                    handler: () => {
                        openLibrary();
                    }
                }
            }
        },

        // ---- ГИЛЬДИЯ НАЁМНИКОВ ----
        mercenary_guild: {
            id: 'mercenary_guild',
            name: 'Гильдия наёмников',
            type: 'guild',
            description: 'Контракты и задания.',
            actions: {
                open: {
                    label: '🗡️ Гильдия наёмников',
                    handler: () => {
                        openGuildHall();
                    }
                }
            }
        },

        // ---- БОРДЕЛЬ ----
        brothel: {
            id: 'brothel',
            name: 'Бордель',
            type: 'brothel',
            description: 'Отдых, вино и развлечения.',
            actions: {
                open: {
                    label: '💃 Бордель',
                    handler: () => {
                        openBrothel();
                    }
                }
            }
        },

        // ---- ВОРОТА В КРАСНЫЙ ЗАМОК ----
        red_keep_gate: {
            id: 'red_keep_gate',
            name: 'Ворота в Красный замок',
            type: 'gate',
            description: 'Вход в резиденцию короля.',
            actions: {
                enter: {
                    label: '🚪 Войти в Красный замок',
                    handler: (user) => {
                        user.game.location.place = 'red_keep';
                        user.game.location.location = 'Красный замок';
                        setMessage('🏰 Вы вошли в Красный замок.');
                        updateMenu();
                        updateStory();
                        updateActions();
                        saveData();
                    }
                }
            }
        },

        // ---- КРАСНЫЙ ЗАМОК (комнаты) ----
        red_keep: {
            id: 'red_keep',
            name: 'Красный замок',
            type: 'castle',
            description: 'Резиденция короля.',
            rooms: {
                throne_room: {
                    name: 'Тронный зал',
                    description: 'Зал Железного Трона.',
                    actions: {
                        enter: {
                            label: '👑 Тронный зал',
                            handler: (user) => {
                                user.game.location.place = 'throne_room';
                                setMessage('👑 Вы в Тронном зале.');
                                updateMenu();
                                updateStory();
                                updateActions();
                                saveData();
                            }
                        }
                    }
                },
                royal_council: {
                    name: 'Королевский совет',
                    description: 'Зал заседаний Малого совета.',
                    actions: {
                        enter: {
                            label: '🏛️ Королевский совет',
                            handler: (user) => {
                                user.game.location.place = 'royal_council';
                                setMessage('🏛️ Вы в зале Королевского совета.');
                                updateMenu();
                                updateStory();
                                updateActions();
                                saveData();
                            }
                        }
                    }
                },
                royal_treasury: {
                    name: 'Королевская казна',
                    description: 'Хранилище королевского золота.',
                    actions: {
                        enter: {
                            label: '💰 Королевская казна',
                            handler: (user) => {
                                user.game.location.place = 'royal_treasury';
                                setMessage('💰 Вы в Королевской казне.');
                                updateMenu();
                                updateStory();
                                updateActions();
                                saveData();
                            }
                        }
                    }
                },
                archives: {
                    name: 'Архивы',
                    description: 'Древние свитки и записи.',
                    actions: {
                        enter: {
                            label: '📜 Архивы',
                            handler: (user) => {
                                user.game.location.place = 'archives';
                                setMessage('📜 Вы в Архивах.');
                                updateMenu();
                                updateStory();
                                updateActions();
                                saveData();
                            }
                        }
                    }
                },
                barracks: {
                    name: 'Казармы',
                    description: 'Солдатские казармы.',
                    actions: {
                        enter: {
                            label: '⚔️ Казармы',
                            handler: (user) => {
                                user.game.location.place = 'barracks';
                                setMessage('⚔️ Вы в казармах.');
                                updateMenu();
                                updateStory();
                                updateActions();
                                saveData();
                            }
                        }
                    }
                },
                training_ground: {
                    name: 'Тренировочная площадка',
                    description: 'Место для тренировок рыцарей.',
                    actions: {
                        enter: {
                            label: '🏋️ Тренировочная площадка',
                            handler: (user) => {
                                user.game.location.place = 'training_ground';
                                setMessage('🏋️ Вы на тренировочной площадке.');
                                updateMenu();
                                updateStory();
                                updateActions();
                                saveData();
                            }
                        }
                    }
                },
                garden: {
                    name: 'Королевский сад',
                    description: 'Красивый сад с редкими цветами.',
                    actions: {
                        enter: {
                            label: '🌿 Королевский сад',
                            handler: (user) => {
                                user.game.location.place = 'garden';
                                setMessage('🌿 Вы в королевском саду.');
                                updateMenu();
                                updateStory();
                                updateActions();
                                saveData();
                            }
                        }
                    }
                }
            }
        }
    }
};
