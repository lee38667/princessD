# Launch checklist

Everything below is either missing from the business profile or needs the owner's confirmation. The site's wording is kept deliberately short. Only two placeholders still show on the site (street address and hours), as text in square brackets on a highlighted background. To find them, search `src/` for `class="ph"`.

## Must have before launch

- [ ] **Physical address** (street and erf number). Used in: home page "Find us" rows and the contact page.
- [ ] **Opening days and hours.** Used in: home page "Find us" rows and the contact page. Add them to the structured data in `src/layout.html` as `openingHours` too.
- [ ] **Domain name.** Build with `SITE_URL=https://...` (see README). The placeholder `www.pdtouch.example` must not go live.
- [ ] **Quote form delivery.** Choose a form service, put its URL in `data-endpoint` in `src/pages/contact.html`, then send a test request. Until then the form hands the request to the visitor's email app.
- [ ] **Confirm both phone numbers and the email address** are the ones customers should use: 081 216 0146, 081 035 5550 and princessdtouch@gmail.com. A business address on your own domain (for example info@your-domain.na) looks more credible to corporate and government clients.
- [ ] **Is either number on WhatsApp?** If so, a "WhatsApp us" button is a small addition and often the preferred channel in Namibia.
- [ ] **Map link.** The contact page links to Ongwediva in Google Maps. Once the Google Business Profile exists, link to the workshop's exact pin instead.

## Content to confirm (written from the profile, worth checking)

- [ ] **Vision and mission.** These are marked "Draft: please confirm or edit" in the profile. The About page uses shortened versions: "The most trusted auto repair business in northern Namibia." and "Quality repairs for every vehicle brand, on time and at a fair price." 
- [ ] **Gas refill.** Which gas: air-conditioning gas, or something else? The Services page only says "Vehicle gas refills. Call ahead to check it suits your car." 
- [ ] **How quoting works.** The site says vehicles are inspected and quoted before work starts. This comes from your "on time and on quote" value. Confirm it matches practice, and whether quotes are free.
- [ ] **Towing.** Listed as "coming soon". Update the Services page, the FAQ and the home page when it launches.
- [ ] **Owner's name in use.** The site names Verdiana Ndilipo Hinanamunhu as owner and lists Diana as the contact person. Confirm how she prefers to be named publicly.

- [ ] **Vehicle makes row** (home page): Toyota, Volkswagen, Ford, Nissan, Isuzu, Mercedes-Benz and BMW are listed as plain text with "and every other make". Swap in the makes you see most.

## Proof and credibility (strongly recommended)

- [ ] **Client names**: insurers, ministries or offices, companies and dealerships. Get written permission before publishing. The site currently lists client types only, so names would be an optional addition to the "Who we work for" list on the home page.
- [ ] **Insurer approval or accreditation**, if you are on any approved-repairer panels.
- [ ] **Trade certificates, qualifications or association memberships.** If any exist, add a row to the company details table on the Fleet and insurance page.
- [ ] **Qualifications and years of experience** for the team. Optional; the About page lists names and roles only.
- [ ] **Before-and-after photos.** The reference design has a before-and-after section; it can be added as soon as there are real photo pairs.
- [ ] **Customer testimonials or reviews**, with permission. None are on the site because none were supplied. A Google Business Profile is the easiest place to collect them.

## Photography (replace the stock photographs)

The site uses openly licensed photographs of the trade and of Ongwediva, credited on `/credits/`. None of them shows PD Touch. Replace them with your own as soon as you can:

- [ ] The workshop front and signage (for the home page and contact page)
- [ ] Diana at work, panel beating or spraying (for the home page hero and the About page; this replaces the crest beside her story)
- [ ] The team (About page)
- [ ] Before-and-after pairs of real repairs (a new gallery section; the strongest proof for a body shop)
- [ ] Mechanical and electrical work in progress (Services page)
- [ ] Optional: a short clip, 5 to 10 seconds and muted, of spraying or polishing for the home page

See "Adding your own photos" in the README. When a stock photo is removed, also remove its entry from `src/pages/credits.html`.

## Deliberately left off the website

- **Bank details** (FNB account and branch code) and the **tax number**. Publishing them invites payment-redirection fraud. Share them on quotes and invoices only.

## Before going live: technical checks

- [ ] Build with the real `SITE_URL` and deploy `dist/`.
- [ ] Open every page on a phone. Tap each phone number and send a test quote request.
- [ ] Check a shared link's preview (Open Graph image and title) in WhatsApp or Facebook.
- [ ] Submit `sitemap.xml` in Google Search Console.
- [ ] Create or claim the **Google Business Profile** with the same name, address, phone numbers and hours as the website.
