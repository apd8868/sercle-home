import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { assertWebsiteV1Identity } from './public-health-identity.mjs';

const currentWebsiteV1 = `<!doctype html>
<html><head>
<title>Sercle — Every world begins with curiosity.</title>
<link rel="canonical" href="https://sercle.com/">
<script src="assets/js/worlds-data.js"></script>
</head><body><h1 id="hero-title">Every world<br> begins with<br> <em>curiosity.</em></h1></body></html>`;

const rejectedPages = {
  'previous Design V1 R6 homepage': `<!doctype html><html><head>
    <link rel="canonical" href="https://sercle.com/">
    <title>Sercle — Every world begins with curiosity.</title>
    </head><body><h1 id="hero-title">Every world begins with curiosity.</h1></body></html>`,
  'local candidate build': `<!doctype html><html><head>
    <title>Sercle — Every world begins with curiosity.</title>
    <link rel="canonical" href="https://sercle.com/">
    <script src="assets/js/worlds-data.js"></script>
    </head><body><aside>LOCAL WEBSITE CANDIDATE — NOT PRODUCTION</aside>
    <h1 id="hero-title">Every world<br> begins with<br> <em>curiosity.</em></h1></body></html>`,
  'obsolete Sercle homepage': `<!doctype html><html><head>
    <link rel="canonical" href="https://sercle.com/">
    <title>Sercle — Ideas become worlds</title>
    </head><body><h1>Ideas become worlds</h1></body></html>`,
  'default Vercel protection page': `<!doctype html><html><head>
    <title>Log in to Vercel</title>
    </head><body><h1>Authentication Required</h1></body></html>`,
  'wrong-brand page': `<!doctype html><html><head>
    <link rel="canonical" href="https://sercle.com/">
    <title>Example Hosting</title>
    </head><body><h1>Welcome to Example Hosting</h1></body></html>`,
  'unexpected non-Sercle page': '<!doctype html><html><head><title>Service available</title></head><body>OK</body></html>',
};

test('current website V1 identity passes', () => {
  assert.doesNotThrow(() => assertWebsiteV1Identity(currentWebsiteV1));
});

test('repository homepage passes', async () => {
  const home = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.doesNotThrow(() => assertWebsiteV1Identity(home));
});

for (const [name, html] of Object.entries(rejectedPages)) {
  test(`${name} fails`, () => {
    assert.throws(() => assertWebsiteV1Identity(html));
  });
}
