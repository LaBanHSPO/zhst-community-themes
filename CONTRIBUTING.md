# Contributing a theme

Contribute a complete, independently runnable EmDash theme project to `ZeroHostCMS/zhst-community-themes`. You need a GitHub account, Git, Node.js, and npm—not the private hosting-platform repository, a Cloudflare account, platform secrets, customer data, or account/resource identifiers. Each `themes/<slug>/` project owns its dependencies and lockfile; there is no root install or private workspace dependency.

A merged community PR is source acceptance only. It is not permission to install, execute, deploy, publish, or register the theme in a gallery. See [maintainer review and promotion](#maintainer-review-and-promotion).

## 1. Fork and create a branch

Fork [ZeroHostCMS/zhst-community-themes](https://github.com/ZeroHostCMS/zhst-community-themes) on GitHub. Replace `YOUR-GITHUB-USER` with your username and `my-theme` throughout this guide with a unique lowercase, hyphen-separated slug:

```sh
git clone https://github.com/YOUR-GITHUB-USER/zhst-community-themes.git
cd zhst-community-themes
git remote add upstream https://github.com/ZeroHostCMS/zhst-community-themes.git
git switch -c theme/my-theme
```

Keep a PR focused on one theme. For an existing theme, work in its project directory and use its lockfile and README rather than generating over it.

## 2. Generate a standalone project

Use Node.js in `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The hosting review baseline is **EmDash 1.1.0**, **Astro 7.3.5**, and **@astrojs/cloudflare 14.3.3**. The local walkthrough deliberately uses the Node adapter so no cloud resources or credentials are required. A successful Node build alone does not establish Cloudflare compatibility.

The official [getting-started workflow](https://docs.emdashcms.com/getting-started/) supplies the generator; its [released command parser](https://github.com/emdash-cms/emdash/blob/create-emdash%401.1.0/packages/create-emdash/src/flags.ts) owns the flags below. From the repository root:

```sh
mkdir -p themes
cd themes
npm create emdash@1.1.0 my-theme -- --platform node --template starter --pm npm --no-install --yes
cd my-theme
npm install --save-exact emdash@1.1.0 astro@7.3.5
```

If npm asks permission to download `create-emdash`, review and accept that package prompt. Do not use `--force` or overwrite an existing project.

The generator retrieves the [official starter](https://github.com/emdash-cms/templates/tree/main/starter). Pinning the generator does not pin that moving template. Inspect the generated source, dependencies, and package scripts before installing or running them. The install command pins the two shared runtime packages; keep the resulting `package-lock.json` and record the actual generator, dependencies, and upstream source used in your PR. Resolve incompatibilities against the stated baseline rather than silently upgrading it or bypassing dependency checks. A proposal needing newer APIs must disclose that requirement; it cannot be promoted against an incompatible host.

For another design base, the same released generator supports `blog`, `marketing`, and `portfolio` in place of `starter`. Follow [Create a Theme](https://docs.emdashcms.com/themes/creating-themes/) for the framework contract, but check any newer documentation examples against the installed release. Do not copy private ZeroHostCMS implementations or depend on unpublished framework internals.

## 3. Develop and preview locally

Use the generated project's `package.json`, `astro.config.mjs`, source, and seed as the executable owners. Keep a complete site, not a folder of CSS or a runtime-installable theme package. Customize it through the official [theme authoring guide](https://docs.emdashcms.com/themes/creating-themes/).

Before first setup, adapt `seed/seed.json` to your theme using the [seed-file reference](https://docs.emdashcms.com/themes/seed-files/). Use invented people, organizations, content, and locally redistributable media. Never seed from a customer export or include private designs, credentials, database dumps, or real account/resource identifiers. Preserve upstream attribution; replace sample assets when redistribution rights are unclear.

From `themes/my-theme/`:

```sh
npm run dev
```

Open the local URL printed by Astro, normally `http://localhost:4321/`, and visit `/_emdash/admin/`. Follow the [official local setup](https://docs.emdashcms.com/getting-started/#complete-setup), include synthetic sample content, and create your own local administrator/passkey. Local setup details and browser credentials stay on your machine. Preview the public routes and edit content through the local admin.

Keep the generator's local `.env` private. For a fresh clone of an existing contribution, run these commands inside its theme directory before starting development:

```sh
npm ci
npx emdash secrets generate --write .env
npm run dev
```

The installed CLI's [secret command](https://github.com/emdash-cms/emdash/blob/create-emdash%401.1.0/packages/core/src/cli/commands/secrets.ts) owns local key generation; do not print or share its value or use `--force` to replace an existing key. Only a sanitized `.env.example` containing variable names and empty/example values may be committed. Any project-local `.gitignore` must also allow `.env.example` without exposing real environment files.

Keep reusable synthetic fixtures in source, not local databases or uploads. For seed changes, use a separate fresh checkout and fresh local database to repeat setup both with and without sample content; do not delete or reuse a valuable database. Use [schema evolution guidance](https://docs.emdashcms.com/deployment/schema-evolution/) when describing changes to an existing site's model—changing a seed is not an upgrade/removal plan.

## 4. Prepare review evidence

Stop the development server, then run the starter's declared checks inside the theme project:

```sh
npm run typecheck
npm run build
npm run preview
```

Open the preview URL printed by Astro and exercise the built site. If your chosen template has different scripts, its `package.json` owns the commands; document and run the equivalent checks, never a nonexistent script. Repeat installation and checks from a clean checkout with `npm ci` before submission.

Include a short project README that points to its package scripts, seed, and source entry points and records the intended users/design, upstream provenance, tested runtime/adapter, any optional local configuration, and known limitations. Include the following evidence in the PR, with reusable supporting assets in the theme project where appropriate:

- Actual install, typecheck, build, and local preview commands and results, with Node/npm and resolved dependency versions. Report failures and untested targets honestly. Do not claim Cloudflare validation from a Node-only run; maintainers own the final host-baseline evaluation.
- Screenshots of representative routes on mobile and desktop, including navigation and content-heavy/empty states. Include light/dark modes and RTL where supported or relevant, and explicitly state unsupported modes/locales. Redact local account information, tokens, and private URLs.
- Keyboard navigation, visible focus, semantic headings/landmarks, form labels/errors, image alternative text, contrast, zoom/reflow, and reduced-motion checks where relevant. Screenshots are not accessibility verification; record the checks and limitations separately.
- Fresh setup with and without seed content; CMS edits; empty collections, long text, missing optional images, and unavailable optional integrations. Follow the upstream [theme test checklist](https://docs.emdashcms.com/themes/creating-themes/#test-the-template) for framework-specific cases.
- Licenses, source links, and notices for upstream code and all fonts, images, icons, and other assets. Contributions are offered under the repository [MIT License](LICENSE); third-party material must retain its own notices and compatible redistribution rights. Do not copy proprietary platform code or copyrighted design artifacts without rights.
- Every dependency or plugin addition, external request/service, browser storage use, data access, privileged operation, and required permission or binding; say “none” when applicable. Theme server code is not presumed sandboxed. Keep optional integrations optional for the credential-free local preview.
- Migration, data retention, rollback, and removal implications: affected collections/fields, routes, assets, settings, or plugins; what remains when switching away; and any irreversible loss. State “none” with a reason when no existing installation is affected.

Do not add deployment automation, production credentials, or scripts that implicitly publish during install/build. A public contribution must remain reviewable without private access.

## 5. Submit the pull request

From the repository root, review exactly what will be public. The repository ignore rules are a safety net, not a secret scanner; do not force-add ignored local state.

```sh
git status --short
git add themes/my-theme
git diff --cached --stat
git diff --cached
git commit -m "feat(themes): add my-theme"
git push -u origin theme/my-theme
```

Open a PR from your fork's `theme/my-theme` branch to **`ZeroHostCMS/zhst-community-themes` → `main`**, using [GitHub's compare page](https://github.com/ZeroHostCMS/zhst-community-themes/compare). Complete the [PR template](.github/pull_request_template.md), attach sanitized evidence, and link the original work or source commits. Further fixes go to the same branch; record fresh evidence when source or dependencies change. Do not submit a private hosting-platform PR or request platform credentials as part of contributing here.

## Maintainer review and promotion

These are separate approval boundaries, not automatic stages triggered by a PR:

1. **Community source review:** review the source, dependency/lockfile changes, licenses, capabilities/permissions, local evidence, and migration/removal implications. Merging into `main` accepts source only.
2. **Manual ZeroHostCMS evaluation:** a maintainer selects an exact community commit SHA, inspects it before executing anything, and manually evaluates/deploys it in ZeroHostCMS using the maintainer's own isolated review resources and synthetic content. Record compatibility against the hosting baseline, including its Cloudflare adapter, and the outcome. Keep credentials, resource identifiers, customer information, and restricted evidence out of this public repository and PR.
3. **Separate hosting-platform promotion:** only after that manual review/deployment succeeds may a maintainer open a private hosting-platform promotion PR recording the exact source SHA and review evidence, plus any adaptation and rollback implications. That PR's approval is separate from community acceptance and precedes hosting-platform publication. Contributors do not need access to it.

Fetching or updating the community submodule during a hosting-platform build must never by itself install dependencies, execute theme code, deploy, promote, or register a gallery entry. A new source SHA or changed integration requires renewed review; acceptance of one revision is not blanket approval for future revisions. No community CI job receives platform publication credentials.
