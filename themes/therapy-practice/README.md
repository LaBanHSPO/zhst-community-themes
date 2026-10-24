# Therapy Practice (therapy-practice)

A cream, linen and sage theme for [EmDash](https://emdashcms.com/), shown with the fictional practice
"Willow & Co." and its therapist, Maren Ellis. It has a full-bleed photo hero, three themes of support, a
short "what starting out looks like" section, a plain list of areas of work, session length and fees, an FAQ
teaser, an About page, an Approach page, a full FAQs page and a free intro call enquiry page. Everything is
driven by CMS collections and seeded with synthetic sample content. It is a standalone EmDash host that runs
on any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 31 ("A space to feel heard." / "Life feels
lighter when you don't have to carry it all alone.").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: photo hero (headline, sub text, "Meet your therapist", caption row); Explore, Heal and Grow; what a first session is like (three steps with a photo); areas of work as a plain list beside a sessions and fees card; four FAQs; contact band |
| `/about` | "Meet your therapist": CMS page `about` with portrait, how she works, a labelled placeholder for registration and training details, and links to contact and Approach |
| `/approach` | CMS page `approach`: starting out, in the room or online, what a session is like, how often, confidentiality in plain words, what this is not |
| `/faqs` | Every question from the `faqs` collection as native `<details>` elements, no JavaScript |
| `/contact` | Intro call enquiry form (name, email, phone, in person or online, best times, optional "what brings you here"); `?format=online` or `?format=in-person` pre-selects how to meet; email and phone always shown beside it |
| `/[slug]` | Any other CMS page |
| `404` | Styled not-found page |

The primary menu (`Home, About, Approach, FAQs`) is an EmDash menu and can be edited in the admin. The olive
"Get in touch" pill in the header goes to `/contact`; "Meet your therapist" on the hero goes to `/about`.

Below 1000px the navigation collapses into a round button that opens a panel (a native `<details>` element,
so it works without JavaScript). On phones the hero stacks: text first, then the photo. Layouts were checked
down to 375px.

## Collections

- **pages**: title, optional small label and intro, Portable Text content. Slugs `about` and `approach` feed
  those routes.
- **faqs**: question, answer, a "show on the homepage" flag, sort order.
- **principles** (Three points): title, text (a line break splits it), icon (`leaf`, `heart` or `sun`), sort order.
- **steps** (First session steps): title, "when or how long" label, text, sort order.
- **areas** (Areas I work with): area, one line of detail, sort order.
- **practice**: one entry with the therapist's name, base, phone, enquiry email, intro call length, session
  length, fee per session, registration and training details, reply time and the note above the form.

Site settings: the title ("Willow & Co.") is the serif wordmark and the tagline ("Therapy Practice") is the
tracked caps line beneath it; an uploaded logo replaces both.

## Before you use it for a real practice

The theme makes no outcome promises and shows no testimonials, but it ships sample content that you must
replace:

- **Registration and training.** The About page shows a boxed, clearly labelled placeholder
  ("[Placeholder] Add your professional body, registration number and qualifications here.") taken from the
  `practice` entry. Replace it with your real details or empty the field to hide the box. The sample text
  makes no claims about degrees, licences, memberships, awards or years in practice.
- **Fee.** The home page shows "[Add your fee per session]" until you set `fee_label`.
- **Confidentiality, cancellation and crisis wording** on the Approach and FAQs pages is general sample text.
  Check it against your own professional body's rules and the law where you practise.
- **Maren Ellis is a fictional, AI-generated persona** and the photos of her are AI-generated. The About page
  caption says so; remove the caption and the photos when you add your own.

## Inquiries

The form validates in the browser (name, email and best times required, with inline messages), then opens
the visitor's email app with a pre-filled message addressed to the practice. Nothing is sent or stored by the
site itself, and the status message says so; without JavaScript the email address is shown instead. The page
asks visitors not to share detailed personal or clinical information by email, and shows the line "If you are
in crisis or at risk, contact your local emergency number or crisis line now. This practice can't respond
urgently." above the form and in the footer. No form plugin is used. The hosted ZeroHostCMS native inquiry
handler is the intended production route; it is not wired into this standalone theme. The extension manifest
declares `inquiry: true` and type `bio`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, both under the SIL Open Font License 1.1:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader`: the hero headline, wordmark, section titles and page headings. It is
    the closest free match to the design's high-contrast serif, though it sets slightly wider than the design.
  - [Figtree](https://github.com/erikdkennedy/figtree) (variable) via `@fontsource-variable/figtree`: body
    text, navigation and buttons.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of
  concept 31 (`31-therapy-practice-a.png` and `-b.png`, AI-generated design comps):
  - `hero-home.webp` (1448x790): the design hero with the wordmark, navigation, "Get in touch" pill, headline,
    sub text, button and caption row removed by inpainting (the theme draws live text over the same spots).
    The books, mug and framed print are physical objects in the photo and stay.
  - `session-room.webp` (1448x1086) and `therapist-portrait.webp` (820x1046) come from image b at native
    resolution; `room-detail.webp` (520x365) is a smaller crop of the same image used on the 404 page.
  The photos repeat across pages because the source comps are small.
- **Icons** (arrows, menu button, sprig mark, leaf, heart, sun) are inline SVG approximations. No other
  external requests, no browser storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5** and owns its own `package-lock.json`.

```sh
npm ci
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content (or complete the admin setup
wizard, which can apply the same seed).

## Checks

```sh
npm run typecheck   # astro check
npm run build       # Node adapter, standalone server
```

Tested with Node 24.21.0 on macOS, Node adapter only. Every route was screenshotted at 1440px and 375px (no
horizontal overflow at 375px, mobile menu opens, `?format=` pre-selection works, unknown URLs return 404). The
1440x1086 homepage fold was compared with the design screen (1448 wide): headline, sub text, button, caption
row, section heading and the three circles sit within about 1 to 5px of the design. The sprig mark is a hand
drawn approximation and is lighter than the design's.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the
database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (practice, therapist, town, phone, email, fees and FAQs) is synthetic; the phone number
uses a 555-01xx-style fictional number and the email uses the `.example` domain. Fonts remain under the SIL
Open Font License 1.1.
