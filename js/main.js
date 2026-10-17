document.getElementById('year').textContent = new Date().getFullYear();

// Nav shadow on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 8);
}, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('is-open'));
navLinks.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => navLinks.classList.remove('is-open'))
);

// Scroll-spy active link
const sections = document.querySelectorAll('main section[id]');
const navAnchors = navLinks.querySelectorAll('a[href^="#"]');
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach((a) => {
      a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach((s) => spyObserver.observe(s));

// Reveal-on-scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
