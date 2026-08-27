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
