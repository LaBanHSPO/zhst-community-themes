import assert from "node:assert/strict";
import test from "node:test";
import { resolveDocuments, openApi } from "../src/lib/model";
import { renderDocument } from "../src/lib/render";
import type { Company, Doc, DocLocale } from "../src/lib/types";

const company: Company = { slug: "orbit", title: "Orbit", description: "Project API", sandbox_url: "https://sandbox.api.orbit.example/v1", production_url: "https://api.orbit.example/v1", default_language: "en", accent: "#0f766e", api_version: "v1" };
const locale: DocLocale = { code: "en", title: "English", api_language: "en", strings: {} };
function doc(overrides: Partial<Doc> = {}): Doc {
  return { slug: "orbit-en-overview", title: "Overview", description: "Overview", company: "orbit", language: "en", doc_key: "overview", category: "Guides", position: 1, body: "English body", ...overrides };
}

test("locale resolution prefers translation, falls back within the selected company, and never borrows another product's pages", () => {
  const rows = [doc(), doc({ language: "km", body: "Khmer translation" }), doc({ doc_key: "authentication", position: 2 }), doc({ company: "other-product", doc_key: "secret-contract", language: "km" })];
  const resolved = resolveDocuments(rows, company, "km");
  assert.deepEqual(resolved.map(item => [item.doc_key, item.language, item.body]), [["overview", "km", "Khmer translation"], ["authentication", "en", "English body"]]);
  assert.deepEqual(resolveDocuments([doc({ company: "other-product" })], company, "en"), []);
});

test("a prose-only translation retains the company's published API contract", () => {
  const canonical = doc({ method: "GET", path: "/projects/{projectId}", operation: { operationId: "getProject", responses: { "200": { description: "Status" } } } });
  const translated = doc({ language: "km", body: "Translated prose" });
  const resolved = resolveDocuments([canonical, translated], company, "km");
  assert.equal(resolved[0]!.body, "Translated prose");
  assert.equal(openApi(company, resolved).paths["/projects/{projectId}"]!.get!.operationId, "getProject");
});

test("a prose-only default language inherits English metadata while preserving translated endpoint overrides", () => {
  const multilingual = { ...company, default_language: "vi" };
  const english = doc({ method: "GET", path: "/projects", operation: { operationId: "listProjects", responses: { "200": { description: "Projects" } } } });
  const vietnamese = doc({ language: "vi", body: "Vietnamese prose", path: "/localized-projects" });
  const khmer = doc({ language: "km", body: "Khmer prose" });
  const resolved = resolveDocuments([english, vietnamese, khmer], multilingual, "km");
  assert.equal(resolved[0]!.body, "Khmer prose");
  assert.equal(openApi(multilingual, resolved).paths["/localized-projects"]?.get?.operationId, "listProjects");
  const fallback = resolveDocuments([english, vietnamese], multilingual, "lo");
  assert.equal(fallback[0]!.language, "vi");
  assert.equal(openApi(multilingual, fallback).paths["/localized-projects"]?.get?.operationId, "listProjects");
});

test("ambiguous published translations fail instead of picking an arbitrary contract", () => {
  assert.throws(() => resolveDocuments([doc(), doc({ body: "Conflicting contract" })], company, "en"), /Duplicate/);
});

test("OpenAPI authenticates endpoints with a bearer token and separates inbound webhooks from provider endpoints", () => {
  const api = openApi(company, [doc({ method: "GET", path: "/projects/{projectId}", operation: { operationId: "getProject", responses: { "200": { description: "Status" } } } }), doc({ doc_key: "webhook", operation: { operationId: "projectUpdatedWebhook", "x-webhook-name": "projectUpdated", responses: { "200": { description: "Received" } } } })]);
  assert.deepEqual(api.paths["/projects/{projectId}"]!.get!.security, [{ BearerAuth: [] }]);
  assert.equal(api.webhooks!.projectUpdated!.post!.operationId, "projectUpdatedWebhook");
  assert.deepEqual(api.webhooks!.projectUpdated!.post!.security, [{ WebhookBearer: [] }]);
  assert.equal(api.paths.webhook, undefined);
  assert.equal(api.servers[0].url, company.sandbox_url);
});

test("explicit customer authentication survives export without changing public or bearer endpoints", () => {
  const security = [{ PartnerToken: [], PartnerCode: [] }];
  const schemes = {
    PartnerToken: { type: "apiKey", in: "header", name: "X-Api-Token" },
    PartnerCode: { type: "apiKey", in: "header", name: "X-Client-Source" },
  };
  const api = openApi(company, [
    doc({ method: "POST", path: "/orders", operation: { operationId: "createOrder", security, "x-security-schemes": schemes } }),
    doc({ doc_key: "health", method: "GET", path: "/health", operation: { operationId: "health", security: [] } }),
  ]);
  assert.deepEqual(api.paths["/orders"]!.post!.security, security);
  assert.deepEqual(api.paths["/health"]!.get!.security, []);
  assert.deepEqual(api.components.securitySchemes.PartnerToken, schemes.PartnerToken);
  assert.deepEqual(api.components.securitySchemes.PartnerCode, schemes.PartnerCode);
  assert.equal(api.paths["/orders"]!.post!["x-security-schemes"], undefined);
  const otherApi = openApi(company, [doc({ method: "GET", path: "/projects", operation: { operationId: "listProjects" } })]);
  assert.deepEqual(otherApi.paths["/projects"]!.get!.security, [{ BearerAuth: [] }]);
  assert.equal("PartnerToken" in otherApi.components.securitySchemes, false);
});

test("conflicting authentication definitions cannot silently change another endpoint's contract", () => {
  const first = doc({ method: "GET", path: "/first", operation: { operationId: "first", "x-security-schemes": { Token: { type: "apiKey", in: "header", name: "X-Token" } } } });
  const second = doc({ doc_key: "second", method: "GET", path: "/second", operation: { operationId: "second", "x-security-schemes": { Token: { type: "http", scheme: "bearer" } } } });
  assert.throws(() => openApi(company, [first, second]), /Conflicting OpenAPI security scheme/);
});

test("colliding endpoint contracts cannot silently overwrite one another", () => {
  const first = doc({ method: "POST", path: "/projects", operation: { operationId: "createProject" } });
  const second = doc({ doc_key: "other", method: "POST", path: "/projects", operation: { operationId: "otherCreateProject" } });
  assert.throws(() => openApi(company, [first, second]), /Duplicate OpenAPI endpoint/);
});

test("CMS Markdown cannot execute HTML or javascript URLs", () => {
  const { html } = renderDocument('<script>alert(1)</script>\n\n[click](javascript:alert%281%29)\n\n<img src=x onerror=alert(1)>', locale);
  assert.equal(/<script|<img[^>]+onerror|href="javascript:/i.test(html), false);
  assert.match(html, /&lt;script&gt;/);
});

test("Mermaid is rendered as an inert image with accessible source, not inline active SVG", () => {
  const { html } = renderDocument('```mermaid\nflowchart LR\n A[Create project] --> B[Process event]\n```', locale);
  assert.match(html, /<img src="data:image\/svg\+xml;base64,/);
  assert.match(html, /<details>/);
  assert.match(html, /Create project/);
  assert.equal(html.includes("<svg"), false);
  assert.equal(html.includes("diagram-error"), false);
});
