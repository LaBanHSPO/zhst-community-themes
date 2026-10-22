export interface Company {
  slug: string;
  title: string;
  description: string;
  sandbox_url: string;
  production_url: string;
  default_language: string;
  accent: string;
  api_version: string;
}

export interface DocLocale {
  code: string;
  title: string;
  api_language: string;
  strings: Record<string, string>;
}

export interface Doc {
  slug: string;
  title: string;
  description: string;
  company: string;
  language: string;
  doc_key: string;
  category: string;
  position: number;
  body: string;
  method?: string;
  path?: string;
  operation?: Record<string, unknown>;
}

export interface Heading { id: string; text: string; level: number }

export interface PortalView {
  company: Company;
  companies: Company[];
  locale: DocLocale;
  locales: DocLocale[];
  docs: Doc[];
  doc: Doc;
  html: string;
  headings: Heading[];
  isFallback: boolean;
  origin: string;
}
