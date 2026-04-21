document.addEventListener('DOMContentLoaded', function() {
    
    // --- VARIABLES ---
    let score = 0;
    let rps = 0;
    let clickValueBase = 1;
    let totalClicks = 0;
    
    let combo = 0; 
    const COMBO_DECAY = 0.5;
    const COMBO_GAIN = 4;
    let isFrenzy = false;

    let currentMult = 1; 

    const formatter = new Intl.NumberFormat('fr-FR');

    // --- DATABASE ---
    const items = [
        { id: 1, type: 'click', name: 'Laser', icon: '🔴', cost: 15, baseVal: 1, count: 0, multiplier: 1 },
        { id: 2, type: 'auto', name: 'Croquette', icon: '🍪', cost: 50, baseVal: 2, count: 0, multiplier: 1 },
        { id: 3, type: 'click', name: 'Plumeau', icon: '🪶', cost: 200, baseVal: 5, count: 0, multiplier: 1 },
        { id: 4, type: 'auto', name: 'Pâtée', icon: '🥫', cost: 500, baseVal: 15, count: 0, multiplier: 1 },
        { id: 5, type: 'click', name: 'Gant', icon: '🧤', cost: 1500, baseVal: 20, count: 0, multiplier: 1 },
        { id: 6, type: 'auto', name: 'Arbre', icon: '🌳', cost: 3000, baseVal: 50, count: 0, multiplier: 1 },
        { id: 7, type: 'auto', name: 'Château', icon: '🏰', cost: 10000, baseVal: 200, count: 0, multiplier: 1 },
        { id: 8, type: 'auto', name: 'Armée', icon: '🐈', cost: 100000, baseVal: 1500, count: 0, multiplier: 1 }
    ];

    const upgrades = [
        { id: 'u1', name: 'Pointeur Laser', icon: '🔦', cost: 500, desc: "Efficacité Lasers x2", trigger: () => items[0].count >= 10, effect: () => items[0].multiplier *= 2, bought: false },
        { id: 'u2', name: 'Croquettes Premium', icon: '✨', cost: 1000, desc: "Efficacité Croquettes x2", trigger: () => items[1].count >= 25, effect: () => items[1].multiplier *= 2, bought: false },
        { id: 'u3', name: 'Doigts Musclés', icon: '💪', cost: 5000, desc: "Clic de base +10", trigger: () => totalClicks >= 500, effect: () => clickValueBase += 10, bought: false },
        { id: 'u4', name: 'Pâtée Saumon', icon: '🐟', cost: 15000, desc: "Efficacité Pâtée x2", trigger: () => items[3].count >= 50, effect: () => items[3].multiplier *= 2, bought: false },
        { id: 'u5', name: 'Herbe Pure', icon: '🌿', cost: 50000, desc: "Production globale +20%", trigger: () => rps >= 1000, effect: () => items.forEach(i => i.multiplier *= 1.2), bought: false }
    ];

    // --- DOM ---
    const scoreEl = document.getElementById('score');
    const catImg = document.getElementById('cat-image');
    const shopContainer = document.getElementById('shop-list');
    const upgradesContainer = document.getElementById('upgrades-container');
    const rpsEl = document.getElementById('rps-val');
    const clickEl = document.getElementById('click-val');
    const comboFill = document.getElementById('combo-fill');
    const comboText = document.getElementById('combo-text');
    const multButtons = document.querySelectorAll('.mult-btn');
    const feedbackZone = document.getElementById('click-feedback-zone');
    
    // Tooltip global
    const tooltipEl = document.getElementById('game-tooltip');

    // --- INIT ---
    createShopHTML(); 
    updateDisplay();

    // --- LOOP ---
    setInterval(() => {
        if(rps > 0) score += rps / 10;

        // Combo
        if (combo > 0) {
            combo -= COMBO_DECAY;
            if (combo < 0) combo = 0;
        }
        updateComboUI();

        // Updates
        updateDisplay();
        refreshShopUI();
        checkUpgrades(); 
    }, 100);

    // --- EVENTS ---
    catImg.addEventListener('mousedown', (e) => {
        let val = getRealClickValue();
        if (isFrenzy) val *= 2;
        score += val;
        totalClicks++;
        combo = Math.min(100, combo + COMBO_GAIN);
        updateDisplay();
        refreshShopUI();
        spawnFloatingNumber(e.clientX, e.clientY, val);
    });

    multButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            multButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const val = btn.getAttribute('data-val');
            currentMult = val === 'next' ? 'next' : parseInt(val);
            refreshShopUI();
        });
    });

    // --- LOGIC ---
    function getRealClickValue() {
        let bonus = items.filter(i => i.type === 'click').reduce((acc, i) => acc + (i.count * i.baseVal * i.multiplier), 0);
        return clickValueBase + bonus;
    }

    function updateRPS() {
        rps = items.filter(i => i.type === 'auto').reduce((acc, i) => acc + (i.count * i.baseVal * i.multiplier), 0);
    }

    function calculateCost(item, amount) {
        let cost = 0;
        let tempCost = item.cost;
        for(let i=0; i<amount; i++) {
            cost += tempCost;
            tempCost = Math.ceil(tempCost * 1.2);
        }
        return cost;
    }

    function getTargetAmount(item) {
        if (currentMult === 'next') {
            let next = 0;
            if (item.count < 25) next = 25;
            else if (item.count < 50) next = 50;
            else if (item.count < 100) next = 100;
            else next = Math.ceil((item.count + 1) / 100) * 100;
            return Math.max(1, next - item.count);
        }
        return currentMult;
    }

    function getMaxAffordable(item) {
        let affordable = 0;
        let currentTotal = 0;
        let tempCost = item.cost;
        while (affordable < 1000) { 
            if (score >= currentTotal + tempCost) {
                currentTotal += tempCost;
                affordable++;
                tempCost = Math.ceil(tempCost * 1.2);
            } else {
                break;
            }
        }
        return affordable;
    }

    // --- RENDER ---
    function createShopHTML() {
        shopContainer.innerHTML = '';
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'shop-item';
            div.id = `item-div-${item.id}`;
            
            div.innerHTML = `
                <div class="item-left">
                    <h4>${item.icon} ${item.name}</h4>
                    <p id="item-bonus-${item.id}"></p>
                </div>
                <button class="buy-btn" id="btn-${item.id}"></button>
            `;

            div.querySelector('button').addEventListener('click', () => {
                const targetAmt = getTargetAmount(item);
                const targetCost = calculateCost(item, targetAmt);
                
                let amountToBuy = 0;
                let costToPay = 0;

                if (score >= targetCost) {
                    amountToBuy = targetAmt;
                    costToPay = targetCost;
                } else {
                    const maxAff = getMaxAffordable(item);
                    if (maxAff > 0) {
                        amountToBuy = maxAff;
                        costToPay = calculateCost(item, maxAff);
                    }
                }

                if (amountToBuy > 0) {
                    score -= costToPay;
                    for(let i=0; i<amountToBuy; i++) {
                        item.count++;
                        item.cost = Math.ceil(item.cost * 1.2);
                    }
                    updateRPS();
                    refreshShopUI();
                    updateDisplay();
                }
            });

            shopContainer.appendChild(div);
        });
    }

    function refreshShopUI() {
        items.forEach(item => {
            const btn = document.getElementById(`btn-${item.id}`);
            const bonusText = document.getElementById(`item-bonus-${item.id}`);
            
            let prod = item.baseVal * item.multiplier;
            bonusText.textContent = (item.type === 'click' ? `+${prod} clic` : `+${prod}/sec`) + ` (Niv.${item.count})`;

            const targetAmt = getTargetAmount(item);
            const targetCost = calculateCost(item, targetAmt);

            btn.innerHTML = `<span style="font-size:0.8em">x${targetAmt}</span><br>${formatter.format(targetCost)}`;

            if (score < item.cost) {
                btn.disabled = true;
                btn.className = 'buy-btn';
            } else if (score < targetCost) {
                btn.disabled = false;
                btn.className = 'buy-btn partial-lock';
            } else {
                btn.disabled = false;
                btn.className = 'buy-btn';
            }
        });
        
        upgrades.forEach(upg => {
            if(upg.visible && !upg.bought) {
                const btn = document.getElementById(`upg-btn-${upg.id}`);
                if(btn) {
                    btn.style.opacity = (score < upg.cost) ? "0.5" : "1";
                    btn.style.cursor = (score < upg.cost) ? "not-allowed" : "pointer";
                }
            }
        });
    }

    function updateDisplay() {
        scoreEl.textContent = formatter.format(Math.floor(score));
        rpsEl.textContent = formatter.format(Math.floor(rps));
        let dispClick = getRealClickValue();
        if (isFrenzy) dispClick *= 2;
        clickEl.textContent = formatter.format(Math.floor(dispClick));
        document.title = `${formatter.format(Math.floor(score))} - Akipouette`;
    }

    function updateComboUI() {
        comboFill.style.width = `${combo}%`;
        if (combo >= 99) {
            isFrenzy = true;
            comboFill.classList.add('frenzy');
            comboText.textContent = "FRENZY! x2 CLICS";
            comboText.classList.add('active');
        } else {
            isFrenzy = false;
            comboFill.classList.remove('frenzy');
            comboText.textContent = combo > 0 ? "Combo..." : "x1";
            comboText.classList.remove('active');
        }
    }

    function checkUpgrades() {
        upgrades.forEach(upg => {
            if (!upg.bought && !upg.visible && upg.trigger()) {
                upg.visible = true;
                const el = document.createElement('div');
                el.className = 'upgrade-item';
                el.id = `upg-btn-${upg.id}`;
                el.innerHTML = upg.icon;
                
                // --- EVENTS TOOLTIP JS ---
                el.addEventListener('mouseenter', () => showTooltip(upg));
                el.addEventListener('mouseleave', hideTooltip);
                el.addEventListener('mousemove', moveTooltip);

                el.addEventListener('click', () => {
                    if (score >= upg.cost) {
                        score -= upg.cost;
                        upg.bought = true;
                        upg.effect();
                        el.remove();
                        hideTooltip(); // Cacher l'info-bulle après achat
                        updateRPS();
                        refreshShopUI();
                    }
                });
                upgradesContainer.appendChild(el);
            }
        });
    }

    // --- TOOLTIP LOGIC ---
    function showTooltip(upg) {
        tooltipEl.classList.remove('hidden');
        tooltipEl.innerHTML = `
            <h4>${upg.name}</h4>
            <div class="desc">${upg.desc}</div>
            <div class="cost">Coût : ${formatter.format(upg.cost)} Ronrons</div>
        `;
    }

    function moveTooltip(e) {
        // Décalage de 15px pour ne pas être sous la souris
        tooltipEl.style.left = (e.clientX + 15) + 'px';
        tooltipEl.style.top = (e.clientY + 15) + 'px';
    }

    function hideTooltip() {
        tooltipEl.classList.add('hidden');
    }

    function spawnFloatingNumber(x, y, val) {
        const el = document.createElement('div');
        el.classList.add('float-num');
        el.textContent = `+${formatter.format(Math.floor(val))}`;
        const rX = (Math.random() * 40) - 20;
        const rY = (Math.random() * 40) - 20;
        el.style.left = `${x + rX}px`;
        el.style.top = `${y + rY}px`;
        if(isFrenzy) { el.style.color = "#ffd700"; el.style.fontSize = "2.5rem"; }
        feedbackZone.appendChild(el);
        setTimeout(() => el.remove(), 800);
    }
});