import { isDeepStrictEqual } from "node:util";
import type { Company, Doc, DocLocale } from "./types";

export const isSegment = (value: string): boolean => /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value);

export function resolveDocuments(rows: Doc[], company: Company, language: string): Doc[] {
  const byKey = new Map<string, Map<string, Doc>>();
  for (const doc of rows) {
    if (doc.company !== company.slug) continue;
    if (!isSegment(doc.doc_key)) throw new Error("Invalid document route key");
    let translations = byKey.get(doc.doc_key);
    if (!translations) { translations = new Map(); byKey.set(doc.doc_key, translations); }
    if (translations.has(doc.language)) throw new Error("Duplicate company, document key, and language");
    translations.set(doc.language, doc);
  }
  const result: Doc[] = [];
  for (const translations of byKey.values()) {
    const canonical = translations.get(company.default_language) ?? translations.get("en");
    const doc = translations.get(language) ?? canonical;
    if (!doc) continue;
    // Translating prose must not silently remove its API contract from machine exports.
    if (canonical && ((!doc.operation && canonical.operation) || (!doc.method && canonical.method) || (!doc.path && canonical.path))) {
      result.push({ ...doc, operation: doc.operation ?? canonical.operation, method: doc.method ?? canonical.method, path: doc.path ?? canonical.path });
    } else {
      result.push(doc);
    }
  }
  return result.sort((a, b) => a.position - b.position || a.doc_key.localeCompare(b.doc_key));
}

export function pageUrl(company: Company, locale: DocLocale, key: string): string {
  return `/${encodeURIComponent(company.slug)}/${encodeURIComponent(locale.code)}/${encodeURIComponent(key)}`;
}

export function markdownDocument(doc: Doc, company: Company, locale: DocLocale, origin: string): string {
  return `# ${doc.title}\n\n${doc.description}\n\nCompany: ${company.title}\nAPI version: ${company.api_version}\nRequested language: ${locale.code}\nContent language: ${doc.language}\nSource: ${origin}${pageUrl(company, locale, doc.doc_key)}\n\n${doc.method && doc.path ? `Endpoint: ${doc.method.toUpperCase()} ${doc.path}\n\n` : ""}${doc.body}\n`;
}

export function llmsIndex(company: Company, locale: DocLocale, docs: Doc[], origin: string): string {
  const base = `${origin}/${company.slug}/${locale.code}`;
  return `# ${company.title}: API documentation\n\n> ${company.description}\n\nPublic product documentation. Never put API tokens, customer data, or private contracts into AI prompts. API version: ${company.api_version}. Content fallback is explicitly labeled per page.\n\n## Machine-readable resources\n\n- [OpenAPI 3.1](${base}/openapi.json): Machine-readable request and response contracts.\n- [Complete documentation](${base}/llms-full.txt): All published pages for this company and locale, including Mermaid source.\n\n## Documentation\n\n${docs.map(doc => `- [${doc.title}](${base}/${doc.doc_key}.md): ${doc.description} [content: ${doc.language}]`).join("\n")}\n`;
}

export function openApi(company: Company, docs: Doc[]) {
  const paths: Record<string, Record<string, Record<string, unknown>>> = {};
  const webhooks: Record<string, Record<string, Record<string, unknown>>> = {};
  const operationIds = new Set<string>();
  const securitySchemes = new Map<string, Record<string, unknown>>([
    ["BearerAuth", { type: "http", scheme: "bearer", description: "API token sent in the Authorization header as a bearer token. Keep it secret." }],
    ["WebhookBearer", { type: "http", scheme: "bearer", description: "Webhook token configured for event delivery; separate from the API token." }],
  ]);
  for (const doc of docs) {
    if (!doc.operation) continue;
    const operation = { ...doc.operation };
    const declaredSchemes = operation["x-security-schemes"];
    delete operation["x-security-schemes"];
    if (declaredSchemes !== undefined) {
      if (!declaredSchemes || typeof declaredSchemes !== "object" || Array.isArray(declaredSchemes)) {
        throw new Error("Invalid OpenAPI security schemes");
      }
      for (const [name, definition] of Object.entries(declaredSchemes)) {
        if (!definition || typeof definition !== "object" || Array.isArray(definition)) {
          throw new Error("Invalid OpenAPI security scheme");
        }
        const scheme = definition as Record<string, unknown>;
        const existing = securitySchemes.get(name);
        if (existing && !isDeepStrictEqual(existing, scheme)) throw new Error(`Conflicting OpenAPI security scheme: ${name}`);
        securitySchemes.set(name, scheme);
      }
    }
    if (typeof operation.operationId !== "string" || operationIds.has(operation.operationId)) {
      throw new Error("Missing or duplicate OpenAPI operationId");
    }
    operationIds.add(operation.operationId);
    const webhookName = operation["x-webhook-name"];
    if (typeof webhookName === "string") {
      if (webhooks[webhookName]) throw new Error("Duplicate webhook");
      operation.security ??= [{ WebhookBearer: [] }];
      webhooks[webhookName] = { post: operation };
      continue;
    }
    if (!doc.path?.startsWith("/") || !doc.method || !/^(get|post|put|patch|delete|head|options)$/i.test(doc.method)) {
      throw new Error("Invalid OpenAPI endpoint");
    }
    const method = doc.method.toLowerCase();
    paths[doc.path] ??= {};
    if (paths[doc.path]![method]) throw new Error("Duplicate OpenAPI endpoint");
    operation.security ??= [{ BearerAuth: [] }];
    paths[doc.path]![method] = operation;
  }
  const servers = [
    { url: company.sandbox_url, description: "Sandbox" },
    { url: company.production_url, description: "Production" },
  ].filter(server => server.url);
  return {
    openapi: "3.1.0",
    info: { title: `${company.title} API`, version: company.api_version, description: `${company.description}\nGenerated from published CMS documentation. Examples are illustrative; do not treat example values as operational.` },
    servers,
    paths,
    ...(Object.keys(webhooks).length ? { webhooks } : {}),
    components: { securitySchemes: Object.fromEntries(securitySchemes) },
  };
}
