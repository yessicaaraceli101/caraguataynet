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

// ---- Ubicación (geolocalización del navegador) ----
const btnLocation = document.getElementById('btnLocation');
const locationStatus = document.getElementById('locationStatus');
const btnLocationLabel = btnLocation.innerHTML;
let userCoords = null;

btnLocation.addEventListener('click', () => {
  if (!('geolocation' in navigator)) {
    locationStatus.textContent = 'Tu navegador no admite ubicación automática. Escribinos por WhatsApp para coordinar la instalación.';
    locationStatus.className = 'location-status error';
    return;
  }

  btnLocation.disabled = true;
  locationStatus.textContent = 'Obteniendo tu ubicación…';
  locationStatus.className = 'location-status';

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
      locationStatus.textContent = '📍 Ubicación agregada. Se enviará junto con tu solicitud.';
      locationStatus.className = 'location-status ok';
      btnLocation.innerHTML = '✓ Ubicación agregada';
      btnLocation.disabled = false;
    },
    (err) => {
      let message = 'No pudimos obtener tu ubicación. Es obligatoria para continuar: revisá los permisos e intentá de nuevo.';
      if (err.code === err.PERMISSION_DENIED) {
        message = 'Permiso de ubicación denegado. Es obligatorio compartir tu ubicación para enviar la solicitud: habilitalo en la configuración de tu navegador e intentá de nuevo.';
      }
      locationStatus.textContent = message;
      locationStatus.className = 'location-status error';
      btnLocation.disabled = false;
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

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

  // La ubicación es obligatoria
  if(!userCoords){
    contactMsg.textContent = 'Por favor, compartí tu ubicación antes de enviar la solicitud.';
    contactMsg.className = 'form-msg error';
    locationStatus.textContent = 'Este campo es obligatorio. Tocá "Compartir mi ubicación".';
    locationStatus.className = 'location-status error';
    return;
  }

  let text = `Hola, quiero pedir instalación de internet.\n`;
  text += `Nombre: ${name}\n`;
  text += `Teléfono: ${phone}\n`;
  text += `Barrio/Compañía: ${zone}`;
  const mapsUrl = `https://www.google.com/maps?q=${userCoords.lat},${userCoords.lng}`;
  text += `\nUbicación: ${mapsUrl}`;
  if (msg) {
    text += `\nMensaje: ${msg}`;
  }

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  contactMsg.textContent = `¡Gracias, ${name}! Te llevamos a WhatsApp para confirmar tu solicitud…`;
  contactMsg.className = 'form-msg ok';

  contactForm.reset();
  userCoords = null;
  btnLocation.innerHTML = btnLocationLabel;
  locationStatus.textContent = '';
  locationStatus.className = 'location-status';

  window.open(waUrl, '_blank', 'noopener');
});