# MinimalFolio Studio

A Swiss editorial portfolio theme for [EmDash](https://emdashcms.com/), forked from MinimalFolio:
a project showcase, about and contact pages, with synthetic sample content. Paper white, ink
black and one vivid orange; oversized Inter Tight headings; a fixed left navigation column on
desktop and a disclosure menu on phones. Light, dark and system colour modes. The data model,
collections, routes and RSS feed are the same as MinimalFolio; only the presentation differs.
It is a standalone EmDash host that runs on any Node.js server with SQLite and local file storage — no cloud account, credentials or private
platform access required.

## What is included

- **Work** — a `projects` collection (title, client, year, summary, gallery, project URL) with a
  `/work` index and detail pages.
- **About** and **Contact** pages.
- An RSS feed and a minimal 404 page.
- Swiss editorial styling. The home headline is the site tagline; wrap a word in `*asterisks*`
  (for example `Design for a *clearer* tomorrow.`) to set it in the accent orange.

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

Open the local URL printed by Astro (normally `http://localhost:4364/`) and visit
`/_emdash/admin/` to edit content. `.env` is private and ignored; never commit it or share its
key. Set `MINIMALFOLIO_DATA_DIR=/some/path` to keep `data.db` and `uploads/` outside the project
folder; unset, they live in the project folder as in MinimalFolio.

## Checks

```sh
npm run typecheck
npm run build
npm run preview
```

## Provenance

Generated with `create-emdash@1.2.0` (`--platform node --template portfolio`) and rebranded for
MinimalFolio, then redesigned as MinimalFolio Studio. Sample content is synthetic; replace it with your own material. No private
ZeroHostCMS code, credentials or customer data is used.

## License

MIT. Preserve upstream EmDash/Astro notices and the licenses of any third-party assets you add.
