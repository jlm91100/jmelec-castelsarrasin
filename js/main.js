/* JM-ELEC — Scripts */

// Navigation mobile
const navToggle = document.getElementById('navToggle');
const siteNav   = document.getElementById('siteNav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', siteNav.classList.contains('open'));
  });
}

// Active nav link
document.querySelectorAll('.site-nav a').forEach(a => {
  if (a.href === window.location.href) a.classList.add('active');
});

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    if (!open) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// Formulaire contact (simulation — à brancher sur Formspree ou EmailJS)
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('[type="submit"]');
    const succ = document.getElementById('formSuccess');
    btn.disabled = true;
    btn.textContent = 'Envoi en cours…';
    // TODO : remplacer par fetch('https://formspree.io/f/VOTRE_ID', { method:'POST', body: new FormData(form) })
    setTimeout(() => {
      form.reset();
      btn.style.display = 'none';
      if (succ) succ.style.display = 'block';
    }, 800);
  });
}
