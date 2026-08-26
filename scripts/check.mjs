import { access, readFile } from 'node:fs/promises';

const required = ['index.html', 'platforms.html', 'about.html', 'status.html', 'support.html', 'privacy.html', 'terms.html', 'aeon/privacy.html', 'aeon/terms.html', 'public/styles.css', 'public/site.js', 'robots.txt', 'sitemap.xml', 'brand/README.md', 'vercel.json', 'README.md', 'LICENSE', '.gitignore'];
for (const file of required) await access(new URL(`../${file}`, import.meta.url));

const home = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const platforms = await readFile(new URL('../platforms.html', import.meta.url), 'utf8');
for (const product of ['Aeon', 'Narrative', 'Atmos', 'Cast', 'Audio', 'Forge', 'Lens', 'Render', 'Stage', 'Cinema', 'Loop']) {
  if (!platforms.includes(`>${product}<`) && !platforms.includes(`>${product} ↗<`)) throw new Error(`Missing platform: ${product}`);
}

if (!home.includes('https://aeon.sercle.com')) throw new Error('Missing Aeon public URL');
if (!home.includes('https://atmos.sercle.com') || !platforms.includes('https://atmos.sercle.com')) throw new Error('Missing Atmos public URL');
for (const stale of ['myuvo.sercle.com', 'story.sercle.com', 'iaudio.sercle.com']) {
  if (home.includes(stale) || platforms.includes(stale)) throw new Error(`Stale public host: ${stale}`);
}
for (const unresolved of ['narrative.sercle.com']) {
  if (home.includes(unresolved) || platforms.includes(unresolved)) throw new Error(`Unresolved public host: ${unresolved}`);
}

const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
if (!Array.isArray(config.headers) || !Array.isArray(config.rewrites)) throw new Error('Invalid Vercel configuration');
for (const route of ['/platforms', '/about', '/status', '/support', '/privacy', '/terms', '/aeon/privacy', '/aeon/terms']) {
  if (!config.rewrites.some((rewrite) => rewrite.source === route)) throw new Error(`Missing route: ${route}`);
}
console.log('Sercle public web V1 checks passed.');

