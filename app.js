/* Auyamaland: the page. Reads the season from Supabase exactly as docs/website-contract.md says, or the example data in
   demo.js when config.js has no anon key. */
(async function () {
  const C = window.AUY_CONFIG || {}, T = window.TXT || {}, K = window.KIT, $ = s => document.querySelector(s), h = K.h, esc = K.esc;
  const DEMO = !C.supabase_anon_key, D = window.AUY_DEMO;
  const TZ = C.time_zone || 'America/Caracas';
  let sb = null;
  if (!DEMO) {
    try { const m = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm'); sb = m.createClient(C.supabase_url, C.supabase_anon_key); }
    catch (e) { console.error('Supabase no cargó', e); }
  }
  const S = { status: null, statusAt: null, board: null, boardAt: '', live: null, liveAt: '', ench: null, mech: null,
    session: null, profile: null, player: null, settings: {}, admin: false, demoIn: true, skinV: 0 };

  /* ---------- time, in the season's clock ---------- */
  const partsOf = (d, o) => Object.fromEntries(new Intl.DateTimeFormat('en-US', Object.assign({ timeZone: TZ }, o)).formatToParts(d).map(p => [p.type, p.value]));
  function t12(v) { const d = new Date(v); if (isNaN(d)) return ''; const p = partsOf(d, { hour: 'numeric', minute: '2-digit', hour12: true }); return p.hour + ':' + p.minute + (p.dayPeriod || '').toLowerCase(); }
  function dayKey(v) { const p = partsOf(new Date(v), { year: 'numeric', month: '2-digit', day: '2-digit' }); return p.year + '-' + p.month + '-' + p.day; }
  const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  function fecha(v) { const k = dayKey(v).split('-'); return (+k[2]) + ' ' + MESES[+k[1] - 1]; }
  function relDay(v) { const k = dayKey(v), today = dayKey(Date.now()), tom = dayKey(Date.now() + 864e5), yest = dayKey(Date.now() - 864e5);
    return k === today ? 'hoy' : k === tom ? 'mañana' : k === yest ? 'ayer' : 'el ' + fecha(v); }
  const when = (iso, text) => relDay(iso) + ' a las ' + (text || t12(iso));
  const stamp = v => { const r = relDay(v); return (r.startsWith('el ') ? r.slice(3) : r) + ', ' + t12(v); };

  /* ---------- data ---------- */
  async function publicDoc(key) {
    if (DEMO) { const map = { live_map: 'live_map', status: 'status', board: 'board', enchantments: 'enchantments', mechanics: 'mechanics', factions: 'factions' };
      const d = D[map[key]]; return d ? { data: d, updated_at: new Date().toISOString() } : null; }
    if (!sb) return null;
    const { data, error } = await sb.from('public_data').select('data, updated_at').eq('key', key).maybeSingle();
    if (error) { console.warn(key, error.message); return null; } return data;
  }
  if (DEMO) { const n = new Date(); n.setHours(19, 0, 0, 0); if (n < new Date()) n.setDate(n.getDate() + 1); D.status.next_opening = n.toISOString(); }

  /* ---------- the scene, the state, the season bar ---------- */
  const scene = K.Scene($('#scene'), { day: 5 });
  let liveDay = 5, viewDay = 5;
  function seasonDay(s) { return !s ? 0 : s.after_season ? 15 : s.before_season ? 0 : s.season_day || 0; }
  function skyDay(d) { return Math.max(1, Math.min(14, d)); }
  function setSky(d) { viewDay = d; scene.setDay(skyDay(d)); $('#dayname').textContent = (d >= 1 && d <= 14 ? 'Noche ' + d + ': ' : '') + K.TH[skyDay(d)].n;
    $('#hint').innerHTML = (DEMO ? 'Muestra: ' : '') + 'toca cualquier noche de la barra para ver su cielo.' + (viewDay !== skyDay(liveDay) ? ' <button type="button" id="back">Volver a esta noche</button>' : '');
    const b = $('#back'); if (b) b.onclick = () => setSky(skyDay(liveDay)); }
  function renderState() {
    const s = S.status, el = $('#state'); el.className = 'state';
    const stale = !DEMO && (!S.statusAt || Date.now() - new Date(S.statusAt).getTime() > 120000);
    if (!s) { el.textContent = 'Sin noticias del servidor'; return; }
    const next = s.next_opening ? when(s.next_opening, s.next_opening_text) : '';
    if (s.after_season) el.innerHTML = 'La temporada ha terminado';
    else if (s.open && !stale) { const n = s.players_online || 0; el.classList.add('open'); el.innerHTML = '<b>Abierto</b> · ' + n + (n === 1 ? ' jugador' : ' jugadores') + ' en el mundo · cierra a las ' + esc(s.closes_text || '3:00am'); }
    else if (s.open && stale) { el.classList.add('down'); el.innerHTML = '<b>El servidor no responde</b>'; }
    else if (s.before_season) el.innerHTML = 'La temporada empieza ' + next;
    else el.innerHTML = 'Cerrado' + (next ? ' · abre ' + next : '');
    $('#subheader').textContent = (s.subheaders && s.subheaders.length) ? s.subheaders[(new Date().getDate() + new Date().getHours()) % s.subheaders.length] : '';
    const d = seasonDay(s); if (d !== liveDay || !$('#season').firstChild) { const was = liveDay; liveDay = d; if (viewDay === skyDay(was) || !$('#season').firstChild) setSky(skyDay(d)); }
    const line = s.after_season ? 'Catorce noches. Terminó.' : s.before_season ? 'Catorce noches, de 7:00pm a 3:00am. Empieza ' + next + '.'
      : 'Noche <b>' + d + '</b> de 14' + (s.players_season ? ' · ' + s.players_season + ' han jugado esta temporada' : '') + '. Abre a las 7:00pm y cierra a las 3:00am.';
    K.Season($('#season'), { day: d, line, nights: T.noches, finale: T.final, onPick: setSky });
    renderFoot();
  }
  async function loadStatus() { const r = await publicDoc('status'); if (r) { S.status = r.data; S.statusAt = r.updated_at; } renderState(); }

  /* ---------- relics ---------- */
  async function loadBoard() { const r = await publicDoc('board'); if (!r) { if (!S.board) $('#relics').innerHTML = '<p class="empty">El tablero todavía no se ha publicado.</p>'; return; }
    if (r.updated_at === S.boardAt && S.board) return; S.board = r.data; S.boardAt = r.updated_at;
    K.Relics($('#relics'), { board: S.board, onPick: s => K.ficha($('#ficha'), s) }); }

  /* ---------- the map ---------- */
  const cv = $('#map'); let marks = [];
  function drawMap() { const L = S.live; if (!L) return; const B = L.border || { center_x: 0, center_z: 0, size: 1700 };
    const bpp = [2, 4, 8, 16].find(b => 128 * b >= B.size * 1.08) || 16;
    marks = MCMap.draw(cv, { cx: B.center_x, cz: B.center_z, bpp }, { data: L, terrain: !!C.invented_terrain, edge: [199, 176, 139],
      t: { mesas: T.mesas, dirs: T.direcciones, time: t12, biome: b => (T.biomas || {})[b] || String(b || '').split(':').pop().replace(/_/g, ' ') } });
    $('#mapsize').textContent = 'Borde: ' + B.size + (B.moving && B.target_size ? ' → ' + B.target_size : '');
    $('#mapscale').textContent = '1 píxel = ' + bpp + ' bloques';
    $('#mapnext').textContent = B.next ? 'Siguiente: ' + B.next.size + ', día ' + B.next.day + ' a las ' + (B.next.at_text || t12(B.next.at)) + (B.next.seconds ? '' : ', de golpe') : ''; }
  async function loadMap() { const r = await publicDoc('live_map'); if (!r) return; if (r.updated_at === S.liveAt && S.live) return; S.live = r.data; S.liveAt = r.updated_at; drawMap(); }
  cv.addEventListener('mousemove', e => { const r = cv.getBoundingClientRect(), s = r.width / 128, px = Math.floor((e.clientX - r.left) / s), py = Math.floor((e.clientY - r.top) / s);
    const m = marks.find(k => Math.abs(k.x - px) <= (k.r || 4) && Math.abs(k.y - py) <= (k.r || 4)); m ? MCUI.show(e.clientX, e.clientY, m.title, m.lines.map(esc), { tc: m.col, tf: '#3a1412' }) : MCUI.hide(); });
  cv.addEventListener('mouseleave', () => MCUI.hide());

  /* ---------- enchanted books, rules ---------- */
  async function loadBooks() { const r = await publicDoc('enchantments'); if (r) { S.ench = r.data; K.Books($('#books'), { data: S.ench }); }
    else $('#books').innerHTML = '<p class="empty">Todavía no hay nada publicado.</p>'; }
  async function loadMech() { const r = await publicDoc('mechanics'); if (r) S.mech = r.data; }

  /* ---------- account ---------- */
  const signedIn = () => DEMO ? S.demoIn : !!S.session;
  const myName = () => (S.profile && S.profile.name) || (S.player && S.player.name) || '';
  function skinUrl() { const p = S.profile; if (!p) return null;
    if (p.skin_present && !DEMO) return sb.storage.from('skins').getPublicUrl(S.session.user.id + '.png').data.publicUrl + '?v=' + encodeURIComponent((p.skin_updated_at || '') + S.skinV);
    return 'textures/minecraft/entity/' + (p.skin_model === 'slim' ? 'alex' : 'steve') + '.png'; }
  async function loadPrivate() {
    if (DEMO) { if (S.demoIn) { S.profile = D.profile; S.player = D.player; } else { S.profile = S.player = null; } return renderPrivate(); }
    if (!sb) return renderPrivate();
    const { data } = await sb.auth.getSession(); S.session = data.session;
    if (!S.session) { S.profile = S.player = null; S.admin = false; return renderPrivate(); }
    const uid = S.session.user.id;
    const [pr, ps, ad] = await Promise.all([
      sb.from('profiles').select('name, created_at, skin_model, skin_present, skin_updated_at').eq('id', uid).maybeSingle(),
      sb.from('player_state').select('data, updated_at').eq('user_id', uid).maybeSingle(),
      sb.rpc('is_admin')]);
    S.profile = pr.data || null; S.player = ps.data ? ps.data.data : null; S.admin = !!ad.data; renderPrivate(); }
  async function loadSettings() { if (DEMO) { S.settings = D.settings; return; } if (!sb) return;
    const { data } = await sb.from('settings').select('key, value'); S.settings = {}; (data || []).forEach(r => S.settings[r.key] = r.value); }

  const pfp = $('#pfp'), pfb = h('button', 'k-pfp'); pfb.setAttribute('aria-label', 'Tu cuenta'); pfp.appendChild(pfb);
  const acc = h('div', 'k-acc'); acc.hidden = true; document.body.appendChild(acc);
  function placeAcc() { const r = pfb.getBoundingClientRect(); acc.style.top = (r.bottom + scrollY + 8) + 'px'; acc.style.left = Math.max(16, r.right - Math.min(320, innerWidth - 32) + scrollX) + 'px'; }
  function openAcc() { acc.hidden = false; renderAcc(); placeAcc(); const f = acc.querySelector('input'); if (f) f.focus(); }
  pfb.onclick = e => { e.stopPropagation(); acc.hidden ? openAcc() : (acc.hidden = true); };
  document.addEventListener('click', e => { if (!acc.contains(e.target) && !pfb.contains(e.target) && !(e.target.closest && e.target.closest('[data-open-acc]'))) acc.hidden = true; });
  addEventListener('resize', () => !acc.hidden && placeAcc());
  document.addEventListener('click', e => { const t = e.target.closest && e.target.closest('[data-open-acc]'); if (t) { e.preventDefault(); e.stopPropagation(); openAcc(); } });

  function renderPfp() { pfb.innerHTML = ''; pfb.appendChild(signedIn() ? K.skinHead(skinUrl(), 40, myName()) : K.headCanvas('', 40));
    pfb.dataset.tip = signedIn() ? esc(myName()) + '|Tu cuenta' : 'Entrar|Con tu nombre y contraseña del juego'; pfb._tb = 0; MCUI.bind(pfp); }
  let skinModel = 'classic';
  function renderAcc() {
    if (!signedIn()) {
      acc.innerHTML = '<h3>Entrar</h3><form id="k-li"><div class="k-field"><label for="k-u">Nombre en el juego</label><input id="k-u" autocomplete="username" maxlength="16"></div>' +
        '<div class="k-field"><label for="k-p">Contraseña</label><input id="k-p" type="password" autocomplete="current-password"></div><button class="k-btn">Entrar</button><div class="k-msg" id="k-m" role="status"></div></form>' +
        '<p class="k-ink" style="margin:16px 0 0">La cuenta se crea en el juego con /register. Si olvidaste la contraseña, pídele un código al dueño del servidor.</p>';
      $('#k-li').onsubmit = async e => { e.preventDefault(); const n = $('#k-u').value.trim(), p = $('#k-p').value, m = $('#k-m');
        if (!n || !p) { m.textContent = 'Escribe tu nombre y tu contraseña.'; return; }
        m.textContent = 'Entrando…';
        if (DEMO) { S.demoIn = true; await loadPrivate(); renderAcc(); return; }
        if (!sb) { m.textContent = 'No hay conexión con el servidor de cuentas.'; return; }
        const { error } = await sb.auth.signInWithPassword({ email: n.toLowerCase() + '@' + C.email_domain, password: p });
        if (error) { m.textContent = 'Nombre o contraseña incorrectos.'; return; }
        await loadPrivate(); renderAcc(); };
      return; }
    const p = S.profile || {}, pl = S.player; skinModel = p.skin_model || 'classic';
    acc.innerHTML = '<div class="who"></div><hr><b>Tu skin</b><label class="k-drop">Suelta tu PNG o toca para elegirlo<br><span class="k-ink">64 × 64 o 64 × 32, 32 KB como máximo</span><input type="file" accept="image/png" id="k-f"></label>' +
      '<div class="row"><button type="button" class="k-btn ghost" data-m="classic">Brazos normales</button><button type="button" class="k-btn ghost" data-m="slim">Brazos finos</button></div>' +
      (p.skin_present ? '<div class="row"><button type="button" class="k-btn ghost" id="k-rm">Volver a la de siempre</button></div>' : '') + '<div class="k-msg" id="k-sm" role="status"></div><hr>' +
      '<b>Cambiar contraseña</b><form id="k-cp" style="margin-top:8px"><div class="k-field"><label for="k-n1">Nueva</label><input id="k-n1" type="password" autocomplete="new-password"></div>' +
      '<div class="k-field"><label for="k-n2">Otra vez</label><input id="k-n2" type="password" autocomplete="new-password"></div><button class="k-btn ghost">Cambiar</button><div class="k-msg" id="k-cm" role="status"></div></form><hr>' +
      '<button type="button" class="k-btn" id="k-out">Cerrar sesión</button>';
    const who = acc.querySelector('.who'); who.appendChild(K.skinHead(skinUrl(), 48, myName()));
    const since = p.created_at ? 'Cuenta desde el ' + fecha(p.created_at) : '';
    who.insertAdjacentHTML('beforeend', '<div><h3>' + esc(myName()) + '</h3><span class="k-ink">' + (pl && pl.faction ? esc(pl.faction.name) + ' · ' : '') + since + '</span></div>');
    const mb = acc.querySelectorAll('[data-m]'), setM = m => { skinModel = m; mb.forEach(b => b.setAttribute('aria-pressed', b.dataset.m === m)); }; mb.forEach(b => b.onclick = () => setM(b.dataset.m)); setM(skinModel);
    $('#k-out').onclick = async () => { if (DEMO) S.demoIn = false; else await sb.auth.signOut(); await loadPrivate(); renderAcc(); };
    $('#k-cp').onsubmit = async e => { e.preventDefault(); const a = $('#k-n1').value, c = $('#k-n2').value, m = $('#k-cm');
      if (a.length < 6) return m.textContent = 'Al menos 6 caracteres.'; if (a.length > 64) return m.textContent = 'Como máximo 64 caracteres.'; if (a !== c) return m.textContent = 'No coinciden.';
      m.textContent = 'Cambiando…';
      if (!DEMO) { const { error } = await sb.auth.updateUser({ password: a }); if (error) return m.textContent = 'No se pudo cambiar. Prueba otra vez.'; await sb.auth.signOut({ scope: 'others' }); }
      $('#k-n1').value = $('#k-n2').value = ''; m.textContent = 'Cambiada. El juego te la pedirá en tu próxima entrada, en cada PC.'; };
    const sm = $('#k-sm'), rm = $('#k-rm');
    if (rm) rm.onclick = async () => { sm.textContent = 'Quitando…'; if (!DEMO) { await sb.storage.from('skins').remove([S.session.user.id + '.png']); await sb.rpc('skin_removed'); }
      S.skinV++; await loadPrivate(); renderAcc(); $('#k-sm').textContent = 'Listo. En el juego vuelves a la de siempre en menos de un minuto.'; };
    const drop = acc.querySelector('.k-drop'); ['dragover', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); if (ev === 'drop' && e.dataTransfer.files[0]) upload(e.dataTransfer.files[0]); }));
    $('#k-f').onchange = e => e.target.files[0] && upload(e.target.files[0]);
    async function upload(f) {
      if (f.type !== 'image/png') return sm.textContent = 'Tiene que ser un PNG.'; if (f.size > 32768) return sm.textContent = 'Pesa más de 32 KB.';
      const ok = await new Promise(res => { const im = new Image(); im.onload = () => res(im.width === 64 && (im.height === 64 || im.height === 32)); im.onerror = () => res(false); im.src = URL.createObjectURL(f); });
      if (!ok) return sm.textContent = 'Tiene que medir 64 × 64 o 64 × 32.';
      sm.textContent = 'Subiendo…';
      if (!DEMO) { const uid = S.session.user.id;
        const { error } = await sb.storage.from('skins').upload(uid + '.png', f, { upsert: true, contentType: 'image/png' }); if (error) return sm.textContent = 'No se pudo subir. Prueba otra vez.';
        const r = await sb.rpc('skin_uploaded', { model: skinModel }); if (r.error) return sm.textContent = 'Se subió, pero el juego no se enteró. Prueba otra vez.'; }
      S.skinV++; await loadPrivate(); renderAcc(); $('#k-sm').textContent = 'Lista. En el juego se verá en menos de un minuto.'; }
  }

  /* ---------- your shadow ---------- */
  const MC = { green: '#55FF55', dark_green: '#00AA00', aqua: '#55FFFF', dark_aqua: '#00AAAA', blue: '#5555FF', light_purple: '#FF55FF', dark_purple: '#AA00AA', yellow: '#FFFF55', gold: '#FFAA00', red: '#FF5555', dark_red: '#AA0000' };
  function shadowFig() { const c = document.createElement('canvas'); c.width = 20; c.height = 44; const x = c.getContext('2d'), f = (cc, a, b, w, hh) => { x.fillStyle = cc; x.fillRect(a, b, w, hh); };
    f('#090409', 6, 0, 8, 8); f('#120b12', 6, 8, 8, 12); f('#090409', 2, 8, 4, 12); f('#090409', 14, 8, 4, 12); f('#0d060d', 6, 20, 4, 12); f('#0d060d', 10, 20, 4, 12);
    f('#3b1c31', 8, 4, 1, 1); f('#3b1c31', 11, 4, 1, 1); return c; }
  function mmss(s) { s = Math.max(0, s | 0); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function renderPrivate() { renderPfp(); renderSombra(); if (!acc.hidden) renderAcc(); }
  function renderSombra() { const el = $('#sombra'); el.className = 'chestgui'; el.innerHTML = '';
    if (!signedIn()) { el.innerHTML = '<h3><span>Lo que llevas</span></h3><p class="msg">Entra con el nombre y la contraseña del juego para ver tu sombra, lo que lleva y cómo está.</p><button type="button" class="k-btn" data-open-acc>Entrar</button>'; return; }
    const P = S.player;
    if (!P) { el.innerHTML = '<h3><span>Lo que llevas</span></h3><p class="msg">Todavía no hay nada. Aparece aquí cuando hayas estado en el mundo una vez.</p>'; return; }
    if (P.rotten) el.classList.add('rotten');
    const inv = P.inventory || {}, src = inv.source === 'shadow' ? 'sombra en pie' : P.online ? 'en el mundo' : 'lo último guardado';
    el.innerHTML = '<h3><span>Lo que llevas</span><small>' + src + '</small></h3>';
    const w = h('div', 'k-sombra'), fig = h('div', 'k-fig'); fig.appendChild(shadowFig()); w.appendChild(fig);
    const right = h('div'); right.style.minWidth = '0'; w.appendChild(right);
    const arm = h('div', 'k-armor'), by = {}; (inv.armor || []).forEach(i => by['a' + i.slot] = i); (inv.main || []).forEach(i => by[i.slot] = i);
    [3, 2, 1, 0].forEach(k => arm.appendChild(K.slot(by['a' + k], S.ench))); const off = K.slot(inv.offhand, S.ench); off.style.marginLeft = '8px'; arm.appendChild(off); right.appendChild(arm);
    const grid = h('div', 'k-inv'); for (let i = 9; i < 36; i++) grid.appendChild(K.slot(by[i], S.ench)); right.appendChild(grid);
    const hot = h('div', 'k-inv'); hot.style.marginTop = '8px'; for (let i = 0; i < 9; i++) { const s = K.slot(by[i], S.ench); if (i === inv.selected) s.style.boxShadow = 'inset 0 0 0 2px #fff'; hot.appendChild(s); } right.appendChild(hot);
    right.insertAdjacentHTML('beforeend', '<div class="k-xp"><i></i><span>' + (P.xp_level || 0) + '</span></div>');
    const kv = [], sh = P.shadow || { state: 'none' };
    const since = sh.since ? (relDay(sh.since) === 'hoy' ? '' : ' del ' + fecha(sh.since)) : '';
    kv.push(['Tu sombra', sh.state === 'standing' ? 'En pie desde las ' + t12(sh.since) + since + ', con todo esto' : sh.state === 'killed' ? 'La mataron mientras no estabas' + (sh.since ? ', a las ' + t12(sh.since) + since : '') + '.'
      : sh.state === 'vanished' ? 'Se desvaneció: el borde o el Nether se la llevó. Conservas todo.' : P.online ? 'Estás en el mundo.' : 'No tienes sombra en pie.']);
    if (P.blessing) kv.push(['Bendición', P.blessing.nights_left > 1 ? 'Le quedan ' + P.blessing.nights_left + ' noches' : 'Esta es su última noche']);
    const ef = (P.effects || []).filter(e => !/^auyamaland:(rotten|blessing)$/.test(e.id)).map(e => { const p = e.id.split(':').pop(); return esc((T.efectos || {})[p] || p.replace(/_/g, ' ')) + (e.amplifier ? ' ' + ['I', 'II', 'III', 'IV', 'V'][e.amplifier] : '') + ', ' + mmss(e.seconds); });
    if (ef.length) kv.push(['Efectos', ef.join('<br>')]);
    if (P.last_relic) kv.push(['Última reliquia', '<span style="color:#FFAA00">' + esc(P.last_relic.name) + '</span>']);
    if (P.faction) kv.push(['Facción', '<span style="color:' + (MC[P.faction.colour] || '#fff') + '">' + esc(P.faction.name) + '</span> ' + (P.faction.members || []).filter(m => m.name !== P.name).map(m => '<span class="' + (m.online ? 'on' : '') + '" style="' + (m.online ? '' : 'color:var(--t2)') + '">' + esc(m.name) + '</span>').join(', ')]);
    else kv.push(['Facción', '<span style="color:var(--t2)">Ninguna</span>']);
    if (P.finale) kv.push(['La última noche', P.finale === 'winner' ? 'Ganaste' : P.finale === 'in' ? 'Sigues dentro' : 'Quedaste fuera']);
    kv.push(['Última vez', P.online ? 'Ahora mismo' : P.last_connection ? 'Día ' + P.last_connection.day + ', ' + P.last_connection.time : '']);
    right.insertAdjacentHTML('beforeend', '<dl class="k-kv">' + kv.map(([a, b]) => '<dt>' + a + '</dt><dd>' + b + '</dd>').join('') + '</dl>');
    el.appendChild(w); MCUI.bind(w); }

  /* ---------- the wall (feed) ---------- */
  const PAGE = 20;
  const errText = e => { const m = (e && (e.message || e)) + ''; return /too many/i.test(m) ? 'Demasiadas en una hora. Prueba más tarde.' : /photos must be/i.test(m) ? 'Solo puedes usar fotos que subiste tú.'
    : S.settings.feed_frozen ? 'El muro está cerrado.' : 'Algo falló. Prueba otra vez.'; };
  const photoUrl = n => DEMO ? n : sb.storage.from('feed').getPublicUrl(n).data.publicUrl;
  async function fetchPosts(page) { if (DEMO) return D.feed.slice(page * PAGE, page * PAGE + PAGE).map(p => Object.assign({}, p));
    const { data, error } = await sb.from('feed').select('id, author, anonymous, body, images, created_at, edited_at, likes, comments, mine, liked').order('created_at', { ascending: false }).range(page * PAGE, page * PAGE + PAGE - 1);
    if (error) throw error; return data || []; }
  async function fetchComments(id) { if (DEMO) return (D.feed_comments[id] || []).slice();
    const { data } = await sb.from('feed_comments_public').select('id, post_id, author, anonymous, body, created_at, edited_at, mine').eq('post_id', id).order('created_at'); return data || []; }
  function confirmBtn(label, act) { const b = h('button', 'k-act k-del', label); b.type = 'button'; let armed = false;
    b.onclick = async () => { if (!armed) { armed = true; b.textContent = '¿Seguro?'; setTimeout(() => { armed = false; b.textContent = label; }, 3000); return; } await act(); }; return b; }
  function renderWall(cover) {
    const pg = h('div', 'k-pages'); cover.appendChild(pg); const L = h('div', 'k-pg'), R = h('div', 'k-pg'); pg.append(L, R);
    const frozen = !!S.settings.feed_frozen;
    L.innerHTML = '<h2>El muro</h2><p class="k-ink">Lo que se cuenta entre noches. Se lee sin cuenta; para escribir, entra.</p>';
    if (!signedIn()) L.insertAdjacentHTML('beforeend', '<p style="margin-top:16px"><button type="button" class="k-btn" data-open-acc>Entrar</button></p>');
    else if (frozen) L.insertAdjacentHTML('beforeend', '<p class="k-note">El muro está cerrado: se puede leer, ya no escribir.</p>');
    else {
      const me = h('div'); me.style.cssText = 'display:flex;gap:8px;align-items:center;margin:16px 0 8px'; me.appendChild(K.skinHead(skinUrl(), 40, myName())); me.insertAdjacentHTML('beforeend', '<span>' + esc(myName()) + '</span>'); L.appendChild(me);
      const f = h('form'); f.innerHTML = '<div class="k-field"><label for="k-body">Escribe una nota</label><textarea id="k-body" rows="4" maxlength="2000" placeholder="¿Qué pasó anoche?"></textarea></div>' +
        '<label class="k-check"><input type="checkbox" id="k-anon"> Sin mi nombre</label><div class="k-files" id="k-files"></div>' +
        '<div class="k-row"><label class="k-btn ghost" for="k-ph">Fotos</label><input type="file" id="k-ph" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden><button class="k-btn">Publicar</button></div><div class="k-msg" id="k-wm" role="status"></div>';
      L.appendChild(f); let files = [];
      $('#k-ph').onchange = e => { files = [...e.target.files].slice(0, 4); const bad = files.find(x => x.size > 3 * 1048576 || !/^image\/(jpeg|png|webp|gif)$/.test(x.type));
        $('#k-files').textContent = bad ? 'Cada foto: JPEG, PNG, WebP o GIF, 3 MB como máximo.' : files.length ? files.length + (files.length === 1 ? ' foto lista' : ' fotos listas') + (e.target.files.length > 4 ? ' (solo caben 4)' : '') : ''; if (bad) files = []; };
      f.onsubmit = async e => { e.preventDefault(); const body = $('#k-body').value.trim(), anon = $('#k-anon').checked, m = $('#k-wm');
        if (!body && !files.length) return m.textContent = 'Escribe algo o elige una foto.';
        m.textContent = 'Publicando…';
        try {
          if (DEMO) { D.feed.unshift({ id: 'd' + Date.now(), author: anon ? null : myName(), anonymous: anon, body, images: files.map(x => URL.createObjectURL(x)), created_at: new Date().toISOString(), likes: 0, comments: 0, mine: true, liked: false }); }
          else { const names = [];
            for (const x of files) { const ext = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' }[x.type], n = crypto.randomUUID() + ext;
              const { error } = await sb.storage.from('feed').upload(n, x, { contentType: x.type }); if (error) throw error; names.push(n); }
            const { error } = await sb.from('feed_posts').insert({ body, images: names, anonymous: anon }); if (error) throw error; }
          $('#k-body').value = ''; files = []; $('#k-files').textContent = ''; m.textContent = ''; list(true);
        } catch (err) { m.textContent = errText(err); } };
    }
    L.appendChild(K.rose()); L.lastChild.className = 'k-rose';
    const sort = h('div', 'k-sort'); let top = false;
    ['Recientes', 'Más queridas'].forEach((s, i) => { const b = h('button', 'k-btn ghost', s); b.type = 'button'; b.setAttribute('aria-pressed', i === 0); sort.appendChild(b);
      b.onclick = () => { sort.querySelectorAll('button').forEach(o => o.setAttribute('aria-pressed', o === b)); top = i === 1; draw(); }; });
    R.appendChild(sort); const box = h('div'); R.appendChild(box); const more = h('button', 'k-btn ghost k-more', 'Ver más'); more.type = 'button'; R.appendChild(more);
    let posts = [], page = 0;
    function draw() { box.innerHTML = ''; if (!posts.length) box.innerHTML = '<p class="k-ink">Nadie ha escrito todavía.</p>';
      (top ? posts.slice().sort((a, b) => b.likes - a.likes) : posts).forEach(p => box.appendChild(postEl(p))); MCUI.bind(box); }
    async function list(reset) { if (reset) { posts = []; page = 0; }
      try { const got = await fetchPosts(page); posts = posts.concat(got); more.hidden = got.length < PAGE; draw(); } catch (e) { box.innerHTML = '<p class="k-ink">No se pudo leer el muro.</p>'; more.hidden = true; } }
    more.onclick = () => { page++; list(false); };
    function postEl(p) { const d = h('article', 'k-post'); const hd = K.headCanvas(p.author || '', 40); hd.className = 'head'; d.appendChild(hd);
      const b = h('div'); b.innerHTML = '<span class="nm">' + esc(p.author || 'Anónimo') + '</span> <span class="tm">' + stamp(p.created_at) + (p.edited_at ? ' · editado' : '') + '</span>';
      if (p.body) { const t = h('p'); t.textContent = p.body; b.appendChild(t); }
      if ((p.images || []).length) { const ph = h('div', 'k-photos' + (p.images.length === 1 ? ' one' : '')); p.images.forEach(n => { const a = h('a'); a.href = photoUrl(n); a.target = '_blank'; a.rel = 'noopener';
        const im = h('img'); im.src = photoUrl(n); im.alt = 'Foto'; im.loading = 'lazy'; a.appendChild(im); ph.appendChild(a); }); b.appendChild(ph); }
      const acts = h('div', 'k-acts'), hb = h('button', 'k-act'), cb = h('button', 'k-act'); hb.type = cb.type = 'button';
      const drawLike = () => { hb.innerHTML = ''; hb.appendChild(K.heartIcon(p.liked)); hb.lastChild.style.cssText = 'width:14px;height:12px'; hb.append(' ' + p.likes); hb.classList.toggle('on', !!p.liked); }; drawLike();
      hb.setAttribute('aria-label', 'Me gusta');
      hb.onclick = async () => { if (!signedIn()) return openAcc(); if (S.settings.feed_frozen) return;
        const was = p.liked; p.liked = !was; p.likes += was ? -1 : 1; drawLike();
        if (DEMO) return; const r = was ? await sb.from('feed_likes').delete().eq('post_id', p.id).eq('user_id', S.session.user.id) : await sb.from('feed_likes').insert({ post_id: p.id });
        if (r.error) { p.liked = was; p.likes += was ? 1 : -1; drawLike(); } };
      cb.appendChild(K.bubbleIcon()); cb.lastChild.style.cssText = 'width:14px;height:10px'; cb.append(' ' + p.comments); cb.setAttribute('aria-label', 'Comentarios');
      acts.append(hb, cb);
      if ((p.mine || S.admin) && !S.settings.feed_frozen) acts.appendChild(confirmBtn('Borrar', async () => {
        if (DEMO) { const i = D.feed.findIndex(x => x.id === p.id); if (i >= 0) D.feed.splice(i, 1); return list(true); }
        const { error } = await sb.from('feed_posts').delete().eq('id', p.id); if (error) return; if ((p.images || []).length) await sb.storage.from('feed').remove(p.images); list(true); }));
      b.appendChild(acts);
      const cm = h('div', 'k-comments'); cm.hidden = true; b.appendChild(cm);
      cb.onclick = async () => { cm.hidden = !cm.hidden; if (!cm.hidden) await comments(); };
      async function comments() { cm.innerHTML = '<p class="k-ink">Leyendo…</p>'; const cs = await fetchComments(p.id); cm.innerHTML = '';
        cs.forEach(c => { const e = h('div', 'k-comment'); e.innerHTML = '<span class="nm">' + esc(c.author || 'Anónimo') + '</span> <span class="tm">' + stamp(c.created_at) + '</span><br>';
          e.append(c.body); if ((c.mine || S.admin) && !S.settings.feed_frozen) { e.append(' '); e.appendChild(confirmBtn('Borrar', async () => {
            if (DEMO) { D.feed_comments[p.id] = (D.feed_comments[p.id] || []).filter(x => x.id !== c.id); } else { const { error } = await sb.from('feed_comments').delete().eq('id', c.id); if (error) return; }
            p.comments--; cb.lastChild.textContent = ' ' + p.comments; comments(); })); } cm.appendChild(e); });
        if (!cs.length) cm.innerHTML = '<p class="k-ink">Sin comentarios.</p>';
        if (signedIn() && !S.settings.feed_frozen) { const f = h('form'); f.innerHTML = '<div class="k-field"><textarea rows="2" maxlength="1000" aria-label="Comentario" placeholder="Responde"></textarea></div><label class="k-check"><input type="checkbox"> Sin mi nombre</label><div class="k-row"><button class="k-btn ghost">Comentar</button></div><div class="k-msg" role="status"></div>';
          f.onsubmit = async e => { e.preventDefault(); const body = f.querySelector('textarea').value.trim(), anon = f.querySelector('input').checked, m = f.querySelector('.k-msg'); if (!body) return;
            if (DEMO) (D.feed_comments[p.id] = D.feed_comments[p.id] || []).push({ id: 'c' + Date.now(), post_id: p.id, author: anon ? null : myName(), anonymous: anon, body, created_at: new Date().toISOString(), mine: true });
            else { const { error } = await sb.from('feed_comments').insert({ post_id: p.id, body, anonymous: anon }); if (error) return m.textContent = errText(error); }
            p.comments++; cb.lastChild.textContent = ' ' + p.comments; comments(); };
          cm.appendChild(f); } }
      d.appendChild(b); return d; }
    list(true);
  }

  /* ---------- the rules ---------- */
  function renderRules(cover) { const pg = h('div', 'k-pages'); cover.appendChild(pg); const L = h('div', 'k-pg'), R = h('div', 'k-pg'); pg.append(L, R);
    L.innerHTML = '<h2>Cómo funciona</h2><p class="k-ink">Lo mismo que la pantalla Info del juego.</p>'; const nav = h('div'); nav.style.cssText = 'display:flex;flex-direction:column;gap:8px;margin-top:16px'; L.appendChild(nav);
    const cats = (S.mech && S.mech.categories) || [];
    if (!cats.length) { R.innerHTML = '<p class="k-ink">Todavía no se ha publicado.</p>'; return; }
    const src = { table: 'Mesa', found: 'Encontrado', ceiling: 'Libro de techo', commons: 'Único' }, roman = ['I', 'II', 'III', 'IV', 'V'];
    const show = c => { R.innerHTML = '<h2>' + esc(c.name) + '</h2>' + (c.entries || []).map(e => '<div class="k-rule"><h3>' + esc(e.headline) + '</h3>' + String(e.text || '').split('\n').map(p => '<p>' + esc(p) + '</p>').join('') + '</div>').join('');
      if (/encantamientos/i.test(c.name) && S.ench) R.insertAdjacentHTML('beforeend', (S.ench.enchantments || []).map(e => '<div class="k-rule"><h3>' + esc(e.name) + '</h3><p>' + esc(e.description || '') + '</p><p class="k-ink">' +
        e.levels.map(l => '<span style="color:var(--tier-' + l.source + ')">' + (roman[l.level - 1] || l.level) + '</span> ' + src[l.source]).join(' · ') + '</p></div>').join('')); R.scrollTop = 0; };
    cats.forEach((c, i) => { const b = h('button', 'k-btn ghost', esc(c.name)); b.type = 'button'; b.style.textAlign = 'left'; b.onclick = () => { nav.querySelectorAll('button').forEach(o => o.setAttribute('aria-pressed', o === b)); show(c); }; nav.appendChild(b); if (!i) b.click(); }); }

  /* ---------- download and install ---------- */
  function renderDownload(cover) { const pg = h('div', 'k-pages one'); cover.appendChild(pg); const P = h('div', 'k-pg'); pg.appendChild(P);
    const s = S.status || {}, v = s.mod_version || '1.0.0', jar = 'auyamaland-' + v + '.jar';
    P.innerHTML = '<h2>Para jugar</h2><p>Un solo archivo con todo dentro: ' + esc(jar) + '.</p><ol class="k-steps">' +
      '<li>Instala Fabric Loader para Minecraft 1.16.5 desde <a href="https://fabricmc.net/use/installer/" target="_blank" rel="noopener">fabricmc.net</a>.</li>' +
      '<li>Descarga ' + esc(jar) + ' y ponlo en la carpeta mods de tu Minecraft. Nada más: todo lo demás va dentro.</li>' +
      '<li>Abre el juego con el perfil de Fabric 1.16.5' + (C.server_address ? ' y entra a <b style="font-weight:400;color:var(--paper-title)">' + esc(C.server_address) + '</b>' : '') + '.</li>' +
      '<li>La primera vez el juego te pide una contraseña dos veces. Es la misma con la que entras a esta página.</li>' +
      '<li>Si el juego te dice que tu versión es vieja, descarga el archivo otra vez.</li></ol>' +
      (s.download ? '<a class="k-btn" href="' + esc(s.download) + '" target="_blank" rel="noopener" data-tip="' + esc(jar) + '|Fabric 1.16.5|Un solo archivo, todo incluido" data-tc="#5fdba9">Descargar</a>' : '<button class="k-btn" disabled>El enlace todavía no está</button>') +
      (s.discord ? ' <a class="k-btn ghost" href="' + esc(s.discord) + '" target="_blank" rel="noopener">Discord</a>' : ''); }

  /* ---------- footer ---------- */
  function renderFoot() { const s = S.status || {};
    $('#foot').innerHTML = (DEMO ? '<div class="demo">Demo con datos de ejemplo: falta la llave pública de Supabase en config.js.</div>' : '') +
      (s.discord ? '<a href="' + esc(s.discord) + '" target="_blank" rel="noopener">Discord</a> · ' : '') + 'Fuente: Minecraft por Pwnage_Block (CC BY-SA 3.0).<br>No es un producto oficial de Minecraft. No está aprobado por Mojang ni asociado con Mojang.'; }

  /* ---------- side books ---------- */
  const wall = K.SideBook({ side: 'right', tabs: [{ label: 'El muro', icon: 'item/xp_tome', fallback: 'book', color: 'var(--tab-wall)', render: renderWall }] });
  K.SideBook({ side: 'left', tabs: [{ label: 'Reglas', icon: 'item/ceiling_book', fallback: 'book', color: 'var(--tab-rules)', render: renderRules }] });
  const dl = K.SideBook({ side: 'left', tabs: [{ label: 'Descargar', color: 'var(--tab-download)', render: renderDownload }] }); dl.tabs.hidden = true;
  $('#dlbtn').prepend(K.texImg('item/molten_core', 32, 'chest')); $('#dlbtn').onclick = () => dl.tabs.firstChild.click();

  /* ---------- start ---------- */
  renderPfp(); renderSombra(); renderFoot(); setSky(5);
  await Promise.all([loadStatus(), loadBoard(), loadMap(), loadBooks(), loadMech(), loadSettings(), K.langReady]);
  await loadPrivate();
  MCUI.bind();
  if (sb) sb.auth.onAuthStateChange((ev) => { if (ev === 'SIGNED_IN' || ev === 'SIGNED_OUT' || ev === 'USER_UPDATED') loadPrivate(); });
  setInterval(loadStatus, 30000);
  setInterval(() => { loadBoard(); loadMap(); }, 60000);
  setInterval(() => { if (signedIn() && !DEMO) loadPrivate(); }, 60000);
  window.AUY_SITE = { state: S, wall };
})();
