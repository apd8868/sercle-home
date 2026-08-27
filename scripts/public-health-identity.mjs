import assert from 'node:assert/strict';

const designV1Title = '<title>Sercle — Every world begins with curiosity.</title>';
const canonicalIdentity = '<link rel="canonical" href="https://sercle.com/">';
const designV1Heading = '<h1 id="hero-title">Every world begins with curiosity.</h1>';

export function assertDesignV1Identity(html) {
  assert.ok(html.includes(designV1Title), 'canonical homepage must expose the Design V1 title');
  assert.ok(html.includes(canonicalIdentity), 'canonical homepage must identify https://sercle.com/');
  assert.ok(html.includes(designV1Heading), 'canonical homepage must expose the Design V1 hero identity');
}
