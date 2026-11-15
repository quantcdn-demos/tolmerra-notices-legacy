// A fixed-page web server for a fictional legacy site (demonstration only). It serves files from site/ that the
// route table names, for GET and HEAD only. It never reads a request body, runs no templates, scripts or shell, holds
// no secrets and writes nothing. Every file is read into memory at start-up, so the file system may be read-only.
import {createServer} from 'node:http';
import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), 'site');

// The legacy look: an old server banner and no-cache headers, as the old platform sent them. The banner is text only.
export const BASE_HEADERS = {
  Server: 'Tallowdoc-HTTP/6.5.2',
  Expires: 'Tue, 01 Jan 1980 01:00:00 GMT',
  'Cache-Control': 'no-cache',
  'X-Robots-Tag': 'noindex, nofollow',
};

export function loadSite(dir = SITE) {
  const table = JSON.parse(readFileSync(join(dir, 'routes.json'), 'utf8'));
  const read = (file) => readFileSync(join(dir, file));
  const exact = new Map();
  const lower = new Map();
  for (const r of table.routes) {
    const entry = {status: r.status, type: r.type, body: read(r.file)};
    exact.set(r.url, entry);
    lower.set(r.url.toLowerCase(), entry);
  }
  const html = 'text/html; charset=US-ASCII';
  const page = (file, status) => ({status, type: html, body: read(file)});
  const special = {
    login: page(table.special.login, 401),
    notFound: page(table.special.notFound, 404),
    method: page(table.special.method, 405),
    searchResults: page(table.special.searchResults, 200),
  };
  return {exact, lower, special, loginUrl: table.login.toLowerCase(), searchPath: table.searchPath.toLowerCase()};
}

function decodePath(path) {
  try {
    return decodeURI(path).replace(/%24/gi, '$');
  } catch {
    return path;
  }
}

/** The response for a request target (the raw URL). Exact match first, then a case-insensitive match, as the old platform did. */
export function resolve(site, rawUrl) {
  const at = rawUrl.indexOf('?');
  const path = decodePath(at < 0 ? rawUrl : rawUrl.slice(0, at));
  const search = at < 0 ? '' : rawUrl.slice(at);
  const key = path + search;
  const lowerKey = key.toLowerCase();
  if (lowerKey === site.loginUrl) return site.special.login;
  const hit = site.exact.get(key) ?? site.lower.get(lowerKey);
  if (hit) return hit;
  if (path.toLowerCase() === site.searchPath && search.toLowerCase().startsWith('?searchview')) return site.special.searchResults;
  return site.special.notFound;
}

function send(res, entry, headOnly, extra = {}) {
  res.writeHead(entry.status, {...BASE_HEADERS, ...extra, 'Content-Type': entry.type, 'Content-Length': entry.body.length});
  res.end(headOnly ? undefined : entry.body);
}

export function handler(site) {
  return (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      // The body is never read: the connection closes after the answer.
      send(res, site.special.method, false, {Allow: 'GET, HEAD', Connection: 'close'});
      req.socket.destroySoon?.();
      return;
    }
    send(res, resolve(site, req.url ?? '/'), req.method === 'HEAD');
  };
}

export function start(port = Number(process.env.PORT ?? 8080)) {
  const server = createServer({requestTimeout: 10000, headersTimeout: 5000, maxHeaderSize: 8192}, handler(loadSite()));
  server.keepAliveTimeout = 5000;
  server.listen(port, '0.0.0.0', () => console.log(`legacy demo site on port ${port}`));
  const stop = () => server.close(() => process.exit(0));
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
  return server;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) start();
