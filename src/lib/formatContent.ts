import DOMPurify from "dompurify";

/** Simple markdown-like content formatter */
function processInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">$1</code>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary underline hover:no-underline">$1</a>');
}

export function formatContent(content: string): string {
  return content
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (trimmed.startsWith("### ")) return `<h3 class="font-sans text-lg font-semibold text-foreground mt-8 mb-3">${processInline(trimmed.slice(4))}</h3>`;
      if (trimmed.startsWith("## ")) return `<h2 class="font-sans text-xl font-semibold text-foreground mt-10 mb-4">${processInline(trimmed.slice(3))}</h2>`;
      if (trimmed.startsWith("# ")) return `<h1 class="font-sans text-2xl font-bold text-foreground mt-10 mb-4">${processInline(trimmed.slice(2))}</h1>`;
      if (trimmed.startsWith("![")) {
        const match = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
        if (match) return `<img src="${match[2]}" alt="${match[1]}" class="w-full rounded-lg my-6" loading="lazy" />`;
      }
      // Bullet list
      const lines = trimmed.split("\n");
      if (lines.every((l) => /^[-*] /.test(l.trim()))) {
        const items = lines.map((l) => `<li class="text-muted-foreground">${processInline(l.trim().slice(2))}</li>`).join("");
        return `<ul class="list-disc ml-6 my-4 space-y-1.5 text-muted-foreground">${items}</ul>`;
      }
      // Blockquote
      if (lines.every((l) => l.trim().startsWith("> "))) {
        const inner = lines.map((l) => processInline(l.trim().slice(2))).join("<br/>");
        return `<blockquote class="border-l-4 border-primary/40 pl-4 my-4 italic text-muted-foreground">${inner}</blockquote>`;
      }
      return `<p class="text-muted-foreground leading-relaxed mb-4">${processInline(trimmed)}</p>`;
    })
    .join("");

  return DOMPurify.sanitize(raw, { ADD_TAGS: ["img"], ADD_ATTR: ["loading", "target"] });
}
