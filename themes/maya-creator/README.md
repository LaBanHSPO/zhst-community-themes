# Maya (maya-creator)

An editorial creator theme for [EmDash](https://emdashcms.com/): blush, chocolate and a burnt-orange
accent, a magazine serif with a clean sans, and warm kitchen and lifestyle photography. It ships a
homepage, a searchable content library, a partnerships / media kit page, a digital recipe-collection
page and a "Work with me" inquiry page, plus a restyled story archive with category and tag pages.
Everything is driven by CMS collections and seeded with synthetic sample content. It is a standalone
EmDash host that runs on any Node.js server with SQLite and local file storage.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage — "Stories worth slowing down for.", latest stories, partnership card |
| `/library` | Content library — Recipes / Stories / Video tabs (`?tab=stories`, `?tab=video`), search (`?q=`), category (`?cat=`) and format (`?fmt=`) filters, all server-side; save buttons remember a choice in the browser only |
| `/media-kit` | Partnerships / media kit — positioning, audience interest categories, collaboration formats |
| `/collection/[slug]` | Recipe collection — "The Sunday Table": cover, preview spreads, what's included, price and a request-by-email button |
| `/collaborate` | Work with me — ways to work together, partnership examples, inquiry form |
| `/posts`, `/posts/[slug]` | Story archive and story pages (recipes and articles) |
| `/category/[slug]`, `/tag/[slug]` | Story archives by category or tag |
| `/[slug]` | CMS pages (`about` is seeded) |
| `404` | Styled not-found page |

The primary menu (`Homepage · Content library · Partnerships / media kit · Recipe collection · Work with me`)
is an EmDash menu and can be edited in the admin.

## Collections

- **posts** — recipes and stories: title, excerpt, Portable Text body, kind (recipe / story), format
  (article / video), minutes, homepage flag and order, sort order, `featured_image` + `photo`, plus
  `category` and `tag` taxonomies.
- **products** — recipe collections: subtitle, summary, price, price note, button label, highlights,
  included items, hero `hero_image` + `hero_photo`, and preview spreads (repeater of `image` + `photo` + alt).
- **interests** — audience interest categories (title, description, icon, sort order).
- **formats** — collaboration formats (`image` + `photo`, description, sort order).
- **services** — "how we can work together" items (icon, description).
- **examples** — partnership examples (`image` + `photo`, description).
- **profile** — one entry: partnerships email and social links. The forms address this email.
- **pages** — static pages with Portable Text.

Every image-bearing entry renders the uploaded CMS `image` when present and otherwise falls back to the
bundled `photo` path in `public/images/`.

## Forms

The "Send inquiry" form validates in the browser, then opens the visitor's email app with a pre-filled
message to the profile email. The recipe collection's "Get the recipe collection" button is a `mailto:`
link with a pre-filled request. Nothing is sent by the site itself and the status message says so;
without JavaScript the inquiry form falls back to a `mailto:` action and the address is shown. Online
checkout is not part of this theme. The hosted ZeroHostCMS native inquiry inbox is the intended
production handler; it is not wired into this standalone theme.

## Images and external requests

All photographs in `public/images/` were cropped from the ZeroHostCMS design mockups for this theme.
Icons and the wordmark sprig are inline SVG. The "Good Food Brighter Days" sign, the book cover and
the open-book spreads are part of the cropped photographs.

Fonts load from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`): Newsreader, DM Sans and
Caveat. Remove the `<link>` in `src/layouts/Base.astro` to fall back to system fonts.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0**
and **Astro 7.3.5** and owns its own `package-lock.json`.

```sh
npm ci
npx emdash secrets generate --write .env
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content. The generated
secrets file is private and git-ignored; never commit it.
