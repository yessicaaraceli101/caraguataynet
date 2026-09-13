const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ---- Menú móvil ----
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// =====================================================
// RESEÑAS
// =====================================================
const REVIEWS_KEY = 'caraguataynet_reviews';

const defaultReviews = [
  {
    name: 'Rosa Benítez',
    rating: 5,
    text: 'Instalaron en dos días y desde entonces nunca más tuve cortes. Excelente atención.',
    date: '2026-08-02'
  },
  {
    name: 'Derlis Acosta',
    rating: 5,
    text: 'Antes tenía que reiniciar el router todos los días con otra empresa. Con Caraguatay.net no pasa más.',
    date: '2026-07-18'
  },
  {
    name: 'Liz Fernández',
    rating: 4,
    text: 'Buena velocidad y el técnico explicó todo bien. Tardaron un poco más de lo prometido pero valió la pena.',
    date: '2026-06-30'
  }
];

function loadReviews(){
  try{
    const raw = localStorage.getItem(REVIEWS_KEY);
    if(!raw){
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(defaultReviews));
      return [...defaultReviews];
    }
    return JSON.parse(raw);
  }catch(e){
    return [...defaultReviews];
  }
}

function saveReviews(list){
  try{
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(list));
  }catch(e){ /* localStorage no disponible: la reseña queda solo en esta sesión */ }
}

function starsMarkup(rating){
  let out = '';
  for(let i = 1; i <= 5; i++){
    out += i <= rating ? '★' : '<span class="off">★</span>';
  }
  return out;
}

function formatDate(iso){
  try{
    return new Date(iso + 'T00:00:00').toLocaleDateString('es-PY', { year:'numeric', month:'long', day:'numeric' });
  }catch(e){ return iso; }
}

function renderReviews(){
  const list = loadReviews();
  const ul = document.getElementById('reviewsList');
  const summary = document.getElementById('reviewSummary');

  ul.innerHTML = list.slice().reverse().map(r => `
    <li class="review-item">
      <div class="review-stars" aria-label="${r.rating} de 5 estrellas">${starsMarkup(r.rating)}</div>
      <p class="review-text">${escapeHtml(r.text)}</p>
      <div class="review-meta">
        <span>${escapeHtml(r.name)}</span>
        <span>${formatDate(r.date)}</span>
      </div>
    </li>
  `).join('');

  if(list.length){
    const avg = (list.reduce((a, r) => a + r.rating, 0) / list.length).toFixed(1);
    summary.textContent = `${avg} de 5 · ${list.length} reseña${list.length === 1 ? '' : 's'}`;
  } else {
    summary.textContent = 'Todavía no hay reseñas. ¡Sé el primero en dejar la tuya!';
  }
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

renderReviews();


const starButtons = document.querySelectorAll('#starInput .star');
const ratingInput = document.getElementById('revRating');

function setRating(value){
  ratingInput.value = value;
  starButtons.forEach(btn => {
    const v = Number(btn.dataset.value);
    btn.classList.toggle('is-active', v <= value);
    btn.setAttribute('aria-checked', String(v === value));
  });
}

starButtons.forEach(btn => {
  btn.addEventListener('click', () => setRating(Number(btn.dataset.value)));
  btn.addEventListener('mouseenter', () => {
    starButtons.forEach(b => b.classList.toggle('is-hover', Number(b.dataset.value) <= Number(btn.dataset.value)));
  });
  btn.addEventListener('mouseleave', () => {
    starButtons.forEach(b => b.classList.remove('is-hover'));
  });
});

// ---- Envío del formulario de reseñas ----
const reviewForm = document.getElementById('reviewForm');
const reviewMsg = document.getElementById('reviewMsg');

reviewForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('revName').value.trim();
  const text = document.getElementById('revText').value.trim();
  const rating = Number(ratingInput.value);

  if(!name || !text){
    reviewMsg.textContent = 'Completá tu nombre y comentario antes de publicar.';
    reviewMsg.className = 'form-msg error';
    return;
  }
  if(!rating){
    reviewMsg.textContent = 'Elegí un puntaje de estrellas.';
    reviewMsg.className = 'form-msg error';
    return;
  }

  const list = loadReviews();
  list.push({
    name,
    rating,
    text,
    date: new Date().toISOString().slice(0, 10)
  });
  saveReviews(list);
  renderReviews();

  reviewForm.reset();
  setRating(0);
  reviewMsg.textContent = '¡Gracias! Tu reseña ya está publicada.';
  reviewMsg.className = 'form-msg ok';
});


const WHATSAPP_NUMBER = '595213397689';

const contactForm = document.getElementById('contactForm');
const contactMsg = document.getElementById('contactMsg');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('ctName').value.trim();
  const phone = document.getElementById('ctPhone').value.trim();
  const zone = document.getElementById('ctZone').value.trim();
  const msg = document.getElementById('ctMsg').value.trim();

  if(!name || !phone || !zone){
    contactMsg.textContent = 'Completá nombre, teléfono y barrio o compañía.';
    contactMsg.className = 'form-msg error';
    return;
  }

  const phonePattern = /^[0-9+()\s-]{6,20}$/;
  if(!phonePattern.test(phone)){
    contactMsg.textContent = 'Revisá el número de teléfono.';
    contactMsg.className = 'form-msg error';
    return;
  }

  
  let text = `Hola, quiero pedir instalación de internet.\n`;
  text += `Nombre: ${name}\n`;
  text += `Teléfono: ${phone}\n`;
  text += `Barrio/Compañía: ${zone}`;
  if (msg) {
    text += `\nMensaje: ${msg}`;
  }

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  contactMsg.textContent = `¡Gracias, ${name}! Te llevamos a WhatsApp para confirmar tu solicitud…`;
  contactMsg.className = 'form-msg ok';

  contactForm.reset();


  window.open(waUrl, '_blank', 'noopener');
});