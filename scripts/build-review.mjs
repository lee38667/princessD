// Builds a review copy of the site into review/, with every link and asset
// path made relative. Hosts that serve the site from a sub-folder (such as a
// Claude artifact) need this; the normal build uses root paths (/css/...).
//
//   node scripts/build-review.mjs

import { readFile, writeFile, rm, cp, readdir } from 'node:fs/promises';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './build.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const out = join(root, 'review');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])));
  return files.flat();
}

// "/contact/?service=x" seen from services/index.html -> "../contact/index.html?service=x"
function rel(url, prefix) {
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  const cut = url.search(/[?#]/);
  let path = cut === -1 ? url : url.slice(0, cut);
  const rest = cut === -1 ? '' : url.slice(cut);
  if (path.endsWith('/')) path += 'index.html';
  return prefix + path.slice(1) + rest;
}

await build();
await rm(out, { recursive: true, force: true });
await cp(dist, out, { recursive: true });

for (const file of await walk(out)) {
  const path = relative(out, file).split(sep).join('/');
  const depth = path.split('/').length - 1;
  const prefix = '../'.repeat(depth);

  if (file.endsWith('.html')) {
    let html = await readFile(file, 'utf8');
    html = html.replace(/\b(href|src)="([^"]*)"/g, (_, attr, url) => `${attr}="${rel(url, prefix)}"`);
    html = html.replace(/\bsrcset="([^"]*)"/g, (_, set) =>
      `srcset="${set.split(',').map((part) => {
        const [u, w] = part.trim().split(/\s+/);
        return `${rel(u, prefix)}${w ? ' ' + w : ''}`;
      }).join(', ')}"`);
    await writeFile(file, html);
  } else if (file.endsWith('.css')) {
    const css = await readFile(file, 'utf8');
    await writeFile(file, css.replace(/url\('\/(?!\/)/g, `url('${prefix}`));
  }
}

console.log('Review copy written to review/');
