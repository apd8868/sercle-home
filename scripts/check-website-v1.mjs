import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';

// Sercle website V1 contract (replaces the R6 single-viewport check-design-v1.mjs).
const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const fail = (message) => { throw new Error(message); };

const pages = Object.fromEntries(await Promise.all(
  ['index.html', 'worlds.html', 'world.html', 'credits.html', 'account.html', 'not-in-prototype.html'].map(async (p) => [p, await read(p)]),
));
const data = await read('assets/js/worlds-data.js');
const world = await read('assets/js/pages/world.js');
const chrome = await read('assets/js/components.js');
const na = await read('assets/js/pages/na.js');

// Eleven Worlds, in order, with the two live public addresses.
const ids = [...data.matchAll(/\{ id:'([a-z]+)'/g)].map((m) => m[1]);
const expected = ['aeon', 'atmos', 'narrative', 'cast', 'audio', 'forge', 'lens', 'render', 'stage', 'cinema', 'loop'];
if (ids.join() !== expected.join()) fail(`World list changed: ${ids.join()}`);
for (const [id, url] of [['aeon', 'https://aeon.sercle.com'], ['atmos', 'https://atmos.sercle.com']]) {
  if (!new RegExp(`id:'${id}'[^}]*status:'live',\\s*publicUrl:'${url}'`).test(data)) fail(`Live World link missing: ${id}`);
}
for (const host of ['narrative', 'cast', 'audio', 'forge', 'lens', 'render', 'stage', 'cinema', 'loop']) {
  if ((data + world + Object.values(pages).join('')).includes(`${host}.sercle.com`)) fail(`Unresolved public host: ${host}.sercle.com`);
}

// Live Worlds get a real Enter link; other Worlds keep a disabled button.
for (const contract of [
  `'<a class="btn btn-primary world-enter" href="' + w.publicUrl + '" rel="noopener">Enter ' + w.name`,
  '<span class="visually-hidden">, external site</span></a>',
  'aria-disabled="true" aria-describedby="enter-note">Enter',
]) {
  if (!world.includes(contract)) fail(`Enter contract changed: ${contract}`);
}

// Footer and nav reach the real company and legal pages.
for (const link of ['href="privacy.html">Privacy', 'href="terms.html">Terms', 'href="about.html">About', "href: 'about.html'", "href: 'support.html'"]) {
  if (!chrome.includes(link)) fail(`Missing real-page link: ${link}`);
}
for (const stale of ['not-in-prototype.html#privacy', 'not-in-prototype.html#terms', 'not-in-prototype.html#about', 'not-in-prototype.html#support']) {
  if (chrome.includes(stale)) fail(`Link still points to a placeholder: ${stale}`);
}

// Release text: no candidate marker; noindex only on the two placeholder pages.
const noindex = '<meta name="robots" content="noindex,nofollow">';
for (const [page, html] of Object.entries(pages)) {
  const placeholder = page === 'account.html' || page === 'not-in-prototype.html';
  if (placeholder !== html.includes(noindex)) fail(`noindex scope wrong on ${page}`);
  if (/LOCAL WEBSITE CANDIDATE|NOT PRODUCTION|this candidate/i.test(html)) fail(`Candidate marker on ${page}`);
}
// Scripts: user-visible strings only (developer comment lines are skipped; they are never rendered).
const code = (src) => src.split('\n').filter((l) => !/^\s*\/\//.test(l)).map((l) => l.replace(/\s\/\/ .*$/, '')).join('\n');
if (/LOCAL WEBSITE CANDIDATE|NOT PRODUCTION|not in this candidate|this candidate/i.test(code(chrome) + code(world) + code(na) + code(data))) fail('Candidate marker in scripts');
if (!/function banner\(\) \{\s*return '';/.test(chrome)) fail('Candidate banner is rendered');

// AI disclosure (D1 Credits, D2 captions) and NASA credit.
if (!data.includes("window.WORLD_D2 = ['atmos', 'cast', 'loop', 'forge', 'stage', 'cinema'];")) fail('D2 caption list changed');
if (!data.includes('AI-generated illustration. The people shown are not intended to depict real persons.')) fail('D2 caption text changed');
for (const text of ['<h2>AI-generated imagery</h2>', 'Credit: NASA/NOAA.', 'NASA and NOAA do not endorse or sponsor Sercle']) {
  if (!pages['credits.html'].includes(text)) fail(`Credits text missing: ${text}`);
}

// Every raster under assets/ equals the Owner-approved manifest, by path and SHA-256; nothing extra.
const manifest = new Map((await read('scripts/website-v1-assets.sha256')).trim().split('\n').map((l) => { const [h, p] = l.trim().split(/\s+/); return [p, h]; }));
const rasters = (await readdir(new URL('assets/', root), { recursive: true })).map((p) => 'assets/' + p.replaceAll('\\', '/')).filter((p) => /\.(avif|webp|jpe?g|png|gif)$/i.test(p));
if (rasters.length !== manifest.size) fail(`Raster count ${rasters.length} != manifest ${manifest.size}`);
for (const p of rasters) {
  const h = createHash('sha256').update(await readFile(new URL(p, root))).digest('hex');
  if (manifest.get(p) !== h) fail(`Raster not in approved manifest: ${p}`);
}

console.log(`Sercle website V1 checks passed (11 worlds, live links, legal links, release text, disclosure, ${rasters.length} approved rasters).`);
