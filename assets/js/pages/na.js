// UIUX-014: "not in this candidate" destinations (moved from the UIUX-009 inline script). Account destinations now live on
// account.html; the old keys are kept so earlier links still explain themselves.
var PAGES = {
  about: ['About', 'See the About page.'],
  community: ['Community', 'A Community page is not available yet.'],
  pricing: ['Pricing', 'Pricing is not published yet.'],
  support: ['Support', 'See the Support page.'],
  'create-account': ['Create account', 'Registration is not available yet. No account can be created.'],
  join: ['Join Sercle', 'Joining means creating a Sercle Account. Registration is not available yet.'],
  recovery: ['Password recovery', 'Password recovery is not available yet.'],
  privacy: ['Privacy', 'See the Privacy page.'],
  terms: ['Terms', 'See the Terms page.'],
  careers: ['Careers', 'A Careers page is not available yet.'],
  account: ['Sercle Account', 'Sercle Account is not available yet.'],
  contact: ['Contact', 'Contact details are on the Support page.']
};
function show() {
  var k = (location.hash || '').slice(1), p = PAGES[k] || ['This page', 'This page is not available yet.'];
  document.getElementById('na-title').textContent = p[0] + ' is not available yet.';
  document.getElementById('na-body').textContent = p[1];
  document.title = p[0] + ' — Sercle';
}
window.addEventListener('hashchange', show); show();
