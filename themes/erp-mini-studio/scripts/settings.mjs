import { existsSync } from "node:fs";

// Node loads secrets for the built server too; never expose these through PUBLIC_*.
if (existsSync(".env")) process.loadEnvFile(".env");

export function siteOrigin(value = process.env.EMDASH_SITE_URL ?? "http://localhost:4321", httpsOnly = false) {
  const url = new URL(value);
  const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (url.username || url.password || url.pathname !== "/" || url.search || url.hash ||
      (url.protocol !== "https:" && !(url.protocol === "http:" && loopback && !httpsOnly))) {
    throw new Error("EMDASH_SITE_URL must be an HTTPS origin without credentials, path, query or fragment. HTTP is local-loopback only.");
  }
  return url.origin;
}

export function installationCurrency(value = process.env.ERP_CURRENCY ?? "USD") {
  if (!["USD", "EUR", "GBP", "VND", "JPY"].includes(value)) {
    throw new Error("ERP_CURRENCY must be USD, EUR, GBP, VND or JPY. Do not change an existing installation's currency without migration.");
  }
  return value;
}
