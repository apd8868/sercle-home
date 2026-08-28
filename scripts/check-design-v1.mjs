import { readFile } from 'node:fs/promises';

const home = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../public/styles.css', import.meta.url), 'utf8');
const js = await readFile(new URL('../public/site.js', import.meta.url), 'utf8');

for (const world of ['Aeon', 'Atmos', 'Narrative', 'Cast', 'Audio', 'Forge', 'Lens', 'Render', 'Stage', 'Cinema', 'Loop']) {
  if (!home.includes(world)) throw new Error(`Missing world: ${world}`);
}
for (const forbidden of ['narrative.sercle.com', 'cast.sercle.com', 'audio.sercle.com', 'forge.sercle.com', 'lens.sercle.com', 'render.sercle.com', 'stage.sercle.com', 'cinema.sercle.com', 'loop.sercle.com', 'product-grid', 'product-card', 'three.js', 'webgl', '<video']) {
  if ((home + css + js).toLowerCase().includes(forbidden)) throw new Error(`Unsafe or heavy marker: ${forbidden}`);
}
for (const live of ['https://aeon.sercle.com', 'https://atmos.sercle.com']) {
  if (!(home + js).includes(live)) throw new Error(`Missing live link: ${live}`);
}
for (const definition of [
  "aeon:{name:'AEON',copy:'Explore Earth across time.',status:'LIVE',href:'https://aeon.sercle.com'}",
  "atmos:{name:'ATMOS',copy:'A digital home for presence and ambience.',status:'LIVE',href:'https://atmos.sercle.com'}",
  "narrative:{name:'NARRATIVE',copy:'A workspace for shaping stories.',status:'COMING SOON'}",
]) {
  if (!js.includes(definition)) throw new Error(`World link/status contract changed: ${definition}`);
}
for (const anchorRequirement of [
  '<a class="detail-enter" data-detail-enter hidden>',
  '<span class="sr-only" data-enter-label></span>',
  "enter.href=world.href",
  "enter.hidden=false",
  "enter.removeAttribute('href')",
  "${world.name}, external site",
]) {
  if (!(home + js).includes(anchorRequirement)) throw new Error(`Enter accessibility contract changed: ${anchorRequirement}`);
}
if (!css.includes('.detail-enter{') || !css.includes('min-height:44px')) throw new Error('Enter touch target must remain at least 44 CSS px');
for (const token of ['height:100dvh', 'overflow:hidden', '.orbit-map', '.sercle-home', '@media(prefers-reduced-motion:reduce)', 'min-width:44px', 'min-height:44px']) {
  if (!css.includes(token)) throw new Error(`Missing R6 CSS requirement: ${token}`);
}
for (const behavior of ['ArrowRight', 'ArrowLeft', 'Enter', 'Escape', 'aria-selected', 'prefers-reduced-motion: reduce', 'requestAnimationFrame']) {
  if (!js.includes(behavior)) throw new Error(`Missing R6 behavior: ${behavior}`);
}
for (const removed of ['class="hero"', 'class="discovery"', 'class="section directory"', 'class="section editorial"', '<footer']) {
  if (home.includes(removed)) throw new Error(`Scrolling-homepage marker remains: ${removed}`);
}
if ((home.match(/role="option"/g) || []).length !== 11) throw new Error('Homepage must expose exactly eleven semantic world options');
console.log('Sercle Design V1 R6 single-viewport universe checks passed.');
