# Design rationale

## The brief, as read from the business profile

PD Touch is a woman-owned panel beating, spray painting and mechanical workshop in Ongwediva, northern Namibia. It has been serving clients since 2020 and was registered as a close corporation on 1 November 2026. A team of ten repairs every make of vehicle. Clients range from private drivers to insurers, government ministries, private companies and dealerships.

The site has two audiences with different needs:

- **Private drivers**, mostly on phones: "Can you fix this, and how do I reach you?" They need the phone number, a clear way to ask for a quote, and confidence.
- **Insurers, ministries, companies and dealerships**: "Are you a credible, registered supplier for our vehicles?" They need company details, the range of work, and a direct contact.

So the site's one action is **Request a quote**, with **Call 081 216 0146** next to it on every page.

## Research and inspiration sources

I used three kinds of research. The sites below informed layout, type, motion and content patterns only. No copy, image or signature asset was taken from any of them.

**1. Award galleries (studied design patterns).** The design system used for this build draws on a study of 247 sites from Awwwards Sites of the Day and One Page Love. The direction it dealt, "the name as a monument", was referenced against these three:

- **Kereliott** (One Page Love): one dark field, one typeface, and the name set as wide as the screen with photographs underneath. This shaped the hero and the black ground.
- **Produx Design** (Awwwards Site of the Day): the wordmark as the whole hero, with a small statement and generous dark space. This is the reason the page has no hero image carousel and no tagline banner.
- **PP Neue Montreal** (Awwwards Site of the Day): a page dressed in a borrowed genre, with bands of colour separating content instead of lines. This shaped the silver bands for services and the footer.

**2. Automotive and body-shop categories (2026).** I searched for current automotive work on Awwwards and in agency roundups:

- The [Awwwards automotive category](https://www.awwwards.com/websites/automotive/) lists refinishing and body-shop studios (for example HB Body Automotive Refinish and Forge Automotive), which favour dark grounds, large type and black-and-white or low-saturation photography.
- [Q Refinish](https://webflow.com/made-in-webflow/website/q-refinish) (Made in Webflow) is a refinishing studio site with an editorial, high-contrast layout.
- The [Freshysites "Top 25 auto repair websites of 2026"](https://freshysites.com/blog/top-auto-repair-websites/) and [Colorlib's auto repair examples](https://colorlib.com/wp/auto-repair-website-examples/) point to what converts for repair shops: a call or quote action on the first screen, services you can scan, proof such as before-and-after photos and certifications, and real staff.
- [Azuro Digital's best automotive websites of 2026](https://azurodigital.com/automotive-web-design-tips/) features accredited collision repairers that put insurer accreditation up front.

These roundups are published by agencies and site builders, so I treated them as patterns to consider, not authorities. I read their descriptions and did not audit each site visually.

**3. The subject's own world.** The strongest material came from the business itself: the silver-on-black crest, the name "PD Touch", the line "A royal touch to every repair", the owner who is herself the panel beater and painter, and the town of Ongwediva on the C41 between Oshakati and Ondangwa.

## Direction

**The name as a monument.** On this site, the crest's two words, PD and TOUCH, become the hero. They are set enormous in silver on the crest's own black (#08080a), split to opposite corners with the offer and the call to action between them. The crest is the business's only visual asset, so the site grows out of it rather than around it.

The competitor test: put the next workshop in Oshakati into that sentence and it no longer works. The idea belongs to this client.

## Design system

| | Decision | Why |
| --- | --- | --- |
| **Mood** | Workshop-serious, premium and calm. Black and silver, with no decoration. | Credible to an insurer's claims handler and to a fleet manager. Premium without looking expensive. |
| **Colour** | Ground `#08080a` (sampled from the logo), surfaces `#141418` and `#1f1f24`, ink `#ececee`, muted `#a6a6ad`. A silver field `#d3d4d8` with ink `#08080a` is used for the services index, the polishing band, call-to-action bands and the footer. | Taken straight from the crest, so the logo sits on the page with no box around it. Measured contrast: body text 17:1, muted text 8.3:1 on black, dark text on silver 13.5:1. The one "accent" is the silver button. |
| **Type** | One family, **Bricolage Grotesque**, self-hosted. Five working sizes (16 / 19 / 28 / 64 / 108px at desktop) plus the monument name (up to 17vw). Tight tracking on display sizes, 1.5 leading for body text. | A grotesk with visible stroke contrast: engineered, but warm. One family keeps the page fast and consistent. |
| **Spacing** | One pair of outer margins (20 to 32px), a 12-column grid on desktop, and 96 to 200px between sections. | The big name can reach the edges while text stays on shared left edges. |
| **Components** | Square-cornered buttons in two variants (light on dark, dark on light). Tone-step panels instead of borders or shadows. Real tables for company and client data. | One shape everywhere. Separating with tone rather than lines keeps the page quiet. |
| **Imagery** | Openly licensed photographs of the trade (panel beating, engine work, fleet servicing, a 1918 paint sprayer) and of Ongwediva itself, all converted to black and white. Credited on `/credits/`. | The business has no photographs of its own yet. Black and white matches the silver crest and makes photos from different sources look like one set. Captions describe the scene and never claim it is PD Touch's own workshop. |
| **Motion** | The signature move: on load, PD and TOUCH rise from behind their own baselines (720ms). Section parts arrive in turn (80ms stagger, a 24px rise). The hero photo drifts slowly. Every button and link responds to hover and press. | Uses only transform and opacity. Under `prefers-reduced-motion`, every move becomes a short fade or nothing, and all content stays visible. |

## Key UX decisions

1. **"What happened to your car?" chooser (home page).** A visitor picks one of seven plain-language situations, such as "It was in an accident" or "Lights, battery or wiring trouble". The chooser names the service that handles it, says what to have ready when they call, and links to the quote form with that service preselected. It uses only real services from the profile. It is an accessible tab set, and without JavaScript every answer is simply listed.
2. **A separate "Fleet and insurance" page.** The profile names insurers, ministries, companies and dealerships as clients. They need different proof from a private driver: registration number, legal structure, a single contact, and the full scope of work. That page also carries a company-details table for procurement.
3. **No invented proof.** There are no testimonials, ratings, client logos or statistics, because the profile contains none. The "Who we work for" table lists the real client types and leaves the names as clearly highlighted placeholders. Facts that are true ("since 2020", "a team of ten", "all makes and models", "woman-owned") do the job of proof for now.
4. **Phone first.** The call button stays in the header on desktop. On phones the menu holds a full-width quote button and both numbers, and every phone number on the site is a `tel:` link.
5. **Bank and tax details are left out on purpose.** Publishing an account number invites payment-redirection fraud. Share these privately on invoices instead.

## What I would add with more material

- A **before-and-after gallery** of the workshop's own repairs. This is the most persuasive proof a body shop can show, and the strongest recommendation in the 2026 roundups.
- **Photographs of Diana and the team** in the workshop, to replace the stock trade photographs and the crest used beside the owner's story.
- **Insurer and client names or logos**, with written permission, in the "Who we work for" table.
- A short muted **video loop** from the workshop, such as a spray booth or a polish pass, for the home page.

## Revision: a more minimal pass

After the first review, the owner asked for the site to feel less crowded. The changes:

- The home page went from about 760 to about 310 words. Every section kept its heading, and most lost their supporting sentences.
- The hover descriptions in "What we fix", the "have ready" notes in the chooser, the notes under each step, and most photo captions were removed.
- The client table became a plain list of client types. Name placeholders and qualification placeholders were taken off the page and moved to the launch checklist.
- The quote form dropped the year, "who is the work for" and "how should we reach you" fields. It now has six fields.
- Services, Fleet and insurance, About and Contact each carry one short line per item.

## Revision: redesign from the owner's reference images

The owner shared two reference designs: a dark auto-repair landing page with red accents, and a dark manufacturing site with an orange call-to-action band. The site was rebuilt in that direction, keeping the short wording from the minimal pass:

- **Colour:** near-black ground (`#0b0b0d`), silver ink, and one signal red. Red fills use `#d4321c` (white text on it is 4.9:1), and red text on dark uses `#ff5a3c` (6.3:1).
- **Type:** Barlow Condensed (bold, uppercase, italic for the big headlines) with Barlow for body text, both self-hosted.
- **Hero:** a full-bleed black-and-white photo behind a dark scrim, with the tagline "A royal touch / to every repair." The second line is in red.
- **Components:** photo service cards with red icon badges, a four-column "Why choose us" row, the "What happened?" chooser beside an inline quote form (picking an answer fills the form's service field), a row of vehicle makes, a split section for insurers and fleets, a red call-to-action band with the silver crest, and a four-column footer.
- **Left out of the references on purpose:** customer testimonials and star ratings (none supplied), car-maker logos (trademarks, and they imply a dealer relationship; the makes are listed as plain text instead), "certified mechanics" and "genuine parts" claims (not in the profile), and a before-and-after slider (no before-and-after photos yet).

