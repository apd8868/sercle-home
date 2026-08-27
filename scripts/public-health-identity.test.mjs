import assert from 'node:assert/strict';
import test from 'node:test';

import { assertDesignV1Identity } from './public-health-identity.mjs';

const currentDesignV1 = `<!doctype html>
<html><head>
<link rel="canonical" href="https://sercle.com/">
<title>Sercle — Every world begins with curiosity.</title>
</head><body><h1 id="hero-title">Every world begins with curiosity.</h1></body></html>`;

const rejectedPages = {
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

test('current Design V1 identity passes', () => {
  assert.doesNotThrow(() => assertDesignV1Identity(currentDesignV1));
});

for (const [name, html] of Object.entries(rejectedPages)) {
  test(`${name} fails`, () => {
    assert.throws(() => assertDesignV1Identity(html));
  });
}
