import { Marked, Renderer } from "marked";
import sanitizeHtml from "sanitize-html";
import { renderMermaidSVG } from "beautiful-mermaid";
import type { DocLocale, Heading } from "./types";

const escape = (value: string): string => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

export function renderDocument(body: string, locale: DocLocale): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const renderer = new Renderer();
  renderer.html = ({ text }) => escape(text);
  renderer.heading = function ({ tokens, depth }) {
    const inline = this.parser.parseInline(tokens);
    const text = sanitizeHtml(inline, { allowedTags: [], allowedAttributes: {} });
    const id = `h-${headings.length + 1}`;
    headings.push({ id, text, level: depth });
    return `<h${depth} id="${id}">${inline}</h${depth}>`;
  };
  renderer.code = ({ text, lang }) => {
    const language = (lang ?? "text").split(/\s/)[0]!;
    if (language === "mermaid") {
      const source = `<details><summary>${escape(locale.strings.viewSource ?? "Mermaid source")}</summary><pre><code class="language-mermaid">${escape(text)}</code></pre></details>`;
      try {
        if (text.length > 20000) throw new Error("Diagram source exceeds 20,000 characters");
        const svg = renderMermaidSVG(text, { bg: "#ffffff", fg: "#1d1a15", accent: "#8a5a12", muted: "#625a50", font: "sans-serif", padding: 24 })
          .replace(/@import url\([^)]*\);\s*/g, "");
        const image = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
        return `<figure class="diagram"><figcaption>${escape(locale.strings.diagram ?? "Integration diagram")}</figcaption><div class="diagram-canvas"><img src="${image}" alt="${escape(locale.strings.diagram ?? "Integration diagram")}; ${escape(locale.strings.viewSource ?? "see Mermaid source below")}" loading="lazy" /></div>${source}</figure>`;
      } catch {
        return `<figure class="diagram diagram-error"><figcaption>Diagram could not be rendered. Review the Mermaid source.</figcaption>${source}</figure>`;
      }
    }
    return `<pre><code class="language-${escape(language)}">${escape(text)}</code></pre>`;
  };
  const parser = new Marked({ renderer, gfm: true, breaks: false });
  const html = sanitizeHtml(parser.parse(body, { async: false }), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "details", "summary", "figure", "figcaption"],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["class"],
      h1: ["id"], h2: ["id"], h3: ["id"], h4: ["id"], h5: ["id"], h6: ["id"],
      img: ["src", "alt", "loading", "title"],
      a: ["href", "title", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["https", "data"] },
    allowProtocolRelative: false,
  });
  return { html, headings };
}
