/* The colour panel. Open the site with ?colores at the end of the address. Every colour of theme.css gets a picker;
   changes show at once (drawn pieces such as the season markers follow on the next reload). "Copiar" copies a whole
   new theme.css to paste over the old one; "Descargar" saves it as a file. Typing the word colores anywhere on the page
   (outside a text box) opens it too. */
(function () {
  let typed = '', opened = false;
  addEventListener('keydown', e => { if (opened || /INPUT|TEXTAREA/.test(e.target.tagName) || e.key.length !== 1) return; typed = (typed + e.key.toLowerCase()).slice(-7); if (typed === 'colores') open(); });
  if (/colores/.test(location.search + location.hash)) open();
  function open() { opened = true;
  const st = document.createElement('style');
  st.textContent = `.tune{position:fixed;z-index:200;right:16px;top:16px;bottom:16px;width:320px;max-width:calc(100vw - 32px);display:flex;flex-direction:column;
    background:#100a10;color:#ece0c6;font-family:MC,monospace;font-size:16px;line-height:20px;box-shadow:0 0 0 2px #000,inset 0 0 0 2px #3b2a3b,8px 8px 0 rgba(0,0,0,.5)}
    .tune header{display:flex;justify-content:space-between;align-items:center;padding:16px;gap:8px}
    .tune .list{flex:1;overflow:auto;padding:0 16px}
    .tune .grp{color:#e2b65e;margin:16px 0 8px}
    .tune label{display:grid;grid-template-columns:32px 1fr;gap:8px;align-items:center;margin-bottom:8px;cursor:pointer}
    .tune input[type=color]{width:32px;height:32px;padding:0;border:0;background:none;cursor:pointer}
    .tune small{display:block;color:#9a8a7a;font-size:16px}
    .tune .bar{display:flex;gap:8px;flex-wrap:wrap;padding:16px;box-shadow:inset 0 2px 0 #3b2a3b}
    .tune button{font:inherit;color:#ece0c6;background:#3b2a3b;border:0;padding:8px;cursor:pointer}
    .tune button:hover{background:#563d56}
    .tune .msg{color:#5fdba9;min-height:20px;padding:0 16px 16px}
    .tune.min .list,.tune.min .bar,.tune.min .msg{display:none}.tune.min{bottom:auto}`;
  document.head.appendChild(st);
  const root = document.documentElement;
  fetch('theme.css').then(r => r.text()).catch(() => '').then(text => {
    const rows = []; let grp = '';
    text.split('\n').forEach(l => { const g = l.match(/^\s*\/\*\s*([^*]+?)\s*\*\/\s*$/); if (g && !/^Auyamaland/.test(g[1])) grp = g[1];
      const m = l.match(/^\s*(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;\s*(?:\/\*\s*(.*?)\s*\*\/)?/); if (m) rows.push({ name: m[1], value: m[2], note: m[3] || '', grp }); });
    if (!rows.length) return;
    const p = document.createElement('div'); p.className = 'tune'; p.innerHTML = '<header><span>Colores</span><button type="button" data-a="min">_</button></header><div class="list"></div><div class="bar">' +
      '<button type="button" data-a="copy">Copiar theme.css</button><button type="button" data-a="save">Descargar</button><button type="button" data-a="reset">Deshacer todo</button></div><div class="msg" role="status"></div>';
    document.body.appendChild(p); const list = p.querySelector('.list'), msg = p.querySelector('.msg'); let last = '';
    rows.forEach(r => { if (r.grp !== last) { last = r.grp; list.insertAdjacentHTML('beforeend', '<div class="grp">' + r.grp + '</div>'); }
      const lab = document.createElement('label'); lab.innerHTML = '<input type="color" value="' + r.value.toLowerCase() + '"><span>' + r.name.slice(2) + (r.note ? '<small>' + r.note + '</small>' : '') + '</span>';
      const inp = lab.querySelector('input'); inp.oninput = () => { r.now = inp.value; root.style.setProperty(r.name, inp.value); }; r.inp = inp; list.appendChild(lab); });
    const out = () => { let t = text; rows.forEach(r => { if (r.now) t = t.replace(new RegExp('(' + r.name + '\\s*:\\s*)#[0-9a-fA-F]{6}'), '$1' + r.now); }); return t; };
    p.querySelector('header').onclick = e => { if (e.target.dataset.a === 'min') p.classList.toggle('min'); };
    p.querySelector('.bar').onclick = async e => { const a = e.target.dataset.a; if (!a) return;
      if (a === 'copy') { try { await navigator.clipboard.writeText(out()); msg.textContent = 'Copiado. Pégalo sobre theme.css.'; }
        catch (_) { const ta = document.createElement('textarea'); ta.value = out(); document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); msg.textContent = 'Copiado. Pégalo sobre theme.css.'; } catch (__) { msg.textContent = 'No se pudo copiar: usa Descargar.'; } ta.remove(); } }
      if (a === 'save') { const u = URL.createObjectURL(new Blob([out()], { type: 'text/css' })), l = document.createElement('a'); l.href = u; l.download = 'theme.css'; document.body.appendChild(l); l.click(); l.remove(); msg.textContent = 'Guardado como theme.css.'; }
      if (a === 'reset') { rows.forEach(r => { r.now = null; r.inp.value = r.value.toLowerCase(); root.style.removeProperty(r.name); }); msg.textContent = 'Como estaba.'; } };
  });
}
})();
