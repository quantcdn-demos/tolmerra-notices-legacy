// Writes the fixed site into site/: the HTML pages, the stylesheet, the PDF and routes.json (exact URL to file).
// The images in site/assets are drawn once by scripts/images.sh and kept in git. Run: node scripts/generate.mjs
import {copyFileSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {NOTICES} from './content.mjs';
import * as P from './pages.mjs';
import {makePdf} from './pdf.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = process.env.SITE_OUT ?? join(ROOT, 'site');
const HTML = 'text/html; charset=US-ASCII';

const routes = [];
const files = {};

function add(url, file, body, type = HTML, status = 200) {
  routes.push({url, file, type, status});
  files[file] = body;
}

function addPages() {
  add(P.URL.home, 'pages/home.html', P.homePage());
  add(P.URL.byDate, 'pages/by-date.html', P.byDatePage(1));
  add(P.URL.byDate2, 'pages/by-date-2.html', P.byDatePage(2));
  add(P.URL.byCategory, 'pages/by-category.html', P.byCategoryPage(true));
  add(P.URL.byCategoryCollapsed, 'pages/by-category-collapsed.html', P.byCategoryPage(false));
  add(P.URL.reports, 'pages/annual-reports.html', P.reportsPage());
  add(P.URL.search, 'pages/search.html', P.searchFormPage());
  NOTICES.forEach((n, i) => add(P.URL.notice(n.key), `pages/notice-${n.key}.html`, P.noticePage(i)));
  for (const name of ['About', 'Contact', 'Accessibility']) add(P.URL.about(name), `pages/about-${name.toLowerCase()}.html`, P.aboutPage(name));
}

function addReport() {
  const report = NOTICES.find((n) => n.attachment);
  const pdf = makePdf([
    'Tolmerra Water Authority: Annual Report 2009-10',
    'Demonstration document. Tolmerra Water Authority is fictional.',
    '',
    'Water supplied: 9,840 megalitres.',
    'Customers: about 46,000 in Tolmerra, Karrabee and Wattleford.',
    'Karrabee Reservoir at 30 June 2010: 47 per cent of capacity.',
    'Stage 2 water restrictions applied from 1 December 2009.',
    'Drinking water samples tested: 1,912. Samples that met the guidelines: 1,912.',
  ]);
  add(P.URL.attachment(report), 'files/twa-annual-report-2009-10.pdf', pdf, 'application/pdf');
}

function addAssets() {
  const css = join(dirname(fileURLToPath(import.meta.url)), 'style.css');
  routes.push({url: P.URL.css, file: 'assets/twa.css', type: 'text/css', status: 200, copy: css});
  const gifs = {
    '/twa/web.nsf/twa-logo.gif': 'twa-logo.gif', '/twa/web.nsf/counter.gif': 'counter.gif', '/twa/web.nsf/new.gif': 'new.gif',
    '/icons/expand.gif': 'expand.gif', '/icons/collapse.gif': 'collapse.gif', '/icons/ecblank.gif': 'ecblank.gif',
    '/icons/vwicn004.gif': 'vwicn004.gif', '/icons/fileatt.gif': 'fileatt.gif',
  };
  for (const [url, name] of Object.entries(gifs)) routes.push({url, file: `assets/${name}`, type: 'image/gif', status: 200});
  routes.push({url: '/robots.txt', file: 'robots.txt', type: 'text/plain', status: 200});
  files['robots.txt'] = 'User-agent: *\nDisallow: /\n';
}

function write() {
  rmSync(join(SITE, 'pages'), {recursive: true, force: true});
  rmSync(join(SITE, 'files'), {recursive: true, force: true});
  for (const [file, body] of Object.entries(files)) {
    mkdirSync(dirname(join(SITE, file)), {recursive: true});
    writeFileSync(join(SITE, file), body);
  }
  for (const r of routes.filter((x) => x.copy)) {
    mkdirSync(dirname(join(SITE, r.file)), {recursive: true});
    copyFileSync(r.copy, join(SITE, r.file));
  }
  const special = {notFound: 'pages/404.html', login: 'pages/login.html', method: 'pages/405.html', searchResults: 'pages/search-results.html'};
  writeFileSync(join(SITE, special.notFound), P.notFoundPage());
  writeFileSync(join(SITE, special.login), P.loginPage());
  writeFileSync(join(SITE, special.method), P.methodPage());
  writeFileSync(join(SITE, special.searchResults), P.searchResultsPage());
  const table = routes.map(({url, file, type, status}) => ({url, file, type, status}));
  writeFileSync(join(SITE, 'routes.json'), `${JSON.stringify({routes: table, special, login: P.URL.login, searchPath: P.URL.searchAction}, null, 1)}\n`);
}

addPages();
addReport();
addAssets();
write();
console.log(`${routes.length} routes written to site/routes.json`);
