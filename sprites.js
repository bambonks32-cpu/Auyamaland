/* Pixel sprites.
   Every sprite first tries textures/<path>.png (the same paths as the mod's assets/auyamaland/textures),
   so dropping a PNG into the site's textures folder replaces the drawing below without touching code.
   The drawings are placeholders. */
(function () {
  const D = {};
  function def(name, path, pal, rows) { D[name] = { path, pal, rows }; }

  const SK = { k: '#1b1020' };
  def('wanderer', 'item/wanderer', { ...SK, G: '#b8782a', y: '#ffd35a', w: '#fff3c4' }, [
    '................', '...kkkkkkkkkk...', '...kGGGGGGGGk...', '....kyyyyyyk....', '....kwyyyywk....', '.....kwyywk.....',
    '......kwyk......', '.......kk.......', '......kw.k......', '.....kw.y.k.....', '....kw.yyy.k....', '....kwyyyyyk....',
    '...kGGGGGGGGk...', '...kkkkkkkkkk...', '................', '................']);
  def('stalker', 'item/stalker', { ...SK, p: '#3d2a6b', P: '#5b3fa3', G: '#7dff6b' }, [
    '................', '......kkkk......', '....kkppppkk....', '...kppPPPPppk...', '..kpPPkkkkPPpk..', '..kpPkkkkkkPpk..',
    '.kpPkkGkkGkkPpk.', '.kpPkkkkkkkkPpk.', '.kpPkkkkkkkkPpk.', '.kpPPkkkkkkPPpk.', '.kppPPPkkPPPppk.', '..kppPPPPPPppk..',
    '..kpppppppppk...', '...kkpppppkk....', '.....kkkkk......', '................']);
  def('devils_compass', 'item/devils_compass/closed', { ...SK, G: '#e0a030', w: '#fff1d6', r: '#ff3b1f', b: '#4a3a5a' }, [
    '................', '.....kkkkkk.....', '...kkGGGGGGkk...', '..kGGwwwwwwGGk..', '..kGwwwwwrwwGk..', '.kGwwwwwrrwwwGk.',
    '.kGwwwwrrwwwwGk.', '.kGwwwwkkwwwwGk.', '.kGwwwwkkwwwwGk.', '.kGwwwbbwwwwwGk.', '.kGwwwbbwwwwwGk.', '..kGwbwwwwwwGk..',
    '..kGGwwwwwwGGk..', '...kkGGGGGGkk...', '.....kkkkkk.....', '................']);
  def('disabler', 'item/disabler', { ...SK, t: '#1a8fb0', T: '#3fd6f0', w: '#ffffff' }, [
    '................', '.....kkkkkk.....', '...kkttttttkk...', '..kttTTTTTTttk..', '..ktTTwTTTTTtk..', '.ktTTTwwTTTTTtk.',
    '.ktTTTTwTTTTTtk.', '.ktTTTTwwTTTTtk.', '.ktTTTTTwwTTTtk.', '.ktTTTTTTwTTTtk.', '.ktTTTTTTwwTTtk.', '..ktTTTTTTwTtk..',
    '..kttTTTTTTttk..', '...kkttttttkk...', '.....kkkkkk.....', '................']);
  const skull = ['................', '....kkkkkkkk....', '...kwwwwwwwwk...', '..kwwwwwwwwwwk..', '..kwwwwwwwwwgk..', '..kwkkkwwkkkgk..',
    '..kwkekwwkekgk..', '..kwkkkwwkkkgk..', '..kwwwwkkwwwgk..', '...kwwwwwwwgk...', '....kwkwkwkk....', '....kwkwkwk.....',
    '.....kkkkk......', '................', '................', '................'];
  def('dark_skull', 'item/dark_skull', { ...SK, w: '#5e5672', g: '#3b3549', e: '#ff2a2a' }, skull);
  def('light_skull', 'item/light_skull', { ...SK, w: '#f3ead2', g: '#c9b68c', e: '#ff8a1c' }, skull);
  def('second_life', 'item/second_life', { ...SK, r: '#b0123f', R: '#ff3d6e', w: '#ffd1de', d: '#6e0a29' }, [
    '.......kk.......', '......krrk......', '.....krRRrk.....', '....krRwRRrk....', '....krRwRRrk....', '...krRwRRRRrk...',
    '...krRRRRRRrk...', '...krRRRRRRrk...', '...krRRRRRdrk...', '....krRRRddrk...', '....krRRdddk....', '.....krdddk......',
    '......kddk......', '.......kk.......', '................', '................']);
  def('berserker', 'item/berserker_ready', { ...SK, h: '#efe0b8', s: '#7a8a96', S: '#b8c4cc', r: '#ff2020' }, [
    '................', '.h............h.', '.hh..........hh.', '..hh.kkkkkk.hh..', '...hksSSSSskh...', '...ksSSSSSSsk...',
    '..ksSSSSSSSSsk..', '..ksSkkkkkkSsk..', '..ksSkrkkrkSsk..', '..ksSkkkkkkSsk..', '..ksSSSkkSSSsk..', '..kssSSkkSSssk..',
    '...kkssssssk....', '.....kkkkkk.....', '................', '................']);
  def('blood_pact', 'item/blood_pact', { ...SK, P: '#f2dcae', p: '#cba56a', r: '#c4102a' }, [
    '................', '..........kkk...', '.........kPPPk..', '........kPPPpk..', '.......kPPPpk...', '......kPPPpk....',
    '.....kPPPpk.....', '....kPrPpk......', '...kPPrrk.......', '..kPPpkr........', '..kPpk.rr.......', '..kkk...r.......',
    '.........r......', '................', '................', '................']);
  def('molten_core', 'item/molten_core', { ...SK, s: '#3a3036', o: '#ff7a1a', y: '#ffd040' }, [
    '................', '....kkkkkkkk....', '...kssssssssk...', '..ksssosssosk...', '..kssoosssoosk..', '..ksosyosoyosk..',
    '..ksssooyoossk..', '..ksssssosssk...', '..kssosssssosk..', '..ksoyossosyok..', '...ksoossoosk...', '....kkkkkkkk....',
    '................', '................', '................', '................']);
  def('pumpkin', '', { ...SK, O: '#ff8a1c', o: '#d9590b', g: '#3f9a2c', y: '#ffe25a' }, [
    '................', '.......kk.......', '.......kgk......', '....kkkkgkkkk...', '...kOOoOOoOOk...', '..kOOoOOOOoOOk..',
    '..kOoOOOOOOoOk..', '.kOOoOyOOyOoOOk.', '.kOOoyyOOyyoOOk.', '.kOOoOOOOOOoOOk.', '.kOOoyOyyOyoOOk.', '..kOoOyyyyOoOk..',
    '..kOOoOOOOoOOk..', '...kkOOoOOOkk...', '.....kkkkkk.....', '................']);
  def('torch', '', { ...SK, y: '#ffe25a', O: '#ff8a1c', b: '#8a5a2b' }, [
    '................', '.......y........', '......yOy.......', '......OOO.......', '......kOk.......', '......kbk.......',
    '......kbk.......', '......kbk.......', '......kbk.......', '......kbk.......', '......kbk.......', '......kkk.......',
    '................', '................', '................', '................']);
  def('chest', '', { ...SK, b: '#8a5a2b', B: '#c48a45', y: '#ffd35a' }, [
    '................', '................', '..kkkkkkkkkkkk..', '..kbbbbbbbbbbk..', '..kbBBBBBBBBbk..', '..kbBBBBBBBBbk..',
    '..kkkkkyykkkkk..', '..kbBBByyBBBbk..', '..kbBBBBBBBBbk..', '..kbBBBBBBBBbk..', '..kbBBBBBBBBbk..', '..kbbbbbbbbbbk..',
    '..kkkkkkkkkkkk..', '................', '................', '................']);
  def('heart', '', { ...SK, R: '#ff2a4a', w: '#ffc2cc' }, [
    '................', '................', '...kk....kk.....', '..kRRk..kRRk....', '.kRwRRkkRRRRk...', '.kRwRRRRRRRRk...',
    '.kRRRRRRRRRRk...', '..kRRRRRRRRk....', '...kRRRRRRk.....', '....kRRRRk......', '.....kRRk.......', '......kk........',
    '................', '................', '................', '................']);
  def('book', '', { ...SK, b: '#5a2d8a', B: '#8a4fd0', w: '#fff3dc', y: '#ffd35a' }, [
    '................', '..kkkkkkkkkkk...', '..kbBBBBBBBBk...', '..kbByyByBBBk...', '..kbBBBBBBBBk...', '..kbByBByyBBk...',
    '..kbBBBBBBBBk...', '..kbBBBBBBBBk...', '..kbBBBBBBBBk...', '..kbBBBBBBBBk...', '..kbkkkkkkkkk...', '..kbwwwwwwwwk...',
    '..kkkkkkkkkkk...', '................', '................', '................']);
  def('sword', '', { ...SK, w: '#e8f8ff', c: '#5fe3e3', b: '#8a5a2b' }, [
    '..............kk', '.............kwk', '............kwck', '...........kwck.', '..........kwck..', '.........kwck...',
    '........kwck....', '..kk...kwck.....', '..kck.kwck......', '...kckwck.......', '....kcck........', '...kbkkck.......',
    '..kbk..kk.......', '.kbk............', 'kkk.............', '................']);
  def('xp', '', { ...SK, g: '#80ff20', G: '#3aa010', y: '#fff36a' }, [
    '................', '................', '................', '.....kkkkkk.....', '....kgggyggk....', '...kgGggggggk...',
    '...kggggggggk...', '...kggggggGgk...', '...kgggggGggk...', '....kgGGGggk....', '.....kkkkkk.....', '................',
    '................', '................', '................', '................']);

  const TL = { ...SK, c: '#5fe3e3', C: '#c8faff', b: '#8a5a2b', w: '#efe6d0' };
  def('pickaxe', '', TL, ['................', '....kkkkkk......', '...kCcccccck....', '....kkkkkcck....', '.......kbkcck...', '......kbk.kck...',
    '.....kbk...kk...', '....kbk.........', '...kbk..........', '..kbk...........', '.kbk............', '.kk.............', '................', '................', '................', '................']);
  def('axe', '', TL, ['................', '.......kkk......', '......kCcck.....', '.....kccccck....', '.....kcckbk.....', '......kkbk......',
    '......kbk.......', '.....kbk........', '....kbk.........', '...kbk..........', '..kbk...........', '..kk............', '................', '................', '................', '................']);
  def('chestplate', '', TL, ['................', '..kkk....kkk....', '.kcck....kcck...', '.kcckkkkkkcck...', '.kcCccccccccck..', '.kkcccccccckk...',
    '..kcccccccck....', '..kcccccccck....', '..kcccccccck....', '..kcccccccck....', '..kkkkkkkkkk....', '................', '................', '................', '................', '................']);
  def('leggings', '', TL, ['................', '...kkkkkkkk.....', '...kCcccccck....', '...kcccccck.....', '...kccckcck.....', '...kcck.kcck....',
    '...kcck.kcck....', '...kcck.kcck....', '...kcck.kcck....', '...kkkk.kkkk....', '................', '................', '................', '................', '................', '................']);
  def('boots', '', TL, ['................', '................', '.kkk.....kkk....', '.kck.....kck....', '.kCk.....kCk....', '.kcckk...kcckk..',
    '.kcccck..kcccck.', '.kkkkkk..kkkkkk.', '................', '................', '................', '................', '................', '................', '................', '................']);
  def('bow', '', TL, ['..........kkkk..', '........kkbbbk..', '.......kbkk.kw..', '......kbk...kw..', '.....kbk...kw...', '.....kbk..kw....',
    '....kbk..kw.....', '...kbk..kw......', '...kbk.kw.......', '..kbbkkw........', '..kkkkw.........', '..kw............', '................', '................', '................', '................']);
  def('crossbow', '', TL, ['................', '..kkkkkkkkkkkk..', '.kbbbbbbbbbbbbk.', '..kkw.kbk.wkk...', '.....wkbkw......', '......kbk.......',
    '......kbk.......', '......kbk.......', '.....kkkkk......', '................', '................', '................', '................', '................', '................', '................']);

  const cache = {};
  function draw(name) {
    if (cache[name]) return cache[name];
    const d = D[name]; const c = document.createElement('canvas'); c.width = 16; c.height = 16;
    const x = c.getContext('2d');
    d.rows.forEach((row, y) => { for (let i = 0; i < 16; i++) { const ch = row[i]; if (ch && ch !== '.' && ch !== ' ' && d.pal[ch]) { x.fillStyle = d.pal[ch]; x.fillRect(i, y, 1, 1); } } });
    return (cache[name] = c.toDataURL());
  }
  /* An <img> for a sprite: the site's own texture if the folder has one, else the drawing. */
  function img(name, size, cls) {
    const el = new Image(); el.width = size || 32; el.height = size || 32; el.alt = '';
    el.className = 'px ' + (cls || ''); el.draggable = false;
    const d = D[name];
    if (d && d.path) { el.src = 'textures/' + d.path + '.png'; el.onerror = () => { el.onerror = null; el.src = draw(name); }; }
    else el.src = d ? draw(name) : '';
    return el;
  }
  /* Any texture by path, e.g. 'item/sheet_2' (the owner's art copied into textures/). */
  function tex(path, size, cls) {
    const el = new Image(); el.width = size || 32; el.height = size || 32; el.alt = ''; el.className = 'px ' + (cls || '');
    el.draggable = false; el.src = 'textures/' + path + '.png'; return el;
  }
  window.SPR = { img, tex, url: draw, names: Object.keys(D) };
})();
