# Tradecraft Studio

A product-studio presentation of the [Tradecraft](../tradecraft/) theme for [EmDash](https://emdashcms.com/): a graphite, silver and acid-lime layout with a large geometric hero, a featured product catalog, pricing and contact pages, and light/dark modes. It is a standalone EmDash host that runs on any Node.js server with SQLite and local file storage. No cloud account, credentials or private platform access is required.

## What is the same as Tradecraft

- **Content model.** The `pages` collection and the five marketing block types (`marketing_hero`, `marketing_features`, `marketing_testimonials`, `marketing_pricing`, `marketing_faq`) are unchanged, so Tradecraft content works as-is.
- **Routes.** `/`, `/pricing`, `/contact` and the 404 page. The menus are `primary`, `footer_product`, `footer_company` and `footer_support`.
- **Dependencies.** EmDash 1.2.0 and Astro 7.3.5 are pinned exactly, as in Tradecraft. The project owns its `package-lock.json`.

## What the studio layout changes

- **Header.** A two-tone wordmark (the first word of the site title in full ink), a centered menu with a lime active marker, a light/dark switch, and a lime **Inquire** button. On phones, a menu button opens a stacked list of links and the Inquire button; Escape closes it and returns focus to the button.
- **Hero.** A large Montserrat headline with the last word in lime, pill buttons, original inline SVG artwork (graphite blocks and a lime disc), and a short subheadline set as a stacked caption. A hero image from the media library replaces the artwork. Centered heroes become compact page intros.
- **Features.** Catalog cards with original SVG tiles, the title, the description and the chosen icon. On phones they become a compact list.
- **Pricing and FAQ.** The highlighted plan is a graphite card with a lime badge and button. The FAQ uses a sticky heading beside the questions.
- **Footer.** A graphite footer with the tagline, the footer menus and a Light / Dark / System switcher.

The sample seed uses synthetic studio copy. It has no testimonials, client logos or metrics. The Testimonials block is still available and styled.

## Develop locally

```sh
npm ci
npx emdash secrets generate --write .env
npm run dev
```

Open the URL Astro prints and visit `/_emdash/admin/` to edit content. The generated secrets file is private and git-ignored.

By default the database (`data.db`) and media (`uploads/`) live in the project folder, as in Tradecraft. To keep them elsewhere, set `EMDASH_DATA_DIR` before starting or building, for example `EMDASH_DATA_DIR=/path/to/data npm run dev`. To load the sample content without the admin wizard, stop the server and run `npx emdash seed seed/seed.json --database <dir>/data.db --uploads-dir <dir>/uploads`.

## Checks

```sh
npm run typecheck
npm run build
npm run preview
```

## Provenance

Forked from Tradecraft (generated with `create-emdash@1.2.0`, `--platform node --template marketing`). The artwork is original inline SVG. Sample content is synthetic; replace it with your own. No private ZeroHostCMS code, credentials or customer data is used.

## License

MIT. Preserve upstream EmDash/Astro notices and the licenses of any third-party assets you add.
