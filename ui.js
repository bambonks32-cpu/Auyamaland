/* Auyamaland: the page's pieces. Tooltips, textures (read from textures/<path>.png, the same paths as the mod; vanilla's
   under textures/minecraft/), relic art, item names, skin heads, and the hero's night sky. */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const cssv = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

  /* ---------- tooltips: data-tip="Title|line|line", data-tc = title colour ---------- */
  const tip = h('div', 'tip'); tip.hidden = true; tip.setAttribute('role', 'tooltip'); document.body.appendChild(tip);
  function moveTip(x, y) { const w = tip.offsetWidth, ht = tip.offsetHeight; let l = x + 16, t = y + 16; if (l + w > innerWidth - 8) l = x - w - 12; if (t + ht > innerHeight - 8) t = y - ht - 12; tip.style.left = Math.max(8, l) + 'px'; tip.style.top = Math.max(8, t) + 'px'; }
  function showTip(el, x, y) { const [t, ...ls] = el.dataset.tip.split('|'); tip.innerHTML = '<b>' + t + '</b>' + ls.map(l => '<div>' + l + '</div>').join(''); tip.style.setProperty('--tc', el.dataset.tc || ''); tip.hidden = false; moveTip(x, y); }
  document.addEventListener('mouseover', e => { if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return; const el = e.target.closest && e.target.closest('[data-tip]'); if (el) showTip(el, e.clientX, e.clientY); });
  document.addEventListener('mousemove', e => { if (!tip.hidden) { const el = e.target.closest && e.target.closest('[data-tip]'); el ? moveTip(e.clientX, e.clientY) : (tip.hidden = true); } });
  document.addEventListener('focusin', e => { const el = e.target.closest && e.target.closest('[data-tip]'); if (el) { const r = el.getBoundingClientRect(); showTip(el, r.left, r.bottom); } });
  document.addEventListener('focusout', () => { tip.hidden = true; });
  /* touch: a tap on something with a tooltip shows it; a tap anywhere else hides it */
  document.addEventListener('pointerup', e => { if (e.pointerType !== 'touch') return; const el = e.target.closest && e.target.closest('[data-tip]');
    if (el) { const r = el.getBoundingClientRect(); showTip(el, Math.min(r.left, innerWidth - 40), r.bottom); } else tip.hidden = true; });
  addEventListener('scroll', () => { tip.hidden = true; }, { passive: true });

  /* ---------- textures ---------- */
  const NONE = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
  const cache = {};
  function loadImg(paths) { paths = [].concat(paths); const key = paths.join('|'); if (cache[key]) return cache[key];
    return (cache[key] = new Promise(res => { let k = 0; const i = new Image(); i.onload = () => res(i); i.onerror = () => { k++; if (k < paths.length) i.src = 'textures/' + paths[k] + '.png'; else res(null); }; i.src = 'textures/' + paths[0] + '.png'; })); }
  function texAny(paths, fallback) { const i = new Image(); i.alt = ''; i.draggable = false; i.className = 'px'; let k = 0;
    i.onerror = () => { k++; if (k < paths.length) i.src = 'textures/' + paths[k] + '.png'; else { i.onerror = null; i.src = fallback && window.SPR ? SPR.url(fallback) : NONE; } };
    i.src = 'textures/' + paths[0] + '.png'; return i; }
  /* plays an animated texture (frames stacked down, speed from its .mcmeta) or shows a still one */
  const anims = [];
  function animTex(paths, fallback) { const c = document.createElement('canvas'); c.width = c.height = 16; c.className = 'px'; const a = { c, im: null, n: 1, ft: 2, f: 0, t: 0 }; anims.push(a);
    const draw = () => { const w = a.im.naturalWidth, x = c.getContext('2d'); c.width = c.height = w; x.imageSmoothingEnabled = false; x.drawImage(a.im, 0, a.f * w, w, w, 0, 0, w, w); }; a.draw = draw;
    c.set = ps => { const my = (a.tok = {}); loadImg(ps).then(im => { if (a.tok !== my) return;
      if (!im) { if (fallback && window.SPR) { const s = new Image(); s.onload = () => { a.im = s; a.n = 1; draw(); }; s.src = SPR.url(fallback); } return; }
      a.im = im; a.n = Math.max(1, Math.floor(im.naturalHeight / im.naturalWidth)); a.f = 0; a.ft = 2; draw();
      if (a.n > 1) fetch(im.src + '.mcmeta').then(r => r.ok ? r.json() : null).then(j => { if (a.tok === my && j && j.animation && j.animation.frametime) a.ft = j.animation.frametime; }).catch(() => {}); }); };
    c.set(paths); return c; }
  setInterval(() => { if (reduce) return; anims.forEach(a => { if (!a.im || a.n < 2 || !a.c.isConnected) return; if (++a.t >= a.ft) { a.t = 0; a.f = (a.f + 1) % a.n; a.draw(); } }); }, 50);

  /* ---------- relics ---------- */
  const RELIC = {
    wanderer: { a: ['item/wanderer'], b: ['item/wanderer_charging', 'item/wanderer_fully_charged'], g: '#e9930a' },
    stalker: { a: ['item/stalker'], b: ['item/stalker_offhand'], g: '#c62196' },
    devils_compass: { a: ['item/devils_compass/closed', 'item/closed'], b: ['item/devils_compass/open_16', 'item/devils_compass/open_00', 'item/open_00'], g: '#da2709' },
    disabler: { a: ['item/disabler'], b: ['item/disabler_offhand'], g: '#09d0bf' },
    dark_skull: { a: ['item/dark_skull'], b: ['item/dark_skull_offhand'], g: '#b30713' }, light_skull: { a: ['item/light_skull'], b: ['item/light_skull_offhand'], g: '#dc5d09' },
    second_life: { a: ['item/second_life'], b: ['item/second_life_offhand'], g: '#f6333a' }, berserker: { a: ['item/berserker_ready', 'item/berserker_oncooldown'], b: ['item/berserker_activated'], g: '#da2709' },
    blood_pact: { a: ['item/blood_pact'], b: ['item/blood_pact_offhand'], g: '#b30713' } };
  /* the board's slot order (W/board.txt) */
  const SLOTS = ['wanderer', 'stalker', 'devils_compass', 'disabler', 'dark_skull', 'light_skull', 'second_life', 'berserker', 'blood_pact', null];
  /* the shape of an undiscovered relic, in the card's colours */
  function silhouette(rid) { const cv = document.createElement('canvas'); cv.width = cv.height = 18; cv.className = 'px'; const def = RELIC[rid];
    loadImg(def.a).then(im => { const src = im || (window.SPR ? Object.assign(new Image(), { src: SPR.url(rid) }) : null); if (!src) return;
      const go = () => { const w = src.naturalWidth || 16, s = document.createElement('canvas'); s.width = s.height = 16; const sx = s.getContext('2d'); sx.drawImage(src, 0, 0, w, w, 0, 0, 16, 16);
        const d = sx.getImageData(0, 0, 16, 16).data, x = cv.getContext('2d'), on = (i, j) => i >= 0 && j >= 0 && i < 16 && j < 16 && d[(j * 16 + i) * 4 + 3] > 40, fill = cssv('--bg') || '#15100c', line = cssv('--edge') || '#3a2a1f';
        for (let j = -1; j < 17; j++) for (let i = -1; i < 17; i++) { if (on(i, j)) { x.fillStyle = fill; x.fillRect(i + 1, j + 1, 1, 1); } else if (on(i - 1, j) || on(i + 1, j) || on(i, j - 1) || on(i, j + 1)) { x.fillStyle = line; x.fillRect(i + 1, j + 1, 1, 1); } } };
      src.complete && src.naturalWidth ? go() : (src.onload = go); }); return cv; }
  const verb = c => c.action === 'found' ? 'la encontró' : c.action === 'recovered' ? 'la recuperó de ' + c.from_name : 'se la quitó a ' + c.from_name;

  /* ---------- items ---------- */
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const MOD_TEX = { activation_core: ['item/molten_core'], devils_compass: RELIC.devils_compass.a, berserker: RELIC.berserker.a, xp_crystal: ['item/xp_crystal_0'],
    clue_compass: ['item/clue_compass/structures_compass_00', 'item/structures_compass_00'] };
  const FALLBACK = [[/sword|scythe/, 'sword'], [/pickaxe/, 'pickaxe'], [/_axe$/, 'axe'], [/helmet|chestplate|mask/, 'chestplate'], [/leggings/, 'leggings'], [/boots/, 'boots'],
    [/crossbow/, 'crossbow'], [/bow|musket/, 'bow'], [/book|tome/, 'book'], [/torch/, 'torch'], [/apple|heart/, 'heart'], [/xp_|experience/, 'xp'], [/core/, 'molten_core']];
  const NAMECOL = { 'auyamaland:activation_core': '#FF8A2B', 'auyamaland:quartz_lapis': '#5B8CFF', 'minecraft:diamond': '#5FE3E3', 'minecraft:diamond_block': '#5FE3E3',
    'minecraft:gold_ingot': '#FFE066', 'minecraft:golden_apple': '#FFE066', 'auyamaland:xp_tome': '#80FF20', 'auyamaland:xp_crystal': '#80FF20',
    'minecraft:blaze_rod': '#FFB347', 'minecraft:blaze_powder': '#FFB347', 'minecraft:nether_wart': '#C24A7A' };
  const CURSED = ['breach_sword', 'consecutive_sword', 'raiders_axe', 'phase_pickaxe', 'nightstalker_helmet', 'close_bow', 'heavy_boots', 'reapers_scythe', 'mask'];
  const LANG = { mc: null, mod: null };
  const langReady = Promise.all([['mc', 'lang/minecraft.json'], ['mod', 'lang/auyamaland.json']].map(([k, u]) => fetch(u).then(r => r.ok ? r.json() : null).then(j => { LANG[k] = j; }).catch(() => {})));
  function itemTextures(id) { const [ns, path] = id.includes(':') ? id.split(':') : ['minecraft', id];
    if (ns === 'auyamaland') return MOD_TEX[path] || ['item/' + path];
    if (ns === 'minecraft') return ['minecraft/item/' + path, 'minecraft/block/' + path, 'minecraft/block/' + path + '_side', 'minecraft/block/' + path + '_top', 'minecraft/block/' + path + '_front'];
    return [ns + '/item/' + path]; }
  function itemFallback(id) { const p = id.split(':').pop(); if (RELIC[p]) return p; const f = FALLBACK.find(([re]) => re.test(p)); return f ? f[1] : 'chest'; }
  function itemName(it) { if (it.name) return it.name; const T = window.TXT || {}, [ns, path] = it.id.includes(':') ? it.id.split(':') : ['minecraft', it.id];
    if (it.name_key) { const v = (LANG.mod && LANG.mod[it.name_key]) || (LANG.mc && LANG.mc[it.name_key]); if (v) return v; }
    const L = ns === 'minecraft' ? LANG.mc : LANG.mod; if (L) { const v = L['item.' + ns + '.' + path] || L['block.' + ns + '.' + path]; if (v) return v; }
    if ((T.objetos || {})[it.id]) return T.objetos[it.id];
    const m = path.match(/^(wooden|stone|iron|golden|diamond|netherite|leather|chainmail)_(sword|pickaxe|axe|shovel|hoe|helmet|chestplate|leggings|boots)$/);
    if (m && T.piezas) return T.piezas[m[2]] + ' ' + T.materiales[m[1]];
    return path.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()); }
  function enchName(id, ench) { const e = ench && (ench.enchantments || []).find(x => x.id === id); if (e) return e.name;
    const [ns, p] = id.split(':'); const L = ns === 'minecraft' ? LANG.mc : LANG.mod; return (L && L['enchantment.' + ns + '.' + p]) || p.replace(/_/g, ' '); }
  function isCeiling(it, ench) { return (it.enchantments || []).some(e => { const d = ench && (ench.enchantments || []).find(x => x.id === e.id); const l = d && d.levels.find(v => v.level === e.level); return l && l.source === 'ceiling'; }); }
  function itemColour(it, ench) { const p = it.id.split(':').pop();
    if (it.id.startsWith('auyamaland:') && RELIC[p]) return '#FFAA00'; if ((it.id.startsWith('auyamaland:') && CURSED.includes(p)) || it.id.startsWith('musketmod:')) return '#FF5555';
    if (it.id === 'minecraft:enchanted_book' && isCeiling(it, ench)) return '#D48CFF'; if (NAMECOL[it.id]) return NAMECOL[it.id]; if (p.startsWith('netherite')) return '#9A8AA8';
    if (it.id === 'minecraft:enchanted_golden_apple') return '#FF55FF'; if ((it.enchantments || []).length) return '#55FFFF'; return null; }
  function slot(it, ench, cls, empty) { const s = h('span', 'slot' + (cls ? ' ' + cls : '')); if (!it) { if (empty) { const e = texAny([empty], null); e.classList.add('ghost'); e.onerror = () => e.remove(); s.appendChild(e); } return s; } s.classList.add('filled');
    const tex = it.id === 'minecraft:enchanted_book' && isCeiling(it, ench) ? ['item/ceiling_book', 'minecraft/item/enchanted_book'] : itemTextures(it.id);
    s.appendChild(texAny(tex, itemFallback(it.id))); if (it.count > 1) s.appendChild(h('span', 'n', it.count));
    const lines = [esc(itemName(it))];
    (it.enchantments || []).forEach(e => lines.push(esc(enchName(e.id, ench)) + ' ' + (ROMAN[e.level - 1] || e.level)));
    if (it.max_damage) lines.push('Durabilidad ' + (it.max_damage - (it.damage || 0)) + ' / ' + it.max_damage);
    s.dataset.tip = lines.join('|'); const col = itemColour(it, ench); if (col) s.dataset.tc = col; return s; }

  /* ---------- heads ---------- */
  function headCanvas(name) { const c = document.createElement('canvas'); c.width = c.height = 8; c.className = 'px'; const x = c.getContext('2d');
    let hsh = 0; for (const ch of name || 'x') hsh = (hsh * 31 + ch.charCodeAt(0)) >>> 0;
    const skins = ['#d27f3b', '#a3582b', '#ea9955', '#7d2e1a', '#e38847'], hairs = ['#3c0a08', '#681704', '#190b12', '#b76e17', '#900e0e', '#3b3a56'], eyes = ['#1a46a6', '#127f4d', '#5b1a11', '#65127f'];
    const f = (cc, a, b, w, hh) => { x.fillStyle = cc; x.fillRect(a, b, w, hh); };
    if (!name) { f('#2a1e16', 0, 0, 8, 8); f('#3a2a1f', 1, 1, 6, 6); f('#a8968a', 2, 4, 1, 1); f('#a8968a', 5, 4, 1, 1); return c; }
    const sk = skins[hsh % 5], hr = hairs[(hsh >> 3) % 6], ey = eyes[(hsh >> 6) % 4];
    f(sk, 0, 0, 8, 8); f(hr, 0, 0, 8, 2); f(hr, 0, 2, 1, 2 + (hsh & 1)); f(hr, 7, 2, 1, 2); f('#fff', 1, 4, 2, 1); f('#fff', 5, 4, 2, 1); f(ey, 2, 4, 1, 1); f(ey, 5, 4, 1, 1); f('#7f1812', 3, 6, 2, 1); return c; }
  function skinHead(url, name) { const c = headCanvas(name); if (url) { const im = new Image(); im.crossOrigin = 'anonymous';
      im.onload = () => { const x = c.getContext('2d'); x.clearRect(0, 0, 8, 8); x.drawImage(im, 8, 8, 8, 8, 0, 0, 8, 8); x.drawImage(im, 40, 8, 8, 8, 0, 0, 8, 8); }; im.src = url; } return c; }

  /* ---------- the hero's sky: a soft glow and a few moving things, one look per night ---------- */
  const NIGHTS = {
    1: { glow: '#c0622b', fx: ['stars', 'sparks'] }, 2: { glow: '#6b3fa0', fx: ['stars'] }, 3: { glow: '#c0622b', fx: ['stars', 'beam'] },
    4: { glow: '#2c6fa8', fx: ['stars', 'beam'] }, 5: { glow: '#33507e', fx: ['stars', 'fog', 'flies'] }, 6: { glow: '#a0204a', fx: ['embers'] },
    7: { glow: '#3b4a66', fx: ['rain'] }, 8: { glow: '#1f8a8a', fx: ['stars', 'souls'] }, 9: { glow: '#6a2a9a', fx: ['embers'] },
    10: { glow: '#2e3550', fx: ['rain', 'flash'] }, 11: { glow: '#a02626', fx: ['stars', 'beam'] }, 12: { glow: '#8c1c1c', fx: ['ash'] },
    13: { glow: '#5a1420', fx: ['ash', 'fog'] }, 14: { glow: '#b01a1a', fx: ['moon', 'redrain'] } };
  function Sky(cv) { const x = cv.getContext('2d'); let W = 0, H = 0, night = 1, P = [], t = 0, flash = 0; const R = Math.random;
    function size() { const r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height; cv.width = Math.round(W * d); cv.height = Math.round(H * d); x.setTransform(d, 0, 0, d, 0, 0); seed(); }
    function seed() { const fx = NIGHTS[night].fx; P = [];
      if (fx.includes('stars')) for (let i = 0; i < W * H / 4000; i++) P.push({ k: 'star', x: R() * W, y: R() * H * .7, r: R() * 1.2 + .3, p: R() * 6 });
      if (fx.includes('sparks') || fx.includes('embers')) for (let i = 0; i < 50; i++) P.push({ k: 'ember', x: R() * W, y: R() * H, v: .3 + R() * .6, r: R() * 1.6 + .6, p: R() * 6 });
      if (fx.includes('flies')) for (let i = 0; i < 26; i++) P.push({ k: 'fly', x: R() * W, y: H * (.5 + R() * .5), p: R() * 6 });
      if (fx.includes('souls')) for (let i = 0; i < 30; i++) P.push({ k: 'soul', x: R() * W, y: R() * H, v: .2 + R() * .4, p: R() * 6 });
      if (fx.includes('rain') || fx.includes('redrain')) for (let i = 0; i < W / 4; i++) P.push({ k: 'rain', x: R() * W, y: R() * H, v: 7 + R() * 5, red: fx.includes('redrain') });
      if (fx.includes('ash')) for (let i = 0; i < 70; i++) P.push({ k: 'ash', x: R() * W, y: R() * H, v: .3 + R() * .5, p: R() * 6 });
      if (fx.includes('fog')) for (let i = 0; i < 7; i++) P.push({ k: 'fog', x: R() * W, y: H * (.45 + R() * .5), r: 120 + R() * 180, v: .1 + R() * .2 }); }
    function frame() { t++; const N = NIGHTS[night], fx = N.fx, bg = cssv('--bg') || '#15100c';
      x.fillStyle = bg; x.fillRect(0, 0, W, H);
      let g = x.createRadialGradient(W / 2, -H * .1, 0, W / 2, -H * .1, Math.max(W, H) * .8); g.addColorStop(0, N.glow + '55'); g.addColorStop(1, N.glow + '00'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      if (fx.includes('moon')) { const mx = W * .78, my = H * .28; g = x.createRadialGradient(mx, my, 0, mx, my, 160); g.addColorStop(0, '#d0303066'); g.addColorStop(1, '#d0303000'); x.fillStyle = g; x.fillRect(0, 0, W, H);
        x.fillStyle = '#b8242a'; x.beginPath(); x.arc(mx, my, 34, 0, 7); x.fill(); }
      if (fx.includes('beam')) { const bx = W * .72; g = x.createLinearGradient(bx - 40, 0, bx + 40, 0); g.addColorStop(0, N.glow + '00'); g.addColorStop(.5, N.glow + (t % 120 < 60 ? '40' : '36')); g.addColorStop(1, N.glow + '00'); x.fillStyle = g; x.fillRect(bx - 40, 0, 80, H); }
      for (const p of P) {
        if (p.k === 'star') { const a = .35 + .35 * Math.sin(t / 40 + p.p); x.fillStyle = 'rgba(234,223,211,' + a + ')'; x.fillRect(p.x, p.y, p.r, p.r); }
        else if (p.k === 'ember') { if (!reduce) { p.y -= p.v; p.x += Math.sin(t / 30 + p.p) * .3; } if (p.y < -4) { p.y = H + 4; p.x = R() * W; } x.fillStyle = 'rgba(232,140,60,' + (.4 + .4 * Math.sin(t / 15 + p.p)) + ')'; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.fill(); }
        else if (p.k === 'fly') { if (!reduce) { p.x += Math.sin(t / 50 + p.p) * .4; p.y += Math.cos(t / 60 + p.p) * .3; } const a = Math.max(0, Math.sin(t / 25 + p.p)); x.fillStyle = 'rgba(214,232,110,' + a * .8 + ')'; x.beginPath(); x.arc(p.x, p.y, 1.6, 0, 7); x.fill(); }
        else if (p.k === 'soul') { if (!reduce) p.y -= p.v; if (p.y < -4) { p.y = H + 4; p.x = R() * W; } x.fillStyle = 'rgba(80,220,210,' + (.25 + .3 * Math.sin(t / 20 + p.p)) + ')'; x.beginPath(); x.arc(p.x, p.y, 2, 0, 7); x.fill(); }
        else if (p.k === 'rain') { if (!reduce) { p.y += p.v; p.x -= p.v * .25; } if (p.y > H) { p.y = -20; p.x = R() * (W + 100); } x.strokeStyle = p.red ? 'rgba(210,60,60,.45)' : 'rgba(170,180,200,.25)'; x.lineWidth = 1; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(p.x - 3, p.y + 12); x.stroke(); }
        else if (p.k === 'ash') { if (!reduce) { p.y += p.v; p.x += Math.sin(t / 40 + p.p) * .4; } if (p.y > H) { p.y = -4; p.x = R() * W; } x.fillStyle = 'rgba(168,150,138,.35)'; x.fillRect(p.x, p.y, 2, 2); }
        else if (p.k === 'fog') { if (!reduce) p.x += p.v; if (p.x - p.r > W) p.x = -p.r; const gg = x.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r); gg.addColorStop(0, 'rgba(160,150,170,.07)'); gg.addColorStop(1, 'rgba(160,150,170,0)'); x.fillStyle = gg; x.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2); } }
      if (fx.includes('flash') && !reduce) { if (!flash && R() < .004) flash = 6; if (flash) { x.fillStyle = 'rgba(220,225,255,' + flash * .025 + ')'; x.fillRect(0, 0, W, H); flash--; } } }
    function setNight(n) { night = Math.max(1, Math.min(14, n || 1)); seed(); frame(); }
    size(); addEventListener('resize', size); frame(); if (!reduce) setInterval(frame, 40);
    return { setNight }; }

  window.UI = { h, esc, cssv, loadImg, texAny, animTex, RELIC, SLOTS, silhouette, verb, slot, itemName, headCanvas, skinHead, Sky, langReady, ROMAN };
})();
