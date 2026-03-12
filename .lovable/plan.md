

## Plan: Thêm DOMPurify để sanitize HTML trong formatContent

### Vấn đề
`formatContent()` trong `src/lib/formatContent.ts` chuyển markdown thành HTML thuần bằng regex, không sanitize. Dù chỉ admin dùng, đây vẫn là vector XSS (stored XSS nếu content chứa `<script>` hoặc event handler).

### Thay đổi

1. **Cài `dompurify` + `@types/dompurify`**
2. **Sửa `src/lib/formatContent.ts`** — wrap output qua `DOMPurify.sanitize()` trước khi return
3. **Không thay đổi gì ở `AdminPosts.tsx` hay `NewsDetail.tsx`** — sanitize tập trung tại nguồn

```typescript
// formatContent.ts — thêm ở cuối hàm
import DOMPurify from "dompurify";

export function formatContent(content: string): string {
  const raw = content.split("\n\n").map(/* ...existing logic... */).join("");
  return DOMPurify.sanitize(raw, { ADD_TAGS: ["img"], ADD_ATTR: ["loading", "target"] });
}
```

### Tóm tắt
- **1 dependency mới**: `dompurify`
- **1 file sửa**: `src/lib/formatContent.ts`
- Sanitize tập trung, bảo vệ mọi nơi dùng `formatContent`

