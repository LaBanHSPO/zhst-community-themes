# Firstlight (firstlight)

A bold prelaunch theme for a calm productivity product, built for [EmDash](https://emdashcms.com/): midnight
blue, acid lime and white, oversize neo-grotesk type (Inter Tight and Inter), sunrise photography and a
product concept preview rebuilt in HTML/CSS. It ships a prelaunch home with a waitlist field, a product
preview, a public roadmap with a page per roadmap item, an early access FAQ and a waitlist confirmation page.
Everything repeating is driven by CMS collections and seeded with synthetic sample content. It is a
standalone EmDash host that runs on any Node.js server with SQLite and local file storage.

## Routes

| Route | Page |
|---|---|
| `/` | Prelaunch home — "Something better is taking shape." sunrise hero, Join waitlist field and the planner concept preview, then three benefits |
| `/preview` | Product preview — "A calmer way to plan your day." with the Today concept (times, focus block, notes), three benefits, alternating Plan / Focus / Notes highlights and a waitlist band |
| `/roadmap` | Public roadmap — Planned, In progress and Next columns (no dates) and a "Help shape what’s next." waitlist band. Each item links to its own page |
| `/roadmap/[slug]` | Roadmap item — column, summary, what it is, why we’re building it and the other items in the same column (e.g. `/roadmap/focus-mode`) |
| `/faq` | Early access FAQ — two columns of accordion questions (`<details>`), a "Can’t find what you’re looking for?" email link and a waitlist band |
| `/confirmation` | Waitlist confirmation — what happens after the visitor sends the waitlist email, what to expect, email preferences and a copyable share link |
| `/[slug]` | CMS pages (`privacy`, "How we handle your email", is seeded and linked from the footer) |
| `404` | Styled not-found page |

The primary menu (`Prelaunch home · Product preview · Public roadmap · Early access FAQ · Waitlist confirmation`)
is an EmDash menu and can be edited in the admin.

## Collections

- **features** (Benefits) — title, short text, icon (`sun`, `leaf`, `bars`, `mail`, `rocket`), placement
  (`home`, `preview`, `confirmation` benefit rows, or `expect` for the confirmation page’s "What to expect"
  card) and order.
- **highlights** (Preview highlights) — eyebrow, heading, lime accent, paragraph, bullet points (one per line),
  order and photo (`image` + `photo` + `photo_alt`).
- **roadmap** — feature, one-line summary, column (`planned`, `in-progress`, `next`), what it is, why we’re
  building it and order within the column.
- **faqs** — question, answer (blank line between paragraphs) and order. The FAQ page splits them into two
  columns in order.
- **launch** — one entry: product name, contact email (waitlist requests are addressed here), share link,
  note under the homepage field and footer description.
- **pages** — static pages with Portable Text.

Every photo renders the uploaded CMS image when present and otherwise the bundled `photo` path in
`public/images/`. The planner screens inside the heroes are product artwork rebuilt in HTML/CSS
(`src/components/AppPreview.astro` and the FAQ cards); their sample tasks live in the component, not the CMS.

## Waitlist, preferences and share link

The Join waitlist fields validate the address in the browser, then open the visitor’s email app with a
pre-filled waitlist request addressed to the launch contact email. Nothing is sent by the site itself, and the
status message says so and links to the confirmation page. Without JavaScript the form falls back to a
`mailto:` action and the address is shown.

The confirmation page therefore does not claim the visitor is already on the list: it reads "Almost on the
list." and explains that they are added once their email arrives and that a reply confirms it. Its email
preference switches are sent the same way ("Email my choices" opens a pre-filled email), and Copy link uses
the clipboard API with a select-to-copy fallback.

The hosted ZeroHostCMS native inquiry inbox is the intended production handler for waitlist sign-ups; it is
not wired into this standalone theme.

## Accessibility notes

Landmarks, a skip link, visible lime focus rings, real labels on every field, an `aria-live` status region on
each form, switches as native checkboxes with `role="switch"`, a `<details>` mobile menu and FAQ accordions,
and `prefers-reduced-motion` are built in. Buttons use midnight text on lime (15:1). On the light preview
section the lime heading accent is darkened to `#6f8a0e` (3.7:1, large text only). The planner artwork is a
`<figure>` with a text description; its inner UI is hidden from assistive technology.

## Images and external requests

All photographs in `public/images/` were cropped from the ZeroHostCMS design mockups for this theme. The
logo and icons are inline SVG.

Fonts load from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`): Inter Tight for headings and
Inter for text. Remove the `<link>` in `src/layouts/Base.astro` to fall back to system fonts.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5** and owns its own `package-lock.json`.

```sh
npm ci
npx emdash secrets generate --write .env
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content. The generated secrets
file is private and git-ignored; never commit it.

## Checks

```sh
npm run typecheck
npm run build
```

## License

MIT. Sample content is synthetic. Preserve upstream EmDash/Astro notices and the licenses of any
third-party assets you add.
