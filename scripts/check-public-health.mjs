import assert from 'node:assert/strict';

const canonical = 'https://sercle.com';

async function request(url, redirect = 'manual') {
  return fetch(url, {
    redirect,
    headers: { 'user-agent': 'sercle-public-health/1.0' },
  });
}

const home = await request(canonical + '/', 'follow');
assert.equal(home.status, 200, 'sercle.com must return HTTP 200');
assert.match(await home.text(), /<title>Sercle — Ideas become worlds<\/title>/, 'canonical homepage content mismatch');

for (const path of ['/', '/platforms?monitor=1', '/about']) {
  const wwwUrl = 'https://www.sercle.com' + path;
  const redirect = await request(wwwUrl);
  assert.equal(redirect.status, 308, wwwUrl + ' must use a permanent redirect');
  assert.equal(redirect.headers.get('location'), canonical + path, wwwUrl + ' must preserve path and query');
  const followed = await request(wwwUrl, 'follow');
  assert.equal(followed.status, 200, wwwUrl + ' redirect chain must end in HTTP 200');
  assert.equal(followed.url, canonical + path, wwwUrl + ' must end on the canonical host without a loop');
}

const insecure = await request('http://www.sercle.com/');
assert.equal(insecure.status, 308, 'HTTP www must redirect permanently to HTTPS www');
assert.equal(insecure.headers.get('location'), 'https://www.sercle.com/', 'HTTP www must upgrade to HTTPS before canonical redirect');

console.log('Sercle canonical availability, www TLS, redirect preservation, and loop checks passed.');
