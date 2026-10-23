# Elsewhere (elsewhere)

A slow-travel journal theme for [EmDash](https://emdashcms.com/): ivory, deep navy, muted olive and rust, a
magazine serif (Newsreader) with Inter labels, and destination landscape photography. Everything is driven by CMS
collections and seeded with synthetic sample content. It is a standalone EmDash host that runs on any Node.js
server with SQLite and local file storage.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: "Take the scenic route.", featured story, more from the journal |
| `/destinations` | Destination archive: Europe / Asia / Coastal filters (`?region=`), search (`?q=`), story grid with author and reading time |
| `/posts/[slug]` | Travel article: banner, byline, "On this page" contents built from the story's section headings, numbered sections, inline photo |
| `/about` | About the author: portrait hero, approach topics, newsletter strip |
| `/newsletter` | Newsletter: signup, what you get, preview of the latest edition |
| `/posts`, `/category/[slug]`, `/tag/[slug]` | Restyled story, region and tag archives |
| `/[slug]` | CMS pages (`privacy` is seeded) |
| `404` | Styled not-found page |

The primary menu is an EmDash menu and can be edited in the admin. "Travel article" points at the seeded
featured article; change its URL to any story.

## Collections

- **posts**: title, article subtitle, card excerpt, Portable Text body (each `h2` becomes a numbered section and a
  contents entry), `region` (europe / asia / coastal), topic label, reading minutes, updated date, `featured_image`
  + `photo`, optional inline photo, homepage flag and order, sort order; `category` and `tag` taxonomies.
- **profile**: the author (name, contact email, bio line, introduction, portrait and avatar).
- **topics**: the three "approach" cards on the author page, linked to tags.
- **perks**: the three newsletter benefits. **editions**: the newsletter preview card.
- **pages**: static pages with Portable Text.

Image-bearing entries render the uploaded CMS `image` when present and otherwise the bundled `photo` path in
`public/images/`.

## Forms

The newsletter forms validate in the browser, then open the visitor's email app with a pre-filled subscription
request to the profile email. Nothing is sent by the site itself and the status message says so; without JavaScript
the form falls back to a `mailto:` action and the address is shown. The hosted ZeroHostCMS native inquiry inbox is
the intended production handler and is not wired into this standalone theme.

## Images and external requests

Photographs were cropped from the ZeroHostCMS design mockups for this theme (`public/images/`, about 0.8 MB).
Fonts (Newsreader, Inter) load from Google Fonts via a `<link>` in `Base.astro`; remove it to fall back to system fonts.
The sample author, email (`hello@elsewhere.example`) and stories are synthetic.

## Run

```
npm ci
npx emdash secrets generate --write .env
npm run dev
```
