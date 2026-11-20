(function () {
  var LOGO = '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><path d="M69.837 32.572A32 32 0 1 0 69.837 67.428"/><circle cx="81.784" cy="50" r="5.12"/></svg>';
  window.SERCLE_LOGO = LOGO;
  var NAV = [
    { href: 'index.html', label: 'Home', key: 'home', mobileOnly: true },
    { href: 'worlds.html', label: 'Worlds', key: 'worlds' },
    { href: 'about.html', label: 'About', key: 'about' },
    { href: 'not-in-prototype.html#community', label: 'Community', key: 'community', unavailable: true },
    { href: 'not-in-prototype.html#pricing', label: 'Pricing', key: 'pricing', unavailable: true },
    { href: 'support.html', label: 'Support', key: 'support' }
  ];
  var NA = '<span class="visually-hidden"> (not available yet)</span>';
  function navItems(current, includeMobileOnly) {
    return NAV.filter(function (n) { return includeMobileOnly || !n.mobileOnly; }).map(function (n) {
      var cur = n.key === current ? ' aria-current="page"' : '';
      var cls = n.unavailable ? ' class="is-unavailable"' : '';
      return '<li><a href="' + n.href + '"' + cur + cls + '>' + n.label + (n.unavailable ? NA : '') + '</a></li>';
    }).join('');
  }
  function banner() {
    return '';
  }
  // Image failure: 'error' does not bubble, so listen in the capture phase. Registered while <head> is parsed, before any <img>.
  window.sercleImgFail = function (img) { var p = img.closest('picture'); if (p) p.classList.add('img-failed'); img.remove(); };
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG' && t.closest('picture')) window.sercleImgFail(t);
  }, true);
  window.renderChrome = function (opts) {
    opts = opts || {};
    var top = document.getElementById('chrome-top');
    if (top && !top.dataset.rendered) {
      top.dataset.rendered = '1';
      var header = opts.header === false ? '' :
        '<header class="site-header' + (opts.overlay ? ' overlay' : '') + '">' +
          '<a class="brand" href="index.html" aria-label="Sercle home">' + LOGO + '<span class="wordmark">SERCLE</span></a>' +
          '<nav class="primary-nav" aria-label="Primary"><ul>' + navItems(opts.current, false) + '</ul></nav>' +
          '<div class="head-actions">' +
            '<button class="icon-btn search-btn" type="button" aria-disabled="true" aria-describedby="search-na"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><span class="visually-hidden">Search</span></button><span id="search-na" class="visually-hidden">Search is not available yet</span>' +
            '<a class="text-link" href="account.html#sign-in"' + (opts.current === 'account' ? ' aria-current="page"' : '') + '>Sign in<span class="visually-hidden"> (placeholder)</span></a>' +
            '<a class="btn btn-ghost" href="account.html#create-account">Create account<span class="visually-hidden"> (placeholder)</span></a>' +
            '<button class="icon-btn menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 7h18M3 12h18M3 17h18"/></svg><span class="visually-hidden">Menu</span></button>' +
          '</div>' +
          '<nav class="mobile-menu" id="mobile-menu" aria-label="Primary (mobile)" data-open="false"><ul>' + navItems(opts.current, true) +
            '<li><a href="account.html#create-account">Create account<span class="visually-hidden"> (placeholder)</span></a></li></ul></nav>' +
        '</header>';
      top.innerHTML = '<a class="skip-link" href="#main">Skip to content</a>' + banner() + header;
      wireMenu(top);
    }
    var foot = document.getElementById('chrome-footer');
    if (foot && !foot.dataset.rendered) {
      foot.dataset.rendered = '1';
      foot.innerHTML = '<footer class="site-footer"><div class="footer-inner">' +
        '<a class="brand" href="index.html" aria-label="Sercle home">' + LOGO + '<span class="wordmark">SERCLE</span></a>' +
        '<nav aria-label="Legal and company"><ul>' +
          '<li><a href="privacy.html">Privacy</a></li><li><a href="terms.html">Terms</a></li>' +
          '<li><a href="about.html">About</a></li><li><a href="not-in-prototype.html#careers">Careers</a></li>' +
          '<li><a href="not-in-prototype.html#contact">Contact</a></li><li><a href="credits.html">Credits</a></li></ul></nav>' +
        '<p class="footer-note">A more open tomorrow.</p></div></footer>';
    }
    document.querySelectorAll('[aria-disabled="true"]').forEach(function (el) {
      if (el.dataset.inert) return; el.dataset.inert = '1';
      el.addEventListener('click', function (e) { e.preventDefault(); });
    });
  };
  // CSP-clean boot: <div id="chrome-top" data-current="home" data-overlay="true"></div> then <script src="assets/js/chrome-boot.js">.
  window.chromeOptsFrom = function (el) {
    var d = (el && el.dataset) || {};
    return { current: d.current, overlay: d.overlay === 'true', header: d.header === 'false' ? false : undefined };
  };
  function wireMenu(root) {
    var btn = root.querySelector('.menu-toggle'), menu = root.querySelector('#mobile-menu');
    if (!btn || !menu) return;
    function set(open) {
      btn.setAttribute('aria-expanded', String(open)); menu.setAttribute('data-open', String(open));
      if (open) { var f = menu.querySelector('a'); if (f) f.focus(); }
    }
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); }
    });
    menu.addEventListener('focusout', function (e) {
      if (!menu.contains(e.relatedTarget) && e.relatedTarget !== btn) set(false);
    });
  }
  window.statusChip = function (s) {
    var st = window.SERCLE_STATUS[s];
    return '<span class="status ' + st.cls + '">' + st.label + '</span>';
  };
})();
