# Local Red Cross

A public website theme for a **local Red Cross chapter**, built on EmDash + Astro. It ports an approved static prototype into a real, CMS-driven site: a red humanitarian identity (`#E11923`), Vietnamese navigation, transparent fund reporting, a document library, a news feed and a static leadership chart.

The public **news feed, media and pages** are native EmDash content. The **member registry, fund ledger and document library** are provided by the companion plugin [`redcross-chapter`](https://github.com/ZeroHostCMS/zhst-community-plugins/tree/main/plugins/redcross-chapter), which this theme registers in `astro.config.mjs`. The **org chart and leadership profiles are static** (edited in the theme, not the CMS). **Admin login is EmDash's own** account/passkey flow at `/_emdash/admin`.

The platform extension manifest uses the supported `company` theme type. The companion plugin is registered by `astro.config.mjs`, not an unsupported `capabilities.plugins` manifest field.

## Pages

| Route | Source | What it shows |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Hero, fund snapshot, featured news, leadership, image feed |
| `/ve-hoi` | `src/pages/ve-hoi.astro` | History, mission, 7 humanitarian principles |
| `/bo-may` | `src/pages/bo-may.astro` | Static org chart + leadership profiles (`src/utils/leadership.ts`) |
| `/quy` | `src/pages/quy.astro` | Public fund transparency (plugin `public-fund`) |
| `/van-ban` | `src/pages/van-ban.astro` | Public documents (plugin `public-documents`) |
| `/ban-tin` | `src/pages/ban-tin/index.astro` | News list (EmDash `posts`) |
| `/ban-tin/[slug]` | `src/pages/ban-tin/[slug].astro` | Article detail (Portable Text) |
| `/thu-vien-anh` | `src/pages/thu-vien-anh.astro` | Image library from post cover images |
| `/lien-he` | `src/pages/lien-he.astro` | Contact info + form shell |
| `/[slug]` | `src/pages/[slug].astro` | CMS-managed pages |

News authoring, image uploads and content editing all happen in the EmDash admin. The static chart in `bo-may.astro` and `src/utils/leadership.ts` is intentionally not CMS-managed.

## Setup

This theme expects the companion plugin repository cloned as a **sibling** directory:

```
<parent>/
  zhst-community-themes/themes/local-redcross
  zhst-community-plugins/plugins/redcross-chapter
```

Build the plugin first (`npm install && npm run build` in `plugins/redcross-chapter`), then:

```sh
npm install
npx emdash secrets generate --write .env
npm run dev        # http://localhost:4321/ ,  admin at /_emdash/admin
```

Review checks:

```sh
npm run typecheck
npm run build
npm run preview
```

## Content model (`seed/seed.json`)

- `posts` — Bản tin (`title`, `featured_image`, `excerpt`, `content`), categories + tags, URL `/ban-tin/{slug}`.
- `pages` — CMS pages, URL `/{slug}`.
- `primary` menu drives the site navigation.

Seed content is synthetic Vietnamese sample data; replace it with the chapter's own content.

## Design

`src/styles/theme.css` holds the design tokens and components ported from the approved prototype (buttons, hero, stats, cards, leadership, fund bars/donut, tables, album, article, footer). `src/layouts/Base.astro` wires the header/nav/footer and the EmDash head/body helpers.

### Chapter emblem

The default header and footer use [`public/images/logo-cross-vn.webp`](public/images/logo-cross-vn.webp), a lossless 256 × 256 transparent derivative of the supplied `logo-cross-vn.webp` artwork, not a recreated symbol. A chapter's custom Site Identity logo takes precedence in both locations; see [`src/layouts/Base.astro`](src/layouts/Base.astro). Favicon selection remains with EmDash's separate Site Identity favicon setting, rather than introducing a competing theme icon.

## Notes and limitations

- The public fund and document pages read the plugin's **public** routes; when the plugin is not registered those sections render an empty state.
- Fonts load from Google Fonts (`Be Vietnam Pro`); self-host before production if required.
- Fund figures are an internal transparency ledger, not statutory accounting.
- Verified on the Node adapter locally; Cloudflare deployment is a separate operator step.

## License

Theme code is MIT. See the repository [`LICENSE`](../../LICENSE).

The supplied Vietnam Red Cross emblem is a separate asset; the code license does **not** grant rights to that emblem or permission to imply affiliation or endorsement. Confirm authorization and applicable emblem-use and redistribution requirements before publishing or reusing the artwork.
