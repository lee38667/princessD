// Builds the static site from src/ and public/ into dist/. No dependencies.
//
//   node scripts/build.mjs                 build with the placeholder site URL
//   SITE_URL=https://www.example.na node scripts/build.mjs
//
// Each page in src/pages starts with a meta comment:
//   <!--meta {"title": "...", "description": "...", "nav": "services"} -->
// and is wrapped in src/layout.html. Pages become clean URLs:
//   src/pages/index.html     -> dist/index.html          (/)
//   src/pages/services.html  -> dist/services/index.html (/services/)
//   src/pages/404.html       -> dist/404.html
//
// Icons: {{icon wrench}} expands to an inline <svg> that uses src/partials/icons.html.
// Responsive images: {{img name="panel-beating" alt="..." sizes="50vw" eager}}
// expands to an <img> with srcset, width and height from src/images.json.

import { readFile, writeFile, mkdir, readdir, cp, rm, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');
const pub = join(root, 'public');
const out = join(root, 'dist');

// Replace before launch: the site's real address, without a trailing slash.
const SITE_URL = (process.env.SITE_URL || 'https://www.pdtouch.example').replace(/\/$/, '');

const site = {
  name: 'PD Touch Auto Repair',
  legalName: 'Princess D Touch Auto Repair CC',
  phone1: '081 216 0146',
  phone1Intl: '+264812160146',
  phone2: '081 035 5550',
  phone2Intl: '+264810355550',
  email: 'princessdtouch@gmail.com',
  year: new Date().getFullYear(),
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function hash(buf) {
  return createHash('sha1').update(buf).digest('hex').slice(0, 8);
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])));
  return files.flat();
}

function attrs(str) {
  const a = {};
  for (const m of str.matchAll(/(\w[\w-]*)(?:="([^"]*)")?/g)) a[m[1]] = m[2] === undefined ? true : m[2];
  return a;
}

function imgTag(images, a) {
  const set = images[a.name];
  if (!set) throw new Error(`Unknown image "${a.name}" (see src/images.json)`);
  const sorted = [...set].sort((x, y) => x.w - y.w);
  const largest = sorted[sorted.length - 1];
  const fallback = sorted.find((s) => s.w >= 1024) || largest;
  const srcset = sorted.map((s) => `/assets/img/${s.file} ${s.w}w`).join(', ');
  const eager = a.eager === true;
  return `<img src="/assets/img/${fallback.file}" srcset="${srcset}" sizes="${esc(a.sizes || '100vw')}" width="${largest.w}" height="${largest.h}" alt="${esc(a.alt || '')}"${a.class ? ` class="${esc(a.class)}"` : ''} ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'}>`;
}

async function build() {
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
  await cp(pub, out, { recursive: true });

  // Cache-busting for the two hand-written files.
  const cssV = hash(await readFile(join(pub, 'css/site.css')));
  const jsV = hash(await readFile(join(pub, 'js/site.js')));

  const layout = await readFile(join(src, 'layout.html'), 'utf8');
  const images = JSON.parse(await readFile(join(src, 'images.json'), 'utf8'));
  const partials = {};
  for (const f of await readdir(join(src, 'partials'))) {
    partials[f.replace(/\.html$/, '')] = await readFile(join(src, 'partials', f), 'utf8');
  }

  const pages = (await walk(join(src, 'pages'))).filter((f) => f.endsWith('.html'));
  const sitemap = [];

  for (const file of pages) {
    const raw = await readFile(file, 'utf8');
    const m = raw.match(/^<!--meta\s+([\s\S]*?)-->\s*/);
    if (!m) throw new Error(`${file}: missing <!--meta {...} --> header`);
    const meta = JSON.parse(m[1]);
    let body = raw.slice(m[0].length);

    const slug = file.slice(join(src, 'pages').length + 1).replace(/\\/g, '/').replace(/\.html$/, '');
    const path = slug === 'index' ? '/' : slug === '404' ? '/404.html' : `/${slug}/`;
    const target = slug === 'index' ? 'index.html' : slug === '404' ? '404.html' : `${slug}/index.html`;

    let html = layout
      .replace('{{content}}', () => body)
      .replace(/\{\{> ([\w-]+)\}\}/g, (_, n) => partials[n] ?? '');
    // Partials may themselves contain partials.
    html = html.replace(/\{\{> ([\w-]+)\}\}/g, (_, n) => partials[n] ?? '');

    // Navigation state.
    html = html.replace(/ data-nav="(\w+)"/g, (_, n) => (n === meta.nav ? ' aria-current="page"' : ''));

    const vars = {
      ...site,
      title: meta.title,
      description: meta.description,
      path,
      canonical: SITE_URL + path,
      siteUrl: SITE_URL,
      ogImage: `${SITE_URL}/assets/brand/og-image.jpg`,
      bodyClass: meta.bodyClass || '',
      robots: meta.noindex ? 'noindex' : 'index, follow',
      cssV,
      jsV,
    };
    html = html.replace(/\{\{img ([^}]+)\}\}/g, (_, a) => imgTag(images, attrs(a)));
    html = html.replace(/\{\{icon ([\w-]+)\}\}/g, (_, n) => `<svg class="ico" aria-hidden="true" focusable="false"><use href="#i-${n}"/></svg>`);
    html = html.replace(/\{\{(\w+)\}\}/g, (all, k) => (k in vars ? (['title', 'description'].includes(k) ? esc(vars[k]) : vars[k]) : all));

    const left = html.match(/\{\{[^}]*\}\}/);
    if (left) throw new Error(`${file}: unresolved placeholder ${left[0]}`);

    const dest = join(out, target);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, html);
    if (!meta.noindex) sitemap.push(path);
  }

  const today = new Date().toISOString().slice(0, 10);
  await writeFile(
    join(out, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap
      .sort()
      .map((p) => `  <url><loc>${SITE_URL}${p}</loc><lastmod>${today}</lastmod></url>`)
      .join('\n')}\n</urlset>\n`,
  );
  await writeFile(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

  const size = (await Promise.all((await walk(out)).map(async (f) => (await stat(f)).size))).reduce((a, b) => a + b, 0);
  console.log(`Built ${pages.length} pages into dist/ (${(size / 1024 / 1024).toFixed(1)} MB) for ${SITE_URL}`);
}

export { build };

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  build().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
