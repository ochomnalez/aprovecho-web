// Sitio de Aprovecho: navegación, ilustraciones, demo embebida y aparición de
// los bloques al bajar. Sin librerías; se carga como módulo.
import { ilus } from './ilus.js';

// ---------- ilustraciones de la app, dibujadas en el sitio ----------
document.querySelectorAll('[data-ilus]').forEach(el => {
  el.innerHTML = ilus(el.dataset.ilus, +el.dataset.tam || 72);
});

// ---------- la cabecera se despega al bajar ----------
const cabecera = document.getElementById('cabecera');
const mirarScroll = () => cabecera.classList.toggle('pegada', window.scrollY > 8);
mirarScroll();
addEventListener('scroll', mirarScroll, { passive: true });

// ---------- menú ----------
const hamburguesa = document.getElementById('hamburguesa');
const desp = document.getElementById('desp-eco');
const despBtn = desp?.querySelector('.menu-btn');
const enChico = () => matchMedia('(max-width:1000px)').matches;

function abrirMenu(abierto) {
  document.body.classList.toggle('menu-abierto', abierto);
  hamburguesa.setAttribute('aria-expanded', String(abierto));
  hamburguesa.setAttribute('aria-label', abierto ? 'Cerrar el menú' : 'Abrir el menú');
  if (!abierto) abrirDesp(false);
}
function abrirDesp(abierto) {
  desp?.classList.toggle('abierto', abierto);
  despBtn?.setAttribute('aria-expanded', String(abierto));
}

hamburguesa?.addEventListener('click', () => abrirMenu(!document.body.classList.contains('menu-abierto')));
despBtn?.addEventListener('click', () => abrirDesp(!desp.classList.contains('abierto')));
// en pantalla grande el desplegable también responde al mouse
desp?.addEventListener('mouseenter', () => { if (!enChico()) abrirDesp(true); });
desp?.addEventListener('mouseleave', () => { if (!enChico()) abrirDesp(false); });
document.addEventListener('click', e => {
  if (desp && !desp.contains(e.target) && !enChico()) abrirDesp(false);
  if (enChico() && document.body.classList.contains('menu-abierto') && !e.target.closest('.cabecera')) abrirMenu(false);
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  abrirDesp(false);
  if (document.body.classList.contains('menu-abierto')) { abrirMenu(false); hamburguesa.focus(); }
});
addEventListener('resize', () => { if (!enChico()) abrirMenu(false); });

// ---------- comprar / vender (solo en la portada) ----------
const tabs = [
  { btn: document.getElementById('tab-persona'), panel: document.getElementById('panel-persona') },
  { btn: document.getElementById('tab-local'), panel: document.getElementById('panel-local') },
].filter(t => t.btn && t.panel);
tabs.forEach(({ btn }, i) => {
  btn.addEventListener('click', () => {
    tabs.forEach(({ btn: b, panel: p }, j) => {
      const activo = i === j;
      b.classList.toggle('activo', activo);
      b.setAttribute('aria-selected', String(activo));
      p.classList.toggle('oculto', !activo);
      p.hidden = !activo;
      // el panel escondido no baja sus fotos; al mostrarlo, que empiecen ya
      if (activo) p.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
    });
  });
});
document.querySelector('.selector')?.addEventListener('keydown', e => {
  const i = tabs.findIndex(t => t.btn === document.activeElement);
  if (i < 0) return;
  const paso = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
  if (!paso) return;
  e.preventDefault();
  const sig = tabs[(i + paso + tabs.length) % tabs.length].btn;
  sig.focus();
  sig.click();
});

// ---------- la demo de verdad, dentro del teléfono ----------
const APP = 'https://ochomnalez.github.io/aprovecho-app/';
const boton = document.getElementById('probar-aca');
boton?.addEventListener('click', () => {
  const pantalla = boton.closest('.telefono-pantalla');
  const marco = document.createElement('iframe');
  marco.src = APP;
  marco.title = 'Demo de la app Aprovecho';
  marco.allow = 'geolocation; clipboard-write';
  pantalla.replaceChildren(marco);
  pantalla.classList.add('jugando');
  const nota = document.getElementById('telefono-nota');
  if (nota) nota.innerHTML = 'Es la app de verdad, con datos simulados. <a href="' + APP + '" target="_blank" rel="noopener">Abrirla en grande</a>.';
});

// ---------- aparición al bajar ----------
const aparecen = [
  '.portada-texto', '.portada-demo', '.portada-seccion .contenedor > *', '.dos-columnas > *',
  '.encabezado-seccion', '.selector', '.paso', '.plan', '.estado-col', '.ruta', '.equipo li',
  '.cierre-grilla > *', '.tarjeta', '.pieza > *', '.franja .contenedor > *', '.tiempo li', '.tabla-envoltura', '.bloque',
];
const nodos = document.querySelectorAll(aparecen.join(','));
if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
  nodos.forEach(n => n.classList.add('visible'));
} else {
  nodos.forEach((n, i) => {
    n.setAttribute('data-ap', '');
    n.style.transitionDelay = (i % 4) * 70 + 'ms';
  });
  const ojo = new IntersectionObserver(entradas => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('visible');
      ojo.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  nodos.forEach(n => ojo.observe(n));
  addEventListener('load', () => {
    nodos.forEach(n => { if (n.getBoundingClientRect().top < innerHeight) n.classList.add('visible'); });
  });
}
