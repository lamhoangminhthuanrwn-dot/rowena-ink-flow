

## Nâng cấp Markdown parser với `marked` + DOMPurify

### Vấn đề hiện tại
`formatContent()` tự viết regex, chỉ hỗ trợ: headings (#/##/###), bold, inline code, links, images, bullet lists, blockquotes. Thiếu: italic, ordered lists, nested lists, code blocks, tables, horizontal rules, strikethrough, mixed block types trong cùng 1 đoạn.

### Giải pháp
Thay thế bằng `marked` (lightweight, output HTML string) + giữ DOMPurify sanitize. Không dùng `react-markdown` vì các consumer hiện tại đều dùng `dangerouslySetInnerHTML` — output HTML string phù hợp hơn, không cần refactor consumer.

### Thay đổi

**1. Cài `marked`** (~40KB)

**2. Viết lại `src/lib/formatContent.ts`**
- Import `marked`, configure với custom renderer để inject Tailwind classes (giữ đúng style hiện tại)
- Headings: font-sans, text sizes, margins
- Links: text-primary underline
- Lists: list-disc, spacing
- Code blocks: bg-muted rounded
- Blockquotes: border-l-4 border-primary/40
- Images: w-full rounded-lg lazy loading
- Paragraphs: text-muted-foreground leading-relaxed
- Pipe output qua DOMPurify.sanitize() như cũ

**3. Không thay đổi consumer** — `NewsDetail.tsx`, `AdminPosts.tsx` giữ nguyên `dangerouslySetInnerHTML={{ __html: formatContent(content) }}`

### Lợi ích
- Hỗ trợ đầy đủ GFM (tables, strikethrough, task lists)
- Ordered lists, nested lists, code fences, horizontal rules
- Xử lý edge cases tốt hơn (mixed inline formatting, nested elements)
- Vẫn giữ nguyên styling và bảo mật DOMPurify

