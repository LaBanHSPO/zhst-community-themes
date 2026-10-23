# Clarity (clarity)

A premium SaaS product-marketing theme for [EmDash](https://emdashcms.com/), built for an AI writing workspace:
white, near-black and electric violet with restrained lavender gradients, a precise sans and monospace accents.
It ships a homepage, a features page with annotated product previews for each stage of the writing workflow, a
pricing page with a monthly/yearly toggle and plan comparison, a customer-workflow story built from a sample input
and output, and a book-a-demo form, all driven by CMS collections and seeded with synthetic sample content. It is a
standalone EmDash host that runs on any Node.js server with SQLite and local file storage.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage — "From rough notes to ready to share." hero with the editor preview, benefit strip, "A better way to write" split, workflow teaser, CTA band |
| `/features` | Features — hero with the editor preview, four-step strip, three capability cards, then one annotated section per stage (outline, draft, edit, share) |
| `/pricing` | Pricing — Free / Solo / Team plans, comparison table and CTA band. `?billing=yearly` switches to yearly prices (a plain link toggle, works without JavaScript) |
| `/customer-workflow` | Workflow listing (not in the mockups; links to every story) |
| `/customer-workflow/[slug]` | Workflow story — sample input and output panels, steps, photo story, and the full input/output. `/customer-workflow/meeting-notes-to-brief` is the designed page |
| `/book-a-demo` | Book a demo — form, "Here's what to expect" agenda with a product preview, "Built for the way you work". Accepts `?plan=free|solo|team` (plan buttons link here) |
| `/[slug]` | CMS pages (`about` is seeded) |
| `404` | Styled not-found page |

The primary menu (`Homepage · Features · Pricing · Customer workflow`) is an EmDash menu and can be edited in the
admin; "Book a demo" is the header button.

## Collections

- **benefits** — title, homepage text, Book-a-demo text, icon, show-on-homepage / show-on-demo flags, sort order.
- **stages** — workflow stages on the Features page: title, strip text, icon, section eyebrow/headline/text,
  annotated points (repeater) and which product preview to show (`outline`, `draft`, `edit`, `share`).
- **capabilities** — feature cards: title, text, link label/URL, preview illustration (`assistant`, `templates`,
  `tone`) and its items (repeater: label, icon).
- **plans** — name, who it is for, monthly price, yearly price per month, free-price label, seats note, button
  label/URL, highlight flag, badge, features (repeater: text, icon).
- **comparison** — comparison rows with Free / Solo / Team cells (`yes` / `no` render as a check / dash).
- **workflows** — customer workflow stories: headline, intro, input panel (title, time, timestamped notes), output
  document (title, sections with outline label, icon, heading, text and bullets), steps, photo story
  (`image` + `photo`, alt text).
- **agenda** — "Here's what to expect" items on the demo page.
- **company** — one entry: name, demo requests email, support email, footer text.
- **pages** — static pages with Portable Text.

Image-bearing entries render the uploaded CMS image when present and otherwise fall back to the bundled `photo`
path in `public/images/`.

## Forms

"Book a demo" validates in the browser, then opens the visitor's email app with a pre-filled message to the
company demo email. Nothing is sent by the site itself, and the status message says so. Without JavaScript the form
falls back to a `mailto:` action and the email address is shown. The hosted ZeroHostCMS native inquiry inbox is the
intended production handler; it is not wired into this standalone theme.

## Images and external requests

All photographs in `public/images/` were cropped from the ZeroHostCMS design mockups for this theme. The product UI
(editor, meeting notes, brief, feature previews) is rebuilt in HTML/CSS; the logo mark and all icons are inline SVG.

Fonts load from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`): Inter and JetBrains Mono. Remove the
`<link>` in `src/layouts/Base.astro` to fall back to system fonts.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5** and owns its own `package-lock.json`.

```sh
npm ci
npx emdash secrets generate --write .env
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content. The generated secrets file is
private and git-ignored; never commit it.

## Checks

```sh
npm run typecheck
npm run build
```

## License

MIT. Sample content is synthetic. Preserve upstream EmDash/Astro notices and the licenses of any third-party assets
you add.
