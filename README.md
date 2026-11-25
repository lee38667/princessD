# PD Touch Auto Repair: website

Marketing website for **Princess D Touch Auto Repair CC**, a woman-owned auto repair workshop in Ongwediva, Namibia.

It is a fast static site in plain HTML, CSS and JavaScript, with no frameworks and no npm dependencies. A small build script in Node puts the pages together from one shared layout, header and footer.

| Page | URL | Source |
| --- | --- | --- |
| Home | `/` | `src/pages/index.html` |
| Services | `/services/` | `src/pages/services.html` |
| Fleet and insurance | `/fleet-and-insurance/` | `src/pages/fleet-and-insurance.html` |
| About | `/about/` | `src/pages/about.html` |
| Contact / request a quote | `/contact/` | `src/pages/contact.html` |
| Photo credits | `/credits/` | `src/pages/credits.html` |
| Not found | `/404.html` | `src/pages/404.html` |

Read these before launch:

- [docs/LAUNCH-CHECKLIST.md](docs/LAUNCH-CHECKLIST.md): business information and content still to supply.
- [docs/DESIGN-RATIONALE.md](docs/DESIGN-RATIONALE.md): inspiration sources, design direction and key decisions.

## Requirements

- Node.js 18.11 or newer (only to build and preview; the live site is plain files).
- Nothing to install. `npm install` is not needed because there are no dependencies.

## Run it locally

```bash
npm run dev
```

This builds the site into `dist/` and serves it at <http://localhost:4321>. Edits to `src/` or `public/` rebuild it automatically; refresh the browser to see them. Use `PORT=8080 npm run dev` to change the port.

## Build for production

```bash
SITE_URL=https://www.your-domain.na npm run build
```

On Windows PowerShell:

```powershell
$env:SITE_URL = "https://www.your-domain.na"; npm run build
```

`dist/` then holds the complete site. `SITE_URL` is written into the canonical links, Open Graph tags, structured data, `sitemap.xml` and `robots.txt`. Without it the build uses the placeholder `https://www.pdtouch.example`, so always set it for the real deployment.

## Review copy

```bash
npm run build:review
```

This writes `review/`, a copy of the site with every link and asset path made relative. Use it on hosts that serve the site from a sub-folder, such as the Claude artifact used for review. The canonical and Open Graph URLs still point at `SITE_URL`.

## Deploy

Any static host works. Set the build command to `npm run build`, set the output folder to `dist`, and set `SITE_URL` as an environment variable.

- **Netlify** or **Cloudflare Pages:** connect the repository and use the settings above. Both serve `404.html` automatically.
- **GitHub Pages:** run the build in a GitHub Action and publish `dist/`.
- **Shared hosting (cPanel / FTP):** run the build locally and upload the contents of `dist/` to `public_html/`. To use the custom error page, add `ErrorDocument 404 /404.html` to `.htaccess` on Apache.

After the first deploy, submit `https://your-domain/sitemap.xml` in Google Search Console, and create or claim the Google Business Profile for the workshop.

## Connect the quote form

The form in `src/pages/contact.html` works without a backend:

1. It checks every field in the browser and shows accessible error messages: an error summary that takes focus, inline messages, and `aria-invalid` on each field that needs fixing.
2. With no backend set, the success state opens the visitor's email app with the request already written and addressed to `princessdtouch@gmail.com`. It also offers the phone numbers.
3. Without JavaScript, the form falls back to a plain `mailto:` submission.

To receive submissions directly, create a form endpoint with any form service (Formspree, Basin, Netlify Forms, or your own API). Put its URL in the `data-endpoint` attribute:

```html
<form class="form" data-quote-form data-endpoint="https://formspree.io/f/your-id" ...>
```

The script then posts the form data to that URL with `fetch` and shows the "Your request has reached us" success message. If the request fails, the visitor is asked to call or email instead. A hidden honeypot field (`website`) filters simple spam bots.

Links can preselect the service, for example `/contact/?service=spray-painting`. Valid values are the `<option>` values in the form. The form asks only for name, phone, email (optional), vehicle, service and a short description.

## Project structure

```
src/
  layout.html            Shared <head> (SEO, Open Graph, JSON-LD), skip link, header and footer
  partials/              header, footer, quote-form, cta band, icons (SVG sprite)
  pages/                 One file per page. Each starts with <!--meta {...} -->
  images.json            Sizes of every responsive image (used for srcset, width and height)
public/                  Copied to dist/ as is
  css/site.css           All styles: tokens first, then components and sections
  js/site.js             Menu, entrance animations, chooser tabs, form validation
  assets/img/            Photos, pre-sized to 640, 1024 and 1600px WebP, black and white
  assets/brand/          Logo, crest, icons, Open Graph image
  assets/fonts/          Barlow and Barlow Condensed (self-hosted, OFL licence)
scripts/
  build.mjs              Builds dist/ (pages, sitemap.xml, robots.txt)
  serve.mjs              Development server with rebuild-on-change
docs/                    Design rationale and launch checklist
_source/                 Original logo and full-size photos with their licence data (not deployed)
```

### Writing pages

Each page in `src/pages/` starts with its metadata:

```html
<!--meta {
  "title": "Page title shown in search results",
  "description": "About 150 characters for search results and link previews.",
  "nav": "services"
} -->
```

`nav` marks the matching header link as the current page (`services`, `fleet`, `about`, `contact`). Add `"noindex": true` to keep a page out of search engines and the sitemap.

Placeholders available in pages and partials: `{{phone1}}`, `{{phone1Intl}}`, `{{phone2}}`, `{{phone2Intl}}`, `{{email}}`, `{{legalName}}`, `{{year}}`. Business details are set once at the top of `scripts/build.mjs`.

Icons use one tag, `{{icon wrench}}`, drawn from `src/partials/icons.html`.

Responsive images use one tag:

```html
{{img name="panel-beating" alt="Describe the photo" sizes="(min-width: 900px) 50vw, 100vw"}}
```

Add `eager` for the main image at the top of a page. Other images lazy-load.

### Adding your own photos

1. Export each photo at 1600px wide, plus 1024px and 640px versions, as WebP. Name them `name-1600.webp`, `name-1024.webp` and `name-640.webp`, and put them in `public/assets/img/`.
2. Add their sizes to `src/images.json`, following the existing entries.
3. Use `{{img name="name" ...}}` in a page.
4. When you replace a stock photo with your own, remove its entry from `/credits/`.

The site shows every photo in black and white to match the silver-on-black crest. Converting your photos to black and white first keeps the look consistent.

## What is built in

- **Accessibility:** semantic landmarks and headings, a skip link, visible focus states, keyboard-operable menu and tabs (arrow keys, Home, End, Escape), accessible form errors, alt text on every photo, colour contrast of 7:1 or more for body text, touch targets of 44px or more, and `prefers-reduced-motion` support.
- **SEO:** a unique title and description on every page, canonical URLs, Open Graph and Twitter cards, `AutoRepair` structured data, a generated `sitemap.xml` and `robots.txt`, and clean folder URLs.
- **Performance:** one CSS file and one JS file with no libraries, a self-hosted font with preload, WebP images with `srcset`, width and height on every image, and lazy loading below the first screen. On a phone, the home page's first screen needs about 230 KB and the whole page about 520 KB once every image has loaded. Those figures are before gzip, which most hosts apply.
