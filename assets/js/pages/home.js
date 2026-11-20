// UIUX-014: homepage world gallery (moved unchanged from the UIUX-009 inline script; CSP script-src 'self').
document.getElementById('world-grid').innerHTML = SERCLE_WORLDS.map(function (w) {
  return '<li><a class="world-card" href="world.html#' + w.id + '">' +
    worldPicture(w.id, '(max-width:359px) calc(100vw - 32px), (max-width:599px) calc(50vw - 22px), (max-width:1023px) calc(33vw - 30px), 210px', 'portrait') +
    '<span class="body">' + statusChip(w.status) + '<h3>' + w.name + '</h3><p>' + w.copy + '</p><span class="go" aria-hidden="true">→</span></span>' +
    '<span class="visually-hidden">. Open preview.</span></a></li>';
}).join('') + '<li class="world-more"><p><strong>More to come.</strong>The universe is just the beginning.</p></li>';
