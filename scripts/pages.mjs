// HTML templates for the demo site. Plain functions that return strings: no template engine, no request data.
import {ABOUT, CATEGORIES, NOTICES, SITE} from './content.mjs';

export const URL = {
  home: '/',
  byDate: '/twa/notices.nsf/By+Date?OpenView',
  byDate2: '/twa/notices.nsf/By+Date?OpenView&Start=11&Count=10',
  byCategory: '/twa/notices.nsf/By+Category?OpenView',
  byCategoryCollapsed: '/twa/notices.nsf/By+Category?OpenView&CollapseView',
  reports: '/twa/notices.nsf/Annual+Reports?OpenView',
  search: '/twa/notices.nsf/Search?OpenForm',
  searchAction: '/twa/notices.nsf/By+Date',
  login: '/names.nsf?Login',
  css: '/twa/web.nsf/twa.css',
  notice: (key) => `/twa/notices.nsf/By+Date/${key}?OpenDocument`,
  about: (name) => `/twa/about.nsf/${name}?OpenDocument`,
  attachment: (n) => `/twa/notices.nsf/By+Date/${n.key}/$FILE/${n.attachment.name}`,
};

const PAGE_SIZE = 10;

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const img = (src, alt, w, h, extra = '') => `<img src="${src}" alt="${esc(alt)}" width="${w}" height="${h}" border="0"${extra}>`;
const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;

function head(title) {
  return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=US-ASCII">
<meta name="robots" content="noindex, nofollow">
<title>${esc(SITE.name)} - ${esc(title)}</title>
<link rel="stylesheet" type="text/css" href="${URL.css}">
</head>`;
}

function banner() {
  return `<tr><td colspan="3" class="banner-frame">
<table width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
<td width="72" align="center">${img('/twa/web.nsf/twa-logo.gif', 'Tolmerra Water Authority', 56, 56)}</td>
<td><div class="banner-name">${esc(SITE.name)}</div><div class="banner-db">${esc(SITE.database)}</div></td>
<td align="right" valign="top" class="banner-links">${link(URL.home, 'Home')} | ${link(URL.about('Contact'), 'Contact us')} | ${link(URL.search, 'Search')}</td>
</tr></table>
</td></tr>
<tr><td colspan="3" class="banner-stripe">${img('/icons/ecblank.gif', '', 1, 1)}</td></tr>`;
}

function outlineGroup(title, items) {
  const rows = items.map(([href, text]) => `<tr><td width="14">${img('/icons/ecblank.gif', '', 14, 9)}</td><td class="outline-item">${link(href, text)}</td></tr>`);
  return `<table cellspacing="0" cellpadding="1" border="0" class="outline">
<tr><td width="14">${img('/icons/expand.gif', '', 11, 11)}</td><td class="outline-head">${esc(title)}</td></tr>
${rows.join('\n')}
</table>`;
}

function searchBox() {
  return `<form method="get" action="${URL.searchAction}" class="outline-search">
<input type="hidden" name="SearchView" value="">
<div class="outline-head">Search notices</div>
<input type="text" name="Query" size="14" maxlength="40" class="field"> <input type="submit" value="Go" class="button">
</form>`;
}

function outline() {
  return `<td class="nav-frame" valign="top"><div class="nav-scroll">
${outlineGroup('Notices', [[URL.byDate, 'By Date'], [URL.byCategory, 'By Category'], [URL.reports, 'Annual Reports']])}
${searchBox()}
${outlineGroup('About us', [[URL.about('About'), 'About the Authority'], [URL.about('Contact'), 'Contact us'], [URL.about('Accessibility'), 'Accessibility']])}
<div class="counter">Visitors since 1 July 2004<br>${img('/twa/web.nsf/counter.gif', 'Visitor counter', 91, 19)}</div>
</div></td>`;
}

function footer() {
  return `<hr size="1" noshade>
<div class="footer">Last updated ${SITE.lastUpdated} | Best viewed at 800 x 600 | ${link(URL.login, 'Staff login')}<br>
&copy; 2004-2011 ${esc(SITE.name)}. Demonstration site. ${esc(SITE.name)} is fictional.</div>`;
}

export function layout(title, content) {
  return `${head(title)}
<body>
<table class="frameset" width="100%" cellspacing="0" cellpadding="0" border="0">
<col width="196"><col width="8"><col>
${banner()}
<tr>
${outline()}
<td class="splitter">${img('/icons/ecblank.gif', '', 6, 1)}</td>
<td class="main-frame" valign="top"><div class="main-scroll">
${content}
${footer()}
</div></td>
</tr>
</table>
</body>
</html>
`;
}

function actionBar(items) {
  const cells = items.map(([href, text]) => (href ? link(href, text) : `<span class="disabled">${esc(text)}</span>`));
  return `<table class="action-bar" cellspacing="0" cellpadding="3" border="0"><tr><td>${cells.join(' | ')}</td></tr></table>`;
}

function viewRow(n, i, newest) {
  const badge = newest ? ` ${img('/twa/web.nsf/new.gif', 'New', 28, 11)}` : '';
  return `<tr class="${i % 2 ? 'row-alt' : 'row'}"><td width="18">${img('/icons/vwicn004.gif', '', 13, 11)}</td><td nowrap>${n.date}</td><td>${link(URL.notice(n.key), n.title)}${badge}</td><td>${esc(n.area)}</td></tr>`;
}

function viewTable(notices, first) {
  const rows = notices.map((n, i) => viewRow(n, i, first && i === 0));
  return `<table class="view" width="100%" cellspacing="0" cellpadding="3" border="0">
<tr class="view-head"><td></td><td>Date</td><td>Notice</td><td>Area</td></tr>
${rows.join('\n')}
</table>`;
}

export function homePage() {
  const latest = NOTICES.slice(0, 5);
  return layout('Home', `<h1>Welcome</h1>
<p>Welcome to the ${esc(SITE.name)} public notices database. Here you will find notices about water restrictions, works, water quality, fees and charges.</p>
<table class="alert" width="100%" cellspacing="0" cellpadding="6" border="0"><tr><td><b>Water restrictions:</b> Stage 1 applies from Monday 21 March 2011. ${link(URL.notice(NOTICES[0].key), 'Read the notice')}</td></tr></table>
<h2>What's new</h2>
${viewTable(latest, true)}
<p>${link(URL.byDate, 'All notices by date')} | ${link(URL.byCategory, 'All notices by category')}</p>`);
}

export function byDatePage(page) {
  const start = (page - 1) * PAGE_SIZE;
  const slice = NOTICES.slice(start, start + PAGE_SIZE);
  const prev = page > 1 ? URL.byDate : null;
  const next = start + PAGE_SIZE < NOTICES.length ? URL.byDate2 : null;
  return layout('Notices by Date', `${actionBar([[prev, 'Previous'], [next, 'Next'], [URL.byCategory, 'By Category'], [URL.search, 'Search']])}
<h1>Notices by Date</h1>
${viewTable(slice, page === 1)}
<p class="small">Showing ${start + 1} - ${start + slice.length} of ${NOTICES.length}</p>`);
}

function categoryRows(category, expanded) {
  const items = NOTICES.filter((n) => n.category === category);
  const twisty = img(expanded ? '/icons/collapse.gif' : '/icons/expand.gif', '', 11, 11);
  const head = `<tr class="view-cat"><td width="18">${twisty}</td><td colspan="3">${esc(category)} (${items.length})</td></tr>`;
  if (!expanded) return head;
  return [head, ...items.map((n, i) => viewRow(n, i, false))].join('\n');
}

export function byCategoryPage(expanded) {
  const toggle = expanded ? [URL.byCategoryCollapsed, 'Collapse'] : [URL.byCategory, 'Expand'];
  const rows = CATEGORIES.map((c) => categoryRows(c, expanded));
  return layout('Notices by Category', `${actionBar([toggle, [URL.byDate, 'By Date'], [URL.search, 'Search']])}
<h1>Notices by Category</h1>
<table class="view" width="100%" cellspacing="0" cellpadding="3" border="0">
<tr class="view-head"><td></td><td>Date</td><td>Notice</td><td>Area</td></tr>
${rows.join('\n')}
</table>`);
}

export function reportsPage() {
  const report = NOTICES.find((n) => n.attachment);
  return layout('Annual Reports', `${actionBar([[URL.byDate, 'By Date'], [URL.byCategory, 'By Category']])}
<h1>Annual Reports</h1>
<table class="view" width="100%" cellspacing="0" cellpadding="3" border="0">
<tr class="view-head"><td></td><td>Year</td><td>Report</td></tr>
<tr class="row"><td width="18">${img('/icons/fileatt.gif', '', 16, 16)}</td><td>2009-10</td><td>${link(URL.attachment(report), report.attachment.label)}</td></tr>
<tr class="row-alt"><td></td><td>2008-09</td><td>Available on request</td></tr>
<tr class="row"><td></td><td>2007-08</td><td>Available on request</td></tr>
</table>`);
}

function paragraphs(body) {
  return body.map((p) => (Array.isArray(p) ? `<ul>\n${p.map((li) => `<li>${esc(li)}</li>`).join('\n')}\n</ul>` : `<p>${esc(p)}</p>`)).join('\n');
}

function attachmentBlock(n) {
  if (!n.attachment) return '';
  return `<p class="attachment">${img('/icons/fileatt.gif', '', 16, 16, ' align="absmiddle"')} ${link(URL.attachment(n), n.attachment.label)}</p>`;
}

export function noticePage(i) {
  const n = NOTICES[i];
  const newer = i > 0 ? URL.notice(NOTICES[i - 1].key) : null;
  const older = i < NOTICES.length - 1 ? URL.notice(NOTICES[i + 1].key) : null;
  return layout(n.title, `${actionBar([[newer, 'Previous notice'], [older, 'Next notice'], [URL.byDate, 'Return to view']])}
<h1>${esc(n.title)}</h1>
<table class="fields" cellspacing="0" cellpadding="2" border="0">
<tr><td class="label">Notice number:</td><td>${esc(n.number)}</td></tr>
<tr><td class="label">Date:</td><td>${n.date}</td></tr>
<tr><td class="label">Category:</td><td>${esc(n.category)}</td></tr>
<tr><td class="label">Area:</td><td>${esc(n.area)}</td></tr>
</table>
${paragraphs(n.body)}
${attachmentBlock(n)}`);
}

export function aboutPage(name) {
  const a = ABOUT[name];
  return layout(a.title, `<h1>${esc(a.title)}</h1>\n${paragraphs(a.body)}`);
}

export function searchFormPage() {
  return layout('Search', `<h1>Search notices</h1>
<form method="get" action="${URL.searchAction}">
<input type="hidden" name="SearchView" value="">
<table class="fields" cellspacing="0" cellpadding="3" border="0">
<tr><td class="label">Search for:</td><td><input type="text" name="Query" size="40" maxlength="40" class="field"></td></tr>
<tr><td></td><td><input type="submit" value="Search" class="button"></td></tr>
</table>
</form>
<p class="small">Tip: use AND, OR and NOT to combine words.</p>`);
}

export function searchResultsPage() {
  return layout('Search results', `<h1>Search results</h1>
<p>Search is not available: the full-text index is being rebuilt.</p>
<p>${link(URL.byDate, 'Browse the notices by date')}</p>`);
}

export function loginPage() {
  return `${head('Server Login')}
<body class="plain">
<table class="login" cellspacing="0" cellpadding="6" border="0" align="center">
<tr><td colspan="2" class="login-head">Server Login</td></tr>
<tr><td colspan="2">Staff sign-in is not available on this site.</td></tr>
<tr><td class="label">User name:</td><td><input type="text" size="24" class="field" disabled></td></tr>
<tr><td class="label">Password:</td><td><input type="password" size="24" class="field" disabled></td></tr>
<tr><td></td><td><input type="button" value="Log In" class="button" disabled></td></tr>
</table>
<p class="footer" align="center">Demonstration site. ${esc(SITE.name)} is fictional.</p>
</body>
</html>
`;
}

export function notFoundPage() {
  return `${head('Error 404')}
<body class="plain">
<h2>Error 404</h2>
<p>HTTP Web Server: File does not exist</p>
</body>
</html>
`;
}

export function methodPage() {
  return `${head('Error 405')}
<body class="plain">
<h2>Error 405</h2>
<p>HTTP Web Server: Method not allowed</p>
</body>
</html>
`;
}
