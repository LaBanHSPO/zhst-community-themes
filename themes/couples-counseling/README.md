# Couples Counseling

A standalone EmDash theme for ZeroHostCMS (`type: company`, inquiry on). The fictional practice is
TogetherWell, a small couples counseling practice in Millbrook. Everything is driven by CMS collections and
seeded with synthetic sample content.

- A full-bleed photo hero with a handwritten note, three approach points, how sessions work, what couples
  often bring, sample fees, a short resources teaser and an intro-call band.
- Approach and About pages (CMS pages), the About page with a small counselor collection shown as initials.
- Resources: short articles with a `?category=` topic filter and `/resources/[slug]` pages.
- Contact: a mailto form for a free intro call, `?format=online|in-person` pre-selects how to meet.
- Styled 404, working `<details>` mobile menu, responsive down to 375px.

| Route | Content |
|---|---|
| `/` | Home, as designed, plus sessions, topics, fees and resources below the fold |
| `/approach` | CMS page `approach` with the room photo and fees |
| `/about` | CMS page `about` and the counselors collection |
| `/resources`, `/resources/[slug]` | Articles; filter with `?category=communication`, `conflict`, `everyday`, `counseling` |
| `/contact` | Intro call request, always shows email and phone |
| `/[slug]` | Any other CMS page |

## Notes on content

- No outcome promises, testimonials, degrees, licence numbers or awards. The About page has a labelled
  placeholder for the owner's real registration details (edit it in Practice details).
- The crisis line ("If either of you is unsafe or in crisis...") is in the contact page and the footer.
- Fees are labelled samples. Names, address, phone (555 010 01xx) and email (.example) are fictional.
- The contact form only opens the visitor's email app; the site stores and sends nothing.

## Images

All photos are cropped from the supplied design comps (a and b). Text baked into the hero (logo, nav, headline,
button, handwritten note) was inpainted out and is live text. Crops are used at native size or close to it, but the
source comps are small, so some photos repeat across pages.

## Fonts and licences

Self-hosted via Fontsource, all under the SIL Open Font License 1.1:
Newsreader (headlines, approximates the design serif, set slightly condensed), Figtree (text), Allison
(handwritten note, thinner than the design pen but heavier than a hairline). Icons and the leaf mark are inline SVG
approximations. No external requests, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0`. Pins EmDash 1.2.0 and Astro 7.3.5.

```sh
npm ci
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Edit content at `/_emdash/admin/`.

## Checks

```sh
npm run typecheck   # 0 errors, 0 warnings, 0 hints
npm run build       # Node adapter, standalone server
```

Every route was screenshotted at 1440 and 375 (no horizontal overflow). The 1440x1086 fold was compared with
the design (1448 wide): text, pill, circles and photo are within about 1 to 4px; the right edge sits about 8px
left because of the narrower viewport. The headline is Newsreader scaled to the design width.

## License

Theme code: MIT. Photos derive from the supplied design comps.
