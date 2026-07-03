// ============================================================
// ДИПЛОМАТИЯ (game/diplomacy.js)
// ============================================================

// ============================================================
// 1. ПРЕДЛОЖИТЬ СТАТЬ ВАССАЛОМ
// ============================================================
function proposeVassal(houseId, liegeId) {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

    // Проверяем, что игрок — лорд дома
    if (g.lordOf !== houseId) {
        setMessage('❌ Вы не лорд этого дома.');
        return;
    }

    const house = HOUSES[houseId];
    const liege = HOUSES[liegeId];
    if (!house || !liege) {
        setMessage('❌ Дом не найден.');
        return;
    }

    // Проверяем, что дом уже не вассал
    if (house.liege) {
        setMessage('❌ Этот дом уже чей-то вассал.');
        return;
    }

    // Проверяем, что сюзерен не вассал
    if (liege.liege) {
        setMessage('❌ Сюзерен не может быть вассалом.');
        return;
    }

    // Находим лорда дома-сюзерена
    const liegeLord = findLordOf(liegeId);
    if (!liegeLord) {
        setMessage('❌ У дома-сюзерена нет лорда.');
        return;
    }

    // Отправляем предложение (временно сохраняем в localStorage)
    const proposals = JSON.parse(localStorage.getItem('got_vassal_proposals') || '{}');
    proposals[liegeId] = {
        from: houseId,
        fromLord: currentUser,
        to: liegeId,
        timestamp: Date.now()
    };
    localStorage.setItem('got_vassal_proposals', JSON.stringify(proposals));

    setMessage(`📨 Вы предложили ${liege.name} стать вашим сюзереном. Ждите ответа.`);
    addLog(`📨 ${currentUser} предложил ${liege.name} стать сюзереном`);
    saveData();
}

// ============================================================
// 2. ОТВЕТИТЬ НА ПРЕДЛОЖЕНИЕ
// ============================================================
function respondToVassalProposal(houseId, accept) {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

    // Проверяем, что игрок — лорд дома
    if (g.lordOf !== houseId) {
        setMessage('❌ Вы не лорд этого дома.');
        return;
    }

    const proposals = JSON.parse(localStorage.getItem('got_vassal_proposals') || '{}');
    const proposal = proposals[houseId];
    if (!proposal) {
        setMessage('❌ Нет активных предложений.');
        return;
    }

    const fromHouse = HOUSES[proposal.from];
    const toHouse = HOUSES[proposal.to];

    if (!fromHouse || !toHouse) {
        setMessage('❌ Дом не найден.');
        return;
    }

    if (accept) {
        // Принимаем — становимся вассалом
        fromHouse.liege = houseId;
        toHouse.vassals.push(proposal.from);

        setMessage(`✅ ${fromHouse.name} стал вассалом ${toHouse.name}!`);
        addLog(`🏛️ ${fromHouse.name} стал вассалом ${toHouse.name}`);
    } else {
        // Отказываем
        setMessage(`❌ ${fromHouse.name} отказался стать вассалом ${toHouse.name}.`);
        addLog(`❌ ${fromHouse.name} отказался от вассалитета`);
    }

    // Удаляем предложение
    delete proposals[houseId];
    localStorage.setItem('got_vassal_proposals', JSON.stringify(proposals));

    saveData();
    updateMenu();
}

// ============================================================
// 3. ПРОВЕРИТЬ АКТИВНЫЕ ПРЕДЛОЖЕНИЯ
// ============================================================
function checkVassalProposals() {
    const user = users[currentUser];
    if (!user) return;
    const g = user.game;

    // Проверяем, что игрок — лорд дома
    if (!g.lordOf) return;

    const proposals = JSON.parse(localStorage.getItem('got_vassal_proposals') || '{}');
    const proposal = proposals[g.lordOf];

    if (proposal) {
        const fromHouse = HOUSES[proposal.from];
        const toHouse = HOUSES[proposal.to];
        if (!fromHouse || !toHouse) return;

        const timeLeft = Math.ceil((proposal.timestamp + 5 * 60 * 1000 - Date.now()) / 60000);

        // Показываем уведомление
        setMessage(`📨 ${fromHouse.name} предлагает стать вассалом ${toHouse.name}. Осталось ${timeLeft} мин.`);

        // Добавляем кнопки в интерфейс
        const container = document.getElementById('actions-container');
        const acceptBtn = document.createElement('button');
        acceptBtn.className = 'btn btn-small';
        acceptBtn.textContent = '✅ Принять';
        acceptBtn.onclick = function() {
            respondToVassalProposal(g.lordOf, true);
        };
        container.appendChild(acceptBtn);

        const rejectBtn = document.createElement('button');
        rejectBtn.className = 'btn btn-small';
        rejectBtn.textContent = '❌ Отказать';
        rejectBtn.onclick = function() {
            respondToVassalProposal(g.lordOf, false);
        };
        container.appendChild(rejectBtn);
    }
}

// ============================================================
// 4. ЗАХВАТ ЗАМКА → АВТОМАТИЧЕСКИЙ ВАССАЛИТЕТ
// ============================================================
function captureHouse(houseId, attackerId) {
    const house = HOUSES[houseId];
    const attacker = HOUSES[attackerId];
    if (!house || !attacker) return;

    // Проверяем, что дом не уже вассал атакующего
    if (house.liege === attackerId) {
        setMessage('❌ Этот дом уже ваш вассал.');
        return;
    }

    // Находим лордов
    const oldLord = findLordOf(houseId);
    const newLord = findLordOf(attackerId);

    if (!newLord) {
        setMessage('❌ У атакующего нет лорда.');
        return;
    }

    // Если у дома был лорд — снимаем
    if (oldLord) {
        users[oldLord].game.lordOf = null;
    }

    // Назначаем нового лорда (атакующий становится лордом захваченного дома)
    users[newLord].game.lordOf = houseId;

    // Дом становится вассалом атакующего
    house.liege = attackerId;
    attacker.vassals.push(houseId);

    setMessage(`🏰 ${house.name} захвачен! ${newLord} — новый лорд.`);
    setMessage(`🏛️ ${house.name} стал вассалом ${attacker.name}.`);
    addLog(`🏰 ${house.name} захвачен ${newLord}`);
    addLog(`🏛️ ${house.name} стал вассалом ${attacker.name}`);
    saveData();
    updateMenu();
}

// ============================================================
// 5. НАЙТИ ЛОРДА ДОМА
// ============================================================
function findLordOf(houseId) {
    for (let username in users) {
        if (users[username].game.lordOf === houseId) {
            return username;
        }
    }
    return null;
}
