import assert from 'node:assert/strict';

// Sercle website V1 homepage identity (replaces the Design V1 R6 identity at release).
const websiteV1Title = '<title>Sercle — Every world begins with curiosity.</title>';
const canonicalIdentity = '<link rel="canonical" href="https://sercle.com/">';
const websiteV1Heading = '<h1 id="hero-title">Every world<br> begins with<br> <em>curiosity.</em></h1>';
const websiteV1Directory = '<script src="assets/js/worlds-data.js"></script>';

export function assertWebsiteV1Identity(html) {
  assert.ok(html.includes(websiteV1Title), 'canonical homepage must expose the website V1 title');
  assert.ok(html.includes(canonicalIdentity), 'canonical homepage must identify https://sercle.com/');
  assert.ok(html.includes(websiteV1Heading), 'canonical homepage must expose the website V1 hero identity');
  assert.ok(html.includes(websiteV1Directory), 'canonical homepage must load the website V1 world directory');
  assert.ok(!/LOCAL WEBSITE CANDIDATE|NOT PRODUCTION/.test(html), 'canonical homepage must not be a candidate build');
}
