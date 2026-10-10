/* Minecraft-style tooltips for any element with data-tip="Title|line|line" (data-tc: title colour, data-tf: frame colour). */
window.MCUI = (function () {
  const st = document.createElement('style');
  st.textContent = `.mctip{position:fixed;z-index:999;pointer-events:none;display:none;font-family:MC,monospace;font-size:16px;line-height:20px;-webkit-font-smoothing:none;
    padding:6px 10px 8px;background:rgba(16,0,16,.95);color:#aaaaaa;max-width:360px;
    box-shadow:inset 0 0 0 2px rgba(16,0,16,.95),inset 0 0 0 4px var(--tf,#5000ff);
    clip-path:polygon(2px 0,calc(100% - 2px) 0,100% 2px,100% calc(100% - 2px),calc(100% - 2px) 100%,2px 100%,0 calc(100% - 2px),0 2px)}
  .mctip b{display:block;font-weight:400;color:var(--tc,#fff);margin-bottom:2px}`;
  document.head.appendChild(st);
  const el = document.createElement('div'); el.className = 'mctip'; el.setAttribute('role', 'tooltip');
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(el)); if (document.body) document.body.appendChild(el);
  function show(x, y, title, lines, o) { o = o || {}; el.innerHTML = '<b>' + title + '</b>' + (lines || []).map(l => '<div>' + l + '</div>').join('');
    el.style.setProperty('--tc', o.tc || '#ffffff'); el.style.setProperty('--tf', o.tf || '#4b2a7a'); el.style.display = 'block'; move(x, y); }
  function move(x, y) { const w = el.offsetWidth, h = el.offsetHeight; let l = x + 18, t = y - 14;
    if (l + w > innerWidth - 6) l = x - w - 12; if (t + h > innerHeight - 6) t = innerHeight - h - 6; if (t < 6) t = 6;
    el.style.left = (Math.round(l / 2) * 2) + 'px'; el.style.top = (Math.round(t / 2) * 2) + 'px'; }
  function hide() { el.style.display = 'none'; }
  function bind(root) { (root || document).querySelectorAll('[data-tip]').forEach(n => { if (n._tb) return; n._tb = 1;
    const go = e => { const [t, ...ls] = n.dataset.tip.split('|'); show(e.clientX, e.clientY, t, ls, { tc: n.dataset.tc, tf: n.dataset.tf }); };
    n.addEventListener('mouseenter', go); n.addEventListener('mousemove', e => move(e.clientX, e.clientY)); n.addEventListener('mouseleave', hide);
    n.addEventListener('focus', () => { const r = n.getBoundingClientRect(); go({ clientX: r.right, clientY: r.top }); }); n.addEventListener('blur', hide); }); }
  return { show, move, hide, bind };
})();
