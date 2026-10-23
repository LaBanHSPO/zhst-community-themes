# Coursecraft

A course website theme for [EmDash](https://emdashcms.com/), aimed at **independent instructors,
professional trainers and small learning businesses**. It helps a potential learner answer three
questions quickly: *Is this course for me? What will I learn? Who will guide me?* Every course page is
organised around those decisions and ends with one next step: an enrollment inquiry, or a link to the
course on the instructor's own platform.

It is a standalone EmDash host that runs on any Node.js server with SQLite and local file storage. No
cloud account, credentials or private platform access is required.

## Pages

| Page | Route | What it shows |
| --- | --- | --- |
| Home | `/` | Hero, three featured courses, "three questions" explainer, instructors, contact CTA |
| Courses | `/courses` | Course cards with level, lesson count, summary and lesson outline |
| Courses by level | `/courses?level=beginner` / `intermediate` / `advanced` | Server-side filtered catalog with empty state; unknown levels fall back to all courses with a notice |
| Course detail | `/courses/[slug]` | Level, facts, learning outcomes, prerequisites, description, curriculum, FAQ, instructor, enrollment |
| Instructors | `/instructors` | Instructor profiles (photo or initials) |
| Instructor | `/instructors/[slug]` | Bio and the courses they teach |
| About | `/about` | Editable page (`pages` collection) |
| Contact | `/contact` | Inquiry form slot plus always-visible contact details |
| 404 | any unknown path | Friendly not-found page with links back |

## Scope implemented

- **Course cards with level and lesson outline:** `level` select (beginner / intermediate / advanced),
  lesson count derived from the curriculum, and the first three modules on catalog cards.
- **Learning outcomes and prerequisites:** repeater fields rendered as a checklist and a list.
- **Instructor profiles:** an `instructors` collection; each course references one instructor through the
  `course_instructor` relation, and instructor pages list the courses linked to them.
- **Curriculum overview and FAQ:** a `curriculum` repeater (module title + lessons, one per line) shown as
  numbered `<details>` modules, and a per-course `faq` repeater shown as `<details>` disclosures.
- **Enrollment inquiry or external course link:** if a course has `external_url`, the page shows a
  "Go to course" outbound link (http/https only). Otherwise it shows "Enrollment inquiry" with the course
  title above the inquiry form and the contact details.
- Site search (EmDash LiveSearch over courses, instructors and pages), a primary menu, and a contact
  details widget area, all editable in the admin.

## Out of scope

This theme presents courses; it is **not an LMS**. It has no payments or checkout, no protected lessons
or lesson delivery, no student accounts, quizzes, progress tracking, certificates or learner analytics,
and nothing in the UI implies them. Those need an LMS or a separately built learning backend, reached
through each course's external link.

## Content model (`seed/seed.json`)

- `courses`: `title`, `summary`, `level` (select), `cover_image` (image), `duration`, `format`,
  `featured` (boolean, home page), `instructor` (reference), `description` (Portable Text),
  `outcomes`, `prerequisites`, `curriculum`, `faq` (repeaters), `external_url` (url, optional).
- `instructors`: `name`, `role`, `photo` (image, optional), `short_bio`, `bio` (Portable Text),
  `courses` (reference, the other end of the same relation).
- `pages`: `title`, `intro`, `content` (About, Contact).
- Relation `course_instructor`: courses → instructors, at most one instructor per course.
- Menu `primary` and widget area `contact` (seeded with `hello@coursecraft.example`).
- Sample content: 6 courses (3 beginner, 2 intermediate, 1 advanced; 2 with an external link, 4 using
  the inquiry form) and 3 instructors (one without a photo, to show the initials fallback). All people,
  courses and domains (`*.example`) are fictional.

## Requirements

- Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm.
- Pins **EmDash 1.2.0**, **Astro 7.3.5**, **React 19.2.4** with the `@astrojs/node` adapter. The project
  owns its `package-lock.json`; there is no root install.

## Set up and run locally

From `themes/coursecraft/`:

```sh
npm ci
npx emdash secrets generate --write .env   # private, gitignored; never commit or share it
npx emdash seed seed/seed.json             # schema + sample content into ./data.db
npm run dev
```

Open the URL Astro prints (normally `http://localhost:4321/`) and visit `/_emdash/admin/` to create your
own administrator and passkey. You can also skip the CLI seed and apply the seed through the admin setup
wizard. Use `npx emdash seed --no-content seed/seed.json` on a fresh database to get the schema, menu and
contact widget without sample courses.

### Create the inquiry form (admin, required for the form to appear)

Forms belong to the forms plugin's own storage, so the seed cannot create them. Until a form with the
slug `inquiry` exists, `<Form id="inquiry" />` renders nothing, and visitors see only the contact
details (email) next to the empty slot.

1. Open `/_emdash/admin/` and go to **Plugins → Forms**.
2. Create a new form and set its **slug** to `inquiry`.
3. Add these fields:
   - `name`, Text, required
   - `email`, Email, required
   - `course`, Text, optional. On course pages the theme pre-fills it with the course title.
   - `message`, Textarea, required ("What would you like to know?")
4. Set the notification email or recipients in the form settings if you want submissions emailed. Email
   delivery needs an EmDash email provider; submissions are stored and listed under **Submissions**
   either way.
5. Save. The form now appears on `/contact` and on every course page without an external link.

## Dependencies and capabilities

| Package | Version | Why | License |
| --- | --- | --- | --- |
| `emdash` | 1.2.0 | CMS runtime | MIT |
| `astro` | 7.3.5 | Framework | MIT |
| `@astrojs/node`, `@astrojs/react` | ^11.1.5, ^6.0.5 | Node adapter, React islands for admin | MIT |
| `@emdash-cms/plugin-forms` | 0.2.11 (exact) | Inquiry form + submissions | MIT |
| `@cloudflare/kumo` | 2.6.0 (exact) | Peer dependency of the forms plugin (admin UI) | MIT |
| `@phosphor-icons/react` | 2.1.10 (exact) | Peer dependency of the forms plugin (admin UI) | MIT |
| `@fontsource-variable/source-serif-4` | 5.3.1 (exact) | Self-hosted display font | SIL OFL 1.1 (font) |
| `@fontsource-variable/inter` | 5.3.0 (exact) | Self-hosted body font | SIL OFL 1.1 (font) |

**Forms plugin capabilities (disclosed):** `email:send`, `media:write`, `network:request`, with
`allowedHosts: ["*"]`. It can send notification email, store uploaded files if you add a file field, and
make outbound network requests to any host (for example webhooks or Turnstile verification you
configure). It also adds admin pages (Forms, Submissions), a dashboard widget, and a public submit
endpoint at `/_emdash/api/plugins/emdash-forms/submit`. Submissions (names, emails, messages) are
personal data stored in your EmDash database; set your own retention policy.

**Theme itself:** no external requests at runtime (fonts and images are served locally), no cookies or
browser storage beyond what EmDash and the plugin set, no secrets. The only scripts are the menu and
search toggles and the course-field prefill on the inquiry form.

## Asset provenance and licenses

- `public/media/*.jpg`: crops and derivatives, made with macOS `sips`, of `coursecraft-cover.png`, the
  project owner's AI-generated concept artwork for Coursecraft. They are not photographs of real people,
  products or places. Seed image fields reference them as external media at `/media/...`, so no download
  happens during seeding. Replace them with your own images in the admin.
- The leaf logo mark is a simple inline SVG drawn for this theme.
- Fonts: Source Serif 4 and Inter, served from the `@fontsource-variable` packages under the SIL Open
  Font License 1.1. No Google Fonts CDN.
- Code: MIT, like the repository. Adapted from the repository's `urbanguide` skeleton (itself generated
  with `create-emdash@1.2.0 --template starter`).

## Tested evidence

Run on macOS with Node v24.21.0 and npm 11.19.0, Node adapter only:

- `npm run typecheck`: 0 errors, 0 warnings, 0 hints (18 files).
- `npm run build`: complete. Vite's chunk-size advisory is the only warning.
- `npm ci --dry-run`: lockfile in sync.
- Dev server on port 4404 with the full seed, checked with curl:
  - `/`, `/courses`, `/courses?level=beginner|intermediate|advanced|expert`, all 6 course pages,
    `/instructors`, all 3 instructor pages, `/about` and `/contact` return 200.
  - `/does-not-exist`, `/courses/does-not-exist` and `/instructors/does-not-exist` return 404.
  - Level counts: all 6, beginner 3, intermediate 2, advanced 1, unknown `expert` 6 with a notice.
  - The 4 inquiry courses show "Enrollment inquiry" with the course title and contact email; the
    2 external courses show "Go to course" pointing to their `https://learn.example.com/...` URL.
  - Instructor pages list their linked courses (Maya: 3); Priya shows the initials fallback.
- Inquiry path: the forms plugin is mounted, and its public definition/submit routes answer
  `404 Form not found` for `inquiry` while no form exists. In that state the form slot is hidden and
  the email stays visible. **Not tested:** rendering and submitting a real form, because creating one
  needs an admin passkey session, which was not set up in this run.
- Empty site (`--no-content` seed): `/`, `/courses`, `/courses?level=advanced`, `/instructors` and
  `/contact` return 200 with empty states ("No courses published yet", "No advanced courses yet",
  "No instructors yet"), and the contact email still shows. `/about` returns 404 there because the
  About page is sample content.
- Screenshots: home and course detail at 1440 px and 375 px, mobile menu open, keyboard focus ring,
  external-link course, level-filtered catalog, instructor without a photo, empty state.
- Accessibility checks made: skip link, `header`/`nav`/`main`/`footer` landmarks, one `h1` per page,
  visible `:focus-visible` outline, `aria-current` on the active nav item, filter and breadcrumb,
  `aria-expanded` on the menu and search toggles (Escape closes them), native `<details>` for
  curriculum and FAQ, alt text on all seeded images, decorative images hidden, `prefers-reduced-motion`
  respected, and a CSS fallback that shows the menu and search when JavaScript is off (not
  browser-tested with JavaScript disabled). No automated contrast or screen-reader audit was run.

## Known limitations

- Cloudflare adapter compatibility is untested; this is a Node-only run.
- Only a light colour scheme exists; no dark mode or RTL.
- Seed images are small crops (164–530 px high) of one concept image, so they look soft on large
  screens. Replace them with real course imagery.
- Seed images are external-provider media pointing to `/media/...`. They do not appear in the admin
  Media Library until you re-upload them.
- `npm audit --omit=dev` reports 1 moderate advisory in the transitive `sanitize-html` 2.18.0. It was
  left unchanged to keep the pinned baseline; review it before production.
- The inquiry form needs the manual admin step above. Without it, course pages offer email contact only.
- The reference field holds at most one instructor per course (`maxChildrenPerParent: 1`).

## Migration and removal

This is a new theme; no existing installation is affected. Switching away leaves the `courses`,
`instructors` and `pages` collections, the `course_instructor` relation, the `primary` menu, the
`contact` widget area and any form submissions in the database. Removing the forms plugin from
`astro.config.mjs` stops form rendering; its stored forms and submissions stay until deleted in the admin.

## License

MIT. Fonts keep their SIL Open Font License 1.1 notices from the Fontsource packages.
