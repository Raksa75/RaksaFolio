/* ══════════════════════════════════════════════════
   APP : intro, i18n, theme, router, galleries, UI effects
   (loaded after i18n.js + data.js, before terminal.js)
══════════════════════════════════════════════════ */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Storage can throw (private mode, blocked cookies) : never let it break the site */
const store = {
    get(k, session) { try { return (session ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
    set(k, v, session) { try { (session ? sessionStorage : localStorage).setItem(k, v); } catch (e) { /* ignore */ } }
};

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const CAN_HOVER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const TOUCH_ONLY = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

let currentLang = store.get('nz_lang') === 'en' ? 'en' : 'fr';
let currentDocIdx = -1;
const t = key => (T[currentLang] && T[currentLang][key]) || (T.fr[key] ?? key);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));


/* ── INTRO SEQUENCE ─────────────────────────────── */
(function intro() {
    const overlay = $('#intro-overlay');
    if (!overlay) return;
    if (store.get('introPlayed', true) || REDUCED_MOTION) { overlay.remove(); return; }
    store.set('introPlayed', 'true', true);

    const realPanel = $('.hero .hud-panel');
    realPanel.style.opacity = '0';
    let done = false;
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const typeInto = async (el, str, speed) => {
        for (const ch of str) {
            if (done) return;
            el.textContent += ch;
            await wait(typeof speed === 'function' ? speed() : speed);
        }
    };
    const human = () => 40 + Math.random() * 60;

    function finish() {
        done = true;
        overlay.classList.add('gone');
        realPanel.style.opacity = '';
        document.removeEventListener('keydown', skip);
        setTimeout(() => overlay.remove(), 450);
    }
    function skip() { if (!done) finish(); }

    function fly() {
        if (done) return;
        done = true;
        const box = $('#intro-box');
        const r = realPanel.getBoundingClientRect();
        const b = box.getBoundingClientRect();
        if (!r.width || r.bottom < 0 || r.top > innerHeight) { finish(); return; }
        overlay.classList.add('flying');
        box.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1), width .6s ease';
        box.style.transform = `translate(${r.left - b.left}px, ${r.top - b.top}px)`;
        box.style.width = r.width + 'px';
        setTimeout(finish, 600);
    }

    async function run() {
        await wait(500);
        await typeInto($('#intro-login'), 'Raksakoreko', human);
        if (done) return;
        $('#cursor-1').style.display = 'none';
        $('#line-pwd').style.display = 'flex';
        await wait(350);
        await typeInto($('#intro-pwd'), '********', human);
        if (done) return;
        $('#cursor-2').style.display = 'none';
        await wait(300);
        if (done) return;
        $('#intro-body').style.display = 'none';
        $('#intro-success').style.display = 'flex';
        await wait(900);
        if (done) return;
        $('#intro-step-1').style.display = 'none';
        $('#intro-step-2').style.display = 'block';
        for (const [id, txt] of [['type-name', 'N. ZIMMERMANN'], ['type-age', '25'], ['type-school', 'LISAA'], ['type-status', 'ONLINE']]) {
            await typeInto($('#' + id), txt, 32);
            if (done) return;
            await wait(140);
        }
        await wait(450);
        fly();
    }

    overlay.addEventListener('click', skip);
    document.addEventListener('keydown', skip);
    run();
})();


/* ── ANTI-DRAG (TUE LE BUG DE L'IMAGE FANTÔME) ── */
window.ondragstart = function () { return false; };
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('drop', e => e.preventDefault());


/* ── LANG SYSTEM ────────────────────────────────── */
function applyLang(lang) {
    currentLang = lang === 'en' ? 'en' : 'fr';
    store.set('nz_lang', currentLang);
    document.documentElement.lang = currentLang;
    const dict = T[currentLang];

    $$('[data-i18n]').forEach(el => {
        const v = dict[el.dataset.i18n];
        if (v !== undefined) el.textContent = v;
    });
    $$('[data-i18n-html]').forEach(el => {
        const v = dict[el.dataset.i18nHtml];
        if (v !== undefined) el.innerHTML = v;
    });
    $$('[data-i18n-aria]').forEach(el => {
        const v = dict[el.dataset.i18nAria];
        if (v !== undefined) el.setAttribute('aria-label', v);
    });

    // About bio (special block with multiple paragraphs)
    const bio = $('#about-bio');
    if (bio && dict['about.bio']) bio.innerHTML = dict['about.bio'];

    // Re-render language-dependent dynamic content of the current page
    const active = $('.page.active');
    if (active) {
        const id = active.id.replace('page-', '');
        initPage(id);
        updateTitle(id);
    }
}

function toggleLang() {
    applyLang(currentLang === 'fr' ? 'en' : 'fr');
}


/* ── THEME ──────────────────────────────────────── */
function setTheme(light) {
    document.documentElement.classList.toggle('light', light);
    const meta = $('#meta-theme');
    if (meta) meta.setAttribute('content', light ? '#f4f5fa' : '#07070d');
    const tw = $('.twitter-tweet');
    if (tw) tw.dataset.theme = light ? 'light' : 'dark';
}

function toggleTheme() {
    const light = !document.documentElement.classList.contains('light');
    setTheme(light);
    store.set('theme', light ? 'light' : 'dark');
}


/* ── GALLERY BUILDER ────────────────────────────── */
function buildG(id, imgs, altPrefix) {
    const c = document.getElementById(id);
    if (!c) return;
    c.innerHTML = '';
    imgs.forEach((s, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'gi';
        b.innerHTML = `<img src="${esc(s)}" alt="${esc((altPrefix || 'Image') + ' ' + (i + 1))}" loading="lazy" decoding="async">`;
        b.onclick = () => oLB(imgs, i);
        c.appendChild(b);
    });
}

/* IN CANTA board photos (static markup in index.html) */
const BOARD_PHOTOS = ['./assets/incanta-board-photo-1.webp', './assets/incanta-board-photo-2.webp', './assets/incanta-board-photo-3.webp'];
function openBoardPhoto(i) { oLB(BOARD_PHOTOS, i); }


/* ── PDF VIEWER ─────────────────────────────────── */
const ICON_PDF = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg>';
const ICON_EXT = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>';
const ICON_DL = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/></svg>';

function buildPdfJsGallery(galleryId, pdfPath, title) {
    const g = document.getElementById(galleryId);
    if (!g) return;
    const name = decodeURIComponent(pdfPath.split('/').pop());
    const label = title || name.replace(/\.pdf$/i, '').replace(/_/g, ' ');
    g.classList.add('pdf-host');
    g.innerHTML = `
        <div class="pdfv">
            <div class="pdfv-bar">
                <span class="pdfv-name">${ICON_PDF}<span>${esc(name)}</span></span>
                <span class="pdfv-actions">
                    <a class="pdfv-btn" href="${esc(pdfPath)}" target="_blank" rel="noopener">${ICON_EXT}<span>${esc(t('pdf.open'))}</span></a>
                    <a class="pdfv-btn" href="${esc(pdfPath)}" download>${ICON_DL}<span>${esc(t('pdf.download'))}</span></a>
                </span>
            </div>
            ${TOUCH_ONLY
                ? `<div class="pdfv-mobile">${ICON_PDF}<p>${esc(t('pdf.mobile'))}</p><a class="btn bp" href="${esc(pdfPath)}" target="_blank" rel="noopener">[ ${esc(t('pdf.mobile.cta'))} ]</a></div>`
                : `<iframe class="pdfv-frame" src="${esc(pdfPath)}#view=FitH" title="${esc(label)}" loading="lazy"></iframe>`}
        </div>`;
}

/* Pages that show a PDF : [container id, path or {fr, en}] */
const PDF_PAGES = {
    'concept':      ['cg-gallery', './assets/PDF/Groupe-Top_JdP-Concept.pdf'],
    'rulebook':     ['rbg', './assets/PDF/Livret%20de%20r%C3%A8gles.pdf'],
    'ascend-gdd':   ['gdd-gallery', { fr: './assets/PDF/Ascend_Rush_GDD_FR.pdf', en: './assets/PDF/Ascend_Rush_GDD_EN.pdf' }],
    'ascend-gcd':   ['gcd-gallery', { fr: './assets/PDF/Ascend_Rush_GCD_FR.pdf', en: './assets/PDF/Ascend_Rush_GCD_EN.pdf' }],
    'parastin-gdd': ['parastin-gdd-gallery', { fr: './assets/PDF/Parastin_GDD_FR.pdf', en: './assets/PDF/Parastin_GDD_EN.pdf' }]
};


/* ── DOCS (grouped cards + detail page) ─────────── */
function buildDocGroups() {
    const dg = document.getElementById('dg');
    if (!dg) return;
    dg.innerHTML = '';
    const isEN = currentLang === 'en';
    const docGroups = [
        { labelFr: '// GAME DESIGN', labelEn: '// GAME DESIGN', ids: ['sf', 'tt', 'nb', 'ud', 'pk', 'nf'] },
        { labelFr: '// ANALYSE',     labelEn: '// ANALYSIS',    ids: ['tft'] },
        { labelFr: '// UI DESIGN',   labelEn: '// UI DESIGN',   ids: ['es'] },
    ];
    docGroups.forEach(group => {
        const docs = group.ids.map(id => DOCS.find(d => d.id === id)).filter(Boolean);
        if (!docs.length) return;
        const sep = document.createElement('div');
        sep.className = 'sep';
        sep.textContent = isEN ? group.labelEn : group.labelFr;
        dg.appendChild(sep);
        const grid = document.createElement('div');
        grid.className = 'dcg stagger';
        docs.forEach(d => {
            const a = document.createElement('a');
            a.className = 'dc';
            a.href = '#doc/' + d.id;
            const title = isEN && d.title_en ? d.title_en : d.title;
            a.innerHTML = `<div class="dci"><img src="${esc(d.thumb)}" alt="${esc(title)}" loading="lazy" decoding="async"></div>`
                + `<div class="dcb"><div class="dct">${esc(isEN && d.type_en ? d.type_en : d.type)}</div>`
                + `<div class="dctl">${esc(title)}</div>`
                + `<div class="dcs">${esc(isEN && d.sub_en ? d.sub_en : d.sub)}</div></div>`;
            grid.appendChild(a);
        });
        dg.appendChild(grid);
    });
}

function renderDocContent(i) {
    const d = DOCS[i];
    if (!d) return;
    const isEN = currentLang === 'en';
    const titleStr = isEN && d.title_en ? d.title_en : d.title;
    $('#ddbc').textContent = titleStr;
    $('#ddt2').textContent = isEN && d.type_en ? d.type_en : d.type;
    $('#ddt').textContent = titleStr;
    $('#ddd').textContent = isEN && d.desc_en ? d.desc_en : d.desc;
    const meta = isEN && d.meta_en ? d.meta_en : d.meta;
    $('#ddm').innerHTML = meta.map(m => `<div class="meta-chip"><b>${esc(m.k)}</b>${esc(m.v)}</div>`).join('');
    const gg = $('#ddg');
    gg.classList.remove('pdf-host');
    const pdf = isEN ? d.pdf_en : d.pdf_fr;
    if (pdf) buildPdfJsGallery('ddg', pdf, titleStr);
    else buildG('ddg', d.imgs || [], titleStr);
}

function selectDoc(id) {
    const i = DOCS.findIndex(d => d.id === id);
    if (i === -1) return false;
    currentDocIdx = i;
    return true;
}

function openDoc(i) {
    currentDocIdx = i;
    go('dd');
}


/* ── IN CANTA : balancing sheets (Google Sheets) ── */
function buildBalancingSheets(lang) {
    const g = document.getElementById('balg');
    if (!g) return;
    const id1 = lang === 'en' ? '1BCRQkP0YL_5t8xqq1jvHrUkhplVf6LkD' : '1S05KEK-O3p0sZMExI70HD2HJ3Jznhwx2s9zg3LS44zw';
    const id2 = lang === 'en' ? '105LepbLEIrRwgw1EpVoVHjJnS3XeehPJ' : '1DlD7uyCqT0SalSiegxjyF-rV48V6dJ2BSXUPO2E_lxE';
    const frame = (id, n) => `<iframe class="sheet-frame" src="https://docs.google.com/spreadsheets/d/${id}/htmlview?embedded=true" title="Balancing Sheet ${n}" loading="lazy"></iframe>`;
    g.innerHTML = frame(id1, 1) + frame(id2, 2);
}


/* ── LEAGUE FANTASY : lazy Twitter/X embed ──────── */
function loadTweet() {
    const bq = $('#page-html-league-fantasy .twitter-tweet');
    if (!bq) return;
    bq.dataset.theme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
    if (window.twttr && window.twttr.widgets) { window.twttr.widgets.load(bq.parentNode); return; }
    const s = document.createElement('script');
    s.src = 'https://platform.twitter.com/widgets.js';
    s.async = true;
    s.charset = 'utf-8';
    document.body.appendChild(s);
}


/* ── PAGE INIT (lazy, built on first visit / language change) ── */
const _built = {};
function initPage(id) {
    if (id === 'dd') { renderDocContent(currentDocIdx); return; }
    const langKey = id + ':' + currentLang;

    if (PDF_PAGES[id]) {
        if (_built[id] === langKey) return;
        _built[id] = langKey;
        const [gal, src] = PDF_PAGES[id];
        const h2 = $('#page-' + id + ' h2');
        buildPdfJsGallery(gal, typeof src === 'string' ? src : src[currentLang], h2 ? h2.textContent.trim() : '');
    } else if (id === 'docs') {
        if (_built[id] === langKey) return;
        _built[id] = langKey;
        buildDocGroups();
    } else if (id === 'balancing') {
        if (_built[id] === langKey) return;
        _built[id] = langKey;
        buildBalancingSheets(currentLang);
    } else if (id === 'cards') {
        if (_built[id]) return;
        _built[id] = true;
        buildG('cardsg', INCANTA_CARDS, 'IN CANTA card');
    } else if (id === 'parastin-sf') {
        if (_built[id]) return;
        _built[id] = true;
        const doc = DOCS.find(d => d.id === 'sf');
        if (doc && doc.imgs) buildG('parastin-sf-gallery', doc.imgs, 'Silent Frame p.');
    } else if (id === 'html-league-fantasy') {
        if (_built[id]) return;
        _built[id] = true;
        loadTweet();
    }
}


/* ── ROUTING ────────────────────────────────────── */
const PAGES = ['home', 'docs', 'dd', 'incanta', 'concept', 'rulebook', 'cards', 'board', 'balancing', 'html', 'html-feedback', 'html-akira', 'html-echochase', 'html-league-fantasy', 'art', 'parastin', 'parastin-proto', 'parastin-sf', 'parastin-gdd', 'ascend', 'ascend-gdd', 'ascend-gcd', 'about'];
const NAV_PARENT = {
    dd: 'docs', concept: 'incanta', rulebook: 'incanta', cards: 'incanta', board: 'incanta', balancing: 'incanta',
    'html-feedback': 'html', 'html-akira': 'html', 'html-echochase': 'html', 'html-league-fantasy': 'html',
    'parastin-proto': 'parastin', 'parastin-sf': 'parastin', 'parastin-gdd': 'parastin',
    'ascend-gdd': 'ascend', 'ascend-gcd': 'ascend'
};
const PROJECT_PAGES = ['docs', 'incanta', 'html', 'art', 'parastin', 'ascend'];
const BASE_TITLE = document.title;

function parseHash(hash) {
    let h = (hash || '').replace(/^#/, '');
    try { h = decodeURIComponent(h); } catch (e) { /* keep raw */ }
    if (h.startsWith('doc/')) return { id: 'dd', doc: h.slice(4) };
    return { id: PAGES.includes(h) ? h : 'home' };
}

function hashFor(id) {
    if (id === 'dd' && DOCS[currentDocIdx]) return '#doc/' + DOCS[currentDocIdx].id;
    return '#' + id;
}

function updateTitle(id) {
    if (id === 'home') { document.title = BASE_TITLE; return; }
    const h = $('#page-' + id + ' h2');
    const name = h ? (h.innerText || h.textContent).replace(/\s+/g, ' ').trim() : '';
    document.title = name ? `${name} · NZ_ Portfolio` : BASE_TITLE;
}

// Iframes (prototypes, jam games) only run while their page is visible
function loadFrames(page) {
    $$('iframe[data-src]', page).forEach(f => {
        if (f.getAttribute('src') !== f.dataset.src) f.setAttribute('src', f.dataset.src);
    });
    const ov = $('#parastin-overlay', page);
    if (ov) ov.hidden = false;
}
function unloadFrames(page) {
    $$('iframe[data-src]', page).forEach(f => f.setAttribute('src', 'about:blank'));
}

// The terminal lives on the About page and is moved to the Playground when needed
function _moveConsole(toPageId) {
    const cw = $('.console-wrap');
    if (!cw) return;
    const slot = toPageId === 'art' ? $('#art-console-slot') : $('#page-about .cnt');
    if (slot && !slot.contains(cw)) slot.appendChild(cw);
}

function showPage(id) {
    if (id === 'dd' && !DOCS[currentDocIdx]) id = 'docs';
    const target = document.getElementById('page-' + id) || $('#page-home');
    const leaving = $('.page.active');
    if (leaving && leaving !== target) {
        if (typeof gameActive !== 'undefined' && gameActive && leaving.contains($('.console-wrap'))) stopGame();
        unloadFrames(leaving);
        leaving.classList.remove('active');
    }
    target.classList.add('active');
    loadFrames(target);
    initPage(id);
    if (id === 'art' || id === 'about') _moveConsole(id);

    const navId = NAV_PARENT[id] || id;
    $$('[data-p]').forEach(a => {
        const on = a.dataset.p === navId;
        a.classList.toggle('act', on);
        if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    const dropBtn = $('.drop > button');
    if (dropBtn) dropBtn.classList.toggle('act', PROJECT_PAGES.includes(navId));

    window.scrollTo(0, 0);
    updateTitle(id);
    // move focus to the new content (screen readers) and close any focus-held menu
    if (document.activeElement && document.activeElement !== document.body) $('#main').focus({ preventScroll: true });
}

let _navTimer = null;
function go(id, opts = {}) {
    if (!PAGES.includes(id)) id = 'home';
    if (id === 'dd' && !DOCS[currentDocIdx]) id = 'docs';
    const hash = hashFor(id);
    if (!opts.fromPop && location.hash !== hash) history.pushState({ p: id }, '', hash);
    tM(false);
    closeDrop();

    const current = $('.page.active');
    if (current && current.id === 'page-' + id && id !== 'dd') {
        window.scrollTo({ top: 0, behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
        return;
    }
    if (REDUCED_MOTION || !current) { showPage(id); return; }

    const wipe = $('#wipe');
    clearTimeout(_navTimer);
    wipe.classList.remove('out');
    wipe.classList.add('in');
    _navTimer = setTimeout(() => {
        showPage(id);
        wipe.classList.remove('in');
        wipe.classList.add('out');
        _navTimer = setTimeout(() => wipe.classList.remove('out'), 280);
    }, 190);
}

window.addEventListener('popstate', () => {
    const r = parseHash(location.hash);
    if (r.doc && !selectDoc(r.doc)) r.id = 'docs';
    go(r.id, { fromPop: true });
});

// In-page links (#page or #doc/id) are handled by the router
document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const href = a.getAttribute('href');
    e.preventDefault();
    if (href === '#main') { $('#main').focus(); return; }
    if (href === '#') return;
    const r = parseHash(href);
    if (r.doc && !selectDoc(r.doc)) return;
    go(r.id);
});


/* ── MOBILE MENU + PROJECTS DROPDOWN ────────────── */
function tM(force) {
    const mob = $('#mob'), ham = $('#ham');
    if (!mob || !ham) return;
    const open = typeof force === 'boolean' ? force : !mob.classList.contains('op');
    mob.classList.toggle('op', open);
    ham.classList.toggle('op', open);
    ham.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
}

function closeDrop() {
    const d = $('.drop');
    if (!d) return;
    d.classList.remove('open');
    const b = $('button', d);
    if (b) b.setAttribute('aria-expanded', 'false');
}
(function dropdown() {
    const d = $('.drop');
    if (!d) return;
    const b = $('button', d);
    b.addEventListener('click', e => {
        e.stopPropagation();
        const open = !d.classList.contains('open');
        d.classList.toggle('open', open);
        b.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', e => { if (!d.contains(e.target)) closeDrop(); });
})();

document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if ($('#mob').classList.contains('op')) tM(false);
    closeDrop();
});


/* ── SCROLL (nav state, progress bar, back-to-top) ── */
(function scrollFx() {
    const nb = $('#nb'), prog = $('#prog'), stb = $('#stb');
    let ticking = false;
    function update() {
        const y = window.scrollY;
        nb.classList.toggle('sc', y > 10);
        stb.classList.toggle('vis', y > 400);
        const d = document.documentElement;
        const max = d.scrollHeight - d.clientHeight;
        prog.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
})();


/* ── CARD FX : spotlight + 3D tilt (mouse only) ──── */
if (CAN_HOVER) {
    document.addEventListener('pointermove', e => {
        const el = e.target.closest('.pc, .sc2, .dc, .hc');
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        if (!REDUCED_MOTION && el.matches('.pc, .sc2')) {
            el.classList.add('tilting');
            el.style.transform = `perspective(900px) rotateY(${((x - .5) * 9).toFixed(2)}deg) rotateX(${(-(y - .5) * 7).toFixed(2)}deg)`;
        }
    }, { passive: true });
    document.addEventListener('pointerout', e => {
        const el = e.target.closest('.pc, .sc2');
        if (!el || el.contains(e.relatedTarget)) return;
        el.classList.remove('tilting');
        el.style.transform = '';
    });
}


/* ── RIPPLE ─────────────────────────────────────── */
document.addEventListener('click', e => {
    const el = e.target.closest('.ripple-wrap');
    if (!el || REDUCED_MOTION) return;
    const r = el.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2;
    const rip = document.createElement('span');
    rip.className = 'ripple';
    rip.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    el.appendChild(rip);
    rip.addEventListener('animationend', () => rip.remove());
});


/* ── MAGNETIC BUTTONS (hero CTA) ────────────────── */
if (CAN_HOVER && !REDUCED_MOTION) {
    $$('.hero-cta .btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .18}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
}


/* ── LIGHTBOX ───────────────────────────────────── */
let lbI = [], lbX = 0, lbReturnFocus = null;
const lb = $('#lb');
const lbImg = $('#lbi');

function setLB(animate) {
    const src = lbI[lbX];
    const show = () => {
        lbImg.src = src;
        lbImg.classList.remove('swap');
        $('#lb-count').textContent = `${lbX + 1} / ${lbI.length}`;
    };
    if (animate && !REDUCED_MOTION) { lbImg.classList.add('swap'); setTimeout(show, 140); } else show();
    lb.classList.toggle('single', lbI.length < 2);
    // preload neighbours for instant navigation
    [lbX - 1, lbX + 1].forEach(i => { if (lbI.length > 1) { const p = new Image(); p.src = lbI[(i + lbI.length) % lbI.length]; } });
}
function oLB(imgs, idx) {
    lbI = imgs; lbX = idx;
    lbReturnFocus = document.activeElement;
    setLB(false);
    lb.classList.add('op');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lb-open');
    $('#lbc').focus({ preventScroll: true });
}
function cLB() {
    lb.classList.remove('op');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lb-open');
    if (lbReturnFocus && lbReturnFocus.focus) lbReturnFocus.focus({ preventScroll: true });
}
function lbN(d) {
    if (lbI.length < 2) return;
    lbX = (lbX + d + lbI.length) % lbI.length;
    setLB(true);
}
lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-stage')) cLB(); });
document.addEventListener('keydown', e => {
    if (!lb.classList.contains('op')) return;
    if (e.key === 'Escape') cLB();
    else if (e.key === 'ArrowRight') lbN(1);
    else if (e.key === 'ArrowLeft') lbN(-1);
});
(function swipe() {
    let x0 = null, y0 = null;
    lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', e => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) lbN(dx < 0 ? 1 : -1);
        x0 = y0 = null;
    }, { passive: true });
})();


/* ── INIT ───────────────────────────────────────── */
$$('.yr').forEach(el => { el.textContent = new Date().getFullYear(); });
setTheme(document.documentElement.classList.contains('light'));
applyLang(currentLang);

(function initRoute() {
    const r = parseHash(location.hash);
    if (r.doc && !selectDoc(r.doc)) r.id = 'docs';
    const id = r.id === 'dd' && currentDocIdx < 0 ? 'docs' : r.id;
    if (location.hash && location.hash !== hashFor(id)) history.replaceState({ p: id }, '', hashFor(id));
    showPage(id);
})();
