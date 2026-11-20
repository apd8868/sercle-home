// UIUX-014: world directory (moved from the UIUX-009 inline script). Change: the card image kind (square < 600 px, wide
// otherwise) now follows viewport changes instead of being fixed at first render.
(function () {
  var filters = [{ k: 'all', label: 'All' }, { k: 'live', label: 'Live' }, { k: 'soon', label: 'Coming soon' }, { k: 'dev', label: 'In development' }, { k: 'future', label: 'Future' }];
  var state = { status: 'all', q: '' };
  var narrow = window.matchMedia('(max-width:599px)');
  var fg = document.getElementById('status-filters');
  fg.innerHTML = filters.map(function (f) {
    var n = f.k === 'all' ? SERCLE_WORLDS.length : SERCLE_WORLDS.filter(function (w) { return w.status === f.k; }).length;
    return '<button class="chip" type="button" data-k="' + f.k + '" aria-pressed="' + (f.k === 'all') + '">' + f.label + ' <span class="count">' + n + '</span></button>';
  }).join('');
  var initial = (location.hash || '').replace('#', '');
  if (filters.some(function (f) { return f.k === initial; })) state.status = initial;
  function render() {
    fg.querySelectorAll('.chip').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.k === state.status)); });
    var q = state.q.trim().toLowerCase();
    var list = SERCLE_WORLDS.filter(function (w) {
      return (state.status === 'all' || w.status === state.status) && (!q || w.name.toLowerCase().indexOf(q) > -1 || w.copy.toLowerCase().indexOf(q) > -1);
    });
    document.getElementById('dir-grid').innerHTML = list.map(function (w) {
      return '<li><a class="dir-card" href="world.html#' + w.id + '">' +
        '<figure>' + worldPicture(w.id, '(max-width:599px) 136px, (max-width:1023px) calc(50vw - 40px), 312px', narrow.matches ? 'square' : 'wide') + '</figure>' +
        '<span class="body">' + statusChip(w.status) + '<h2>' + w.name + '</h2><p>' + w.copy + '</p><span class="more">Preview <span aria-hidden="true">→</span></span></span></a></li>';
    }).join('');
    document.getElementById('empty').hidden = list.length > 0;
    document.getElementById('result-line').textContent = list.length + (list.length === 1 ? ' world' : ' worlds') + ' shown';
  }
  fg.addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    state.status = b.dataset.k; history.replaceState(null, '', state.status === 'all' ? 'worlds.html' : '#' + state.status); render();
  });
  document.getElementById('q').addEventListener('input', function (e) { state.q = e.target.value; render(); });
  document.getElementById('reset').addEventListener('click', function () {
    state.status = 'all'; state.q = ''; document.getElementById('q').value = ''; history.replaceState(null, '', 'worlds.html'); render(); document.getElementById('q').focus();
  });
  window.addEventListener('hashchange', function () {
    var k = (location.hash || '').replace('#', '');
    state.status = filters.some(function (f) { return f.k === k; }) ? k : 'all'; render();
  });
  // r2 (review finding 5): a re-render on zoom or rotation must not drop keyboard focus from a card.
  function onNarrowChange() {
    var a = document.activeElement, card = a && a.closest && a.closest('#dir-grid .dir-card'), href = card && card.getAttribute('href');
    render();
    if (href) { var again = document.querySelector('#dir-grid .dir-card[href="' + href + '"]'); if (again) again.focus(); }
  }
  if (narrow.addEventListener) narrow.addEventListener('change', onNarrowChange); else if (narrow.addListener) narrow.addListener(onNarrowChange);
  render();
})();
