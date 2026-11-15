import {test, before, after} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync, readFileSync, readdirSync} from 'node:fs';
import {request} from 'node:http';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:http';
import {handler, loadSite, resolve} from '../server.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const table = JSON.parse(readFileSync(join(ROOT, 'site/routes.json'), 'utf8'));
let server;
let port;

before(async () => {
  server = createServer(handler(loadSite()));
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  port = server.address().port;
});
after(() => server.close());

function call(method, path, body) {
  return new Promise((ok, fail) => {
    const req = request({host: '127.0.0.1', port, method, path}, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => ok({status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks)}));
    });
    req.on('error', fail);
    if (body) req.write(body);
    req.end();
  });
}

const htmlRoutes = table.routes.filter((r) => r.type.startsWith('text/html'));

test('every route answers 200 with its content type and the legacy headers', async () => {
  for (const r of table.routes) {
    const res = await call('GET', r.url);
    assert.equal(res.status, 200, r.url);
    assert.equal(res.headers['content-type'], r.type, r.url);
    assert.equal(res.headers.server, 'Tallowdoc-HTTP/6.5.2');
    assert.equal(res.headers['x-robots-tag'], 'noindex, nofollow');
    assert.equal(res.headers['cache-control'], 'no-cache');
    assert.equal(res.headers['strict-transport-security'], undefined);
  }
});

test('the site has 22 HTML pages and one PDF, under the 50-page crawl limit', () => {
  assert.equal(htmlRoutes.length, 22);
  assert.equal(table.routes.filter((r) => r.type === 'application/pdf').length, 1);
});

test('HEAD sends the headers and no body', async () => {
  const res = await call('HEAD', '/');
  assert.equal(res.status, 200);
  assert.equal(res.body.length, 0);
  assert.ok(Number(res.headers['content-length']) > 1000);
});

test('the staff login answers 401 with no form, in any letter case', async () => {
  for (const path of ['/names.nsf?Login', '/NAMES.NSF?login']) {
    const res = await call('GET', path);
    assert.equal(res.status, 401, path);
    assert.equal(res.headers['www-authenticate'], undefined);
    const html = res.body.toString();
    assert.doesNotMatch(html, /<form/i);
    assert.match(html, /disabled/);
  }
});

test('other methods answer 405 and close without reading the body', async () => {
  for (const method of ['POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']) {
    const res = await call(method, '/names.nsf?Login', method === 'POST' ? 'Username=a&Password=b' : undefined);
    assert.equal(res.status, 405, method);
    assert.equal(res.headers.allow, 'GET, HEAD');
  }
});

test('unknown paths answer the 404 page', async () => {
  for (const path of ['/nope', '/twa/notices.nsf', '/twa/notices.nsf/By+Date?OpenView&Start=99', '/../server.mjs', '/site/routes.json']) {
    const res = await call('GET', path);
    assert.equal(res.status, 404, path);
    assert.match(res.body.toString(), /File does not exist/);
  }
});

test('paths match without regard to letter case, and %24 decodes to $', () => {
  const site = loadSite();
  assert.equal(resolve(site, '/twa/notices.nsf/by+date?openview').status, 200);
  assert.equal(resolve(site, '/twa/notices.nsf/By+Date/annual-report-2009-10/%24FILE/twa-annual-report-2009-10.pdf').type, 'application/pdf');
  assert.equal(resolve(site, '/%E0%A4%A').status, 404);
});

test('a search request gets the fixed search page and the query is never shown', async () => {
  const res = await call('GET', '/twa/notices.nsf/By+Date?SearchView=&Query=%3Cscript%3E');
  assert.equal(res.status, 200);
  assert.doesNotMatch(res.body.toString(), /script/i);
  assert.match(res.body.toString(), /Search is not available/);
});

test('robots.txt keeps search engines out', async () => {
  const res = await call('GET', '/robots.txt');
  assert.equal(res.body.toString(), 'User-agent: *\nDisallow: /\n');
});

const hrefs = (html) => [...html.matchAll(/(?:href|src|action)="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));

test('every link is relative to the site root and reaches a page (or the login or the search form)', () => {
  const urls = new Set(table.routes.map((r) => r.url));
  for (const r of htmlRoutes) {
    const html = readFileSync(join(ROOT, 'site', r.file), 'utf8');
    for (const h of hrefs(html)) {
      assert.ok(h.startsWith('/'), `${r.url}: ${h}`);
      assert.ok(urls.has(h) || h === table.login || h === table.searchPath, `${r.url}: ${h}`);
    }
  }
});

test('every page is reached by a link from the home page (a whole-site crawl finds all of them)', () => {
  const byUrl = new Map(htmlRoutes.map((r) => [r.url, r]));
  const seen = new Set(['/']);
  const queue = ['/'];
  while (queue.length) {
    const html = readFileSync(join(ROOT, 'site', byUrl.get(queue.shift()).file), 'utf8');
    for (const h of hrefs(html).filter((x) => byUrl.has(x) && !seen.has(x))) {
      seen.add(h);
      queue.push(h);
    }
  }
  assert.equal(seen.size, htmlRoutes.length);
});

test('pages hold no frameset, no script, no absolute URL and only ASCII', () => {
  for (const r of htmlRoutes) {
    const html = readFileSync(join(ROOT, 'site', r.file), 'utf8');
    assert.doesNotMatch(html, /<frameset|<frame |<iframe|<script/i, r.url);
    assert.doesNotMatch(html.replace(/"http:\/\/www\.w3\.org\/TR\/html4\/loose\.dtd"/, ''), /https?:\/\//, r.url);
    assert.match(html, /^[\x00-\x7f]*$/, r.url);
    assert.match(html, /Tolmerra Water Authority is fictional/, r.url);
  }
});

test('the committed site matches the generator', () => {
  const out = mkdtempSync(join(tmpdir(), 'site-'));
  execFileSync(process.execPath, [join(ROOT, 'scripts/generate.mjs')], {env: {...process.env, SITE_OUT: out}});
  for (const dir of ['pages', 'files']) {
    for (const f of readdirSync(join(out, dir))) {
      assert.deepEqual(readFileSync(join(out, dir, f)), readFileSync(join(ROOT, 'site', dir, f)), `${dir}/${f}`);
    }
  }
  assert.equal(readFileSync(join(out, 'routes.json'), 'utf8'), readFileSync(join(ROOT, 'site/routes.json'), 'utf8'));
});
