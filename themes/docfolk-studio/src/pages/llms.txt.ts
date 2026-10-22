import type { APIRoute } from "astro";
import { loadDirectory } from "../lib/data";
export const GET: APIRoute = async ({ site, url }) => {
  const { companies, locales } = await loadDirectory();
  const origin = site?.origin ?? url.origin;
  const links = companies.flatMap(company => locales.map(locale => `- [${company.title}: ${locale.title}](${origin}/${company.slug}/${locale.code}/llms.txt)`));
  return new Response(`# Docfolk documentation\n\n> Open-source documentation published with Docfolk. Choose a product before integrating; credentials and environments are not interchangeable.\n\n${links.join("\n")}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Access-Control-Allow-Origin": "*" } });
};
