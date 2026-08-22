const button = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');

button?.addEventListener('click', () => {
  const open = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!open));
  nav?.toggleAttribute('data-open', !open);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  button?.setAttribute('aria-expanded', 'false');
  nav.removeAttribute('data-open');
}));

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

