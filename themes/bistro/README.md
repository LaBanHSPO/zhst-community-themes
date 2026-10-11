# Bistro

A neighborhood restaurant theme for [EmDash](https://emdashcms.com/): a menu, a journal
and static pages, with synthetic sample content. It is a standalone EmDash host that runs on
any Node.js server with SQLite and local file storage — no cloud account, credentials or
private platform access required.

## What is included

- **Menu** — a `menu` collection (name, description, price, category, available) with a
  `/menu` listing and three sample dishes.
- **Journal** — a `posts` collection with category and tag archives, used as restaurant news.
- **Pages** — static pages via slug routing, plus `about`.
- Minimal layout and styling, designed as a base to build on.

## Requirements

- Node.js `^22.22.2 || ^24.15.0 || >=26.0.0`
- npm

The project pins **EmDash 1.2.0** and **Astro 7.3.5** exactly (the platform community
baseline). It owns its own `package-lock.json`; there is no root install.

## Develop locally

```sh
npm ci
npx emdash secrets generate --write .env
npm run dev
```

Open the local URL printed by Astro (normally `http://localhost:4321/`) and visit
`/_emdash/admin/` to edit content. `.env` is private and ignored; never commit it or share its
key.

## Checks

```sh
npm run typecheck
npm run build
npm run preview
```

## Provenance

Generated with `create-emdash@1.2.0` (`--platform node --template starter`) and adapted with a
restaurant seed. Sample content is synthetic; replace the menu, journal and pages with your own
material. No private ZeroHostCMS code, credentials or customer data is used.

## License

MIT. Preserve upstream EmDash/Astro notices and the licenses of any third-party assets you add.
