import { getEmDashCollection, getRequestContext, runWithContext } from "emdash";
import { isSegment, resolveDocuments } from "./model";
import type { Company, DocLocale } from "./types";

type Row = { id: string; data: Record<string, unknown> };

async function published(collection: string, where?: Record<string, string | string[]>): Promise<Row[]> {
  const rows: Row[] = [];
  let cursor: string | undefined;
  do {
    // Public HTML and machine exports must stay published-only even in an editor's session.
    const result = await runWithContext({ ...getRequestContext(), editMode: false, preview: undefined }, () =>
      getEmDashCollection(collection, { status: "published", locale: "en", where, limit: 100, cursor }),
    );
    if (result.error) throw new Error(`Unable to read ${collection}`);
    rows.push(...result.entries);
    if (result.hasMore && !result.nextCursor) throw new Error("CMS pagination did not advance");
    cursor = result.nextCursor;
  } while (cursor);
  return rows;
}

const text = (row: Row, key: string, fallback = ""): string => typeof row.data[key] === "string" ? row.data[key] as string : fallback;
const object = (value: unknown): Record<string, unknown> | undefined => value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;

export async function loadDirectory(): Promise<{ companies: Company[]; locales: DocLocale[] }> {
  const [companyRows, localeRows] = await Promise.all([published("companies"), published("doc_locales")]);
  const companies = companyRows.map(row => ({
    slug: row.id, title: text(row, "title"), description: text(row, "description"),
    sandbox_url: text(row, "sandbox_url"), production_url: text(row, "production_url"),
    default_language: text(row, "default_language", "en"), api_version: text(row, "api_version", "v1"),
    accent: /^#[0-9a-f]{6}$/i.test(text(row, "accent")) ? text(row, "accent") : "#8a5a12",
  })).sort((a, b) => a.title.localeCompare(b.title));
  const locales = localeRows.map(row => ({
    code: text(row, "code"), title: text(row, "title"), api_language: text(row, "api_language"),
    strings: Object.fromEntries(Object.entries(object(row.data.strings) ?? {}).filter((entry): entry is [string, string] => typeof entry[1] === "string")),
  }));
  if (companies.some(company => !isSegment(company.slug)) || locales.some(locale => !isSegment(locale.code))) {
    throw new Error("Invalid company or locale route");
  }
  if (new Set(locales.map(locale => locale.code)).size !== locales.length) throw new Error("Duplicate locale code");
  return { companies, locales };
}

export async function loadPortal(companyKey: string, language: string) {
  if (!isSegment(companyKey) || !isSegment(language)) return null;
  const directory = await loadDirectory();
  const company = directory.companies.find(item => item.slug === companyKey);
  const locale = directory.locales.find(item => item.code === language);
  if (!company || !locale) return null;
  const rows = await published("documents", { company: company.slug, language: [...new Set([language, company.default_language, "en"])] });
  const docs = resolveDocuments(rows.map(row => ({
    slug: row.id, title: text(row, "title"), description: text(row, "description"),
    company: text(row, "company"), language: text(row, "language"), doc_key: text(row, "doc_key"),
    category: text(row, "category"), position: Number(row.data.position) || 0, body: text(row, "body"),
    method: text(row, "method") || undefined, path: text(row, "path") || undefined, operation: object(row.data.operation),
  })), company, locale.code);
  return { ...directory, company, locale, docs };
}
