// ============================================================
// ГЛАВНОЕ МЕНЮ (game/menu.js)
// ============================================================

// ============================================================
// 1. ОТКРЫТЬ ГЛАВНОЕ МЕНЮ
// ============================================================
function openMainMenu() {
    const modal = document.getElementById('modal-menu');
    const content = document.getElementById('modal-menu-content');

    let html = `
        <div class="modal-section">
            <h4>📋 ГЛАВНОЕ МЕНЮ</h4>
            
            <button class="btn" onclick="openCharacterInfo()" style="margin:4px 0;">
                👤 Информация о персонаже
            </button>
            
            <button class="btn" onclick="openStatistics()" style="margin:4px 0;">
                📊 Статистика
            </button>
            
            <button class="btn" onclick="openSettings()" style="margin:4px 0;">
                ⚙️ Настройки
            </button>
            
            <button class="btn" onclick="openHelp()" style="margin:4px 0;">
                ❓ Помощь
            </button>
            
            <button class="btn btn-danger" onclick="handleLogout()" style="margin:4px 0;">
                🚪 Выйти из игры
            </button>
            
            <button class="btn btn-secondary" onclick="closeMenu()" style="margin:4px 0;">
                Закрыть
            </button>
        </div>
    `;

    content.innerHTML = html;
    modal.classList.remove('hide');
}

function closeMenu() {
    document.getElementById('modal-menu').classList.add('hide');
}

// ============================================================
// 2. ИНФОРМАЦИЯ О ПЕРСОНАЖЕ (открывает character.js)
// ============================================================
function openCharacterInfo() {
    closeMenu();
    openCharacter();
}

// ============================================================
// 3. СТАТИСТИКА
// ============================================================
function openStatistics() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

    const modal = document.getElementById('modal-menu');
    const content = document.getElementById('modal-menu-content');

    const playTime = Math.floor((Date.now() - user.created) / 60000);
    const hours = Math.floor(playTime / 60);
    const minutes = playTime % 60;

    const kills = g.kills || 0;
    const deaths = g.deaths || 0;
    const totalGold = g.totalGoldEarned || 0;
    const mobsKilled = g.totalMobsKilled || 0;
    const booksRead = g.booksRead || 0;
    const questsCompleted = g.quests?.completed?.length || 0;

    let html = `
        <div class="modal-section">
            <h4>📊 СТАТИСТИКА</h4>
            
            <div class="row">
                <span class="label">⏱️ Время в игре</span>
                <span class="value">${hours} ч ${minutes} мин</span>
            </div>
            
            <div class="row">
                <span class="label">📈 Уровень</span>
                <span class="value">${g.level}</span>
            </div>
            
            <div class="row">
                <span class="label">⚔️ Убийств</span>
                <span class="value">${kills}</span>
            </div>
            
            <div class="row">
                <span class="label">💀 Смертей</span>
                <span class="value">${deaths}</span>
            </div>
            
            <div class="row">
                <span class="label">💰 Всего заработано</span>
                <span class="value">${formatCurrency(totalGold)}</span>
            </div>
            
            <div class="row">
                <span class="label">👾 Всего убито мобов</span>
                <span class="value">${mobsKilled}</span>
            </div>
            
            <div class="row">
                <span class="label">📚 Прочитано книг</span>
                <span class="value">${booksRead}</span>
            </div>
            
            <div class="row">
                <span class="label">✅ Выполнено квестов</span>
                <span class="value">${questsCompleted}</span>
            </div>
            
            <button class="btn btn-secondary" onclick="openMainMenu()" style="margin-top:10px;">
                ⬅️ Назад в меню
            </button>
        </div>
    `;

    content.innerHTML = html;
    modal.classList.remove('hide');
}

// ============================================================
// 4. НАСТРОЙКИ
// ============================================================
function openSettings() {
    const modal = document.getElementById('modal-menu');
    const content = document.getElementById('modal-menu-content');

    const settings = JSON.parse(localStorage.getItem('got_settings')) || {
        sound: true,
        music: true,
        notifications: true,
        autoSave: true,
        fontSize: 'medium'
    };

    let html = `
        <div class="modal-section">
            <h4>⚙️ НАСТРОЙКИ</h4>
            
            <div class="row">
                <span class="label">🔊 Звук</span>
                <span class="value">
                    <button class="btn btn-small" onclick="toggleSetting('sound')" style="background:${settings.sound ? '#2a4a2a' : '#4a2a2a'};">
                        ${settings.sound ? '✅ Включён' : '❌ Выключен'}
                    </button>
                </span>
            </div>
            
            <div class="row">
                <span class="label">🎵 Музыка</span>
                <span class="value">
                    <button class="btn btn-small" onclick="toggleSetting('music')" style="background:${settings.music ? '#2a4a2a' : '#4a2a2a'};">
                        ${settings.music ? '✅ Включена' : '❌ Выключена'}
                    </button>
                </span>
            </div>
            
            <div class="row">
                <span class="label">🔔 Уведомления</span>
                <span class="value">
                    <button class="btn btn-small" onclick="toggleSetting('notifications')" style="background:${settings.notifications ? '#2a4a2a' : '#4a2a2a'};">
                        ${settings.notifications ? '✅ Включены' : '❌ Выключены'}
                    </button>
                </span>
            </div>
            
            <div class="row">
                <span class="label">💾 Автосохранение</span>
                <span class="value">
                    <button class="btn btn-small" onclick="toggleSetting('autoSave')" style="background:${settings.autoSave ? '#2a4a2a' : '#4a2a2a'};">
                        ${settings.autoSave ? '✅ Включено' : '❌ Выключено'}
                    </button>
                </span>
            </div>
            
            <div class="row">
                <span class="label">📏 Размер шрифта</span>
                <span class="value">
                    <button class="btn btn-small" onclick="setFontSize('small')" style="background:${settings.fontSize === 'small' ? '#3d2e20' : '#2a201a'};">
                        Маленький
                    </button>
                    <button class="btn btn-small" onclick="setFontSize('medium')" style="background:${settings.fontSize === 'medium' ? '#3d2e20' : '#2a201a'};">
                        Средний
                    </button>
                    <button class="btn btn-small" onclick="setFontSize('large')" style="background:${settings.fontSize === 'large' ? '#3d2e20' : '#2a201a'};">
                        Большой
                    </button>
                </span>
            </div>
            
            <button class="btn btn-secondary" onclick="openMainMenu()" style="margin-top:10px;">
                ⬅️ Назад в меню
            </button>
        </div>
    `;

    content.innerHTML = html;
    modal.classList.remove('hide');
}

function toggleSetting(setting) {
    const settings = JSON.parse(localStorage.getItem('got_settings')) || {};
    settings[setting] = !settings[setting];
    localStorage.setItem('got_settings', JSON.stringify(settings));
    openSettings();
}

function setFontSize(size) {
    const settings = JSON.parse(localStorage.getItem('got_settings')) || {};
    settings.fontSize = size;
    localStorage.setItem('got_settings', JSON.stringify(settings));

    const sizes = { small: '12px', medium: '16px', large: '20px' };
    document.body.style.fontSize = sizes[size] || '16px';

    openSettings();
}

// ============================================================
// 5. ПОМОЩЬ
// ============================================================
function openHelp() {
    const modal = document.getElementById('modal-menu');
    const content = document.getElementById('modal-menu-content');

    let html = `
        <div class="modal-section">
            <h4>❓ ПОМОЩЬ</h4>
            
            <div style="color:#b8a890; font-size:13px; line-height:1.8;">
                <p><strong>🎯 ОСНОВЫ:</strong></p>
                <p>• Исследуйте мир, перемещаясь по карте.</p>
                <p>• Сражайтесь с мобами, чтобы получить опыт.</p>
                <p>• Торгуйте, чтобы заработать золото.</p>
                <p>• Выполняйте квесты для развития.</p>
                
                <p style="margin-top:10px;"><strong>⚔️ БОЙ:</strong></p>
                <p>• Атака — наносит урон врагу.</p>
                <p>• Защита — снижает получаемый урон.</p>
                <p>• Уклонение — позволяет избежать атаки.</p>
                <p>• Побег — шанс выйти из боя.</p>
                
                <p style="margin-top:10px;"><strong>💰 ВАЛЮТА:</strong></p>
                <p>• 1 ЗОЛОТО = 210 СЕРЕБРА</p>
                <p>• 1 СЕРЕБРО = 56 МЕДИ</p>
                
                <p style="margin-top:10px;"><strong>📈 ПРОКАЧКА:</strong></p>
                <p>• Убивайте мобов → получайте опыт.</p>
                <p>• Повышайте уровень → получайте очки атрибутов.</p>
                <p>• Тренируйтесь → повышайте мастерство оружия.</p>
            </div>
            
            <button class="btn btn-secondary" onclick="openMainMenu()" style="margin-top:10px;">
                ⬅️ Назад в меню
            </button>
        </div>
    `;

    content.innerHTML = html;
    modal.classList.remove('hide');
}
