window.SERCLE_WORLDS = [
  { id:'aeon',      name:'Aeon',      copy:'Explore Earth across time.',                         status:'live',   publicUrl:'https://aeon.sercle.com' },
  { id:'atmos',     name:'Atmos',     copy:'A digital home for presence and ambience.',          status:'live',   publicUrl:'https://atmos.sercle.com' },
  { id:'narrative', name:'Narrative', copy:'A workspace for shaping stories.',                   status:'soon' },
  { id:'cast',      name:'Cast',      copy:'Actors, identity, behavior, and performance.',       status:'dev' },
  { id:'audio',     name:'Audio',     copy:'Voice, sound, and acoustic intelligence.',           status:'dev' },
  { id:'forge',     name:'Forge',     copy:'Build the assets and structures of worlds.',         status:'dev' },
  { id:'lens',      name:'Lens',      copy:'Camera, optics, attention, and visual language.',    status:'dev' },
  { id:'render',    name:'Render',    copy:'Turn worlds into rendered reality.',                 status:'dev' },
  { id:'stage',     name:'Stage',     copy:'Turn stories into audiovisual productions.',         status:'dev' },
  { id:'cinema',    name:'Cinema',    copy:'A place for finished films and stories.',            status:'future' },
  { id:'loop',      name:'Loop',      copy:'A social world for discovering and sharing video.',  status:'future' }
];
window.SERCLE_STATUS = {
  live:   { label:'Live',           cls:'s-live',   help:'Open to the public today.' },
  soon:   { label:'Coming soon',    cls:'s-soon',   help:'Announced; not yet open.' },
  dev:    { label:'In development', cls:'s-dev',    help:'Being built; not yet open.' },
  future: { label:'Future',         cls:'s-future', help:'Planned for later.' }
};
window.worldImage = function (id) { return 'assets/img/worlds-hd/world-' + id + '-portrait-720.jpg'; };
window.WORLD_FOCUS = { aeon: '50% 30%', atmos: '50% 25%', narrative: '50% 45%', cast: '62% 32%', audio: '70% 40%', forge: '50% 50%', lens: '42% 50%', render: '40% 40%', stage: '50% 50%', cinema: '50% 40%', loop: '50% 42%' };
window.WORLD_D2 = ['atmos', 'cast', 'loop', 'forge', 'stage', 'cinema'];
window.worldDisclosure = function (id) { return window.WORLD_D2.indexOf(id) < 0 ? '' : '<figcaption class="ai-note">AI-generated illustration. The people shown are not intended to depict real persons.</figcaption>'; };
window.worldPicture = function (id, sizes, kind, eager) {
  var b = 'assets/img/worlds-hd/world-' + id + '-', set, fb, w, h;
  if (kind === 'portrait') { set = function (f) { return b + 'portrait-360.' + f + ' 360w, ' + b + 'portrait-480.' + f + ' 480w, ' + b + 'portrait-540.' + f + ' 540w, ' + b + 'portrait-720.' + f + ' 720w, ' + b + 'portrait-1122.' + f + ' 1122w'; }; fb = b + 'portrait-720.jpg'; w = 720; h = 900; }
  else if (kind === 'square') { set = function (f) { return b + 'square-240.' + f + ' 240w, ' + b + 'square-320.' + f + ' 320w, ' + b + 'square-480.' + f + ' 480w'; }; fb = b + 'portrait-720.jpg'; w = 480; h = 480; }
  else { set = function (f) { return b + 'wide-400.' + f + ' 400w, ' + b + 'wide-800.' + f + ' 800w, ' + b + 'wide-1122.' + f + ' 1122w'; }; fb = b + 'wide-800.jpg'; w = 800; h = 500; }
  var fp = kind === 'portrait' ? ' class="fp-' + id + '"' : '';
  return '<picture class="media world-bg-' + id + '">' +
    '<source type="image/avif" srcset="' + set('avif') + '" sizes="' + sizes + '">' +
    '<source type="image/webp" srcset="' + set('webp') + '" sizes="' + sizes + '">' +
    '<img' + fp + ' src="' + fb + '" alt="" width="' + w + '" height="' + h + '" decoding="async"' + (eager ? '' : ' loading="lazy"') + '></picture>';
};
