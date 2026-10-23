# Haven

A real-estate theme for [EmDash](https://emdashcms.com/): property listings with clear prices and
key facts, photo galleries, location / type / budget search, agent profiles and a property-specific
viewing inquiry. It is a standalone EmDash host that runs on Node.js with SQLite and local file
storage — no cloud account, credentials or private platform access required.

**Audience:** independent property agents, boutique agencies and residential project marketers who
list a modest number of homes and want each one presented well.

The visual direction (navy and cream, serif headlines, photo hero with a floating search bar,
featured cards showing price, beds, baths and location) follows the Haven concept artwork from the
ZeroHostCMS theme kit.

## Pages

| Page | Route | What it shows |
| --- | --- | --- |
| Home | `/` | Photo hero, floating search bar, featured properties (entries with *Feature on home page*, falling back to the newest), a selling/letting band |
| Properties | `/properties` | Every published property, with the search bar and sale/rent counts |
| Search results | `/search?location=&type=&budget=&listing=` | Server-side filtered results, removable criteria chips, "Clear all", and a no-match state |
| Property detail | `/properties/[slug]` | Price, address, gallery, key facts, description, features, listing agent, viewing inquiry |
| Agent profile | `/agents/[slug]` | Photo (or initials), role, areas, bio, phone/email, and that agent's listings |
| Contact | `/contact` | Editable intro (the `contact` page entry), the inquiry form, and every agent's contact details |
| Pages | `/[slug]` | Static pages; the seed ships `about` and `sell` |
| Not found | `404` | Friendly 404 with links back to properties |

The primary menu (editable in the admin) is **Buy** (`/search?listing=sale`), **Rent**
(`/search?listing=rent`), **Sell** (`/sell`, an informational page that routes to Contact),
**About** and **Contact**.

## Scope implemented

- **Property cards with price and key facts** — price (monthly for rentals), beds, baths, location
  and a For sale / To rent badge. Missing photos render a "Photos coming soon" placeholder.
- **Galleries and detail pages** — main photo plus a `gallery` repeater (photo + caption) laid out as
  a mosaic; extra photos continue in a grid below.
- **Location, type and budget search** — a GET form on Home, Properties and Search results submits to
  `/search`. Listing type, property type and location are exact-match filters in the EmDash
  collection query; the budget band is applied to those results on the server. Budget bands belong to
  either sale or rent, so a rent band never matches sale prices. Unknown `type`/`budget` values are
  ignored; locations are matched case-insensitively against existing ones. When nothing matches, the
  page explains why (including a sale/rent vs budget conflict) and links to all properties and Contact.
- **Agent profiles and Contact page** — an `agents` collection; each property names its agent by
  slug in the `agent` field.
- **Property-specific viewing inquiry** — the detail page shows the property title, address and
  price above the form, states that a viewing request is an inquiry and not a confirmed appointment,
  and always shows the agent's phone and a pre-filled email link next to the form.

### Out of scope

No IDX/MLS or listing feed, CRM, appointment booking or confirmation, payment flow, valuation tool,
live map or automated notifications beyond what the Forms plugin itself offers. A viewing request is
an inquiry; the agent replies to arrange a time.

## Content model (`seed/seed.json`)

- `properties`: `title`, `listing_type` (`sale`/`rent`), `property_type`
  (`house`/`villa`/`apartment`/`townhouse`), `location`, `address`, `price` (sale price or monthly
  rent, USD), `beds`, `baths`, `area_sqft`, `year_built`, `featured`, `agent` (agent slug),
  `summary`, `featured_image`, `gallery` (repeater: `image`, `caption`), `features` (repeater:
  `label`), `description` (Portable Text).
- `agents`: `title` (name), `role`, `photo`, `email`, `phone`, `areas`, `bio`.
- `pages`: `title`, `content` — `about`, `sell` and `contact`.
- Menu `primary`; site settings `title` = Haven, `tagline` = Homes for a brighter tomorrow.

The select options must stay in sync with `src/utils/listing.ts` (labels and budget bands live
there). The sample content is 8 properties across Rivermere, Oakridge and Mapleton (4 for sale,
4 to rent; one without photos) and 2 agents.

## Requirements

- Node.js `^22.22.2 || ^24.15.0 || >=26.0.0`, npm
- Pins **EmDash 1.2.0**, **Astro 7.3.5**, `@astrojs/node`, React 19.2.4. The project owns its
  `package-lock.json`; there is no root install.

## Develop locally

```sh
npm ci
npx emdash secrets generate --write .env
npm run dev
```

Open the URL Astro prints (normally `http://localhost:4321/`) and complete setup at
`/_emdash/admin/`, choosing to include sample content; that applies `seed/seed.json`. In local
development only, `/_emdash/api/setup/dev-bypass?redirect=/_emdash/admin` applies the seed and signs
you in as a dev admin. `.env`, `data.db*` and `uploads/` are local state and ignored by git.

### Create the inquiry form (required for the online form)

Forms live in the Forms plugin's storage, not in the seed, and `<Form id="inquiry" />` renders
nothing until a form with slug `inquiry` exists. Until then the theme shows a short notice and the
agents' phone/email instead. In the admin:

1. Open **Plugins → Forms** and create a form named *Inquiry* with slug **`inquiry`**.
2. Add fields (names matter only for `property`):
   - `name` — Text, required
   - `email` — Email, required
   - `phone` — Phone, optional
   - `interest` — Select, optional: Viewing a home / Buying / Renting / Selling or letting
   - `message` — Textarea, required (label e.g. "Message and preferred times")
   - `property` — **Hidden**, optional. On property pages the theme fills it with the listing title,
     address and URL so each submission records which home it is about.
3. Settings: submit label "Send inquiry"; confirmation message that makes clear this is not a
   confirmed appointment (e.g. "Thank you. An agent will reply to arrange a time."); spam protection
   *Honeypot* (or Turnstile with your own keys); add notification emails if email delivery is set up.

Submissions appear under **Plugins → Forms → Submissions**.

## Checks

```sh
npm run typecheck
npm run build
npm run preview
```

## Dependencies and capabilities

| Package | Version | License | Why |
| --- | --- | --- | --- |
| `emdash`, `astro`, `@astrojs/node`, `@astrojs/react`, `react`, `react-dom` | as pinned | MIT | Framework baseline (from the starter) |
| `@emdash-cms/plugin-forms` | 0.2.11 | MIT | Inquiry form and submissions |
| `@cloudflare/kumo` | 2.6.0 | MIT | Peer dependency of the Forms plugin admin UI |
| `@phosphor-icons/react` | 2.1.10 | MIT | Peer dependency of the Forms plugin admin UI |
| `@fontsource/libre-caslon-text` | 5.3.0 | OFL-1.1 (font) | Headline serif, self-hosted |
| `@fontsource-variable/figtree` | 5.3.0 | OFL-1.1 (font) | Body sans, self-hosted |

**Forms plugin capabilities** (declared by the plugin): `email:send`, `media:write`,
`network:request` with `allowedHosts: ["*"]`. It adds public routes
`/_emdash/api/plugins/emdash-forms/submit` and `/definition`, admin pages (Forms, Submissions), an
admin widget and a weekly cleanup cron. It stores form definitions and submissions (including
submitter IP/user agent metadata) in the site database. Outbound requests happen only if you
configure a webhook, notification email or Turnstile.

Theme code itself makes no external requests at runtime, uses no browser storage, and adds a tiny
script for the mobile menu and for pre-filling the hidden `property` field. Fonts are bundled from
npm; there is no Google Fonts CDN at runtime. (The EmDash integration downloads its own admin fonts
at build time; that is framework behaviour, not theme code.)

## Asset provenance and licenses

All photos in `public/images/haven/` are crops (some mirrored) of the Haven concept cover image from
the ZeroHostCMS theme kit — AI-generated concept art owned by the project author, contributed under
the repository license. No third-party or stock images are used. The source cover is not shipped;
the 17 JPEGs were derived with Pillow (crop, optional horizontal mirror, JPEG quality 84). Because
they come from one 1536×1024 image they are low resolution (largest 913×382) — replace them with real
listing photography before production. Seed images are stored as `provider: "external"` values
pointing at `/images/haven/*.jpg`, because the 1.2.0 seed format can only import media from remote
URLs; images uploaded through the admin use the normal media library.

All places (Rivermere, Oakridge, Mapleton), people, phone numbers (`555-01xx`) and `haven.example`
addresses are fictional. Icons are hand-written inline SVG. Fonts: Libre Caslon Text and Figtree,
SIL Open Font License 1.1, via Fontsource.

## Tested evidence

Local, macOS, Node 24.21.0, Node adapter, dev server on port 4403:

- `npm run typecheck` — 0 errors, 0 warnings. `npm run build` — complete (see limitations).
- Seeded via dev-bypass: 3 collections, 8 properties, 2 agents, 3 pages.
- HTTP 200 for `/`, `/properties`, `/search`, both property detail pages tested (with and without
  photos), both agent profiles, `/contact`, `/about`, `/sell`; 404 for `/nope`, `/properties/nope`,
  `/agents/nope`.
- Search: `listing=sale` 4, `listing=rent` 4, `location=Rivermere` 3, `location=oakridge` 3
  (case-insensitive), `type=villa` 2, `budget=750k-1250k` 2, `budget=rent-2500-4000` 2,
  `location=Mapleton&type=house&budget=1250k-2m` 1, `location=Atlantis` 0 (no-match state),
  `listing=sale&budget=rent-under-2500` 0 (conflict explained), invalid `type`/`budget` ignored (8).
- Inquiry form created with slug `inquiry` through the plugin API; it renders on `/contact` and on
  property pages; one test submission (with the `property` field) was stored and listed.
- Screenshots at 1440 px and 375 px of home, property detail, search, contact; mobile menu
  toggles `aria-expanded`.

Accessibility checks performed: skip link, landmarks (header/nav/main/footer, `role="search"`),
labelled selects, one `h1` per page, alt text on content images (decorative hero has empty alt),
visible focus outline, `prefers-reduced-motion` respected, mobile menu operable by keyboard with
Escape to close. Not performed: screen-reader walkthrough, automated contrast audit, 200 % zoom audit.

## Known limitations

- English only, light mode only, no RTL.
- Not validated on the Cloudflare adapter; only the Node adapter was run.
- Agent link is a plain slug field (not a relation picker); a wrong slug just hides the agent card.
- Listing queries cap at 200 entries without pagination — fine for boutique inventories.
- Hero copy on the home page lives in `src/pages/index.astro`, not in the CMS.
- Seed photos are low resolution (see provenance).
- The first `npm run build` on a machine fetches EmDash's admin fonts; offline it can fail with
  "fetch failed" until those are cached.

## Migration and removal

New installs only. The seed creates `properties`, `agents` and `pages` collections and the `primary`
menu. Switching away leaves that content and any Forms plugin data in the database; removing the
plugin leaves its stored forms and submissions until deleted. No existing installation is modified.

## License

MIT (repository license). Fonts remain under the SIL Open Font License 1.1.
