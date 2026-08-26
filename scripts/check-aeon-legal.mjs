import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const normalize = (value) => value.replace(/\r\n/g, '\n').trimEnd();
const decode = (value) => value.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const extract = (html) => {
  const match = html.match(/<pre id="approved-document" class="approved-document">([\s\S]*?)<\/pre>/);
  if (!match) throw new Error('Approved document boundary missing');
  return normalize(decode(match[1]));
};
const hash = (value) => createHash('sha256').update(normalize(value), 'utf8').digest('hex');
const config = JSON.parse(await readFile(new URL('vercel.json', root), 'utf8'));
const metadata = JSON.parse(await readFile(new URL('legal/aeon/metadata.json', root), 'utf8'));
const expected = [
  { file: 'aeon/privacy.html', route: '/aeon/privacy', destination: '/aeon/privacy.html', identity: 'AEON-PRIVACY-2026-08-26-R1', sha: '4b511a0274d6e1d9c9f2c1dd9aad3d9063feecefbff24a2742a50813b333df1c', markers: ['browser local storage','Vercel may process','Cesium world imagery','NaturalEarthII','does not include Vercel Analytics','does not provide production user accounts','no application API routes','Use, retention, and deletion','Children','privacy@sercle.com','hello@sercle.com'] },
  { file: 'aeon/terms.html', route: '/aeon/terms', destination: '/aeon/terms.html', identity: 'AEON-TERMS-2026-08-26-R1', sha: 'fe1119bcace752b0f1369d1a4769a7cdd444a3441418e99a5003a7bf16eca389', markers: ['Acceptance and scope','Current product boundary','Permitted use','Historical and scientific information','Local state and persistence','Third-party imagery, data, and services','Availability and changes','Intellectual property','Disclaimers','Responsibility and limitation','Termination','Changes to these Terms','legal@sercle.com','hello@sercle.com'] }
];
function validate(doc, html, rewrites) {
  if (!html.includes(`content="${doc.identity}"`)) throw new Error(`${doc.identity}: identity metadata missing`);
  if (!rewrites.some(({ source, destination }) => source === doc.route && destination === doc.destination)) throw new Error(`${doc.identity}: route missing`);
  const text = extract(html);
  if (hash(text) !== doc.sha) throw new Error(`${doc.identity}: exact approved text hash mismatch`);
  for (const marker of doc.markers) if (!text.includes(marker)) throw new Error(`${doc.identity}: required substance missing: ${marker}`);
}
for (const doc of expected) {
  const html = await readFile(new URL(doc.file, root), 'utf8');
  validate(doc, html, config.rewrites);
  let failed = false;
  try { validate(doc, html.replace(doc.markers[0], 'ALTERED'), config.rewrites); } catch { failed = true; }
  if (!failed) throw new Error(`${doc.identity}: altered-content negative control did not fail`);
  failed = false;
  try { validate(doc, html, config.rewrites.filter(({ source }) => source !== doc.route)); } catch { failed = true; }
  if (!failed) throw new Error(`${doc.identity}: missing-route negative control did not fail`);
}
if (metadata.approvalStatus !== 'APPROVED' || metadata.documents.length !== 2) throw new Error('Publication metadata invalid');
console.log('Aeon legal routes, exact-content hashes, required substance, metadata, and negative controls passed.');