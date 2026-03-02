/** Simple markdown-like content formatter */
export function formatContent(content: string): string {
  return content
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (trimmed.startsWith("### ")) return `<h3 class="font-sans text-lg font-semibold text-foreground mt-8 mb-3">${trimmed.slice(4)}</h3>`;
      if (trimmed.startsWith("## ")) return `<h2 class="font-sans text-xl font-semibold text-foreground mt-10 mb-4">${trimmed.slice(3)}</h2>`;
      if (trimmed.startsWith("# ")) return `<h1 class="font-sans text-2xl font-bold text-foreground mt-10 mb-4">${trimmed.slice(2)}</h1>`;
      if (trimmed.startsWith("![")) {
        const match = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
        if (match) return `<img src="${match[2]}" alt="${match[1]}" class="w-full rounded-lg my-6" loading="lazy" />`;
      }
      // Process inline bold and links
      const processed = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary underline hover:no-underline">$1</a>');
      return `<p class="text-muted-foreground leading-relaxed mb-4">${processed}</p>`;
    })
    .join("");
}
