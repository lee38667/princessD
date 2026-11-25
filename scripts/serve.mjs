// Local development server. Builds the site, serves dist/ and rebuilds when
// src/ or public/ changes. No dependencies.
//
//   node scripts/serve.mjs            http://localhost:4321
//   PORT=8080 node scripts/serve.mjs

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './build.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const port = Number(process.env.PORT) || 4321;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

await build();

// Rebuild on change, one build at a time.
let timer;
let running = Promise.resolve();
const rebuild = () => {
  running = running.then(() => build()).catch((e) => console.error(e.message));
};
for (const dir of ['src', 'public']) {
  watch(join(root, dir), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 150);
  });
}

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = normalize(join(dist, url));
  if (!file.startsWith(dist)) {
    res.writeHead(403).end();
    return;
  }
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    // Directory without trailing slash: redirect like a static host would.
    try {
      if ((await stat(join(dist, url, 'index.html'))).isFile()) {
        res.writeHead(301, { Location: url + '/' }).end();
        return;
      }
    } catch {}
    res.writeHead(404, { 'Content-Type': types['.html'] });
    res.end(await readFile(join(dist, '404.html')).catch(() => 'Not found'));
  }
}).listen(port, () => console.log(`PD Touch site on http://localhost:${port}`));
