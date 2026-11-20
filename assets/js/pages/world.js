// UIUX-014: World preview (moved from the UIUX-009 inline script). Changes: no inline style attributes; an unknown
// world id shows a not-found state instead of silently showing Aeon; an empty hash still opens the first World.
function showWorld() {
  var id = (location.hash || '#' + SERCLE_WORLDS[0].id).slice(1);
  var i = SERCLE_WORLDS.findIndex(function (w) { return w.id === id; });
  var pager = document.getElementById('pager');
  if (i < 0) {
    var safe = id.replace(/[^a-z0-9-]/gi, '').slice(0, 40);
    document.title = 'World not found — Sercle';
    document.getElementById('world').innerHTML = '<div class="not-found"><p class="eyebrow">World preview</p><h1>World not found</h1>' +
      '<p class="copy">There is no public World called “' + safe + '”. The directory lists all eleven Worlds.</p>' +
      '<p><a class="btn btn-primary" href="worlds.html">All worlds <span aria-hidden="true">→</span></a></p></div>';
    pager.innerHTML = ''; pager.hidden = true;
    return;
  }
  pager.hidden = false;
  var w = SERCLE_WORLDS[i], st = SERCLE_STATUS[w.status], live = w.status === 'live';
  document.title = w.name + ' — Sercle';
  document.getElementById('world').innerHTML =
    '<div class="world-hero">' +
      '<figure>' + worldPicture(w.id, '(max-width:1023px) 100vw, 50vw', 'wide', true) + (window.worldDisclosure ? worldDisclosure(w.id) : '') + '</figure>' +
      '<div><p class="eyebrow">World preview</p><h1>' + w.name + '</h1><p class="copy">' + w.copy + '</p>' +
      '<dl class="facts"><dt>Public status</dt><dd>' + statusChip(w.status) + ' <span class="help-inline">— ' + st.help + '</span></dd>' +
      (live ? '<dt>Public address</dt><dd>' + w.publicUrl.replace('https://', '') + '</dd>' : '') +
      '</dl>' +
      (live
        ? '<a class="btn btn-primary world-enter" href="' + w.publicUrl + '" rel="noopener">Enter ' + w.name + '<span class="visually-hidden">, external site</span></a>' +
          '<p class="notice" id="enter-note">' + w.name + ' is live. Enter opens ' + w.publicUrl.replace('https://', '') + '.</p></div>'
        : '<button class="btn btn-primary" type="button" aria-disabled="true" aria-describedby="enter-note">Enter ' + w.name + '</button>' +
          '<p class="notice" id="enter-note">' + w.name + ' is ' + st.label.toLowerCase() + '. Entry is not available.</p></div>') +
    '</div>';
  var prev = SERCLE_WORLDS[(i + SERCLE_WORLDS.length - 1) % SERCLE_WORLDS.length], next = SERCLE_WORLDS[(i + 1) % SERCLE_WORLDS.length];
  pager.innerHTML = '<a href="world.html#' + prev.id + '">← ' + prev.name + '</a><a href="world.html#' + next.id + '">' + next.name + ' →</a>';
  document.querySelectorAll('#world [aria-disabled="true"]').forEach(function (el) { el.addEventListener('click', function (e) { e.preventDefault(); }); });
}
window.addEventListener('hashchange', function () { showWorld(); document.getElementById('main').focus(); });
showWorld();
