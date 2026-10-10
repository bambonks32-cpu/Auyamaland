/* A Minecraft-style map renderer. Everything is drawn on a low-resolution canvas (one map pixel = one canvas pixel)
   that the page scales up by a whole number, so nothing ever leaves the pixel grid.
   Under the announced places: blank parchment (opts.terrain false) or invented terrain (true). Nothing here is the real
   world: the season publishes no terrain. */
window.MCMap = (function () {
  const R = 4, HALF = 1152, BN = HALF * 2 / R;           /* base grid: 4 blocks a pixel */
  function hash(x, y, s) { let h = x * 374761393 + y * 668265263 + s * 1442695041; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967295; }
  function noise(x, y, s) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, f = t => t * t * (3 - 2 * t);
    const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
    return a + (b - a) * f(xf) + (c - a) * f(yf) + (a - b - c + d) * f(xf) * f(yf); }
  const fbm = (x, y, s) => noise(x, y, s) * .62 + noise(x * 2.1, y * 2.1, s + 1) * .28 + noise(x * 4.3, y * 4.3, s + 2) * .1;
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  /* darker, quieter map colours, close to the owner's palette */
  const PAL = { water: hex('#1d3f7d'), beach: hex('#c8a261'), plains: hex('#668c2b'), forest: hex('#2e6b22'), dark: hex('#194f1f'),
    desert: hex('#cc9841'), autumn: hex('#a64f1a'), swamp: hex('#385e38'), stone: hex('#546188'), snow: hex('#cfdfe8') };
  const BIOME = ['water', 'beach', 'plains', 'forest', 'dark', 'desert', 'autumn', 'swamp', 'stone', 'snow'];
  let bio = null, hgt = null;
  function build() {
    if (bio) return; bio = new Uint8Array(BN * BN); hgt = new Float32Array(BN * BN);
    for (let j = 0; j < BN; j++) for (let i = 0; i < BN; i++) {
      const x = i / 44, y = j / 44, e = fbm(x, y, 3), m = fbm(x * .8, y * .8, 9), t = fbm(x * .5, y * .5, 17), r = Math.abs(noise(x * 1.2, y * 1.2, 31) - .5);
      let b;
      if (e < .4) b = 0; else if (e < .415) b = 1; else if (r < .012 && e < .6) b = 0;
      else if (e > .69) b = t < .43 ? 9 : 8; else if (t > .62 && m < .46) b = 5; else if (m > .66) b = 7;
      else if (t < .38) b = 6; else if (m > .54) b = 4; else if (m > .45) b = 3; else b = 2;
      const k = j * BN + i; bio[k] = b; hgt[k] = e; }
  }
  const idx = (bx, bz) => { const i = Math.floor((bx + HALF) / R), j = Math.floor((bz + HALF) / R); return (i < 0 || j < 0 || i >= BN || j >= BN) ? -1 : j * BN + i; };

  /* the border on a given night, from the season's ladder */
  const C0 = { x: 0, z: 0 }, CC = { x: -170, z: 238 };
  function borderFor(d) { if (d <= 11) return { c: C0, s: 1700 }; if (d === 12) return { c: CC, s: 1530 }; if (d === 13) return { c: CC, s: 900 }; return { c: CC, s: 100 }; }

  /* 7x7 map decorations */
  const K = '#120b12';
  const ICONS = {
    spawn: { p: { k: K, o: '#c75208', O: '#f0770a', y: '#f7ca49', g: '#317d1f' }, r: ['...g...', '.kkgkk.', 'kOoOoOk', 'kOyOyOk', 'kOOOOOk', 'kOyyyOk', '.kkkkk.'] },
    table: { p: { k: K, w: '#f3d66d', r: '#81051e', d: '#3d0626' }, r: ['.kkkkk.', 'kwwkwwk', 'kkkkkkk', 'krrrrrk', 'kdrrrdk', 'kdkkkdk', 'kk...kk'] },
    vault: { p: { k: K, b: '#8f4d17', B: '#b56b22', y: '#ec952c' }, r: ['kkkkkkk', 'kBBBBBk', 'kbbbbbk', 'kkkykkk', 'kBBBBBk', 'kbbbbbk', 'kkkkkkk'] },
    portal: { p: { k: K, p: '#52127f', P: '#8c27e0' }, r: ['kkkkkkk', 'kpPpPpk', 'kPpPpPk', 'kpPpPpk', 'kPpPpPk', 'kpPpPpk', 'kkkkkkk'] },
    drop: { p: { k: K, r: '#b30713', w: '#e7c577', y: '#ec952c' }, r: ['.rwrwr.', 'r.....r', '.r...r.', '..kkk..', '..kyk..', '..kkk..', '.......'] },
    collapse: { p: { k: K, r: '#b30713' }, r: ['rk...kr', 'krk.krk', '.krkrk.', '..krk..', '.krkrk.', 'krk.krk', 'rk...kr'] }
  };
  function icon(x, n, cx, cy) { const d = ICONS[n]; d.r.forEach((row, j) => { for (let i = 0; i < 7; i++) { const ch = row[i]; if (ch !== '.') { x.fillStyle = d.p[ch]; x.fillRect(cx - 3 + i, cy - 3 + j, 1, 1); } } }); }
  const DIRS = { north: -90, north_east: -45, east: 0, south_east: 45, south: 90, south_west: 135, west: 180, north_west: -135 };

  /* draw: view = { cx, cz, bpp } (centre in blocks, blocks a pixel); returns the markers for hit tests */
  function draw(canvas, view, opts) {
    build(); const W = canvas.width, H = canvas.height, x = canvas.getContext('2d'); const img = x.createImageData(W, H), D = img.data;
    const L = opts.data || {}, show = opts.show || {}, T = opts.t || {}, B = L.border || { center_x: 0, center_z: 0, size: 1700 }, bd = opts.border || { c: { x: B.center_x, z: B.center_z }, s: B.size };
    const paper = !opts.terrain, P0 = hex('#d8bf8c'), P1 = hex('#c9ab73'), P2 = hex('#b8955c');
    const bx0 = view.cx - W / 2 * view.bpp, bz0 = view.cz - H / 2 * view.bpp;
    const bL = bd.c.x - bd.s / 2, bR = bd.c.x + bd.s / 2, bT = bd.c.z - bd.s / 2, bB = bd.c.z + bd.s / 2;
    const wedges = show.wedges === false ? [] : (L.unseals || []).map(u => ({ ...u, col: hex('#ec952c') })).concat((L.traps || []).map(u => ({ ...u, col: hex('#b30713') })));
    const edge = opts.edge || hex('#765b3f');
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const bx = bx0 + (i + .5) * view.bpp, bz = bz0 + (j + .5) * view.bpp, k = idx(bx, bz), o = (j * W + i) * 4;
      let c;
      if (k < 0) c = edge; else if (paper) { const n = hgt[k], d = ((i * 3 + j * 5) & 3); const q = hash(i + Math.round(bx0 / view.bpp), j + Math.round(bz0 / view.bpp), 5); c = q < .04 ? P2 : q < .16 || (n > .58 && d === 0) ? P1 : P0; } else {
        const b = bio[k], e = hgt[k];
        if (b === 0) { const depth = .4 - e; const base = PAL.water; const sh = depth > .08 ? .72 : depth > .03 ? ((i + j) & 1 ? .72 : .86) : .86; c = [base[0] * sh, base[1] * sh, base[2] * sh]; }
        else { const kn = idx(bx, bz - view.bpp), en = kn < 0 ? e : hgt[kn], d = e - en, sh = d > .004 ? 1 : d < -.004 ? .74 : .87; const base = PAL[BIOME[b]]; c = [base[0] * sh, base[1] * sh, base[2] * sh]; }
      }
      /* outside the border: dithered dark */
      if (show.border !== false && (bx < bL || bx > bR || bz < bT || bz > bB)) { if ((i + j) & 1) c = [c[0] * .35 + 20, c[1] * .3 + 12, c[2] * .35 + 22]; else c = [c[0] * .6, c[1] * .55, c[2] * .6]; }
      /* wedges: direction only, dithered */
      for (const w of wedges) { const dx = bx - w.from.x, dz = bz - w.from.z, dist = Math.hypot(dx, dz);
        const r0 = w.distance === 'near' ? 0 : w.distance === 'far' ? 700 : 300, r1 = w.distance === 'near' ? 300 : w.distance === 'far' ? 1200 : 700;
        if (dist < r0 || dist > r1) continue; let a = Math.atan2(dz, dx) * 180 / Math.PI - DIRS[w.direction]; a = ((a + 540) % 360) - 180;
        if (Math.abs(a) <= 22.5 && ((i + j) % 3 === 0)) c = w.col; }
      D[o] = c[0]; D[o + 1] = c[1]; D[o + 2] = c[2]; D[o + 3] = 255; }
    x.putImageData(img, 0, 0);
    const sp = (bx, bz) => [Math.round((bx - bx0) / view.bpp), Math.round((bz - bz0) / view.bpp)];
    /* border line, dashed on the grid */
    if (show.border !== false) { const [l, t] = sp(bL, bT), [r, b] = sp(bR, bB); x.fillStyle = '#ca0808';
      const off = opts.dash || 0;
      for (let i = l; i <= r; i++) if (((i + off) >> 1) & 1) { x.fillRect(i, t, 1, 1); x.fillRect(i, b, 1, 1); }
      for (let j = t; j <= b; j++) if (((j + off) >> 1) & 1) { x.fillRect(l, j, 1, 1); x.fillRect(r, j, 1, 1); } }
    const marks = [];
    const put = (n, bx, bz, title, lines, col) => { const [px, py] = sp(bx, bz); if (px < -4 || py < -4 || px > W + 4 || py > H + 4) return; icon(x, n, px, py); marks.push({ x: px, y: py, title, lines, col }); };
    const mesas = T.mesas || {}, tm = T.time || (v => v), dirs = T.dirs || {}, biome = T.biome || (b => b);
    if (show.tables !== false) (L.tables || []).forEach(t => { const br = (L.braziers || []).filter(b => b.table === t.id).map(b => 'Brasero entregado el día ' + b.day);
      put('table', t.x, t.z, mesas[t.id] || 'Una mesa', [t.x + ', ' + t.z, 'Mesa de encantamiento'].concat(br), '#cf7711'); });
    if (show.spawn !== false && L.spawn) put('spawn', L.spawn.x, L.spawn.z, 'Spawn', [L.spawn.x + ', ' + L.spawn.z], '#f0770a');
    if (show.vault !== false && L.vault) put('vault', L.vault.x, L.vault.z, 'La bóveda', [L.vault.x + ', ' + L.vault.z, 'Se llena los días 4, 8 y 12'], '#ec952c');
    if (show.portal !== false && L.portal) put('portal', L.portal.x, L.portal.z, 'El portal', [L.portal.x + ', ' + L.portal.z, L.portal.open ? 'Abierto' : 'Cerrado'], '#8c27e0');
    if (show.drops !== false) (L.airdrops || []).forEach(d => put('drop', d.x, d.z, 'Cargamento', [d.x + ', ' + d.z, d.landed ? 'Ya cayó' : 'Cae a las ' + tm(d.lands)], '#b30713'));
    if (show.border !== false && L.collapse) put('collapse', L.collapse.x, L.collapse.z, 'El colapso', [L.collapse.x + ', ' + L.collapse.z, 'Hacia aquí se derrumba el mundo'], '#ca0808');
    if (show.wedges !== false) wedges.forEach(w => { const a = DIRS[w.direction] * Math.PI / 180, r = (w.distance === 'near' ? 150 : w.distance === 'far' ? 900 : 500);
      const [px, py] = sp(w.from.x + Math.cos(a) * r, w.from.z + Math.sin(a) * r);
      marks.push({ x: px, y: py, title: w.col[0] > 150 ? 'Una trampa' : 'Un sello roto', lines: ['Día ' + w.day, (w.distance === 'far' ? 'Muy al ' : w.distance === 'near' ? 'Justo al ' : 'Al ') + (dirs[w.direction] || w.direction) + ' del spawn', 'En ' + biome(w.biome)], col: w.col[0] > 150 ? '#b30713' : '#ec952c', r: 8 }); });
    return marks;
  }
  function toBlock(canvas, view, px, py) { return [view.cx + (px - canvas.width / 2) * view.bpp, view.cz + (py - canvas.height / 2) * view.bpp]; }
  return { draw, borderFor, toBlock, CC };
})();
