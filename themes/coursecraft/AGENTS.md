This is Coursecraft, an EmDash site (a CMS built on Astro with a full admin UI) for presenting
courses, curricula and instructors, and collecting enrollment inquiries.

## Commands

```bash
npm run dev                      # Start the Astro dev server
npm run typecheck                # astro check
npm run build                    # Production build (Node adapter)
npx emdash seed seed/seed.json   # Apply the seed (schema + sample content) to ./data.db
npx emdash types                 # Regenerate TypeScript types from a running site
```

The admin UI is at `http://localhost:4321/_emdash/admin`.

## Key Files

| File | Purpose |
| --- | --- |
| `astro.config.mjs` | Astro config with `emdash()` (SQLite, local storage) and `formsPlugin()` |
| `src/live.config.ts` | EmDash loader registration (boilerplate — don't modify) |
| `seed/seed.json` | Schema (collections, relation, menu, widget area) + synthetic demo content |
| `emdash-env.d.ts` | Generated collection types (regenerated on dev server start) |
| `src/layouts/Base.astro` | Header (menu, search, CTA, mobile menu), footer, EmDash head/body wiring |
| `src/styles/theme.css` | Design tokens, self-hosted fonts, buttons, level badges, forms-plugin styling |
| `src/components/` | `CourseCard`, `InstructorAvatar`, `EnrollmentPanel`, `ContactDetails` |
| `src/utils/courses.ts` | Level labels, curriculum parsing, lesson counts, safe external URLs |
| `public/media/` | Seed images (crops of the Coursecraft concept art) |

## Rules

- All content pages are server-rendered (`output: "server"`). No `getStaticPaths()` for CMS content.
- Image fields are objects (`{ src, alt }`), not strings. Render them with `<Image image={...} />` from `"emdash/ui"`.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID.
- The course ↔ instructor link is the `course_instructor` relation. Reference fields are **not** in `data`:
  request them with `getEmDashEntry("courses", slug, { references: { instructor: true } })` and read
  `entry.references.instructor.entries`. The instructor side reads `references: { courses: true }`.
- Collection `where` filters accept string values only (`level: "beginner"`). Boolean fields such as
  `featured` are filtered in code.
- `level` is a `select` with options `beginner | intermediate | advanced`; the `/courses?level=` filter
  validates against `LEVELS` in `src/utils/courses.ts`. Keep the two in sync.
- Curriculum is a repeater: `module` (title) + `lessons` (text, one lesson per line). Lesson counts are
  derived from it — there is no separate count field to keep in sync.
- `<Form id="inquiry" />` renders nothing until a form with slug `inquiry` exists (Plugins → Forms).
  Always keep visible contact details (the `contact` widget area) next to it.
- Do not add payments, learner accounts, protected lessons, quizzes, progress tracking or certificates.
  This theme describes courses; delivery happens with the instructor or on the external course link.

## Pages

| Page | Path | Source |
| --- | --- | --- |
| Home | `/` | `src/pages/index.astro` |
| Courses (level filter) | `/courses`, `/courses?level=beginner` | `src/pages/courses/index.astro` |
| Course detail | `/courses/[slug]` | `src/pages/courses/[slug].astro` |
| Instructors | `/instructors` | `src/pages/instructors/index.astro` |
| Instructor | `/instructors/[slug]` | `src/pages/instructors/[slug].astro` |
| Contact | `/contact` | `src/pages/contact.astro` |
| About / other pages | `/[slug]` | `src/pages/[slug].astro` |
| Not found | — | `src/pages/404.astro` |

## Documentation

The EmDash docs are available as an MCP server at `https://docs.emdashcms.com/mcp`. Verify APIs, field
types and seed behaviour there (or in the installed `emdash` package) rather than from memory.
