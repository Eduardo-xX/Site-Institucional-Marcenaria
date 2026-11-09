// Configuração do cliente: trocar aqui quando o conteúdo for confirmado.
const SITE = {
  whatsapp: '5511953195421',
  nome: 'Marcenaria Hernandes',
};

const waLink = (text) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

// Todos os links com data-wa abrem o WhatsApp
document.querySelectorAll('[data-wa]').forEach((a) => {
  a.href = waLink('Olá! Vim pelo site e gostaria de um orçamento.');
  a.target = '_blank';
  a.rel = 'noopener';
});

// Menu mobile
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
menu.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  }
});

// Filtro da galeria
const chips = document.querySelectorAll('.chip');
const items = [...document.querySelectorAll('#gallery li')];
chips.forEach((chip) =>
  chip.addEventListener('click', () => {
    chips.forEach((c) => {
      c.classList.toggle('is-active', c === chip);
      c.setAttribute('aria-selected', c === chip);
    });
    const f = chip.dataset.filter;
    items.forEach((li) => (li.hidden = f !== 'todos' && li.dataset.cat !== f));
  })
);

// Lightbox
const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('img');
let current = 0;
const visible = () => items.filter((li) => !li.hidden);
function show(i) {
  const list = visible();
  current = (i + list.length) % list.length;
  const btn = list[current].querySelector('.g-item');
  lbImg.src = btn.dataset.full;
  lbImg.alt = btn.querySelector('img').alt;
}
items.forEach((li) =>
  li.querySelector('.g-item').addEventListener('click', () => {
    show(visible().indexOf(li));
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  })
);
const closeLb = () => {
  lb.hidden = true;
  document.body.style.overflow = '';
};
lb.querySelector('.lb-close').addEventListener('click', closeLb);
lb.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
lb.querySelector('.lb-next').addEventListener('click', () => show(current + 1));
lb.addEventListener('click', (e) => e.target === lb && closeLb());
document.addEventListener('keydown', (e) => {
  if (lb.hidden) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') show(current - 1);
  if (e.key === 'ArrowRight') show(current + 1);
});

// Formulário: monta a mensagem e abre o WhatsApp
document.getElementById('lead-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const nome = (f.get('nome') || '').trim();
  if (!nome) {
    e.target.nome.focus();
    return;
  }
  const amb = f.get('ambiente');
  const msg =
    `Olá! Meu nome é ${nome}.` +
    (amb ? ` Quero planejar: ${amb}.` : '') +
    ' Gostaria de um projeto/orçamento.';
  window.open(waLink(msg), '_blank', 'noopener');
});

// Animação de entrada
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    }),
  { threshold: 0.12 }
);
document
  .querySelectorAll('.section-head, .card, .diff-list li, .steps li, .reviews > *')
  .forEach((el) => {
    el.classList.add('reveal');
    io.observe(el);
  });

document.getElementById('year').textContent = new Date().getFullYear();
