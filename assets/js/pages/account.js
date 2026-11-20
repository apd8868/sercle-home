document.getElementById('logo-slot').outerHTML = SERCLE_LOGO;
(function () {
  var ENTRIES = {
    'sign-in': ['Sign in to Sercle', 'Sign-in will be provided by Sercle Account.', '/sign-in'],
    'create-account': ['Create your account', 'Registration will be provided by Sercle Account.', '/sign-up'],
    join: ['Join Sercle', 'Joining will mean creating a Sercle Account.', '/sign-up'],
    recovery: ['Account recovery', 'Account recovery will be provided by Sercle Account.', '/recovery']
  };
  function show() {
    var k = (location.hash || '').slice(1), e = ENTRIES[k] || ENTRIES['sign-in'];
    document.getElementById('acct-title').textContent = e[0];
    document.getElementById('acct-lede').textContent = e[1] + ' Sercle Account is not yet available, so nothing can be entered here.';
    document.getElementById('acct-route').textContent = e[2];
    document.title = e[0] + ' — Sercle Account placeholder';
  }
  window.addEventListener('hashchange', function () { show(); document.getElementById('main').focus(); });
  show();
})();
