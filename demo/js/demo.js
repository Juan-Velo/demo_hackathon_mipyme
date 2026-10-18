/* ---------- utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
let SPEED = 1;
const sleep = ms => new Promise(r => setTimeout(r, ms * SPEED));
const rnd = (a, b) => a + Math.random() * (b - a);
const hex = n => [...Array(n)].map(() => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]).join('');
const wamid = () => 'wamid.HBgLNTE5' + hex(26);

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DIAS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];
function fmtT(d) { let h = d.getHours(), m = d.getMinutes(); const ap = h >= 12 ? 'p.m.' : 'a.m.'; h = h % 12 || 12; return h + ':' + String(m).padStart(2, '0') + ' ' + ap; }
function fmtTen(d) { let h = d.getHours(), m = d.getMinutes(); const ap = h >= 12 ? 'p.m.' : 'a.m.'; h = h % 12 || 12; return h + (m ? ':' + String(m).padStart(2, '0') : '') + ' ' + ap; }
function fmtTshort(d) { let h = d.getHours(), m = d.getMinutes(); const ap = h >= 12 ? 'p.m.' : 'a.m.'; h = h % 12 || 12; return h + (m ? ':' + String(m).padStart(2, '0') : '') + ' ' + ap; }
const fmtDay = d => DIAS[d.getDay()] + ' ' + d.getDate() + ' ' + MESES[d.getMonth()];
const fmtDT = d => DIAS[d.getDay()].slice(0, 3) + ' ' + d.getDate() + ' · ' + fmtT(d);
const iso = d => { const p = n => String(n).padStart(2, '0'); return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()) + '-05'; };
const addH = (d, h) => new Date(d.getTime() + h * 3600e3);
const addS = (d, s) => new Date(d.getTime() + s * 1e3);
const sameDay = (a, b) => a && b && a.toDateString() === b.toDateString();
function slotLabel(d, lang) {
  if (lang === 'en') return DIAS_EN[d.getDay()] + ' ' + fmtTshort(d);
  const n = DIAS[d.getDay()]; return n[0].toUpperCase() + n.slice(1) + ' ' + fmtTshort(d);
}
function nextSlots(from, n = 2) {
  const out = []; const d = new Date(from); d.setMinutes(0, 0, 0);
  for (let i = 0; i < 21 * 24 && out.length < n; i++) {
    d.setHours(d.getHours() + 1);
    if ((d - from) < 12 * 3600e3) continue;
    if (CONFIG.pruebas.some(p => p.dow === d.getDay() && p.h === d.getHours())) out.push(new Date(d));
  }
  return out;
}

/* ---------- JSON coloreado para el log ---------- */
function jsonHTML(o) {
  return esc(JSON.stringify(o, null, 2))
    .replace(/(&quot;[^&]*?&quot;)(\s*:)/g, '<span class="jk">$1</span>$2')
    .replace(/:\s(&quot;.*?&quot;)/g, ': <span class="js">$1</span>')
    .replace(/:\s(-?\d+\.?\d*|true|false|null)/g, ': <span class="jn">$1</span>');
}

/* ---------- íconos ---------- */
const IC = {
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3h7v7M21 3l-9 9M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/></svg>',
  wa: '<svg viewBox="0 0 24 24"><path fill="#25D366" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/><path fill="#fff" d="M8.6 7.3c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.2-.2.3 0 .6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .2 0 .9-.3 1.6-.3.7-1.6 1.4-2.2 1.4-.6.1-1.2.3-3.9-.8-3.3-1.3-5.4-4.7-5.5-4.9-.2-.2-1.3-1.7-1.3-3.3s.8-2.3 1.1-2.6z"/></svg>',
  dedupe: '<svg viewBox="0 0 24 24" fill="none" stroke="#6B5CE7" stroke-width="2"><rect x="3" y="3" width="12" height="12" rx="2"/><rect x="9" y="9" width="12" height="12" rx="2" fill="#EEEBFF"/><path d="M12.5 15l2 2 4-4"/></svg>',
  wait: '<svg viewBox="0 0 24 24" fill="none" stroke="#E26A2C" stroke-width="2"><path d="M6 3h12M6 21h12M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9"/></svg>',
  pg: '<svg viewBox="0 0 24 24" fill="none" stroke="#336791" stroke-width="2"><ellipse cx="12" cy="5.5" rx="8" ry="3" fill="#E4EDF5"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>',
  ifn: '<svg viewBox="0 0 24 24" fill="none" stroke="#408000" stroke-width="2"><path d="M4 12h5M15 6h5M15 18h5M9 12l6-6M9 12l6 6"/></svg>',
  ai: '<svg viewBox="0 0 24 24" fill="none" stroke="#7B4DFF" stroke-width="1.8"><rect x="4" y="6" width="16" height="13" rx="3" fill="#F1ECFF"/><circle cx="9" cy="12" r="1.5" fill="#7B4DFF"/><circle cx="15" cy="12" r="1.5" fill="#7B4DFF"/><path d="M12 2v4M9 16h6"/></svg>',
  model: '<svg viewBox="0 0 24 24" fill="#C15F3C"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/><circle cx="18.5" cy="18.5" r="2"/></svg>',
  mem: '<svg viewBox="0 0 24 24" fill="none" stroke="#336791" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  tool: '<svg viewBox="0 0 24 24" fill="none" stroke="#0A6A91" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="#FF6D5A" stroke-width="2.2"><path d="M8 6l-5 6 5 6M16 6l5 6-5 6"/></svg>',
  pd: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#1F2A30"/><path fill="#fff" d="M9 6.5h3.6c2.6 0 4.2 1.6 4.2 3.9s-1.6 3.9-4.2 3.9h-1.3v3.2H9zm2.3 2v3.8h1.2c1.3 0 2-.7 2-1.9s-.7-1.9-2-1.9z"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="#D9006C" stroke-width="2"><path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0"/></svg>',
  sched: '<svg viewBox="0 0 24 24" fill="none" stroke="#E26A2C" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="#0A6A91" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h3v3H8z"/></svg>',
  tpl: '<svg viewBox="0 0 24 24" fill="none" stroke="#A15C00" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2" fill="#FFF6E2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="#7B4DFF" stroke-width="2"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" fill="#F1ECFF"/><circle cx="12" cy="12" r="3"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="#D9006C" stroke-width="2"><circle cx="10" cy="8" r="4"/><path d="M3 21c0-4 3-6 7-6M15 18l2 2 4-4"/></svg>',
  fitco: '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6" fill="#111"/><path d="M7 8.5h3M7 15.5h3M5.5 12h13M14 8.5h3M14 15.5h3" stroke="#3CE0A0" stroke-width="2.2" stroke-linecap="round"/></svg>',
  sw: '<svg viewBox="0 0 24 24" fill="none" stroke="#408000" stroke-width="2"><path d="M4 12h6M10 12l6-7h4M10 12h10M10 12l6 7h4"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  ticks: '<svg viewBox="0 0 16 11" fill="none" stroke="#53BDEB" stroke-width="1.5"><path d="M1 6l3 3 6-7M6 8l1 1 6-7"/></svg>',
  reply: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 14l-5-5 5-5M4 9h10a6 6 0 0 1 6 6v5"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>'
};

/* ---------- estado ---------- */
const S = {
  now: new Date(2026, 9, 20, 21, 46),
  leads: {}, order: [], current: null,
  jobs: [], db: [], alerts: [],
  exec: 2317, rowId: 1041, deal: 318, person: 512,
  busy: false, auto: false,
  stats: { respuestas: 0, tiempos: [], fueraHorario: 0, seguimientos: 0, pruebas: 0, ventas: 0, monto: 0, bajas: 0 }
};

function newLead(o) {
  const L = Object.assign({
    lang: 'es', origen: 'Botón web', objetivo: null, urgencia: null, urgSem: null, modalidad: null, estilo: null,
    consent: null, askedConsent: false, trial: null, score: 0, label: null, stage: 'Nuevo', lost: false, won: false,
    human: false, lastIn: null, chat: [], acts: [], resumen: '', value: null, alerted: false, lastDay: null,
    pidioPrecio: false, flags: {}, pay: null, paidTrial: false, op: String(10000000 + Math.floor(Math.random() * 89999999))
  }, o);
  L.personId = ++S.person; L.dealId = ++S.deal;
  S.leads[L.id] = L; S.order.push(L.id);
  return L;
}
const cur = () => S.leads[S.current];

/* ---------- reloj ---------- */
function renderClock() {
  $('#clockD').textContent = fmtDay(S.now);
  $('#clockT').textContent = fmtT(S.now);
  $('#sbTime').textContent = fmtT(S.now).replace(/ [ap]\.m\./, '');
}
async function advanceTo(target, animate = true) {
  if (!animate || target - S.now < 60e3) { S.now = new Date(target); renderClock(); return; }
  $('#clock').classList.add('ff');
  const start = S.now.getTime(), end = target.getTime(), steps = 26;
  for (let i = 1; i <= steps; i++) {
    const k = i / steps, e = 1 - Math.pow(1 - k, 3);
    S.now = new Date(start + (end - start) * e); renderClock();
    await sleep(38);
  }
  S.now = new Date(target); renderClock();
  $('#clock').classList.remove('ff');
}
const tick = s => { S.now = addS(S.now, s); renderClock(); };

/* ---------- página web del estudio (lo primero que ve el prospecto) ---------- */
const WEB_IMG = { logo: 'img/web-logo.webp', hero: 'img/web-hero.webp' };
function buildWeb() {
  const d0 = new Date(S.now); const dow = (d0.getDay() + 6) % 7; d0.setDate(d0.getDate() - dow);
  const sel = new Date(S.now);
  const days = [...Array(7)].map((_, i) => { const d = new Date(d0); d.setDate(d0.getDate() + i); return d; });
  const dn = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  const cls = [['Bachata Principiante', '07:00 PM', '3/20'], ['Salsa Principiante', '08:00 PM', '5/20'], ['Bachata Básico', '09:00 PM', '1/20']];
  $('#webView').innerHTML = `
  <div class="wb-url"><span>🔒</span> bachatastudio.com/reserva</div>
  <header class="wb-h"><img src="${WEB_IMG.logo}" alt="Bachata Studio"><div><u>Login</u><small>¿Tienes dudas? <u>WhatsApp</u></small></div></header>
  <section class="wb-hero">
    <div class="wb-rate"><i>✓</i><span class="st">★★★★★</span> <b>5.0</b> <s></s> <b>363 reviews</b></div>
    <div class="wb-eye">SALSA Y BACHATA EN MIRAFLORES</div>
    <h1>¿Bailamos?</h1>
    <p>Elige un horario y reserva. No necesitas experiencia ni venir con pareja.</p>
    <a class="wb-cta">RESERVAR CLASE</a>
    <div class="wb-q">“Llegué sin confianza y terminé enamorado de la salsa.” — Seena</div>
    <img class="wb-img" src="${WEB_IMG.hero}" alt="">
  </section>
  <section class="wb-lav">
    <div class="wb-eye c">CLASES GRUPALES</div><h2>Elige tu horario.</h2>
    <div class="wb-cal">
      <div class="lg"><span><i class="g">R</i>Clase reservada</span><span><i class="p">F</i>Clase Llena</span><span><i class="y">E</i>En lista de espera</span></div>
      <div class="fl"><div class="inp">Buscar</div><div class="inp">Disciplinas ▾</div><div class="inp">Instructores ▾</div><div class="inp c">Limpiar</div></div>
      <div class="dy">${days.map(d => `<div class="${d.getDate() === sel.getDate() ? 'on' : ''}">${dn[d.getDay()]}<br>${d.getDate()}/${d.getMonth() + 1}</div>`).join('')}</div>
      ${cls.map(c => `<div class="cl"><b>${c[0]}</b><span>Staff</span><span>${c[1]}</span><span class="r"><em>60 min</em><em>${c[2]}</em></span></div>`).join('')}
    </div>
  </section>
  <section class="wb-plans">
    <div class="wb-eye c">PLANES FLEXIBLES</div><h2>Baila a tu ritmo.</h2><p class="c">Elige el paquete que mejor se adapte a tu ritmo.</p>
    ${CONFIG.paquetes.map((x, i) => `<div class="pl ${i === 0 ? 'sel' : ''}"><div><b>${x.h} horas</b> <small>Vigencia: ${x.v}</small></div><span><em>S/ ${(x.p / x.h).toFixed(2).replace(/\.00$/, '')} por hora</em><strong>S/ ${x.p}</strong></span></div>`).join('')}
    <a class="wb-cta">ELEGIR PAQUETE</a><div class="or">o</div><p class="c"><b>Prueba una clase S/. 60</b></p>
    ${CONFIG.prueba.map((x, i) => `<div class="pl ${i === 0 ? 'sel' : ''}"><div><b>${x.h} ${x.h === 1 ? 'hora' : 'horas'}</b> <small>Clase de prueba</small></div><span><strong>S/. ${x.p}</strong></span></div>`).join('')}
    <a class="wb-cta">ELEGIR CLASE DE PRUEBA</a>
  </section>
  <footer class="wb-ft">${CONFIG.estudio} · ${CONFIG.direccion}</footer>`;
}
function showWeb(on) {
  $('#webView').hidden = !on; $('#waFab').hidden = !on;
  if (on) { buildWeb(); $('#webView').scrollTop = 0; $('#waFab').classList.remove('tapped'); }
  $('#waInput').disabled = on;
}
const webOpen = () => !$('#webView').hidden;
async function openWA() {
  if (!webOpen()) return;
  const f = $('#waFab'); f.classList.add('tapped'); await sleep(550); showWeb(false);
}

/* ---------- celular del prospecto ---------- */
function chatPush(L, item) {
  if (item.at && !sameDay(L.lastDay, item.at) && item.kind !== 'chip' && item.kind !== 'btns') {
    L.lastDay = item.at;
    chatPush(L, { kind: 'chip', text: fmtDay(item.at) });
  }
  L.chat.push(item);
  if (L.id === S.current) { $('#waChat').append(renderItem(L, item)); scrollChat(); }
}
function scrollChat() { const c = $('#waChat'); c.scrollTop = c.scrollHeight; }
function renderItem(L, it) {
  if (it.kind === 'chip') return el('div', 'chip', esc(it.text));
  if (it.kind === 'enc') return el('div', 'chip enc', esc(it.text));
  if (it.kind === 'btns') {
    const w = el('div', 'btns' + (it.used ? ' used' : ''));
    it.opts.forEach(o => {
      const b = el('button', (it.used === o ? 'tapped ' : '') + (it.cta ? 'cta' : ''), (it.cta ? IC.link : IC.reply) + esc(o));
      b.type = 'button';
      b.onclick = () => { if (it.used || S.busy) return; userTap(L, it, o); };
      w.append(b);
    });
    it.node = w; return w;
  }
  const me = it.kind === 'me';
  const b = el('div', 'b ' + (me ? 'me' : 'them') + (it.img ? ' img' : ''));
  let h = '';
  if (it.tpl) h += '<div class="tag">PLANTILLA · ' + esc(it.tpl.cat.toUpperCase()) + '</div>' + (it.tpl.header ? '<div class="tpl-h">' + esc(it.tpl.header) + '</div>' : '');
  if (it.img) h += it.img + '<div class="icap">' + esc(it.text || '');
  else h += esc(it.text).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
  if (it.tpl && it.tpl.footer) h += '<div class="tpl-f">' + esc(it.tpl.footer) + '</div>';
  h += '<span class="meta">' + fmtT(it.at) + (me ? IC.ticks : '') + '</span>';
  if (it.img) h += '</div>';
  b.innerHTML = h;
  return b;
}
function renderPhone() {
  const L = cur(); const c = $('#waChat'); c.innerHTML = '';
  if (!L) return;
  L.chat.forEach(it => c.append(renderItem(L, it)));
  scrollChat();
}
function showTyping(on) {
  const c = $('#waChat'); const t = $('.typing', c);
  if (on && !t) { c.append(el('div', 'typing', '<i></i><i></i><i></i>')); scrollChat(); }
  if (!on && t) t.remove();
}
async function typeInto(text) {
  const inp = $('#waInput'); inp.value = '';
  const n = text.length, per = Math.max(10, Math.min(28, 900 / n));
  for (let i = 0; i < n; i++) { inp.value += text[i]; if (i % 2 === 0) await sleep(per); }
  await sleep(220); inp.value = '';
}

/* ---------- indicadores de pestañas ---------- */
function badge(id, on = true) { const b = $('#bdg-' + id); if (b) b.classList.toggle('on', !!on); }
function showR(tab) {
  $$('#rTabs [data-rp]').forEach(t => t.setAttribute('aria-selected', t.dataset.rp === tab));
  $$('[id^="rp-"]').forEach(p => p.classList.toggle('on', p.id === 'rp-' + tab));
  badge(tab, false);
}

/* =====================================================================
   PANELES: ficha de Pipedrive, seguimientos, celular de Alberto, resultados
   ===================================================================== */
const STAGES = ['Nuevo', 'Calificado', 'Prueba agendada', 'Asistió', 'Ganado'];
function labelOf(L) {
  if (L.won) return ['won', 'Ganado'];
  if (L.lost) return ['lost', 'Perdido'];
  if (L.score >= CONFIG.umbralCaliente) return ['hot', 'Caliente'];
  if (L.score >= 50) return ['warm', 'Tibio'];
  return ['cold', 'Frío'];
}
function fieldsOf(L) {
  return [
    ['Teléfono', esc(L.e164)],
    ['Origen', esc(L.origen)],
    ['Objetivo', esc(L.objetivo || '–')],
    ['Urgencia', esc(L.urgencia || '–')],
    ['Clase de prueba', L.trial ? fmtDay(L.trial) + ', ' + fmtTshort(L.trial) : '–'],
    ['Avisos', L.consent === true ? 'Aceptó' : L.consent === false ? (L.lost ? 'Pidió baja' : 'No acepta') : '–'],
    ['Puntaje IA', L.score ? `<span class="pd-sc"><i style="width:${L.score}%"></i></span>${L.score}` : '–']
  ];
}
const PD_IC = {
  deals: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.2c-.5-.8-1.4-1.2-2.5-1.2-1.5 0-2.5.8-2.5 1.9 0 2.6 5 1.4 5 4.1 0 1.1-1.1 2-2.6 2-1.2 0-2.2-.5-2.7-1.4M12 6.5V8m0 8v1.5"/></svg>',
  people: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.3-5.5 6.5-5.5s5.9 1.9 6.5 5.5M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c1.9.8 3.1 2.5 3.5 5.2"/></svg>',
  acts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="17" rx="2"/><path d="M9 2.5v3M15 2.5v3M8.5 13l2.5 2.5 4.5-5"/></svg>',
  camp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10v4h3l7 4V6l-7 4zM17.5 9a4 4 0 0 1 0 6"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
  ok: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2"><path d="M6 12.5l4 4 8-8.5"/></svg>'
};
function renderCRM() {
  const L = cur(); const p = $('#rp-crm');
  if (!L) { p.innerHTML = '<div class="empty">Sin prospectos todavía.</div>'; return; }
  const [lc, lt] = labelOf(L);
  const prev = L._prev || {};
  const F = fieldsOf(L);
  const stIdx = L.lost ? -1 : STAGES.indexOf(L.stage);
  const ini = L.name.split(' ').map(w => w[0]).slice(0, 2).join('');
  const val = L.value || (L.pay && L.pay.p) || null;
  const canAsist = L.stage === 'Prueba agendada' && L.trial && S.now >= L.trial;
  const acts = L.acts.length ? L.acts.map(a => `<li class="pd-act ${a.done ? 'done' : ''}"><i class="ck">${a.done ? PD_IC.ok : ''}</i><span><b>${esc(a.text)}</b><small>${esc(a.when)}</small></span></li>`).join('')
    : '<li class="pd-act none">Sin actividades todavía.</li>';
  p.innerHTML = `<div class="pd">
    <nav class="pd-side" aria-hidden="true"><b class="pd-p">p</b><i class="on">${PD_IC.deals}</i><i>${PD_IC.people}</i><i>${PD_IC.acts}</i><i>${PD_IC.camp}</i></nav>
    <div class="pd-main">
      <div class="pd-top"><b>Deals</b><span class="pd-search">${PD_IC.search}Buscar en Pipedrive</span><span class="pd-me" title="${esc(CONFIG.director)}">AP</span></div>
      <div class="pd-body">
        <div class="pd-deal">
          <div class="pd-av">${esc(ini)}</div>
          <div class="pd-ttl"><h3>${esc(L.name)}</h3><small>${val ? 'S/ ' + val.toLocaleString('es-PE') + ' · ' : ''}Embudo de ventas</small></div>
          ${L.won ? '<span class="pd-st won">Ganado</span>' : L.lost ? '<span class="pd-st lost">Perdido</span>' : L.score ? `<span class="pill ${lc}">${lt}</span>` : ''}
        </div>
        ${L.human ? '<div class="pd-flag">Atiende Alberto: el asistente está en pausa</div>' : ''}
        <div class="pd-stages">${STAGES.map((s, i) => `<span class="${L.lost ? (i === 0 ? 'lost' : '') : (i <= stIdx ? 'on' : '')}">${L.lost && i === 0 ? 'Perdido' : s.replace(' agendada', '')}</span>`).join('')}</div>
        <h4>Detalles</h4>
        <dl class="pd-f">${F.map(([k, v]) => `<div class="${prev[k] !== undefined && prev[k] !== v ? 'flash' : ''}"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
        <h4>Nota del asistente</h4>
        <div class="pd-note">${esc(L.resumen || 'Se escribe sola con el primer mensaje.')}</div>
        <h4>Actividades</h4>
        <ul class="pd-acts">${acts}</ul>
        <div class="pd-btns"${L.won ? ' hidden' : ''}>
          <button class="pbtn" id="btnHuman">${L.human ? 'Devolver al asistente' : 'Tomar conversación'}</button>
          <button class="pbtn g ${canAsist ? 'pulse' : ''}" id="btnAsistio" ${canAsist ? '' : 'disabled'}>Marcar que asistió</button>
        </div>
      </div>
      ${L.won ? `<div class="pd-toast"><b class="pd-p big">p</b><span>Deal ganado<small>S/ ${(val || 0).toLocaleString('es-PE')} · ${esc(first(L))}</small></span></div>` : ''}
    </div></div>`;
  L._prev = Object.fromEntries(F);
  $('#btnHuman').onclick = () => toggleHuman(L);
  $('#btnAsistio').onclick = () => { if (!S.busy) runAsistio(L); };
}

/* ---------- seguimientos ---------- */
function channelOf(job) {
  const L = S.leads[job.lead];
  const open = L.lastIn && (job.at - L.lastIn) < 24 * 3600e3;
  if (open) return ['free', 'Texto libre'];
  return job.k.startsWith('r') ? ['utl', 'Plantilla de Meta'] : ['tpl', 'Plantilla de Meta'];
}
function renderQueue() {
  const p = $('#rp-seg');
  const jobs = S.jobs.filter(j => j.lead === S.current).sort((a, b) => a.at - b.at);
  const nxt = nextJob();
  p.innerHTML = `
    <div class="q-intro">Solo escribe a quien aceptó avisos, se detiene si la persona responde o pide baja, y nunca envía de 9 p.m. a 9 a.m.</div>
    ${jobs.length ? jobs.map(j => {
      const [, ct] = j.sentAs || channelOf(j);
      const st = j.status === 'sent' ? '<span class="st-pill sent">Enviado</span>'
        : j.status === 'canc' ? `<span class="st-pill canc">${esc(j.reason.replace('Cancelado · ', 'Cancelado: '))}</span>`
        : j === nxt ? '<span class="st-pill next">Siguiente</span>' : '<span class="st-pill">Programado</span>';
      return `<div class="job ${j.status === 'canc' ? 'cancel' : ''}">
        <div class="when"><b>${fmtTshort(j.at)}</b>${DIAS[j.at.getDay()].slice(0, 3)} ${j.at.getDate()} ${MESES[j.at.getMonth()]}</div>
        <div class="what"><b>${esc(j.name)}</b><span>${ct}${j.adjusted ? ' <em>movido por horario de descanso</em>' : ''}</span></div>
        ${st}</div>`;
    }).join('') : '<div class="empty">Aún no hay envíos programados.</div>'}`;
}

/* ---------- celular de Alberto ---------- */
function renderOwner() {
  const p = $('#rp-owner');
  p.innerHTML = `<div class="mini">
      <div class="wa-h"><div class="wa-av" style="background:var(--tint)"><img src="img/marca.png" alt=""></div><div><b>Alertas del asistente</b><small>Le escribe a Alberto solo cuando hace falta</small></div></div>
      <div class="mini-chat" id="ownerChat"></div>
    </div>`;
  const c = $('#ownerChat');
  if (!S.alerts.length) c.append(el('div', 'chip', 'Sin alertas todavía'));
  S.alerts.forEach(a => {
    const d = el('div', 'alert', `<div class="hd">${esc(a.head)}</div>${esc(a.body).replace(/\n/g, '<br>')}<span class="meta">${fmtT(a.at)}</span>`);
    if (a.btns) {
      const w = el('div', 'alert-btns');
      a.btns.forEach(b => { const x = el('button', '', esc(b.t)); x.disabled = !!a.done; x.onclick = () => { if (!a.done) { a.done = b.t; b.fn && b.fn(); renderOwner(); } }; w.append(x); });
      d.append(w);
    }
    c.append(d);
  });
  c.scrollTop = c.scrollHeight;
}
function ownerAlert(a) { a.at = new Date(S.now); S.alerts.push(a); renderOwner(); badge('owner'); return a; }

/* ---------- resultados ---------- */
function renderFunnel() {
  const p = $('#rp-funnel');
  const st = S.stats;
  const avg = st.tiempos.length ? (st.tiempos.reduce((a, b) => a + b, 0) / st.tiempos.length).toFixed(1) + ' s' : '–';
  p.innerHTML = `
    <div class="kpis">
      <div class="kpi"><div class="n">${avg}</div><div class="t">en responder el primer mensaje</div></div>
      <div class="kpi"><div class="n">${st.fueraHorario}</div><div class="t">mensajes atendidos mientras Alberto enseñaba o fuera de horario</div></div>
      <div class="kpi"><div class="n">${st.seguimientos}</div><div class="t">seguimientos y recordatorios enviados solos</div></div>
      <div class="kpi"><div class="n">${st.pruebas}</div><div class="t">clases de prueba agendadas</div></div>
      <div class="kpi big"><div class="n">S/ ${st.monto.toLocaleString('es-PE')}</div><div class="t">${st.ventas === 1 ? '1 venta cerrada' : st.ventas + ' ventas cerradas'} sin que Alberto deje la clase</div></div>
    </div>`;
}

/* ---------- registro de mensajes (en producción: Postgres) ---------- */
function dbInsert(L, dir, text, id) {
  const row = { id: ++S.rowId, tel: L.e164, dir, text, wamid: id, at: new Date(S.now) };
  S.db.unshift(row);
  return row;
}

function renderAll() { renderClock(); renderPhone(); renderCRM(); renderQueue(); renderOwner(); renderFunnel(); }

/* =====================================================================
   AGENTE (simulado). En producción es el nodo AI Agent de n8n con el
   modelo de lenguaje, el prompt del estudio y la herramienta de agenda.
   Aquí se imita con reglas para que la demo funcione sin internet.
   ===================================================================== */
const NUM = { un: 1, una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
const first = L => L.name.split(' ')[0];
const plural = L => /boda|pareja/i.test(L.objetivo || '') || L.flags.pareja;

function slotBtns(L, from) {
  const s = nextSlots(from || S.now, 2);
  L.offered = s;
  return s.map(d => slotLabel(d, L.lang));
}
function matchSlot(L, t) {
  const pool = (L.offered && L.offered.length ? L.offered : nextSlots(S.now, 2));
  return pool.find(d => norm(slotLabel(d, L.lang)) === t || t.includes(norm(DIAS[d.getDay()])) || t.includes(norm(DIAS_EN[d.getDay()])));
}

const packLabel = (x, EN) => `${x.h} ${EN ? 'hours' : 'horas'} · S/ ${x.p}`;
const packBtns = L => CONFIG.paquetes.map(x => packLabel(x, L.lang === 'en'));
const payBtns = L => L.lang === 'en' ? ['Pay with Mercado Pago', 'Pay with Yape'] : ['Pagar con Mercado Pago', 'Pagar con Yape'];
const packTxt = EN => CONFIG.paquetes.map(x => EN ? `${x.h} hours for S/ ${x.p} (valid ${x.en})` : `${x.h} horas por S/ ${x.p} (vigencia ${x.v})`).join('; ');
const trialTxt = EN => EN ? `1 hour for S/ ${CONFIG.prueba[0].p} (or 2 hours for S/ ${CONFIG.prueba[1].p})` : `1 hora por S/ ${CONFIG.prueba[0].p} (también hay de 2 horas por S/ ${CONFIG.prueba[1].p})`;

function agentRespond(L, raw) {
  const t = norm(raw.trim());
  const upd = {}, ev = {}, out = [];
  let intent = 'consulta';

  // idioma: se fija con el primer mensaje
  if (!L.flags.langSet) {
    const en = /\b(hi|hello|hey|english|how much|do you|i'm|i am|i just|beginner|thanks|please)\b/.test(t);
    const es = /\b(hola|clases|cuanto|precio|gracias|quiero|quisiera|donde|horario|bailar|buenas)\b/.test(t);
    upd.lang = en && !es ? 'en' : 'es';
  }
  if (upd.lang) { L.lang = upd.lang; L.flags.langSet = true; }
  const lang = L.lang, EN = lang === 'en';
  const Lx = Object.assign({}, L, upd, { flags: L.flags });
  const P = plural(Lx);

  // 1. baja
  if (/(no me interesa|ya no|no me escrib|dejen de|^baja$|\bstop\b|unsubscribe|not interested)/.test(t)) {
    ev.optout = true; intent = 'baja';
    out.push({ text: EN ? `Got it, ${first(L)}. We won't message you again. If you ever want to dance, we're here 💛`
      : `Entendido, ${first(L)}. No te volveremos a escribir. Si algún día te animas a bailar, aquí estaremos 💛` });
    return { out, upd, ev, intent };
  }
  // 2. elección de paquete
  const pk = t.match(/^(4|8|16) (horas|hours)\b/);
  if (pk) {
    const x = CONFIG.paquetes.find(p => p.h === +pk[1]);
    upd.pay = { kind: 'pack', h: x.h, p: x.p, v: x.v, en: x.en }; ev.pack = true; intent = 'elige_paquete';
    out.push({ text: EN ? `Great choice! The ${x.h}-hour package is S/ ${x.p}, valid ${x.en}. How would you like to pay?`
      : `¡Excelente! El paquete de ${x.h} horas cuesta S/ ${x.p}, con vigencia de ${x.v}. ¿Cómo ${P ? 'prefieren' : 'prefieres'} pagar?`, btns: payBtns(Lx) });
    return { out, upd, ev, intent };
  }
  // 3. forma de pago: Mercado Pago (enlace) o Yape (comprobante)
  const isMp = /^(pagar con|pay with) mercado ?pago$/.test(t), isYp = /^(pagar con|pay with) yape$/.test(t);
  if (isMp || isYp) {
    const pay = L.pay || Object.assign({ kind: 'pack' }, CONFIG.paquetes[1]);
    if (!L.pay) upd.pay = pay;
    if (isMp) {
      ev.mp = true; intent = 'pago_mercadopago';
      out.push({ text: EN ? `Perfect. Open the secure link to pay S/ ${pay.p} by card with Mercado Pago:` : `Perfecto. Abre el enlace seguro para pagar S/ ${pay.p} con tarjeta por Mercado Pago:`, cta: EN ? `Pay S/ ${pay.p}` : `Pagar S/ ${pay.p}` });
    } else {
      ev.yape = true; intent = 'pago_yape';
      out.push({ text: EN ? `Send S/ ${pay.p} by Yape to ${CONFIG.numero} (Bachata Studio) and share the receipt screenshot here 📸`
        : `Yapea S/ ${pay.p} al ${CONFIG.numero} (Bachata Studio) y envíame aquí la captura del comprobante 📸`, voucher: EN ? '📎 Send receipt' : '📎 Enviar comprobante' });
    }
    return { out, upd, ev, intent };
  }
  // 4. comprobante recibido
  if (/(yape|plin|transferi|pague|pagamos|comprobante|\bpaid\b|deposit)/.test(t)) {
    ev.payment = true; intent = 'pago';
    out.push({ text: EN ? 'Received! We\'re validating your payment, we\'ll confirm in a few minutes.' : `¡Recibido! Estamos validando el pago y en unos minutos ${P ? 'les' : 'te'} confirmamos.` });
    return { out, upd, ev, intent };
  }
  // 5. botones de consentimiento
  if (/^(si,? avisame|yes,? keep me posted)$/.test(t)) {
    upd.consent = true; intent = 'consentimiento_si';
    const tail = L.trial ? (EN ? ` See you on ${DIAS_EN[L.trial.getDay()]} 💃` : ` ¡Nos vemos el ${DIAS[L.trial.getDay()]}! 💃`) : '';
    out.push({ text: EN ? `Perfect! I'll only message you about what matters. Reply STOP anytime to opt out.${tail}`
      : (P ? `¡Perfecto! Solo les escribiré lo importante. Si quieren dejar de recibir mensajes, escriban BAJA.${tail}`
           : `¡Perfecto! Solo te escribiré lo importante. Si quieres dejar de recibir mensajes, escribe BAJA.${tail}`) });
    return { out, upd, ev, intent };
  }
  if (/^(no,? gracias|no,? thanks)$/.test(t) && L.askedConsent && L.consent == null) {
    upd.consent = false; intent = 'consentimiento_no';
    out.push({ text: EN ? 'No problem, no reminders then. I\'m here if you need anything.' : 'Sin problema, no te enviaremos avisos. Aquí estamos si nos necesitas.' });
    return { out, upd, ev, intent };
  }
  // 6. respuestas a recordatorios y plantillas
  if (/^(confirmo|confirmamos|ahi estaremos|alli estaremos|i'll be there|confirm)/.test(t)) {
    intent = 'confirma_prueba'; ev.confirm = true;
    out.push({ text: EN ? `Great! See you tomorrow at ${fmtTshort(L.trial)}. Comfortable shoes are enough 👟`
      : `¡Genial! ${P ? 'Los' : 'Te'} esperamos mañana a las ${fmtTshort(L.trial)}. Basta con ropa y zapatos cómodos 👟` });
    return { out, upd, ev, intent };
  }
  if (/^(ahora no|not now)$/.test(t)) {
    intent = 'pospone'; ev.pause = true;
    out.push({ text: EN ? 'No worries! Whenever you\'re ready, just write here.' : '¡Tranquilo! Cuando quieras, escríbenos por aquí y te separo un lugar.' });
    return { out, upd, ev, intent };
  }
  // 7. elección de horario de la clase de prueba (se paga para confirmar)
  const slot = (L.offered || /prueba|trial|reserv|separ/.test(t)) ? matchSlot(L, t) : null;
  if (slot && !L.trial) {
    ev.book = slot; upd.trial = slot; intent = 'agenda_prueba';
    upd.pay = { kind: 'trial', h: CONFIG.prueba[0].h, p: CONFIG.prueba[0].p, v: '', en: '' };
    const lbl = slotLabel(slot, lang);
    out.push({ text: EN ? `Done: ${lbl} at ${CONFIG.direccion}. To confirm your spot, the 1-hour trial class is S/ ${CONFIG.prueba[0].p}. How would you like to pay?`
      : `Listo: ${lbl.toLowerCase()} en ${CONFIG.direccion}. Para confirmar ${P ? 'su' : 'tu'} lugar, la clase de prueba de 1 hora cuesta S/ ${CONFIG.prueba[0].p}. ¿Cómo ${P ? 'prefieren' : 'prefieres'} pagar?`, btns: payBtns(Lx) });
    return { out, upd, ev, intent };
  }

  // 8. extracción de datos
  const boda = /(boda|me caso|nos casamos|matrimonio|primer baile|wedding|getting married)/.test(t);
  if (boda) upd.objetivo = 'Primer baile de boda';
  else if (/(empresa|team building|corporativ|company)/.test(t)) upd.objetivo = 'Evento de empresa';
  else if (/(no se bailar|no sabemos|no sabe|desde cero|principiante|nunca|beginner|dos pies izquierdos|aprender)/.test(t) && !L.objetivo) upd.objetivo = 'Aprender desde cero';
  if (/(novio|novia|esposo|esposa|pareja|partner|husband|wife)/.test(t)) L.flags.pareja = true;
  if (/salsa/.test(t) && /bachata/.test(t)) upd.estilo = 'Salsa y bachata';
  else if (/salsa/.test(t)) upd.estilo = 'Salsa';
  else if (/bachata/.test(t)) upd.estilo = 'Bachata';
  const m = t.match(/(\d+|un|una|dos|tres|cuatro|cinco|seis|one|two|three|four|five|six)\s*(semana|week|mes|month)/);
  if (m) {
    const n = +m[1] || NUM[m[1]] || 1; const w = /mes|month/.test(m[2]) ? n * 4 : n;
    upd.urgSem = w; upd.urgencia = w === 1 ? '1 semana' : w + ' semanas';
  }
  if (/(privad|particular|private)/.test(t)) upd.modalidad = 'Privadas';
  else if (/(grupal|grupo|group)/.test(t)) upd.modalidad = 'Grupales';
  else if (/(online|virtual|en linea)/.test(t)) upd.modalidad = 'Online';
  else if (boda && !L.modalidad) upd.modalidad = 'Paquete de clases';

  const askPrice = /(cuanto|precio|cuesta|costo|tarifa|mensualidad|how much|price|cost)/.test(t);
  const askInfo = /(info|informacion|information|details)/.test(t);
  const askHour = /(horario|que dias|a que hora|schedule|what time|when)/.test(t) || askInfo;
  const askWhere = /(donde|direccion|ubicad|where|address|location)/.test(t);
  const wantTrial = /(prueba|probar|trial|quiero mi clase|separame|sepárame|apuntarme|inscrib|sign up|try)/.test(t);
  const greet = /^(hola|buenas|buenos dias|buenas tardes|buenas noches|hi|hello|hey)[!. ]*$/.test(t);
  if (askPrice) upd.pidioPrecio = true;

  const parts = [];
  let pkgShown = false;
  if (boda && !L.flags.congrats) {
    L.flags.congrats = true; pkgShown = true;
    parts.push(EN ? `Congratulations! 💍 For the first dance we recommend a class package: ${packTxt(true)}.`
      : `¡Felicitaciones! 💍 Para el primer baile les recomendamos un paquete de clases: ${packTxt(false)}.`);
    if (upd.urgSem && upd.urgSem <= 8) parts.push(EN ? `With ${upd.urgSem} weeks you have enough time.` : `Con ${upd.urgSem} semanas llegan bien.`);
  } else {
    if (EN && !L.flags.welcomed) { L.flags.welcomed = true; parts.push(/moved|new in|just arrived/.test(t) ? 'Welcome to Lima! 🙌' : 'Hi! 🙌'); }
    if (upd.objetivo === 'Aprender desde cero' || (/(english|ingles)/.test(t))) parts.push(EN ? 'Yes! Many of our students are foreigners who started from zero — no experience or partner needed.' : 'Empezamos desde cero: no necesitas experiencia ni venir con pareja.');
    if (askPrice || askInfo) { pkgShown = true; parts.push(EN ? `Our class packages: ${packTxt(true)}.` : `Estos son nuestros paquetes de clases: ${packTxt(false)}.`); }
  }
  if (askHour) parts.push(EN ? `Classes run ${CONFIG.horario.en}` : `Las clases son ${CONFIG.horario.es}.`);
  if (askWhere) parts.push(EN ? `We're at ${CONFIG.direccion}.` : `Estamos en ${CONFIG.direccion}.`);

  if (!parts.length && greet && !L.flags.greeted) {
    L.flags.greeted = true; intent = 'saludo';
    out.push({ text: EN ? `Hi ${first(L)}! 👋 I'm Bachata Studio's assistant. Want to learn salsa or bachata, or prepare a wedding dance?`
      : `¡Hola, ${first(L)}! 👋 Soy el asistente de Bachata Studio. ¿Quieres aprender salsa o bachata, o preparar el baile de tu boda?` });
    return { out, upd, ev, intent };
  }
  if (!parts.length && !wantTrial && !upd.objetivo) {
    intent = 'escalar'; ev.escalate = true;
    out.push({ text: EN ? `Good question! I'm passing it to ${CONFIG.directorCorto}, our director, and he'll reply as soon as class ends.`
      : `¡Buena pregunta! Se la paso a ${CONFIG.directorCorto}, nuestro director, y te responde apenas termine la clase.` });
    return { out, upd, ev, intent };
  }

  // 9. llamada a la acción
  if (wantTrial && !L.trial) {
    // la prueba solo se da a quien la pide (o a quien el seguimiento invitó): primero horario, luego pago
    intent = 'quiere_prueba';
    parts.push(EN ? `Great! The trial class is ${trialTxt(true)}. These are the next slots:` : `¡Genial! La clase de prueba dura ${trialTxt(false)}. Estos son los próximos horarios:`);
    out.push({ text: parts.join(' '), btns: slotBtns(L) });
    ev.offered = true;
  } else if (!L.trial) {
    intent = boda ? 'boda_precio' : (askPrice ? 'precio' : 'informacion');
    if (!pkgShown) parts.push(EN ? `Our class packages: ${packTxt(true)}.` : `Estos son nuestros paquetes de clases: ${packTxt(false)}.`);
    parts.push(EN ? 'Which package interests you?' : `¿Cuál paquete ${P || boda ? 'les' : 'te'} interesa?`);
    out.push({ text: parts.join(' '), btns: packBtns(Lx) });
    // pedir permiso para avisos a prospectos fríos que no eligen de inmediato
    const willBeHot = boda && (upd.urgSem || L.urgSem);
    if (L.consent == null && !L.askedConsent && !willBeHot) {
      ev.askedConsent = true;
      out.push({ text: EN ? 'Can I message you here if new beginner spots open up? You can opt out anytime.' : '¿Te aviso por aquí si se abren cupos o un grupo nuevo? Puedes salir cuando quieras escribiendo BAJA.',
        btns: EN ? ['Yes, keep me posted', 'No, thanks'] : ['Sí, avísame', 'No, gracias'] });
    }
  } else {
    out.push({ text: parts.join(' ') });
  }
  return { out, upd, ev, intent };
}

const INTENT = { baja: 'no quiere más mensajes', pago: 'envió su pago', consentimiento_si: 'acepta recibir avisos', consentimiento_no: 'no quiere avisos',
  confirma_prueba: 'confirma su clase', pospone: 'lo deja para después', agenda_prueba: 'elige horario de prueba', saludo: 'saludo',
  escalar: 'pregunta para Alberto', elige_paquete: 'elige un paquete', pago_mercadopago: 'pagará con Mercado Pago', pago_yape: 'pagará con Yape', boda_precio: 'boda, pide precios', precio: 'pide precios', quiere_prueba: 'quiere una clase de prueba', informacion: 'pide información' };

/* ---------- puntaje (nodo Code) ---------- */
function scoreOf(L) {
  const r = [['Contacto inicial', 10]];
  if (L.objetivo) r.push(['Objetivo: ' + L.objetivo, /boda/i.test(L.objetivo) ? 25 : 15]);
  if (L.urgSem && L.urgSem <= 6) r.push(['Urgencia ≤ 6 semanas', 15]);
  if (L.modalidad) r.push(['Modalidad definida', 10]);
  if (L.flags.reengaged) r.push(['Respondió a un seguimiento', 10]);
  if (L.trial) r.push(['Agendó clase de prueba', 25]);
  if (L.pay && L.pay.kind === 'pack') r.push(['Eligió un paquete', 25]);
  return { total: Math.min(100, r.reduce((a, x) => a + x[1], 0)), reglas: r.map(([regla, puntos]) => ({ regla, puntos })) };
}

/* ---------- resumen para Pipedrive ---------- */
function summaryOf(L) {
  const n = first(L), s = [];
  if (/boda/i.test(L.objetivo || '')) s.push(`${n} quiere preparar el primer baile de su boda${L.urgencia ? ' (faltan ' + L.urgencia + ')' : ''}; no tienen experiencia.`);
  else if (L.objetivo) s.push(`${n} quiere aprender ${L.estilo ? L.estilo.toLowerCase() : 'a bailar'} desde cero.`);
  else s.push(`${n} pidió información${L.estilo ? ' de ' + L.estilo.toLowerCase() : ''}.`);
  if (L.lang === 'en') s.push('Escribe en inglés; el asistente responde en inglés.');
  if (L.modalidad) s.push(`Interés: clases ${L.modalidad.toLowerCase()}.`);
  if (L.pidioPrecio) s.push('Consultó precios.');
  if (L.flags.reengaged) s.push('Volvió a escribir gracias al seguimiento.');
  if (L.trial) s.push(`Clase de prueba: ${fmtDay(L.trial)}, ${fmtTshort(L.trial)}.`);
  if (L.consent === true && !L.lost) s.push('Aceptó recibir avisos.');
  if (L.paidTrial) s.push('Pagó la clase de prueba (S/ ' + CONFIG.prueba[0].p + ').');
  if (L.stage === 'Asistió' || (L.won && L.trial)) s.push('Asistió a la clase de prueba.');
  if (L.won) s.push(`Compró el paquete de ${L.pay.h} h (S/ ${L.pay.p}); alta en FitCo.`);
  if (L.lost) s.push('Pidió no recibir más mensajes: secuencia detenida y deal cerrado como perdido.');
  if (L.score >= CONFIG.umbralCaliente && !L.won && !L.lost) s.push('Prospecto caliente: Alberto ya fue alertado.');
  return s.join(' ').replace(/\.\./g, '.');
}


/* =====================================================================
   LIENZO DE n8n
   Versión simplificada de los tres workflows. Los nodos técnicos
   (deduplicar, agrupar ráfaga, guardar en Postgres…) corren igual pero
   no se dibujan, para que el lienzo se entienda de un vistazo.
   Coordenadas: centro del nodo, en px del lienzo (696 × 420).
   ===================================================================== */
IC.score = '<svg viewBox="0 0 24 24" fill="none" stroke="#FF6D5A" stroke-width="2.2" stroke-linecap="round"><path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-6"/></svg>';
const WF = {
  main: {
    name: 'WA · Entrada de mensajes', tab: 'Entrada', sub: 'Se ejecuta con cada mensaje que llega por WhatsApp',
    nodes: [
      { id: 'trig', x: 50, y: 62, ic: 'wa', l: 'WhatsApp Trigger', s: 'mensaje recibido', k: 'trig' },
      { id: 'dedupe', x: 145, y: 62, ic: 'dedupe', l: 'Deduplicar', s: 'por ID de mensaje' },
      { id: 'rafaga', x: 240, y: 62, ic: 'wait', l: 'Agrupar ráfaga', s: 'espera 6 s' },
      { id: 'pgIn', x: 335, y: 62, ic: 'pg', l: 'Postgres', s: 'guardar entrante' },
      { id: 'human', x: 430, y: 62, ic: 'ifn', l: '¿Lo atiende humano?', s: 'If' },
      { id: 'agent', x: 560, y: 62, ic: 'ai', l: 'AI Agent', s: 'asistente de ventas', k: 'ai' },
      { id: 'model', x: 515, y: 158, ic: 'model', l: 'Modelo', k: 'sub' },
      { id: 'mem', x: 565, y: 158, ic: 'mem', l: 'Memoria', k: 'sub' },
      { id: 'tool', x: 615, y: 158, ic: 'tool', l: 'Agenda', k: 'sub' },
      { id: 'score', x: 50, y: 290, ic: 'code', l: 'Puntaje', s: 'Code' },
      { id: 'pd', x: 145, y: 290, ic: 'pd', l: 'Pipedrive', s: 'persona + deal' },
      { id: 'send', x: 240, y: 290, ic: 'wa', l: 'WhatsApp', s: 'enviar respuesta' },
      { id: 'pgOut', x: 335, y: 290, ic: 'pg', l: 'Postgres', s: 'guardar saliente' },
      { id: 'hot', x: 430, y: 290, ic: 'ifn', l: '¿Alerta a Alberto?', s: 'If' },
      { id: 'alert', x: 530, y: 290, ic: 'bell', l: 'WhatsApp', s: 'alerta al dueño' },
      { id: 'sched', x: 628, y: 290, ic: 'sched', l: 'Programar', s: 'seguimientos' }
    ],
    edges: [['trig', 'dedupe'], ['dedupe', 'rafaga'], ['rafaga', 'pgIn'], ['pgIn', 'human'], ['human', 'agent', { lbl: 'no' }],
      ['agent', 'score', { path: 'M609,62 C640,62 652,80 652,110 L652,198 Q652,214 636,214 L30,214 Q14,214 14,230 L14,274 Q14,290 18,290', ix: 300, iy: 208 }],
      ['model', 'agent', { sub: 1 }], ['mem', 'agent', { sub: 1 }], ['tool', 'agent', { sub: 1 }],
      ['score', 'pd'], ['pd', 'send'], ['send', 'pgOut'], ['pgOut', 'hot'], ['hot', 'alert', { lbl: 'sí' }], ['alert', 'sched'],
      ['hot', 'sched', { lbl: 'no', path: 'M462,290 C482,290 478,238 505,238 L560,238 C590,238 582,290 596,290', lx: 532, ly: 232 }]]
  },
  cron: {
    name: 'Cron · Seguimientos', tab: 'Seguimientos', sub: 'Revisa cada 5 minutos si toca escribirle a alguien',
    nodes: [
      { id: 'tick', x: 50, y: 92, ic: 'sched', l: 'Schedule Trigger', s: 'cada 5 min', k: 'trig' },
      { id: 'due', x: 150, y: 92, ic: 'pg', l: 'Postgres', s: 'envíos vencidos' },
      { id: 'alive', x: 250, y: 92, ic: 'ifn', l: '¿Sigue activo?', s: 'sin baja ni respuesta' },
      { id: 'win', x: 350, y: 92, ic: 'ifn', l: '¿Ventana 24 h?', s: 'If' },
      { id: 'free', x: 475, y: 40, ic: 'ai', l: 'IA · texto libre', s: 'personalizado', k: 'ai' },
      { id: 'tpl', x: 475, y: 165, ic: 'tpl', l: 'Plantilla Meta', s: 'aprobada' },
      { id: 'send', x: 610, y: 92, ic: 'wa', l: 'WhatsApp', s: 'enviar' },
      { id: 'mark', x: 475, y: 300, ic: 'pg', l: 'Postgres', s: 'marcar enviado' },
      { id: 'note', x: 595, y: 300, ic: 'pd', l: 'Pipedrive', s: 'actividad' }
    ],
    edges: [['tick', 'due'], ['due', 'alive'], ['alive', 'win', { lbl: 'sí' }], ['win', 'free', { lbl: 'abierta', lx: 392, ly: 58 }], ['win', 'tpl', { lbl: 'cerrada', lx: 392, ly: 140 }],
      ['free', 'send'], ['tpl', 'send'],
      ['send', 'mark', { path: 'M642,92 C668,92 672,120 672,150 L672,228 Q672,244 656,244 L430,244 Q414,244 414,260 L414,284 Q414,300 443,300', ix: 520, iy: 238 }], ['mark', 'note']]
  },
  close: {
    name: 'Cierre · Prueba → pago → alta', tab: 'Cierre', sub: 'Del pago a la inscripción en FitCo',
    nodes: [
      { id: 'pdTrig', x: 50, y: 70, ic: 'pd', l: 'Pipedrive Trigger', s: 'etapa = Asistió', k: 'trig' },
      { id: 'sw', x: 160, y: 70, ic: 'sw', l: 'Switch', s: 'según objetivo' },
      { id: 'offer', x: 290, y: 70, ic: 'ai', l: 'IA · oferta', s: 'paquete recomendado', k: 'ai' },
      { id: 'sendOffer', x: 420, y: 70, ic: 'wa', l: 'WhatsApp', s: 'enviar oferta' },
      { id: 'sub', x: 50, y: 270, ic: 'wa', l: 'Comprobante', s: 'desde Entrada', k: 'trig' },
      { id: 'read', x: 150, y: 270, ic: 'eye', l: 'IA · leer imagen', s: 'monto y operación' },
      { id: 'confirm', x: 255, y: 270, ic: 'user', l: 'Confirmación', s: 'Alberto aprueba' },
      { id: 'fitco', x: 360, y: 270, ic: 'fitco', l: 'FitCo', s: 'alta del cliente' },
      { id: 'won', x: 465, y: 270, ic: 'pd', l: 'Pipedrive', s: 'deal ganado' },
      { id: 'welcome', x: 570, y: 270, ic: 'wa', l: 'WhatsApp', s: 'bienvenida' }
    ],
    edges: [['pdTrig', 'sw'], ['sw', 'offer', { lbl: 'boda' }], ['offer', 'sendOffer'],
      ['sub', 'read'], ['read', 'confirm'], ['confirm', 'fitco'], ['fitco', 'won'], ['won', 'welcome']]
  }
};
let curWF = null;

// mismo espacio de coordenadas que el lienzo original (686 × 380)
const CW = 686, CH = 380;
const nodeW = n => n.k === 'ai' ? 98 : n.k === 'sub' ? 46 : 64;
function edgePath(wf, e) {
  const a = wf.nodes.find(n => n.id === e[0]), b = wf.nodes.find(n => n.id === e[1]), o = e[2] || {};
  if (o.path) return o.path;
  if (o.sub) return `M${a.x},${a.y - 23} C${a.x},${a.y - 50} ${b.x},${b.y + 60} ${b.x},${b.y + 32}`;
  const x1 = a.x + nodeW(a) / 2, x2 = b.x - nodeW(b) / 2, dx = Math.max(24, (x2 - x1) / 2);
  return `M${x1},${a.y} C${x1 + dx},${a.y} ${x2 - dx},${b.y} ${x2},${b.y}`;
}
function drawWF(id) {
  curWF = id; const wf = WF[id];
  $('#wfName').textContent = wf.name; $('#wfSub').textContent = wf.sub;
  $$('#wfTabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.wf === id));
  const c = $('#canvas'); c.innerHTML = '';
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'wires'); svg.setAttribute('viewBox', `0 0 ${CW} ${CH}`); svg.setAttribute('preserveAspectRatio', 'none');
  svg.innerHTML = '<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9z" fill="#B4B9C4"/></marker><marker id="ar-on" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9z" fill="#34C759"/></marker></defs>';
  wf.edges.forEach(e => {
    const o = e[2] || {};
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', edgePath(wf, e)); p.setAttribute('class', 'wire' + (o.sub ? ' sub' : ''));
    if (!o.sub) p.setAttribute('marker-end', 'url(#ar)');
    p.id = 'w-' + e[0] + '-' + e[1]; svg.append(p);
    if (o.lbl) {
      const a = wf.nodes.find(n => n.id === e[0]);
      const t = document.createElementNS(NS, 'text'); t.setAttribute('class', 'branch');
      t.setAttribute('x', o.lx || a.x + nodeW(a) / 2 + 6); t.setAttribute('y', o.ly || a.y - 7); t.textContent = o.lbl; svg.append(t);
    }
    if (o.ix) {
      const a = wf.nodes.find(n => n.id === e[0]), b = wf.nodes.find(n => n.id === e[1]);
      const t = document.createElementNS(NS, 'text'); t.setAttribute('class', 'items'); t.id = 'wl-' + e[0] + '-' + e[1];
      t.setAttribute('x', o.path ? o.ix : (a.x + b.x) / 2 - 14); t.setAttribute('y', o.path ? o.iy : (a.y + b.y) / 2 + 17); t.textContent = '1 item'; svg.append(t);
    }
  });
  c.append(svg);
  wf.nodes.forEach(n => {
    const d = el('div', 'node' + (n.k ? ' ' + n.k : ''), IC[n.ic] + '<span class="st">' + IC.check + '</span>' +
      '<div class="lbl"><b>' + esc(n.l) + '</b>' + (n.s ? '<small>' + esc(n.s) + '</small>' : '') + '</div>');
    d.id = 'n-' + n.id; d.style.left = (n.x / CW * 100) + '%'; d.style.top = (n.y / CH * 100) + '%';
    c.append(d);
  });
  $('#log').innerHTML = '<li class="log-empty">Cada nodo que se ejecute aparecerá aquí, con lo que hizo.</li>';
}
function buildWFTabs() {
  const w = $('#wfTabs');
  Object.entries(WF).forEach(([id, wf]) => {
    const b = el('button', '', esc(wf.tab)); b.type = 'button'; b.dataset.wf = id; b.setAttribute('role', 'tab');
    b.onclick = () => { if (!S.busy) drawWF(id); }; w.append(b);
  });
}
function nodeOf(id) { return (WF[curWF].nodes.find(n => n.id === id) || {}); }
function logLine(st, state) {
  const n = nodeOf(st.n); const li = el('li', 'le ' + state,
    `<span class="ic">${IC[n.ic] || ''}</span><b>${esc(n.l)}</b><span class="ds">${st.d || ''}</span><span class="tm">${state === 'skip' ? 'omitido' : fmtT(S.now)}</span>`);
  const log = $('#log'); const em = $('.log-empty', log); if (em) em.remove();
  log.append(li); log.scrollTop = log.scrollHeight;
}
function lightWire(a, b) { const w = $('#w-' + a + '-' + b); if (w) { w.classList.add('on'); if (w.hasAttribute('marker-end')) w.setAttribute('marker-end', 'url(#ar-on)'); } const l = $('#wl-' + a + '-' + b); if (l) l.classList.add('on'); }
function setStatus(cls, txt) { const m = $('#execMeta'); m.className = 'status' + (cls ? ' ' + cls : ''); m.textContent = txt; }

async function runWF(id, steps, title) {
  drawWF(id);
  setStatus('run', 'Ejecutando…');
  const t0 = S.now.getTime(); let prev = null;
  for (const st of steps) {
    if (st.before) await st.before();
    const nd = $('#n-' + st.n);
    if (st.skip) { if (nd) { nd.classList.add('skip'); logLine(st, 'skip'); } continue; }
    if (nd) {
      const src = st.from || prev; if (src) lightWire(src, st.n);
      nd.classList.add('run');
      (st.subs || []).forEach(s => { const x = $('#n-' + s); if (x) x.classList.add('run'); lightWire(s, st.n); });
    }
    const ms = st.ms || Math.round(rnd(40, 180));
    await sleep(nd ? (st.real || 420) : Math.min(st.real || 300, 200));
    if (st.wait) await st.wait();
    tick(st.sec != null ? st.sec : ms / 1000);
    if (nd) {
      nd.classList.replace('run', 'ok');
      (st.subs || []).forEach(s => { const x = $('#n-' + s); if (x) x.classList.replace('run', 'ok'); });
      logLine(st, 'ok'); prev = st.n;
    }
    if (st.fn) await st.fn();
  }
  const secs = ((S.now.getTime() - t0) / 1000).toFixed(1);
  setStatus('ok', 'Exitosa en ' + secs.replace('.', ',') + ' s');
  return +secs;
}

/* =====================================================================
   LÓGICA: mensaje entrante, seguimientos, asistencia y pago
   ===================================================================== */
S.jobN = 0;
const isClass = d => { const w = d.getDay(), h = d.getHours(); return (w >= 1 && w <= 5 && h >= 18 && h < 22) || (w === 6 && h >= 17 && h < 22); };
const offHours = d => d.getHours() < 9 || d.getHours() >= 22 || d.getDay() === 0;
const short = (s, n = 60) => s.length > n ? s.slice(0, n) + '…' : s;

function setCtrls() {
  $('#btnNext').disabled = S.busy || !SC || S.step >= SC.beats.length;
  $('#btnFF').disabled = S.busy || !nextJob();
}
function nextJob() {
  const p = S.jobs.filter(j => j.status === 'prog' && j.lead === S.current).sort((a, b) => a.at - b.at);
  return p[0] || null;
}
function mkJob(L, k, name, at, extra = {}) {
  const j = Object.assign({ id: ++S.jobN, lead: L.id, k, name, at, status: 'prog', created: new Date(S.now) }, extra);
  S.jobs.push(j); return j;
}
function cancelJob(j, reason) {
  if (S.now - j.created < 30 * 60e3) S.jobs.splice(S.jobs.indexOf(j), 1);
  else { j.status = 'canc'; j.reason = reason; }
}
function quiet(d) {
  const x = new Date(d), h = x.getHours();
  if (h >= CONFIG.silencio.desde) { x.setDate(x.getDate() + 1); x.setHours(CONFIG.silencio.hasta, 0, 0, 0); return [x, true]; }
  if (h < CONFIG.silencio.hasta) { x.setHours(CONFIG.silencio.hasta, 0, 0, 0); return [x, true]; }
  return [x, false];
}
function planJobs(L, ev) {
  const res = { creados: [], cancelados: [] };
  const pend = () => S.jobs.filter(j => j.lead === L.id && j.status === 'prog');
  const seg = () => pend().filter(j => j.k[0] !== 'r');
  const cancel = (list, why) => list.forEach(j => { res.cancelados.push(j.name); cancelJob(j, why); });
  if (ev.optout) { cancel(pend(), 'Cancelado · pidió baja'); return res; }
  if (ev.book) {
    cancel(seg(), 'Cancelado · agendó');
    [['r24', 24, 'Recordatorio 24 h antes'], ['r2', 2, 'Recordatorio 2 h antes']].forEach(([k, h, n]) => {
      const at = addH(L.trial, -h);
      if (at > S.now) { mkJob(L, k, n, at, { tplName: k === 'r24' ? 'recordatorio_clase_prueba' : null }); res.creados.push(n + ' · ' + fmtDT(at)); }
    });
    return res;
  }
  if (ev.pause) { cancel(seg(), 'Cancelado · pospuso'); return res; }
  if (L.trial || L.consent !== true || L.lost || L.won || L.human) return res;
  cancel(seg(), 'Cancelado · respondió');
  CONFIG.cadencia.forEach(c => {
    const [at, adj] = quiet(addH(L.lastIn, c.h));
    mkJob(L, c.k, c.n, at, { adjusted: adj, tplName: c.k === 'd3' ? 'grupo_nuevo_principiantes' : c.k === 'd7' ? 'ultimos_cupos' : null });
    res.creados.push(c.n + ' · ' + fmtDT(at) + (adj ? ' (movido por horario de descanso)' : ''));
  });
  return res;
}

/* ---------- burbujas del estudio ---------- */
async function studioSays(L, msgs) {
  showTyping(false);
  for (let i = 0; i < msgs.length; i++) {
    const m = msgs[i];
    if (i) { showTyping(true); await sleep(650); showTyping(false); }
    chatPush(L, { kind: 'them', text: m.text.replace(/([ap])\.m\.\./g, '$1.m.'), at: new Date(S.now), tpl: m.tpl });
    if (m.btns) chatPush(L, { kind: 'btns', opts: m.btns, at: new Date(S.now) });
    if (m.cta) chatPush(L, { kind: 'btns', opts: [m.cta], cta: true, at: new Date(S.now) });
    if (m.voucher) chatPush(L, { kind: 'btns', opts: [m.voucher], voucher: true, at: new Date(S.now) });
  }
}
function userTap(L, item, opt) {
  item.used = opt;
  if (item.cta) { if (item.node) item.node.classList.add('used'); return payCta(L); }
  if (item.voucher) { if (item.node) item.node.classList.add('used'); return processInbound(L, L.lang === 'en' ? 'Done, just paid by Yape 🙌' : 'Listo, ya yapeé 🙌', { img: true }); }
  if (item.node) { item.node.classList.add('used'); $$('button', item.node).forEach(b => { if (b.textContent === opt) b.classList.add('tapped'); }); }
  return processInbound(L, opt, { button: true });
}
function toggleHuman(L) {
  L.human = !L.human;
  if (L.human) planJobs(L, { pause: true });
  renderCRM(); renderQueue();
}

/* ---------- mensaje entrante (workflow principal) ---------- */
async function processInbound(L, text, opts = {}) {
  S.busy = true; setCtrls();
  await openWA();
  const id = wamid(), inAt = new Date(S.now), first = !L.firstIn, prevIn = L.lastIn;
  if (first) L.firstIn = inAt;
  if (opts.img) L.chat.forEach(c => { if (c.voucher && !c.used) { c.used = true; if (c.node) c.node.classList.add('used'); } });
  chatPush(L, { kind: 'me', text, at: inAt, img: opts.img ? voucherHTML(L) : null });
  L.lastIn = inAt;
  if (isClass(inAt) || offHours(inAt)) S.stats.fueraHorario++;
  if (S.jobs.some(j => j.lead === L.id && j.status === 'sent' && j.k[0] !== 'r' && (!prevIn || j.at > prevIn))) L.flags.reengaged = true;
  await sleep(250);

  const R = L.human ? null : agentRespond(L, text);
  const old = L.score;
  const msgObj = opts.img ? { type: 'image', image: { mime_type: 'image/jpeg', id: '8817' + hex(8), caption: text } }
    : opts.button ? { type: 'interactive', interactive: { type: 'button_reply', button_reply: { id: 'btn_' + norm(text).replace(/[^a-z0-9]+/g, '_'), title: text } } }
    : { type: 'text', text: { body: text } };
  const payload = { object: 'whatsapp_business_account', entry: [{ changes: [{ field: 'messages', value: {
    messaging_product: 'whatsapp', metadata: { display_phone_number: '51963068846', phone_number_id: CONFIG.phoneNumberId },
    contacts: [{ profile: { name: L.name }, wa_id: L.wa }],
    messages: [Object.assign({ from: L.wa, id, timestamp: String(Math.floor(inAt / 1000)) }, msgObj)] } }] }] };

  const steps = [
    { n: 'trig', d: `Mensaje de ${esc(L.name)}: “${esc(short(text))}”`, j: payload, real: 520, sec: 0.3 },
    { n: 'dedupe', d: 'Mensaje nuevo (no es un reintento de Meta)', j: { wamid: id, ya_procesado: false }, real: 300, sec: 0.05 },
    { n: 'rafaga', d: 'Sin más mensajes en 6 s: se procesa 1 mensaje', j: { telefono: L.e164, espera_s: 6, mensajes_agrupados: 1 }, real: 520, sec: 6 },
    { n: 'pgIn', d: 'INSERT INTO mensajes … RETURNING id', j: { query: "INSERT INTO mensajes (telefono, direccion, texto, wamid) VALUES ($1, 'in', $2, $3) RETURNING id", id: S.rowId + 1 }, real: 320, sec: 0.04,
      fn: () => dbInsert(L, 'in', opts.img ? '[imagen] ' + text : text, id) },
    { n: 'human', d: L.human ? 'Sí: Alberto tomó esta conversación. El asistente no responde.' : 'No: responde el asistente', j: { etiqueta_humano: L.human }, real: 300, sec: 0.01 }
  ];

  if (L.human) {
    ['agent', 'score', 'pd', 'send', 'pgOut', 'hot', 'alert', 'sched'].forEach(n => steps.push({ n, skip: true, d: 'Pausado: atiende Alberto' }));
    await runWF('main', steps, L.name);
    ownerAlert({ head: '💬 ' + L.name + ' escribió', body: '“' + text + '”\nTú tienes esta conversación.' });
    S.busy = false; setCtrls(); return;
  }

  const tools = (R.ev.offered || R.ev.book || R.ev.pack) ? ['consultar_disponibilidad'] : [];
  const nMem = L.chat.filter(c => c.kind === 'me' || c.kind === 'them').length;
  steps.push({
    n: 'agent', subs: ['model', 'mem'].concat(tools.length ? ['tool'] : []), real: 1300, sec: rnd(1.8, 3.2), open: true,
    before: () => { showTyping(true); },
    // mensajes escritos a mano: responde el agente real de n8n; si no hay conexión, queda la respuesta simulada
    wait: opts.live ? async () => {
      const t0 = performance.now();
      const real = await askAgent(L, text);
      const st = steps.find(s => s.n === 'agent');
      st.sec = Math.max(0.8, (performance.now() - t0) / 1000);
      if (real) {
        R.out = [{ text: real }]; R.ev.escalate = false; R.ev.askedConsent = false;
        st.d = 'Respondió el <b>agente real</b>';
        steps.find(s => s.n === 'send').d = 'Respuesta enviada';
      } else st.d = 'Sin conexión con el agente: <b>respuesta de respaldo</b>';
    } : null,
    d: 'Entendió: <b>' + (INTENT[R.intent] || R.intent.replace(/_/g, ' ')) + '</b>',
    j: {
      modelo: CONFIG.modelo, idioma: R.upd.lang || L.lang,
      memoria: `últimos ${Math.min(nMem, 20)} mensajes de ${L.e164}`,
      herramientas_usadas: tools,
      salida: {
        respuesta: R.out.map(o => o.text), botones: R.out.flatMap(o => o.btns || (o.cta ? [o.cta] : [])), intencion: R.intent,
        datos_extraidos: Object.fromEntries(Object.entries({ objetivo: R.upd.objetivo, urgencia: R.upd.urgencia, modalidad: R.upd.modalidad, estilo: R.upd.estilo, clase_prueba: R.upd.trial ? iso(R.upd.trial) : undefined, acepta_avisos: R.upd.consent }).filter(([, v]) => v !== undefined))
      },
      tokens: { entrada: 1840 + nMem * 62, salida: 60 + R.out.reduce((a, o) => a + o.text.length, 0) / 4 | 0 }
    }
  });
  steps.push({
    n: 'score', real: 380, sec: 0.02,
    fn: () => {
      Object.assign(L, R.upd); if (R.upd.lang) L.flags.langSet = true;
      if (R.ev.askedConsent) L.askedConsent = true;
      if (R.ev.optout) { L.lost = true; L.consent = false; L.lostReason = 'No interesado, pidió baja'; S.stats.bajas++; }
      if (R.ev.book) { L.stage = 'Prueba agendada'; S.stats.pruebas++; L.acts.unshift({ icon: 'cal', text: 'Clase de prueba', when: fmtDay(L.trial) + ' · ' + fmtTshort(L.trial) }); }
      else if (L.stage === 'Nuevo' && L.objetivo) L.stage = 'Calificado';
      const sc = scoreOf(L); L.score = L.lost ? L.score : sc.total;
      const st = steps.find(s => s.n === 'score');
      st.d = `Puntaje ${old || 0} → <b>${L.score}</b> (${labelOf(L)[1]})`; st.j = { puntaje: L.score, etiqueta: labelOf(L)[1], reglas: sc.reglas };
    },
    d: 'Calcula puntaje', j: {}
  });
  // el log del puntaje se escribe después de calcularlo
  const scoreStep = steps[steps.length - 1]; const fnScore = scoreStep.fn; scoreStep.fn = null; scoreStep.before = fnScore;

  steps.push({
    n: 'pd', real: 520, sec: 0.6,
    before: () => {
      const s = steps.find(x => x.n === 'pd');
      s.d = first ? 'Ficha nueva creada en Pipedrive' : 'Ficha actualizada · etapa <b>' + (L.lost ? 'Perdido' : L.stage) + '</b>';
      s.j = { llamadas: [
        { metodo: 'GET', ruta: '/v1/persons/search?term=' + encodeURIComponent(L.e164) + '&fields=phone', resultado: first ? 'sin coincidencias' : 'persona #' + L.personId },
        first ? { metodo: 'POST', ruta: '/v1/persons', cuerpo: { name: L.name, phone: [{ value: L.e164, primary: true }] }, resultado: { id: L.personId } } : null,
        first ? { metodo: 'POST', ruta: '/v1/deals', cuerpo: { title: L.name + ' · ' + (L.objetivo || 'Prospecto WhatsApp'), person_id: L.personId, stage: L.stage }, resultado: { id: L.dealId } }
          : { metodo: 'PATCH', ruta: '/v1/deals/' + L.dealId, cuerpo: Object.assign({ stage: L.lost ? undefined : L.stage, status: L.lost ? 'lost' : undefined, puntaje_ia: L.score, objetivo: L.objetivo || undefined, clase_prueba: L.trial ? iso(L.trial) : undefined }) },
        { metodo: 'PUT', ruta: '/v1/notes/resumen_ia', cuerpo: { content: summaryOf(L) } }
      ].filter(Boolean) };
    },
    fn: () => { L.resumen = summaryOf(L); L.resumenAt = new Date(S.now); renderCRM(); renderFunnel(); if (!$('#rp-crm').classList.contains('on')) badge('crm'); }
  });
  steps.push({
    n: 'send', real: 420, sec: 0.4, d: R.out.length > 1 ? `${R.out.length} mensajes enviados` : 'Respuesta enviada',
    j: { metodo: 'POST', ruta: `/v21.0/${CONFIG.phoneNumberId}/messages`, cuerpo: R.out.map(o => o.cta ? { messaging_product: 'whatsapp', to: L.wa, type: 'interactive', interactive: { type: 'cta_url', body: { text: o.text }, action: { name: 'cta_url', parameters: { display_text: o.cta, url: 'https://pay.bachatastudio.com/mp/deal_' + L.dealId } } } } : o.btns
      ? { messaging_product: 'whatsapp', to: L.wa, type: 'interactive', interactive: { type: 'button', body: { text: o.text }, action: { buttons: o.btns.map((b, i) => ({ type: 'reply', reply: { id: 'opt_' + (i + 1), title: b } })) } } }
      : { messaging_product: 'whatsapp', to: L.wa, type: 'text', text: { body: o.text } }), respuesta: { messages: [{ id: wamid() }] } },
    fn: async () => {
      await studioSays(L, R.out);
      if (first) S.stats.tiempos.push((S.now - inAt) / 1000);
      S.stats.respuestas++;
    }
  });
  steps.push({ n: 'pgOut', real: 280, sec: 0.04, d: `${R.out.length} fila(s) en mensajes`, fn: () => R.out.forEach(o => dbInsert(L, 'out', o.text, wamid())) });

  const hotNow = L => L.score >= CONFIG.umbralCaliente && !L.alerted && !L.lost;
  steps.push({
    n: 'hot', real: 300, sec: 0.01,
    before: () => { const s = steps.find(x => x.n === 'hot'); const h = hotNow(L); s.d = h ? `Sí: puntaje ${L.score} ≥ ${CONFIG.umbralCaliente}` : R.ev.escalate ? 'Sí: pregunta que debe responder Alberto' : `No: puntaje ${L.score} < ${CONFIG.umbralCaliente}`; s.j = { puntaje: L.score, umbral: CONFIG.umbralCaliente, escalar: !!R.ev.escalate, alertar: h || !!R.ev.escalate }; }
  });
  const alertStep = { n: 'alert', real: 420, sec: 0.4, d: 'Mensaje a Alberto' };
  alertStep.before = () => {
    if (!(hotNow(L) || R.ev.escalate)) { alertStep.skip = true; alertStep.d = 'No hace falta alertar'; schedStep.from = 'hot'; }
  };
  alertStep.fn = () => {
    if (R.ev.escalate) {
      ownerAlert({ head: '❓ Pregunta para ti', body: `${L.name} preguntó: “${text}”\nLe dije que le respondes al terminar la clase.`,
        btns: [{ t: 'Tomar conversación', fn: () => toggleHuman(L) }, { t: 'Ver en Pipedrive', fn: () => showR('crm') }] });
    } else {
      L.alerted = true;
      ownerAlert({ head: '🔥 Prospecto caliente · ' + L.score + ' pts', body: `${L.name} · ${L.objetivo || ''}${L.urgencia ? ' en ' + L.urgencia : ''}\n${L.trial ? 'Clase de prueba: ' + fmtDay(L.trial) + ', ' + fmtTshort(L.trial) : ''}\n${L.e164}`,
        btns: [{ t: 'Tomar conversación', fn: () => toggleHuman(L) }, { t: 'Ver en Pipedrive', fn: () => showR('crm') }] });
    }
  };
  steps.push(alertStep);
  const schedStep = { n: 'sched', real: 380, sec: 0.05 };
  schedStep.before = () => {
    const r = planJobs(L, R.ev);
    schedStep.d = r.creados.length ? `${r.creados.length} envío(s) programado(s)` + (r.cancelados.length ? `, ${r.cancelados.length} cancelado(s)` : '')
      : r.cancelados.length ? `${r.cancelados.length} envío(s) cancelado(s)` : (L.consent === true || L.trial ? 'Sin cambios en la cola' : 'Sin permiso de avisos: no se programa seguimiento');
    schedStep.j = r;
    renderQueue(); if ((r.creados.length || r.cancelados.length) && !$('#rp-seg').classList.contains('on')) badge('seg');
  };
  steps.push(schedStep);

  // los nodos con "before" que pueden marcarse como omitidos se resuelven antes del paso
  await runWF('main', steps, L.name);
  renderCRM(); renderFunnel(); renderQueue();
  if (R.ev.payment) await runPayment(L, 'yape');
  S.busy = false; setCtrls();
}

/* ---------- seguimientos (workflow cron) ---------- */
function jobMessage(L, j, free) {
  const n = first(L), EN = L.lang === 'en', P = plural(L);
  const s = nextSlots(S.now, 2);
  switch (j.k) {
    case 's8': return { text: EN ? `Good morning, ${n}! 🙂 Did you get a chance to look at the packages and schedule? If you have any questions, just write here.`
      : `¡Buen día, ${n}! 🙂 ¿Pudiste ver los paquetes y horarios? Si tienes alguna duda, escríbeme por aquí.` };
    case 's23': return { text: EN ? `${n}, one last message for today: if you're still deciding, you can try a 1-hour class for S/ ${CONFIG.prueba[0].p} and then pick your package. Interested?`
      : `${n}, te escribo una última vez por hoy: si todavía estás decidiendo, puedes probar con una clase de 1 hora por S/ ${CONFIG.prueba[0].p} y luego eliges tu paquete. ¿Te animas?`, btns: EN ? ['I want my trial class', 'Not now'] : ['Quiero mi clase de prueba', 'Ahora no'] };
    case 'd3': return { tpl: { cat: 'marketing', header: EN ? 'New beginner group' : 'Grupo nuevo desde cero', footer: EN ? 'Reply STOP to opt out' : 'Responde BAJA para no recibir más mensajes' },
      text: EN ? `Hi ${n}, a new ${(L.estilo || 'salsa & bachata').toLowerCase()} group for beginners starts this ${DIAS_EN[s[0].getDay()]} at Bachata Studio. Want to try a class, no strings attached?`
        : `Hola ${n}, este ${DIAS[s[0].getDay()]} empieza un grupo nuevo de ${(L.estilo || 'salsa y bachata').toLowerCase()} para principiantes en Bachata Studio. ¿Quieres probar una clase sin compromiso?`,
      btns: EN ? ['I want my trial class', 'Not now'] : ['Quiero mi clase de prueba', 'Ahora no'] };
    case 'd7': return { tpl: { cat: 'marketing', header: EN ? 'Last spots this month' : 'Últimos cupos del mes', footer: EN ? 'Reply STOP to opt out' : 'Responde BAJA para no recibir más mensajes' },
      text: EN ? `Hi ${n}, only a few spots left in this month's beginner group. If you're up for it, we'll save your trial class.` : `Hola ${n}, quedan pocos cupos en el grupo de principiantes de este mes. Si te animas, te separamos tu clase de prueba.`,
      btns: EN ? ['I want my trial class', 'Not now'] : ['Quiero mi clase de prueba', 'Ahora no'] };
    case 'r24': return Object.assign({ text: EN ? `Hi ${n}! Reminder: your trial class is tomorrow at ${fmtTshort(L.trial)}, ${CONFIG.direccion}.`
      : `Hola ${n}, ${P ? 'les' : 'te'} recordamos ${P ? 'su' : 'tu'} clase de prueba mañana a las ${fmtTshort(L.trial)} en ${CONFIG.direccion}.`, btns: EN ? ['Confirm', 'Reschedule'] : ['Confirmo', 'Reprogramar'] },
      free ? {} : { tpl: { cat: 'utilidad', header: EN ? 'Trial class reminder' : 'Recordatorio de clase', footer: 'Bachata Studio' } });
    case 'r2': return { text: EN ? `See you in 2 hours, ${n}! 💃 ${CONFIG.direccion}. Comfortable clothes are perfect.`
      : `¡${P ? 'Los' : 'Te'} esperamos en 2 horas, ${n}! 💃 ${CONFIG.direccion}. Con ropa cómoda es perfecto. Si ${P ? 'se retrasan, escríbannos' : 'te retrasas, escríbenos'} por aquí.`,
      tpl: free ? null : { cat: 'utilidad', header: EN ? 'Your class is today' : 'Tu clase es hoy', footer: 'Bachata Studio' } };
  }
}
async function runJob(j) {
  const L = S.leads[j.lead];
  S.busy = true; setCtrls();
  if (S.current !== L.id) switchLead(L.id);
  await advanceTo(j.at);
  const [cc, ct] = channelOf(j); const free = cc === 'free';
  const msg = jobMessage(L, j, free);
  const hrs = ((S.now - L.lastIn) / 3600e3).toFixed(1);
  const sentSeg = S.jobs.filter(x => x.lead === L.id && x.status === 'sent' && x.k[0] !== 'r').length;
  await runWF('cron', [
    { n: 'tick', d: 'Revisión programada', j: { hora: iso(S.now) }, real: 420, sec: 0.1 },
    { n: 'due', d: 'Toca: <b>' + esc(j.name) + '</b>', j: { query: "SELECT * FROM envios WHERE estado = 'programado' AND enviar_en <= now()", filas: [{ id: j.id, tipo: j.name, telefono: L.e164, enviar_en: iso(j.at) }] }, real: 380, sec: 0.05 },
    { n: 'alive', d: 'Sí: sin baja, sin compra y dentro del tope de 4', j: { baja: L.lost, cliente: L.won, acepta_avisos: L.consent, seguimientos_enviados: sentSeg, tope: 4 }, real: 320, sec: 0.01 },
    { n: 'win', d: free ? `Último mensaje hace ${hrs} h: <b>texto libre</b>` : `Último mensaje hace ${hrs} h: <b>requiere plantilla</b>`, j: { ultimo_mensaje_cliente: iso(L.lastIn), horas: +hrs, ventana_abierta: free }, real: 340, sec: 0.01 },
    free ? { n: 'free', from: 'win', d: 'Mensaje personalizado con el historial', j: { modelo: CONFIG.modelo, salida: msg.text }, real: 1000, sec: 2.1, open: true }
         : { n: 'free', skip: true, d: 'Ventana cerrada' },
    free ? { n: 'tpl', skip: true, d: 'No hace falta plantilla' }
         : { n: 'tpl', from: 'win', d: 'Plantilla <b>' + esc(msg.tpl ? msg.tpl.header : 'recordatorio') + '</b>', j: { template: { name: j.tplName || 'recordatorio_clase', language: { code: L.lang }, category: msg.tpl ? msg.tpl.cat.toUpperCase() : 'UTILITY', components: [{ type: 'body', parameters: [{ type: 'text', text: first(L) }] }] }, estado_meta: 'APPROVED' }, real: 420, sec: 0.05, open: true },
    { n: 'send', from: free ? 'free' : 'tpl', d: 'Enviado a ' + esc(first(L)), j: { metodo: 'POST', ruta: `/v21.0/${CONFIG.phoneNumberId}/messages`, respuesta: { messages: [{ id: wamid(), message_status: 'accepted' }] } }, real: 420, sec: 0.4,
      fn: async () => {
        await studioSays(L, [msg]);
        j.status = 'sent'; j.sentAs = [cc, ct]; S.stats.seguimientos++;
        renderQueue(); renderFunnel();
      } },
    { n: 'mark', d: "UPDATE envios SET estado = 'enviado'", real: 280, sec: 0.03, fn: () => dbInsert(L, 'out', (msg.tpl ? '[plantilla] ' : '') + msg.text, wamid()) },
    { n: 'note', d: 'Actividad registrada en el deal', j: { metodo: 'POST', ruta: '/v1/activities', cuerpo: { deal_id: L.dealId, subject: j.name, done: 1, type: 'whatsapp' } }, real: 340, sec: 0.3,
      fn: () => { L.acts.push({ icon: 'wa', text: j.name + (free ? ' · texto libre' : ' · plantilla'), when: fmtDT(S.now), done: true }); renderCRM(); } }
  ], j.name);
  S.busy = false; setCtrls();
}

/* ---------- asistencia y pago (workflow de cierre) ---------- */
async function runAsistio(L) {
  S.busy = true; setCtrls();
  const after = addH(L.trial, 1.2);
  if (S.now < after) await advanceTo(after);
  const boda = /boda/i.test(L.objetivo || '');
  const EN = L.lang === 'en';
  L.value = CONFIG.paquetes[1].p;
  const offer = EN ? `Great class today, ${first(L)}! 💃 To keep dancing, choose your package: ${packTxt(true)}.`
    : `¡Qué bien ${boda ? 'bailaron' : 'te fue'} hoy, ${first(L)}! 💃 Para seguir aprendiendo, elige ${boda ? 'su' : 'tu'} paquete de clases: ${packTxt(false)}.`;
  await runWF('close', [
    { n: 'pdTrig', d: 'Alberto marcó “asistió” en Pipedrive', j: { event: 'updated.deal', current: { id: L.dealId, stage: 'Asistió' }, previous: { stage: 'Prueba agendada' } }, real: 500, sec: 0.5,
      fn: () => { L.stage = 'Asistió'; L.acts.forEach(a => { if (a.icon === 'cal') a.done = true; }); L.resumen = summaryOf(L); renderCRM(); renderFunnel(); } },
    { n: 'sw', d: 'Rama: <b>' + (boda ? 'boda' : 'general') + '</b>', j: { objetivo: L.objetivo, rama: boda ? 'boda' : 'general' }, real: 300, sec: 0.01 },
    { n: 'offer', d: 'Oferta de paquetes tras la clase', j: { modelo: CONFIG.modelo, salida: offer, botones: packBtns(L), valor_deal: L.value }, real: 1000, sec: 2.2, open: true, before: () => showTyping(true) },
    { n: 'sendOffer', d: 'Oferta enviada', real: 380, sec: 0.4, fn: async () => { await studioSays(L, [{ text: offer, btns: packBtns(L) }]); dbInsert(L, 'out', offer, wamid()); renderCRM(); } }
  ], L.name + ' · asistió');
  S.busy = false; setCtrls();
}

async function runPayment(L, method = 'yape') {
  await sleep(500);
  const pay = L.pay || Object.assign({ kind: 'pack' }, CONFIG.paquetes[1]);
  const trial = pay.kind === 'trial', mp = method === 'mp', EN = L.lang === 'en', P = plural(L);
  const what = trial ? 'Clase de prueba' : 'Paquete ' + pay.h + ' h';
  const op = L.op;
  L.value = pay.p;
  await runWF('close', [
    mp ? { n: 'sub', d: 'Webhook de Mercado Pago: pago aprobado', j: { evento: 'payment.updated', status: 'approved', monto: pay.p, moneda: 'PEN', external_reference: 'deal_' + L.dealId, telefono: L.e164 }, real: 450, sec: 0.2 }
       : { n: 'sub', d: 'Imagen recibida desde “WA · Entrada de mensajes”', j: { tipo: 'image', telefono: L.e164, deal_id: L.dealId }, real: 450, sec: 0.2 },
    mp ? { n: 'read', skip: true, d: 'No hace falta leer imagen: Mercado Pago ya aprobó el pago' }
       : { n: 'read', d: `Yape · S/ ${pay.p} · operación ${op}`, j: { modelo: CONFIG.modelo, extraido: { billetera: 'Yape', monto: pay.p, destinatario: 'Alberto Pér*', n_operacion: op }, coincide_con_deal: true }, real: 1100, sec: 2.4, open: true },
    mp ? { n: 'confirm', skip: true, d: 'Sin confirmación manual: el pago llegó aprobado' }
       : { n: 'confirm', d: 'Alberto confirmó el pago desde su WhatsApp', real: 300, sec: 40,
      wait: () => new Promise(res => {
        showR('owner');
        const a = ownerAlert({ head: '💰 Pago por confirmar', body: `${L.name} envió un Yape de S/ ${pay.p}\nOperación ${op} · ${what}`, btns: [{ t: 'Confirmar pago', fn: res }, { t: 'Revisar', fn: res }] });
        setTimeout(() => { if (!a.done) { a.done = 'Confirmar pago'; renderOwner(); res(); } }, 2600 * SPEED);
      }) },
    trial ? { n: 'fitco', d: 'Reserva de clase de prueba registrada en FitCo', j: { metodo: 'POST', ruta: '/reservations', cuerpo: { nombre: L.name, telefono: L.e164, clase: iso(L.trial), tipo: 'prueba_1h' }, respuesta: { id: 'RES-48217', estado: 'confirmada' } }, real: 520, sec: 0.8, before: () => showR('crm') }
          : { n: 'fitco', d: 'Cliente creado en FitCo', j: { metodo: 'POST', ruta: '/clients', cuerpo: { nombre: L.name, telefono: L.e164, plan: what }, respuesta: { id: 'CLI-20931', estado: 'activo' } }, real: 520, sec: 0.8, before: () => showR('crm') },
    trial ? { n: 'won', d: `Pago de la prueba registrado · S/ ${pay.p}`, j: { metodo: 'POST', ruta: '/v1/activities', cuerpo: { deal_id: L.dealId, subject: 'Pago clase de prueba', done: 1 } }, real: 420, sec: 0.4,
        fn: () => { L.paidTrial = true; L.acts.unshift({ icon: 'fitco', text: 'Clase de prueba pagada · S/ ' + pay.p + (mp ? ' · Mercado Pago' : ' · Yape'), when: fmtDT(S.now), done: true }); L.resumen = summaryOf(L); renderCRM(); renderFunnel(); } }
          : { n: 'won', d: `Venta de <b>S/ ${pay.p}</b> registrada`, j: { metodo: 'PUT', ruta: '/v1/deals/' + L.dealId, cuerpo: { status: 'won', value: pay.p, currency: 'PEN' } }, real: 420, sec: 0.4,
        fn: () => { L.won = true; L.stage = 'Ganado'; S.stats.ventas++; S.stats.monto += pay.p; L.acts.unshift({ icon: 'fitco', text: 'Alta en FitCo · ' + what + (mp ? ' · Mercado Pago' : ' · Yape'), when: fmtDT(S.now), done: false }); L.resumen = summaryOf(L); renderCRM(); renderFunnel(); } },
    { n: 'welcome', d: 'Confirmación enviada', real: 420, sec: 0.4, fn: async () => {
      const t = trial
        ? (EN ? `Payment confirmed! ✅ Your trial class is set for ${fmtDay(L.trial)}, ${fmtTshort(L.trial)} at ${CONFIG.direccion}. After class I'll tell you about our packages.`
              : `¡Pago confirmado! ✅ ${P ? 'Su' : 'Tu'} clase de prueba queda confirmada para el ${fmtDay(L.trial).toLowerCase()} a las ${fmtTshort(L.trial)} en ${CONFIG.direccion}. Al terminar ${P ? 'les' : 'te'} cuento de los paquetes.`)
        : (EN ? `Payment confirmed! 🎉 You're now enrolled at Bachata Studio. ${CONFIG.directorCorto} will message you to schedule your ${pay.h} hours.`
              : `¡Pago confirmado! 🎉 ${P ? 'Ya están inscritos' : 'Ya estás inscrito'} en Bachata Studio. ${CONFIG.directorCorto} ${P ? 'les' : 'te'} escribirá para coordinar ${P ? 'sus' : 'tus'} ${pay.h} horas. ¡A bailar!`);
      await studioSays(L, [{ text: t }]); dbInsert(L, 'out', t, wamid()); } }
  ], L.name + ' · pago ' + (mp ? 'Mercado Pago' : 'Yape'));
}

/* ---------- mini-web de pago (Mercado Pago, simulado) ---------- */
async function mpFlow(L) {
  const pay = L.pay || Object.assign({ kind: 'pack' }, CONFIG.paquetes[1]);
  const trial = pay.kind === 'trial';
  const planName = trial ? '1 Hora Grupal' : pay.h + ' horas Grupales';
  const clases = (trial ? 1 : pay.h) + ' Clases Presenciales';
  const email = norm(L.name).replace(/[^a-z ]/g, '').trim().replace(/\s+/g, '.') + '@gmail.com';
  const v = $('#mpView'); v.hidden = false;
  const head = '<div class="mp-bar"><span class="lock">🔒</span> reservas.bachatastudio.com</div>';
  const screen = async (html, ms, pre) => {
    v.innerHTML = head + html; v.scrollTop = 0;
    const b = $('[data-go]', v);
    const clicked = new Promise(r => { if (b) b.onclick = r; });
    if (pre) pre();
    await Promise.race([clicked, sleep(ms)]);
    if (b) { b.classList.add('tapped'); await sleep(260); }
  };
  const stepper = n => `<div class="wz-steps">${['Plan', 'Descuento', 'Comprar'].map((s, i) => `<div class="${i + 1 < n ? 'ok' : i + 1 === n ? 'on' : ''}"><i>${i + 1 < n ? '✓' : i + 1}</i><span>${s}</span></div>`).join('<hr>')}</div>`;
  const type = async (id, txt) => { const e = $('#' + id, v); if (!e) return; e.value = ''; for (const ch of txt) { e.value += ch; await sleep(22); } };

  // 1. inicio de sesión o registro
  await screen(`<div class="mp-pg"><div class="fit-logo"><b>FIT</b>co</div><h3>Inicia sesión para reservar</h3><p class="mut">Si aún no tienes cuenta, se crea con tu correo.</p>
    <label>Correo</label><input id="mpEm" readonly placeholder="correo@ejemplo.com"><label>Contraseña</label><input id="mpPw" readonly type="password" placeholder="••••••••">
    <button class="mp-btn" data-go>Ingresar</button><div class="mp-or">o <u>Crear cuenta</u></div></div>`, 4200,
    async () => { await sleep(500); await type('mpEm', email); await type('mpPw', '••••••••'); });
  // 2. elegir plan
  const card = (t, sub, price, sel) => `<div class="pl ${sel ? 'sel' : ''}"><div><b>${t}</b> <small>${sub}</small></div><strong>${price}</strong></div>`;
  const plansHTML = `<div class="mp-pg lav"><div class="eyebrow">PLANES FLEXIBLES</div><h2>Baila a tu ritmo.</h2>
    ${CONFIG.paquetes.map(x => card(x.h + ' horas', 'Vigencia: ' + x.v, 'S/ ' + x.p, !trial && x.h === pay.h)).join('')}
    <button class="mp-btn" ${trial ? '' : 'data-go'}>ELEGIR PAQUETE</button><div class="mp-or">o</div><p class="mut c"><b>Prueba una clase S/. 60</b></p>
    ${CONFIG.prueba.map(x => card(x.h + (x.h === 1 ? ' hora' : ' horas'), 'Clase de prueba', 'S/. ' + x.p, trial && x.h === 1)).join('')}
    <button class="mp-btn" ${trial ? 'data-go' : ''}>ELEGIR CLASE DE PRUEBA</button></div>`;
  await screen(plansHTML, 2800);
  // 3. asistente: plan → descuento → comprar
  const modal = (n, body, nextTxt, back) => plansHTML.replace('data-go', '') + `<div class="mp-dim"><div class="wz">${stepper(n)}${body}<div class="wz-ft">${back ? '<button class="mp-ghost">Atrás</button>' : '<span></span>'}<button class="mp-btn sm" data-go>${nextTxt}</button></div></div></div>`;
  await screen(modal(1, `<h4>${planName}</h4><div class="wz-row"><div>S/. <b>${pay.p}</b><small>Duración: ${trial ? '1 mes' : pay.v}</small></div><div><b>Múltiples tipos de clases:</b><small>• ${clases}</small></div></div>`, 'Siguiente', false), 2400);
  await screen(modal(2, `<h4>Forma de pago</h4><label class="rd"><i class="on"></i>Tarjeta de crédito/débito</label><label class="rd"><i></i>Presencial</label><h4>Código de Descuento</h4><p class="mut">¿Tienes un código? ▾</p>`, 'Siguiente', true), 2400);
  await screen(modal(3, `<div class="wz-sum"><b>Resumen de pago</b><div><span>Plan:</span><span>S/. ${pay.p}</span></div><div class="tot"><span>Total:</span><span>S/. ${pay.p}</span></div></div>`, 'Comprar Ahora', true), 2400);
  // 4. checkout con Mercado Pago
  await screen(`<div class="mp-pg co"><div class="co-h"><div class="fit-logo sm"><b>FIT</b>co</div><span>Checkout</span></div><h3>Paga con tu tarjeta</h3><p class="mut">Procesado con Mercado Pago Bricks. Seguro y rápido.</p>
    <div class="co-chips"><span><b class="mpb">MP</b> Mercado Pago</span><span>🛡 Pagos cifrados SSL</span></div>
    <div class="co-tot"><span>Resumen</span><b>Total S/ ${pay.p}.00</b></div><div class="co-it"><span>${planName}<small>plan · x1</small></span><b>S/ ${pay.p}.00</b></div>
    <div class="co-card"><h5>Paga con tarjeta <em>VISA ◉ ●● AMEX</em></h5>
    <label>NÚMERO DE TARJETA</label><input id="cn" readonly placeholder="1234 1234 1234 1234"><div class="two"><div><label>VENCIMIENTO (MM/AA)</label><input id="cv" readonly placeholder="MM/AA"></div><div><label>CÓDIGO (CVV)</label><input id="cc" readonly placeholder="Ej.: 123"></div></div>
    <label>TITULAR DE LA TARJETA</label><input id="ct" readonly placeholder="María López"><label>DOCUMENTO DEL TITULAR</label><input id="cd" readonly placeholder="DNI 99999999"><label>EMAIL</label><input id="ce" readonly placeholder="ejemplo@email.com">
    <button class="mp-btn pay" data-go>🔒 PAGAR AHORA</button></div></div>`, 9000,
    async () => { v.scrollTop = 150; await sleep(400); await type('cn', '4509 9535 6623 3704'); await type('cv', '11/29'); await type('cc', '123'); v.scrollTop = 330; await type('ct', L.name.toUpperCase()); await type('cd', 'DNI 4' + L.op.slice(0, 7)); await type('ce', email); await sleep(500); });
  // 5. pago aprobado
  await screen(`<div class="mp-pg ok"><div class="okc">✓</div><h3>Pago aprobado</h3><p class="mut">S/ ${pay.p}.00 · ${planName}<br>Volviendo a WhatsApp…</p></div>`, 1700);
  v.hidden = true; v.innerHTML = '';
}
async function payCta(L) {
  S.busy = true; setCtrls();
  await mpFlow(L);
  await runPayment(L, 'mp');
  S.busy = false; setCtrls();
}

/* ---------- comprobante de Yape ---------- */
const voucherHTML = L => {
  const p = (L.pay && L.pay.p) || 350, d = S.now;
  const fecha = `${String(d.getDate()).padStart(2, '0')} ${MESES[d.getMonth()]}. ${d.getFullYear()} | ${fmtT(d).replace(/([ap])\.m\./, '$1. m.')}`;
  const code = L.op.slice(-3).split('').map(c => `<i>${c}</i>`).join('');
  return `<div class="yp"><div class="yp-sb"><b>${fmtT(d).replace(/ [ap]\.m\./, '')}</b><span>▂▄▆ ᯤ <em>41</em></span></div>
    <div class="yp-top"><div class="yp-yo"><i>S/</i><b>yo</b></div><svg class="yp-med" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="none" stroke="#C9A7E8" stroke-width="1.2" stroke-dasharray="1.5 2.5"/><circle cx="50" cy="50" r="38" fill="#3CC6C0" opacity=".25"/><circle cx="50" cy="50" r="30" fill="#7A2C93"/><path d="M34 74c2-16 8-26 16-26s14 10 16 26z" fill="#9B5CC0"/><circle cx="50" cy="42" r="11" fill="#B88BD6"/><path d="M39 38c2-9 20-9 22 0" fill="none" stroke="#3CC6C0" stroke-width="3"/></svg><div class="yp-name">ALBERTO<br>PÉREZ</div><div class="yp-x">✕</div></div>
    <div class="yp-card"><div class="yp-h"><b>¡Yapeaste!</b><span>⌥ Compartir</span></div><div class="yp-amt"><small>S/</small>${p}</div><div class="yp-to">Alberto Pér*</div><div class="yp-dt">▦ ${fecha}</div>
    <div class="yp-sec"><span>CÓDIGO DE SEGURIDAD <u>i</u></span><em>${code}</em></div>
    <div class="yp-dat"><div class="t">DATOS DE LA TRANSACCIÓN</div><div class="r"><span>Nro. de celular</span><b>*** *** 846</b></div><div class="r"><span>Destino</span><b>Yape</b></div><div class="r"><span>Nro. de operación</span><b>${L.op}</b></div></div></div>
    <div class="yp-more"><b>Más en Yape</b> <u>Nuevo</u></div></div>`;
};

/* =====================================================================
   ESCENARIOS GUIADOS
   ===================================================================== */
const SCN = [
  { id: 'boda', t: 'Boda', s: 'directo a paquete',
    lead: { name: 'Andrea Quispe', e164: '+51 987 412 365', origen: 'Instagram · anuncio bodas' }, start: new Date(2026, 9, 20, 21, 47),
    beats: [
      { cap: 'Martes, 9:47 p.m. Alberto está <b>dictando clase</b> y no puede mirar el celular. Andrea llegó desde un anuncio de Instagram y ve la <b>página del estudio</b>. Toca el ícono de WhatsApp.' },
      { in: 'Hola! Me caso en 4 semanas y mi novio y yo no sabemos bailar. ¿Cuánto cuestan las clases?', cap: 'El asistente <b>responde en segundos</b> con los paquetes reales de la página, y en Pipedrive se crea la ficha sola.', tab: 'crm' },
      { tap: '8 horas · S/ 350', cap: 'Andrea elige su paquete. Puntaje 85: <b>prospecto caliente</b>, así que Alberto recibe una alerta.', tab: 'owner' },
      { tap: 'Pagar con Mercado Pago', cap: 'El asistente ofrece <b>dos formas de pago</b>: Mercado Pago (enlace directo) o Yape. Andrea elige tarjeta.' },
      { tap: 'Pagar S/ 350', alt: 'pay', cap: 'Se abre la página de pago: <b>login, plan, 3 pasos y formulario con Mercado Pago</b>. Al pagar, vuelve al chat.', tab: 'crm' },
      { cap: 'Pago aprobado: FitCo da el alta, el deal pasa a ganado y se envía la bienvenida. <b>Sin que Alberto deje de enseñar.</b>', tab: 'funnel' }
    ] },
  { id: 'seg', t: 'Seguimiento', s: 'indeciso → prueba',
    lead: { name: 'Carlos Mendoza', e164: '+51 954 230 718', origen: 'Google Maps · botón WhatsApp' }, start: new Date(2026, 9, 21, 19, 40),
    beats: [
      { cap: 'Miércoles, 7:40 p.m. Carlos mira la página y escribe por WhatsApp. Hoy, a este prospecto <b>nadie le vuelve a escribir</b>.' },
      { in: 'Hola, quisiera info de las clases de salsa para principiantes 🙂', cap: 'El asistente responde con paquetes y horarios. <b>No ofrece la clase de prueba</b>: eso se reserva para quien queda indeciso.', tab: 'crm' },
      { tap: 'Sí, avísame', cap: 'Carlos acepta los avisos… y deja de responder. Se programan 4 seguimientos.', tab: 'seg' },
      { ff: 1, cap: 'Jueves, 9:00 a.m. Primer seguimiento: un saludo sin presionar. El de las 3:41 a.m. se movió por el <b>horario de descanso</b>.' },
      { ff: 1, cap: 'Jueves, 6:41 p.m. <b>A las 23 h</b>, último texto libre antes de que cierre la ventana de 24 h: ahora sí le ofrece la <b>clase de prueba de S/ 60</b>.' },
      { tap: 'Quiero mi clase de prueba', cap: 'Carlos responde y los seguimientos pendientes se cancelan. El asistente muestra <b>horarios y precio</b>.' },
      { tapSlot: 1, cap: 'Primero elige horario. Para confirmar el lugar se paga la prueba (S/ 60).', tab: 'seg' },
      { tap: 'Pagar con Yape', cap: 'Esta vez elige <b>Yape</b>: el asistente le indica el número y pide el comprobante.' },
      { in: 'Listo, ya yapeé 🙌', img: 1, cap: 'La IA <b>lee el comprobante</b>, Alberto lo confirma con un toque y la reserva queda registrada en FitCo.', tab: 'owner' },
      { asistio: 1, cap: 'Carlos asiste. Alberto marca “asistió” y <b>solo ahora</b> el asistente le ofrece los paquetes.', tab: 'crm' },
      { cap: 'Del indeciso que nunca respondió a clase pagada y reservada: <b>0 minutos de Alberto</b>.', tab: 'funnel' }
    ] },
  { id: 'en', t: 'En inglés', s: 'inglés + Yape',
    lead: { name: 'Mark Thompson', e164: '+1 512 555 0148', origen: 'Google · bachatastudio.com' }, start: new Date(2026, 9, 22, 20, 15),
    beats: [
      { cap: 'Jueves, 8:15 p.m. Un extranjero, uno de los <b>públicos clave</b>, ve la web y abre WhatsApp.' },
      { in: 'Hi! I just moved to Lima. Do you teach bachata? I\'m a total beginner 🙈', cap: 'El agente detecta el idioma y <b>responde en inglés</b> con los paquetes. En Pipedrive todo queda en español.', tab: 'crm' },
      { tap: '4 hours · S/ 200', cap: 'Mark elige su paquete desde el botón.' },
      { tap: 'Pay with Yape', cap: 'Mismo flujo y mismas reglas, ahora en otro idioma. Elige <b>Yape</b>.', tab: 'seg' },
      { in: 'Done, just paid by Yape 🙌', img: 1, cap: 'La IA lee el comprobante, Alberto confirma y se registra el alta. <b>Sin trabajo extra</b> para el estudio.', tab: 'funnel' }
    ] },
  { id: 'baja', t: 'Baja', s: 'anti-spam',
    lead: { name: 'Lucía Fernández', e164: '+51 912 845 603', origen: 'TikTok · enlace en la bio' }, start: new Date(2026, 9, 23, 18, 30),
    beats: [
      { cap: 'Viernes, 6:30 p.m. Lucía revisa la web y pregunta el precio por WhatsApp.' },
      { in: 'Hola, ¿cuánto cuesta la mensualidad?', tab: 'crm', cap: 'Recibe los paquetes y la pregunta de cuál le interesa.' },
      { tap: 'Sí, avísame', cap: 'Acepta recibir avisos y se programa la secuencia.', tab: 'seg' },
      { ff: 1, cap: 'Sábado, 9:00 a.m. Sale el primer seguimiento.' },
      { in: 'Gracias, pero ya no me interesa', cap: 'Pide no recibir más mensajes. El asistente <b>se despide, cancela la secuencia</b> y cierra el deal como perdido.', tab: 'seg' },
      { cap: 'Así se cuida la <b>calidad del número</b> ante Meta: nadie recibe mensajes que no quiere.', tab: 'crm' }
    ] },
  { id: 'libre', t: 'Modo libre', s: 'el jurado escribe',
    lead: { name: 'Valeria Ríos', e164: '+51 999 214 087', origen: 'Demo en vivo' }, start: new Date(2026, 9, 20, 20, 30),
    beats: [
      { cap: 'Modo libre: toquen el <b>ícono de WhatsApp</b> de la página y escriban cualquier pregunta, como un prospecto. Responde el <b>agente real</b>: prueben con precios, horarios, la dirección o una boda.' }
    ] }
];
let SC = null;

function switchLead(id) { S.current = id; renderPhone(); renderCRM(); renderQueue(); setCtrls(); }
function caption(html) {
  $('#capTxt').innerHTML = html || '';
  $('#capStep').textContent = SC && SC.beats.length > 1 ? 'Paso ' + Math.min(S.step, SC.beats.length) + ' de ' + SC.beats.length : '';
  $('#capProg').style.width = SC ? (Math.min(S.step, SC.beats.length) / SC.beats.length * 100) + '%' : '0';
}
function resetLead(id) {
  const L = S.leads[id]; if (!L) return;
  if (L.won) { S.stats.ventas--; S.stats.monto -= L.value; }
  if (L.lost) S.stats.bajas--;
  S.jobs = S.jobs.filter(j => j.lead !== id);
  S.alerts = S.alerts.filter(a => !a.body.includes(L.name));
  S.order = S.order.filter(x => x !== id); delete S.leads[id];
}
function loadScenario(i) {
  if (S.busy) return;
  stopAuto();
  SC = SCN[i];
  resetLead(SC.id);
  const L = newLead(Object.assign({ id: SC.id, wa: SC.lead.e164.replace(/\D/g, ''), phoneFmt: SC.lead.e164 }, SC.lead));
  S.current = L.id; S.now = new Date(SC.start); S.step = 0;
  $$('#scns button').forEach((b, k) => b.setAttribute('aria-pressed', k === i));
  drawWF('main'); setStatus('', 'Esperando un mensaje');
  renderAll(); showR('crm'); showWeb(true);
  next();
}
async function next() {
  if (!SC || S.busy || S.step >= SC.beats.length) return;
  const b = SC.beats[S.step++]; const L = cur();
  caption(b.cap); setCtrls();
  if (b.in) { S.busy = true; setCtrls(); await sleep(400); await openWA(); await typeInto(b.in); await processInbound(L, b.in, { img: !!b.img }); }
  else if (b.tap || b.tapSlot) {
    let tapTxt = b.tapSlot ? slotLabel(L.offered[0], L.lang) : b.tap;
    const unused = [...L.chat].reverse().filter(c => c.kind === 'btns' && !c.used);
    // si el usuario ya tocó otra opción (p. ej. Yape en vez de Mercado Pago), el guion sigue por ese camino
    const it = unused.find(c => c.opts.includes(tapTxt)) || (b.alt === 'pay' ? unused.find(c => c.voucher) : null);
    if (it) {
      tapTxt = it.opts[0] === tapTxt || it.opts.includes(tapTxt) ? tapTxt : it.opts[0];
      S.busy = true; setCtrls(); await sleep(500);
      const btn = it.node && $$('button', it.node).find(x => x.textContent === tapTxt);
      if (btn) { btn.classList.add('tapped'); await sleep(350); }
      await userTap(L, it, tapTxt);
    }
  }
  else if (b.ff) { const j = nextJob(); if (j) await runJob(j); }
  else if (b.asistio) { await advanceTo(addH(L.trial, 1.2)); renderCRM(); await sleep(700); const x = $('#btnAsistio'); if (x) { x.classList.add('pulse'); await sleep(700); } await runAsistio(L); }
  if (b.tab) showR(b.tab);
  caption(b.cap);
  setCtrls();
  if (S.auto) { if (S.step < SC.beats.length) { await sleep(2600); if (S.auto) next(); } else stopAuto(); }
}
function stopAuto() { S.auto = false; $('#btnAuto span').textContent = 'Auto'; }

/* ---------- controles ---------- */
function init() {
  buildWFTabs();
  const sc = $('#scns');
  SCN.forEach((s, i) => { const b = el('button', '', esc(s.t)); b.type = 'button'; b.title = s.s; b.onclick = () => loadScenario(i); sc.append(b); });
  $('#btnNext').onclick = () => next();
  $('#btnFF').onclick = () => {
    if (S.busy) return;
    if (SC && SC.beats[S.step] && SC.beats[S.step].ff) return next();
    const j = nextJob(); if (j) runJob(j);
  };
  $('#btnAuto').onclick = () => {
    if (S.auto) return stopAuto();
    S.auto = true; $('#btnAuto span').textContent = 'Pausa'; next();
  };
  $('#btnReset').onclick = () => { if (!S.busy) location.reload(); };
  $$('#rTabs [data-rp]').forEach(t => t.onclick = () => showR(t.dataset.rp));
  $('#waForm').onsubmit = e => {
    e.preventDefault();
    const v = $('#waInput').value.trim(); if (!v || S.busy || !cur()) return;
    $('#waInput').value = ''; processInbound(cur(), v, { live: true });
  };
  $('#waFab').onclick = async () => { if (S.busy) return; await openWA(); $('#waInput').focus(); };
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); next(); }
    if (e.key === 'f' || e.key === 'F') $('#btnFF').click();
    if (e.key >= '1' && e.key <= '5') loadScenario(+e.key - 1);
  });
  const stage = $('#stage');
  const fit = () => { const s = Math.min(window.innerWidth / 1600, window.innerHeight / 900); stage.style.transform = 'scale(' + s + ')'; };
  window.addEventListener('resize', fit); fit();
  loadScenario(0);
}
init();
