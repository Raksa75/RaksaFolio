/* ── TERMINAL & GAMES ───────────────────────── */

// FR / EN pick for terminal & game UI strings (secret command replies stay as written)
const tr = (fr, en) => (typeof currentLang !== 'undefined' && currentLang === 'en' ? en : fr);
const cInput = document.getElementById('c-input');
const cHistory = document.getElementById('c-history');
const cInputRow = document.getElementById('c-input-row');
const canvas = document.getElementById('game-canvas');

// AJOUT : Focus l'input au clic n'importe où dans la console
document.getElementById('c-body').addEventListener('click', () => {
    if (!gameActive) {
        cInput.focus();
    }
});

const gControls = document.getElementById('g-controls');
const ctx = canvas.getContext('2d');

let gameAnimFrame;
let gameActive = false;
let currentGame = null;

// Ecoute de la touche F8/Escape globale pour quitter les jeux
document.addEventListener('keydown', e => {
    if ((e.key === 'F8' || e.key === 'Escape') && gameActive) {
        stopGame();
        e.preventDefault();
    }
});


function cLog(txt, color) {
    const d = document.createElement('div');
    d.className = 'console-line';
    d.style.color = color || 'var(--v2)';
    d.innerHTML = txt;
    cHistory.appendChild(d);
    document.getElementById('c-body').scrollTop = 99999;
}

cInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const val = cInput.value.trim(); if (!val) return;
    runCommand(val);
});

function runCommand(val) {
    cLog('> ' + esc(val), 'var(--dim)');
    const v = val.toLowerCase();

    if (v === 'play spaceinvader') startGame('spaceinvader');
    else if (v === 'play pacman') startGame('pacman');
    else if (v === 'play frogger') startGame('frogger');
    else if (v === 'play trex' || v === 'play t-rex') startGame('trex');
    else if (v === 'play breakout' || v === 'play casse-brique') startGame('breakout');
    else if (v === 'play pong') startGame('pong');
    else if (v === 'play snake') startGame('snake');
    else if (v === 'play flappy' || v === 'play flappy bird') startGame('flappy');
    else if (v === 'play demineur' || v === 'play démineur' || v === 'play minesweeper') startGame('demineur');
    else if (v === 'play doom') startGame('doom');
    else if (v === 'help') {
        cLog('// COMMANDS ──────────────────────────────────', 'var(--dim)');
        cLog('  <span style="color:var(--v2)">play doom</span>');
        cLog('  <span style="color:var(--v2)">play spaceinvader</span>');
        cLog('  <span style="color:var(--v2)">play pacman</span>');
        cLog('  <span style="color:var(--v2)">play frogger</span>');
        cLog('  <span style="color:var(--v2)">play trex</span>');
        cLog('  <span style="color:var(--v2)">play breakout</span>');
        cLog('  <span style="color:var(--v2)">play pong</span>');
        cLog('  <span style="color:var(--v2)">play snake</span>');
        cLog('  <span style="color:var(--v2)">play flappy</span>');
        cLog('  <span style="color:var(--v2)">play demineur</span>');
        cLog('// ─────────────────────────────────────────────', 'var(--dim)');
        cLog('  <span style="color:#00ff41">' + tr('Certaines commandes sont cachées - essaie de les trouver', 'Some commands are hidden - try to find them') + '</span>');
        cLog('// ─────────────────────────────────────────────', 'var(--dim)');
    }
    else if (v === 'goat') cLog('// OPESANEC - <a href="https://www.twitch.tv/opesanec" target="_blank" style="color:var(--v2);text-decoration:underline">twitch.tv/opesanec</a>', 'var(--cyan)');
    else if (v === 'lol') cLog('// pire jeu all time');
    else if (v === 'yuumi') cLog('// mérite une total destruction et disparition du jeu', '#f43f5e');
    else if (v === 'raksa') cLog('// moi');
    else if (v === 'lisa') cLog('// ADMV', '#f472b6');
    else if (v === 'akira' || v === 'akipouette') cLog('// la fifille', '#fbbf24');
    else if (v === 'reine') cLog('// lisa', '#f472b6');
    else if (v === 'remy') cLog('// giraffe');
    else if (v === 'opgg') cLog('// OP.GG - <a href="https://www.op.gg/summoners/euw/raksa-euw" target="_blank" style="color:var(--v2);text-decoration:underline">raksa#euw</a>', 'var(--cyan)');
    else if (v === 'zlan') cLog('// ZLAN 2022 - <a href="https://fr.wikipedia.org/wiki/ZLAN_2022" target="_blank" style="color:var(--v2);text-decoration:underline">Wikipedia</a>', 'var(--cyan)');
    else if (v === '67') cLog('// 67');
    else if (v === 'whatoubance') cLog('// Discord - <a href="https://discord.gg/TFERvKQSyr" target="_blank" style="color:var(--v2);text-decoration:underline">discord.gg/TFERvKQSyr</a>', 'var(--cyan)');
    else if (v === 'csgo') cLog('// mon enfance');
    else if (v === 'vakarm') cLog('// Profil Vakarm - <a href="https://www.vakarm.net/membre/fiche/Raksakoreko/34311" target="_blank" style="color:var(--v2);text-decoration:underline">Raksakoreko</a>', 'var(--cyan)');
    else if (v === 'fnatic') cLog('// les frères', '#f97316'); 
    else if (v === 'sona') cLog('// sexy sona');
    else if (v === 'yohann') cLog('// space mountain');
    else if (v === 'blueprint') cLog('// ça marche jamais'); 
    else if (v === 'bp') cLog('// ça marche jamais'); 
    else if (v === 'blueprints') cLog('// ça marche jamais'); 
    else if (v === 'html') cLog('// best prototypage');
    else if (v === 'css') cLog('// best prototypage');
    else if (v === 'js') cLog('// best prototypage');
    else if (v === 'lisaa') cLog('// je ne me prononcerai pas');
    else if (v === 'karim') cLog('// fou');
    else if (v === 'jetpack cat' || v === 'jetpack') cLog('// meow meow meow meow meow');
    else if (v === 'ascend rush' || v === 'ascend') cLog('// une meuf qui cours');
    else if (v === 'parastin') cLog('// gas');
    else if (v === 'fabien') cLog('// bel homme chauve');
    else if (v === 'clope' || v === 'cigarette') cLog('// de la merde', '#f43f5e');

    else { cLog(`'${esc(val)}' : ${tr('commande inconnue', 'unknown command')}`, '#f43f5e'); }
    cInput.value = '';
}

// Playground : clickable command chips
document.querySelectorAll('.cmd-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        if (gameActive) stopGame();
        runCommand(chip.dataset.cmd);
        if (!gameActive) document.querySelector('.console-wrap').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});

// GAME ENGINE - Delta Time
let keys = { left: false, right: false, space: false, up: false, down: false };
let player, bullets, aliens, alienDir, alienBaseSpeed, alienSpeed, gameOver, victory;
let siLastTS = 0;

// Global key handler for all games
window.addEventListener('keydown', e => {
    if (!gameActive) return;
    if (currentGame === 'spaceinvader') {
        if (e.key === 'ArrowLeft') { keys.left = true; e.preventDefault(); }
        if (e.key === 'ArrowRight') { keys.right = true; e.preventDefault(); }
        if (e.key === ' ') { keys.space = true; e.preventDefault(); }
    }
    if (currentGame === 'trex') {
        if (e.key === ' ' || e.key === 'ArrowUp') { keys.up = true; e.preventDefault(); }
    }
    if (currentGame === 'frogger') {
        const moves = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
        if (moves[e.key]) { froggerMove(moves[e.key]); e.preventDefault(); }
    }
    if (currentGame === 'pacman') {
        if (e.key === 'ArrowUp') { pmNextDir = { r: -1, c: 0 }; e.preventDefault(); }
        if (e.key === 'ArrowDown') { pmNextDir = { r: 1, c: 0 }; e.preventDefault(); }
        if (e.key === 'ArrowLeft') { pmNextDir = { r: 0, c: -1 }; e.preventDefault(); }
        if (e.key === 'ArrowRight') { pmNextDir = { r: 0, c: 1 }; e.preventDefault(); }
    }
    if (currentGame === 'breakout') {
        if (e.key === 'ArrowLeft')  { keys.left  = true; e.preventDefault(); }
        if (e.key === 'ArrowRight') { keys.right = true; e.preventDefault(); }
    }
    if (currentGame === 'pong') {
        if (e.key === 'ArrowUp')   { keys.up   = true; e.preventDefault(); }
        if (e.key === 'ArrowDown') { keys.down = true; e.preventDefault(); }
    }
    if (currentGame === 'snake') {
        const _sd = { ArrowUp:{r:-1,c:0}, ArrowDown:{r:1,c:0}, ArrowLeft:{r:0,c:-1}, ArrowRight:{r:0,c:1} };
        if (_sd[e.key]) { snakeNextDir = _sd[e.key]; e.preventDefault(); }
    }
    if (currentGame === 'flappy') {
        if (e.key === ' ' || e.key === 'ArrowUp') { keys.space = true; e.preventDefault(); }
    }
});
window.addEventListener('keyup', e => {
    if (!gameActive) return;
    if (currentGame === 'spaceinvader') {
        if (e.key === 'ArrowLeft') keys.left = false;
        if (e.key === 'ArrowRight') keys.right = false;
        if (e.key === ' ') keys.space = false;
    }
    if (currentGame === 'trex') {
        if (e.key === ' ' || e.key === 'ArrowUp') keys.up = false;
    }
    if (currentGame === 'breakout') {
        if (e.key === 'ArrowLeft')  keys.left  = false;
        if (e.key === 'ArrowRight') keys.right = false;
    }
    if (currentGame === 'pong') {
        if (e.key === 'ArrowUp')   keys.up   = false;
        if (e.key === 'ArrowDown') keys.down = false;
    }
    if (currentGame === 'flappy') {
        if (e.key === ' ' || e.key === 'ArrowUp') keys.space = false;
    }
});

// Mobile Controls
const btnL = document.getElementById('btn-left');
const btnR = document.getElementById('btn-right');
const btnF = document.getElementById('btn-fire');
const btnE = document.getElementById('btn-exit');

const btnU = document.getElementById('btn-up');
const btnD = document.getElementById('btn-down');

function bindKey(btn, down, up) {
    const si = () => currentGame === 'spaceinvader';
    btn.addEventListener('mousedown', () => { if (gameActive) down(); });
    btn.addEventListener('mouseup', () => { if (gameActive) up(); });
    btn.addEventListener('touchstart', e => { if (gameActive) { down(); e.preventDefault(); } }, { passive: false });
    btn.addEventListener('touchend', e => { if (gameActive) { up(); e.preventDefault(); } }, { passive: false });
}
// Space invader directional
bindKey(btnL, () => { if (currentGame === 'spaceinvader') keys.left = true; if (currentGame === 'breakout') keys.left = true; if (currentGame === 'snake') snakeNextDir = { r: 0, c: -1 }; if (currentGame === 'frogger') froggerMove('left'); if (currentGame === 'pacman') pmNextDir = { r: 0, c: -1 }; }, () => { keys.left = false; });
bindKey(btnR, () => { if (currentGame === 'spaceinvader') keys.right = true; if (currentGame === 'breakout') keys.right = true; if (currentGame === 'snake') snakeNextDir = { r: 0, c: 1 }; if (currentGame === 'frogger') froggerMove('right'); if (currentGame === 'pacman') pmNextDir = { r: 0, c: 1 }; }, () => { keys.right = false; });
bindKey(btnF, () => { if (currentGame === 'spaceinvader') keys.space = true; if (currentGame === 'trex') keys.up = true; if (currentGame === 'flappy') keys.space = true; }, () => { keys.space = false; keys.up = false; });
bindKey(btnU, () => { if (currentGame === 'trex') keys.up = true; if (currentGame === 'pong') keys.up = true; if (currentGame === 'snake') snakeNextDir = { r: -1, c: 0 }; if (currentGame === 'frogger') froggerMove('up'); if (currentGame === 'pacman') pmNextDir = { r: -1, c: 0 }; }, () => { keys.up = false; });
bindKey(btnD, () => { if (currentGame === 'pong') keys.down = true; if (currentGame === 'snake') snakeNextDir = { r: 1, c: 0 }; if (currentGame === 'frogger') froggerMove('down'); if (currentGame === 'pacman') pmNextDir = { r: 1, c: 0 }; }, () => { keys.down = false; });
// Extra left/right for frogger/pacman
btnL.addEventListener('touchstart', e => { if (currentGame === 'frogger') { froggerMove('left'); e.preventDefault(); } if (currentGame === 'pacman') { pmNextDir = { r: 0, c: -1 }; e.preventDefault(); } }, { passive: false });
btnR.addEventListener('touchstart', e => { if (currentGame === 'frogger') { froggerMove('right'); e.preventDefault(); } if (currentGame === 'pacman') { pmNextDir = { r: 0, c: 1 }; e.preventDefault(); } }, { passive: false });
btnE.addEventListener('click', stopGame);
btnE.addEventListener('touchstart', e => { e.preventDefault(); stopGame(); }, { passive: false });

function initSpaceInvaders() {
    player = { x: canvas.width / 2 - 15, y: canvas.height - 30, w: 30, h: 10, speed: 5, cooldown: 0 };
    bullets = [];
    aliens = [];
    alienDir = 1;
    alienBaseSpeed = 0.8;
    alienSpeed = alienBaseSpeed;
    gameOver = false;
    victory = false;
    keys.space = false;
    siLastTS = 0;

    const rows = 4, cols = 8;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            aliens.push({ x: 50 + c * 50, y: 30 + r * 40, w: 24, h: 16 });
        }
    }
}

function showBtns(l, r, f, u, d) {
    btnL.style.display = l ? 'block' : 'none';
    btnR.style.display = r ? 'block' : 'none';
    btnF.style.display = f ? 'block' : 'none';
    btnU.style.display = u ? 'block' : 'none';
    btnD.style.display = d ? 'block' : 'none';
}

function startGame(gameType) {
    cHistory.style.display = 'none';
    cInputRow.style.display = 'none';
    gControls.classList.add('active');
    gameActive = true;
    currentGame = gameType;
    canvas.style.display = 'block';
    gameOver = false; victory = false;

    if (gameType === 'spaceinvader') {
        showBtns(1, 1, 1, 0, 0);
        btnF.textContent = 'FIRE';
        initSpaceInvaders();
        gameAnimFrame = requestAnimationFrame(gameLoop);
    } else if (gameType === 'doom') {
        showBtns(0, 0, 0, 0, 0); // Cache les contrôles mobiles
        gControls.style.display = 'flex'; // AJOUT : Force l'affichage de la barre pour le bouton EXIT

        const ifr = document.getElementById('game-iframe');
        ifr.src = "https://gmh-code.github.io/dwasm/";
        ifr.style.display = 'block';
        canvas.style.display = 'none';
    } else if (gameType === 'trex') {
        showBtns(0, 0, 1, 1, 0);
        btnF.textContent = '▲ JUMP';
        initTrex();
        gameAnimFrame = requestAnimationFrame(trexLoop);
    } else if (gameType === 'breakout') {
        showBtns(1, 1, 0, 0, 0);
        initBreakout();
        gameAnimFrame = requestAnimationFrame(breakoutLoop);
    } else if (gameType === 'pong') {
        showBtns(0, 0, 0, 1, 1);
        initPong();
        gameAnimFrame = requestAnimationFrame(pongLoop);
    } else if (gameType === 'snake') {
        showBtns(1, 1, 0, 1, 1);
        initSnake();
        gameAnimFrame = requestAnimationFrame(snakeLoop);
    } else if (gameType === 'flappy') {
        showBtns(0, 0, 1, 0, 0);
        initFlappy();
        gameAnimFrame = requestAnimationFrame(flappyLoop);
    } else if (gameType === 'demineur') {
        showBtns(0, 0, 0, 0, 0);
        initDemineur();
    } else if (gameType === 'frogger') {
        showBtns(1, 1, 0, 1, 1);
        initFrogger();
        gameAnimFrame = requestAnimationFrame(froggerLoop);
    } else if (gameType === 'pacman') {
        showBtns(1, 1, 0, 1, 1);
        initPacman();
        gameAnimFrame = requestAnimationFrame(pacmanLoop);
    }

    setTimeout(() => canvas.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
}

function stopGame() {
    canvas.removeEventListener('click', _dmClick);
    canvas.removeEventListener('contextmenu', _dmRClick);
    if (!gameActive) return;
    gameActive = false;
    currentGame = null;

    cancelAnimationFrame(gameAnimFrame);
    canvas.style.display = 'none';

    const ifr = document.getElementById('game-iframe');
    if (ifr) {
        ifr.style.display = 'none';
        ifr.src = "";
    }
    gControls.style.display = ''; // AJOUT : Retire l'affichage forcé
    gControls.classList.remove('active');
    cHistory.style.display = 'block';
    cInputRow.style.display = 'flex';
    cInput.focus();

    const cBody = document.getElementById('c-body');
    cBody.scrollTop = cBody.scrollHeight;
}

function rectIntersect(r1, r2) {
    return !(r2.x > r1.x + r1.w || r2.x + r2.w < r1.x || r2.y > r1.y + r1.h || r2.y + r2.h < r1.y);
}

function gameLoop(timestamp) {
    if (!gameActive || currentGame !== 'spaceinvader') return;

    // ── DELTA TIME (frame-rate independent) ──
    if (!siLastTS) siLastTS = timestamp;
    const delta = Math.min((timestamp - siLastTS) / 16.667, 3.5); // cap at 3.5× (avoids huge jumps on tab focus)
    siLastTS = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver || victory) {
        ctx.fillStyle = '#fff';
        ctx.font = '24px "IBM Plex Mono"';
        ctx.textAlign = 'center';
        ctx.fillText(victory ? 'VICTORY !' : 'GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = '14px "IBM Plex Mono"';
        ctx.fillText('Press SPACE / FIRE to restart', canvas.width / 2, canvas.height / 2 + 30);
        if (keys.space) initSpaceInvaders();
        gameAnimFrame = requestAnimationFrame(gameLoop);
        return;
    }

    // Player Update
    if (keys.left && player.x > 0) player.x -= player.speed * delta;
    if (keys.right && player.x + player.w < canvas.width) player.x += player.speed * delta;

    if (keys.space && player.cooldown <= 0) {
        bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 10, dy: -7, type: 'p' });
        player.cooldown = 15;
    }
    if (player.cooldown > 0) player.cooldown -= delta;

    // Bullets Update
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.y += b.dy * delta;
        if (b.y < 0 || b.y > canvas.height) { bullets.splice(i, 1); continue; }

        if (b.type === 'p') {
            for (let j = aliens.length - 1; j >= 0; j--) {
                if (rectIntersect(b, aliens[j])) {
                    aliens.splice(j, 1);
                    bullets.splice(i, 1);
                    alienSpeed += 0.03;
                    break;
                }
            }
        } else if (b.type === 'a') {
            if (rectIntersect(b, player)) gameOver = true;
        }
    }

    // Aliens Update
    let edgeHit = false;
    for (const a of aliens) {
        a.x += alienSpeed * alienDir * delta;
        if (a.x <= 10 || a.x + a.w >= canvas.width - 10) edgeHit = true;
        if (Math.random() < 0.0006 * delta) {
            bullets.push({ x: a.x + a.w / 2 - 2, y: a.y + a.h, w: 4, h: 10, dy: 4, type: 'a' });
        }
    }
    if (edgeHit) {
        alienDir *= -1;
        for (const a of aliens) {
            a.x += alienSpeed * alienDir * delta;
            a.y += 18;
            if (a.y + a.h >= player.y) gameOver = true;
        }
    }

    if (aliens.length === 0) victory = true;

    // ── DRAW ──
    // Player (ship shape)
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillRect(player.x + 10, player.y - 6, 10, 6);

    // Aliens
    ctx.fillStyle = '#22d3ee';
    for (const a of aliens) {
        ctx.fillRect(a.x, a.y, a.w, a.h);
        ctx.fillRect(a.x + 4, a.y + a.h, 4, 4);
        ctx.fillRect(a.x + a.w - 8, a.y + a.h, 4, 4);
    }

    // Bullets
    for (const b of bullets) {
        ctx.fillStyle = b.type === 'p' ? '#a855f7' : '#f43f5e';
        ctx.fillRect(b.x, b.y, b.w, b.h);
    }

    gameAnimFrame = requestAnimationFrame(gameLoop);
}



// ═══════════════════════════════════════════════════
//  T-REX RUNNER
// ═══════════════════════════════════════════════════
let trex, trexObs, trexScore, trexSpeed, trexSpawn, trexLastTS;
const GROUND = canvas.height - 55;

function initTrex() {
    trex = { x: 80, y: GROUND - 45, w: 28, h: 45, vy: 0, onGround: true, legPhase: 0 };
    trexObs = [];
    trexScore = 0; trexSpeed = 4; trexSpawn = 90; trexLastTS = 0;
    gameOver = false; victory = false; keys.up = false;
}

function trexLoop(ts) {
    if (!gameActive || currentGame !== 'trex') return;
    const dt = trexLastTS ? Math.min((ts - trexLastTS) / 16.667, 3) : 1;
    trexLastTS = ts;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver || victory) {
        ctx.fillStyle = '#fff'; ctx.font = '22px "IBM Plex Mono"'; ctx.textAlign = 'center';
        ctx.fillText(victory ? 'YOU WIN' : 'GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = '13px "IBM Plex Mono"';
        ctx.fillText('Press SPACE / JUMP to restart', canvas.width / 2, canvas.height / 2 + 28);
        if (keys.up || keys.space) { initTrex(); }
        gameAnimFrame = requestAnimationFrame(trexLoop); return;
    }

    // Jump
    if ((keys.up || keys.space) && trex.onGround) { trex.vy = -13; trex.onGround = false; }
    trex.vy += 0.55 * dt;
    trex.y += trex.vy * dt;
    if (trex.y >= GROUND - trex.h) { trex.y = GROUND - trex.h; trex.vy = 0; trex.onGround = true; }
    if (trex.onGround) trex.legPhase += 0.25 * dt;

    // Obstacles
    trexSpawn -= dt;
    if (trexSpawn <= 0) {
        const h = 30 + Math.random() * 40;
        trexObs.push({ x: canvas.width + 10, y: GROUND - h, w: 18 + Math.random() * 14, h });
        trexSpawn = 55 + Math.random() * 55 - trexScore * 0.03;
    }
    for (let i = trexObs.length - 1; i >= 0; i--) {
        trexObs[i].x -= trexSpeed * dt;
        if (trexObs[i].x + trexObs[i].w < 0) { trexObs.splice(i, 1); continue; }
        if (rectIntersect({ x: trex.x + 4, y: trex.y + 4, w: trex.w - 8, h: trex.h - 4 }, trexObs[i])) gameOver = true;
    }
    trexScore += dt * 0.2;
    trexSpeed = 4 + trexScore * 0.012;

    // Draw ground
    ctx.fillStyle = '#1c2040'; ctx.fillRect(0, GROUND, canvas.width, 3);
    ctx.fillStyle = '#252850'; ctx.fillRect(0, GROUND + 3, canvas.width, canvas.height - GROUND - 3);

    // Draw dino (pixel art style)
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(trex.x, trex.y, trex.w, trex.h);            // body
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(trex.x + trex.w, trex.y, 12, 16);              // head
    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(trex.x + trex.w + 8, trex.y + 4, 4, 4);           // eye
    // legs
    ctx.fillStyle = '#7c3aed';
    const lp = Math.sin(trex.legPhase) * 6;
    ctx.fillRect(trex.x + 4, trex.y + trex.h, 8, trex.onGround ? 8 + lp : 12);
    ctx.fillRect(trex.x + 16, trex.y + trex.h, 8, trex.onGround ? 8 - lp : 8);

    // Draw obstacles
    ctx.fillStyle = '#22d3ee';
    for (const o of trexObs) {
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.fillStyle = '#0891b2';
        ctx.fillRect(o.x + o.w / 2 - 3, o.y - 8, 6, 10);
        ctx.fillStyle = '#22d3ee';
    }

    // Score
    ctx.fillStyle = 'var(--dim)'; ctx.font = '13px "IBM Plex Mono"'; ctx.textAlign = 'right';
    ctx.fillText('SCORE: ' + Math.floor(trexScore), canvas.width - 10, 20);

    gameAnimFrame = requestAnimationFrame(trexLoop);
}

// ═══════════════════════════════════════════════════
//  FROGGER
// ═══════════════════════════════════════════════════
let frog, frogCars, froggerLastTS, frogDead, frogWin;
const FR_ROWS = 9, FR_COLS = 12, FR_CW = 50, FR_CH = Math.floor(canvas.height / FR_ROWS);
const FR_LANES = [
    { type: 'safe' },
    { type: 'road', dir: 1, speed: 1.1, carW: 70 },
    { type: 'road', dir: -1, speed: 1.5, carW: 80 },
    { type: 'road', dir: 1, speed: 1.3, carW: 65 },
    { type: 'safe' },
    { type: 'road', dir: -1, speed: 1.0, carW: 85 },
    { type: 'road', dir: 1, speed: 1.7, carW: 60 },
    { type: 'road', dir: -1, speed: 1.2, carW: 75 },
    { type: 'safe' },
];

function initFrogger() {
    frog = { col: 5, row: FR_ROWS - 1 };
    frogCars = [];
    for (let r = 0; r < FR_ROWS; r++) {
        const lane = FR_LANES[r]; if (lane.type !== 'road') continue;
        for (let i = 0; i < 3; i++) {
            frogCars.push({
                row: r, x: (i / 3) * canvas.width + Math.random() * FR_CW * 2,
                w: lane.carW, dir: lane.dir, speed: lane.speed
            });
        }
    }
    frogDead = false; frogWin = false; froggerLastTS = 0;
    gameOver = false; victory = false;
}

function froggerMove(dir) {
    if (!gameActive || currentGame !== 'frogger') return;
    if (frogDead || frogWin) { initFrogger(); return; }
    if (dir === 'up' && frog.row > 0) frog.row--;
    if (dir === 'down' && frog.row < FR_ROWS - 1) frog.row++;
    if (dir === 'left' && frog.col > 0) frog.col--;
    if (dir === 'right' && frog.col < FR_COLS - 1) frog.col++;
    if (frog.row === 0) { frogWin = true; victory = true; }
}

function froggerLoop(ts) {
    if (!gameActive || currentGame !== 'frogger') return;
    const dt = froggerLastTS ? Math.min((ts - froggerLastTS) / 16.667, 3) : 1;
    froggerLastTS = ts;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver || victory) {
        ctx.fillStyle = '#fff'; ctx.font = '22px "IBM Plex Mono"'; ctx.textAlign = 'center';
        ctx.fillText(victory ? 'HOME SAFE !' : 'GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = '13px "IBM Plex Mono"';
        ctx.fillText('Arrow key to restart', canvas.width / 2, canvas.height / 2 + 28);
        gameAnimFrame = requestAnimationFrame(froggerLoop); return;
    }

    for (const car of frogCars) {
        car.x += car.dir * car.speed * dt;
        if (car.dir > 0 && car.x > canvas.width + 10) car.x = -car.w - 10;
        if (car.dir < 0 && car.x < -car.w - 10) car.x = canvas.width + 10;
    }

    for (let r = 0; r < FR_ROWS; r++) {
        const y = r * FR_CH, lane = FR_LANES[r];
        ctx.fillStyle = r === 0 ? '#0f2018' : lane.type === 'safe' ? '#0d1a10' : '#110d1e';
        ctx.fillRect(0, y, canvas.width, FR_CH);
        if (lane.type === 'road') {
            ctx.strokeStyle = '#251d40'; ctx.setLineDash([18, 18]);
            ctx.beginPath(); ctx.moveTo(0, y + FR_CH / 2); ctx.lineTo(canvas.width, y + FR_CH / 2); ctx.stroke();
            ctx.setLineDash([]);
        }
    }
    // Goal row markers
    for (let cc = 0; cc < FR_COLS; cc++) {
        ctx.fillStyle = '#0a2014'; ctx.fillRect(cc * FR_CW + 4, 4, FR_CW - 8, FR_CH - 8);
    }
    ctx.fillStyle = '#00ff88'; ctx.font = '10px "IBM Plex Mono"'; ctx.textAlign = 'center';
    ctx.fillText('HOME', canvas.width / 2, FR_CH / 2 + 4);

    for (const car of frogCars) {
        const cy = car.row * FR_CH;
        ctx.fillStyle = '#e11d48'; ctx.fillRect(car.x, cy + 5, car.w, FR_CH - 10);
        ctx.fillStyle = '#fbbf24'; ctx.fillRect(car.x + (car.dir > 0 ? car.w - 8 : 4), cy + 8, 6, 6);
    }

    const fx = frog.col * FR_CW, fy = frog.row * FR_CH;
    for (const car of frogCars) {
        if (car.row === frog.row && !(fx + FR_CW - 8 < car.x || fx + 8 > car.x + car.w)) { frogDead = true; gameOver = true; }
    }

    ctx.fillStyle = frogDead ? '#f43f5e' : '#a855f7';
    ctx.fillRect(fx + 8, fy + 6, FR_CW - 16, FR_CH - 12);
    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(fx + 10, fy + 8, 6, 5); ctx.fillRect(fx + FR_CW - 16, fy + 8, 6, 5);
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(fx + 6, fy + FR_CH - 10, 8, 6); ctx.fillRect(fx + FR_CW - 14, fy + FR_CH - 10, 8, 6);

    gameAnimFrame = requestAnimationFrame(froggerLoop);
}

//  PACMAN - Classic layout (28×31)
// ═══════════════════════════════════════════════════
// '#'=wall  '.'=dot  'O'=power pellet  ' '=open  'P'=start
const PM_DEF = [
    '############################',
    '#............##............#',
    '#.####.#####.##.#####.####.#',
    '#O####.#####.##.#####.####O#',
    '#.####.#####.##.#####.####.#',
    '#..........................#',
    '#.####.##.########.##.####.#',
    '#.####.##.########.##.####.#',
    '#......##....##....##......#',
    '######.#####.##.#####.######',
    '     #.#####.##.#####.#     ',
    '     #.##          ##.#     ',
    '     #.## ###  ### ##.#     ',
    '######.## #      # ##.######',
    '      .   #      #   .      ',
    '######.## #      # ##.######',
    '     #.## ######## ##.#     ',
    '     #.##          ##.#     ',
    '     #.## ######## ##.#     ',
    '######.## ######## ##.######',
    '#............##............#',
    '#.####.#####.##.#####.####.#',
    '#O..##................##..O#',
    '###.##.##.########.##.##.###',
    '###.##.##.########.##.##.###',
    '#......##....##....##......#',
    '#.##########.##.##########.#',
    '#.##########.##.##########.#',
    '#...........P..............#',
    '############################',
    '############################',
];
const PM_C = 28, PM_R = 31, PM_S = 13;
const PM_OX = Math.floor((600 - PM_C * PM_S) / 2); // center horizontally
let pmMap, pmPac, pmDir, pmNextDir, pmDots, pmMoveTimer, pmLastTS, pmScore;

function pmOpen(r, c) {
    r = (r + PM_R) % PM_R; c = (c + PM_C) % PM_C;
    return pmMap[r] && pmMap[r][c] !== 1;
}

function initPacman() {
    pmMap = PM_DEF.map(row => {
        const arr = [];
        for (let i = 0; i < PM_C; i++) {
            const ch = row[i] || ' ';
            arr.push(ch === '#' ? 1 : ch === '.' ? 0 : ch === 'O' ? 2 : 3);
        }
        return arr;
    });
    let pRow = 29, pCol = 13;
    for (let r = 0; r < PM_R; r++) for (let c = 0; c < PM_C; c++) if (PM_DEF[r][c] === 'P') { pRow = r; pCol = c; pmMap[r][c] = 3; }
    pmPac = { r: pRow, c: pCol };
    pmDir = { r: 0, c: 0 }; pmNextDir = { r: 0, c: 0 };
    pmDots = 0;
    for (let r = 0; r < PM_R; r++) for (let c = 0; c < PM_C; c++) if (pmMap[r][c] === 0 || pmMap[r][c] === 2) pmDots++;
    pmScore = 0; pmMoveTimer = 0; pmLastTS = 0;
    gameOver = false; victory = false;
}

function pacmanLoop(ts) {
    if (!gameActive || currentGame !== 'pacman') return;
    const dt = pmLastTS ? Math.min((ts - pmLastTS) / 16.667, 3) : 1;
    pmLastTS = ts;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver || victory) {
        ctx.fillStyle = '#fff'; ctx.font = '20px "IBM Plex Mono"'; ctx.textAlign = 'center';
        ctx.fillText(victory ? 'YOU WIN !' : 'GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = '12px "IBM Plex Mono"'; ctx.fillStyle = '#4a5070';
        ctx.fillText('Arrow key to restart', canvas.width / 2, canvas.height / 2 + 24);
        if (pmNextDir.r || pmNextDir.c) initPacman();
        gameAnimFrame = requestAnimationFrame(pacmanLoop); return;
    }

    // Move pacman
    pmMoveTimer -= dt;
    if (pmMoveTimer <= 0) {
        pmMoveTimer = 16;
        const nr = pmPac.r + pmNextDir.r, nc = (pmPac.c + pmNextDir.c + PM_C) % PM_C;
        if (pmOpen(nr, nc) && (pmNextDir.r || pmNextDir.c)) pmDir = { ...pmNextDir };
        const mr = (pmPac.r + pmDir.r + PM_R) % PM_R, mc = (pmPac.c + pmDir.c + PM_C) % PM_C;
        if (pmOpen(mr, mc)) { pmPac.r = mr; pmPac.c = mc; }
        const cell = pmMap[pmPac.r][pmPac.c];
        if (cell === 0) { pmMap[pmPac.r][pmPac.c] = 3; pmScore += 10; pmDots--; }
        if (cell === 2) { pmMap[pmPac.r][pmPac.c] = 3; pmScore += 50; pmDots--; }
        if (pmDots <= 0) victory = true;
    }

    // Draw maze
    ctx.fillStyle = '#06070d'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < PM_R; r++) {
        for (let c = 0; c < PM_C; c++) {
            const x = PM_OX + c * PM_S, y = r * PM_S, cell = pmMap[r][c];
            if (cell === 1) {
                // Wall - draw with inner border for classic look
                ctx.fillStyle = '#1e1b6e'; ctx.fillRect(x, y, PM_S, PM_S);
                ctx.strokeStyle = '#3730c4'; ctx.lineWidth = 1;
                ctx.strokeRect(x + 1.5, y + 1.5, PM_S - 3, PM_S - 3);
            } else if (cell === 0) {
                ctx.fillStyle = '#d1d5f0'; ctx.beginPath();
                ctx.arc(x + PM_S / 2, y + PM_S / 2, 1.5, 0, Math.PI * 2); ctx.fill();
            } else if (cell === 2) {
                ctx.fillStyle = '#fbbf24';
                ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 4;
                ctx.beginPath(); ctx.arc(x + PM_S / 2, y + PM_S / 2, 4, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }

    // Draw pacman
    const px = PM_OX + pmPac.c * PM_S + PM_S / 2, py = pmPac.r * PM_S + PM_S / 2;
    let ang = pmDir.c > 0 ? 0 : pmDir.c < 0 ? Math.PI : pmDir.r > 0 ? Math.PI * .5 : pmDir.r < 0 ? Math.PI * 1.5 : 0;
    const mth = 0.22 + 0.18 * Math.abs(Math.sin(ts * 0.007));
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 3;
    ctx.beginPath(); ctx.moveTo(px, py);
    ctx.arc(px, py, PM_S / 2 - 1, ang + mth, ang + Math.PI * 2 - mth); ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;

    //
    // HUD
    ctx.fillStyle = '#4a5070'; ctx.font = '11px "IBM Plex Mono"'; ctx.textAlign = 'left';
    ctx.fillText('SCORE ' + pmScore, PM_OX, canvas.height - 4);
    ctx.textAlign = 'right';
    ctx.fillText('DOTS ' + pmDots, PM_OX + PM_C * PM_S, canvas.height - 4);

    gameAnimFrame = requestAnimationFrame(pacmanLoop);
}

// ═══════════════════════════════════════════════════
//  BREAKOUT (CASSE-BRIQUE)
// ═══════════════════════════════════════════════════
let brkPaddle, brkBall, brkBricks, brkScore, brkLives, brkLastTS;
const BRK_COLS = 10, BRK_ROWS = 5, BRK_BW = 52, BRK_BH = 16, BRK_GAP = 4;

function initBreakout() {
    brkPaddle = { x: canvas.width / 2 - 40, y: canvas.height - 22, w: 80, h: 8, speed: 6 };
    brkBall = { x: canvas.width / 2, y: canvas.height - 50, r: 6, vx: 3.5, vy: -4 };
    brkBricks = [];
    const colors = ['#f43f5e', '#fb923c', '#fbbf24', '#a3e635', '#22d3ee'];
    for (let r = 0; r < BRK_ROWS; r++)
        for (let col = 0; col < BRK_COLS; col++)
            brkBricks.push({ x: col * (BRK_BW + BRK_GAP) + 6, y: r * (BRK_BH + BRK_GAP) + 28, alive: true, color: colors[r] });
    brkScore = 0; brkLives = 3; brkLastTS = 0;
    gameOver = false; victory = false;
}

function breakoutLoop(ts) {
    if (!gameActive || currentGame !== 'breakout') return;
    const dt = brkLastTS ? Math.min((ts - brkLastTS) / 16.667, 3) : 1;
    brkLastTS = ts;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver || victory) {
        ctx.fillStyle = victory ? '#22d3ee' : '#f43f5e';
        ctx.font = 'bold 22px "IBM Plex Mono"'; ctx.textAlign = 'center';
        ctx.fillText(victory ? 'VICTOIRE !' : 'GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '12px "IBM Plex Mono"'; ctx.fillStyle = '#4a5070';
        ctx.fillText(tr('ESPACE pour rejouer', 'SPACE to restart'), canvas.width / 2, canvas.height / 2 + 18);
        if (keys.space) initBreakout();
        gameAnimFrame = requestAnimationFrame(breakoutLoop); return;
    }

    if (keys.left  && brkPaddle.x > 0) brkPaddle.x -= brkPaddle.speed * dt;
    if (keys.right && brkPaddle.x + brkPaddle.w < canvas.width) brkPaddle.x += brkPaddle.speed * dt;

    brkBall.x += brkBall.vx * dt;
    brkBall.y += brkBall.vy * dt;

    if (brkBall.x - brkBall.r <= 0 || brkBall.x + brkBall.r >= canvas.width) brkBall.vx *= -1;
    if (brkBall.y - brkBall.r <= 0) brkBall.vy = Math.abs(brkBall.vy);

    if (brkBall.y + brkBall.r >= brkPaddle.y && brkBall.y - brkBall.r <= brkPaddle.y + brkPaddle.h &&
        brkBall.x >= brkPaddle.x - 4 && brkBall.x <= brkPaddle.x + brkPaddle.w + 4) {
        brkBall.vy = -Math.abs(brkBall.vy);
        brkBall.vx = ((brkBall.x - (brkPaddle.x + brkPaddle.w / 2)) / (brkPaddle.w / 2)) * 6;
    }

    if (brkBall.y - brkBall.r > canvas.height) {
        brkLives--;
        if (brkLives <= 0) { gameOver = true; }
        else { brkBall.x = canvas.width / 2; brkBall.y = canvas.height - 60; brkBall.vx = 3.5; brkBall.vy = -4; }
    }

    let alive = 0;
    for (const b of brkBricks) {
        if (!b.alive) continue;
        alive++;
        if (brkBall.x + brkBall.r > b.x && brkBall.x - brkBall.r < b.x + BRK_BW &&
            brkBall.y + brkBall.r > b.y && brkBall.y - brkBall.r < b.y + BRK_BH) {
            b.alive = false; alive--;
            const cx = brkBall.x - (b.x + BRK_BW / 2), cy = brkBall.y - (b.y + BRK_BH / 2);
            if (Math.abs(cx / BRK_BW) > Math.abs(cy / BRK_BH)) brkBall.vx *= -1; else brkBall.vy *= -1;
            brkScore += 10;
        }
    }
    if (alive === 0) victory = true;

    for (const b of brkBricks) {
        if (!b.alive) continue;
        ctx.fillStyle = b.color; ctx.fillRect(b.x, b.y, BRK_BW, BRK_BH);
        ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 1; ctx.strokeRect(b.x, b.y, BRK_BW, BRK_BH);
    }
    ctx.fillStyle = '#a855f7'; ctx.fillRect(brkPaddle.x, brkPaddle.y, brkPaddle.w, brkPaddle.h);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(brkBall.x, brkBall.y, brkBall.r, 0, Math.PI * 2); ctx.fill();
    ctx.font = '11px "IBM Plex Mono"'; ctx.fillStyle = '#4a5070'; ctx.textAlign = 'left';
    ctx.fillText('SCORE ' + brkScore, 8, canvas.height - 6);
    ctx.textAlign = 'right';
    ctx.fillText(tr('VIES ', 'LIVES ') + '♥'.repeat(brkLives), canvas.width - 8, canvas.height - 6);
    gameAnimFrame = requestAnimationFrame(breakoutLoop);
}

// ═══════════════════════════════════════════════════
//  PONG
// ═══════════════════════════════════════════════════
let pngBall, pngP, pngAI, pngSP, pngSAI, pngLastTS;
const PNG_PH = 64, PNG_PW = 10, PNG_SPD = 4.5;

function initPong() {
    pngP   = { x: 14, y: canvas.height / 2 - PNG_PH / 2, w: PNG_PW, h: PNG_PH, speed: 5 };
    pngAI  = { x: canvas.width - 14 - PNG_PW, y: canvas.height / 2 - PNG_PH / 2, w: PNG_PW, h: PNG_PH };
    pngBall = { x: canvas.width / 2, y: canvas.height / 2, r: 7,
        vx: PNG_SPD * (Math.random() > .5 ? 1 : -1), vy: PNG_SPD * (Math.random() > .5 ? 1 : -1) };
    pngSP = 0; pngSAI = 0; pngLastTS = 0;
    gameOver = false; victory = false;
}

function pongLoop(ts) {
    if (!gameActive || currentGame !== 'pong') return;
    const dt = pngLastTS ? Math.min((ts - pngLastTS) / 16.667, 3) : 1;
    pngLastTS = ts;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver || victory) {
        ctx.font = 'bold 22px "IBM Plex Mono"'; ctx.textAlign = 'center';
        ctx.fillStyle = victory ? '#22d3ee' : '#f43f5e';
        ctx.fillText(victory ? tr('VICTOIRE !', 'VICTORY!') : tr('DÉFAITE', 'DEFEAT'), canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '12px "IBM Plex Mono"'; ctx.fillStyle = '#4a5070';
        ctx.fillText(tr('ESPACE pour rejouer', 'SPACE to restart'), canvas.width / 2, canvas.height / 2 + 18);
        if (keys.space) initPong();
        gameAnimFrame = requestAnimationFrame(pongLoop); return;
    }

    if (keys.up   && pngP.y > 0) pngP.y -= pngP.speed * dt;
    if (keys.down && pngP.y + pngP.h < canvas.height) pngP.y += pngP.speed * dt;

    const aiC = pngAI.y + pngAI.h / 2;
    if (aiC < pngBall.y - 5) pngAI.y += 3.2 * dt;
    else if (aiC > pngBall.y + 5) pngAI.y -= 3.2 * dt;
    pngAI.y = Math.max(0, Math.min(canvas.height - pngAI.h, pngAI.y));

    pngBall.x += pngBall.vx * dt;
    pngBall.y += pngBall.vy * dt;

    if (pngBall.y - pngBall.r <= 0 || pngBall.y + pngBall.r >= canvas.height) pngBall.vy *= -1;

    if (pngBall.x - pngBall.r <= pngP.x + pngP.w && pngBall.x > pngP.x &&
        pngBall.y >= pngP.y && pngBall.y <= pngP.y + pngP.h) {
        pngBall.vx = Math.abs(pngBall.vx) * 1.05;
        pngBall.vy = ((pngBall.y - (pngP.y + pngP.h / 2)) / (pngP.h / 2)) * 6;
    }
    if (pngBall.x + pngBall.r >= pngAI.x && pngBall.x < pngAI.x + pngAI.w &&
        pngBall.y >= pngAI.y && pngBall.y <= pngAI.y + pngAI.h) {
        pngBall.vx = -Math.abs(pngBall.vx) * 1.05;
        pngBall.vy = ((pngBall.y - (pngAI.y + pngAI.h / 2)) / (pngAI.h / 2)) * 6;
    }

    function resetBall() {
        pngBall.x = canvas.width / 2; pngBall.y = canvas.height / 2;
        pngBall.vx = PNG_SPD * (Math.random() > .5 ? 1 : -1);
        pngBall.vy = PNG_SPD * (Math.random() > .5 ? 1 : -1);
    }
    if (pngBall.x - pngBall.r < 0)               { pngSAI++; if (pngSAI >= 7) gameOver = true; else resetBall(); }
    if (pngBall.x + pngBall.r > canvas.width)     { pngSP++;  if (pngSP  >= 7) victory = true;  else resetBall(); }

    ctx.fillStyle = '#161830';
    for (let y = 0; y < canvas.height; y += 20) ctx.fillRect(canvas.width / 2 - 1, y, 2, 12);
    ctx.fillStyle = '#a855f7'; ctx.fillRect(pngP.x, pngP.y, pngP.w, pngP.h);
    ctx.fillStyle = '#22d3ee'; ctx.fillRect(pngAI.x, pngAI.y, pngAI.w, pngAI.h);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(pngBall.x, pngBall.y, pngBall.r, 0, Math.PI * 2); ctx.fill();
    ctx.font = 'bold 28px "IBM Plex Mono"'; ctx.textAlign = 'center';
    ctx.fillStyle = '#a855f7'; ctx.fillText(pngSP, canvas.width / 2 - 60, 42);
    ctx.fillStyle = '#22d3ee'; ctx.fillText(pngSAI, canvas.width / 2 + 60, 42);
    ctx.font = '10px "IBM Plex Mono"'; ctx.fillStyle = '#2a2d50';
    ctx.fillText(tr('TOI', 'YOU'), canvas.width / 2 - 60, 56); ctx.fillText(tr('IA', 'AI'), canvas.width / 2 + 60, 56);
    gameAnimFrame = requestAnimationFrame(pongLoop);
}

// ═══════════════════════════════════════════════════
//  SNAKE
// ═══════════════════════════════════════════════════
let snakeBody, snakeDir, snakeNextDir, snakeFood, snakeScore, snakeMT, snakeLastTS;
const SNK_C = 24, SNK_R = 20;
const SNK_S = Math.floor(600 / 24);

function initSnake() {
    snakeBody = [{r:10,c:12},{r:10,c:11},{r:10,c:10}];
    snakeDir = {r:0,c:1}; snakeNextDir = {r:0,c:1};
    snakeFood = snakeSpawnFood();
    snakeScore = 0; snakeMT = 0; snakeLastTS = 0;
    gameOver = false; victory = false;
}
function snakeSpawnFood() {
    let f;
    do { f = { r: Math.floor(Math.random() * SNK_R), c: Math.floor(Math.random() * SNK_C) }; }
    while (snakeBody.some(s => s.r === f.r && s.c === f.c));
    return f;
}
function snakeLoop(ts) {
    if (!gameActive || currentGame !== 'snake') return;
    const dt = snakeLastTS ? Math.min((ts - snakeLastTS) / 16.667, 3) : 1;
    snakeLastTS = ts;
    snakeMT -= dt;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver || victory) {
        ctx.font = 'bold 22px "IBM Plex Mono"'; ctx.textAlign = 'center';
        ctx.fillStyle = victory ? '#22d3ee' : '#f43f5e';
        ctx.fillText(gameOver ? 'GAME OVER' : 'VICTOIRE !', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '12px "IBM Plex Mono"'; ctx.fillStyle = '#4a5070';
        ctx.fillText(tr('Flèche pour rejouer', 'Arrow key to restart'), canvas.width / 2, canvas.height / 2 + 18);
        if (snakeNextDir.r || snakeNextDir.c) initSnake();
        gameAnimFrame = requestAnimationFrame(snakeLoop); return;
    }

    if (snakeMT <= 0) {
        snakeMT = 11;
        if (!(snakeNextDir.r === -snakeDir.r && snakeNextDir.c === -snakeDir.c))
            snakeDir = { ...snakeNextDir };
        const head = { r: (snakeBody[0].r + snakeDir.r + SNK_R) % SNK_R,
                       c: (snakeBody[0].c + snakeDir.c + SNK_C) % SNK_C };
        if (snakeBody.some(s => s.r === head.r && s.c === head.c)) { gameOver = true; }
        else {
            snakeBody.unshift(head);
            if (head.r === snakeFood.r && head.c === snakeFood.c) {
                snakeScore += 10;
                snakeFood = snakeSpawnFood();
                if (snakeBody.length >= SNK_C * SNK_R) victory = true;
            } else { snakeBody.pop(); }
        }
    }

    snakeBody.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? '#c084fc' : '#a855f7';
        ctx.fillRect(s.c * SNK_S + 1, s.r * SNK_S + 1, SNK_S - 2, SNK_S - 2);
    });
    ctx.fillStyle = '#22d3ee';
    ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(snakeFood.c * SNK_S + SNK_S / 2, snakeFood.r * SNK_S + SNK_S / 2, SNK_S / 2 - 2, 0, Math.PI * 2);
    ctx.fill(); ctx.shadowBlur = 0;
    ctx.font = '11px "IBM Plex Mono"'; ctx.fillStyle = '#4a5070'; ctx.textAlign = 'left';
    ctx.fillText('SCORE ' + snakeScore + '  LEN ' + snakeBody.length, 8, canvas.height - 5);
    gameAnimFrame = requestAnimationFrame(snakeLoop);
}

// ═══════════════════════════════════════════════════
//  FLAPPY BIRD
// ═══════════════════════════════════════════════════
let flpBird, flpPipes, flpScore, flpLastTS, flpSpawn, flpStarted;

function initFlappy() {
    flpBird = { x: 80, y: canvas.height / 2, r: 10, vy: 0 };
    flpPipes = []; flpScore = 0; flpSpawn = 110; flpLastTS = 0; flpStarted = false;
    gameOver = false; victory = false; keys.space = false;
}
function flappyLoop(ts) {
    if (!gameActive || currentGame !== 'flappy') return;
    const dt = flpLastTS ? Math.min((ts - flpLastTS) / 16.667, 3) : 1;
    flpLastTS = ts;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        ctx.font = 'bold 22px "IBM Plex Mono"'; ctx.textAlign = 'center';
        ctx.fillStyle = '#f43f5e';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = 'bold 16px "IBM Plex Mono"'; ctx.fillStyle = '#a855f7';
        ctx.fillText('SCORE ' + flpScore, canvas.width / 2, canvas.height / 2 + 4);
        ctx.font = '12px "IBM Plex Mono"'; ctx.fillStyle = '#4a5070';
        ctx.fillText(tr('ESPACE pour rejouer', 'SPACE to restart'), canvas.width / 2, canvas.height / 2 + 26);
        if (keys.space) initFlappy();
        gameAnimFrame = requestAnimationFrame(flappyLoop); return;
    }

    if (!flpStarted) {
        ctx.fillStyle = '#4a5070'; ctx.font = '14px "IBM Plex Mono"'; ctx.textAlign = 'center';
        ctx.fillText(tr('APPUIE SUR ESPACE', 'PRESS SPACE'), canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillText(tr('POUR VOLER', 'TO FLY'), canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillStyle = '#a855f7';
        ctx.beginPath(); ctx.arc(flpBird.x, flpBird.y, flpBird.r, 0, Math.PI * 2); ctx.fill();
        if (keys.space) flpStarted = true;
        gameAnimFrame = requestAnimationFrame(flappyLoop); return;
    }

    flpBird.vy += 0.45 * dt;
    if (keys.space && flpBird.vy > 0.5) flpBird.vy = -7;
    flpBird.y += flpBird.vy * dt;

    if (flpBird.y - flpBird.r <= 0 || flpBird.y + flpBird.r >= canvas.height) gameOver = true;

    flpSpawn -= dt;
    if (flpSpawn <= 0) {
        const gap = 118, gapY = 55 + Math.random() * (canvas.height - gap - 110);
        flpPipes.push({ x: canvas.width + 20, gapY, gap, scored: false });
        flpSpawn = 88 + Math.random() * 28;
    }
    for (let i = flpPipes.length - 1; i >= 0; i--) {
        flpPipes[i].x -= 2.5 * dt;
        if (flpPipes[i].x + 40 < 0) { flpPipes.splice(i, 1); continue; }
        const p = flpPipes[i];
        if (!p.scored && p.x + 40 < flpBird.x - flpBird.r) { p.scored = true; flpScore++; }
        if (flpBird.x + flpBird.r > p.x && flpBird.x - flpBird.r < p.x + 40)
            if (flpBird.y - flpBird.r < p.gapY || flpBird.y + flpBird.r > p.gapY + p.gap) gameOver = true;
    }

    for (const p of flpPipes) {
        ctx.fillStyle = '#22d3ee';
        ctx.fillRect(p.x, 0, 40, p.gapY);
        ctx.fillRect(p.x, p.gapY + p.gap, 40, canvas.height - p.gapY - p.gap);
        ctx.fillStyle = '#0891b2';
        ctx.fillRect(p.x - 4, p.gapY - 16, 48, 16);
        ctx.fillRect(p.x - 4, p.gapY + p.gap, 48, 16);
    }
    ctx.fillStyle = '#a855f7';
    ctx.beginPath(); ctx.arc(flpBird.x, flpBird.y, flpBird.r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(flpBird.x + 7, flpBird.y - 3, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.font = 'bold 14px "IBM Plex Mono"'; ctx.fillStyle = '#4a5070'; ctx.textAlign = 'center';
    ctx.fillText('' + flpScore, canvas.width / 2, 26);
    gameAnimFrame = requestAnimationFrame(flappyLoop);
}

// ═══════════════════════════════════════════════════
//  DÉMINEUR
// ═══════════════════════════════════════════════════
const DM_COLS = 16, DM_ROWS = 12, DM_MINES = 24;
const DM_CW = Math.floor(600 / 16), DM_CH = Math.floor(400 / 12);
let dmGrid, dmRevealed, dmFlagged, dmFirstClick, dmMineCount, dmWon, dmLost;

function _dmClick(e) {
    if (!gameActive || currentGame !== 'demineur') return;
    if (dmWon || dmLost) { initDemineur(); return; }
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
    const col = Math.floor((e.clientX - rect.left) * scaleX / DM_CW);
    const row = Math.floor((e.clientY - rect.top) * scaleY / DM_CH);
    if (row < 0 || row >= DM_ROWS || col < 0 || col >= DM_COLS) return;
    if (dmFlagged[row][col]) return;
    if (dmFirstClick) { dmPlaceMines(row, col); dmFirstClick = false; }
    if (dmGrid[row][col] === -1) {
        dmRevealed[row][col] = true; dmLost = true;
        for (let r = 0; r < DM_ROWS; r++) for (let c = 0; c < DM_COLS; c++)
            if (dmGrid[r][c] === -1) dmRevealed[r][c] = true;
    } else { dmReveal(row, col); }
    if (dmCheckWin()) dmWon = true;
    dmDraw();
}
function _dmRClick(e) {
    e.preventDefault();
    if (!gameActive || currentGame !== 'demineur' || dmWon || dmLost) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
    const col = Math.floor((e.clientX - rect.left) * scaleX / DM_CW);
    const row = Math.floor((e.clientY - rect.top) * scaleY / DM_CH);
    if (row < 0 || row >= DM_ROWS || col < 0 || col >= DM_COLS || dmRevealed[row][col]) return;
    dmFlagged[row][col] = !dmFlagged[row][col];
    dmMineCount += dmFlagged[row][col] ? -1 : 1;
    dmDraw();
}

function initDemineur() {
    dmGrid     = Array.from({length:DM_ROWS}, () => Array(DM_COLS).fill(0));
    dmRevealed = Array.from({length:DM_ROWS}, () => Array(DM_COLS).fill(false));
    dmFlagged  = Array.from({length:DM_ROWS}, () => Array(DM_COLS).fill(false));
    dmFirstClick = true; dmMineCount = DM_MINES; dmWon = false; dmLost = false;
    gameOver = false; victory = false;
    canvas.addEventListener('click', _dmClick);
    canvas.addEventListener('contextmenu', _dmRClick);
    dmDraw();
}
function dmPlaceMines(sr, sc) {
    let placed = 0;
    while (placed < DM_MINES) {
        const r = Math.floor(Math.random() * DM_ROWS), c = Math.floor(Math.random() * DM_COLS);
        if (dmGrid[r][c] === -1 || (Math.abs(r-sr)<=1 && Math.abs(c-sc)<=1)) continue;
        dmGrid[r][c] = -1; placed++;
    }
    for (let r = 0; r < DM_ROWS; r++) for (let c = 0; c < DM_COLS; c++) {
        if (dmGrid[r][c] === -1) continue;
        let n = 0;
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
            const nr = r+dr, nc = c+dc;
            if (nr>=0&&nr<DM_ROWS&&nc>=0&&nc<DM_COLS&&dmGrid[nr][nc]===-1) n++;
        }
        dmGrid[r][c] = n;
    }
}
function dmReveal(r, c) {
    if (r<0||r>=DM_ROWS||c<0||c>=DM_COLS||dmRevealed[r][c]||dmFlagged[r][c]) return;
    dmRevealed[r][c] = true;
    if (dmGrid[r][c] === 0) for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++) dmReveal(r+dr, c+dc);
}
function dmCheckWin() {
    for (let r=0;r<DM_ROWS;r++) for (let c=0;c<DM_COLS;c++)
        if (dmGrid[r][c]!==-1 && !dmRevealed[r][c]) return false;
    return true;
}
function dmDraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const nc = ['#4a5070','#22d3ee','#a3e635','#f43f5e','#3b82f6','#dc2626','#06b6d4','#a855f7','#94a3b8'];
    for (let r=0;r<DM_ROWS;r++) for (let c=0;c<DM_COLS;c++) {
        const x=c*DM_CW, y=r*DM_CH;
        if (dmRevealed[r][c]) {
            ctx.fillStyle = dmGrid[r][c]===-1 ? '#3d0a0a' : '#0c0e1e';
            ctx.fillRect(x,y,DM_CW-1,DM_CH-1);
            if (dmGrid[r][c] > 0) {
                ctx.fillStyle = nc[dmGrid[r][c]];
                ctx.font = `bold ${Math.min(DM_CW,DM_CH)-6}px "IBM Plex Mono"`;
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(dmGrid[r][c], x+DM_CW/2, y+DM_CH/2);
            } else if (dmGrid[r][c]===-1) {
                ctx.fillStyle = '#f43f5e';
                ctx.font = `${Math.min(DM_CW,DM_CH)-4}px serif`;
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText('💣', x+DM_CW/2, y+DM_CH/2);
            }
        } else {
            ctx.fillStyle = dmFlagged[r][c] ? '#4c1d95' : '#1c2040';
            ctx.fillRect(x,y,DM_CW-1,DM_CH-1);
            if (dmFlagged[r][c]) {
                ctx.fillStyle = '#fbbf24';
                ctx.font = `${Math.min(DM_CW,DM_CH)-4}px serif`;
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText('🚩', x+DM_CW/2, y+DM_CH/2);
            }
        }
    }
    ctx.font = '11px "IBM Plex Mono"'; ctx.fillStyle = '#4a5070';
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('MINES ' + dmMineCount, 6, canvas.height - 4);
    ctx.textAlign = 'right';
    if (dmWon)  { ctx.fillStyle = '#22d3ee'; ctx.fillText(tr('VICTOIRE ! - clic pour rejouer', 'VICTORY! - click to replay'), canvas.width-6, canvas.height-4); }
    else if (dmLost) { ctx.fillStyle = '#f43f5e'; ctx.fillText(tr('BOOM ! - clic pour rejouer', 'BOOM! - click to replay'), canvas.width-6, canvas.height-4); }
    else { ctx.fillStyle = '#2a2d50'; ctx.fillText(tr('G.GAUCHE=révéler  G.DROIT=flag', 'L-CLICK=reveal  R-CLICK=flag'), canvas.width-6, canvas.height-4); }
}
