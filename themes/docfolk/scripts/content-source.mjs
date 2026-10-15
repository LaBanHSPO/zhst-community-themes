import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { documents } from '../src/content/pages.mjs';
import { locales } from '../src/content/locales.mjs';

// This generator owns only the checked-in sample seed, never an installed CMS database.
// Customer recovery snapshots such as seed/cambodia.json are independent; do not overwrite or remove them.
// To regenerate: node scripts/content-source.mjs
// Content edits in the native CMS remain authoritative for an installed portal.
const field = (slug, label, type, extra = {}) => ({ slug, label, type, ...extra });
const required = { required: true };
const collection = (slug, label, labelSingular, fields) => ({
  slug, label, labelSingular, supports: ['drafts', 'revisions'], titleField: 'title', fields,
});
const row = (slug, data) => ({ id: slug, slug, locale: 'en', status: 'published', data });
const seed = {
  $schema: 'https://emdashcms.com/seed.schema.json',
  version: '1',
  defaultLocale: 'en',
  meta: {
    name: 'Docfolk',
    description: 'Docfolk is an open-source, customizable documentation platform for software teams and indie makers. This sample seed publishes product guides and API reference for the fictional Orbit API in English and Vietnamese, with Mermaid diagrams, OpenAPI 3.1, Markdown, and AI discovery resources.',
    author: 'Community contributors',
  },
  settings: { title: 'Docfolk', tagline: 'Your docs. Your brand.' },
  collections: [
    collection('companies', 'Companies', 'Company', [
      field('title', 'Company name', 'string', required),
      field('description', 'Description', 'text', required),
      field('sandbox_url', 'Sandbox API base URL', 'url', required),
      field('production_url', 'Production API base URL', 'url', required),
      field('default_language', 'Default documentation language', 'string', { ...required, defaultValue: 'en' }),
      field('accent', 'Accent color', 'string', { ...required, defaultValue: '#0f766e', validation: { pattern: '^#[0-9a-fA-F]{6}$' } }),
      field('api_version', 'API version', 'string', { ...required, defaultValue: 'v1' }),
    ]),
    collection('documents', 'Documentation', 'Document', [
      field('title', 'Title', 'string', { ...required, searchable: true }),
      field('description', 'Description', 'text', { ...required, searchable: true }),
      field('company', 'Company slug', 'string', { ...required, indexed: true }),
      field('language', 'Document language', 'string', { ...required, indexed: true }),
      field('doc_key', 'Shared translation route key', 'string', { ...required, indexed: true, validation: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } }),
      field('category', 'Navigation category', 'string', required),
      field('position', 'Navigation order', 'integer', required),
      field('body', 'Markdown content', 'text', { ...required, searchable: true }),
      field('method', 'HTTP method (API endpoints only)', 'string'),
      field('path', 'API path without base prefix', 'string'),
      field('operation', 'Self-contained OpenAPI operation', 'json'),
    ]),
    collection('doc_locales', 'Documentation languages', 'Documentation language', [
      field('title', 'Native language name', 'string', required),
      field('code', 'Portal language code', 'string', { ...required, indexed: true }),
      field('api_language', 'Accept-Language API value', 'string', required),
      field('strings', 'Interface translations', 'json', required),
    ]),
  ],
  content: {
    companies: [row('orbit', { title: 'Orbit', description: 'Sample project-management API used to demonstrate a Docfolk documentation portal: projects, regions, pagination, and lifecycle webhooks.', sandbox_url: 'https://sandbox.api.orbit.example/v1', production_url: 'https://api.orbit.example/v1', default_language: 'en', accent: '#0f766e', api_version: 'v1' })],
    doc_locales: locales.map(locale => row(locale.code, locale)),
    documents: documents.map(document => row(`${document.company}-${document.language}-${document.doc_key}`, document)),
  },
};

const seedUrl = new URL('../seed/seed.json', import.meta.url);
try {
  await mkdir(fileURLToPath(new URL('../seed/', import.meta.url)), { recursive: true });
  await writeFile(seedUrl, `${JSON.stringify(seed, null, 2)}\n`, 'utf8');
  console.log(`Generated ${seed.content.companies.length} company, ${locales.length} interface locales, ${documents.length} documents in ${fileURLToPath(seedUrl)}`);
} catch (error) {
  console.error('Unable to generate Docfolk documentation seed:', error);
  process.exitCode = 1;
}
