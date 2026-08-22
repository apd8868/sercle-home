import { access, readFile } from 'node:fs/promises';

const required = ['index.html', 'privacy.html', 'terms.html', 'public/styles.css', 'public/site.js', 'brand/README.md', 'vercel.json', 'README.md', 'LICENSE', '.gitignore'];
for (const file of required) await access(new URL(`../${file}`, import.meta.url));

const home = await readFile(new URL('../index.html', import.meta.url), 'utf8');
for (const product of ['Earth', 'MYUVO', 'Story', 'Lens', 'iAudio', 'Future platforms']) {
  if (!home.includes(product)) throw new Error(`Missing product: ${product}`);
}

const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
if (!Array.isArray(config.headers) || !Array.isArray(config.rewrites)) throw new Error('Invalid Vercel configuration');
console.log('Sercle Home foundation checks passed.');

