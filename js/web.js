// Sitio de Aprovecho: cambio de lado en "Cómo funciona", demo embebida y
// aparición de los bloques al bajar. Sin librerías.

// ---------- la cabecera se despega al bajar ----------
const cabecera = document.getElementById('cabecera');
const mirarScroll = () => cabecera.classList.toggle('pegada', window.scrollY > 8);
mirarScroll();
addEventListener('scroll', mirarScroll, { passive: true });

// ---------- comprar / vender ----------
const tabs = [
  { btn: document.getElementById('tab-persona'), panel: document.getElementById('panel-persona') },
  { btn: document.getElementById('tab-local'), panel: document.getElementById('panel-local') },
];
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
// flechas del teclado, como espera un grupo de pestañas
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
  marco.loading = 'eager';
  pantalla.replaceChildren(marco);
  pantalla.classList.add('jugando');
  const nota = document.getElementById('telefono-nota');
  if (nota) nota.innerHTML = 'Es la app de verdad, con datos simulados. <a href="' + APP + '" target="_blank" rel="noopener">Abrirla en grande</a>.';
});

// ---------- aparición al bajar ----------
const aparecen = [
  '.portada-texto', '.portada-demo', '.dos-columnas > *', '.encabezado-seccion',
  '.selector', '.paso', '.plan', '.estado-col', '.ruta', '.equipo li', '.cierre-grilla > *',
];
const nodos = document.querySelectorAll(aparecen.join(','));
if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
  nodos.forEach(n => n.classList.add('visible'));
} else {
  nodos.forEach((n, i) => {
    n.setAttribute('data-ap', '');
    n.style.transitionDelay = (i % 4) * 70 + 'ms';
  });
  const ojo = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('visible');
      ojo.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  nodos.forEach(n => ojo.observe(n));
  // lo que ya está en pantalla al cargar no espera
  addEventListener('load', () => {
    nodos.forEach(n => { if (n.getBoundingClientRect().top < innerHeight) n.classList.add('visible'); });
  });
}
