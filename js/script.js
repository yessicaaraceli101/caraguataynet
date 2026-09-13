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

// ---- Formulario de contacto ----
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