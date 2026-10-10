# Standalone ERP theme rules

Read README.md and the companion plugin's AGENTS.md before editing.

- The theme owns Astro runtime configuration and the public workspace launcher. Private CRM/sales behavior and admin React belong in the companion plugin, not public Astro pages.
- Keep upstream EmDash as an exact dependency. Core and @emdash-cms/cloudflare versions move together through reviewed compatibility checks; do not patch core or import internals.
- Use core authentication/admin/session behavior. No public ERP data query, parallel auth provider implementation, caller-selected tenant or production dev-bypass flag.
- Each customer needs a separate application build, database/media/session resources, hostname, secrets and backups. Build-time origin, currency and selected data directory must match deployment.
- Keep the default Node data paths portable and private. Never commit .env, local databases, populated wrangler.json, .dev.vars, tokens or actual customer/resource identifiers.
- The sibling file dependency is development-only. Release immutable reviewed artifacts; rebuilding from latest community source is not publication approval.
- Preserve React host deduplication and the plugin's source admin export. Build the plugin before the theme.
- Run npm run typecheck and npm run build, then exercise the real changed browser surface. Node evidence does not prove a Cloudflare deployment. Use only synthetic fixtures for local checks.
- Source contributions, manual ZeroHostCMS review deployments, and private hosting-platform promotion remain separate approvals. Never automatically provision/deploy or insert this project into the website catalog.
- AI assists source work only; do not add runtime LLM calls or send customer records to a provider without a separately authorized design.
