import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const normalize = value => value.replace(/\r\n/g, '\n').trimEnd();
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const extract = html => {
  const match = html.match(/<pre id="approved-document" class="approved-document">([\s\S]*?)<\/pre>/);
  if (!match) throw new Error('Approved document boundary missing');
  return normalize(decode(match[1]));
};
const hash = value => createHash('sha256').update(normalize(value), 'utf8').digest('hex');
const config = JSON.parse(await readFile(new URL('vercel.json', root), 'utf8'));
const metadata = JSON.parse(await readFile(new URL('legal/atmos/metadata.json', root), 'utf8'));
const expected = [
  {
    file: 'atmos/privacy.html',
    route: '/atmos/privacy',
    destination: '/atmos/privacy.html',
    identity: 'ATMOS-PRIVACY-2026-08-26-R0-DRAFT',
    sha: '5ce66fa19fc56a980b2e129f619f33d3a7147b9df7570ec6970de7c3167791f5',
    markers: ['IndexedDB database named atmos-v1', 'local snapshot or preference state', 'ordinary hosting and network request metadata', 'does not include a production visitor-analytics integration', 'product telemetry integration', 'observed no resident-data transmission', 'does not provide a production Sercle account backend', 'cloud backup or synchronization', 'paid subscriptions', 'does not provide audio playback', 'storage is unavailable or restricted', 'Children', 'privacy@sercle.com', 'hello@sercle.com']
  },
  {
    file: 'atmos/terms.html',
    route: '/atmos/terms',
    destination: '/atmos/terms.html',
    identity: 'ATMOS-TERMS-2026-08-26-R0-DRAFT',
    sha: 'd1bf035d8df6d66bc09dac4043708372cdd82323b3d7c8c08300e18fb386d1fa',
    markers: ['Acceptance and scope', 'Current capability boundary', 'IndexedDB atmos-v1', 'does not guarantee preservation', 'Availability and changes', 'Vercel hosting', 'Flutter Web, CanvasKit', 'No professional or emergency service', 'Intellectual property', 'Disclaimers and limitation', 'Termination and changes', 'legal@sercle.com', 'hello@sercle.com']
  }
];
function validate(doc, html, rewrites) {
  if (!html.includes(`content="${doc.identity}"`)) throw new Error(`${doc.identity}: identity metadata missing`);
  if (!html.includes('content="APPROVED"')) throw new Error(`${doc.identity}: approval status missing`);
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
if (metadata.approvalStatus !== 'APPROVED' || metadata.documents.length !== 2) throw new Error('Atmos publication metadata invalid');
console.log('Atmos legal routes, exact-content hashes, required substance, metadata, and negative controls passed.');
