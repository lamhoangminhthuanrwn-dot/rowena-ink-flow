import DOMPurify from "dompurify";
import { marked, Renderer } from "marked";

const renderer = new Renderer();

renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
  const styles: Record<number, string> = {
    1: "font-sans text-2xl font-bold text-foreground mt-10 mb-4",
    2: "font-sans text-xl font-semibold text-foreground mt-10 mb-4",
    3: "font-sans text-lg font-semibold text-foreground mt-8 mb-3",
    4: "font-sans text-base font-semibold text-foreground mt-6 mb-2",
    5: "font-sans text-sm font-semibold text-foreground mt-4 mb-2",
    6: "font-sans text-sm font-medium text-foreground mt-4 mb-2",
  };
  return `<h${depth} class="${styles[depth] || ""}">${text}</h${depth}>`;
};

renderer.paragraph = ({ text }: { text: string }) =>
  `<p class="text-muted-foreground leading-relaxed mb-4">${text}</p>`;

renderer.link = ({ href, text }: { href: string; text: string }) =>
  `<a href="${href}" class="text-primary underline hover:no-underline">${text}</a>`;

renderer.image = ({ href, text }: { href: string; text: string }) =>
  `<img src="${href}" alt="${text}" class="w-full rounded-lg my-6" loading="lazy" />`;

renderer.blockquote = ({ text }: { text: string }) =>
  `<blockquote class="border-l-4 border-primary/40 pl-4 my-4 italic text-muted-foreground">${text}</blockquote>`;

renderer.list = (token) => {
  const tag = token.ordered ? "ol" : "ul";
  const cls = token.ordered
    ? "list-decimal ml-6 my-4 space-y-1.5 text-muted-foreground"
    : "list-disc ml-6 my-4 space-y-1.5 text-muted-foreground";
  const body = token.items.map((item) => renderer.listitem!(item)).join("");
  return `<${tag} class="${cls}">${body}</${tag}>`;
};

renderer.listitem = ({ text }: { text: string }) =>
  `<li class="text-muted-foreground">${text}</li>`;

renderer.code = ({ text, lang }: { text: string; lang?: string }) =>
  `<pre class="bg-muted rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm font-mono text-foreground"${lang ? ` data-lang="${lang}"` : ""}>${text}</code></pre>`;

renderer.codespan = ({ text }: { text: string }) =>
  `<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">${text}</code>`;

renderer.hr = () => `<hr class="my-8 border-border" />`;

renderer.table = ({ header, body }: { header: string; body: string }) =>
  `<div class="overflow-x-auto my-6"><table class="w-full border-collapse text-sm"><thead class="bg-muted">${header}</thead><tbody>${body}</tbody></table></div>`;

renderer.tablerow = ({ text }: { text: string }) =>
  `<tr class="border-b border-border">${text}</tr>`;

renderer.tablecell = ({ text, header }: { text: string; header: boolean }) => {
  const tag = header ? "th" : "td";
  const cls = header
    ? "px-4 py-2 text-left font-semibold text-foreground"
    : "px-4 py-2 text-muted-foreground";
  return `<${tag} class="${cls}">${text}</${tag}>`;
};

renderer.strong = ({ text }: { text: string }) => `<strong>${text}</strong>`;
renderer.em = ({ text }: { text: string }) => `<em>${text}</em>`;
renderer.del = ({ text }: { text: string }) => `<del class="line-through">${text}</del>`;

marked.setOptions({ renderer, gfm: true, breaks: true });

export function formatContent(content: string): string {
  const raw = marked.parse(content) as string;
  return DOMPurify.sanitize(raw, {
    ADD_TAGS: ["img"],
    ADD_ATTR: ["loading", "target", "data-lang"],
  });
}
