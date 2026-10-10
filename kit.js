/* Auyamaland website kit: the pieces of the page.
   Scene (the living header), Season (the progress bar), Relics (the board), Books (enchantments), SideBook (edge tabs
   with sliding books), items (textures and names), heads (from skins).
   Every texture is read from textures/<path>.png, the same paths as the mod (vanilla's under textures/minecraft/).
   Colours come from theme.css. */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r) => (r || document).querySelector(s);
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  /* ---------- textures ---------- */
  const cache = {};
  function loadImg(path) { if (cache[path]) return cache[path]; return (cache[path] = new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = 'textures/' + path + '.png'; })); }
  function texImg(path, size, fallback, cls) { const i = new Image(); i.width = i.height = size; i.alt = ''; i.draggable = false; i.className = 'k-px ' + (cls || '');
    i.src = 'textures/' + path + '.png'; i.onerror = () => { i.onerror = null; i.src = fallback && window.SPR ? SPR.url(fallback) : 'data:image/gif;base64,R0lGODlhAQABAAAAACw='; }; return i; }
  /* tries each path in turn, then the drawn fallback */
  function texAny(paths, size, fallback) { const i = texImg(paths[0], size, fallback); let k = 0; i.onerror = () => { k++; if (k < paths.length) i.src = 'textures/' + paths[k] + '.png'; else { i.onerror = null; i.src = fallback && window.SPR ? SPR.url(fallback) : 'data:image/gif;base64,R0lGODlhAQABAAAAACw='; } }; return i; }
  const RELIC = {
    wanderer: { a: 'item/wanderer', b: 'item/wanderer_fully_charged', g: '#e9930a' }, stalker: { a: 'item/stalker', b: 'item/stalker_offhand', g: '#c62196' },
    devils_compass: { a: 'item/devils_compass/closed', b: 'item/devils_compass/open_16', g: '#da2709' }, disabler: { a: 'item/disabler', b: 'item/disabler_offhand', g: '#09d0bf' },
    dark_skull: { a: 'item/dark_skull', b: 'item/dark_skull_offhand', g: '#b30713' }, light_skull: { a: 'item/light_skull', b: 'item/light_skull_offhand', g: '#dc5d09' },
    second_life: { a: 'item/second_life', b: 'item/second_life_offhand', g: '#f6333a' }, berserker: { a: 'item/berserker_ready', b: 'item/berserker_activated', g: '#da2709' },
    blood_pact: { a: 'item/blood_pact', b: 'item/blood_pact_offhand', g: '#b30713' } };
  /* the board's slot order (W/board.txt) */
  const SLOTS = ['wanderer', 'stalker', 'devils_compass', 'disabler', 'dark_skull', 'light_skull', 'second_life', 'berserker', 'blood_pact', null];
  const rgb = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];


  /* ---------- shared styles ---------- */
  const css = `
  /* spacing scale, nothing else: 4 8 16 24 32 48 64. text: --t1 cream, --t2 muted, --head titles, --lab labels. orange only for the one action, the progress fill and tonight. */
  .k-px{image-rendering:pixelated;image-rendering:crisp-edges}
  .k-sh{}
  /* season bar */
  .k-season{position:relative;padding-block:16px 8px}
  .k-track{position:relative;height:10px;margin-inline:16px;background:#190b15;box-shadow:0 0 0 2px var(--ink),inset 0 2px 0 #0b050a}
  .k-fill{position:absolute;left:0;top:0;bottom:0;background:var(--fill);box-shadow:inset 0 2px 0 var(--fill-hi),inset 0 -2px 0 var(--fill-lo)}
  .k-mk{position:absolute;top:50%;border:0;padding:0;background:none;cursor:pointer;display:grid;place-items:center}
  .k-mk canvas{image-rendering:pixelated;display:block}
  .k-mk:focus-visible{outline:2px solid var(--t1);outline-offset:2px}
  .k-mk.now canvas{animation:k-blink 1s steps(2) infinite}
  @keyframes k-blink{50%{filter:brightness(1.6)}}
  .k-line{text-align:center;margin-top:16px;color:var(--t2)}
  .k-line b{font-weight:400;color:var(--t1)}
  /* relics */
  .k-board{display:flex;flex-direction:column;align-items:center;gap:var(--k-gap,10px)}
  .k-grid{display:grid;grid-template-columns:repeat(3,var(--k-cell,120px));gap:var(--k-gap,10px)}
  .k-relic{position:relative;width:var(--k-cell,120px);height:var(--k-cell,120px);border:0;padding:0;background:none;cursor:pointer;perspective:500px}
  .k-relic .in{position:absolute;inset:0;display:grid;place-items:center;transition:transform .12s;transform-style:preserve-3d}
  .k-relic canvas.glow{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated}
  .k-relic img,.k-relic canvas.sil{position:relative;image-rendering:pixelated;transition:transform .12s}
  .k-relic:hover .in,.k-relic:focus-visible .in{transform:scale(1.12)}
  .k-relic:hover img{transform:translateY(-4px)}
  .k-relic:focus-visible{outline:2px solid var(--t1);outline-offset:2px}
  .k-relic.sel::after{content:"";position:absolute;inset:-4px;box-shadow:inset 0 0 0 2px var(--t1)}
  .k-relic.void{cursor:default}
  .k-relic.void .in{background:var(--void);box-shadow:inset 0 0 0 2px var(--ink),inset 0 0 0 4px #1c101a}
  .k-relic.void:hover .in{transform:none}
  .k-ficha{color:var(--paper-ink);background:var(--paper);padding:16px;box-shadow:inset 0 0 0 2px var(--paper-edge),8px 8px 0 rgba(0,0,0,.4);min-width:0}
  .k-ficha h3{font-weight:400;font-size:32px;line-height:36px;color:var(--paper-title);margin:0 0 8px}
  .k-ficha p{margin:0 0 8px}.k-ficha p:last-child{margin:0}
  .k-ficha .d{color:var(--paper-soft)}
  /* enchanted books */
  .k-legend{display:flex;flex-wrap:wrap;gap:8px 24px;justify-content:center;margin-bottom:16px;color:var(--t2)}
  .k-legend>span{display:flex;gap:8px;align-items:center}
  .k-legend canvas{width:32px;height:32px;image-rendering:pixelated}
  .k-books{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:24px 8px;justify-items:center}
  .k-book{border:0;background:none;padding:0;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:8px;color:var(--t1);font:inherit;width:100%;text-align:center}
  .k-book canvas{width:64px;height:64px;image-rendering:pixelated;filter:drop-shadow(4px 4px 0 rgba(0,0,0,.45));transition:transform .1s steps(2)}
  .k-book:hover canvas,.k-book:focus-visible canvas{transform:translateY(-6px)}
  .k-book:focus-visible{outline:2px solid var(--t1);outline-offset:2px}
  /* side tabs and books */
  .k-tabs{position:fixed;z-index:60;display:flex;gap:8px}
  .k-tabs{transition:right .32s steps(8),left .32s steps(8),bottom .32s steps(8)}
  .k-tabs.right{right:0;top:30%;flex-direction:column}
  .k-tabs.left{left:0;top:30%;flex-direction:column}
  .k-tabs.bottom{bottom:0;left:50%;transform:translateX(-50%);flex-direction:row}
  .k-tab{border:0;cursor:pointer;display:flex;align-items:center;gap:8px;font:inherit;color:var(--btn-text);background:var(--c,var(--btn));padding:8px;transition:transform .1s steps(2);
    box-shadow:inset 0 0 0 2px var(--ink),inset 2px 2px 0 2px rgba(255,255,255,.18),inset -2px -2px 0 2px rgba(0,0,0,.3)}
  .k-tab canvas,.k-tab img{width:32px;height:32px;image-rendering:pixelated}
  .k-tabs.right .k-tab{transform:translateX(16px);padding-right:24px}
  .k-tabs.right .k-tab:hover,.k-tabs.right .k-tab[aria-expanded="true"]{transform:translateX(0)}
  .k-tabs.left .k-tab{transform:translateX(-16px);padding-left:24px;flex-direction:row-reverse}
  .k-tabs.left .k-tab:hover,.k-tabs.left .k-tab[aria-expanded="true"]{transform:translateX(0)}
  .k-tabs.bottom .k-tab{transform:translateY(16px);padding-bottom:24px}
  .k-tabs.bottom .k-tab:hover,.k-tabs.bottom .k-tab[aria-expanded="true"]{transform:translateY(0)}
  .k-tab .lb{white-space:nowrap}
  .k-tab:focus-visible{outline:2px solid var(--t1)}
  .k-sb{position:fixed;z-index:55;top:0;bottom:0;width:min(860px,96vw);padding:16px;display:flex;transition:transform .32s steps(8)}
  .k-sb.right{right:0;transform:translateX(105%)}.k-sb.left{left:0;transform:translateX(-105%)}
  .k-sb.bottom{left:50%;top:auto;bottom:0;height:min(640px,92vh);margin-left:calc(min(860px,96vw) / -2);transform:translateY(105%)}
  .k-sb.open{transform:none}
  .k-cover{flex:1;min-height:0;background:var(--cover);padding:16px;display:flex;box-shadow:inset 0 0 0 2px var(--ink),inset 4px 4px 0 2px var(--cover-hi),inset -4px -4px 0 2px var(--cover-lo),-10px 0 0 rgba(0,0,0,.35)}
  .k-pages{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;background:var(--page);color:var(--page-ink);box-shadow:inset 0 0 0 2px #8c5f29}
  .k-pages.one{grid-template-columns:1fr}
  .k-pg{padding:24px;overflow:auto;min-height:0;position:relative}
  .k-pg+.k-pg{box-shadow:inset 2px 0 0 var(--page-edge),inset 6px 0 0 #e1bc66}
  .k-pg h2{font-weight:400;font-size:32px;line-height:36px;margin:0 0 8px;color:var(--paper-title)}
  .k-x{position:absolute;right:32px;top:32px;z-index:2}
  .k-ink{color:var(--page-soft)}
  .k-btn{font:inherit;color:var(--btn-text);background:var(--btn);border:0;padding:8px 16px;cursor:pointer;
    box-shadow:inset 0 0 0 2px var(--ink),inset 2px 2px 0 2px var(--btn-hi),inset -2px -2px 0 2px var(--btn-lo)}
  .k-btn:hover{filter:brightness(1.15)}.k-btn:active{transform:translateY(2px)}
  .k-btn.ghost{background:#dcba63;color:var(--page-ink);box-shadow:inset 0 0 0 2px #8c5f29,inset 2px 2px 0 2px #f2dea9,inset -2px -2px 0 2px var(--page-edge)}
  .k-btn:focus-visible{outline:2px solid var(--t1);outline-offset:2px}
  .k-field{display:flex;flex-direction:column;gap:4px;margin-bottom:16px}
  .k-field input,.k-field textarea{font:inherit;color:var(--paper-ink);background:#f5e4b5;border:0;padding:8px;box-shadow:inset 0 0 0 2px #8c5f29;resize:vertical}
  .k-field input:focus,.k-field textarea:focus{outline:0;box-shadow:inset 0 0 0 2px var(--page-ink)}
  /* the wall (feed) */
  .k-post{display:grid;grid-template-columns:40px 1fr;gap:16px;padding:16px 0;border-bottom:2px dashed #ca9c4c}
  .k-post canvas.head{width:40px;height:40px;image-rendering:pixelated;box-shadow:0 0 0 2px var(--page-ink)}
  .k-post .nm{color:var(--paper-title)}.k-post .tm{color:#9a6c3b}
  .k-post p{margin:4px 0 8px;color:var(--paper-ink)}
  .k-post .ph{display:block;width:100%;max-width:320px;image-rendering:pixelated;box-shadow:0 0 0 2px var(--page-ink),4px 4px 0 #ca9c4c;margin:4px 0 8px}
  .k-acts{display:flex;gap:16px}
  .k-act{font:inherit;border:0;background:none;color:var(--page-soft);cursor:pointer;display:flex;gap:8px;align-items:center;padding:4px 0}
  .k-act canvas{width:16px;height:16px;image-rendering:pixelated}
  .k-act.on{color:#b30713}
  .k-act:focus-visible{outline:2px solid var(--page-ink)}
  .k-sort{display:flex;gap:4px;margin-bottom:8px}
  .k-sort button[aria-pressed="true"]{background:var(--paper-title);color:var(--btn-text);text-shadow:none}
  .k-rose{position:absolute;right:16px;bottom:16px;width:48px;height:48px;image-rendering:pixelated;opacity:.6}
  /* account */
  .k-pfp{border:0;padding:0;cursor:pointer;background:var(--ink);width:48px;height:48px;display:grid;place-items:center;box-shadow:0 0 0 2px var(--ink),inset 0 0 0 2px var(--paper-edge)}
  .k-pfp canvas{width:40px;height:40px;image-rendering:pixelated}
  .k-pfp:focus-visible{outline:2px solid var(--t1);outline-offset:2px}
  .k-acc{position:absolute;z-index:70;width:320px;max-width:calc(100vw - 32px);background:var(--paper);color:var(--paper-ink);padding:16px;box-shadow:inset 0 0 0 2px var(--paper-edge),0 0 0 2px var(--ink),8px 8px 0 rgba(0,0,0,.45)}
  .k-acc h3{font-weight:400;color:var(--paper-title);margin:0 0 8px;font-size:32px;line-height:36px}
  .k-acc .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
  .k-acc hr{border:0;border-top:2px solid var(--paper-lo);margin:16px 0}
  .k-drop{display:block;border:2px dashed #8c5f29;padding:16px;text-align:center;cursor:pointer;margin-top:8px}
  .k-drop input{position:absolute;opacity:0;width:1px;height:1px}
  .k-drop:focus-within{outline:2px solid var(--page-ink)}
  .k-msg{min-height:20px;color:var(--paper-title);margin-top:8px}
  /* the player's shadow */
  .k-sombra{display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:start}
  .k-fig{width:112px;height:224px;background:#0e080f;box-shadow:inset 0 0 0 2px var(--ink),inset 0 0 0 4px #261825;display:grid;place-items:center}
  .k-fig canvas{width:80px;height:176px;image-rendering:pixelated}
  .k-inv{display:grid;grid-template-columns:repeat(9,36px);gap:0}
  .k-slot{width:36px;height:36px;background:var(--slot);box-shadow:inset 2px 2px 0 var(--slot-lo),inset -2px -2px 0 var(--slot-hi);display:grid;place-items:center;position:relative}
  .k-slot img{width:32px;height:32px;image-rendering:pixelated}
  .k-slot .n{position:absolute;right:1px;bottom:-2px;color:#fff}
  .k-slot .lt{color:var(--head)}
  .k-armor{display:flex;gap:0;margin-bottom:8px}
  .k-xp{position:relative;height:10px;background:#0e2a10;box-shadow:0 0 0 2px var(--ink);margin:32px 0 16px}
  .k-xp i{position:absolute;left:0;top:0;bottom:0;width:38%;background:var(--xp);box-shadow:inset 0 -2px 0 #3aa010}
  .k-xp span{position:absolute;left:0;right:0;top:-22px;text-align:center;color:var(--xp);text-shadow:2px 0 0 #000,-2px 0 0 #000,0 2px 0 #000,0 -2px 0 #000}
  .k-kv{display:grid;grid-template-columns:auto 1fr;gap:8px 16px;margin:0}
  .k-kv dt{color:var(--lab)}.k-kv dd{margin:0}
  @media (max-width:760px){.k-books{grid-template-columns:repeat(3,minmax(0,1fr))}.k-pages{grid-template-columns:1fr}.k-pg+.k-pg{box-shadow:inset 0 2px 0 var(--page-edge)}.k-sombra{grid-template-columns:1fr}.k-fig{display:none}.k-inv{grid-template-columns:repeat(9,1fr)}.k-slot{width:100%;height:auto;aspect-ratio:1}.k-tab .lb{display:none}}
  @media (max-width:520px){.k-books{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media (prefers-reduced-motion:reduce){.k-sb{transition:none}.k-mk.now canvas{animation:none}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- tiny pixel drawer ---------- */
  function pix(rows, pal, scale) { const c = document.createElement('canvas'); c.width = rows[0].length; c.height = rows.length; const x = c.getContext('2d');
    rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const ch = r[i]; if (ch !== '.' && pal[ch]) { x.fillStyle = pal[ch]; x.fillRect(i, j, 1, 1); } } });
    if (scale) { c.style.width = c.width * scale + 'px'; c.style.height = c.height * scale + 'px'; } return c; }

  /* =================================================================== Scene */
  function moonPhase(n) { return [4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 0][n - 1]; }
  const TH = {
    1: { n: 'Se abre el mundo', sky: ['#0f0928', '#220f3c', '#5b1142', '#9f311b'], stars: 1, moon: 1, fx: ['fireworks'] },
    2: { n: 'Las mesas despiertan', sky: ['#0a0724', '#110c3b', '#210f5c'], stars: 1, moon: 1, fx: ['glyphs'] },
    3: { n: 'Cae un cargamento', sky: ['#0a0724', '#130d43', '#331652'], stars: 1, moon: 1, fx: ['crate'] },
    4: { n: 'La bóveda se llena', sky: ['#060820', '#081442', '#0e255a'], stars: 1, moon: 1, fx: ['beamBlue', 'lightning'] },
    5: { n: 'Una noche quieta', sky: ['#060a1e', '#0a1533', '#0f2447'], stars: 1, moon: 1, fx: ['fog', 'fireflies'] },
    6: { n: 'Se abre el Nether', sky: ['#14061c', '#37032a', '#5e0424', '#a2200a'], stars: 0, moon: 1, fx: ['portal', 'ash', 'embers'] },
    7: { n: 'Lluvia', sky: ['#090c19', '#0e152b', '#161f3c'], stars: 0, moon: 0, fx: ['clouds', 'rain'] },
    8: { n: 'La llama prestada', sky: ['#040b23', '#07153a', '#0c2649'], stars: 1, moon: 1, fx: ['soulsmoke'] },
    9: { n: 'El Nether se mueve', sky: ['#11061e', '#210636', '#3a0f5a'], stars: 1, moon: 1, fx: ['portal', 'ash'] },
    10: { n: 'Tormenta', sky: ['#070916', '#0e0f25', '#181935'], stars: 0, moon: 0, fx: ['clouds', 'rain', 'crate', 'lightning'] },
    11: { n: 'El colapso', sky: ['#0f0818', '#270927', '#550424'], stars: 1, moon: 1, fx: ['beamRed'] },
    12: { n: 'El borde avanza', sky: ['#130814', '#2b0521', '#550424', '#840f1c'], stars: 0, moon: 1, fx: ['walls30', 'ash'] },
    13: { n: 'Humo', sky: ['#0f0710', '#23051a', '#3d0322'], stars: 0, moon: 0, fx: ['walls55', 'smoke', 'ash'] },
    14: { n: 'Luna roja', sky: ['#230114', '#45031d', '#6e0524', '#a70713'], stars: 0, moon: 'red', fx: ['walls75', 'redrain', 'lightning'] }
  };
  function Scene(cv, opts) {
    const P = opts.px || 4, x = cv.getContext('2d'); let W = 0, H = 0, day = opts.day || 5, t = 0, sky = null, hills = null, S = {}, stars = [];
    const pumpkin = new Image(); pumpkin.onload = () => { hills = null; }; pumpkin.src = 'textures/item/pumpkin_big.png';
    const small = new Image(); small.onload = () => { hills = null; }; small.src = 'textures/item/pumpkin_small.png';
    function size() { const r = cv.getBoundingClientRect(); W = Math.max(40, Math.ceil(r.width / P)); H = Math.max(30, Math.ceil(r.height / P)); cv.width = W; cv.height = H; sky = null; hills = null;
      stars = Array.from({ length: W * H / 70 | 0 }, (_, i) => ({ x: (i * 97) % W, y: (i * 53 + (i * i) % 17) % Math.floor(H * .55), k: i })); }
    const R = () => Math.random();
    function bandSky() { const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'), stops = TH[day].sky, n = stops.length, bh = Math.ceil(H * .8 / n);
      for (let y = 0; y < H; y++) { const b = Math.min(n - 1, Math.floor(y / bh)), edge = (y % bh) >= bh - 2 && b < n - 1;
        for (let i = 0; i < W; i++) { g.fillStyle = edge && ((i + y) & 1) ? stops[b + 1] : stops[b]; g.fillRect(i, y, 1, 1); } }
      return c; }
    function hillLayer() { const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
      const red = day >= 12, far = red ? '#2a0822' : day === 6 || day === 9 ? '#2a0827' : '#150e2d', near = red ? '#1a0513' : '#0e0720';
      const fy = i => Math.round(H * .64 + Math.sin(i * .045) * 4 + Math.sin(i * .13 + 1) * 2), ny = i => Math.round(H * .8 + Math.sin(i * .06 + 2) * 3 + Math.sin(i * .19) * 1);
      for (let i = 0; i < W; i++) { g.fillStyle = far; g.fillRect(i, fy(i), 1, H); }
      for (let i = 5; i < W; i += 11 + (i * 7) % 9) { const y = fy(i); g.fillStyle = far; g.fillRect(i, y - 6, 1, 6); g.fillRect(i - 2, y - 9, 5, 4); g.fillRect(i - 1, y - 11, 3, 2); }
      for (let i = 0; i < W; i++) { g.fillStyle = near; g.fillRect(i, ny(i), 1, H); }
      if (small.complete && small.naturalWidth) for (let i = 60; i < W - 20; i += 97 + (i % 31)) { if (Math.abs(i - W * .2) < 26) continue; g.drawImage(small, i, ny(i) - small.height + 3); }
      if (pumpkin.complete && pumpkin.naturalWidth) { const px = Math.round(W * .2), py = ny(px) - pumpkin.height + 5;
        g.fillStyle = 'rgba(249,163,27,.18)'; for (let yy = -6; yy < pumpkin.height + 4; yy++) for (let xx = -8; xx < pumpkin.width + 8; xx++) if (((xx + yy) & 1) && Math.hypot(xx - pumpkin.width / 2, yy - pumpkin.height / 2) < 22 && Math.hypot(xx - pumpkin.width / 2, yy - pumpkin.height / 2) > 15) g.fillRect(px + xx, py + yy, 1, 1);
        g.drawImage(pumpkin, px, py); }
      return c; }
    function moon() { const m = TH[day].moon; if (!m) return; const r = Math.max(5, Math.min(9, H * .08 | 0)), cx = Math.round(W * .8), cy = Math.round(H * .2), red = m === 'red';
      const ph = red ? 0 : moonPhase(day), dx = ph <= 4 ? 2 * r * (1 - ph / 4) : -2 * r * ((ph - 4) / 4);
      if (red) { x.fillStyle = 'rgba(180,32,42,.35)'; for (let y = -r - 4; y <= r + 4; y++) for (let i = -r - 4; i <= r + 4; i++) { const d = Math.hypot(i, y); if (d > r && d < r + 4 && ((i + y) & 1)) x.fillRect(cx + i, cy + y, 1, 1); } }
      for (let y = -r; y <= r; y++) for (let i = -r; i <= r; i++) { if (i * i + y * y > r * r) continue; const lit = (i - dx) * (i - dx) + y * y > r * r, cr = ((i * 7 + y * 13) & 15) === 3;
        x.fillStyle = lit ? (red ? (cr ? '#820526' : '#e60a16') : (cr ? '#dfb659' : '#f3d77d')) : (red ? '#310218' : 'rgba(0,0,0,0)'); if (lit || red) x.fillRect(cx + i, cy + y, 1, 1); } }
    const groundY = () => Math.round(H * .8);
    function beam(bx, col, core) { const top = 0, bot = groundY(); for (let y = top; y < bot; y++) { x.fillStyle = col; if ((y + (t >> 1)) % 3) x.fillRect(bx - 1, y, 1, 1); if ((y + (t >> 1) + 1) % 3) x.fillRect(bx + 1, y, 1, 1); x.fillStyle = core; x.fillRect(bx, y, 1, 1); } }
    const FX = {
      fireworks() { S.fw = S.fw || []; if (t % 18 === 0) S.fw.push({ x: 20 + R() * (W - 40) | 0, y: 6 + R() * H * .35 | 0, r: 0, c: ['#f2a62b', '#f6333a', '#5fdba9', '#f3d77d'][R() * 4 | 0] });
        S.fw.forEach(f => { f.r++; const n = f.r < 4 ? 8 : 16; x.fillStyle = f.c; for (let k = 0; k < n; k++) { if (f.r > 5 && ((k + f.r) & 1)) continue; const a = k / n * Math.PI * 2; x.fillRect(Math.round(f.x + Math.cos(a) * f.r), Math.round(f.y + Math.sin(a) * f.r), 1, 1); } });
        S.fw = S.fw.filter(f => f.r < 9); },
      glyphs() { S.g = S.g || []; if (t % 5 === 0) S.g.push({ x: R() * W | 0, y: groundY() - 2, s: R() * 4 | 0, l: 0 });
        const G = [[[0, 0], [2, 0], [1, 1], [0, 2]], [[1, 0], [0, 1], [2, 1], [1, 2]], [[0, 0], [1, 0], [2, 1], [0, 2], [1, 2]], [[0, 1], [1, 0], [2, 2], [1, 1]]];
        S.g.forEach(g => { g.l++; if (g.l % 2 === 0) g.y--; x.fillStyle = g.l % 6 < 3 ? '#c563f9' : '#e8ddc4'; G[g.s].forEach(([a, b]) => x.fillRect(g.x + a, g.y + b, 1, 1)); });
        S.g = S.g.filter(g => g.l < 70); },
      crate() { S.c = S.c || { y: -8, w: 0 }; const cx = Math.round(W * .62), gy = groundY() - 4; beam(cx, 'rgba(250,106,10,.55)', 'rgba(249,163,27,.8)');
        if (S.c.y < gy) { if (t % 2 === 0) S.c.y++; } else { S.c.w++; if (S.c.w > 40) { S.c.y = -8; S.c.w = 0; } }
        const y = S.c.y; if (S.c.y < gy) { x.fillStyle = '#e7c577'; x.fillRect(cx - 4, y - 7, 9, 2); x.fillStyle = '#b30713'; x.fillRect(cx - 2, y - 7, 2, 2); x.fillRect(cx + 2, y - 7, 1, 2); x.fillStyle = '#c8a261'; x.fillRect(cx - 4, y - 5, 1, 3); x.fillRect(cx + 4, y - 5, 1, 3); }
        x.fillStyle = '#120b12'; x.fillRect(cx - 3, y - 2, 7, 5); x.fillStyle = '#8f4d17'; x.fillRect(cx - 2, y - 1, 5, 3); x.fillStyle = '#ec952c'; x.fillRect(cx, y, 1, 1); },
      beamBlue() { beam(Math.round(W * .66), 'rgba(36,159,222,.45)', 'rgba(166,252,219,.8)'); },
      beamRed() { beam(Math.round(W * .44), 'rgba(180,32,42,.5)', 'rgba(232,106,115,.85)'); },
      lightning() { if (!S.l && R() < .015) S.l = { f: 3, x: 20 + R() * (W - 40) | 0 }; if (S.l) { x.fillStyle = 'rgba(255,255,255,.08)'; x.fillRect(0, 0, W, H);
          let lx = S.l.x; x.fillStyle = '#ede4fe'; for (let y = 0; y < groundY() - 4; y++) { if (y % 4 === 0) lx += (R() * 3 | 0) - 1; x.fillRect(lx, y, 1, 1); } if (--S.l.f <= 0) S.l = null; } },
      fog() { const gy = groundY(); x.fillStyle = 'rgba(180,190,210,.16)'; for (let y = gy - 8; y < gy + 4; y++) for (let i = 0; i < W; i++) if ((i + y * 3 + (t >> 2)) % 4 === 0) x.fillRect(i, y, 1, 1); },
      fireflies() { S.f = S.f || Array.from({ length: 16 }, () => ({ x: R() * W | 0, y: groundY() - 2 - R() * 14 | 0, p: R() * 10 | 0 }));
        S.f.forEach(f => { if (t % 3 === 0) { f.x += (R() * 3 | 0) - 1; f.y += (R() * 3 | 0) - 1; } if ((t + f.p) % 10 < 6) { x.fillStyle = '#d4f736'; x.fillRect(f.x, f.y, 1, 1); } }); },
      portal() { const px = Math.round(W * .7), py = Math.round(H * .64 + Math.sin(px * .045) * 4 + Math.sin(px * .13 + 1) * 2) - 11, open = day < 12;
        x.fillStyle = '#090111'; x.fillRect(px, py, 7, 11); for (let j = 1; j < 10; j++) for (let i = 1; i < 6; i++) { x.fillStyle = open ? (R() < .3 ? '#c62196' : R() < .5 ? '#792183' : '#3e127f') : '#160720'; x.fillRect(px + i, py + j, 1, 1); }
        if (open) { x.fillStyle = 'rgba(188,74,155,.25)'; for (let j = -3; j < 14; j++) for (let i = -3; i < 10; i++) if (((i + j + t) & 3) === 0 && (i < 0 || i > 6 || j < 0 || j > 10)) x.fillRect(px + i, py + j, 1, 1); } },
      ash() { S.a = S.a || Array.from({ length: W / 3 | 0 }, () => ({ x: R() * W, y: R() * H })); x.fillStyle = '#6978ab';
        S.a.forEach(a => { if (t % 3 === 0) { a.y++; a.x += day === 9 ? 1 : (R() < .3 ? -1 : 0); } if (a.y > H) { a.y = 0; a.x = R() * W; } if (a.x > W) a.x = 0; x.fillRect(a.x | 0, a.y | 0, 1, 1); }); },
      embers() { S.e = S.e || Array.from({ length: W / 6 | 0 }, () => ({ x: R() * W, y: H * .6 + R() * H * .4 })); S.e.forEach(e => { if (t % 2 === 0) e.y--; if (t % 5 === 0) e.x += R() < .5 ? -1 : 1; if (e.y < H * .25) { e.y = H; e.x = R() * W; }
          x.fillStyle = e.y < H * .45 ? '#da2709' : '#e9930a'; x.fillRect(e.x | 0, e.y | 0, 1, 1); }); },
      clouds() { S.k = S.k || Array.from({ length: 6 }, (_, i) => ({ x: R() * W, y: 3 + i * 4 + R() * 6 | 0, w: 18 + R() * 30 | 0 }));
        S.k.forEach(k => { if (t % 4 === 0) k.x += .5; if (k.x > W) k.x = -k.w; x.fillStyle = 'rgba(60,64,84,.85)'; x.fillRect(k.x | 0, k.y, k.w, 3); x.fillRect((k.x + 4) | 0, k.y - 2, k.w * .5 | 0, 2); x.fillStyle = 'rgba(30,32,44,.9)'; x.fillRect(k.x | 0, k.y + 3, k.w, 1); }); },
      rain(col) { S.r = S.r || Array.from({ length: W * .8 | 0 }, () => ({ x: R() * W, y: R() * H })); x.fillStyle = col || 'rgba(139,147,175,.7)';
        S.r.forEach(d => { if (!reduce) { d.y += 2; d.x -= 1; } if (d.y > H) { d.y = -3; d.x = R() * (W + 20); } x.fillRect(d.x | 0, d.y | 0, 1, 3); }); },
      redrain() { FX.rain('rgba(224,48,58,.8)'); },
      smoke(col) { S.s = S.s || []; const sx = Math.round(W * .55); if (t % 4 === 0) S.s.push({ x: sx, y: groundY() - 4, l: 0 });
        S.s.forEach(p => { p.l++; if (p.l % 2 === 0) p.y--; if (p.l % 7 === 0) p.x++; const s = p.l > 20 ? 3 : 2; x.fillStyle = col || (p.l % 8 < 4 ? 'rgba(58,52,64,.9)' : 'rgba(40,36,46,.9)'); x.fillRect(p.x, p.y, s, s); });
        S.s = S.s.filter(p => p.y > -4); },
      soulsmoke() { const bx = Math.round(W * .55), gy = groundY(); x.fillStyle = '#261825'; x.fillRect(bx - 2, gy - 4, 5, 3); x.fillStyle = (t & 2) ? '#09d0bf' : '#77f9b4'; x.fillRect(bx - 1, gy - 6, 3, 2);
        FX.smoke((t & 4) ? 'rgba(36,159,222,.55)' : 'rgba(32,214,199,.5)'); },
      walls(p) { const bw = Math.round(W * p / 2); for (let y = 0; y < H; y++) { for (let i = 0; i < bw; i++) { if ((i + y + (t >> 1)) % 4 === 0) { x.fillStyle = 'rgba(196,43,43,.45)'; x.fillRect(i, y, 1, 1); x.fillRect(W - 1 - i, y, 1, 1); } }
          if ((y + t) % 3) { x.fillStyle = '#f6333a'; x.fillRect(bw, y, 1, 1); x.fillRect(W - 1 - bw, y, 1, 1); } } },
      walls30() { FX.walls(.12); }, walls55() { FX.walls(.22); }, walls75() { FX.walls(.32); }
    };
    function frame() { t++; if (!sky) sky = bandSky(); x.drawImage(sky, 0, 0); const th = TH[day];
      if (th.stars) stars.forEach(s => { if (((s.k * 7 + (t >> 2)) % 23) !== 0) { x.fillStyle = s.k % 5 ? '#6978ab' : '#f3d77d'; x.fillRect(s.x, s.y, 1, 1); } });
      moon(); const back = th.fx.filter(f => ['clouds', 'beamBlue', 'beamRed', 'portal', 'crate'].includes(f)), front = th.fx.filter(f => !back.includes(f));
      back.forEach(f => FX[f]()); if (!hills) hills = hillLayer(); x.drawImage(hills, 0, 0); front.forEach(f => FX[f]()); }
    function setDay(d) { day = d; sky = null; hills = null; S = {}; if (reduce) frame(); }
    size(); addEventListener('resize', size); frame(); if (!reduce) setInterval(frame, 90);
    return { setDay, name: () => TH[day].n };
  }

  /* =================================================================== Season bar */
  const MK = {
    day: { r: ['..k..', '.kgk.', 'kgggk', '.kgk.', '..k..'], s: 4 },
    drop: { r: ['.kkkkk.', 'kgggggk', 'kgkykgk', 'kgygygk', 'kgkykgk', 'kgggggk', '.kkkkk.'], s: 4 },
    vault: { r: ['kkkkkkk', 'kbbbbbk', 'kbbbbbk', 'kkkykkk', 'kbbbbbk', 'kbbbbbk', 'kkkkkkk'], s: 4 },
    nether: { r: ['kkkkkk', 'kppPpk', 'kpPppk', 'kppPpk', 'kpPppk', 'kppPpk', 'kpPppk', 'kkkkkk'], s: 4 },
    collapse: { r: ['kk...kk', 'kgk.kgk', '.kgkgk.', '..kgk..', '.kgkgk.', 'kgk.kgk', 'kk...kk'], s: 4 },
    final: { r: ['..kkkkk..', '.kwwwwwk.', 'kwwwwwwwk', 'kwkkwkkwk', 'kwkkwkkwk', 'kwwwkwwwk', '.kwwwwwk.', '..kwkwk..', '..kkkkk..'], s: 4 }
  };
  const KIND = { 1: 'drop', 3: 'drop', 4: 'vault', 6: 'nether', 8: 'vault', 9: 'nether', 10: 'drop', 11: 'collapse', 12: 'vault', 14: 'final' };
  const cssv = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  /* opts: day (0 before the season, 15 after), line (html under the bar), nights, finale, onPick */
  function Season(el, opts) {
    el.innerHTML = ''; const cur = opts.day, wrap = h('div', 'k-season'), tr = h('div', 'k-track'), fill = h('div', 'k-fill'); tr.appendChild(fill); wrap.appendChild(tr);
    const line = h('div', 'k-line'); wrap.appendChild(line); el.appendChild(wrap);
    const base = opts.line || ''; line.innerHTML = base; fill.style.width = (Math.max(0, Math.min(13, cur - 1)) / 13 * 100) + '%';
    const sc = innerWidth < 600 ? 3 : 4, nights = opts.nights || {}, gold = cssv('--fill-hi') || '#f2a62b', past = cssv('--past') || '#b98c55';
    for (let d = 1; d <= 14; d++) { const k = KIND[d] || 'day', m = MK[k], was = d < cur, now = d === cur;
      const pal = { k: cssv('--ink') || '#120b12', g: now ? gold : was ? past : k === 'collapse' ? '#b30713' : '#674d3d', y: '#f3d77d', b: now ? '#8f4d17' : was ? '#5e3d22' : '#47231d', p: was || now ? '#792183' : '#321a3d', P: '#c62196', w: k === 'final' ? '#d5bc99' : '#e8d0bb' };
      const b = h('button', 'k-mk' + (now ? ' now' : '')); b.appendChild(pix(m.r, pal, sc));
      b.style.left = ((d - 1) / 13 * 100) + '%'; b.style.transform = 'translate(-50%,-50%)';
      const ev = (nights[d] || []).map(v => v[0] + ': ' + v[1]);
      b.dataset.tip = (d === 14 ? 'La última noche' : 'Noche ' + d) + '|' + (d === 14 ? (opts.finale || []) : (ev.length ? ev : ['Nada anunciado'])).join('|');
      b.dataset.tc = d === 14 ? '#f73b35' : cssv('--head'); b.dataset.tf = d === 14 ? '#6b0423' : '#3e127f'; b.setAttribute('aria-label', 'Noche ' + d);
      b.onmouseenter = () => { line.innerHTML = d === 14 ? '<b style="color:var(--error)">La última noche:</b> desde las 10:00pm nadie reaparece. Gana el último en pie.' : 'Noche <b>' + d + '</b>: ' + (ev.length ? ev.join(', ') : 'nada anunciado') + '.'; };
      b.onmouseleave = () => { line.innerHTML = base; };
      b.onclick = () => { opts.onPick && opts.onPick(d); };
      tr.appendChild(b); }
    if (window.MCUI) MCUI.bind(wrap);
  }

  /* =================================================================== Relics */
  function silhouette(path, cv) { loadImg(path).then(im => { if (!im) return; const s = document.createElement('canvas'); s.width = s.height = 16; const sx = s.getContext('2d'); sx.drawImage(im, 0, 0);
      const d = sx.getImageData(0, 0, 16, 16).data, x = cv.getContext('2d'), on = (i, j) => i >= 0 && j >= 0 && i < 16 && j < 16 && d[(j * 16 + i) * 4 + 3] > 40;
      for (let j = -1; j < 17; j++) for (let i = -1; i < 17; i++) { if (on(i, j)) { x.fillStyle = '#090409'; x.fillRect(i + 1, j + 1, 1, 1); } else if (on(i - 1, j) || on(i + 1, j) || on(i, j - 1) || on(i, j + 1)) { x.fillStyle = '#3b1c31'; x.fillRect(i + 1, j + 1, 1, 1); } } }); }
  const glows = []; let gt = 0;
  function glowFrame() { gt++; glows.forEach(g => { const x = g.cv.getContext('2d'), N = g.cv.width, c = N / 2, [r, gg, b] = g.col, hot = g.el.matches(':hover') || g.el.classList.contains('sel');
      x.clearRect(0, 0, N, N); const pulse = ((gt >> 2) % 4), R0 = (hot ? 12 : 10) + (pulse === 1 || pulse === 2 ? 1 : 0);
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const d = Math.hypot(i + .5 - c, j + .5 - c); let a = 0;
        if (d < R0 - 5) a = .42; else if (d < R0 - 3) a = (i + j) & 1 ? .36 : .2; else if (d < R0 - 1) a = ((i + j) & 1) ? .24 : 0; else if (d < R0 + 1) a = ((i + 2 * j) % 4 === 0) ? .2 : 0;
        if (a) { x.fillStyle = `rgba(${r},${gg},${b},${hot ? a * 1.6 : a})`; x.fillRect(i, j, 1, 1); } }
      if (!g.sp || g.sp.l <= 0) { const a = Math.random() * Math.PI * 2, d = 5 + Math.random() * (R0 - 3); g.sp = { x: Math.round(c + Math.cos(a) * d), y: Math.round(c + Math.sin(a) * d), l: 5 }; }
      g.sp.l--; x.fillStyle = g.sp.l > 2 ? '#fdf2cc' : `rgb(${r},${gg},${b})`; x.fillRect(g.sp.x, g.sp.y, 1, 1); if (g.sp.l > 1 && g.sp.l < 4) { x.fillRect(g.sp.x - 1, g.sp.y, 1, 1); x.fillRect(g.sp.x + 1, g.sp.y, 1, 1); x.fillRect(g.sp.x, g.sp.y - 1, 1, 1); x.fillRect(g.sp.x, g.sp.y + 1, 1, 1); } }); }
  if (!reduce) setInterval(glowFrame, 110);
  const verb = c => c.action === 'found' ? 'la encontró' : c.action === 'recovered' ? 'la recuperó de ' + c.from_name : 'se la quitó a ' + c.from_name;
  function Relics(el, opts) {
    opts = opts || {}; const S = innerWidth < 520 ? 3 : innerWidth < 980 ? Math.min(4, opts.scale || 6) : (opts.scale || 6); const board = h('div', 'k-board'), grid = h('div', 'k-grid'); board.appendChild(grid); board.style.setProperty('--k-cell', 26 * S + 'px');
    el.innerHTML = ''; glows.length = 0; const bySlot = {}; ((opts.board && opts.board.slots) || []).forEach(s => bySlot[s.slot] = s);
    const cells = [];
    SLOTS.forEach((rid, i) => { const s = bySlot[i + 1] || { slot: i + 1, discovered: false }, b = h('button', 'k-relic'), inn = h('div', 'in'); b.appendChild(inn);
      if (!rid) { b.classList.add('void'); b.dataset.tip = '???'; b.dataset.tc = '#563a4a'; b.dataset.tf = '#1c101a'; b.setAttribute('aria-label', 'Espacio diez');
        cells.push(b); return; }
      const def = RELIC[rid];
      if (s.discovered) { const gc = document.createElement('canvas'); gc.width = gc.height = 26; gc.className = 'glow'; inn.appendChild(gc); glows.push({ cv: gc, col: rgb(def.g), el: b });
        const im = texImg(def.a, 16 * S, rid); inn.appendChild(im);
        b.onmouseenter = () => { im.src = 'textures/' + def.b + '.png'; }; b.onmouseleave = () => { im.src = 'textures/' + def.a + '.png'; inn.style.transform = ''; };
        b.onmousemove = e => { if (reduce) return; const r = b.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
          inn.style.transform = `scale(1.12) rotateY(${px * 30}deg) rotateX(${-py * 30}deg)`; };
        const last = (s.custody || [])[(s.custody || []).length - 1], T = window.TXT || {}, desc = (T.reliquias || {})[rid], holder = s.holder ? esc(s.holder.name) : '';
        b.dataset.tip = [esc(s.name)].concat(desc ? wrapLines(desc, 30).map(l => '<span style="color:#aaaaaa">' + l + '</span>') : [], T.reliquias_todas ? wrapLines(T.reliquias_todas, 30).map(l => '<span style="color:#7a6a7a">' + l + '</span>') : [], ['&nbsp;'], holder ? ['La tiene <span style="color:#fff">' + holder + '</span>'] : [], last ? ['Desde el día ' + last.day + ', ' + last.time] : []).join('|');
        b.dataset.tc = '#ffaa00'; b.dataset.tf = '#8f3806'; b.setAttribute('aria-label', s.name + (holder ? ', la tiene ' + holder : ''));
        b.onclick = () => { cells.forEach(o => o.classList.toggle('sel', o === b)); if (opts.onPick) opts.onPick(s); }; }
      else { const sc = document.createElement('canvas'); sc.width = sc.height = 18; sc.className = 'sil'; sc.style.width = sc.style.height = 18 * S + 'px'; inn.appendChild(sc); silhouette(def.a, sc);
        b.dataset.tip = 'Sin descubrir|Nadie la ha equipado todavía'; b.dataset.tc = '#8e7a57'; b.dataset.tf = '#271626'; b.setAttribute('aria-label', 'Reliquia sin descubrir'); }
      cells.push(b); });
    cells.slice(0, 9).forEach(c => grid.appendChild(c));
    if (opts.tenth !== false) { const row = h('div', 'k-tenth'); row.appendChild(cells[9]); board.appendChild(row); }
    el.appendChild(board); if (window.MCUI) MCUI.bind(board); if (reduce) glowFrame();
    return { cells, board, tenth: cells[9] };
  }
  function ficha(el, s) { el.innerHTML = '<h3>' + esc(s.name) + '</h3>' + (s.custody || []).slice().reverse().map(c => '<p><span class="d">Día ' + c.day + ', ' + c.time + '</span><br>' + esc(c.name) + ' ' + esc(verb(c)) + '</p>').join(''); }

  /* =================================================================== Enchanted books */
  const TIER = { table: ['#071c4d', '#0c4b91', '#2777c1', '#70c9ee'], found: ['#084141', '#147e65', '#36b681', '#a9eec2'], ceiling: null, commons: ['#4c0a42', '#921e60', '#c62196', '#f3a8ca'] };
  const TIERNAME = { table: 'Mesa', found: 'Encontrado', ceiling: 'Libro de techo', commons: 'Único' };
  const TIERTXT = { table: 'Lo da una mesa de encantamiento', found: 'Solo se encuentra en el mundo', ceiling: 'Solo en libros raros: el máximo', commons: 'Solo en objetos únicos con nombre' };
  const order = ['table', 'found', 'ceiling', 'commons'];
  function bookCanvas(tier) { const c = document.createElement('canvas'); c.width = c.height = 16; c._tier = tier;
    loadImg('item/ceiling_book').then(im => { const x = c.getContext('2d'); if (!im) return; x.drawImage(im, 0, 0); if (TIER[tier]) { const d = x.getImageData(0, 0, 16, 16), p = d.data, ramp = TIER[tier];
        for (let k = 0; k < p.length; k += 4) { const r = p[k], g = p[k + 1], b = p[k + 2]; if (p[k + 3] && r > g + 25 && r > b + 15) { const l = (r + g + b) / 3, idx = l < 50 ? 0 : l < 85 ? 1 : l < 130 ? 2 : 3, q = rgb(ramp[idx]); p[k] = q[0]; p[k + 1] = q[1]; p[k + 2] = q[2]; } }
        x.putImageData(d, 0, 0); } c._base = x.getImageData(0, 0, 16, 16); }); return c; }
  const glinted = []; let bt = 0;
  if (!reduce) setInterval(() => { bt++; glinted.forEach((c, i) => { if (!c._base) return; const x = c.getContext('2d'), d = new ImageData(new Uint8ClampedArray(c._base.data), 16, 16), p = d.data, ph = (bt + i * 7) % 40;
      for (let j = 0; j < 16; j++) for (let k = 0; k < 16; k++) { const o = (j * 16 + k) * 4; if (!p[o + 3]) continue; const v = k + j - ph; if (v === 0 || v === 1) { p[o] = Math.min(255, p[o] + 90); p[o + 1] = Math.min(255, p[o + 1] + 60); p[o + 2] = Math.min(255, p[o + 2] + 120); } }
      x.putImageData(d, 0, 0); }); }, 120);
  const roman = ['I', 'II', 'III', 'IV', 'V'], srcCol = { table: 'var(--tier-table)', found: 'var(--tier-found)', ceiling: 'var(--tier-ceiling)', commons: 'var(--tier-commons)' };
  function wrapLines(s, n) { const out = []; let cur = ''; s.split(' ').forEach(w => { if ((cur + ' ' + w).trim().length > n) { out.push(cur.trim()); cur = w; } else cur += ' ' + w; }); if (cur.trim()) out.push(cur.trim()); return out; }
  function Books(el, opts) { opts = opts || {}; el.innerHTML = ''; glinted.length = 0;
    const leg = h('div', 'k-legend'); order.forEach(t => { const s = h('span'); const c = bookCanvas(t); s.appendChild(c); s.insertAdjacentHTML('beforeend', '<span><span style="color:' + srcCol[t] + '">' + TIERNAME[t] + '</span>: ' + TIERTXT[t] + '</span>'); leg.appendChild(s); });
    if (opts.legend !== false) el.appendChild(leg);
    const note = h('div', 'k-line k-sh', 'El color del libro dice de dónde sale su nivel más alto.'); note.style.margin = '0 0 24px'; if (opts.legend !== false) el.appendChild(note);
    const g = h('div', 'k-books'); ((opts.data && opts.data.enchantments) || []).forEach(e => { const top = e.levels.reduce((a, l) => order.indexOf(l.source) > order.indexOf(a) ? l.source : a, 'table');
      const b = h('button', 'k-book'); const c = bookCanvas(top); glinted.push(c); b.appendChild(c); if (opts.names !== false) b.insertAdjacentHTML('beforeend', '<span>' + esc(e.name) + '</span>');
      b.dataset.tip = esc(e.name) + '|' + wrapLines(esc(e.description || ''), 34).join('|') + '|' + e.levels.map(l => '<span style="color:' + srcCol[l.source] + '">' + (roman[l.level - 1] || l.level) + ' ' + TIERNAME[l.source] + '</span>').join('|');
      b.dataset.tc = '#ffff55'; b.dataset.tf = '#3e127f'; b.setAttribute('aria-label', e.name); g.appendChild(b); });
    el.appendChild(g); if (window.MCUI) MCUI.bind(el); }

  /* =================================================================== heads (from a skin) */
  function headCanvas(name, size) { const c = document.createElement('canvas'); c.width = c.height = 8; const x = c.getContext('2d');
    let hsh = 0; for (const ch of name || 'x') hsh = (hsh * 31 + ch.charCodeAt(0)) >>> 0;
    const skins = ['#d27f3b', '#a3582b', '#ea9955', '#7d2e1a', '#e38847'], hairs = ['#3c0a08', '#681704', '#190b12', '#b76e17', '#900e0e', '#3b3a56'], eyes = ['#1a46a6', '#127f4d', '#5b1a11', '#65127f'];
    const sk = skins[hsh % 5], hr = hairs[(hsh >> 3) % 6], ey = eyes[(hsh >> 6) % 4], f = (cc, a, b, w, hh) => { x.fillStyle = cc; x.fillRect(a, b, w, hh); };
    if (!name) { f('#261825', 0, 0, 8, 8); f('#120b12', 1, 2, 6, 6); f('#44283d', 0, 0, 8, 2); f('#44283d', 0, 2, 1, 5); f('#44283d', 7, 2, 1, 5); f('#8e7a57', 2, 4, 1, 1); f('#8e7a57', 5, 4, 1, 1); }
    else { f(sk, 0, 0, 8, 8); f(hr, 0, 0, 8, 2); f(hr, 0, 2, 1, 2 + (hsh & 1)); f(hr, 7, 2, 1, 2); f('#fff', 1, 4, 2, 1); f('#fff', 5, 4, 2, 1); f(ey, 2, 4, 1, 1); f(ey, 5, 4, 1, 1); f('#7f1812', 3, 6, 2, 1); }
    if (size) { c.style.width = c.style.height = size + 'px'; } return c; }

  /* =================================================================== side books */
  const BOOKS = [];
  function SideBook(opts) { const side = opts.side || 'right', tabs = h('div', 'k-tabs ' + side); document.body.appendChild(tabs);
    const sb = h('div', 'k-sb ' + side); sb.setAttribute('role', 'dialog'); sb.setAttribute('aria-modal', 'false'); document.body.appendChild(sb);
    const cover = h('div', 'k-cover'); sb.appendChild(cover); let cur = null;
    function close() { if (!cur) return; sb.classList.remove('open'); tabs.style[side] = ''; tabs.querySelectorAll('.k-tab').forEach(t => t.setAttribute('aria-expanded', 'false')); cur = null;
      BOOKS.forEach(o => { o.tabs.style.visibility = ''; }); }
    const me = { close, tabs, panel: sb }; BOOKS.push(me);
    opts.tabs.forEach(tb => { const b = h('button', 'k-tab'); b.style.setProperty('--c', tb.color || '#6b0423'); b.setAttribute('aria-expanded', 'false');
      const ic = tb.icon ? texImg(tb.icon, 32, tb.fallback) : null; if (ic) b.appendChild(ic); b.insertAdjacentHTML('beforeend', '<span class="lb">' + tb.label + '</span>');
      b.onclick = () => { if (cur === tb) return close(); BOOKS.forEach(o => { if (o !== me) { o.close(); o.tabs.style.visibility = 'hidden'; } }); cur = tb; tabs.querySelectorAll('.k-tab').forEach(t => t.setAttribute('aria-expanded', t === b)); cover.innerHTML = ''; tb.render(cover, close);
        const x = h('button', 'k-btn k-x', 'x'); x.setAttribute('aria-label', 'Cerrar'); x.onclick = close; cover.appendChild(x); sb.classList.add('open'); if (side !== 'bottom') tabs.style[side] = sb.offsetWidth + 'px'; else tabs.style.bottom = sb.offsetHeight + 'px'; if (window.MCUI) MCUI.bind(cover); };
      tabs.appendChild(b); });
    addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    return me; }

  /* the wall, as an atlas */
  function heartIcon(on) { return pix(['.kk.kk.', 'kRRkRRk', 'kRRRRRk', '.kRRRk.', '..kRk..', '...k...'], { k: '#4c120b', R: on ? '#b30713' : '#dcba63' }); }
  function bubbleIcon() { return pix(['.kkkkk.', 'kwwwwwk', 'kwwwwwk', '.kkkkwk', '....kk.'], { k: '#4c120b', w: '#f2dea9' }); }
  function rose() { return pix(['.....k.....', '....kwk....', '....kwk....', '...kwwwk...', '.kk.kwk.kk.', 'kwwwwkwwwwk', '.kk.kwk.kk.', '...kwwwk...', '....kwk....', '....kwk....', '.....k.....'], { k: '#5e1808', w: '#ca9c4c' }); }

  /* =================================================================== items: textures, names, tooltips */
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const MOD_TEX = { activation_core: 'item/molten_core', devils_compass: 'item/devils_compass/closed', berserker: 'item/berserker_ready', xp_crystal: 'item/xp_crystal_0',
    clue_compass: 'item/clue_compass/structures_compass_00', hollow_relic: 'item/hollow_relic' };
  const FALLBACK = [[/sword|scythe/, 'sword'], [/pickaxe/, 'pickaxe'], [/_axe$/, 'axe'], [/helmet|chestplate|mask/, 'chestplate'], [/leggings/, 'leggings'], [/boots/, 'boots'],
    [/crossbow/, 'crossbow'], [/bow|musket/, 'bow'], [/book|tome/, 'book'], [/torch/, 'torch'], [/apple|heart/, 'heart'], [/xp_|experience/, 'xp'], [/core/, 'molten_core']];
  const NAMECOL = { 'auyamaland:activation_core': '#FF8A2B', 'auyamaland:quartz_lapis': '#5B8CFF', 'minecraft:diamond': '#5FE3E3', 'minecraft:diamond_block': '#5FE3E3',
    'minecraft:gold_ingot': '#FFE066', 'minecraft:golden_apple': '#FFE066', 'auyamaland:xp_tome': '#80FF20', 'auyamaland:xp_crystal': '#80FF20',
    'minecraft:blaze_rod': '#FFB347', 'minecraft:blaze_powder': '#FFB347', 'minecraft:nether_wart': '#7A1641' };
  const CURSED = ['breach_sword', 'consecutive_sword', 'raiders_axe', 'phase_pickaxe', 'nightstalker_helmet', 'close_bow', 'heavy_boots', 'reapers_scythe', 'mask'];
  const LANG = { mc: null, mod: null };
  const langReady = Promise.all([['mc', 'lang/minecraft.json'], ['mod', 'lang/auyamaland.json']].map(([k, u]) => fetch(u).then(r => r.ok ? r.json() : null).then(j => { LANG[k] = j; }).catch(() => {})));
  function itemTextures(id) { const [ns, path] = id.includes(':') ? id.split(':') : ['minecraft', id];
    if (ns === 'auyamaland') return [MOD_TEX[path] || 'item/' + path];
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
  /* one inventory slot; ench: the enchantments document (for names and the ceiling book) */
  function slot(it, ench) { const s = h('span', 'k-slot'); if (!it) return s;
    const tex = it.id === 'minecraft:enchanted_book' && isCeiling(it, ench) ? ['item/ceiling_book', 'minecraft/item/enchanted_book'] : itemTextures(it.id);
    s.appendChild(texAny(tex, 32, itemFallback(it.id))); if (it.count > 1) s.appendChild(h('span', 'n', it.count));
    const col = itemColour(it, ench), lines = [(col ? '' : '') + esc(itemName(it))];
    (it.enchantments || []).forEach(e => lines.push('<span style="color:#aaaaaa">' + esc(enchName(e.id, ench)) + ' ' + (ROMAN[e.level - 1] || e.level) + '</span>'));
    if (it.max_damage) lines.push('<span style="color:#aaaaaa">Durabilidad: ' + (it.max_damage - (it.damage || 0)) + ' / ' + it.max_damage + '</span>');
    s.dataset.tip = lines.join('|'); s.dataset.tc = col || '#ffffff'; if (col) s.dataset.tf = col; return s; }

  /* =================================================================== heads from a skin */
  function skinHead(url, size, name) { const c = document.createElement('canvas'); c.width = c.height = 8; c.style.width = c.style.height = size + 'px'; c.className = 'k-px';
    const x = c.getContext('2d'); x.drawImage(headCanvas(name || ''), 0, 0);
    if (url) { const im = new Image(); im.crossOrigin = 'anonymous'; im.onload = () => { x.clearRect(0, 0, 8, 8); x.drawImage(im, 8, 8, 8, 8, 0, 0, 8, 8); x.drawImage(im, 40, 8, 8, 8, 0, 0, 8, 8); }; im.src = url; }
    return c; }

  window.KIT = { Scene, Season, Relics, ficha, Books, SideBook, slot, itemName, texImg, texAny, headCanvas, skinHead, pix, heartIcon, bubbleIcon, rose, wrapLines, esc, h, TH, RELIC, cssv, langReady };
})();
