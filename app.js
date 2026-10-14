/* Auyamaland: the page. Reads the season from Supabase exactly as docs/website-contract.md says, or the example data in
   demo.js when config.js has no anon key. */
(async function () {
  const C = window.AUY_CONFIG || {}, T = window.TXT || {}, U = window.UI, $ = s => document.querySelector(s), h = U.h, esc = U.esc;
  const DEMO = !C.supabase_anon_key, D = window.AUY_DEMO, TZ = C.time_zone || 'America/Caracas';
  let sb = null;
  if (!DEMO) { try { const m = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm'); sb = m.createClient(C.supabase_url, C.supabase_anon_key); } catch (e) { console.error('Supabase no cargó', e); } }
  const S = { status: null, statusAt: null, board: null, boardAt: '', live: null, liveAt: '', ench: null, mech: null, world: null,
    session: null, profile: null, player: null, settings: {}, admin: false, demoIn: true, skinV: 0 };

  /* ---------- time, in the season's clock ---------- */
  const partsOf = (d, o) => Object.fromEntries(new Intl.DateTimeFormat('en-US', Object.assign({ timeZone: TZ }, o)).formatToParts(d).map(p => [p.type, p.value]));
  function t12(v) { const d = new Date(v); if (isNaN(d)) return ''; const p = partsOf(d, { hour: 'numeric', minute: '2-digit', hour12: true }); return p.hour + ':' + p.minute + (p.dayPeriod || '').toLowerCase(); }
  function dayKey(v) { const p = partsOf(new Date(v), { year: 'numeric', month: '2-digit', day: '2-digit' }); return p.year + '-' + p.month + '-' + p.day; }
  const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'], DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  function fecha(v) { const k = dayKey(v).split('-'); return (+k[2]) + ' ' + MESES[+k[1] - 1]; }
  function relDay(v) { const k = dayKey(v); return k === dayKey(Date.now()) ? 'hoy' : k === dayKey(Date.now() + 864e5) ? 'mañana' : k === dayKey(Date.now() - 864e5) ? 'ayer' : 'el ' + fecha(v); }
  const stamp = v => { const r = relDay(v); return (r.startsWith('el ') ? r.slice(3) : r) + ', ' + t12(v); };
  function tzOffset(ts) { const p = partsOf(new Date(ts), { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }); return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - Math.floor(ts / 60000) * 60000; }
  function at(ymd, hh, mm) { const [y, m, d] = ymd.split('-').map(Number), g = Date.UTC(y, m - 1, d, hh, mm); return new Date(g - tzOffset(g)); }
  const hm = t => { const m = String(t).match(/(\d+):(\d+)\s*(am|pm)/i); return m ? [(+m[1] % 12) + (m[3].toLowerCase() === 'pm' ? 12 : 0), +m[2]] : [19, 0]; };

  /* ---------- data ---------- */
  async function publicDoc(key) {
    if (DEMO) { const d = D[key]; return d ? { data: d, updated_at: new Date().toISOString() } : null; }
    if (!sb) return null;
    const { data, error } = await sb.from('public_data').select('data, updated_at').eq('key', key).maybeSingle();
    if (error) { console.warn(key, error.message); return null; } return data; }
  if (DEMO) { const n = new Date(); n.setHours(19, 0, 0, 0); if (n < new Date()) n.setDate(n.getDate() + 1); D.status.next_opening = n.toISOString(); }

  /* ---------- the schedule: each night opens at 7:00pm; times after midnight belong to the night before ---------- */
  const stale = () => !DEMO && (!S.statusAt || Date.now() - new Date(S.statusAt).getTime() > 120000);
  const seasonDay = s => !s ? 0 : s.after_season ? 15 : s.before_season ? 0 : s.season_day || 0;
  function base() { const s = S.status; if (!s || s.after_season) return null;
    if (s.open && !s.before_season) { let st = at(dayKey(Date.now()), 19, 0); if (st > Date.now()) st = new Date(st.getTime() - 864e5); return { n: s.season_day, t: st }; }
    if (s.next_opening) return { n: s.before_season ? 1 : (s.season_day || 0) + 1, t: new Date(s.next_opening) }; return null; }
  function startOf(n) { const b = base(); return b ? new Date(b.t.getTime() + (n - b.n) * 864e5) : null; }
  function nightEvents(n) { const st = startOf(n); if (!st) return []; const k = dayKey(st), k2 = dayKey(st.getTime() + 864e5);
    return [{ t: '7:00pm', name: n === 1 ? 'Empieza la temporada' : 'Abre el mundo', open: true }].concat((T.noches[n] || []).map(([t, name, desc]) => ({ t, name, desc })), [{ t: '3:00am', name: 'Cierra el mundo', close: true }])
      .map(e => { const [hh, mm] = hm(e.t); return Object.assign(e, { n, when: at(hh >= 12 ? k : k2, hh, mm) }); }); }
  function nextEvent() { const b = base(); if (!b) return null; for (let n = Math.max(1, b.n); n <= 14; n++) { const ev = nightEvents(n).filter(e => e.when.getTime() > Date.now()); if (ev.length) return ev[0]; } return null; }
  function until(t) { const m = Math.max(0, Math.round((t - Date.now()) / 60000)); if (m < 1) return 'ahora'; const d = Math.floor(m / 1440), hh = Math.floor(m % 1440 / 60), mm = m % 60; return 'en ' + (d ? d + 'd ' + hh + 'h' : hh ? hh + 'h ' + mm + 'm' : mm + 'm'); }

  /* ---------- hero ---------- */
  const sky = U.Sky($('#sky'));
  let liveDay = 0;
  function renderClock() { const s = S.status, st = $('#state'); $('#clock').textContent = t12(Date.now()); $('#clock').classList.toggle('live', !!(s && s.open && !stale())); st.className = 'tag';
    if (!s) st.textContent = 'Sin datos'; else if (s.after_season) st.textContent = 'Terminó';
    else if (s.open && !stale()) { st.classList.add('ok'); st.textContent = 'Abierto · ' + (s.players_online || 0) + ' jugando'; }
    else if (s.open) { st.classList.add('bad'); st.textContent = 'Sin respuesta'; } else st.textContent = 'Cerrado';
    const e = s && !s.after_season ? nextEvent() : null;
    if (!e) { $('#next').textContent = s && s.after_season ? 'La temporada terminó.' : ''; $('#nextsub').textContent = ''; $('#chips').innerHTML = ''; return; }
    $('#next').innerHTML = esc(e.name) + ' <span class="in">' + until(e.when) + '</span>';
    let sub = e.desc || '';
    let chips = [];
    if (e.open) { chips = nightEvents(e.n).filter(x => !x.open && !x.close).map(x => x.name); sub = 'Noche ' + e.n + ' de 14, ' + relDay(e.when) + ' a las 7:00pm'; }
    if (e.close) sub = 'Tu sombra se queda donde estés.';
    $('#nextsub').textContent = sub; $('#chips').innerHTML = chips.map(c => '<span class="chip">' + esc(c) + '</span>').join(''); }
  setInterval(renderClock, 1000);

  /* ---------- the season: one bar, a point per night; hover or touch a point for what it brings ---------- */
  const EV = { 1: 1, 3: 1, 4: 1, 6: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1, 13: 1, 14: 1 };
  function renderSeason() { const s = S.status, d = seasonDay(s), track = $('#track');
    $('#season-fill').style.width = (Math.max(0, Math.min(13, d - 1)) / 13 * 100) + '%';
    $('#season-meta').textContent = !s ? '' : s.after_season ? 'Catorce noches. Terminó.' : s.before_season ? 'Empieza ' + (s.next_opening ? relDay(s.next_opening) : 'pronto') + ' a las 7:00pm'
      : 'Noche ' + d + ' de 14' + (s.players_season ? ' · ' + s.players_season + ' jugadores' : '') + ' · de 7:00pm a 3:00am';
    track.querySelectorAll('.pt').forEach(p => p.remove());
    for (let n = 1; n <= 14; n++) { const p = h('span', 'pt' + (n < d ? ' past' : '') + (n === d ? ' now' : '') + (EV[n] ? ' ev' : '') + (n === 14 ? ' last' : ''));
      p.style.left = ((n - 1) / 13 * 100) + '%'; p.tabIndex = 0; p.innerHTML = '<i></i><span>' + n + '</span>';
      const st = startOf(n), when = st ? DIAS[new Date(at(dayKey(st), 12, 0)).getUTCDay()] + ' ' + fecha(st) : '';
      const rows = n === 14 ? T.final : (T.noches[n] || []).map(r => r[0] + '  ' + r[1]);
      p.dataset.tip = 'Noche ' + n + (when ? ' · ' + when : '') + (n === d ? ' · esta noche' : '') + '|' + (rows.length ? rows.map(esc).join('|') : 'Nada anunciado');
      p.dataset.tc = n === 14 ? 'var(--blood)' : n === d ? 'var(--pumpkin-hi)' : ''; p.setAttribute('aria-label', 'Noche ' + n); track.appendChild(p); } }

  function renderState() { const s = S.status; renderClock(); renderSeason(); renderFoot(); if (!s) return;
    const d = seasonDay(s); if (d !== liveDay) { liveDay = d; sky.setNight(Math.max(1, Math.min(14, d))); }
    if (s.discord) $('#discord').href = s.discord; }
  async function loadStatus() { const r = await publicDoc('status'); if (r) { S.status = r.data; S.statusAt = r.updated_at; } renderState(); }

  /* ---------- relics ---------- */
  let picked = null;
  function renderRelics() { const grid = $('#relics'), by = {}; grid.innerHTML = ''; ((S.board && S.board.slots) || []).forEach(s => by[s.slot] = s);
    let found = 0;
    U.SLOTS.forEach((rid, i) => { const s = by[i + 1] || { slot: i + 1, discovered: false }, b = h('button', 'relic'); b.type = 'button'; const art = h('span', 'art'); b.appendChild(art);
      if (s.discovered && rid) { found++; const def = U.RELIC[rid], im = U.animTex(def.a, rid); art.appendChild(im); b.classList.add('found'); b.style.setProperty('--glow', def.g);
        b.insertAdjacentHTML('beforeend', '<span class="nm">' + esc(s.name) + '</span><span class="who">' + esc(s.holder ? s.holder.name : '') + '</span>');
        const desc = (T.reliquias || {})[rid]; if (desc) { b.dataset.tip = esc(s.name) + '|' + esc(desc); b.dataset.tc = 'var(--gold)'; }
        b.onmouseenter = () => im.set(def.b.concat(def.a)); b.onmouseleave = () => im.set(def.a);
        b.onclick = () => { picked = picked === rid ? null : rid; renderLedger(); grid.querySelectorAll('.relic').forEach(o => o.classList.toggle('sel', o === b && picked === rid)); };
        if (picked === rid) b.classList.add('sel'); }
      else { b.classList.add('hidden-r'); b.disabled = true; if (rid) art.appendChild(U.silhouette(rid)); else art.innerHTML = '<span class="meta" style="font-size:28px">?</span>';
        b.insertAdjacentHTML('beforeend', '<span class="nm">Sin descubrir</span><span class="who">&nbsp;</span>'); }
      grid.appendChild(b); });
    $('#relic-count').textContent = found + ' / 10'; renderLedger(); fitLedger(); }
  /* the ledger is as tall as the relic cards beside it, whatever its length */
  function fitLedger() { const l = $('#ledger'); l.style.setProperty('--h', innerWidth > 980 ? $('#relics').offsetHeight + 'px' : '340px'); }
  addEventListener('resize', fitLedger);
  function renderLedger() { const el = $('#ledger'), slots = ((S.board && S.board.slots) || []).filter(s => s.discovered);
    const s = picked && slots.find(x => x.relic === picked);
    if (s) { el.innerHTML = '<div class="head"><h3>' + esc(s.name) + '</h3><button class="btn sm" type="button" id="ledger-all">Todas</button></div><ol></ol>';
      $('#ledger-all').onclick = () => { picked = null; renderRelics(); };
      const ol = el.querySelector('ol'); (s.custody || []).slice().reverse().forEach(c => ol.insertAdjacentHTML('beforeend', '<li><span>' + esc(c.name) + ' ' + esc(U.verb(c)) + '</span><span class="meta">Día ' + c.day + ' · ' + esc(c.time) + '</span></li>')); return; }
    el.innerHTML = '<div class="head"><h3>Últimos movimientos</h3></div><ol></ol>'; const ol = el.querySelector('ol');
    const all = []; slots.forEach(x => (x.custody || []).forEach(c => { const [hh, mm] = hm(c.time); all.push({ c, r: x.name, k: c.day * 1440 + ((hh + 5) % 24) * 60 + mm }); }));
    all.sort((a, b) => b.k - a.k);
    if (!all.length) ol.innerHTML = '<li class="none">Nadie ha equipado una reliquia todavía.</li>';
    all.slice(0, 30).forEach(({ c, r }) => ol.insertAdjacentHTML('beforeend', '<li><span><b class="glow" style="font-weight:600;color:var(--gold)">' + esc(r) + '</b> · ' + esc(c.name) + ' ' + esc(U.verb(c)) + '</span><span class="meta">Día ' + c.day + ' · ' + esc(c.time) + '</span></li>')); }
  async function loadBoard() { const r = await publicDoc('board'); if (!r) { if (!S.board) $('#relics').innerHTML = '<p class="empty">El tablero todavía no se ha publicado.</p>'; return; }
    if (r.updated_at === S.boardAt && S.board) return; S.board = r.data; S.boardAt = r.updated_at; renderRelics(); }

  /* ---------- the map ---------- */
  const cv = $('#map'); let marks = [];
  const rgbOf = n => { const v = U.cssv(n) || '#000000'; return [parseInt(v.slice(1, 3), 16), parseInt(v.slice(3, 5), 16), parseInt(v.slice(5, 7), 16)]; };
  function drawMap() { const L = S.live; if (!L) return; const B = L.border || { center_x: 0, center_z: 0, size: 1700 };
    const bpp = [2, 4, 8, 16].find(b => 128 * b >= B.size * 1.08) || 16;
    marks = MCMap.draw(cv, { cx: B.center_x, cz: B.center_z, bpp }, { data: L, world: S.world, terrain: !!C.invented_terrain, edge: rgbOf('--bg'), paper: [rgbOf('--panel-2'), rgbOf('--edge-soft'), rgbOf('--edge')],
      t: { mesas: T.mesas, dirs: T.direcciones, time: t12, biome: b => (T.biomas || {})[b] || String(b || '').split(':').pop().replace(/_/g, ' ') } });
    $('#mapsize').textContent = 'Borde ' + B.size + (B.moving && B.target_size ? ' → ' + B.target_size : '');
    $('#mapscale').textContent = '1 píxel = ' + bpp + ' bloques';
    $('#mapnext').textContent = B.next ? 'Siguiente paso: ' + B.next.size + ', día ' + B.next.day + ' a las ' + (B.next.at_text || t12(B.next.at)) + (B.next.seconds ? '.' : ', de golpe.') : ''; }
  async function loadWorld() { try { const [im, j] = await Promise.all([U.loadImg('map/world'), fetch('textures/map/world.json').then(r => r.ok ? r.json() : null)]); if (!im || !j) return;
    const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
    S.world = { px: x.getImageData(0, 0, c.width, c.height).data, w: c.width, h: c.height, cx: j.center_x || 0, cz: j.center_z || 0, bpp: j.blocks_per_pixel || 4 }; } catch (e) { } }
  async function loadMap() { const r = await publicDoc('live_map'); if (!r) return; if (r.updated_at === S.liveAt && S.live) return; S.live = r.data; S.liveAt = r.updated_at; drawMap(); }
  cv.addEventListener('mousemove', e => { const r = cv.getBoundingClientRect(), s = r.width / 128, px = Math.floor((e.clientX - r.left) / s), py = Math.floor((e.clientY - r.top) / s);
    const m = marks.find(k => Math.abs(k.x - px) <= (k.r || 4) && Math.abs(k.y - py) <= (k.r || 4));
    if (m) { cv.dataset.tip = esc(m.title) + '|' + m.lines.map(esc).join('|'); cv.dataset.tc = m.col; cv.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, clientX: e.clientX, clientY: e.clientY })); }
    else { delete cv.dataset.tip; } });

  /* ---------- enchantments ---------- */
  const TYPES = { sword: 'Espada', axe: 'Hacha', pickaxe: 'Pico', shovel: 'Pala', hoe: 'Azada', bow: 'Arco', crossbow: 'Ballesta', trident: 'Tridente', fishing_rod: 'Caña',
    helmet: 'Casco', chestplate: 'Peto', leggings: 'Grebas', boots: 'Botas', shield: 'Escudo', shears: 'Tijeras' };
  const TIERN = { table: 'Mesa', found: 'Encontrado', ceiling: 'Libro de techo', commons: 'Único' };
  const TIERD = { table: 'lo da una mesa de encantamiento', found: 'solo se encuentra en el mundo', ceiling: 'solo en libros raros', commons: 'solo en objetos únicos con nombre' };
  let filter = '';
  function renderBooks() { const box = $('#books'), list = (S.ench && S.ench.enchantments) || []; box.innerHTML = '';
    if (!list.length) { box.innerHTML = '<p class="empty">Todavía no hay nada publicado.</p>'; $('#filters').innerHTML = ''; return; }
    const types = Object.keys(TYPES).filter(t => list.some(e => (e.items || []).includes(t)));
    $('#filters').innerHTML = ''; [''].concat(types).forEach(t => { const b = h('button', 'btn sm', t ? TYPES[t] : 'Todos'); b.type = 'button'; b.setAttribute('aria-pressed', filter === t); b.onclick = () => { filter = t; renderBooks(); }; $('#filters').appendChild(b); });
    list.filter(e => !filter || (e.items || []).includes(filter)).forEach(e => { const ceil = e.levels.some(l => l.source === 'ceiling'), c = h('article', 'card book');
      c.appendChild(U.texAny(ceil ? ['item/ceiling_book', 'minecraft/item/enchanted_book'] : ['minecraft/item/enchanted_book'], 'book'));
      c.insertAdjacentHTML('beforeend', '<h3>' + esc(e.name) + '</h3><p>' + esc(e.description || '') + '</p><div class="lv">' +
        e.levels.map(l => '<span tabindex="0" style="color:var(--tier-' + l.source + ')" data-tc="var(--tier-' + l.source + ')" data-tip="' + esc(e.name) + ' ' + (U.ROMAN[l.level - 1] || l.level) + '|' + TIERN[l.source] + ': ' + TIERD[l.source] + '">' + (U.ROMAN[l.level - 1] || l.level) + '</span>').join('') + '</div>');
      box.appendChild(c); }); }
  async function loadBooks() { const r = await publicDoc('enchantments'); if (r) S.ench = r.data; renderBooks(); }
  async function loadMech() { const r = await publicDoc('mechanics'); if (r) S.mech = r.data; }

  /* ---------- account ---------- */
  const signedIn = () => DEMO ? S.demoIn : !!S.session;
  const myName = () => (S.profile && S.profile.name) || (S.player && S.player.name) || '';
  function skinUrl() { const p = S.profile; if (!p) return null;
    if (p.skin_present && !DEMO) return sb.storage.from('skins').getPublicUrl(S.session.user.id + '.png').data.publicUrl + '?v=' + encodeURIComponent((p.skin_updated_at || '') + S.skinV);
    return 'textures/minecraft/entity/' + (p.skin_model === 'slim' ? 'alex' : 'steve') + '.png'; }
  async function loadPrivate() {
    if (DEMO) { if (S.demoIn) { S.profile = D.profile; S.player = D.player; } else S.profile = S.player = null; return renderPrivate(); }
    if (!sb) return renderPrivate();
    const { data } = await sb.auth.getSession(); S.session = data.session;
    if (!S.session) { S.profile = S.player = null; S.admin = false; return renderPrivate(); }
    const uid = S.session.user.id;
    const [pr, ps, ad] = await Promise.all([
      sb.from('profiles').select('name, created_at, skin_model, skin_present, skin_updated_at').eq('id', uid).maybeSingle(),
      sb.from('player_state').select('data, updated_at').eq('user_id', uid).maybeSingle(), sb.rpc('is_admin')]);
    S.profile = pr.data || null; S.player = ps.data ? ps.data.data : null; S.admin = !!ad.data; renderPrivate(); }
  async function loadSettings() { if (DEMO) { S.settings = D.settings; return; } if (!sb) return;
    const { data } = await sb.from('settings').select('key, value'); S.settings = {}; (data || []).forEach(r => S.settings[r.key] = r.value); }

  const av = $('#avatar'), acc = h('div', 'acc'); acc.hidden = true; document.body.appendChild(acc);
  function placeAcc() { const r = av.getBoundingClientRect(); acc.style.top = (r.bottom + 8) + 'px'; acc.style.left = Math.max(16, r.right - acc.offsetWidth) + 'px'; acc.style.maxHeight = (innerHeight - r.bottom - 24) + 'px'; acc.style.overflow = 'auto'; }
  function openAcc() { acc.hidden = false; renderAcc(); placeAcc(); const f = acc.querySelector('input'); if (f) f.focus(); }
  av.onclick = e => { e.stopPropagation(); acc.hidden ? openAcc() : (acc.hidden = true); };
  document.addEventListener('click', e => { const p = e.composedPath(); const opener = p.find(n => n.dataset && 'openAcc' in n.dataset); if (opener) { e.preventDefault(); openAcc(); return; }
    if (!acc.hidden && !p.includes(acc) && !p.includes(av)) acc.hidden = true; });
  addEventListener('resize', () => !acc.hidden && placeAcc());
  function renderAv() { av.innerHTML = ''; av.appendChild(signedIn() ? U.skinHead(skinUrl(), myName()) : U.headCanvas('')); av.dataset.tip = signedIn() ? esc(myName()) + '|Tu cuenta' : 'Entrar|Con tu cuenta del juego'; }
  let skinModel = 'classic';
  function renderAcc() {
    if (!signedIn()) {
      acc.innerHTML = '<h3>Entrar</h3><form id="li" style="display:grid;gap:12px"><label class="field">Nombre en el juego<input id="li-u" autocomplete="username" maxlength="16"></label>' +
        '<label class="field">Contraseña<input id="li-p" type="password" autocomplete="current-password"></label><button class="btn primary">Entrar</button><div class="msg" id="li-m" role="status"></div></form>' +
        '<p class="faint" style="font-size:13px">La cuenta se crea en el juego. ¿Olvidaste la contraseña? Pídele un código al dueño del servidor.</p>';
      $('#li').onsubmit = async e => { e.preventDefault(); const n = $('#li-u').value.trim(), p = $('#li-p').value, m = $('#li-m'); m.className = 'msg';
        if (!n || !p) { m.textContent = 'Escribe tu nombre y tu contraseña.'; return; } m.textContent = 'Entrando…';
        if (DEMO) { S.demoIn = true; await loadPrivate(); return renderAcc(); }
        if (!sb) { m.textContent = 'No hay conexión con el servidor de cuentas.'; return; }
        const { error } = await sb.auth.signInWithPassword({ email: n.toLowerCase() + '@' + C.email_domain, password: p });
        if (error) { m.className = 'msg bad'; m.textContent = 'Nombre o contraseña incorrectos.'; return; }
        await loadPrivate(); renderAcc(); };
      return; }
    const p = S.profile || {}, pl = S.player; skinModel = p.skin_model || 'classic';
    acc.innerHTML = '<div class="who"></div><hr><div style="display:grid;gap:10px"><b style="font-weight:600">Tu skin</b>' +
      '<label class="drop" style="position:relative">Suelta tu PNG o toca para elegirlo<span class="faint" style="font-size:12px">64 × 64 o 64 × 32, máximo 32 KB</span><input type="file" accept="image/png" id="sk-f"></label>' +
      '<div class="row-btns"><button type="button" class="btn sm" data-m="classic">Brazos normales</button><button type="button" class="btn sm" data-m="slim">Brazos finos</button>' +
      (p.skin_present ? '<button type="button" class="btn sm" id="sk-rm">Quitar</button>' : '') + '</div><div class="msg" id="sk-m" role="status"></div></div><hr>' +
      '<form id="cp" style="display:grid;gap:10px"><b style="font-weight:600">Cambiar contraseña</b><label class="field">Nueva<input id="cp-1" type="password" autocomplete="new-password"></label>' +
      '<label class="field">Otra vez<input id="cp-2" type="password" autocomplete="new-password"></label><button class="btn">Cambiar</button><div class="msg" id="cp-m" role="status"></div></form><hr>' +
      '<button type="button" class="btn" id="out">Cerrar sesión</button>';
    const who = acc.querySelector('.who'); who.appendChild(U.skinHead(skinUrl(), myName()));
    who.insertAdjacentHTML('beforeend', '<div style="display:grid;gap:2px"><h3>' + esc(myName()) + '</h3><span class="meta">' + [pl && pl.faction ? esc(pl.faction.name) : '', p.created_at ? 'desde el ' + fecha(p.created_at) : ''].filter(Boolean).join(' · ') + '</span></div>');
    const mb = acc.querySelectorAll('[data-m]'), setM = m => { skinModel = m; mb.forEach(b => b.setAttribute('aria-pressed', b.dataset.m === m)); }; mb.forEach(b => b.onclick = () => setM(b.dataset.m)); setM(skinModel);
    $('#out').onclick = async () => { if (DEMO) S.demoIn = false; else await sb.auth.signOut(); await loadPrivate(); renderAcc(); };
    $('#cp').onsubmit = async e => { e.preventDefault(); const a = $('#cp-1').value, c = $('#cp-2').value, m = $('#cp-m'); m.className = 'msg bad';
      if (a.length < 6) return m.textContent = 'Al menos 6 caracteres.'; if (a.length > 64) return m.textContent = 'Como máximo 64 caracteres.'; if (a !== c) return m.textContent = 'No coinciden.';
      m.className = 'msg'; m.textContent = 'Cambiando…';
      if (!DEMO) { const { error } = await sb.auth.updateUser({ password: a }); if (error) { m.className = 'msg bad'; return m.textContent = 'No se pudo cambiar. Prueba otra vez.'; } await sb.auth.signOut({ scope: 'others' }); }
      $('#cp-1').value = $('#cp-2').value = ''; m.textContent = 'Cambiada. El juego te la pedirá en tu próxima entrada.'; };
    const sm = $('#sk-m'), rm = $('#sk-rm');
    if (rm) rm.onclick = async () => { sm.textContent = 'Quitando…'; if (!DEMO) { await sb.storage.from('skins').remove([S.session.user.id + '.png']); await sb.rpc('skin_removed'); }
      S.skinV++; await loadPrivate(); renderAcc(); $('#sk-m').textContent = 'Listo. En el juego cambia en menos de un minuto.'; };
    const drop = acc.querySelector('.drop'); ['dragover', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); if (ev === 'drop' && e.dataTransfer.files[0]) upload(e.dataTransfer.files[0]); }));
    $('#sk-f').onchange = e => e.target.files[0] && upload(e.target.files[0]);
    async function upload(f) { sm.className = 'msg bad';
      if (f.type !== 'image/png') return sm.textContent = 'Tiene que ser un PNG.'; if (f.size > 32768) return sm.textContent = 'Pesa más de 32 KB.';
      const ok = await new Promise(res => { const im = new Image(); im.onload = () => res(im.width === 64 && (im.height === 64 || im.height === 32)); im.onerror = () => res(false); im.src = URL.createObjectURL(f); });
      if (!ok) return sm.textContent = 'Tiene que medir 64 × 64 o 64 × 32.';
      sm.className = 'msg'; sm.textContent = 'Subiendo…';
      if (!DEMO) { const uid = S.session.user.id;
        const { error } = await sb.storage.from('skins').upload(uid + '.png', f, { upsert: true, contentType: 'image/png' }); if (error) { sm.className = 'msg bad'; return sm.textContent = 'No se pudo subir. Prueba otra vez.'; }
        const r = await sb.rpc('skin_uploaded', { model: skinModel }); if (r.error) { sm.className = 'msg bad'; return sm.textContent = 'Se subió, pero el juego no se enteró. Prueba otra vez.'; } }
      S.skinV++; await loadPrivate(); renderAcc(); $('#sk-m').textContent = 'Lista. En el juego se verá en menos de un minuto.'; } }

  /* ---------- your shadow ---------- */
  const MC = { green: '#55FF55', dark_green: '#00AA00', aqua: '#55FFFF', dark_aqua: '#00AAAA', blue: '#5555FF', light_purple: '#FF55FF', dark_purple: '#AA00AA', yellow: '#FFFF55', gold: '#FFAA00', red: '#FF5555', dark_red: '#d23a3a' };
  const mmss = s => { s = Math.max(0, s | 0); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  function renderPrivate() { renderAv(); renderSombra(); if (!acc.hidden) renderAcc(); }
  function renderSombra() { const el = $('#sombra'); el.className = 'card shadow'; el.innerHTML = '';
    if (!signedIn()) { el.innerHTML = '<p class="muted">Lo que lleva tu sombra, tu nivel, tu bendición y tu facción. Entra con tu cuenta del juego para verlo.</p><div><button type="button" class="btn primary" data-open-acc>Entrar</button></div>'; return; }
    const P = S.player;
    if (!P) { el.innerHTML = '<p class="muted">Aparece cuando hayas entrado al mundo una vez.</p>'; return; }
    if (P.rotten) el.classList.add('rotten');
    const sh = P.shadow || { state: 'none' }, inv = P.inventory || {};
    const tag = P.online ? '<span class="tag ok">En el mundo</span>' : sh.state === 'standing' ? '<span class="tag gold">Sombra en pie</span>' : sh.state === 'killed' ? '<span class="tag bad">Sombra muerta</span>' : sh.state === 'vanished' ? '<span class="tag">Se desvaneció</span>' : '<span class="tag">Fuera</span>';
    const since = sh.since ? ' desde las ' + t12(sh.since) + (relDay(sh.since) === 'hoy' ? '' : ' del ' + fecha(sh.since)) : '';
    const line = P.online ? 'Estás en el mundo ahora.' : sh.state === 'standing' ? 'Tu sombra está en pie' + since + ', con todo esto.' : sh.state === 'killed' ? 'La mataron mientras no estabas' + (sh.since ? ', a las ' + t12(sh.since) : '') + '.' : sh.state === 'vanished' ? 'El borde o el Nether se la llevó. Conservas todo.' : '';
    const top = h('div', 'top'); top.appendChild(U.skinHead(skinUrl(), myName())); top.insertAdjacentHTML('beforeend', '<div class="who"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><h3>' + esc(P.name || myName()) + '</h3>' + tag + '</div><span class="muted" style="font-size:14px">' + esc(line) + '</span></div>'); el.appendChild(top);
    const st = []; st.push(['Nivel', '<span class="glow" style="color:var(--xp)">' + (P.xp_level || 0) + '</span>']);
    st.push(['Bendición', P.blessing ? (P.blessing.nights_left > 1 ? P.blessing.nights_left + ' noches más' : 'Su última noche') : '<span class="faint">Ninguna</span>']);
    st.push(['Última reliquia', P.last_relic ? '<span class="glow" style="color:var(--gold)">' + esc(P.last_relic.name) + '</span>' : '<span class="faint">Ninguna</span>']);
    st.push(['Facción', P.faction ? '<span class="glow" style="color:' + (MC[P.faction.colour] || '#fff') + '">' + esc(P.faction.name) + '</span> <span class="faint">' + (P.faction.members || []).filter(m => m.name !== P.name).map(m => '<span style="color:' + (m.online ? 'var(--ok)' : 'inherit') + '">' + esc(m.name) + '</span>').join(', ') + '</span>' : '<span class="faint">Ninguna</span>']);
    const ef = (P.effects || []).filter(e => !/^auyamaland:(rotten|blessing)$/.test(e.id)).map(e => { const p = e.id.split(':').pop(); return esc((T.efectos || {})[p] || p.replace(/_/g, ' ')) + (e.amplifier ? ' ' + U.ROMAN[e.amplifier] : '') + ' <span class="faint">' + mmss(e.seconds) + '</span>'; });
    st.push(['Efectos', ef.length ? ef.join('<br>') : '<span class="faint">Ninguno</span>']);
    st.push(['Última vez', P.online ? 'Ahora' : P.last_connection ? 'Día ' + P.last_connection.day + ', ' + esc(P.last_connection.time) : '']);
    if (P.finale) st.push(['La última noche', P.finale === 'winner' ? 'Ganaste' : P.finale === 'in' ? 'Sigues dentro' : 'Quedaste fuera']);
    el.insertAdjacentHTML('beforeend', '<dl class="stats">' + st.map(([a, b]) => '<div><dt>' + a + '</dt><dd>' + b + '</dd></div>').join('') + '</dl>');
    const by = {}; (inv.armor || []).forEach(i => by['a' + i.slot] = i); (inv.main || []).forEach(i => by[i.slot] = i);
    const box = h('div', 'inv');
    const gear = h('div', 'gear'); gear.innerHTML = '<span class="lab">Equipo</span>'; const gs = h('div', 'gslots');
    ['helmet', 'chestplate', 'leggings', 'boots'].forEach((k, i) => gs.appendChild(U.slot(by['a' + (3 - i)], S.ench, 'eq', 'minecraft/item/empty_armor_slot_' + k)));
    gs.appendChild(h('span', 'sep')); gs.appendChild(U.slot(inv.offhand, S.ench, 'eq', 'minecraft/item/empty_armor_slot_shield')); gear.appendChild(gs); box.appendChild(gear);
    box.insertAdjacentHTML('beforeend', '<span class="lab">Inventario</span>');
    for (let r = 1; r <= 3; r++) { const row = h('div', 'row'); for (let i = r * 9; i < r * 9 + 9; i++) row.appendChild(U.slot(by[i], S.ench)); box.appendChild(row); }
    const hot = h('div', 'row hot'); for (let i = 0; i < 9; i++) hot.appendChild(U.slot(by[i], S.ench, i === inv.selected ? 'sel' : '')); box.appendChild(hot);
    el.appendChild(box); }

  /* ---------- the drawer: the wall, the rules, how to play ---------- */
  const drawer = $('#drawer'), scrim = $('#scrim'), dbody = $('#dbody'); let tab = null;
  function openDrawer(t) { tab = t; document.body.classList.add('drawer-on'); if (t === 'muro') markWallSeen(); drawer.classList.add('on'); scrim.classList.add('on'); drawer.setAttribute('aria-hidden', 'false'); document.querySelectorAll('#dtabs [data-tab]').forEach(b => b.setAttribute('aria-pressed', b.dataset.tab === t));
    dbody.innerHTML = ''; dbody.scrollTop = 0; ({ muro: renderWall, reglas: renderRules, jugar: renderPlay })[t](dbody); closeMenu(); }
  function closeDrawer() { tab = null; document.body.classList.remove('drawer-on'); drawer.classList.remove('on'); scrim.classList.remove('on'); drawer.setAttribute('aria-hidden', 'true'); }
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-open]'); if (b) { e.preventDefault(); openDrawer(b.dataset.open); } });
  document.querySelectorAll('#dtabs [data-tab]').forEach(b => b.onclick = () => openDrawer(b.dataset.tab));
  $('#dclose').onclick = closeDrawer; scrim.onclick = closeDrawer; addEventListener('keydown', e => { if (e.key === 'Escape') { closeDrawer(); acc.hidden = true; } });

  const PAGE = 20;
  const errText = e => { const m = (e && (e.message || e)) + ''; return /too many/i.test(m) ? 'Demasiadas en una hora. Prueba más tarde.' : /photos must be/i.test(m) ? 'Solo puedes usar fotos que subiste tú.' : S.settings.feed_frozen ? 'El muro está cerrado.' : 'Algo falló. Prueba otra vez.'; };
  const photoUrl = n => DEMO ? n : sb.storage.from('feed').getPublicUrl(n).data.publicUrl;
  async function fetchPosts(page) { if (DEMO) return D.feed.slice(page * PAGE, page * PAGE + PAGE).map(p => Object.assign({}, p));
    const { data, error } = await sb.from('feed').select('id, author, anonymous, body, images, created_at, edited_at, likes, comments, mine, liked').order('created_at', { ascending: false }).range(page * PAGE, page * PAGE + PAGE - 1);
    if (error) throw error; return data || []; }
  async function fetchComments(id) { if (DEMO) return (D.feed_comments[id] || []).slice();
    const { data } = await sb.from('feed_comments_public').select('id, post_id, author, anonymous, body, created_at, edited_at, mine').eq('post_id', id).order('created_at'); return data || []; }
  /* an anonymous post shows Anónimo to everyone; its writer and the owner also see, quietly, who wrote it */
  const who = p => p.anonymous || !p.author ? '<b>Anónimo</b>' + (p.author ? ' <span class="you">(' + (p.mine ? 'tú' : esc(p.author)) + ')</span>' : '') : '<b>' + esc(p.author) + '</b>';
  function confirmBtn(label, act) { const b = h('button', 'btn sm', label); b.type = 'button'; let armed = false;
    b.onclick = async () => { if (!armed) { armed = true; b.textContent = '¿Seguro?'; setTimeout(() => { armed = false; b.textContent = label; }, 3000); return; } await act(); }; return b; }
  function renderWall(box) { const frozen = !!S.settings.feed_frozen;
    if (!signedIn()) box.insertAdjacentHTML('beforeend', '<div class="card composer"><p class="muted">Para escribir, entra con tu cuenta del juego.</p><div><button type="button" class="btn primary" data-open-acc>Entrar</button></div></div>');
    else if (frozen) box.insertAdjacentHTML('beforeend', '<div class="card composer"><p class="muted">El muro está cerrado: ya no se puede escribir.</p></div>');
    else { const f = h('form', 'card composer'); f.innerHTML = '<div class="who"></div><textarea id="w-body" rows="3" maxlength="2000" aria-label="Publicación"></textarea><div class="msg" id="w-files"></div>' +
        '<div class="acts"><label class="check"><input type="checkbox" id="w-anon"> Sin mi nombre</label><span class="grow"></span><label class="btn sm" for="w-ph">Fotos</label><input type="file" id="w-ph" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden><button class="btn sm primary">Publicar</button></div><div class="msg" id="w-m" role="status"></div>';
      f.querySelector('.who').append(U.skinHead(skinUrl(), myName()), myName()); box.appendChild(f); let files = [];
      $('#w-ph').onchange = e => { files = [...e.target.files].slice(0, 4); const bad = files.find(x => x.size > 3 * 1048576 || !/^image\/(jpeg|png|webp|gif)$/.test(x.type));
        $('#w-files').textContent = bad ? 'Cada foto: JPEG, PNG, WebP o GIF, máximo 3 MB.' : files.length ? files.length + (files.length === 1 ? ' foto lista' : ' fotos listas') + (e.target.files.length > 4 ? ' (caben 4)' : '') : ''; if (bad) files = []; };
      f.onsubmit = async e => { e.preventDefault(); const body = $('#w-body').value.trim(), anon = $('#w-anon').checked, m = $('#w-m'); m.className = 'msg';
        if (!body && !files.length) return m.textContent = 'Escribe algo o elige una foto.'; m.textContent = 'Publicando…';
        try { if (DEMO) D.feed.unshift({ id: 'd' + Date.now(), author: myName(), anonymous: anon, body, images: files.map(x => URL.createObjectURL(x)), created_at: new Date().toISOString(), likes: 0, comments: 0, mine: true, liked: false });
          else { const names = []; for (const x of files) { const ext = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' }[x.type], n = crypto.randomUUID() + ext;
              const { error } = await sb.storage.from('feed').upload(n, x, { contentType: x.type }); if (error) throw error; names.push(n); }
            const { error } = await sb.from('feed_posts').insert({ body, images: names, anonymous: anon }); if (error) throw error; }
          $('#w-body').value = ''; files = []; $('#w-files').textContent = ''; m.textContent = ''; list(true);
        } catch (err) { m.className = 'msg bad'; m.textContent = errText(err); } }; }
    const sort = h('div', 'sort'); let top = false;
    ['Recientes', 'Más queridas'].forEach((s, i) => { const b = h('button', 'btn sm', s); b.type = 'button'; b.setAttribute('aria-pressed', i === 0); sort.appendChild(b);
      b.onclick = () => { sort.querySelectorAll('button').forEach(o => o.setAttribute('aria-pressed', o === b)); top = i === 1; draw(); }; });
    box.appendChild(sort); const feed = h('div'); feed.style.cssText = 'display:grid;gap:12px'; box.appendChild(feed);
    const more = h('button', 'btn', 'Ver más'); more.type = 'button'; box.appendChild(more);
    let posts = [], page = 0;
    function draw() { feed.innerHTML = ''; if (!posts.length) feed.innerHTML = '<p class="muted">Nadie ha escrito todavía.</p>'; (top ? posts.slice().sort((a, b) => b.likes - a.likes) : posts).forEach(p => feed.appendChild(postEl(p))); }
    async function list(reset) { if (reset) { posts = []; page = 0; } try { const got = await fetchPosts(page); posts = posts.concat(got); more.hidden = got.length < PAGE; draw(); } catch (e) { feed.innerHTML = '<p class="muted">No se pudo leer el muro.</p>'; more.hidden = true; } }
    more.onclick = () => { page++; list(false); };
    function postEl(p) { const d = h('article', 'card post'); d.appendChild(U.headCanvas(p.anonymous ? '' : p.author || ''));
      const b = h('div'); b.style.minWidth = '0'; b.innerHTML = '<div class="hd">' + who(p) + '<span class="meta">' + stamp(p.created_at) + (p.edited_at ? ' · editado' : '') + '</span></div>';
      if (p.body) { const t = h('div', 'body'); t.textContent = p.body; b.appendChild(t); }
      if ((p.images || []).length) { const ph = h('div', 'photos' + (p.images.length === 1 ? ' one' : '')); p.images.forEach(n => { const a = h('a'); a.href = photoUrl(n); a.target = '_blank'; a.rel = 'noopener'; const im = h('img'); im.src = photoUrl(n); im.alt = 'Foto'; im.loading = 'lazy'; a.appendChild(im); ph.appendChild(a); }); b.appendChild(ph); }
      const acts = h('div', 'acts'), lb = h('button', 'btn sm'), cb = h('button', 'btn sm'); lb.type = cb.type = 'button';
      const drawLike = () => { lb.textContent = (p.liked ? '♥ ' : '♡ ') + p.likes; lb.classList.toggle('liked', !!p.liked); lb.setAttribute('aria-pressed', !!p.liked); lb.setAttribute('aria-label', 'Me gusta, ' + p.likes); }; drawLike();
      lb.onclick = async () => { if (!signedIn()) return openAcc(); if (S.settings.feed_frozen) return; const was = p.liked; p.liked = !was; p.likes += was ? -1 : 1; drawLike(); if (DEMO) return;
        const r = was ? await sb.from('feed_likes').delete().eq('post_id', p.id).eq('user_id', S.session.user.id) : await sb.from('feed_likes').insert({ post_id: p.id }); if (r.error) { p.liked = was; p.likes += was ? 1 : -1; drawLike(); } };
      const drawC = () => { cb.textContent = 'Comentarios ' + p.comments; }; drawC(); acts.append(lb, cb);
      if ((p.mine || S.admin) && !S.settings.feed_frozen) acts.appendChild(confirmBtn('Borrar', async () => {
        if (DEMO) { const i = D.feed.findIndex(x => x.id === p.id); if (i >= 0) D.feed.splice(i, 1); return list(true); }
        const { error } = await sb.from('feed_posts').delete().eq('id', p.id); if (error) return; if ((p.images || []).length) await sb.storage.from('feed').remove(p.images); list(true); }));
      b.appendChild(acts); d.appendChild(b);
      const cm = h('div', 'comments'); cm.hidden = true; d.appendChild(cm);
      cb.onclick = async () => { cm.hidden = !cm.hidden; if (!cm.hidden) await comments(); };
      async function comments() { cm.innerHTML = '<span class="muted">Leyendo…</span>'; const cs = await fetchComments(p.id); cm.innerHTML = '';
        if (!cs.length) cm.innerHTML = '<span class="muted" style="font-size:14px">Sin comentarios.</span>';
        cs.forEach(c => { const e = h('div', 'comment'); e.innerHTML = '<div class="hd">' + who(c) + ' <span class="meta">' + stamp(c.created_at) + '</span></div>'; const t = h('div'); t.textContent = c.body; e.appendChild(t);
          if ((c.mine || S.admin) && !S.settings.feed_frozen) { const del = confirmBtn('Borrar', async () => {
              if (DEMO) D.feed_comments[p.id] = (D.feed_comments[p.id] || []).filter(x => x.id !== c.id); else { const { error } = await sb.from('feed_comments').delete().eq('id', c.id); if (error) return; }
              p.comments--; drawC(); comments(); }); del.style.marginTop = '4px'; e.appendChild(del); }
          cm.appendChild(e); });
        if (signedIn() && !S.settings.feed_frozen) { const f = h('form'); f.style.cssText = 'display:grid;gap:8px'; f.innerHTML = '<textarea rows="2" maxlength="1000" aria-label="Comentario"></textarea><div class="acts" style="display:flex;gap:8px;align-items:center;margin:0"><label class="check"><input type="checkbox"> Sin mi nombre</label><span style="flex:1"></span><button class="btn sm">Comentar</button></div><div class="msg" role="status"></div>';
          f.onsubmit = async e => { e.preventDefault(); const body = f.querySelector('textarea').value.trim(), anon = f.querySelector('input').checked, m = f.querySelector('.msg'); if (!body) return;
            if (DEMO) (D.feed_comments[p.id] = D.feed_comments[p.id] || []).push({ id: 'c' + Date.now(), post_id: p.id, author: myName(), anonymous: anon, body, created_at: new Date().toISOString(), mine: true });
            else { const { error } = await sb.from('feed_comments').insert({ post_id: p.id, body, anonymous: anon }); if (error) { m.className = 'msg bad'; return m.textContent = errText(error); } }
            p.comments++; drawC(); comments(); };
          cm.appendChild(f); } }
      return d; }
    list(true); }

  function renderRules(box) { const cats = (S.mech && S.mech.categories) || [];
    if (!cats.length) { box.innerHTML = '<p class="muted">Todavía no se ha publicado.</p>'; return; }
    const nav = h('div', 'rules-nav'), out = h('div'); out.style.cssText = 'display:grid;gap:12px'; box.append(nav, out);
    const show = c => { out.innerHTML = (c.entries || []).map(e => '<div class="card rule"><h3>' + esc(e.headline) + '</h3>' + String(e.text || '').split('\n').map(p => '<p>' + esc(p) + '</p>').join('') + '</div>').join('');
      if (/encantamientos/i.test(c.name) && S.ench) out.insertAdjacentHTML('beforeend', (S.ench.enchantments || []).map(e => '<div class="card rule"><h3>' + esc(e.name) + '</h3><p>' + esc(e.description || '') + '</p><div class="lv" style="margin:0">' +
        e.levels.map(l => '<span style="color:var(--tier-' + l.source + ')">' + (U.ROMAN[l.level - 1] || l.level) + ' · ' + TIERN[l.source] + '</span>').join('') + '</div></div>').join('')); };
    cats.forEach((c, i) => { const b = h('button', 'btn sm', esc(c.name)); b.type = 'button'; b.onclick = () => { nav.querySelectorAll('button').forEach(o => o.setAttribute('aria-pressed', o === b)); show(c); }; nav.appendChild(b); if (!i) b.click(); }); }

  function renderPlay(box) { const s = S.status || {}, v = s.mod_version || '1.0.0', jar = 'auyamaland-' + v + '.jar';
    box.innerHTML = '<div><h2>Para jugar</h2><p class="muted" style="margin-top:6px">Minecraft 1.16.5 con Fabric y un solo archivo.</p></div><ol class="steps">' +
      '<li><strong>Instala Fabric Loader</strong> para Minecraft 1.16.5 desde <a href="https://fabricmc.net/use/installer/" target="_blank" rel="noopener">fabricmc.net</a>.</li>' +
      '<li><strong>Descarga ' + esc(jar) + '</strong> y ponlo en la carpeta <code>mods</code>. Es lo único que necesitas.</li>' +
      '<li><strong>Abre el juego</strong> con el perfil de Fabric 1.16.5' + (C.server_address ? ' y entra a <code>' + esc(C.server_address) + '</code>' : '') + '.</li>' +
      '<li><strong>Crea tu contraseña</strong> la primera vez que entres. Con ella entras también aquí.</li>' +
      '<li><strong>Si el juego dice que tu versión es vieja</strong>, descarga el archivo otra vez.</li></ol>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap">' + (s.download ? '<a class="btn primary" href="' + esc(s.download) + '" target="_blank" rel="noopener">Descargar ' + esc(jar) + '</a>' : '<button class="btn primary" disabled>El enlace todavía no está</button>') +
      '<a class="btn discord" href="' + esc(s.discord || 'unirse.html') + '" target="_blank" rel="noopener">Discord</a></div>'; }

  /* ---------- new posts on the wall since this browser last opened it ---------- */
  const SEEN = 'auy-wall-seen';
  const seen = () => { try { return +localStorage.getItem(SEEN) || 0; } catch (e) { return 0; } };
  function setBadge(n) { document.querySelectorAll('.badge').forEach(b => { b.hidden = !n; b.textContent = n > 9 ? '9+' : n; }); }
  function markWallSeen() { try { localStorage.setItem(SEEN, Date.now()); } catch (e) { } setBadge(0); }
  async function checkWall() { if (tab === 'muro') return; try { const ps = await fetchPosts(0), last = seen();
      const since = last || Date.now() - 864e5; setBadge(ps.filter(p => new Date(p.created_at).getTime() > since && !p.mine).length); } catch (e) { } }

  /* ---------- menu (phones), footer ---------- */
  const nav = $('#nav'), menu = $('#menu');
  function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
  menu.onclick = e => { e.stopPropagation(); const o = !nav.classList.contains('open'); nav.classList.toggle('open', o); menu.setAttribute('aria-expanded', o); };
  nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('click', e => { if (nav.classList.contains('open') && !e.composedPath().includes(nav)) closeMenu(); });
  function renderFoot() { const s = S.status || {};
    $('#foot').innerHTML = '<div style="display:grid;gap:4px">' + (DEMO ? '<span class="demo-note">Datos de ejemplo: falta la llave pública de Supabase en config.js.</span>' : '') +
      '<span>No es un producto oficial de Minecraft. No está aprobado por Mojang ni asociado con Mojang.</span></div><div style="display:flex;gap:14px"><a href="' + esc(s.discord || 'unirse.html') + '">Discord</a>' +
      (s.mod_version ? '<span>Versión ' + esc(s.mod_version) + '</span>' : '') + '</div>'; }

  /* ---------- start ---------- */
  renderAv(); renderSombra(); renderFoot(); renderClock(); sky.setNight(1);
  await loadWorld();
  await Promise.all([loadStatus(), loadBoard(), loadMap(), loadBooks(), loadMech(), loadSettings(), U.langReady]);
  await loadPrivate();
  if (sb) sb.auth.onAuthStateChange(ev => { if (ev === 'SIGNED_IN' || ev === 'SIGNED_OUT' || ev === 'USER_UPDATED') loadPrivate(); });
  checkWall(); setInterval(checkWall, 120000);
  setInterval(loadStatus, 30000);
  setInterval(() => { loadBoard(); loadMap(); }, 60000);
  setInterval(() => { if (signedIn() && !DEMO) loadPrivate(); }, 60000);
})();
