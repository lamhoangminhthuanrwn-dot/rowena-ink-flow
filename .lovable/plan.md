

## Plan: Extend `formatContent` with bullet lists, blockquotes, and inline code

### Changes

**`src/lib/formatContent.ts`** — Enhance the block parser to handle:

1. **Bullet lists** (`- item` or `* item`): Detect blocks where all lines start with `- ` or `* `, wrap in `<ul>` with styled `<li>` elements
2. **Blockquotes** (`> text`): Detect blocks where all lines start with `> `, wrap in a styled `<blockquote>` with left border
3. **Inline code** (`` `code` ``): Add regex replacement for backtick-wrapped text → `<code>` with subtle background styling

The block detection order will be: headings → images → bullet lists → blockquotes → paragraph (with inline processing for bold, links, and code).

No other files need changes — `NewsDetail.tsx` and `AdminPosts.tsx` both already import from this shared utility.

