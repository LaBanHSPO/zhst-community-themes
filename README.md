# ZeroHostCMS Community Themes

Public, independently developed community themes for [ZeroHostCMS](https://zerohostcms.com/), built using released EmDash and Astro APIs. Theme projects belong under `themes/<slug>/`; each owns its dependencies, lockfile, source, synthetic seed content, and local development instructions. They are not members of the private hosting-platform workspace.

Start with [CONTRIBUTING.md](CONTRIBUTING.md) for the standalone authoring walkthrough and review requirements. The framework contract lives in the [EmDash theme documentation](https://docs.emdashcms.com/themes/overview/).

## Curated themes

Standalone EmDash hosts extracted from the ZeroHostCMS curated catalog. Each pins EmDash 1.2.0 and Astro 7.3.5, ships a synthetic seed and a `zhst.extension.json` manifest, and runs locally with only Node and npm.

| Theme | Type | Focus |
| --- | --- | --- |
| [bistro](themes/bistro/README.md) | restaurant | menu, journal, pages |
| [urbanguide](themes/urbanguide/README.md) | directory | listings, guides, pages |
| [tradecraft](themes/tradecraft/README.md) | company | studio landing, pricing, contact |
| [commercelite](themes/commercelite/README.md) | sales | product catalog, pricing, contact |
| [minimalfolio](themes/minimalfolio/README.md) | bio | projects, about, contact |
| [carepulse](themes/carepulse/README.md) | company | services, health notes, pages |

## ERP mini starter

[ERP mini](themes/erp-mini/README.md) is a standalone EmDash host for the community CRM/sales plugin: private customers/contacts, items/services, quotations and sales orders, plus optional **Node-only internal VND double-entry bookkeeping and receivables/payables**. Clone the theme and plugin repositories as siblings, then follow its Node setup and explicit Accounting migration/book setup instructions. Cloudflare retains CRM/sales only; deployment remains an explicit operator action on isolated review resources.

Customer variants fork the theme/plugin layer, not EmDash core. The starter pins EmDash 1.2.0 and provides a daily upstream compatibility workflow for reviewed upgrades, not certification of every latest release. It is not an ERPNext/Frappe runtime, statutory accounting/tax solution, proven thousand-customer fleet or already-approved hosting-platform catalog entry.

## Restaurant chain

The [restaurant chain theme](themes/restaurant-chain/README.md) hosts the companion restaurant plugin on Cloudflare Workers, D1, Queues, and R2. It includes a mobile Vietnamese table menu, staff workspace, SePay webhook transport, and scheduled recovery. Clone the plugin repository as a sibling and follow its local setup; production resources, provider conformance, and hosting promotion remain explicit operator steps.

## OTA server

The [OTA server theme](themes/ota-server/README.md) hosts the companion OTA plugin on Cloudflare Workers, D1, and R2. It serves the frozen `/ota/{app}/{platform}/*` client contract — manifest, bundles with exact lengths and immutable caching, authenticated pushes — plus the private management API behind the plugin's admin workspace. `npm run verify:local` drives the built Worker through 35 end-to-end contract checks. Clone the plugin repository as a sibling and build it first; production resources, a private R2 configuration, and hosting promotion remain explicit operator steps.

## Docfolk documentation

[Docfolk](themes/docfolk/README.md) is an open-source, customizable documentation platform: a public, multi-company portal with CMS-managed content, Mermaid diagrams, OpenAPI 3.1, Markdown, and AI discovery resources. Its checked-in seed documents a sample Orbit API in English and Vietnamese, with English, Khmer, Vietnamese, Lao, and Burmese interfaces and explicit translation fallback. The standalone Node/SQLite host uses native EmDash editing; private content, Cloudflare verification, and hosting promotion are separate concerns.

The recovered [Cambodia logistics customer guide](themes/docfolk/README.md#customer-logistics-content--cambodia) is retained separately in [seed/cambodia.json](themes/docfolk/seed/cambodia.json). Customer documentation must not be deleted or replaced during demo-content or branding changes.

## Source acceptance is not publication

A community pull request accepts source for review, not production use. Fetching this repository as a hosting-platform submodule must not install, execute, or deploy a theme. Merging here does not register a gallery entry or approve publication.

Maintainers must select an exact source commit, manually review and evaluate/deploy it in ZeroHostCMS using their own isolated review resources, and only then propose a separate private hosting-platform promotion. [The contribution guide](CONTRIBUTING.md#maintainer-review-and-promotion) owns that approval boundary.

No private hosting-platform checkout, platform credentials, customer data, or account/resource identifiers are needed to contribute. Platform-owned integrations and private runtimes remain private; a curated theme is an independent reimplementation here, not an export of private platform code.

## License

Repository contributions are under the [MIT License](LICENSE). Preserve upstream notices and identify the licenses and redistribution rights of third-party code, fonts, images, icons, and other assets in each theme project.
