/* JM-ELEC — Scripts */

// ── Navigation mobile ────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const siteNav   = document.getElementById('siteNav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.textContent = isOpen ? '✕' : '☰';
  });
  // Fermer le menu si on clique en dehors
  document.addEventListener('click', e => {
    if (!navToggle.contains(e.target) && !siteNav.contains(e.target)) {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.textContent = '☰';
    }
  });
}

// ── Active nav link ──────────────────────────────────────────
document.querySelectorAll('.site-nav a').forEach(a => {
  if (a.href === window.location.href) a.classList.add('active');
});

// ── FAQ accordion ────────────────────────────────────────────
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

// ── Animations au scroll (Intersection Observer) ─────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.service-card, .trust-item, .zone-box, .contact-section').forEach(el => {
  el.classList.add('animate-on-scroll');
  observer.observe(el);
});

// ── Formulaire contact — Formspree ───────────────────────────
const FORMSPREE_ID = 'xvznvdlq'; 

const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validation basique
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      field.classList.remove('field-error');
      if (!field.value.trim()) {
        field.classList.add('field-error');
        valid = false;
      }
    });
    if (!valid) {
      const firstError = form.querySelector('.field-error');
      if (firstError) firstError.focus();
      return;
    }

    const btn  = form.querySelector('[type="submit"]');
    const succ = document.getElementById('formSuccess');
    const err  = document.getElementById('formError');

    btn.disabled = true;
    btn.innerHTML = '<span class="btn-spinner"></span> Envoi en cours…';
    if (err) err.style.display = 'none';

    // Si l'ID Formspree n'est pas encore configuré — afficher directement le succès
    if (FORMSPREE_ID === 'FORMSPREE_ID') {
      await new Promise(r => setTimeout(r, 800));
      form.reset();
      btn.style.display = 'none';
      if (succ) succ.style.display = 'block';
      return;
    }

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        btn.style.display = 'none';
        if (succ) succ.style.display = 'block';
        succ.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        throw new Error('Erreur serveur');
      }
    } catch {
      btn.disabled = false;
      btn.innerHTML = 'Envoyer ma demande de devis';
      if (err) err.style.display = 'block';
    }
  });
}
